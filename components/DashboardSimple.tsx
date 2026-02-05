"use client";

export default function DashboardSimple({ email }: { email: string | null }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>🌟 Onboarding Dashboard</h1>
      <p>{email} 님 환영합니다!</p>
    </div>
  );
}
