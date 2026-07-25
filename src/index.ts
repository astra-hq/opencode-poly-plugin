import * as client from "./client";
import * as sessions from "./sessions";
import {
  polyListMeetings,
  polyGetTranscript,
  polyGetMeetingStatus,
  polyGetMeetingContext,
} from "./tools";

export { getActiveSessions, getAllSessions, getSession } from "./sessions";
export { buildTranscript } from "./sessions";
export type { MeetingSession, TranscriptionChunkPayload } from "./types";

/**
 * Poly OpenCode Plugin
 *
 * Auto-connects to Poly's WebSocket server and exposes meeting data
 * as OpenCode tools that agents can call.
 */
export default async function PolyPlugin(ctx: any) {
  const url = process.env.POLY_WEBSOCKET_URL || "ws://127.0.0.1:9876";

  client.connect(url);

  return {
    tool: {
      poly_list_meetings: polyListMeetings,
      poly_get_transcript: polyGetTranscript,
      poly_get_meeting_status: polyGetMeetingStatus,
      poly_get_meeting_context: polyGetMeetingContext,
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
