import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const notes = await prisma.note.findMany({
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" }
    ],
  });

  return (
    <div className="page-container">
      
      <div className="home-top-row">
        <h1 className="page-title">Neon Notes</h1>
        <Link href="/new" className="add-note-btn">+</Link>

      </div>

      <p className="page-subtitle">A place for your glowing ideas.</p>

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.length === 0 && (
          <p style={{ opacity: 0.6 }}>No notes yet — create one!</p>
        )}

        {notes.map(note => (
          <div key={note.id} className="note-card neon-hover">
            <h2>{note.title}</h2>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
