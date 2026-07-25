export { getActiveSessions, getAllSessions, getSession } from "./sessions";
export { buildTranscript } from "./sessions";
export type { MeetingSession, TranscriptionChunkPayload } from "./types";
/**
 * Poly OpenCode Plugin
 *
 * Auto-connects to Poly's WebSocket server and exposes meeting data
 * as OpenCode tools that agents can call.
 */
export default function PolyPlugin(ctx: any): Promise<{
    tool: {
        poly_list_meetings: {
            description: string;
            execute: () => Promise<{
                meetings: {
                    id: string;
                    title: string;
                    status: "scheduled" | "active" | "paused" | "ended";
                    startedAt: number | undefined;
                }[];
            }>;
        };
        poly_get_transcript: {
            description: string;
            args: {
                meeting_id: {
                    type: string;
                    description: string;
                };
            };
            execute: ({ meeting_id }: {
                meeting_id: string;
            }) => Promise<{
                meeting_id: string;
                transcript: string;
            }>;
        };
        poly_get_meeting_status: {
            description: string;
            execute: () => Promise<{
                hasActiveMeeting: boolean;
                meetings: {
                    id: string;
                    title: string;
                    status: "scheduled" | "active" | "paused" | "ended";
                }[];
            }>;
        };
        poly_get_meeting_context: {
            description: string;
            args: {
                meeting_id: {
                    type: string;
                    description: string;
                };
                max_chunks: {
                    type: string;
                    description: string;
                };
            };
            execute: ({ meeting_id, max_chunks }: {
                meeting_id: string;
                max_chunks?: number;
            }) => Promise<{
                error: string;
                meeting_id?: undefined;
                title?: undefined;
                status?: undefined;
                startedAt?: undefined;
                chunkCount?: undefined;
                recentChunks?: undefined;
            } | {
                meeting_id: string;
                title: string;
                status: "scheduled" | "active" | "paused" | "ended";
                startedAt: number | undefined;
                chunkCount: number;
                recentChunks: {
                    speaker: string;
                    text: string;
                    isFinal: boolean;
                    timestamp: number;
                }[];
                error?: undefined;
            }>;
        };
    };
    event: {
        session: {
            end: () => Promise<void>;
        };
    };
}>;
//# sourceMappingURL=index.d.ts.map