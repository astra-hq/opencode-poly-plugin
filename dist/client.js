"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
exports.disconnect = disconnect;
exports.isConnected = isConnected;
const ws_1 = __importDefault(require("ws"));
const sessions = __importStar(require("./sessions"));
let ws = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
function connect(url) {
    if (ws?.readyState === ws_1.default.OPEN)
        return;
    try {
        ws = new ws_1.default(url);
        ws.on("open", () => {
            reconnectAttempts = 0;
            console.log("[poly] Connected to Poly WebSocket");
        });
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                handleEvent(message);
            }
            catch {
                // ignore parse errors
            }
        });
        ws.on("close", () => {
            console.log("[poly] Disconnected from Poly WebSocket");
            scheduleReconnect(url);
        });
        ws.on("error", (err) => {
            console.error("[poly] WebSocket error:", err.message);
        });
    }
    catch (err) {
        console.error("[poly] Failed to connect:", err);
        scheduleReconnect(url);
    }
}
function disconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (ws) {
        ws.close();
        ws = null;
    }
}
function isConnected() {
    return ws !== null && ws.readyState === ws_1.default.OPEN;
}
function handleEvent(event) {
    switch (event.event) {
        case "meeting.scheduled":
            sessions.onMeetingScheduled(event.data);
            break;
        case "meeting.started":
            sessions.onMeetingStarted(event.data);
            break;
        case "transcription.chunk":
            sessions.onTranscriptionChunk(event.data);
            break;
        case "meeting.paused":
            sessions.onMeetingPaused(event.data);
            break;
        case "meeting.resumed":
            sessions.onMeetingResumed(event.data);
            break;
        case "meeting.ended":
            sessions.onMeetingEnded(event.data);
            break;
    }
}
function scheduleReconnect(url) {
    if (reconnectAttempts >= 10)
        return;
    reconnectAttempts++;
    reconnectTimer = setTimeout(() => {
        connect(url);
    }, 5000);
}
//# sourceMappingURL=client.js.map