import { useState, useEffect } from "react";

const PHASES = [
  {
    id: 1,
    name: "PO/BA + Terfi",
    period: "Şubat – Ekim 2026",
    color: "#1B4F8A",
    milestones: [
      { id: "m1", text: "LinkedIn güncelle (Ampelmann + Headline + About)", done: false, week: "Bu Hafta" },
      { id: "m2", text: "PSM-I sınav tarihi ayarla (bedava hak)", done: false, week: "Bu Hafta" },
      { id: "m3", text: "Platform Roadmap taslağı başlat", done: false, week: "Şubat" },
      { id: "m4", text: "Key user & super user listesi oluştur", done: false, week: "Şubat" },
      { id: "m5", text: "DevOps housekeeping & backlog temizliği", done: false, week: "Mart" },
      { id: "m6", text: "Scrum framework standardize et (template'ler)", done: false, week: "Mart" },
      { id: "m7", text: "MCT: TSP bağlantısı kur, MTM aktive et", done: false, week: "Mart" },
      { id: "m8", text: "PSM-I sınavı geç", done: false, week: "Nisan" },
      { id: "m9", text: "MCT: İlk 2 oturumu tamamla & kaydet", done: false, week: "Haziran" },
      { id: "m10", text: "LSS Green Belt kursuna başla", done: false, week: "Nisan" },
      { id: "m11", text: "Copilot Studio pilot projesine başla", done: false, week: "Mayıs" },
      { id: "m12", text: "PSPO sınavı geç", done: false, week: "Temmuz" },
      { id: "m13", text: "AI pilot projesi tamamla & belgele", done: false, week: "Ağustos" },
      { id: "m14", text: "LSS Green Belt sınavı geç", done: false, week: "Eylül" },
      { id: "m15", text: "MCT: Yıllık 6 oturum tamamla & yenile", done: false, week: "Ekim" },
      { id: "m16", text: "Terfi talebi direktöre ilet", done: false, week: "Eylül" },
      { id: "m17", text: "Sözleşme yenileme: Tech Lead / Platform Manager", done: false, week: "Ekim 2026" },
    ]
  },
  {
    id: 2,
    name: "SA Geçişi",
    period: "Haz 2026 – Haz 2027",
    color: "#2E86C1",
    milestones: [
      { id: "m18", text: "PL-600 çalışmaya başla", done: false, week: "Haziran 2026" },
      { id: "m19", text: "TOGAF Foundation kursuna başla", done: false, week: "Ekim 2026" },
      { id: "m20", text: "AI-900 Azure AI Fundamentals geç", done: false, week: "Mart 2027" },
      { id: "m21", text: "PL-600 Power Platform SA geç", done: false, week: "Ocak 2027" },
      { id: "m22", text: "TOGAF® 10 Certified (L1+L2) geç", done: false, week: "Şubat 2027" },
      { id: "m23", text: "AI-102 Azure AI Engineer geç", done: false, week: "Nisan 2027" },
      { id: "m24", text: "Kişisel website taslağı yayınla", done: false, week: "Ocak 2027" },
      { id: "m25", text: "Hollandaca B2 seviyesine ulaş", done: false, week: "Mid 2027" },
    ]
  },
  {
    id: 3,
    name: "Otorite & Geçiş",
    period: "Haz 2027+",
    color: "#1A7A4A",
    milestones: [
      { id: "m26", text: "LinkedIn thought leadership serisi başlat", done: false, week: "2027" },
      { id: "m27", text: "Microsoft MVP başvurusu yap", done: false, week: "2027" },
      { id: "m28", text: "Newsletter yayınla (ilk sayı)", done: false, week: "2027" },
      { id: "m29", text: "İlk freelance engagement tamamla", done: false, week: "2027" },
      { id: "m30", text: "Şirket kuruluş planı hazırla", done: false, week: "2028" },
    ]
  }
];

const TODAY_TASKS = [
  { id: "t1", text: "LinkedIn'i aç, Ampelmann'ı ekle", effort: "15 dk", phase: 1 },
  { id: "t2", text: "PSM-I için Scrum.org'a git, sınav tarihine bak", effort: "10 dk", phase: 1 },
  { id: "t3", text: "Platform Roadmap için bir A4 kağıt al ve mind map çiz", effort: "20 dk", phase: 1 },
  { id: "t4", text: "Key user listesi için taslak Excel oluştur", effort: "15 dk", phase: 1 },
  { id: "t5", text: "DevOps board'una gir, item sayısını not et", effort: "5 dk", phase: 1 },
];

const WEEKLY_QUESTIONS = [
  "Bu hafta tamamladığım en önemli şey ne?",
  "Bu hafta planladığım ama yapamadığım ne vardı?",
  "Bu hafta direktörümün gözünde görünür olduğum an hangisiydi?",
  "Gelecek hafta sadece 1 şey yapabilsem ne olurdu?",
  "Bu hafta ne öğrendim? Bunu kim bilmeli?"
];

const EVIDENCE_LOG_INITIAL = [
  { date: "Şubat 2026", achievement: "Kariyer planı hazırlandı", impact: "Netlik ve yön kazanıldı" },
];

const COPILOT_PROMPTS = [
  {
    id: "morning",
    title: "☀️ Sabah Kontrolü (09:00)",
    time: "Her sabah ilk iş",
    prompts: [
      {
        label: "📨 Teams & Email Özeti",
        prompt: `Show me:
1. All Teams messages where I was @mentioned in the last 16 hours
2. All direct messages I haven't replied to yet
3. Any urgent emails in my inbox (flagged or from my director)

Summarize each in one line with sender name and action needed.`,
        why: "Gece/sabah kaçırdığın önemli iletişimi yakala"
      },
      {
        label: "📅 Bugünün Toplantıları",
        prompt: `List all my meetings today with:
- Meeting title and time
- Required attendees
- Any related emails or Teams messages from the last 2 days
- Suggested 2-sentence prep note for each meeting`,
        why: "Toplantılara hazırlıksız girmemek için"
      },
      {
        label: "🎯 Bugünün Öncelikleri",
        prompt: `Based on my calendar, emails, and Teams messages from yesterday and today, what are the top 3 things I should focus on today? Include any deadlines or blocking issues.`,
        why: "Günü netle başla"
      }
    ]
  },
  {
    id: "midday",
    title: "☕ Öğle Arası Check (13:00)",
    time: "Öğle yemeğinden önce/sonra",
    prompts: [
      {
        label: "⚡ Sabahtan Beri Ne Oldu",
        prompt: `Summarize what happened since 9 AM:
- New Teams messages or emails requiring my response
- Any changes to today's meetings
- Action items assigned to me`,
        why: "Öğleden sonraya refresh ile başla"
      },
      {
        label: "👥 Stakeholder Check",
        prompt: `Show me any communication from these people in the last 24 hours: [direktörünün adı], [key user liderleri]. Summarize what they need from me.`,
        why: "Önemli kişileri kaçırmamak için"
      }
    ]
  },
  {
    id: "eod",
    title: "🌙 Gün Sonu (17:00)",
    time: "İş bitiminde",
    prompts: [
      {
        label: "✅ Bugün Ne Yaptım",
        prompt: `Based on my emails sent, Teams messages, and meeting attendance today, create a brief summary of what I accomplished. Include any decisions made or actions completed.`,
        why: "Kanıt biriktirme için + yarına hazırlık"
      },
      {
        label: "📮 Yarın İçin Hazırlık",
        prompt: `What do I need to prepare for tomorrow? Check:
- Tomorrow's meetings and who I need to follow up with
- Any pending replies or action items from today
- Upcoming deadlines this week`,
        why: "Yarın sabah rahat başla"
      }
    ]
  },
  {
    id: "weekly",
    title: "📊 Haftalık Ritüeller",
    time: "Pazartesi, Salı, Cuma",
    prompts: [
      {
        label: "🌅 Pazartesi: Hafta Açılışı",
        prompt: `It's Monday morning. Based on my calendar for this week and any pending items from last week, help me plan my week:
- What are my key meetings this week?
- Any deadlines or important dates?
- What should I prioritize?
- Any preparation needed for Wednesday's meeting with my director?`,
        why: "Haftaya net başla"
      },
      {
        label: "📋 Salı 16:00: Yönetici Özeti Hazırla",
        prompt: `I have my weekly 1:1 with my director tomorrow (Wednesday). Based on my work this week so far (Monday-Tuesday emails, Teams, meetings), create a brief update including:
- Progress on key projects (Platform Roadmap, DevOps cleanup, Scrum framework, AI pilot, MCT sessions)
- Any blockers or decisions needed
- Quick wins or accomplishments
- Questions I should ask
Keep it concise and action-oriented.`,
        why: "Çarşamba toplantısına hazır ol"
      },
      {
        label: "🎯 Cuma Akşam: Hafta Kapanışı",
        prompt: `It's Friday end of day. Summarize my week:
- Top 3 accomplishments this week
- Key meetings and their outcomes
- Decisions made or actions completed
- People I collaborated with most
- What should carry over to next week?
- Evidence to log (achievements with measurable impact)`,
        why: "Haftayı kapat, kanıt biriktir"
      }
    ]
  },
  {
    id: "ondemand",
    title: "🔧 İhtiyaç Anında",
    time: "Gerektiğinde kullan",
    prompts: [
      {
        label: "🔍 Konu Araştır",
        prompt: `Search my emails and Teams messages for any discussion about: [KONU BURAYA YAZ]

Show me the key points and who was involved.`,
        why: "Geçmiş konuşmaları hızlı bul"
      },
      {
        label: "✍️ Email Taslağı",
        prompt: `Draft a professional email to [KİME] about [KONU]. 
Context: [CONTEXT BURAYA]
Tone: [professional / friendly / direct]
Keep it under 150 words.`,
        why: "Hızlı email yaz"
      },
      {
        label: "📝 Toplantı Notu Özeti",
        prompt: `I just finished a meeting about [KONU]. Here are my raw notes:
[NOTLARINI BURAYA YAPIŞTIR]

Create a clean summary with:
- Key decisions
- Action items (who does what by when)
- Follow-up needed`,
        why: "Toplantı sonrası hızlı refine"
      },
      {
        label: "🎤 Direktöre Ne Söyleyeceğim",
        prompt: `I need to discuss [KONU] with my director in our next 1:1. Based on context [CONTEXT], what are the key points I should mention and what questions should I ask?`,
        why: "Önemli konuşmalara hazırlık"
      }
    ]
  }
];

export default function BurcuDashboard() {
  const [activeTab, setActiveTab] = useState("today");
  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem("burcu_milestones");
      return saved ? JSON.parse(saved) : PHASES;
    } catch { return PHASES; }
  });
  const [todayTask, setTodayTask] = useState(null);
  const [weeklyAnswers, setWeeklyAnswers] = useState({});
  const [evidenceLog, setEvidenceLog] = useState(EVIDENCE_LOG_INITIAL);
  const [newEvidence, setNewEvidence] = useState({ date: "", achievement: "", impact: "" });
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedToday, setCompletedToday] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Determine which Copilot section to highlight based on time
  const getActiveTimeSlot = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay(); // 0=Sunday, 1=Monday, 5=Friday
    
    // Weekly rituals
    if (day === 1 && hour >= 9 && hour < 11) return "weekly-monday"; // Monday 9-11
    if (day === 2 && hour >= 16 && hour < 18) return "weekly-tuesday"; // Tuesday 16-18
    if (day === 5 && hour >= 16 && hour < 19) return "weekly-friday"; // Friday 16-19
    
    // Daily rituals
    if (hour >= 8 && hour < 10) return "morning";
    if (hour >= 12 && hour < 14) return "midday";
    if (hour >= 16 && hour < 18) return "eod";
    
    return null;
  };

  const activeSlot = getActiveTimeSlot();

  useEffect(() => {
    try {
      localStorage.setItem("burcu_milestones", JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

  const toggleMilestone = (phaseId, milestoneId) => {
    setMilestones(prev => prev.map(phase =>
      phase.id === phaseId ? {
        ...phase,
        milestones: phase.milestones.map(m =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        )
      } : phase
    ));
  };

  const totalMilestones = milestones.reduce((acc, p) => acc + p.milestones.length, 0);
  const doneMilestones = milestones.reduce((acc, p) => acc + p.milestones.filter(m => m.done).length, 0);
  const progressPct = Math.round((doneMilestones / totalMilestones) * 100);

  const completeTask = (taskId) => {
    if (!completedToday.includes(taskId)) {
      setCompletedToday(prev => [...prev, taskId]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const addEvidence = () => {
    if (newEvidence.achievement) {
      setEvidenceLog(prev => [newEvidence, ...prev]);
      setNewEvidence({ date: "", achievement: "", impact: "" });
    }
  };

  const tabs = [
    { id: "today", label: "Bugün", emoji: "⚡" },
    { id: "copilot", label: "Copilot", emoji: "🤖" },
    { id: "milestones", label: "Yol Haritası", emoji: "🗺️" },
    { id: "weekly", label: "Haftalık", emoji: "📋" },
    { id: "evidence", label: "Kanıtlar", emoji: "🏆" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e1a 0%, #0d1929 50%, #0a1520 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8edf5",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #1B4F8A 0%, #0d3060 100%)",
        padding: "24px 32px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#7fb3d3", textTransform: "uppercase", marginBottom: 4 }}>
                Sekreter
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Burcu Gürel</div>
              <div style={{ fontSize: 13, color: "#a8c8e8", marginTop: 2 }}>D365 & AI Transformation Specialist</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "12px 20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
              <div style={{ fontSize: 11, color: "#7fb3d3", letterSpacing: 2, textTransform: "uppercase" }}>🎯 Kritik Hedef</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#ff8c42", marginTop: 4 }}>31 Ekim 2026</div>
              <div style={{ fontSize: 12, color: "#a8c8e8" }}>Tech Lead Terfisi</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#7fb3d3" }}>Genel İlerleme</span>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{doneMilestones}/{totalMilestones} milestone • {progressPct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, height: 8, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 8,
                background: "linear-gradient(90deg, #2E86C1, #1A7A4A)",
                width: `${progressPct}%`,
                transition: "width 0.6s ease",
                boxShadow: "0 0 12px rgba(46,134,193,0.6)",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, padding: "16px 0 0", overflowX: "auto" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "10px 20px", borderRadius: 10,
              border: "1px solid",
              borderColor: activeTab === tab.id ? "#2E86C1" : "rgba(255,255,255,0.1)",
              background: activeTab === tab.id ? "rgba(46,134,193,0.2)" : "rgba(255,255,255,0.04)",
              color: activeTab === tab.id ? "#7fc8f8" : "#8a9ab5",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ paddingBottom: 48 }}>

          {/* TODAY TAB */}
          {activeTab === "today" && (
            <div style={{ paddingTop: 20 }}>
              {showConfetti && (
                <div style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none", zIndex: 999,
                  fontSize: 80,
                }}>🎉</div>
              )}

              {/* Today's One Thing */}
              <div style={{
                background: "linear-gradient(135deg, rgba(255,140,66,0.15), rgba(255,140,66,0.05))",
                border: "1px solid rgba(255,140,66,0.3)",
                borderRadius: 16, padding: "20px 24px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#ff8c42", textTransform: "uppercase", marginBottom: 8 }}>
                  ⚡ Bugünün Tek Görevi
                </div>
                <div style={{ fontSize: 15, color: "#e8edf5", lineHeight: 1.5 }}>
                  {todayTask !== null ? TODAY_TASKS[todayTask].text : "Aşağıdan bugün için bir görev seç →"}
                </div>
                {todayTask !== null && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#ff8c42" }}>
                    ⏱ {TODAY_TASKS[todayTask].effort}
                  </div>
                )}
              </div>

              {/* Task Cards */}
              <div style={{ fontSize: 12, color: "#7fb3d3", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                Bu Haftanın Görevleri
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {TODAY_TASKS.map((task, idx) => {
                  const done = completedToday.includes(task.id);
                  return (
                    <div key={task.id} style={{
                      display: "flex", alignItems: "center", gap: 16,
                      background: done ? "rgba(26,122,74,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${done ? "rgba(26,122,74,0.4)" : todayTask === idx ? "rgba(255,140,66,0.4)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 12, padding: "14px 18px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                      onClick={() => setTodayTask(idx)}
                    >
                      <button
                        onClick={e => { e.stopPropagation(); completeTask(task.id); }}
                        style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: done ? "#1A7A4A" : "rgba(255,255,255,0.08)",
                          border: `2px solid ${done ? "#1A7A4A" : "rgba(255,255,255,0.2)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", fontSize: 14, flexShrink: 0,
                          transition: "all 0.2s",
                        }}>
                        {done ? "✓" : ""}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: done ? "#6db88a" : "#e8edf5", textDecoration: done ? "line-through" : "none" }}>
                          {task.text}
                        </div>
                        <div style={{ fontSize: 11, color: "#7fb3d3", marginTop: 2 }}>⏱ {task.effort}</div>
                      </div>
                      {todayTask === idx && !done && (
                        <div style={{ fontSize: 11, color: "#ff8c42", fontWeight: 600 }}>← Bugünkü</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Imposter antidote */}
              <div style={{
                marginTop: 24,
                background: "rgba(108,52,131,0.12)",
                border: "1px solid rgba(108,52,131,0.25)",
                borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#b07fd6", textTransform: "uppercase", marginBottom: 8 }}>
                  💜 Bugünün Hatırlatması
                </div>
                <div style={{ fontSize: 13, color: "#c8b8dc", lineHeight: 1.6, fontStyle: "italic" }}>
                  "Zekayla iş kotarmak tam olarak senior danışmanların yaptığı şeydir. Karmaşıklığı görmek ve doğru soruyu sormak — bu bir yetenek, hile değil."
                </div>
              </div>
            </div>
          )}

          {/* COPILOT TAB */}
          {activeTab === "copilot" && (
            <div style={{ paddingTop: 20 }}>
              <div style={{
                background: "rgba(46,134,193,0.12)",
                border: "1px solid rgba(46,134,193,0.3)",
                borderRadius: 14, padding: "16px 20px", marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#7fc8f8", textTransform: "uppercase", marginBottom: 6 }}>
                  🤖 Nasıl Kullanılır
                </div>
                <div style={{ fontSize: 13, color: "#a8c8e8", lineHeight: 1.6 }}>
                  Her prompt'un yanındaki <strong>"Kopyala"</strong> butonuna tıkla → Microsoft 365 Copilot'a yapıştır → Cevabı al → Gerekeni yap. Karar verme yok, sadece kopyala-yapıştır.
                </div>
              </div>

              {COPILOT_PROMPTS.map(section => {
                const isWeekly = section.id === "weekly";
                const shouldHighlight = !isWeekly && activeSlot === section.id;
                
                return (
                <div key={section.id} style={{ marginBottom: 28 }}>
                  <div style={{
                    background: shouldHighlight ? "rgba(255,140,66,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${shouldHighlight ? "rgba(255,140,66,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: shouldHighlight ? "0 0 20px rgba(255,140,66,0.3)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {/* Section Header */}
                    <div style={{
                      background: shouldHighlight ? "rgba(255,140,66,0.2)" : "rgba(46,134,193,0.15)",
                      borderBottom: `1px solid ${shouldHighlight ? "rgba(255,140,66,0.3)" : "rgba(46,134,193,0.2)"}`,
                      padding: "12px 20px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#e8edf5" }}>
                          {section.title}
                        </div>
                        <div style={{ fontSize: 11, color: shouldHighlight ? "#ff8c42" : "#7fb3d3", marginTop: 2 }}>
                          {section.time}
                        </div>
                      </div>
                      {shouldHighlight && (
                        <div style={{
                          background: "rgba(255,140,66,0.3)",
                          borderRadius: 20, padding: "4px 12px",
                          fontSize: 11, fontWeight: 700, color: "#ff8c42",
                        }}>
                          🔥 ŞİMDİ
                        </div>
                      )}
                    </div>

                    {/* Prompts */}
                    <div style={{ padding: "12px 20px 20px" }}>
                      {section.prompts.map((p, idx) => {
                        // Check if specific weekly prompt should highlight
                        const weeklyHighlight = isWeekly && (
                          (activeSlot === "weekly-monday" && p.label.includes("Pazartesi")) ||
                          (activeSlot === "weekly-tuesday" && p.label.includes("Salı")) ||
                          (activeSlot === "weekly-friday" && p.label.includes("Cuma"))
                        );
                        
                        return (
                        <div key={idx} style={{
                          background: weeklyHighlight ? "rgba(255,140,66,0.08)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${weeklyHighlight ? "rgba(255,140,66,0.3)" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: 12, padding: "14px 18px", marginBottom: 12,
                          boxShadow: weeklyHighlight ? "0 0 12px rgba(255,140,66,0.2)" : "none",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5" }}>
                                  {p.label}
                                </div>
                                {weeklyHighlight && (
                                  <div style={{
                                    background: "rgba(255,140,66,0.3)",
                                    borderRadius: 12, padding: "2px 8px",
                                    fontSize: 10, fontWeight: 700, color: "#ff8c42",
                                  }}>
                                    BUGÜN
                                  </div>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: "#7fb3d3", fontStyle: "italic" }}>
                                {p.why}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(p.prompt);
                                alert("✅ Kopyalandı! Şimdi Copilot'a yapıştır.");
                              }}
                              style={{
                                background: "linear-gradient(135deg, #2E86C1, #1B4F8A)",
                                border: "none", borderRadius: 8, padding: "8px 16px",
                                color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                whiteSpace: "nowrap", flexShrink: 0, marginLeft: 12,
                              }}>
                              📋 Kopyala
                            </button>
                          </div>
                          <div style={{
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: 8, padding: "12px 14px",
                            fontSize: 12, color: "#c8d8e8",
                            fontFamily: "'Courier New', monospace",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}>
                            {p.prompt}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                </div>
              )})}

              {/* Capture Inbox */}
              <div style={{
                background: "rgba(255,140,66,0.12)",
                border: "1px solid rgba(255,140,66,0.25)",
                borderRadius: 14, padding: "16px 20px", marginTop: 24,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ff8c42", marginBottom: 8 }}>
                  💡 Copilot'tan Gelen Cevapları Buraya Yapıştır (opsiyonel)
                </div>
                <textarea
                  placeholder="Copilot cevaplarını buraya yapıştırabilirsin - böylece hepsini tek yerde görebilirsin. Ama zorunlu değil."
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,140,66,0.3)", borderRadius: 10,
                    padding: "12px 16px", color: "#e8edf5", fontSize: 13,
                    resize: "vertical", minHeight: 100, outline: "none",
                    fontFamily: "inherit", lineHeight: 1.5,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {/* MILESTONES TAB */}
          {activeTab === "milestones" && (
            <div style={{ paddingTop: 20 }}>
              {milestones.map(phase => {
                const phaseDone = phase.milestones.filter(m => m.done).length;
                const phasePct = Math.round((phaseDone / phase.milestones.length) * 100);
                return (
                  <div key={phase.id} style={{ marginBottom: 24 }}>
                    <div style={{
                      background: `${phase.color}22`,
                      border: `1px solid ${phase.color}44`,
                      borderRadius: 14, overflow: "hidden",
                    }}>
                      {/* Phase Header */}
                      <div style={{
                        background: `${phase.color}33`,
                        padding: "14px 20px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderBottom: `1px solid ${phase.color}33`,
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#e8edf5" }}>
                            Aşama {phase.id}: {phase.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#7fb3d3", marginTop: 2 }}>{phase.period}</div>
                        </div>
                        <div style={{
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: 20, padding: "4px 14px",
                          fontSize: 13, fontWeight: 700,
                          color: phasePct === 100 ? "#6db88a" : "#e8edf5",
                        }}>
                          {phaseDone}/{phase.milestones.length}
                        </div>
                      </div>

                      {/* Phase Progress */}
                      <div style={{ padding: "8px 20px 4px" }}>
                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 4 }}>
                          <div style={{
                            height: "100%", borderRadius: 4,
                            background: phase.color, width: `${phasePct}%`,
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                      </div>

                      {/* Milestones */}
                      <div style={{ padding: "8px 20px 16px" }}>
                        {phase.milestones.map(m => (
                          <div key={m.id}
                            onClick={() => toggleMilestone(phase.id, m.id)}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              cursor: "pointer",
                            }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                              background: m.done ? phase.color : "rgba(255,255,255,0.06)",
                              border: `2px solid ${m.done ? phase.color : "rgba(255,255,255,0.15)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, transition: "all 0.2s",
                            }}>
                              {m.done ? "✓" : ""}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: 13, color: m.done ? "#6db88a" : "#c8d8e8",
                                textDecoration: m.done ? "line-through" : "none",
                                lineHeight: 1.4,
                              }}>
                                {m.text}
                              </div>
                              <div style={{ fontSize: 11, color: "#4a6a8a", marginTop: 2 }}>{m.week}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WEEKLY TAB */}
          {activeTab === "weekly" && (
            <div style={{ paddingTop: 20 }}>
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "20px 24px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#7fb3d3", textTransform: "uppercase", marginBottom: 4 }}>
                  📋 Haftalık Check-in
                </div>
                <div style={{ fontSize: 13, color: "#8a9ab5" }}>
                  Her Pazartesi 10 dakika. Remarkable'da veya burada.
                </div>
              </div>

              {WEEKLY_QUESTIONS.map((q, idx) => (
                <div key={idx} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "#a8c8e8", marginBottom: 8, fontWeight: 600 }}>
                    {idx + 1}. {q}
                  </div>
                  <textarea
                    value={weeklyAnswers[idx] || ""}
                    onChange={e => setWeeklyAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Yaz..."
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                      padding: "12px 16px", color: "#e8edf5", fontSize: 13,
                      resize: "vertical", minHeight: 72, outline: "none",
                      fontFamily: "inherit", lineHeight: 1.5,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{
                marginTop: 8,
                background: "rgba(255,140,66,0.08)",
                border: "1px solid rgba(255,140,66,0.2)",
                borderRadius: 12, padding: "14px 18px",
              }}>
                <div style={{ fontSize: 12, color: "#ff8c42", fontWeight: 600, marginBottom: 4 }}>
                  🎯 Gelecek Haftanın Tek Görevi
                </div>
                <input
                  value={weeklyAnswers["next"] || ""}
                  onChange={e => setWeeklyAnswers(prev => ({ ...prev, next: e.target.value }))}
                  placeholder="Bu haftaki check-in'den çıkan en kritik aksiyon..."
                  style={{
                    width: "100%", background: "transparent",
                    border: "none", borderBottom: "1px solid rgba(255,140,66,0.3)",
                    padding: "8px 0", color: "#e8edf5", fontSize: 14,
                    outline: "none", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {/* EVIDENCE TAB */}
          {activeTab === "evidence" && (
            <div style={{ paddingTop: 20 }}>
              <div style={{
                background: "rgba(108,52,131,0.12)",
                border: "1px solid rgba(108,52,131,0.25)",
                borderRadius: 14, padding: "16px 20px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#b07fd6", textTransform: "uppercase", marginBottom: 6 }}>
                  💜 Kanıt Biriktirme
                </div>
                <div style={{ fontSize: 13, color: "#c8b8dc", lineHeight: 1.6 }}>
                  Her başarıyı buraya yaz. İmposter sesine karşı en güçlü silahın somut kanıtlardır. Geriye baktığında "bunları ben yaptım" diyeceksin.
                </div>
              </div>

              {/* Add evidence */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: "16px 20px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 12, color: "#7fb3d3", marginBottom: 12, fontWeight: 600 }}>
                  + Yeni Başarı Ekle
                </div>
                <input
                  value={newEvidence.date}
                  onChange={e => setNewEvidence(p => ({ ...p, date: e.target.value }))}
                  placeholder="Tarih (örn: Mart 2026)"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "10px 14px", color: "#e8edf5", fontSize: 13,
                    outline: "none", marginBottom: 10, fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  value={newEvidence.achievement}
                  onChange={e => setNewEvidence(p => ({ ...p, achievement: e.target.value }))}
                  placeholder="Ne yaptım? (örn: DevOps backlog 120 → 30 item'a düşürüldü)"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "10px 14px", color: "#e8edf5", fontSize: 13,
                    outline: "none", marginBottom: 10, fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  value={newEvidence.impact}
                  onChange={e => setNewEvidence(p => ({ ...p, impact: e.target.value }))}
                  placeholder="Etkisi ne oldu? (sayısal veya gözlemsel)"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "10px 14px", color: "#e8edf5", fontSize: 13,
                    outline: "none", marginBottom: 14, fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <button onClick={addEvidence} style={{
                  background: "linear-gradient(135deg, #6C3483, #8e44ad)",
                  border: "none", borderRadius: 8, padding: "10px 24px",
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Kaydet 💜
                </button>
              </div>

              {/* Evidence list */}
              {evidenceLog.map((e, idx) => (
                <div key={idx} style={{
                  background: "rgba(108,52,131,0.08)",
                  border: "1px solid rgba(108,52,131,0.2)",
                  borderRadius: 12, padding: "14px 18px", marginBottom: 12,
                }}>
                  <div style={{ fontSize: 11, color: "#b07fd6", marginBottom: 4 }}>{e.date}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5", marginBottom: 4 }}>{e.achievement}</div>
                  {e.impact && <div style={{ fontSize: 12, color: "#c8b8dc" }}>→ {e.impact}</div>}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
