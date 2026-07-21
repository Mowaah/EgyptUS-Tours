"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      padding: "2rem",
      textAlign: "center",
      fontFamily: "var(--font-inter)",
      color: "#333",
    }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        Oops! Something went wrong
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "500px", marginBottom: "2rem" }}>
        We are having trouble connecting to our servers right now. Please try again in a moment.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
