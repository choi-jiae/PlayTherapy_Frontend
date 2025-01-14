"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@/utils/AuthContext";
import { CaseInfoProvider } from "@/utils/CaseInfoContext";
import { ScriptProvider } from "@/utils/ScriptContext";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { SessionInfoProvider } from "@/utils/SessionInfoContext";
import { SessionReportProvider } from "@/utils/SessionReportContext";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {isClient && (
            <Router>
              <AuthProvider>
                <CaseInfoProvider>
                  <SessionInfoProvider>
                  <ScriptProvider>
                    <SessionReportProvider>
                    {children}
                    </SessionReportProvider>
                  </ScriptProvider>
                  </SessionInfoProvider>
                </CaseInfoProvider>
              </AuthProvider>
            </Router>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
