/**
 * Single source of truth for the entrance timeline: whether the session
 * splash plays this load, and how hero delays shift to meet it.
 */

const KEY = "ug-intro-seen";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const alreadySeen = (() => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    // Storage unavailable (private browsing etc.) — fail open, play the splash.
    return false;
  }
})();

/** True iff the splash overlay plays this page load. */
export const introPlaying = !alreadySeen && !prefersReducedMotion;

if (introPlaying) {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Worst case the splash replays next load; never a broken page.
  }
}

/** Seconds after load when the splash is clear enough for hero type to rise. */
export const HANDOFF = 1.0;

/** Hero entrance delays are offsets from curtain-clear when the splash plays. */
export const delay = (offset: number): number =>
  introPlaying ? HANDOFF + offset : offset;
