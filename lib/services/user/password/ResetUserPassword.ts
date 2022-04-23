import { prisma } from "@lib/prisma";
import { ResetPasswordInfo } from "@utils/user";
import { hash } from "bcryptjs";
import { generate } from "generate-password";
import { z } from "zod";

export const ResetUserPassword = z
  .function()
  .args(z.string())
  .implement(async (userId) => {
    const newPassword = generate({
      length: 8,
      numbers: true,
      uppercase: true,
      lowercase: false,
    });

    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          password: await hash(newPassword, 12),
        },
      })
      .then<ResetPasswordInfo>((user) => ({
        userId: user.id,
        userName: user.username,
        newPassword,
      }))
      .catch(() => Promise.resolve(null));
  });
