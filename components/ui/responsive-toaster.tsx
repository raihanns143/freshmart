"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";

export function ResponsiveToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SonnerToaster
      richColors
      position={isMobile ? "bottom-center" : "bottom-right"}
      toastOptions={{
        className: "font-sans",
      }}
    />
  );
}
