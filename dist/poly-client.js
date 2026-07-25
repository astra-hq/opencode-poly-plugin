"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyWebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
class PolyWebSocketClient {
    ws = null;
    url;
    reconnectInterval;
    maxReconnectAttempts;
    reconnectAttempts = 0;
    reconnectTimer = null;
    callbacks;
    intentionalClose = false;
    constructor(callbacks, options = {}) {
        this.url = options.polyUrl || "ws://127.0.0.1:9876";
        this.reconnectInterval = options.reconnectInterval || 5000;
        this.maxReconnectAttempts = options.maxReconnectAttempts || Infinity;
        this.callbacks = callbacks;
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.intentionalClose = false;
            try {
                this.ws = new ws_1.default(this.url);
                this.ws.on("open", () => {
                    this.reconnectAttempts = 0;
                    this.callbacks.onConnect?.();
                    resolve();
                });
                this.ws.on("message", (data) => {
                    try {
                        const message = JSON.parse(data.toString());
                        this.handleMessage(message);
                    }
                    catch (err) {
                        this.callbacks.onError?.(new Error(`Failed to parse message: ${err}`));
                    }
                });
                this.ws.on("close", () => {
                    this.callbacks.onDisconnect?.();
                    if (!this.intentionalClose) {
                        this.scheduleReconnect();
                    }
                });
                this.ws.on("error", (err) => {
                    this.callbacks.onError?.(err);
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    disconnect() {
        this.intentionalClose = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    isConnected() {
        return this.ws !== null && this.ws.readyState === ws_1.default.OPEN;
    }
    handleMessage(message) {
        switch (message.event) {
            case "meeting.scheduled":
                this.callbacks.onMeetingScheduled?.(message.data);
                break;
            case "meeting.started":
                this.callbacks.onMeetingStarted?.(message.data);
                break;
            case "transcription.chunk":
                this.callbacks.onTranscriptionChunk?.(message.data);
                break;
            case "meeting.paused":
                this.callbacks.onMeetingPaused?.(message.data);
                break;
            case "meeting.resumed":
                this.callbacks.onMeetingResumed?.(message.data);
                break;
            case "meeting.ended":
                this.callbacks.onMeetingEnded?.(message.data);
                break;
            default:
                break;
        }
    }
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.callbacks.onError?.(new Error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached`));
            return;
        }
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => {
            this.connect().catch(() => {
                // Error handled in onError callback
            });
        }, this.reconnectInterval);
    }
}
exports.PolyWebSocketClient = PolyWebSocketClient;
//# sourceMappingURL=poly-client.js.map