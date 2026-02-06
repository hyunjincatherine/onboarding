"use client";

import { useEffect, useMemo, useState } from "react";
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
const todayStr = new Date().toISOString().split("T")[0];
const DEADLINE_BY_ID: Record<number, string> = {
  1: "OT 이후 1주일 이내",
  2: "OT 이후 1주일 이내",
  3: "OT 이후 2주일 이내",
  4: "OT 이후 2주일 이내",
  5: "OT 이후 2~3개월 이내",
  6: "OT 이후 2~3개월 이내",
  7: "OT 이후 2~3개월 이내",
};
const FAQ_ITEMS = [
  {
    q: "Q1. 온보딩 기간은 언제부터 계산하면 될까요?",
    a: "입사 첫날 진행되는 Day 1 Orientation이 시작점이에요. 담당자가 시기에 맞춰 가이드를 드릴 예정이니, 직접 계산하며 부담 갖지 않으셔도 괜찮습니다. 저희가 꼼꼼히 챙겨드릴게요!",
  },
  {
    q: "Q2. 업무 일정 때문에 교육 참석이 어려운데 어떻게 해야 하나요?",
    a: "업무가 우선인 상황이라면 당연히 조정 가능합니다. 담당자에게 미리 사유를 알려주시면, 다음 분기 교육으로 입과 일정을 변경해 드릴게요.",
  },
  {
    q: "Q3. 온보딩 선물은 언제 받을 수 있나요? 🎁",
    a: "온보딩 과정을 모두 완주하시면, 수료 시점에 맞춰 각 거점의 헬프데스크로 선물을 보내드려요. 마지막 미션까지 즐겁게 임해주세요!",
  },
  {
    q: "Q4. Workday에 수료증 업로드 태스크가 계속 떠 있는데, 무시해도 되나요?",
    a: "네, 괜찮습니다! 수료증은 입사 3개월 후 모든 프로세스가 종료되어야 발급됩니다. 그전까지 Workday에 표시되는 마감 날짜는 신경 쓰지 마시고 편하게 넘겨주시면 됩니다.",
  },
  {
    q: "Q5. 수료증은 실물로 받게 되나요?",
    a: "수료증은 PDF 전자 파일로 전달해 드립니다. 파일을 받으신 후 Workday에 업로드해 주시면 모든 절차가 최종 완료됩니다.",
  },
  {
    q: "Q6. '창한님과의 만남' 오프라인 참석도 가능한가요?",
    a: "현장 강의장의 수용 인원이 제한되어 있어, 아쉽게도 선착순으로 마감될 예정입니다. 현장 참석을 희망하신다면 입과 안내문을 보내드릴 때 빠르게 신청해 주시기를 추천드려요!",
  },
  {
    q: "Q7. '창한님과의 만남' 참석을 못 할 경우 녹화본은 제공되나요?",
    a: "녹화본은 따로 제공되지 않지만, 걱정 마세요! Wiki에 모든 Q&A 내용을 기록해 공유해 드릴 예정이니 언제든 확인하실 수 있습니다.",
  },
  {
    q: "Q8. 핵심가치 교육 자료를 따로 소장할 수 있을까요?",
    a: "그럼요! 교육 종료 일주일 후에 담당자가 리마인드 학습 자료를 보내드립니다. 참고가 필요할 때마다 유용하게 활용해 보세요.",
  },
  {
    q: "Q9. 온보딩을 수료하지 않으면 불이익이 있나요?",
    a: "별도의 불이익은 없습니다. 다만, 온보딩 미션들은 여러분이 조직에 더 잘 적응하실 수 있도록 돕는 필수 정보들을 담고 있습니다. 성공적인 안착을 위해 수료하시는 것을 적극 권장해 드립니다.",
  },
  {
    q: "Q10. 온보딩 프로그램 대상자는 누구인가요?",
    a: "KRAFTON HQ와 PUBG STUDIOS의 모든 구성원이 대상입니다. (정규직, 계약직, 인턴, 전문계약직 포함) 우리 함께 즐거운 온보딩 여정을 만들어가요!",
  },
] as const;




type Mission = {
  id: number;
  title: string;
  description: string; // 리스트용 짧은 설명
  detail?: string; // 우측 카드용 긴 설명
  linkUrl?: string; // (기존 1개 링크용 – 유지)
  linkLabel?: string;
  links?: {
    label: string;
    url: string;
  }[];
};

const ADMIN_EMAIL = "hyunjin@krafton.com";
const STORAGE_KEY = "onboarding_checked_v1";

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
● HUB 자기소개 업로드 완료 여부
`,
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
   (먼저 살펴본 후, 정산 시점에 다시 한번 체크해 보시는 것을 추천드려요!)

📌 체크 포인트
● AI 활용 지원 제도 확인 여부
● HR 주요 제도 (🌟중요: 수습평가 제도) 확인 여부
● Concur 사용 방법 (법인카드 정산) 확인 여부
`,
    links: [
      {
        label: "AI 제도 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/KRAFTONAI/pages/777519165/KRAFTON+AI",
      },
      {
        label: "수습평가 제도 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/HRGuide/pages/582812536",
      },
      {
        label: "Concur 법인카드 정산 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/KPolicies/pages/122357474/NextGen+UI+Expense+Guide#tab-c0834ac0-a8e6-44d1-9202-8c21ac4ba566",
      },
      {
        label: "Kissflow 가이드 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/ASKFINANCE/pages/206544803/1.+Kissflow+New+Version+Overview",
      },
    ],
  },
  {
    id: 3,
    title: "크래프톤 알아가기 (참여 학습)",
    description: "윤리강령 및 정보보안 교육 참여하기",
    detail: `✅ 해야 하는 일
1) 입사일자가 속한 달의 다음 달 1~2번째 주 금요일(별도 공지 예정)에 윤리강령과 관련 제도에 대한 온라인 교육이 예정되어 있습니다.
2) 입과 전 Wiki를 통해 선행학습을 진행해 주세요.

📌 체크 포인트
● 윤리강령과 관련 제도 확인 여부
● 정보 보안 가이드 확인 여부
● 온라인(Teams) 교육 참여 여부
`,
    links: [
      {
        label: "윤리강령 제도 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/onboarding/pages/114524295",
      },
      {
        label: "정보보안 가이드 바로가기",
        url: "https://krafton.atlassian.net/wiki/spaces/onboarding/pages/114554003",
      },
    ],
  },
  {
    id: 4,
    title: "크래프톤 알아가기 (자가 학습)",
    description: "AI 교육 수강 및 핵심가치 사전 학습하기",
    detail: `✅ 해야 하는 일
1) 모든 구성원이 AI 시대를 리드할 수 있도록 다양한 온라인 학습 기회를 지원합니다. 스스로의 AI 활용 방안을 모색하며 변화를 경험해 보세요.
2) 온라인 강의장에 접속하여, 본인에게 필요한 강의 최소 1개 이상 수강해 주세요.
3) 핵심가치는 크래프톤 업무의 근간이 되는 중요한 기준입니다.
4) 이어지는 Value-up 세션에서 더욱 깊이 있는 대화를 나누기 위해 미리 학습해 주시기 바랍니다.

📌 체크 포인트
● AI 온라인 교육 1개 이상 수강 여부
● 핵심가치 사전 학습자료 확인 여부
`,
    links: [
      {
        label: "AI 교육 지원 제도 확인하기",
        url: "https://krafton.atlassian.net/wiki/spaces/HRGuide/pages/745926419/26+AI",
      },
      {
        label: "FastCampus 온라인 강의장 입장하기",
        url: "https://krafton.skillflo.io",
      },
      {
        label: "InfLearn 온라인 강의장 입장하기",
        url: "https://inf.run/krafton",
      },
      {
        label: "핵심가치 학습자료 살펴보기",
        url: "https://krafton.atlassian.net/wiki/spaces/onboarding/pages/114557302/Value-up",
      },
    ],
  },
  {
    id: 5,
    title: "타운홀 미팅 참여하기",
    description: "KLT/AHM 참여 및 주요 회차 시청하기",
    detail: `🗓️ 타운홀 미팅 일정
• KLT (Krafton Live Talk): 매월 세 번째 목요일 ✨
• AHM (PUBG: All Hands Meeting): 매월 네 번째 수요일 🌟
• 경영진과 모든 구성원이 한자리에 모여 회사의 주요 소식을 투명하게 공유하고,
  궁금한 점을 가감 없이 묻고 답하는 소중한 시간입니다.

✅ 해야 하는 일
1) 온·오프라인 중 편한 방법으로 참여해 주세요!
2) 세션을 기다리는 동안 지난 주요 회차를 미리 시청해 보시면
   크래프톤의 흐름을 파악하는 데 큰 도움이 됩니다.

📌 체크 포인트
● KLT/AHM 참여 여부
● 주요 회차 시청 여부
`,
    links: [
      {
        label: "KLT 주요 회차 시청하기",
        url: "https://krafton.atlassian.net/wiki/spaces/onboarding/pages/114556106/KLT",
      },
      {
        label: "AHM 주요 회차 시청하기",
        url: "https://krafton.atlassian.net/wiki/spaces/PUBG/pages/54573048/2025+All-Hands+Meeting",
      },
    ],
  },
  {
    id: 6,
    title: "Value-up 세션 참여하기",
    description: "크래프톤 핵심가치 이해 및 창한님과의 Q&A 세션 참여하기",
    detail: `📍 Value-up 세션 구성
● 핵심가치 교육: 우리의 일하는 기준을 학습합니다.
● 창한님과의 만남: 대표님과 직접 대화하며 비전을 공유합니다.

✅ 해야 하는 일
1) 입과 안내를 받으시면 일정 수락/거절을 선택해 주세요.
2) ‘창한님과의 만남’을 위해 평소 궁금했던 질문을 미리 등록해 주세요. (추후 안내 예정)
3) 부득이한 사유로 참석이 어려울 경우, 반드시 담당자에게 사유를 전달해 주세요.
4) 온·오프라인 중 편한 방법으로 참여해 주시면 끝 🌟

📌 체크 포인트
● 핵심가치 교육 참여 여부
● 창한님과의 만남 참여 여부
`,
    links: [
      {
        label: "Value-up 세션 알아보기",
        url: "https://krafton.atlassian.net/wiki/spaces/onboarding/pages/114557302/Value-up",
      },
    ],
  },
  {
    id: 7,
    title: "동료들과 연결되기",
    description: "K-Thanks 나눔 및 입사 동기와의 교류하기",
    detail: `✅ 해야 하는 일
1) 온보딩 과정에서 도움을 준 동료가 있다면 K-Thanks로 고마움을 표현해 보세요!
   (작성하신 분과 받으신 분 모두에게 커피 쿠폰을 드립니다☕)
2) 함께 입사한 입사 동기분들과 즐거운 티타임 혹은 식사 자리를 마련해 보세요.
3) K-Thanks 작성 및 동기 모임 이후, 반드시 아래의 Form을 작성해 주셔야 인정됩니다.

※ 동기 모임은 대표 1인만 Form을 제출해 주셔도 무방합니다.

📌 체크 포인트
● K-Thanks 게시글 업로드 여부
● 동기와의 만남 여부
`,
    links: [
      {
        label: "K-Thanks 작성하기",
        url: "https://hub.krafton.com/community/kthanks",
      },
      {
        label: "미션 인증하기 (Form 작성)",
        url: "https://forms.office.com/Pages/ResponsePage.aspx?id=v70nGszmM06F0uHIG62TChqAzdmdRHpEtRKyxA5x1oVUNloyMFhTTlNPQjM0MDUxT0JHN0NaVEY2UyQlQCN0PWcu",
      },
    ],
  },
];

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

export default function DashboardSimple({
  email,
  name,
}: {
  email: string | null;
  name?: string | null;
}) {
  const TABS: Tab[] = ["Home", "Mission", "FAQ"];

  const [tab, setTab] = useState<Tab>("Home");
  const [selectedMissionId, setSelectedMissionId] = useState<number>(1);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
// ✅ 이름 + OT 날짜 입력용 state
const [profile, setProfile] = useState<{
  fullName: string;
  otDate: string;
}>({
  fullName: "",
  otDate: "",
});

  // ✅ 로컬 저장된 체크 상태 복원
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const selected = useMemo(
    () => MISSIONS.find((m) => m.id === selectedMissionId) ?? MISSIONS[0],
    [selectedMissionId]
  );

  const doneCount = Object.values(checked).filter(Boolean).length;
  const nextMission = Math.min(MISSIONS.length, doneCount + 1);

  function formatNameFromEmail(emailStr: string) {
    const local = emailStr.split("@")[0];
    const replaced = local.replace(/[._]/g, " ").trim();
    const parts = replaced.split(" ").filter(Boolean);
    return parts
      .map((p) => (/[a-zA-Z]/.test(p[0]) ? p.charAt(0).toUpperCase() + p.slice(1) : p))
      .join(" ");
  }

  const displayName = name ?? (email ? formatNameFromEmail(email) : "새로운 동료");

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fb" }}>
      {/* Header */}
      <div
        style={{
          padding: "46px 18px 22px",
          background: "linear-gradient(180deg, #0b0b0b 0%, #000000 100%)",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 0.2 }}>
              🎉 Hello, KRAFTON 신규 입사자 온보딩 프로그램
            </div>
            <div style={{ marginTop: 8, opacity: 0.92, fontSize: 18, fontWeight: 600 }}>
              입사를 진심으로 축하드립니다. 아래 페이지를 참고하시어 원활한 온보딩 경험이 되시길 바랍니다.
            </div>
            <div style={{ marginTop: 6, opacity: 0.82, fontSize: 15 }}>
              💌PoC: 강현진 of Learning & Value Team
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <Pill key={t} active={t === tab} onClick={() => setTab(t)}>
                {t}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 18px 38px" }}>
        {/* ✅ HOME: 4칸 바둑판 + (미션 목록 옆에 디테일) */}
        {tab === "Home" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr", gap: 16, alignItems: "start" }}>
            {/* 1) 입사자 카드 */}
            <Card title="🙋‍♀️ 입사자">
              <div style={{ display: "grid", gap: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f2f6ff",
                    border: "1px solid #dde7ff",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div>
                    <b>온보딩 미션 보드 확인하기</b>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>
                      온보딩 프로그램의 전체 흐름을 먼저 확인해 보세요.
                    </div>
                  </div>
                  <button
                    onClick={() => setTab("Mission")}
                    style={{
                      border: "none",
                      background: "#5a8cff",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    확인 →
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f7fbff",
                    border: "1px solid #dbeafe",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div>
                    <b>FAQ: 자주 묻는 질문 확인하기</b>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>온보딩 과정에서 궁금한 점을 확인해 보세요.</div>
                  </div>
                  <button
                    onClick={() => setTab("FAQ")}
                    style={{
                      border: "none",
                      background: "#2b8a6e",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    확인 →
                  </button>
                </div>

                <div style={{ padding: 12, borderRadius: 14, background: "#fff7ed", border: "1px solid #fed7aa" }}>
                  💡 Tip: 하루에 1~2개씩만 끝내도 첫 주 온보딩이 훨씬 편해져요 🙂
                </div>
              </div>
            </Card>

            {/* 2) 매뉴얼 카드 */}
<Card title="🧑‍💼 내 온보딩 추천">
  <div style={{ display: "grid", gap: 12 }}>
    {/* 입력 영역 */}
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>이름</div>
        <input
          value={profile.fullName}
          onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
          placeholder="예: 강현진"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            outline: "none",
            background: "white",
            fontSize: 14,
            fontWeight: 700,
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>OT(Orientation) 날짜</div>
        <input
          type="date"
          value={profile.otDate}
          onChange={(e) => setProfile((p) => ({ ...p, otDate: e.target.value }))}
          max={todayStr}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            outline: "none",
            background: "white",
            fontSize: 14,
            fontWeight: 700,
          }}
        />
      </div>
    </div>

    {/* 추천/예상 수료 박스 */}
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(37,99,235,0.22)",
        background: "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,1) 100%)",
        boxShadow: "0 10px 26px rgba(37,99,235,0.12)",
        padding: 14,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
          }}
        >
          ✨
        </div>
        <div style={{ fontWeight: 900, color: "#1e3a8a" }}>오늘의 추천</div>
      </div>

      <div style={{ fontWeight: 900, color: "#1e3a8a", lineHeight: 1.4 }}>
      {(profile.fullName || displayName)}님, 지금은{" "}
      <span style={{ color: "#1d4ed8" }}>미션 {nextMission}</span>를 수행할 시점이에요.
      </div>

      <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
        추천 미션: <b>{recommendedMission.title}</b>
      </div>

      <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
        예상 수료 시점:{" "}
        <b>{expectedCompleteDate ? expectedCompleteDate.toLocaleDateString() : "OT 날짜를 입력하면 계산돼요"}</b>
      </div>

      <div style={{ fontSize: 12, opacity: 0.75 }}>
        * 완료 체크 상태(done) + OT 날짜를 함께 반영해 추천이 업데이트돼요.
      </div>
    </div>
  </div>
</Card>


            {/* 3) 미션 목록 */}
            <Card title={`✅ 미션 목록 (진행률 ${doneCount}/${MISSIONS.length})`}>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 10 }}>
    🖱️ 미션을 클릭하면 우측에서 상세 내용을 확인할 수 있어요.
  </div>
              <div style={{ display: "grid", gap: 10 }}>
                {MISSIONS.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid #e9eef5",
                      background: m.id === selectedMissionId ? "#f6f7ff" : "white",
                    }}
                  >
                    <button
                      onClick={() => setSelectedMissionId(m.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        flex: 1,
                        paddingRight: 10,
                      }}
                    >
                      <b>
                        {m.id}. {m.title}
                      </b>
                      <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{m.description}</div>
                    </button>

                    <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={!!checked[m.id]}
                        onChange={(e) => {
                          const newChecked = { ...checked, [m.id]: e.target.checked };
                          setChecked(newChecked);
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(newChecked));
                        }}
                      />
                      완료
                    </label>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: "1px dashed #e5e7eb",
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}
              >
                👉 미션 수행여부를 체크해 보세요. <br />
                All Clear 시 우측에 <b>담당자에게 알림을 보낼 수 있는 링크</b>가 나타납니다!
              </div>
            </Card>

             {/* 4) 선택한 미션 상세 */}
             <Card title="📌 상세 미션 확인하기">
              <div style={{ fontSize: 22, fontWeight: 900 }}>
                {selected.id}. {selected.title}
              </div>

              {/* ===== 여기서부터: 기한 박스 (제목과 해야하는 일 사이) ===== */}
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                  border: "1px solid rgba(37,99,235,0.22)",
                  background: "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,1) 100%)",
                  boxShadow: "0 10px 26px rgba(37,99,235,0.12)",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex" }}>
                  {/* 왼쪽 포인트 바 */}
                  <div
                    style={{
                      width: 7,
                      background: "linear-gradient(180deg, #2563eb 0%, #3b82f6 100%)",
                    }}
                  />

                  <div style={{ padding: "12px 14px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          background: "rgba(37,99,235,0.15)",
                          border: "1px solid rgba(37,99,235,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                        }}
                      >
                        ⏰
                      </div>

                      <div style={{ fontWeight: 900, color: "#1e3a8a" }}>미션 완료 기한</div>

                      <div
                        style={{
                          marginLeft: "auto",
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#1d4ed8",
                          background: "rgba(37,99,235,0.15)",
                          border: "1px solid rgba(37,99,235,0.25)",
                          padding: "4px 10px",
                          borderRadius: 999,
                        }}
                      >
                        ESSENTIAL
                      </div>
                    </div>

                    <div style={{ marginTop: 8, fontSize: 14, color: "#1e3a8a" }}>
                      <b>{DEADLINE_BY_ID[selected.id]}</b>
                                          </div>
                  </div>
                </div>
              </div>
              {/* ===== 기한 박스 끝 ===== */}
              <div style={{ marginTop: 10, lineHeight: 1.7, fontSize: 15, whiteSpace: "pre-line" }}>
                {selected.detail ?? selected.description}
              </div>

              {selected.linkUrl && (
                <a
                  href={selected.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 14,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontWeight: 800,
                    textDecoration: "none",
                    color: "#111827",
                  }}
                >
                  🔗 {selected.linkLabel ?? "관련 링크"}
                </a>
              )}

              {selected.links && selected.links.length > 0 && (
                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  {selected.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                        width: "fit-content",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                        fontWeight: 800,
                        textDecoration: "none",
                        color: "#111827",
                      }}
                    >
                      🔗 {l.label}
                    </a>
                  ))}
                </div>
              )}

              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 14,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  display: "grid",
                  gap: 10,
                }}
              >
                {doneCount >= MISSIONS.length ? (
                  <>
                    <div style={{ fontWeight: 500 }}>
                      <div>미션 ALL CLEAR!🎉 정말 고생 많으셨어요.</div>
                      <div>담당자에게 미션 완료 소식을 알려주시면 온보딩이 최종 수료됩니다</div>
                    </div>

                    <a
                      href={`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(
                        "[Onboarding] All Clear 완료 보고"
                      )}&body=${encodeURIComponent(
                        `안녕하세요.\n\n온보딩 미션을 모두 완료했습니다.\n\n- 이름: ${displayName}\n- 이메일: ${
                          email ?? ""
                        }\n- 입사일:\n- 완료: ${doneCount}/${MISSIONS.length}\n\n확인 부탁드립니다.\n감사합니다.`
                      )}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        width: "fit-content",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        background: "white",
                        fontWeight: 800,
                        textDecoration: "none",
                        color: "#111827",
                      }}
                    >
                      📮 이메일 보내기
                    </a>

                    <div style={{ fontSize: 13, opacity: 0.75 }}>* 버튼을 누르면 메일 앱이 열리고, 내용이 자동으로 채워져요.</div>
                  </>
                ) : (
                  <div style={{ fontWeight: 500 }}>
                    🔔 잘하고 계세요! 지금은 <b>{nextMission}</b>번 미션을 수행할 차례예요 😉
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

                {/* 온보딩 미션 보드 */}
                {tab === "Mission" && (
          <div
            style={{
              width: "100%",
              background: "white",
              border: "1px solid #e9eef5",
              borderRadius: 18,
              padding: 14,
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 10 }}>🗺️ 온보딩 미션 보드</div>

            <div
              style={{
                marginBottom: 14,
                padding: 14,
                borderRadius: 14,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                lineHeight: 1.7,
                color: "#111827",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                아래 미션 보드를 통해 크래프톤에서의 온보딩 미션을 한눈에 확인해 보세요!
              </div>

              <div style={{ marginBottom: 10 }}>
                미션 1부터 7까지 차근차근 완수한 모든 분께 축하의 마음을 담아 소정의 선물과 수료증을 드립니다. 🎁
              </div>

              <div style={{ fontSize: 14, color: "#334155" }}>
                <div style={{ marginBottom: 6 }}>
                  • <b>선물 및 수료증 증정</b>: 모든 미션과 Value-up 세션까지 참석을 완료하시면, 담당자가 확인 후 개별적으로 전달드릴 예정이에요.
                </div>
                <div>
                  • <b>미션 수행 관련 문의</b>: 부득이한 사유로 정해진 기한 내에 미션 달성이 어렵다면, 주저하지 말고 담당자에게 미리 문의해 주세요.
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px dashed #e5e7eb",
                fontSize: 15,
                color: "#475569",
              }}
            >
              📌 <b>문의</b>:{" "}
              <a
                href="https://slack.com/app_redirect?channel=C01PP4L905D"
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
              >
                #ask-training
              </a>

              <span style={{ margin: "0 8px", opacity: 0.4 }}>|</span>

              <a
                href="https://slack.com/app_redirect?channel=U08SXTW8L00"
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
              >
                💬 Slack DM
              </a>

              <span style={{ margin: "0 8px", opacity: 0.4 }}>|</span>

              <a
                href="mailto:hyunjin@krafton.com"
                style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
              >
                📧 이메일
              </a>

              <div style={{ marginTop: 6, fontSize: 14, opacity: 0.7 }}>
                ※ 항목을 클릭하면 해당 채널 또는 DM/이메일로 바로 이동해요.
              </div>
            </div>

            <img
              src="./images/newimage.png"
              alt="온보딩 미션 보드"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: 12,
                marginTop: 12,
              }}
            />
          </div>
        )}

               {/* FAQ 탭 시작 */}
               {tab === "FAQ" && (
          <div style={{ marginTop: 18, display: "grid", gap: 20 }}>
            <Card title="🙋‍♀️ KRAFTON 온보딩 FAQ: 무엇이든 물어보세요!">
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
                온보딩 과정에서 가장 자주 묻는 질문들을 모았습니다. <br />
                추가로 궁금한 점은 <b>#ask-training</b> 채널이나 담당자에게 언제든 문의해 주세요!
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {FAQ_ITEMS.map((item, idx) => (
                  <details
                    key={idx}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      background: "#f8fafc",
                      overflow: "hidden",
                    }}
                  >
                    <summary
                      style={{
                        padding: "16px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#1e293b",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        listStyle: "none",
                        WebkitAppearance: "none",
                      }}
                    >
                      <span style={{ display: "flex", gap: 8 }}>
                        <b style={{ color: "#2563eb" }}>Q.</b>
                        <span>{item.q.split(". ")[1] ?? item.q}</span>
                      </span>
                      <span style={{ fontSize: 12, opacity: 0.5 }}>▼</span>
                    </summary>

                    <div
                      style={{
                        padding: "0 16px 16px",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#475569",
                        borderTop: "1px solid #edf2f7",
                        paddingTop: 12,
                        whiteSpace: "pre-line",
                      }}
                    >
                      <b style={{ color: "#10b981", marginRight: 6 }}>A.</b>
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </Card>

            {/* 글래스(고급) CTA 박스 — Card와는 별개 div */}
            <div
              style={{
                marginTop: "40px",
                padding: "32px",
                borderRadius: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
                  원하시는 답변을 찾지 못하셨나요?
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  궁금한 점이 있다면 주저 말고 말씀해 주세요! 여러분의 성공적인 시작을 돕기 위해 대기 중입니다.😊
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {/* Slack 채널 버튼 */}
                <a
                  href="https://slack.com/app_redirect?channel=C01PP4L905D"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <span style={{ marginRight: "8px" }}>📢</span> #ask-training
                </a>

                {/* Slack DM 버튼 */}
                <a
                  href="https://slack.com/app_redirect?channel=U08SXTW8L00"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <span style={{ marginRight: "8px" }}>💬</span> Slack DM
                </a>

                {/* Email 버튼 */}
                <a
                  href="mailto:hyunjin@krafton.com"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <span style={{ marginRight: "8px" }}>📧</span> Email
                </a>
              </div>
            </div>
          </div>
        )}
        {/* FAQ 탭 끝 */}

      </div>
    </div>
  );
}