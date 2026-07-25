import WebSocket from "ws";
import { PolyEvent, PluginCallbacks, PolyPluginOptions } from "./types";

export class PolyWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private callbacks: PluginCallbacks;
  private intentionalClose = false;

  constructor(callbacks: PluginCallbacks, options: PolyPluginOptions = {}) {
    this.url = options.polyUrl || "ws://127.0.0.1:9876";
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || Infinity;
    this.callbacks = callbacks;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.intentionalClose = false;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.on("open", () => {
          this.reconnectAttempts = 0;
          this.callbacks.onConnect?.();
          resolve();
        });

        this.ws.on("message", (data: WebSocket.RawData) => {
          try {
            const message = JSON.parse(data.toString()) as PolyEvent;
            this.handleMessage(message);
          } catch (err) {
            this.callbacks.onError?.(
              new Error(`Failed to parse message: ${err}`)
            );
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
      } catch (err) {
        reject(err);
      }
    });
  }

  disconnect(): void {
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

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  private handleMessage(message: PolyEvent): void {
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

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.callbacks.onError?.(
        new Error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached`)
      );
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
