"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyPlugin = void 0;
const poly_client_1 = require("./poly-client");
const session_manager_1 = require("./session-manager");
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
class PolyPlugin {
    client;
    sessionManager;
    connected = false;
    constructor(options = {}) {
        const callbacks = {
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
        this.client = new poly_client_1.PolyWebSocketClient(callbacks, options);
        this.sessionManager = new session_manager_1.SessionManager(async () => {
            throw new Error("Session manager not initialized. Call connect() first.");
        });
    }
    /**
     * Connect to Poly's WebSocket server.
     *
     * @param createSession - Callback to create an OpenCode session.
     *                        Receives (name, context) and should return session ID.
     */
    async connect(createSession) {
        this.sessionManager = new session_manager_1.SessionManager(createSession);
        await this.client.connect();
    }
    disconnect() {
        this.client.disconnect();
        this.connected = false;
    }
    isConnected() {
        return this.connected;
    }
    /** Get a meeting session by ID */
    getSession(meetingId) {
        return this.sessionManager.getSession(meetingId);
    }
    /** Get all currently active (recording) sessions */
    getActiveSessions() {
        return this.sessionManager.getActiveSessions();
    }
    /** Get all sessions (scheduled, active, ended) */
    getAllSessions() {
        return this.sessionManager.getAllSessions();
    }
    /** Clean up ended sessions from memory */
    clearEndedSessions() {
        this.sessionManager.clearEndedSessions();
    }
    /** Get the full transcript for a meeting */
    getTranscript(meetingId) {
        const session = this.sessionManager.getSession(meetingId);
        if (!session)
            return "";
        return session.chunks
            .map((c) => `[${new Date(c.timestamp * 1000).toISOString()}] ${c.speaker}: ${c.text}`)
            .join("\n");
    }
    handleScheduled(payload) {
        this.sessionManager.onMeetingScheduled(payload).catch(() => { });
    }
    handleStarted(payload) {
        this.sessionManager.onMeetingStarted(payload).catch(() => { });
    }
    handleChunk(payload) {
        this.sessionManager.onTranscriptionChunk(payload);
    }
    handlePaused(payload) {
        this.sessionManager.onMeetingPaused(payload);
    }
    handleResumed(payload) {
        this.sessionManager.onMeetingResumed(payload);
    }
    handleEnded(payload) {
        this.sessionManager.onMeetingEnded(payload);
    }
}
exports.PolyPlugin = PolyPlugin;
//# sourceMappingURL=plugin.js.map