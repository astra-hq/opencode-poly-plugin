import { MeetingSession, TranscriptionChunkPayload, MeetingScheduledPayload, MeetingStartedPayload, MeetingEndedPayload, MeetingPausedPayload, MeetingResumedPayload } from "./types";
/**
 * Manages OpenCode sessions mapped to Poly meetings.
 *
 * This is a lightweight in-memory registry. In production you may want to
 * persist sessions to disk or integrate with OpenCode's native session API.
 */
export declare class SessionManager {
    private sessions;
    private opencodeCreateSession;
    constructor(opencodeCreateSession: (name: string, context: string) => Promise<string>);
    /**
     * Called when a meeting is scheduled (upcoming).
     * Pre-creates a session so it's ready when the meeting starts.
     */
    onMeetingScheduled(payload: MeetingScheduledPayload): Promise<void>;
    /**
     * Called when a meeting recording starts.
     * Creates an OpenCode session with the meeting context.
     */
    onMeetingStarted(payload: MeetingStartedPayload): Promise<void>;
    /**
     * Called on each transcription chunk.
     * Accumulates chunks and can push incremental context to the OpenCode session.
     */
    onTranscriptionChunk(payload: TranscriptionChunkPayload): void;
    onMeetingPaused(payload: MeetingPausedPayload): void;
    onMeetingResumed(payload: MeetingResumedPayload): void;
    /**
     * Called when a meeting ends.
     * Finalizes the session context for post-meeting Q&A.
     */
    onMeetingEnded(payload: MeetingEndedPayload): void;
    getSession(meetingId: string): MeetingSession | undefined;
    getActiveSessions(): MeetingSession[];
    getAllSessions(): MeetingSession[];
    clearEndedSessions(): void;
    private buildInitialContext;
    private buildFinalContext;
}
//# sourceMappingURL=session-manager.d.ts.map