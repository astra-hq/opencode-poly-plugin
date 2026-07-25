/**
 * Type definitions for Poly WebSocket events.
 *
 * These match the JSON protocol emitted by Poly's websocket_server module.
 */

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

export type PolyEvent =
  | { event: "transcription.chunk"; data: TranscriptionChunkPayload }
  | { event: "meeting.scheduled"; data: MeetingScheduledPayload }
  | { event: "meeting.started"; data: MeetingStartedPayload }
  | { event: "meeting.ended"; data: MeetingEndedPayload }
  | { event: "meeting.paused"; data: MeetingPausedPayload }
  | { event: "meeting.resumed"; data: MeetingResumedPayload };

/**
 * Context maintained for an active meeting session.
 */
export interface MeetingSession {
  meetingId: string;
  title: string;
  startedAt: number;
  chunks: TranscriptionChunkPayload[];
  status: "scheduled" | "active" | "paused" | "ended";
  opencodeSessionId?: string;
}

/**
 * Callbacks that the plugin consumer (OpenCode) can register.
 */
export interface PluginCallbacks {
  onMeetingScheduled?: (payload: MeetingScheduledPayload) => void;
  onMeetingStarted?: (payload: MeetingStartedPayload) => void;
  onTranscriptionChunk?: (payload: TranscriptionChunkPayload) => void;
  onMeetingPaused?: (payload: MeetingPausedPayload) => void;
  onMeetingResumed?: (payload: MeetingResumedPayload) => void;
  onMeetingEnded?: (payload: MeetingEndedPayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Options for creating the Poly plugin.
 */
export interface PolyPluginOptions {
  /** Poly WebSocket URL (default: ws://127.0.0.1:9876) */
  polyUrl?: string;
  /** Reconnect interval in ms (default: 5000) */
  reconnectInterval?: number;
  /** Maximum reconnection attempts (default: Infinity) */
  maxReconnectAttempts?: number;
}
