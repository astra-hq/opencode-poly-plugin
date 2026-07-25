import * as sessions from "./sessions";

export const polyListMeetings = {
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

export const polyGetTranscript = {
  description: "Get the full transcript for a specific Poly meeting",
  args: {
    meeting_id: {
      type: "string",
      description: "The meeting ID to get the transcript for",
    },
  },
  execute: async ({ meeting_id }: { meeting_id: string }) => {
    const transcript = sessions.buildTranscript(meeting_id);
    return { meeting_id, transcript };
  },
};

export const polyGetMeetingStatus = {
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

export const polyGetMeetingContext = {
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
  execute: async ({ meeting_id, max_chunks = 50 }: { meeting_id: string; max_chunks?: number }) => {
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
