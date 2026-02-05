"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardSimple from "@/ui/DashboardSimple";

export default function HomeClient() {
  const sp = useSearchParams();

  const { email, name } = useMemo(() => {
    const e = sp.get("email");
    const n = sp.get("name");
    return {
      email: e ? e.trim() : null,
      name: n ? n.trim() : null,
    };
  }, [sp]);

  return <DashboardSimple email={email} name={name} />;
}