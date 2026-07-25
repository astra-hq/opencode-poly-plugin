"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = getSession;
exports.getActiveSessions = getActiveSessions;
exports.getAllSessions = getAllSessions;
exports.onMeetingScheduled = onMeetingScheduled;
exports.onMeetingStarted = onMeetingStarted;
exports.onTranscriptionChunk = onTranscriptionChunk;
exports.onMeetingPaused = onMeetingPaused;
exports.onMeetingResumed = onMeetingResumed;
exports.onMeetingEnded = onMeetingEnded;
exports.clearEndedSessions = clearEndedSessions;
exports.buildTranscript = buildTranscript;
const sessions = new Map();
function getSession(meetingId) {
    return sessions.get(meetingId);
}
function getActiveSessions() {
    return Array.from(sessions.values()).filter((s) => s.status === "active" || s.status === "paused");
}
function getAllSessions() {
    return Array.from(sessions.values());
}
function onMeetingScheduled(payload) {
    sessions.set(payload.meeting_id, {
        meetingId: payload.meeting_id,
        title: payload.title,
        startedAt: payload.scheduled_at,
        chunks: [],
        status: "scheduled",
    });
}
function onMeetingStarted(payload) {
    const existing = sessions.get(payload.meeting_id);
    if (existing) {
        existing.status = "active";
        existing.startedAt = payload.started_at;
    }
    else {
        sessions.set(payload.meeting_id, {
            meetingId: payload.meeting_id,
            title: payload.title,
            startedAt: payload.started_at,
            chunks: [],
            status: "active",
        });
    }
}
function onTranscriptionChunk(payload) {
    const session = sessions.get(payload.meeting_id);
    if (!session)
        return;
    session.chunks.push(payload);
}
function onMeetingPaused(payload) {
    const session = sessions.get(payload.meeting_id);
    if (session)
        session.status = "paused";
}
function onMeetingResumed(payload) {
    const session = sessions.get(payload.meeting_id);
    if (session)
        session.status = "active";
}
function onMeetingEnded(payload) {
    const session = sessions.get(payload.meeting_id);
    if (session) {
        session.status = "ended";
        session.endedAt = payload.ended_at;
    }
}
function clearEndedSessions() {
    for (const [id, session] of sessions) {
        if (session.status === "ended") {
            sessions.delete(id);
        }
    }
}
function buildTranscript(meetingId) {
    const session = sessions.get(meetingId);
    if (!session)
        return "";
    return session.chunks
        .map((c) => `[${new Date(c.timestamp * 1000).toISOString()}] ${c.speaker}: ${c.text}`)
        .join("\n");
}
//# sourceMappingURL=sessions.js.map