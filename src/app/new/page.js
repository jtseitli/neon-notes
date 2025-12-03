"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, theme }),
    });

    if (res.ok) {
      router.push("/"); 
    } else {
      console.error("failed to create note");
    }
  }

  return (
    <main className="page-container">
      <h1 className="page-title">Create a Note</h1>

      <form onSubmit={handleSubmit} className="add-note-form">
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
          <option value="">Select a theme (optional)</option>
          <option value="cyan">Cyan</option>
          <option value="pink">Pink</option>
          <option value="purple">Purple</option>
          <option value="lime">Lime</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="blue">Blue</option>
        </select>

        <button type="submit" className="submit-btn">
          Add Note
        </button>
      </form>
    </main>
  );
}
