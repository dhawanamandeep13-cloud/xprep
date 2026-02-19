import React from "react";

export const metadata = {
  title: "Xprep | AI Interview Readiness Platform",
  description:
    "Master interviews with AI-powered mock sessions, build ATS-ready resumes, and land your dream job with intelligent career guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
