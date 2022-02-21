import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    full_name?: string;
    username?: string;
    role?: string;
  }
}

declare module "next-auth" {
  interface User {
    sub?: string;
    full_name?: string;
    username?: string;
    role?: string;
  }

  interface Session {
    user?: Pick<User, "sub" | "full_name" | "username" | "role">;
  }
}
