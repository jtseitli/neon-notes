"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Fetch all notes for the logged-in user
  async function loadNotes() {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) return;
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  // Helper: consistent sort for a group (pinned or not)
  function sortGroup(list) {
    return [...list].sort((a, b) => {
      const ao = a.order ?? 1_000_000;
      const bo = b.order ?? 1_000_000;
      if (ao !== bo) return ao - bo;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  const pinnedNotes = sortGroup(notes.filter((n) => n.pinned));
  const otherNotes = sortGroup(notes.filter((n) => !n.pinned));

  // Move note within pinned or non-pinned group
  async function moveNote(id, direction, isPinned) {
    // Work only inside one group
    const group = isPinned ? pinnedNotes : otherNotes;
    const idx = group.findIndex((n) => n.id === id);
    if (idx === -1) return;

    const targetIndex = direction === "up" ? idx - 1 : idx + 1;
    if (targetIndex < 0 || targetIndex >= group.length) return;

    try {
      await fetch("/api/notes/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: id,
          direction,
          pinned: isPinned,
        }),
      });

      // Reload from server so UI reflects normalized order
      await loadNotes();
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  }

  return (
    <div className="page-container">
      {/*TOP ROW*/}
      <div className="home-top-row">
        <h1 className="page-title">Neon Notes</h1>

        {/*Floating edit*/}
        <div className="fab-wrapper">
          <button
            className="fab edit-btn-fab"
            onClick={() => setEditMode((prev) => !prev)}
          >
            ✎
          </button>

          <Link href="/new" className="fab add-btn-fab">
            +
          </Link>
        </div>
      </div>

      <p className="page-subtitle">A place for your glowing ideas.</p>

      {/* PINNED SECTION */}
      {pinnedNotes.length > 0 && (
        <div className="pinned-section">
          <div className="pinned-wrapper">
            <h2 className="pinned-title">Pinned</h2>

            <div className="pinned-grid">
              {pinnedNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className={`note-card neon-hover theme-${note.theme || "cyan"}`}
                >
                  <Link href={`/note/${note.id}`}>
                    <h2>{note.title}</h2>
                    <p className="note-content">{note.content}</p>
                  </Link>

                  {editMode && (
                    <div className="reorder-controls">
                      <button onClick={() => moveNote(note.id, "up", true)}>
                        ↑
                      </button>
                      <button onClick={() => moveNote(note.id, "down", true)}>
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTHER NOTES */}
      <div className="other-notes-section">
        {otherNotes.length > 0 && (
          <h2 className="other-notes-title">All Notes</h2>
        )}

        <div className="notes-grid">
          {otherNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card neon-hover theme-${note.theme || "cyan"}`}
            >
              <Link href={`/note/${note.id}`}>
                <h3>{note.title}</h3>
                <p className="note-content">{note.content}</p>
              </Link>

              {editMode && (
                <div className="reorder-controls">
                  <button onClick={() => moveNote(note.id, "up", false)}>
                    ↑
                  </button>
                  <button onClick={() => moveNote(note.id, "down", false)}>
                    ↓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
