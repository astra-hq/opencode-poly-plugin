import { PluginCallbacks, PolyPluginOptions } from "./types";
export declare class PolyWebSocketClient {
    private ws;
    private url;
    private reconnectInterval;
    private maxReconnectAttempts;
    private reconnectAttempts;
    private reconnectTimer;
    private callbacks;
    private intentionalClose;
    constructor(callbacks: PluginCallbacks, options?: PolyPluginOptions);
    connect(): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    private handleMessage;
    private scheduleReconnect;
}
//# sourceMappingURL=poly-client.d.ts.map