import { prisma } from "@lib/prisma";
import { Role } from "@utils/user";
import { hash } from "bcryptjs";
import { generate } from "generate-password";
import { z } from "zod";

const RoleEnum = z.enum([Role.ADMIN, Role.USER]);

const CreateUser = z
  .function()
  .args(z.string(), z.string(), RoleEnum)
  .implement(async (username, full_name, role) => {
    const password = generate({
      length: 8,
      numbers: true,
      uppercase: true,
      lowercase: false,
    });

    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password, 12),
        full_name,
        role,
      },
    });

    return {
      userId: user.id,
      username: user.username,
      fullname: user.full_name,
      role: user.role,
      password,
    };
  });

export default CreateUser;
