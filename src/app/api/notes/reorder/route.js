import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId, direction, pinned } = await request.json();

    if (!noteId || !direction) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const isPinned = Boolean(pinned);

    // Load all notes in this bucket (pinned or not) for this user
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        pinned: isPinned,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "asc" },
      ],
    });

    if (!notes.length) {
      return Response.json({ success: true });
    }

    const currentIndex = notes.findIndex((n) => n.id === noteId);
    if (currentIndex === -1) {
      return Response.json(
        { error: "Note not found in this group" },
        { status: 404 }
      );
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // If out of bounds, just no-op
    if (targetIndex < 0 || targetIndex >= notes.length) {
      return Response.json({ success: true });
    }

    // Rebuild order in memory:
    const reordered = [...notes];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Normalize order: 0,1,2,... within this bucket
    await prisma.$transaction(
      reordered.map((note, index) =>
        prisma.note.update({
          where: { id: note.id },
          data: { order: index },
        })
      )
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Reorder Error:", error);
    return Response.json({ error: "Reorder failed" }, { status: 500 });
  }
}
