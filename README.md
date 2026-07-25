# Poly OpenCode Plugin

Connect OpenCode to [Poly](https://github.com/astra-hq/poly) live meeting transcription.

## What it does

- **Auto-connects** to Poly's WebSocket server (`ws://localhost:9876` by default)
- **Tracks meetings** — scheduled, active, paused, ended
- **Accumulates transcripts** in real-time
- **Exposes OpenCode tools** so agents can query meeting state on demand

## Installation

### Via npm (recommended)

Add to your OpenCode config (`~/.config/opencode/opencode.json` or project `opencode.json`):

```json
{
  "plugin": ["opencode-poly-plugin"]
}
```

OpenCode auto-installs plugins with Bun on startup.

### Via local file

Clone this repo and add to your OpenCode config:

```json
{
  "plugin": ["/path/to/opencode-poly-plugin"]
}
```

### Environment variable

Override the Poly WebSocket URL:

```bash
export POLY_WEBSOCKET_URL=ws://127.0.0.1:9876
```

## Tools exposed to agents

| Tool | Purpose |
|---|---|
| `poly_list_meetings` | List active meetings with IDs and titles |
| `poly_get_transcript` | Get full transcript for a meeting ID |
| `poly_get_meeting_status` | Check if any meeting is currently recording |
| `poly_get_meeting_context` | Get metadata + recent chunks for a meeting |

## Usage in OpenCode

Once installed, OpenCode agents can use these tools naturally:

```
User: "What did we discuss in the standup?"

Agent: [calls poly_list_meetings → finds active meeting]
        [calls poly_get_transcript → returns full transcript]
        "You discussed the Q3 roadmap, decided to prioritize the auth refactor,
        and assigned the API review to Sarah."
```

## Requirements

- Poly desktop app running with WebSocket server enabled (default port 9876)
- OpenCode CLI with plugin support

## License

MIT
