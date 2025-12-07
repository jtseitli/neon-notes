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
      
      {/* Top Row */}
      <div className="home-top-row">
        <h1 className="page-title">Neon Notes</h1>
        <Link href="/new" className="add-note-btn">+</Link>
      </div>

      <p className="page-subtitle">A place for your glowing ideas.</p>

      {/* PINNED SECTION */}
      {notes.some(n => n.pinned) && (
        <div className="pinned-wrapper">
          <h2 className="pinned-title">Pinned</h2>
          <div className="pinned-grid">
            {notes
              .filter(n => n.pinned)
              .slice(0, 3)
              .map(note => (
                <Link
                  key={note.id}
                  href={`/note/${note.id}`}
                  className={`note-card neon-hover theme-${note.theme || "cyan"}`}
                >
                  <h2>{note.title}</h2>
                  <p className="note-content">{note.content}</p>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* OTHER NOTES */}
      <div className="other-notes-section">
        {notes.some(n => !n.pinned) && (
          <h2 className="other-notes-title">All Notes</h2>
        )}

        <div className="notes-grid">
          {notes
            .filter(note => !note.pinned)
            .map(note => (
              <Link
                key={note.id}
                href={`/note/${note.id}`}
                className={`note-card neon-hover theme-${note.theme || "cyan"}`}
              >
                <h3>{note.title}</h3>
                <p className="note-content">{note.content}</p>
              </Link>
            ))}
        </div>
      </div>

    </div>
  );
}
