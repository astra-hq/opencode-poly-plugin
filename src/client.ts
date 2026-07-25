import WebSocket from "ws";
import { PolyEvent } from "./types";
import * as sessions from "./sessions";

let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;

export function connect(url: string): void {
  if (ws?.readyState === WebSocket.OPEN) return;

  try {
    ws = new WebSocket(url);

    ws.on("open", () => {
      reconnectAttempts = 0;
      console.log("[poly] Connected to Poly WebSocket");
    });

    ws.on("message", (data: WebSocket.RawData) => {
      try {
        const message = JSON.parse(data.toString()) as PolyEvent;
        handleEvent(message);
      } catch {
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
  } catch (err) {
    console.error("[poly] Failed to connect:", err);
    scheduleReconnect(url);
  }
}

export function disconnect(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function isConnected(): boolean {
  return ws !== null && ws.readyState === WebSocket.OPEN;
}

function handleEvent(event: PolyEvent): void {
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

function scheduleReconnect(url: string): void {
  if (reconnectAttempts >= 10) return;
  reconnectAttempts++;
  reconnectTimer = setTimeout(() => {
    connect(url);
  }, 5000);
}
