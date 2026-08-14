"use client";

import { SWRConfig } from "swr";

export function AdminSWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: (error) => {
          // Do not retry on 403 Forbidden or 401 Unauthorized
          if (error?.response?.status === 403 || error?.response?.status === 401) {
            return false;
          }
          return true; // Use default behavior for other errors
        },
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}
