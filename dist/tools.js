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
Object.defineProperty(exports, "__esModule", { value: true });
exports.polyGetMeetingContext = exports.polyGetMeetingStatus = exports.polyGetTranscript = exports.polyListMeetings = void 0;
const sessions = __importStar(require("./sessions"));
exports.polyListMeetings = {
    description: "List all active Poly meetings with their IDs and titles",
    execute: async () => {
        const active = sessions.getActiveSessions();
        return {
            meetings: active.map((s) => ({
                id: s.meetingId,
                title: s.title,
                status: s.status,
                startedAt: s.startedAt,
            })),
        };
    },
};
exports.polyGetTranscript = {
    description: "Get the full transcript for a specific Poly meeting",
    args: {
        meeting_id: {
            type: "string",
            description: "The meeting ID to get the transcript for",
        },
    },
    execute: async ({ meeting_id }) => {
        const transcript = sessions.buildTranscript(meeting_id);
        return { meeting_id, transcript };
    },
};
exports.polyGetMeetingStatus = {
    description: "Check if there is an active Poly meeting recording",
    execute: async () => {
        const active = sessions.getActiveSessions();
        return {
            hasActiveMeeting: active.length > 0,
            meetings: active.map((s) => ({
                id: s.meetingId,
                title: s.title,
                status: s.status,
            })),
        };
    },
};
exports.polyGetMeetingContext = {
    description: "Get full context (metadata + recent chunks) for a meeting",
    args: {
        meeting_id: {
            type: "string",
            description: "The meeting ID",
        },
        max_chunks: {
            type: "number",
            description: "Maximum recent chunks to include (default: 50)",
        },
    },
    execute: async ({ meeting_id, max_chunks = 50 }) => {
        const session = sessions.getSession(meeting_id);
        if (!session) {
            return { error: "Meeting not found" };
        }
        const recentChunks = session.chunks.slice(-max_chunks);
        return {
            meeting_id,
            title: session.title,
            status: session.status,
            startedAt: session.startedAt,
            chunkCount: session.chunks.length,
            recentChunks: recentChunks.map((c) => ({
                speaker: c.speaker,
                text: c.text,
                isFinal: c.is_final,
                timestamp: c.timestamp,
            })),
        };
    },
};
//# sourceMappingURL=tools.js.map