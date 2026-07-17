"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Smoothly scrolls to a section by its `id`.
 * - If already on the target page, scrolls directly.
 * - If on a different page, navigates to `/#section-id` and
 *   the HomeSectionScroller component handles the scroll after hydration.
 *
 * @param sectionId  The `id` attribute of the target section (without `#`)
 * @param offset     Extra px offset above the element (default 80 for sticky header)
 */
export function useScrollToSection(sectionId: string, offset = 80) {
  const router = useRouter();
  const pathname = usePathname();

  const scrollNow = useCallback(() => {
    const el = document.getElementById(sectionId);
    if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    return true;
  }, [sectionId, offset]);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      const isHome = pathname === "/";
      if (isHome) {
        // Already on home — scroll directly
        scrollNow();
      } else {
        // Navigate to home with hash; HomeSectionScroller picks it up
        router.push(`/#${sectionId}`);
      }
    },
    [pathname, router, sectionId, scrollNow]
  );

  return handleClick;
}
