"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendLink = async () => {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    setSent(true);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🎉 Welcome aboard</h2>
      <input
        placeholder="name@bluehole.net"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendLink}>로그인 링크 받기</button>
      {sent && <p>메일 확인해줘!</p>}
    </div>
  );
}
