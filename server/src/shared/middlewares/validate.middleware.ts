// src/shared/middlewares/validate.middleware.ts

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((e) => ({
        field:   e.path.join("."),
        message: e.message,
      }));
      res.status(422).json({ message: "Validation failed", errors });
      return;
    }
    // Replace body with the parsed/coerced version (e.g. default values applied)
    req.body = result.data;
    next();
  };
}