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
exports.buildTranscript = exports.getSession = exports.getAllSessions = exports.getActiveSessions = void 0;
exports.default = PolyPlugin;
const client = __importStar(require("./client"));
const tools_1 = require("./tools");
var sessions_1 = require("./sessions");
Object.defineProperty(exports, "getActiveSessions", { enumerable: true, get: function () { return sessions_1.getActiveSessions; } });
Object.defineProperty(exports, "getAllSessions", { enumerable: true, get: function () { return sessions_1.getAllSessions; } });
Object.defineProperty(exports, "getSession", { enumerable: true, get: function () { return sessions_1.getSession; } });
var sessions_2 = require("./sessions");
Object.defineProperty(exports, "buildTranscript", { enumerable: true, get: function () { return sessions_2.buildTranscript; } });
/**
 * Poly OpenCode Plugin
 *
 * Auto-connects to Poly's WebSocket server and exposes meeting data
 * as OpenCode tools that agents can call.
 */
async function PolyPlugin(ctx) {
    const url = process.env.POLY_WEBSOCKET_URL || "ws://127.0.0.1:9876";
    client.connect(url);
    return {
        tool: {
            poly_list_meetings: tools_1.polyListMeetings,
            poly_get_transcript: tools_1.polyGetTranscript,
            poly_get_meeting_status: tools_1.polyGetMeetingStatus,
            poly_get_meeting_context: tools_1.polyGetMeetingContext,
        },
        event: {
            session: {
                end: async () => {
                    client.disconnect();
                },
            },
        },
    };
}
//# sourceMappingURL=index.js.map