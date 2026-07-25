import { PolyWebSocketClient } from "./poly-client";
import { SessionManager } from "./session-manager";
import {
  PolyPluginOptions,
  PluginCallbacks,
  MeetingSession,
  TranscriptionChunkPayload,
  MeetingScheduledPayload,
  MeetingStartedPayload,
  MeetingEndedPayload,
  MeetingPausedPayload,
  MeetingResumedPayload,
} from "./types";

/**
 * OpenCode plugin for Poly.
 *
 * Bridges Poly's live meeting events to OpenCode sessions.
 *
 * Usage:
 * ```typescript
 * const plugin = new PolyPlugin({
 *   polyUrl: "ws://127.0.0.1:9876",
 * });
 *
 * await plugin.connect(async (name, context) => {
 *   // OpenCode session creation
 *   return opencode.createSession(name, context);
 * });
 *
 * // Later
 * const session = plugin.getSession(meetingId);
 * ```
 */
export class PolyPlugin {
  private client: PolyWebSocketClient;
  private sessionManager: SessionManager;
  private connected = false;

  constructor(options: PolyPluginOptions = {}) {
    const callbacks: PluginCallbacks = {
      onMeetingScheduled: (p) => this.handleScheduled(p),
      onMeetingStarted: (p) => this.handleStarted(p),
      onTranscriptionChunk: (p) => this.handleChunk(p),
      onMeetingPaused: (p) => this.handlePaused(p),
      onMeetingResumed: (p) => this.handleResumed(p),
      onMeetingEnded: (p) => this.handleEnded(p),
      onConnect: () => {
        this.connected = true;
      },
      onDisconnect: () => {
        this.connected = false;
      },
    };

    this.client = new PolyWebSocketClient(callbacks, options);
    this.sessionManager = new SessionManager(async () => {
      throw new Error("Session manager not initialized. Call connect() first.");
    });
  }

  /**
   * Connect to Poly's WebSocket server.
   *
   * @param createSession - Callback to create an OpenCode session.
   *                        Receives (name, context) and should return session ID.
   */
  async connect(
    createSession: (name: string, context: string) => Promise<string>
  ): Promise<void> {
    this.sessionManager = new SessionManager(createSession);
    await this.client.connect();
  }

  disconnect(): void {
    this.client.disconnect();
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  /** Get a meeting session by ID */
  getSession(meetingId: string): MeetingSession | undefined {
    return this.sessionManager.getSession(meetingId);
  }

  /** Get all currently active (recording) sessions */
  getActiveSessions(): MeetingSession[] {
    return this.sessionManager.getActiveSessions();
  }

  /** Get all sessions (scheduled, active, ended) */
  getAllSessions(): MeetingSession[] {
    return this.sessionManager.getAllSessions();
  }

  /** Clean up ended sessions from memory */
  clearEndedSessions(): void {
    this.sessionManager.clearEndedSessions();
  }

  /** Get the full transcript for a meeting */
  getTranscript(meetingId: string): string {
    const session = this.sessionManager.getSession(meetingId);
    if (!session) return "";
    return session.chunks
      .map((c) => `[${new Date(c.timestamp * 1000).toISOString()}] ${c.speaker}: ${c.text}`)
      .join("\n");
  }

  private handleScheduled(payload: MeetingScheduledPayload): void {
    this.sessionManager.onMeetingScheduled(payload).catch(() => {});
  }

  private handleStarted(payload: MeetingStartedPayload): void {
    this.sessionManager.onMeetingStarted(payload).catch(() => {});
  }

  private handleChunk(payload: TranscriptionChunkPayload): void {
    this.sessionManager.onTranscriptionChunk(payload);
  }

  private handlePaused(payload: MeetingPausedPayload): void {
    this.sessionManager.onMeetingPaused(payload);
  }

  private handleResumed(payload: MeetingResumedPayload): void {
    this.sessionManager.onMeetingResumed(payload);
  }

  private handleEnded(payload: MeetingEndedPayload): void {
    this.sessionManager.onMeetingEnded(payload);
  }
}
