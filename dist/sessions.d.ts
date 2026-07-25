import { MeetingSession, TranscriptionChunkPayload } from "./types";
export declare function getSession(meetingId: string): MeetingSession | undefined;
export declare function getActiveSessions(): MeetingSession[];
export declare function getAllSessions(): MeetingSession[];
export declare function onMeetingScheduled(payload: {
    meeting_id: string;
    title: string;
    scheduled_at: number;
}): void;
export declare function onMeetingStarted(payload: {
    meeting_id: string;
    title: string;
    started_at: number;
}): void;
export declare function onTranscriptionChunk(payload: TranscriptionChunkPayload): void;
export declare function onMeetingPaused(payload: {
    meeting_id: string;
}): void;
export declare function onMeetingResumed(payload: {
    meeting_id: string;
}): void;
export declare function onMeetingEnded(payload: {
    meeting_id: string;
    ended_at: number;
}): void;
export declare function clearEndedSessions(): void;
export declare function buildTranscript(meetingId: string): string;
//# sourceMappingURL=sessions.d.ts.map