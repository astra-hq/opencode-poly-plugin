export declare const polyListMeetings: {
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
export declare const polyGetTranscript: {
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
export declare const polyGetMeetingStatus: {
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
export declare const polyGetMeetingContext: {
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
//# sourceMappingURL=tools.d.ts.map