// app/page.tsx
import DashboardSimple from "@/ui/DashboardSimple";
import { headers } from "next/headers";

export default function Page() {
  const hdrs = headers();

  // 안전하게 헤더를 읽는 유틸 (headers()의 구현 차이 때문에 방어적으로 처리)
  const getHeader = (name: string) => {
    try {
      // headers() in Next.js server has .get()
      if (typeof (hdrs as any).get === "function") {
        const v = (hdrs as any).get(name);
        return v ?? null;
      }
      // fallback: sometimes headers() might be plain object in tests
      return (hdrs as any)[name] ?? null;
    } catch {
      return null;
    }
  };

  const emailRaw = getHeader("x-remote-user") ?? getHeader("x-forwarded-email") ?? null;
  const nameRaw = getHeader("x-user-name") ?? getHeader("x-remote-name") ?? null;

  const email = emailRaw ? String(emailRaw).trim() : null;
  const name = nameRaw ? String(nameRaw).trim() : null;

  // 개발환경에서 바로 확인하려면 아래처럼 하드코드 가능:
  // return <DashboardSimple email={"hyunjin@krafton.com"} name={"Hyunjin"} />;

  return <DashboardSimple email={email} name={name} />;
}
