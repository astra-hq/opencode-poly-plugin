import { PolyPluginOptions, MeetingSession } from "./types";
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
export declare class PolyPlugin {
    private client;
    private sessionManager;
    private connected;
    constructor(options?: PolyPluginOptions);
    /**
     * Connect to Poly's WebSocket server.
     *
     * @param createSession - Callback to create an OpenCode session.
     *                        Receives (name, context) and should return session ID.
     */
    connect(createSession: (name: string, context: string) => Promise<string>): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    /** Get a meeting session by ID */
    getSession(meetingId: string): MeetingSession | undefined;
    /** Get all currently active (recording) sessions */
    getActiveSessions(): MeetingSession[];
    /** Get all sessions (scheduled, active, ended) */
    getAllSessions(): MeetingSession[];
    /** Clean up ended sessions from memory */
    clearEndedSessions(): void;
    /** Get the full transcript for a meeting */
    getTranscript(meetingId: string): string;
    private handleScheduled;
    private handleStarted;
    private handleChunk;
    private handlePaused;
    private handleResumed;
    private handleEnded;
}
//# sourceMappingURL=plugin.d.ts.map