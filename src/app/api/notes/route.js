import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET – all notes for logged-in user OR single note if ?id=
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json([], { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    // Single note (ensure ownership)
    if (idParam) {
      const note = await prisma.note.findFirst({
        where: {
          id: idParam,
          userId: session.user.id,
        },
      });

      return Response.json(note ? [note] : [], { status: 200 });
    }

    // All notes for this user, ordered by:
    // 1) pinned desc (pinned on top)
    // 2) order asc (our manual ordering)
    // 3) createdAt desc (stable fallback)
    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { pinned: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return Response.json(notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to retrieve notes" },
      { status: 500 }
    );
  }
}

// POST – create note for current user
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newNote = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        theme: body.theme || null,
        pinned: body.pinned || false,
        order: body.order ?? null,
        userId: session.user.id,
      },
    });

    return Response.json(newNote, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// PATCH – update note (only if user owns it)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    const existing = await prisma.note.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: updates,
    });

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE – delete note (only if user owns it)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const existing = await prisma.note.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.note.delete({ where: { id } });

    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
