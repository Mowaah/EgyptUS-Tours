"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical global app error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#333",
        }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
            Critical Error
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "500px", marginBottom: "2rem" }}>
            The application encountered a critical error and could not load. Please try reloading the page.
          </p>
          <Button variant="primary" onClick={() => reset()}>
            Reload Application
          </Button>
        </div>
      </body>
    </html>
  );
}
