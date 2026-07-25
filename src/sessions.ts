import { MeetingSession, TranscriptionChunkPayload } from "./types";

const sessions = new Map<string, MeetingSession>();

export function getSession(meetingId: string): MeetingSession | undefined {
  return sessions.get(meetingId);
}

export function getActiveSessions(): MeetingSession[] {
  return Array.from(sessions.values()).filter(
    (s) => s.status === "active" || s.status === "paused"
  );
}

export function getAllSessions(): MeetingSession[] {
  return Array.from(sessions.values());
}

export function onMeetingScheduled(payload: {
  meeting_id: string;
  title: string;
  scheduled_at: number;
}): void {
  sessions.set(payload.meeting_id, {
    meetingId: payload.meeting_id,
    title: payload.title,
    startedAt: payload.scheduled_at,
    chunks: [],
    status: "scheduled",
  });
}

export function onMeetingStarted(payload: {
  meeting_id: string;
  title: string;
  started_at: number;
}): void {
  const existing = sessions.get(payload.meeting_id);
  if (existing) {
    existing.status = "active";
    existing.startedAt = payload.started_at;
  } else {
    sessions.set(payload.meeting_id, {
      meetingId: payload.meeting_id,
      title: payload.title,
      startedAt: payload.started_at,
      chunks: [],
      status: "active",
    });
  }
}

export function onTranscriptionChunk(payload: TranscriptionChunkPayload): void {
  const session = sessions.get(payload.meeting_id);
  if (!session) return;
  session.chunks.push(payload);
}

export function onMeetingPaused(payload: { meeting_id: string }): void {
  const session = sessions.get(payload.meeting_id);
  if (session) session.status = "paused";
}

export function onMeetingResumed(payload: { meeting_id: string }): void {
  const session = sessions.get(payload.meeting_id);
  if (session) session.status = "active";
}

export function onMeetingEnded(payload: { meeting_id: string; ended_at: number }): void {
  const session = sessions.get(payload.meeting_id);
  if (session) {
    session.status = "ended";
    session.endedAt = payload.ended_at;
  }
}

export function clearEndedSessions(): void {
  for (const [id, session] of sessions) {
    if (session.status === "ended") {
      sessions.delete(id);
    }
  }
}

export function buildTranscript(meetingId: string): string {
  const session = sessions.get(meetingId);
  if (!session) return "";
  return session.chunks
    .map((c) => `[${new Date(c.timestamp * 1000).toISOString()}] ${c.speaker}: ${c.text}`)
    .join("\n");
}
