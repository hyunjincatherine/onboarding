// lib/permissions.ts
export function checkIfLeader(email?: string | null) {
    if (!email) return false;
    const ALLOWED = ["hyunjin@krafton.com", "another.manager@krafton.com"];
    return ALLOWED.includes(email.toLowerCase());
  }
  