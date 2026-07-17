"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Placed once in the Home page layout.
 * After hydration, reads `window.location.hash` and smoothly
 * scrolls to the matching section (offset by sticky header height).
 */
export function HomeSectionScroller() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash; // e.g. "#special-offers"
    if (!hash) return;

    const id = hash.slice(1); // strip leading #
    const attempt = (retries = 8) => {
      const el = document.getElementById(id);
      if (el) {
        const HEADER_OFFSET = 80;
        const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: "smooth" });
        // Clean up the hash from the URL without a reload
        history.replaceState(null, "", pathname);
      } else if (retries > 0) {
        // Section not yet mounted — retry after a short delay
        setTimeout(() => attempt(retries - 1), 150);
      }
    };

    // Slight delay so Next.js finishes hydrating the page
    setTimeout(() => attempt(), 200);
  }, [pathname]);

  return null;
}
