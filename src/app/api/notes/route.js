import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam) {
      const note = await prisma.note.findUnique({ where: { id: idParam } });
      return Response.json(note ? [note] : [], { status: 200 });
    }

    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to retrieve notes" }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();

    const newNote = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        theme: body.theme || null,
        pinned: body.pinned || false,
        order: body.order || null,
      },
    });

    return Response.json(newNote, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json({ error: "Failed to create note" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await prisma.note.delete({ where: { id } });

    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updated = await prisma.note.update({
      where: { id },
      data: updates,
    });

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
