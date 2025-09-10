const allowedOrigins = process.env.ORIGINS?.split(',') || [];

export function isAllowedOrigin(origin) {
  if (!origin) return false;
  return allowedOrigins.some((allowed) => origin.includes(allowed));
}