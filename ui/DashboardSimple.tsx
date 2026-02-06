"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================
   타입
========================= */
type Mission = {
  id: number;
  title: string;
  description: string;
  detail?: string;
  linkUrl?: string;
  linkLabel?: string;
  links?: {
    label: string;
    url: string;
  }[];
};

/* =========================
   상수
========================= */
const ADMIN_EMAIL = "hyunjin@krafton.com";
const STORAGE_KEY = "onboarding_checked_v1";

/* ✅ 미션별 완료 기한 */
const DEADLINE_BY_ID: Record<number, string> = {
  1: "Day 1 OT로부터 1주일 이내",
  2: "Day 1 OT로부터 1주일 이내",
  3: "Day 1 OT로부터 2주일 이내",
  4: "Day 1 OT로부터 2주일 이내",
  5: "입사 후 2~3개월 시점까지",
  6: "입사 후 2~3개월 시점까지",
  7: "입사 후 2~3개월 시점까지",
};

/* =========================
   미션 데이터
========================= */
const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "KRAFTON에서 첫걸음 내딛기",
    description: "헬프데스크 방문 후 환영 우편물 수령 및 HUB 내 자기소개 업로드하기",
    detail: `✅ 해야 할 일
1) 아래 장소 중 본인의 거점에 맞는 데스크에서 환영 우편물을 수령해요.
2) HUB에 접속해 자기소개 글을 업로드해요.😉

📮 우편물 수령 장소
● 역삼: 34층 헬프데스크 (EAST)
● 서초: 9층 로그인펍지
● 판교: 14층 웰컴데스크

📌 체크 포인트
● 수령 완료 여부
● HUB 자기소개 업로드 완료 여부`,
    linkUrl: "https://hub.krafton.com/community/board/7",
    linkLabel: "HUB 바로가기",
  },
  {
    id: 2,
    title: "신규 입사자를 위한 정보 확인하기",
    description: "AI/HR제도 및 주요 업무 Tool 확인하기",
    detail: `✅ 해야 할 일
1) 본격적인 업무 시작 전, 주요 제도 및 업무 Tool을 확인해 보세요.
2) 업무 효율을 높여줄 AI 지원 제도를 확인하고, 필요한 툴을 신청해 보세요.
3) 법인카드 정산 방법을 미리 확인해 두면, 첫 달 정산이 한결 수월해질 거예요.

📌 체크 포인트
● AI 활용 지원 제도 확인 여부
● HR 주요 제도 확인 여부
● Concur 사용 방법 확인 여부`,
  },
  {
    id: 3,
    title: "크래프톤 알아가기 (참여 학습)",
    description: "윤리강령 및 정보보안 교육 참여하기",
    detail: `✅ 해야 하는 일
1) 윤리강령 및 정보보안 온라인 교육 참여
2) Wiki 선행학습 진행

📌 체크 포인트
● 윤리강령 확인
● 정보보안 가이드 확인`,
  },
  {
    id: 4,
    title: "크래프톤 알아가기 (자가 학습)",
    description: "AI 교육 수강 및 핵심가치 사전 학습하기",
    detail: `✅ 해야 하는 일
1) AI 온라인 교육 1개 이상 수강
2) 핵심가치 사전 학습

📌 체크 포인트
● AI 교육 수강 여부
● 핵심가치 학습 여부`,
  },
  {
    id: 5,
    title: "타운홀 미팅 참여하기",
    description: "KLT/AHM 참여 및 주요 회차 시청하기",
    detail: `✅ 해야 하는 일
1) 타운홀 미팅 참여
2) 주요 회차 시청`,
  },
  {
    id: 6,
    title: "Value-up 세션 참여하기",
    description: "핵심가치 교육 및 대표님과의 대화",
    detail: `✅ 해야 하는 일
1) Value-up 세션 참여
2) 사전 질문 등록`,
  },
  {
    id: 7,
    title: "동료들과 연결되기",
    description: "K-Thanks 나눔 및 입사 동기 교류",
    detail: `✅ 해야 하는 일
1) K-Thanks 작성
2) 입사 동기와 교류`,
  },
];

/* =========================
   UI 컴포넌트
========================= */
type Tab = "Home" | "Mission" | "FAQ";

function Pill({ active, children, onClick }: { active?: boolean; children: any; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid rgba(255,255,255,0.35)",
        background: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.16)",
        color: active ? "#1f2a37" : "white",
        padding: "10px 14px",
        borderRadius: 999,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      {children}
    </button>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div
      style={{
        border: "1px solid #e9eef5",
        borderRadius: 18,
        background: "white",
        padding: 18,
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

/* =========================
   메인 컴포넌트
========================= */
export default function DashboardSimple() {
  const [tab, setTab] = useState<Tab>("Home");
  const [selectedMissionId, setSelectedMissionId] = useState<number>(1);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const selected = useMemo(
    () => MISSIONS.find((m) => m.id === selectedMissionId) ?? MISSIONS[0],
    [selectedMissionId]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fb" }}>
      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: 20 }}>
        {(["Home", "Mission", "FAQ"] as Tab[]).map((t) => (
          <Pill key={t} active={t === tab} onClick={() => setTab(t)}>
            {t}
          </Pill>
        ))}
      </div>

      {/* Mission */}
      {tab === "Home" && (
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Card title="📌 상세 미션 확인하기">
            {/* 제목 */}
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              {selected.id}. {selected.title}
            </div>

            {/* 🔵 미션 완료 기한 (위치 고정) */}
            <div
              style={{
                marginTop: 12,
                marginBottom: 16,
                borderRadius: 16,
                border: "1px solid rgba(15,23,42,0.08)",
                background:
                  "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)",
                boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: 6,
                    background:
                      "linear-gradient(180deg, rgba(37,99,235,1) 0%, rgba(59,130,246,1) 100%)",
                  }}
                />
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: "rgba(37,99,235,0.10)",
                        border: "1px solid rgba(37,99,235,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                      }}
                    >
                      ⏰
                    </div>
                    <div style={{ fontWeight: 900 }}>미션 완료 기한</div>
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#2563eb",
                        background: "rgba(37,99,235,0.10)",
                        border: "1px solid rgba(37,99,235,0.16)",
                        padding: "4px 8px",
                        borderRadius: 999,
                      }}
                    >
                      IMPORTANT
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "#334155" }}>
                    {DEADLINE_BY_ID[selected.id]}
                  </div>
                </div>
              </div>
            </div>

            {/* 해야 하는 일 */}
            <div style={{ lineHeight: 1.7, fontSize: 15, whiteSpace: "pre-line" }}>
              {selected.detail}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
