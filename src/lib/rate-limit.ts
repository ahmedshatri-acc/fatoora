/**
 * Simple in-process rate limiter for Next.js API routes.
 * Uses a sliding-window counter stored in module-level memory.
 * Good enough for Vercel serverless (per-instance isolation is acceptable for auth endpoints).
 * For multi-region production, swap the Map for an Upstash Redis store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries periodically to avoid unbounded memory growth.
let lastPrune = Date.now();
function pruneExpired() {
  const now = Date.now();
  if (now - lastPrune < 60_000) return; // prune at most once per minute
  lastPrune = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  pruneExpired();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + options.windowMs };
    store.set(key, newEntry);
    return { success: true, remaining: options.limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}
