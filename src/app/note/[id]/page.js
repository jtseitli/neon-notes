"use client";

import React, { useState, useEffect } from "react";

export default function EditNotePage({ params }) {
  const { id } = React.use(params);
  const [pinned, setPinned] = useState(false);


  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("");

  // fetch note
  useEffect(() => {
    async function fetchNote() {
      const res = await fetch(`/api/notes?id=${id}`);
      const data = await res.json();
      const n = data[0];

      setNote(n);
      setTitle(n.title);
      setContent(n.content);
      setTheme(n.theme || "");
      setPinned(n.pinned);

    }
    fetchNote();
  }, [id]);

  if (!note) return <div className="page-container">Loading...</div>;

  async function handleSave(e) {
    e.preventDefault();

    const res = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
        content,
        theme,
        pinned,
      }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Failed to save changes");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this note?")) return;

    await fetch(`/api/notes?id=${id}`, {
      method: "DELETE",
    });

    window.location.href = "/";
  }

  return (
    <main className="page-container">
      <h1 className="page-title">Edit Note</h1>

      <form onSubmit={handleSave} className="add-note-form">
        <input
          type="text"
          placeholder="Title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your note..."
          className="textarea-field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <select
          className="select-field"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="">Select theme</option>
          <option value="cyan">Cyan</option>
          <option value="pink">Pink</option>
          <option value="purple">Purple</option>
          <option value="lime">Lime</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="blue">Blue</option>
        </select>

        <label className="pin-toggle">
          <input 
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}/>
          <span>Pin Note</span>
        </label>


        <button type="submit" className="submit-btn">
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="delete-btn"
          style={{ marginTop: "10px" }}
        >
          Delete Note
        </button>
      </form>
    </main>
  );
}
