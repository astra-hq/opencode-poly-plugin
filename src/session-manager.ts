import {
  MeetingSession,
  TranscriptionChunkPayload,
  MeetingScheduledPayload,
  MeetingStartedPayload,
  MeetingEndedPayload,
  MeetingPausedPayload,
  MeetingResumedPayload,
} from "./types";

/**
 * Manages OpenCode sessions mapped to Poly meetings.
 *
 * This is a lightweight in-memory registry. In production you may want to
 * persist sessions to disk or integrate with OpenCode's native session API.
 */
export class SessionManager {
  private sessions = new Map<string, MeetingSession>();
  private opencodeCreateSession: (name: string, context: string) => Promise<string>;

  constructor(
    opencodeCreateSession: (name: string, context: string) => Promise<string>
  ) {
    this.opencodeCreateSession = opencodeCreateSession;
  }

  /**
   * Called when a meeting is scheduled (upcoming).
   * Pre-creates a session so it's ready when the meeting starts.
   */
  async onMeetingScheduled(payload: MeetingScheduledPayload): Promise<void> {
    const session: MeetingSession = {
      meetingId: payload.meeting_id,
      title: payload.title,
      startedAt: payload.scheduled_at,
      chunks: [],
      status: "scheduled",
    };
    this.sessions.set(payload.meeting_id, session);
  }

  /**
   * Called when a meeting recording starts.
   * Creates an OpenCode session with the meeting context.
   */
  async onMeetingStarted(payload: MeetingStartedPayload): Promise<void> {
    let session = this.sessions.get(payload.meeting_id);
    if (!session) {
      session = {
        meetingId: payload.meeting_id,
        title: payload.title,
        startedAt: payload.started_at,
        chunks: [],
        status: "active",
      };
    } else {
      session.status = "active";
      session.startedAt = payload.started_at;
    }

    const context = this.buildInitialContext(session);
    const sessionId = await this.opencodeCreateSession(
      `poly-meeting-${payload.meeting_id}`,
      context
    );
    session.opencodeSessionId = sessionId;
    this.sessions.set(payload.meeting_id, session);
  }

  /**
   * Called on each transcription chunk.
   * Accumulates chunks and can push incremental context to the OpenCode session.
   */
  onTranscriptionChunk(payload: TranscriptionChunkPayload): void {
    const session = this.sessions.get(payload.meeting_id);
    if (!session) return;

    session.chunks.push(payload);

    // Optional: push incremental context to OpenCode session
    // This could be throttled or batched to avoid flooding
    if (payload.is_final && session.opencodeSessionId) {
      // Here you would call an OpenCode API to append context
      // For now we just accumulate locally
    }
  }

  onMeetingPaused(payload: MeetingPausedPayload): void {
    const session = this.sessions.get(payload.meeting_id);
    if (session) {
      session.status = "paused";
    }
  }

  onMeetingResumed(payload: MeetingResumedPayload): void {
    const session = this.sessions.get(payload.meeting_id);
    if (session) {
      session.status = "active";
    }
  }

  /**
   * Called when a meeting ends.
   * Finalizes the session context for post-meeting Q&A.
   */
  onMeetingEnded(payload: MeetingEndedPayload): void {
    const session = this.sessions.get(payload.meeting_id);
    if (!session) return;

    session.status = "ended";

    // Build final context with full transcript for Q&A
    const fullContext = this.buildFinalContext(session);

    // Optionally push final context to OpenCode session
    if (session.opencodeSessionId) {
      // OpenCode API call to update session context
    }
  }

  getSession(meetingId: string): MeetingSession | undefined {
    return this.sessions.get(meetingId);
  }

  getActiveSessions(): MeetingSession[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.status === "active" || s.status === "paused"
    );
  }

  getAllSessions(): MeetingSession[] {
    return Array.from(this.sessions.values());
  }

  clearEndedSessions(): void {
    for (const [id, session] of this.sessions) {
      if (session.status === "ended") {
        this.sessions.delete(id);
      }
    }
  }

  private buildInitialContext(session: MeetingSession): string {
    return `Meeting: ${session.title}\nStatus: Starting\n\nLive transcription will be appended.`;
  }

  private buildFinalContext(session: MeetingSession): string {
    const transcript = session.chunks
      .map((c) => `[${new Date(c.timestamp * 1000).toISOString()}] ${c.speaker}: ${c.text}`)
      .join("\n");

    return `Meeting: ${session.title}\nStatus: Ended\n\nTranscript:\n${transcript}`;
  }
}
