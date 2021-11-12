import { prisma } from "@lib/prisma";
import { hash } from "bcryptjs";
import { generate } from "generate-password";

export default async function CreateUser() {
  const newPassword = generate({
    length: 8,
    numbers: true,
    uppercase: true,
    lowercase: false,
  });

  await prisma.user.create({
    data: {
      username: "kbraquin",
      password: await hash(newPassword, 12),
      full_name: "Kilian Braquin-Mitel",
    },
  });
}
