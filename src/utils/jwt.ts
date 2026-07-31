import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";

export function generateToken(userId: string, role: Role) {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
}