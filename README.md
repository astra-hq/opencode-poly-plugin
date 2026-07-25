# OpenCode Poly Plugin

Connect OpenCode to [Poly](https://github.com/astra-hq/poly) live meeting transcription.

## What it does

- Listens to Poly's WebSocket server (`ws://localhost:9876` by default)
- Creates OpenCode sessions for each meeting
- Ingests live transcription chunks into session context
- Enables post-meeting Q&A about the session

## Events handled

| Poly Event | Plugin Action |
|---|---|
| `meeting.scheduled` | Pre-create session, prepare context |
| `meeting.started` | Create OpenCode session with meeting context |
| `transcription.chunk` | Append chunk to session transcript |
| `meeting.paused` / `meeting.resumed` | Update session status |
| `meeting.ended` | Finalize session with full transcript |

## Installation

```bash
npm install opencode-poly-plugin
```

## Usage

```typescript
import { PolyPlugin } from "opencode-poly-plugin";

const plugin = new PolyPlugin({
  polyUrl: "ws://127.0.0.1:9876",
});

await plugin.connect(async (name, context) => {
  // Create an OpenCode session for this meeting
  const session = await opencode.createSession(name, context);
  return session.id;
});

// Later: get transcript for a meeting
const transcript = plugin.getTranscript(meetingId);
```

## Requirements

- Poly desktop app running with WebSocket server enabled (default port 9876)
- Node.js 18+

## License

MIT
