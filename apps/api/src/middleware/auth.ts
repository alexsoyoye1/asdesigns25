import { NextFunction, Request, Response } from "express";
import { verifyAccess } from "../auth/jwt";

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const raw = req.cookies?.access_token as string | undefined;
  if (!raw) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  try {
    const payload = verifyAccess(raw);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }
}

export function rolesRequired(...roles: Array<"admin" | "employee">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role?: string } | undefined;
    if (!user || !roles.includes(user.role as any)) {
      return res.status(403).json({ ok: false, error: "FORBIDDEN" });
    }
    next();
  };
}
