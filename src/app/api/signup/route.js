import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return Response.json({ success: true, user: { id: newUser.id, email: newUser.email } }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
