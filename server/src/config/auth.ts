// config/auth.ts

import ms, { type StringValue } from "ms";

export const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRY ?? "15m") as StringValue;
export const REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY ?? "30d") as StringValue;

export const ACCESS_MAX_AGE = ms(ACCESS_EXPIRY);
export const REFRESH_MAX_AGE = ms(REFRESH_EXPIRY);