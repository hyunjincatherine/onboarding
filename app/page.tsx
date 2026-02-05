import { Suspense } from "react";
import HomeClient from "./HomeClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
