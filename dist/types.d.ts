export interface TranscriptionChunkPayload {
    meeting_id: string;
    meeting_title: string;
    speaker: string;
    text: string;
    is_final: boolean;
    timestamp: number;
    chunk_index: number;
}
export interface MeetingScheduledPayload {
    meeting_id: string;
    title: string;
    scheduled_at: number;
    starts_in_minutes: number;
}
export interface MeetingStartedPayload {
    meeting_id: string;
    title: string;
    started_at: number;
}
export interface MeetingEndedPayload {
    meeting_id: string;
    ended_at: number;
    has_summary: boolean;
}
export interface MeetingPausedPayload {
    meeting_id: string;
    paused_at: number;
}
export interface MeetingResumedPayload {
    meeting_id: string;
    resumed_at: number;
}
export type PolyEvent = {
    event: "transcription.chunk";
    data: TranscriptionChunkPayload;
} | {
    event: "meeting.scheduled";
    data: MeetingScheduledPayload;
} | {
    event: "meeting.started";
    data: MeetingStartedPayload;
} | {
    event: "meeting.ended";
    data: MeetingEndedPayload;
} | {
    event: "meeting.paused";
    data: MeetingPausedPayload;
} | {
    event: "meeting.resumed";
    data: MeetingResumedPayload;
};
export interface MeetingSession {
    meetingId: string;
    title: string;
    startedAt?: number;
    endedAt?: number;
    chunks: TranscriptionChunkPayload[];
    status: "scheduled" | "active" | "paused" | "ended";
}
//# sourceMappingURL=types.d.ts.map