"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, BriefcaseBusiness,
  CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Compass, GraduationCap, Heart, Home,
  Lightbulb, Menu, MessageCircle, MoreHorizontal, Plus, Search, Send, Settings2, ShieldCheck,
  Sparkles, Target, Timer, TrendingUp, Users, X, Zap,
} from "lucide-react";

type View = "overview" | "academics" | "planner" | "progress" | "advisor" | "careers" | "family" | "wellbeing" | "resources";
type StudyTask = { title: string; subject: string; time: string; done: boolean };

const navigation: { id: View; label: string; icon: typeof Home; group: string }[] = [
  { id: "overview", label: "Overview", icon: Home, group: "LEARNING" },
  { id: "academics", label: "Academics", icon: BookOpen, group: "LEARNING" },
  { id: "planner", label: "Study planner", icon: CalendarDays, group: "LEARNING" },
  { id: "progress", label: "Progress", icon: TrendingUp, group: "LEARNING" },
  { id: "advisor", label: "AI advisor", icon: BrainCircuit, group: "SUPPORT" },
  { id: "careers", label: "Career guidance", icon: Compass, group: "SUPPORT" },
  { id: "family", label: "Family decisions", icon: Users, group: "SUPPORT" },
  { id: "wellbeing", label: "Wellbeing", icon: Heart, group: "SUPPORT" },
  { id: "resources", label: "Resources", icon: Lightbulb, group: "SUPPORT" },
];

const subjects = [
  { name: "Mathematics", score: 82, color: "#5b75e8", detail: "Functions · Calculus · Vectors" },
  { name: "Physics", score: 74, color: "#16a6a1", detail: "Mechanics · Electricity · Optics" },
  { name: "Chemistry", score: 91, color: "#f19a44", detail: "Organic · Inorganic · Physical" },
];

const colleges = [
  { name: "JNTU Hyderabad", branch: "Computer Science", place: "Hyderabad, Telangana", fit: 92, chance: "Realistic", fee: "₹65k", color: "#5b75e8" },
  { name: "College of Engineering, AU", branch: "Computer Science", place: "Visakhapatnam, Andhra Pradesh", fit: 87, chance: "Realistic", fee: "₹60k", color: "#16a6a1" },
  { name: "NIT Warangal", branch: "Electrical Engineering", place: "Warangal, Telangana", fit: 78, chance: "Dream", fee: "₹1.75L", color: "#efa045" },
];

const resources = [
  { title: "EAPCET counselling checklist", type: "Admissions", read: "8 min", icon: GraduationCap, color: "blue" },
  { title: "JEE revision: a 14-day plan", type: "Study guide", read: "6 min", icon: BookOpen, color: "violet" },
  { title: "Questions to ask on a campus visit", type: "Family guide", read: "5 min", icon: Users, color: "amber" },
  { title: "Choosing a branch that fits you", type: "Career guide", read: "7 min", icon: Compass, color: "teal" },
  { title: "Exam-week wellbeing toolkit", type: "Wellbeing", read: "4 min", icon: Heart, color: "rose" },
  { title: "Understanding college costs", type: "Family guide", read: "9 min", icon: ShieldCheck, color: "green" },
];

const careers = [
  { title: "Software & AI", tag: "Technology", description: "Build software, intelligent tools, and the systems behind everyday products.", skills: ["Programming", "Problem solving", "Data thinking"], icon: BrainCircuit, color: "blue" },
  { title: "Robotics & embedded systems", tag: "Hardware + software", description: "Connect code with sensors, devices, automation, and the physical world.", skills: ["Electronics", "C++", "Design"], icon: Zap, color: "violet" },
  { title: "Civil & sustainable infrastructure", tag: "Built environment", description: "Plan and build safer, more resilient places for people to live and work.", skills: ["Physics", "Planning", "Teamwork"], icon: BriefcaseBusiness, color: "teal" },
];

const titleFor: Record<View, { title: string; subtitle: string }> = {
  overview: { title: "Your learning dashboard", subtitle: "A clear view of your studies, goals, and next steps." },
  academics: { title: "Academic snapshot", subtitle: "See what is going well and where a little more practice could help." },
  planner: { title: "Study planner", subtitle: "Make a realistic plan for the week, one session at a time." },
  progress: { title: "Your progress", subtitle: "Small, steady steps add up. Here is your progress so far." },
  advisor: { title: "AI study advisor", subtitle: "Get a starting point for study, admissions, or family questions." },
  careers: { title: "Career guidance", subtitle: "Explore a few engineering pathways and the skills behind them." },
  family: { title: "Decide together", subtitle: "Compare college options around what matters to your family." },
  wellbeing: { title: "Wellbeing check-in", subtitle: "Take care of your energy while you work toward your goals." },
  resources: { title: "Resource library", subtitle: "Practical guides for exams, admissions, careers, and family planning." },
};

function cn(...values: (string | false | undefined)[]) { return values.filter(Boolean).join(" "); }

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-[0_3px_14px_rgba(24,42,77,.035)]", className)}>{children}</section>;
}

function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-[15px] font-semibold tracking-[-.02em] text-slate-900">{title}</h2>{action}</div>;
}

function ProgressBar({ value, color = "bg-blue-600" }: { value: number; color?: string }) {
  return <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function SmallLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-900">{children}<ArrowRight size={13} /></button>;
}

export default function HomePage() {
  const [view, setView] = useState<View>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [rank, setRank] = useState("4200");
  const [region, setRegion] = useState("AU region");
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([
    { title: "Revise integration techniques", subject: "Mathematics", time: "Today · 4:30 PM", done: false },
    { title: "Finish electrostatics practice", subject: "Physics", time: "Today · 6:00 PM", done: false },
    { title: "Review organic chemistry notes", subject: "Chemistry", time: "Tomorrow · 9:00 AM", done: true },
  ]);
  const [taskTitle, setTaskTitle] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([
    { role: "assistant", text: "Hi! I can help you break a study goal into smaller steps, think through engineering branches, or prepare questions for a college conversation. What would be useful right now?" },
  ]);
  const [selectedMood, setSelectedMood] = useState("Okay");
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [priorities, setPriorities] = useState({ affordability: 70, location: 55, branch: 85, placements: 65 });
  const [selectedCollege, setSelectedCollege] = useState(colleges[0].name);

  useEffect(() => {
    if (!focusRunning) return;
    const timer = window.setInterval(() => setFocusSeconds((current) => {
      if (current <= 1) { setFocusRunning(false); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [focusRunning]);

  const filteredResources = useMemo(() => resources.filter((item) => `${item.title} ${item.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const recommended = useMemo(() => {
    const rankValue = Number(rank) || 4200;
    const average = (priorities.affordability + priorities.location + priorities.branch + priorities.placements) / 4;
    return colleges.map((college, index) => ({ ...college, fit: Math.max(55, Math.min(98, Math.round(college.fit + (average - 65) / 5 - index * (rankValue > 5000 ? 2 : 0)))) })).sort((a, b) => b.fit - a.fit);
  }, [priorities, rank]);

  const go = (next: View) => { setView(next); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const sendChat = (event?: FormEvent) => {
    event?.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    const lower = message.toLowerCase();
    const answer = lower.includes("study") || lower.includes("plan")
      ? "Try a 25-minute focused session on one topic, followed by a five-minute break. Pick the smallest useful task first, then add a second session only if you still have energy."
      : lower.includes("college") || lower.includes("admission") || lower.includes("rank")
        ? "Start by comparing a balanced shortlist: one ambitious option, a few realistic options, and a safer choice. Check the latest official cutoff, fees, branch details, and counselling rules before deciding."
        : lower.includes("career") || lower.includes("branch")
          ? "A good next step is to compare the day-to-day work, core subjects, and projects in each field. Try one small project or beginner lesson before narrowing your options."
          : "Break this into one small next step. Write down what you know, what you still need to check, and who could help you verify it. I can help you turn that into a short plan.";
    setChatMessages((items) => [...items, { role: "user", text: message }, { role: "assistant", text: answer }]);
    setChatInput("");
  };

  const addTask = (event: FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    setTasks((items) => [{ title: taskTitle.trim(), subject: "Personal goal", time: "This week", done: false }, ...items]);
    setTaskTitle("");
  };

  const toggleResource = (title: string) => setSavedResources((items) => items.includes(title) ? items.filter((item) => item !== title) : [...items, title]);
  const activeInfo = titleFor[view];

  return (
    <div className="theme-dark min-h-screen bg-[#090a0c] text-slate-100">
      {mobileNav && <button aria-label="Close menu overlay" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#142744] text-slate-200 transition-transform duration-300 lg:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <button onClick={() => go("overview")} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-950/30"><GraduationCap size={22} /></span>
            <span><span className="block text-[15px] font-bold tracking-tight text-white">Pathwise</span><span className="block text-[10px] font-medium tracking-[.16em] text-sky-300">EDUCATION</span></span>
          </button>
          <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 lg:hidden"><X size={18} /></button>
        </div>
        <div className="px-3 pt-5">
          {(["LEARNING", "SUPPORT"] as const).map((group) => <div key={group} className="mb-5">
            <div className="mb-2 px-3 text-[9px] font-bold tracking-[.16em] text-slate-500">{group}</div>
            <nav className="space-y-1" aria-label={`${group.toLowerCase()} navigation`}>
              {navigation.filter((item) => item.group === group).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => go(id)} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-[10px] text-left text-[12px] font-medium transition", view === id ? "bg-[#2678e8] text-white shadow-lg shadow-blue-950/20" : "text-slate-300 hover:bg-white/[.07] hover:text-white")}>
                <Icon size={17} strokeWidth={1.8} className={cn(view === id ? "text-white" : "text-slate-400 group-hover:text-sky-300")} />{label}{id === "advisor" && <span className="ml-auto rounded-md bg-sky-400/15 px-1.5 py-0.5 text-[9px] text-sky-200">NEW</span>}
              </button>)}
            </nav>
          </div>)}
        </div>
        <div className="mt-auto px-4 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
            <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold text-white">Your weekly goal</span><Target size={15} className="text-sky-300" /></div>
            <div className="mb-2 flex items-end justify-between"><span className="text-[21px] font-bold text-white">8.5<span className="ml-1 text-[11px] font-medium text-slate-400">/ 12 hrs</span></span><span className="text-[10px] font-semibold text-emerald-300">71%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full w-[71%] rounded-full bg-gradient-to-r from-sky-400 to-blue-400" /></div>
            <button onClick={() => go("planner")} className="mt-3 text-[10px] font-semibold text-sky-300 hover:text-white">View study plan <ArrowRight size={11} className="ml-1 inline" /></button>
          </div>
          <button onClick={() => go("academics")} className="mt-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[.07]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-400 text-[12px] font-bold text-[#4d351a]">S</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold text-white">Student profile</span><span className="block text-[10px] text-slate-400">AP EAPCET · {region}</span></span><MoreHorizontal size={16} className="text-slate-400" />
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[258px]">
        <header className="site-header sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#090a0c]/95 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button><div><div className="text-[10px] font-medium text-slate-400">Pathwise <span className="mx-1 text-slate-300">/</span> <span className="text-slate-600">{navigation.find((item) => item.id === view)?.label}</span></div><div className="mt-0.5 hidden text-[12px] font-semibold text-slate-700 sm:block">Engineering journey <ChevronDown size={13} className="ml-1 inline text-slate-400" /></div></div></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden h-9 w-[205px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex"><Search size={14} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources..." className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400" /><kbd className="rounded border border-slate-200 bg-white px-1 text-[9px] text-slate-400">⌘ K</kbd></label>
            <button onClick={() => go("advisor")} aria-label="Ask Pathwise advisor" className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"><MessageCircle size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-blue-500" /></button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <button onClick={() => go("academics")} className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8efff] text-[11px] font-bold text-blue-700">ST</span><span className="hidden text-left sm:block"><span className="block text-[11px] font-semibold text-slate-700">Student</span><span className="block text-[9px] text-slate-400">My profile</span></span><ChevronDown size={13} className="hidden text-slate-400 sm:block" /></button>
          </div>
        </header>

        <div className="mx-auto max-w-[1480px] px-4 pb-10 pt-6 sm:px-7 lg:px-9 lg:pt-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.17em] text-orange-400"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> YOUR PATH, AT YOUR PACE</div><h1 className="page-title text-[25px] font-bold tracking-[-.04em] text-slate-100 sm:text-[29px]">{activeInfo.title}</h1><p className="mt-1 text-[12px] text-slate-400">{activeInfo.subtitle}</p></div>
            <div className="flex items-center gap-2"><button onClick={() => go("planner")} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:flex"><CalendarDays size={14} /> This week <ChevronDown size={13} /></button><button onClick={() => go("family")} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"><Users size={14} /> Family view</button></div>
          </div>

          {view === "overview" && <Overview go={go} tasks={tasks} setTasks={setTasks} />}
          {view === "academics" && <Academics rank={rank} setRank={setRank} region={region} setRegion={setRegion} />}
          {view === "planner" && <Planner tasks={tasks} setTasks={setTasks} taskTitle={taskTitle} setTaskTitle={setTaskTitle} addTask={addTask} />}
          {view === "progress" && <ProgressView tasks={tasks} />}
          {view === "advisor" && <Advisor messages={chatMessages} input={chatInput} setInput={setChatInput} send={sendChat} />}
          {view === "careers" && <Careers />}
          {view === "family" && <Family recommended={recommended} priorities={priorities} setPriorities={setPriorities} selectedCollege={selectedCollege} setSelectedCollege={setSelectedCollege} />}
          {view === "wellbeing" && <Wellbeing selectedMood={selectedMood} setSelectedMood={setSelectedMood} focusSeconds={focusSeconds} setFocusSeconds={setFocusSeconds} focusRunning={focusRunning} setFocusRunning={setFocusRunning} />}
          {view === "resources" && <Resources items={filteredResources} query={query} setQuery={setQuery} saved={savedResources} toggle={toggleResource} />}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-4 text-[10px] text-slate-400"><span>Pathwise · Engineering education, made clearer.</span><span>Demo data is illustrative. Always confirm admissions details with official sources.</span></footer>
        </div>
      </main>
    </div>
  );
}

function Overview({ go, tasks, setTasks }: { go: (view: View) => void; tasks: StudyTask[]; setTasks: (value: (tasks: StudyTask[]) => StudyTask[]) => void }) {
  const openTasks = tasks.filter((task) => !task.done).length;
  return <div className="space-y-5">
    <section className="editorial-hero relative isolate flex min-h-[300px] items-end overflow-hidden rounded-[26px] border border-white/10 px-6 py-7 sm:min-h-[340px] sm:px-10 sm:py-9 lg:items-center">
      <div className="relative z-10 max-w-[560px]">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.16em] text-orange-300"><Sparkles size={12} /> A clearer path to what comes next</span>
        <h2 className="editorial-heading max-w-[560px] text-[36px] leading-[1.04] text-white sm:text-[48px] lg:text-[54px]">Your future is built one good decision at a time.</h2>
        <p className="mt-4 max-w-[430px] text-[12px] leading-6 text-slate-300">Make space for the big picture. Find your next study step, explore engineering careers, and plan college choices together.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => go("planner")} className="rounded-md bg-[#f05b3f] px-4 py-3 text-[10px] font-bold text-white transition hover:bg-[#ff704f]">Explore your study plan</button>
          <button onClick={() => go("family")} className="rounded-md border border-white/65 bg-black/20 px-4 py-3 text-[10px] font-semibold text-white transition hover:border-white hover:bg-white/10">Plan as a family</button>
        </div>
      </div>
      <div aria-hidden="true" className="editorial-orbit absolute -right-10 -top-14 hidden h-[370px] w-[370px] rounded-full border border-white/10 lg:block" />
      <div aria-hidden="true" className="absolute right-[6%] top-[12%] hidden h-[76%] w-[34%] rounded-[48%_48%_22%_22%] border border-white/10 bg-gradient-to-b from-white/10 to-transparent lg:block" />
    </section>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Activity} label="Study time this week" value="8.5 hrs" note="+1.5 hrs from last week" change="up" color="blue" bars={[32, 45, 36, 66, 48, 82, 55]} />
      <StatCard icon={Target} label="Weekly goal" value="71%" note="3.5 hours left to your goal" change="up" color="teal" bars={[25, 37, 48, 44, 62, 75, 71]} />
      <StatCard icon={BookOpen} label="Subjects on track" value="2 of 3" note="Chemistry is your strong suit" change="neutral" color="amber" bars={[60, 72, 66, 81, 75, 90, 84]} />
      <StatCard icon={CalendarDays} label="Upcoming tasks" value={String(openTasks).padStart(2, "0")} note="Next up: Mathematics practice" change="neutral" color="violet" bars={[48, 48, 65, 45, 73, 58, 84]} />
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6"><div><SectionTitle title="Weekly learning rhythm" /><p className="-mt-3 text-[10px] text-slate-400">A balanced pace helps you stay consistent.</p></div><button onClick={() => go("progress")} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:text-blue-700">Last 7 days <ChevronDown size={12} className="ml-1 inline" /></button></div>
        <div className="grid grid-cols-7 gap-2 px-5 pb-5 pt-7 sm:px-6">
          {[{ day: "M", hrs: "1.2", h: 42 }, { day: "T", hrs: "1.8", h: 63 }, { day: "W", hrs: "0.9", h: 32 }, { day: "T", hrs: "2.1", h: 76 }, { day: "F", hrs: "1.4", h: 52 }, { day: "S", hrs: "1.1", h: 40 }, { day: "S", hrs: "—", h: 3 }].map((item, index) => <div key={index} className="group flex flex-col items-center gap-2"><span className="text-[9px] font-medium text-slate-400 opacity-0 transition group-hover:opacity-100">{item.hrs}{item.hrs !== "—" ? "h" : ""}</span><div className="flex h-[128px] w-full items-end justify-center rounded-t-lg bg-slate-50"><div className={cn("w-[55%] min-w-[13px] rounded-t-md transition-all group-hover:brightness-95", index === 3 ? "bg-blue-600" : "bg-blue-200")} style={{ height: `${item.h}%` }} /></div><span className={cn("text-[10px]", index === 3 ? "font-bold text-blue-700" : "text-slate-400")}>{item.day}</span></div>)}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-[10px] sm:px-6"><span className="text-slate-400">Total focused study time</span><span className="font-bold text-slate-700">8h 30m <span className="ml-1 font-medium text-emerald-600">↑ 18%</span></span></div>
      </Card>
      <Card className="p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><SectionTitle title="College readiness" /><p className="-mt-3 text-[10px] text-slate-400">Your profile is taking shape</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><GraduationCap size={18} /></span></div>
        <div className="mt-4 flex items-center gap-4"><div className="relative flex h-[98px] w-[98px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#2678e8 0 68%, #e8eef6 68% 100%)" }}><div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white"><span className="text-[21px] font-bold text-slate-900">68%</span><span className="text-[8px] text-slate-400">complete</span></div></div><div className="min-w-0 flex-1 space-y-3"><Readiness label="Academic details" value={88} color="bg-blue-600" /><Readiness label="Exam profile" value={72} color="bg-teal-500" /><Readiness label="Family priorities" value={45} color="bg-amber-400" /></div></div>
        <button onClick={() => go("academics")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100">Complete your profile <ArrowRight size={14} /></button>
      </Card>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between"><SectionTitle title="Today’s focus" /><SmallLink onClick={() => go("planner")}>Full study plan</SmallLink></div>
        <div className="-mt-1 divide-y divide-slate-100">{tasks.slice(0, 3).map((task) => <div key={task.title} className="flex items-center gap-3 py-3"><button aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} onClick={() => setTasks((items) => items.map((item) => item.title === task.title ? { ...item, done: !item.done } : item))} className={cn("flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition", task.done ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 hover:border-blue-500")}>{task.done && <Check size={12} />}</button><div className="min-w-0 flex-1"><div className={cn("truncate text-[11px] font-semibold", task.done ? "text-slate-400 line-through" : "text-slate-700")}>{task.title}</div><div className="mt-1 text-[9px] text-slate-400">{task.subject} <span className="mx-1">·</span> {task.time}</div></div><button aria-label="Task options" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"><MoreHorizontal size={15} /></button></div>)}</div>
        <button onClick={() => go("planner")} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-blue-300 hover:text-blue-700"><Plus size={13} /> Add a study session</button>
      </Card>
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#1b4d88] to-[#2678e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:p-6">
        <div className="flex items-start justify-between"><span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[.12em] text-blue-100">A thoughtful next step</span><Sparkles size={17} className="text-sky-200" /></div>
        <h2 className="mt-5 max-w-[340px] text-[20px] font-bold leading-tight tracking-[-.035em]">Big choices are easier when you make them together.</h2>
        <p className="mt-2 max-w-[360px] text-[11px] leading-5 text-blue-100/85">Compare colleges around budget, branch fit, location, and the future you want to build.</p>
        <button onClick={() => go("family")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[10px] font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50">Explore family decisions <ArrowRight size={14} /></button>
      </Card>
    </div>
  </div>;
}

function StatCard({ icon: Icon, label, value, note, change, color, bars }: { icon: typeof Home; label: string; value: string; note: string; change: "up" | "neutral"; color: "blue" | "teal" | "amber" | "violet"; bars: number[] }) {
  const colors = { blue: "bg-blue-50 text-blue-700", teal: "bg-teal-50 text-teal-700", amber: "bg-amber-50 text-amber-700", violet: "bg-violet-50 text-violet-700" };
  return <Card className="p-4 sm:p-5"><div className="flex items-start justify-between"><span className="text-[10px] font-medium text-slate-500">{label}</span><span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colors[color])}><Icon size={16} /></span></div><div className="mt-3 flex items-end justify-between"><span className="text-[23px] font-bold tracking-[-.045em] text-slate-900">{value}</span><div className="mb-1 flex h-8 items-end gap-[3px]">{bars.map((bar, index) => <span key={index} className={cn("w-[4px] rounded-t-sm", color === "blue" ? "bg-blue-300" : color === "teal" ? "bg-teal-300" : color === "amber" ? "bg-amber-300" : "bg-violet-300")} style={{ height: `${bar}%` }} />)}</div></div><div className="mt-1 flex items-center gap-1.5 text-[9px]"><span className={change === "up" ? "font-semibold text-emerald-600" : "text-slate-400"}>{change === "up" ? <ArrowUpRight size={11} className="inline" /> : <span className="mr-1 inline-block h-1 w-1 rounded-full bg-slate-400" />}</span><span className="truncate text-slate-400">{note}</span></div></Card>;
}

function Readiness({ label, value, color }: { label: string; value: number; color: string }) { return <div><div className="mb-1 flex items-center justify-between text-[9px]"><span className="text-slate-500">{label}</span><span className="font-semibold text-slate-700">{value}%</span></div><ProgressBar value={value} color={color} /></div>; }

function Academics({ rank, setRank, region, setRegion }: { rank: string; setRank: (value: string) => void; region: string; setRegion: (value: string) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
    <div className="space-y-5"><Card className="p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><SectionTitle title="Subject performance" /><p className="-mt-3 text-[10px] text-slate-400">A sample snapshot to help you reflect.</p></div><button className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] text-slate-500">Current term <ChevronDown size={12} className="ml-1 inline" /></button></div><div className="space-y-5">{subjects.map((subject) => <div key={subject.name}><div className="mb-2 flex items-center justify-between"><div><div className="text-[11px] font-semibold text-slate-700">{subject.name}</div><div className="mt-0.5 text-[9px] text-slate-400">{subject.detail}</div></div><span className="text-[15px] font-bold text-slate-800">{subject.score}<span className="text-[9px] font-medium text-slate-400"> / 100</span></span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${subject.score}%`, backgroundColor: subject.color }} /></div></div>)}</div><div className="mt-5 rounded-xl bg-blue-50/70 p-3.5 text-[10px] leading-5 text-blue-900"><Sparkles size={13} className="mr-1.5 inline text-blue-700" /><strong>One idea:</strong> Your physics score has room to grow. Add two short practice sessions this week and review the questions you missed.</div></Card>
      <Card className="p-5 sm:p-6"><SectionTitle title="Exam profile" /><p className="-mt-3 mb-4 text-[10px] text-slate-400">Add your details to personalize the college shortlist.</p><div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-semibold text-slate-600">Entrance exam rank<input value={rank} onChange={(event) => setRank(event.target.value)} type="number" className="mt-1.5 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="e.g. 4200" /></label><label className="text-[10px] font-semibold text-slate-600">Counselling region<select value={region} onChange={(event) => setRegion(event.target.value)} className="mt-1.5 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-medium outline-none focus:border-blue-400"><option>AU region</option><option>OU region</option><option>SVU region</option><option>Open region</option></select></label></div><p className="mt-3 text-[9px] text-slate-400">Profile inputs are kept only in this browser session in this demo.</p></Card></div>
    <div className="space-y-5"><Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><SectionTitle title="Learning strengths" /><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">Good momentum</span></div><div className="mt-1 space-y-4">{[{ name: "Problem solving", value: 82 }, { name: "Consistency", value: 68 }, { name: "Concept recall", value: 76 }].map((item, i) => <Readiness key={item.name} label={item.name} value={item.value} color={["bg-blue-600", "bg-teal-500", "bg-violet-500"][i]} />)}</div></Card><Card className="p-5 sm:p-6"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Lightbulb size={18} /></div><h3 className="text-[13px] font-semibold text-slate-800">Learning tip</h3><p className="mt-1.5 text-[10px] leading-5 text-slate-500">After each practice set, write down one mistake and the idea that would have helped you solve it. Reviewing those notes can make your next session more focused.</p></Card></div>
  </div>;
}

function Planner({ tasks, setTasks, taskTitle, setTaskTitle, addTask }: { tasks: StudyTask[]; setTasks: (value: (tasks: StudyTask[]) => StudyTask[]) => void; taskTitle: string; setTaskTitle: (value: string) => void; addTask: (event: FormEvent) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]"><Card className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><SectionTitle title="This week" /><p className="-mt-3 text-[10px] text-slate-400">A flexible plan that leaves room to rest.</p></div><span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">8.5 / 12 hrs</span></div><div className="mt-4 grid grid-cols-7 gap-2">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => <button key={day} className={cn("rounded-xl border px-1 py-3 text-center transition", i === 3 ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/15" : "border-slate-200 bg-white text-slate-500 hover:border-blue-200")}><span className="block text-[9px] font-medium">{day}</span><span className="mt-2 block text-[12px] font-bold">{19 + i}</span><span className={cn("mx-auto mt-2 block h-1 w-1 rounded-full", [0, 1, 3, 4, 5].includes(i) ? (i === 3 ? "bg-white" : "bg-blue-500") : "bg-transparent")} /></button>)}</div><div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-slate-100" /><span className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Today · Thursday</span><div className="h-px flex-1 bg-slate-100" /></div><div className="space-y-3">{tasks.map((task) => <div key={task.title} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><button onClick={() => setTasks((items) => items.map((item) => item.title === task.title ? { ...item, done: !item.done } : item))} className={cn("flex h-5 w-5 items-center justify-center rounded-md border", task.done ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-transparent")}><Check size={12} /></button><span className={cn("min-w-0 flex-1 truncate text-[10px] font-semibold", task.done && "text-slate-400 line-through")}>{task.title}<span className="mt-1 block text-[9px] font-normal text-slate-400">{task.subject} · {task.time}</span></span><Clock3 size={14} className="text-slate-400" /></div>)}</div><form onSubmit={addTask} className="mt-4 flex gap-2"><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Add a study session..." className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-[10px] outline-none focus:border-blue-400" /><button className="flex h-10 items-center gap-1.5 rounded-xl bg-blue-700 px-3 text-[10px] font-semibold text-white hover:bg-blue-800"><Plus size={13} /> Add</button></form></Card><Card className="p-5 sm:p-6"><SectionTitle title="Study session guide" /><div className="mt-1 flex items-center gap-3 rounded-xl bg-blue-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-700"><Timer size={17} /></span><span><span className="block text-[11px] font-semibold text-slate-700">Focus, then recharge</span><span className="block mt-0.5 text-[9px] text-slate-500">Try 25 minutes of focus and a short break.</span></span></div><div className="mt-4 space-y-3 text-[10px] leading-5 text-slate-500"><p><strong className="text-slate-700">1. Choose one outcome.</strong> Keep the session specific, like solving five problems.</p><p><strong className="text-slate-700">2. Put distractions away.</strong> Keep only the material you need in reach.</p><p><strong className="text-slate-700">3. Close with a recap.</strong> Note what you understood and what you want to revisit.</p></div></Card></div>;
}

function ProgressView({ tasks }: { tasks: StudyTask[] }) {
  const complete = tasks.filter((task) => task.done).length;
  return <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]"><Card className="p-5 sm:p-6"><SectionTitle title="Goals this month" /><div className="mt-1 space-y-5">{[{ title: "Build a steady study routine", value: 71, meta: "8.5 of 12 weekly hours", color: "bg-blue-600" }, { title: "Strengthen physics fundamentals", value: 64, meta: "4 of 6 topic sets reviewed", color: "bg-teal-500" }, { title: "Explore engineering branches", value: 45, meta: "3 of 7 pathways explored", color: "bg-violet-500" }].map((goal) => <div key={goal.title}><div className="mb-2 flex items-end justify-between"><div><div className="text-[11px] font-semibold text-slate-700">{goal.title}</div><div className="mt-1 text-[9px] text-slate-400">{goal.meta}</div></div><span className="text-[12px] font-bold text-slate-700">{goal.value}%</span></div><ProgressBar value={goal.value} color={goal.color} /></div>)}</div></Card><div className="space-y-5"><Card className="p-5 sm:p-6"><SectionTitle title="A week of consistency" /><div className="mt-3 flex items-end justify-between gap-2">{[1, 1, 0, 1, 1, 1, 0].map((active, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><span className={cn("flex h-9 w-9 items-center justify-center rounded-full", active ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-300")}>{active ? <Check size={15} /> : <span className="h-1 w-1 rounded-full bg-slate-300" />}</span><span className="text-[9px] text-slate-400">{"MTWTFSS"[i]}</span></div>)}</div><p className="mt-4 text-[10px] leading-5 text-slate-500">You showed up on five days this week. That is a strong foundation to build on.</p></Card><Card className="p-5 sm:p-6"><SectionTitle title="Tasks completed" /><div className="flex items-center gap-4"><span className="text-[30px] font-bold tracking-tight text-slate-900">{complete}<span className="text-[15px] text-slate-400"> / {tasks.length}</span></span><span className="text-[10px] text-slate-500">planned sessions complete</span></div><div className="mt-3"><ProgressBar value={tasks.length ? (complete / tasks.length) * 100 : 0} /></div></Card></div></div>;
}

function Advisor({ messages, input, setInput, send }: { messages: { role: "assistant" | "user"; text: string }[]; input: string; setInput: (value: string) => void; send: (event?: FormEvent) => void }) {
  const suggestions = ["Help me make a study plan", "How should I compare colleges?", "What engineering branches can I explore?"];
  return <div className="mx-auto grid max-w-[1100px] gap-5 xl:grid-cols-[1.5fr_.8fr]"><Card className="flex min-h-[530px] flex-col overflow-hidden"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white"><BrainCircuit size={18} /></span><span className="flex-1"><span className="block text-[12px] font-semibold text-slate-800">Pathwise study advisor</span><span className="mt-0.5 flex items-center gap-1 text-[9px] text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready to help · demo</span></span><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><MoreHorizontal size={17} /></button></div><div className="thin-scrollbar flex-1 space-y-4 overflow-auto p-5">{messages.map((message, i) => <div key={i} className={cn("flex gap-2.5", message.role === "user" && "justify-end")}>
      {message.role === "assistant" && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Sparkles size={14} /></span>}
      <p className={cn("max-w-[82%] rounded-2xl px-3.5 py-3 text-[10px] leading-5", message.role === "assistant" ? "rounded-tl-sm bg-slate-50 text-slate-600" : "rounded-tr-sm bg-blue-700 text-white")}>{message.text}</p>
    </div>)}</div><form onSubmit={send} className="border-t border-slate-100 p-4"><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pl-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about studying, admissions, or careers..." className="min-w-0 flex-1 bg-transparent text-[10px] outline-none" /><button aria-label="Send message" className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800"><Send size={14} /></button></div><p className="mt-2 text-center text-[8px] text-slate-400">Guidance is generated from simple demo responses and is not a substitute for official advice.</p></form></Card><div className="space-y-5"><Card className="p-5"><SectionTitle title="Try asking" /><div className="space-y-2">{suggestions.map((text) => <button key={text} onClick={() => { setInput(text); }} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left text-[9px] leading-4 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50/50">{text}<ArrowUpRight size={13} className="ml-2 shrink-0 text-blue-600" /></button>)}</div></Card><Card className="bg-amber-50/70 p-5"><div className="flex gap-2.5"><CircleHelp size={16} className="shrink-0 text-amber-600" /><div><h3 className="text-[10px] font-semibold text-amber-900">Verify important details</h3><p className="mt-1 text-[9px] leading-4 text-amber-800/80">Cutoffs, fees, scholarships, and admissions rules can change. Confirm them with official sources.</p></div></div></Card></div></div>;
}

function Careers() {
  return <div><div className="mb-5 grid gap-4 md:grid-cols-3">{careers.map((career) => { const Icon = career.icon; return <Card key={career.title} className="p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", career.color === "blue" ? "bg-blue-50 text-blue-700" : career.color === "violet" ? "bg-violet-50 text-violet-700" : "bg-teal-50 text-teal-700")}><Icon size={19} /></span><span className="rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500">{career.tag}</span></div><h2 className="mt-4 text-[13px] font-bold text-slate-800">{career.title}</h2><p className="mt-1.5 min-h-[48px] text-[10px] leading-5 text-slate-500">{career.description}</p><div className="mt-4 border-t border-slate-100 pt-3"><div className="mb-2 text-[8px] font-bold uppercase tracking-[.12em] text-slate-400">Skills to explore</div><div className="flex flex-wrap gap-1.5">{career.skills.map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-medium text-slate-600">{skill}</span>)}</div></div><button className="mt-4 inline-flex items-center gap-1 text-[9px] font-semibold text-blue-700">Explore this path <ArrowRight size={12} /></button></Card>; })}</div><Card className="flex flex-wrap items-center justify-between gap-4 bg-[#eaf3ff] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700"><Lightbulb size={19} /></span><div><h2 className="text-[12px] font-semibold text-slate-800">Not sure where to start?</h2><p className="mt-1 text-[10px] text-slate-500">Try a short project or talk to someone working in a field you like.</p></div></div><span className="rounded-xl bg-white px-3 py-2 text-[9px] font-medium text-blue-800">Curiosity is a good first step</span></Card></div>;
}

function Family({ recommended, priorities, setPriorities, selectedCollege, setSelectedCollege }: { recommended: (typeof colleges)[number][]; priorities: { affordability: number; location: number; branch: number; placements: number }; setPriorities: (value: typeof priorities) => void; selectedCollege: string; setSelectedCollege: (value: string) => void }) {
  const labels: [keyof typeof priorities, string][] = [["affordability", "Affordability"], ["location", "Closer to home"], ["branch", "Preferred branch"], ["placements", "Placement outcomes"]];
  return <div className="space-y-5"><Card className="overflow-hidden bg-gradient-to-r from-[#17355c] to-[#246fca] p-5 text-white sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-blue-100"><Users size={11} /> Family decision space</div><h2 className="text-[18px] font-bold tracking-tight">A good choice makes room for everyone’s priorities.</h2><p className="mt-1 max-w-[600px] text-[10px] leading-5 text-blue-100/80">Adjust what matters most and use the shortlist as a starting point for a conversation.</p></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Heart size={22} /></span></div></Card>
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.8fr]"><Card className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><SectionTitle title="College options to explore" /><p className="-mt-3 text-[9px] text-slate-400">Sample shortlist · estimates are illustrative.</p></div><span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-semibold text-blue-700">3 options</span></div><div className="mt-3 space-y-3">{recommended.map((college) => <button key={college.name} onClick={() => setSelectedCollege(college.name)} className={cn("w-full rounded-xl border p-4 text-left transition", selectedCollege === college.name ? "border-blue-400 bg-blue-50/40 shadow-sm" : "border-slate-200 hover:border-blue-200")}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: college.color }}>{college.name.split(" ").map((part) => part[0]).join("").slice(0, 3)}</span><span><span className="block text-[11px] font-semibold text-slate-800">{college.name}</span><span className="mt-0.5 block text-[9px] text-slate-400">{college.branch} · {college.place}</span></span></div><span className={cn("rounded-full px-2.5 py-1 text-[8px] font-semibold", college.chance === "Dream" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700")}>{college.chance}</span></div><div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3"><div><div className="text-[8px] text-slate-400">Fit score</div><div className="mt-1 text-[11px] font-bold text-slate-700">{college.fit}%</div></div><div><div className="text-[8px] text-slate-400">Indicative tuition / year</div><div className="mt-1 text-[11px] font-bold text-slate-700">{college.fee}</div></div><div><div className="text-[8px] text-slate-400">Your shortlist</div><div className="mt-1 text-[10px] font-semibold text-blue-700">{selectedCollege === college.name ? "Selected" : "Compare"}</div></div></div></button>)}</div><div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/70 p-3 text-[9px] leading-4 text-amber-900"><ShieldCheck size={13} className="mr-1.5 inline" /> Cutoffs, fees, and chance labels in this demo are illustrative only. Check current official counselling information.</div></Card>
      <Card className="p-5 sm:p-6"><SectionTitle title="What matters to you?" /><p className="-mt-3 mb-5 text-[9px] text-slate-400">Tune the priorities for this comparison.</p><div className="space-y-5">{labels.map(([key, label]) => <label key={key} className="block"><span className="mb-2 flex justify-between text-[9px]"><span className="font-medium text-slate-600">{label}</span><span className="font-bold text-blue-700">{priorities[key]}%</span></span><input aria-label={`${label} priority`} type="range" min="0" max="100" value={priorities[key]} onChange={(event) => setPriorities({ ...priorities, [key]: Number(event.target.value) })} className="h-1 w-full cursor-pointer accent-blue-600" /></label>)}</div><div className="mt-6 rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700"><MessageCircle size={14} className="text-blue-600" /> Family conversation starter</div><p className="mt-2 text-[9px] leading-5 text-slate-500">“Which one matters most to us right now: the branch, the cost, the location, or future opportunities?”</p></div></Card></div></div>;
}

function Wellbeing({ selectedMood, setSelectedMood, focusSeconds, setFocusSeconds, focusRunning, setFocusRunning }: { selectedMood: string; setSelectedMood: (value: string) => void; focusSeconds: number; setFocusSeconds: (value: number) => void; focusRunning: boolean; setFocusRunning: (value: boolean) => void }) {
  const moods = ["Energized", "Good", "Okay", "Tired", "Overwhelmed"];
  const time = `${String(Math.floor(focusSeconds / 60)).padStart(2, "0")}:${String(focusSeconds % 60).padStart(2, "0")}`;
  return <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]"><Card className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><SectionTitle title="Focus & break timer" /><p className="-mt-3 text-[9px] text-slate-400">A gentle structure for a focused study session.</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Timer size={18} /></span></div><div className="mt-5 flex flex-col items-center rounded-2xl bg-[#f4f7fb] px-5 py-8"><div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-[7px] border-blue-100 bg-white shadow-inner"><span className="text-[31px] font-bold tracking-tight text-blue-800">{time}</span><span className="mt-1 text-[9px] text-slate-400">{focusRunning ? "FOCUSING" : "READY WHEN YOU ARE"}</span></div><div className="mt-5 flex gap-2"><button onClick={() => setFocusRunning(!focusRunning)} className="rounded-xl bg-blue-700 px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-blue-800">{focusRunning ? "Pause timer" : focusSeconds === 0 ? "Start again" : "Start focus"}</button><button onClick={() => { setFocusRunning(false); setFocusSeconds(25 * 60); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">Reset</button></div><p className="mt-4 text-center text-[8px] text-slate-400">Take a short break after your session. Stretch, hydrate, and rest your eyes.</p></div></Card>
    <div className="space-y-5"><Card className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><SectionTitle title="Daily balance check-in" /><p className="-mt-3 text-[9px] text-slate-400">How are you feeling about today?</p></div><Heart size={17} className="text-rose-500" /></div><div className="mt-4 grid grid-cols-5 gap-2">{moods.map((mood, i) => <button key={mood} onClick={() => setSelectedMood(mood)} className={cn("rounded-xl border px-1 py-2.5 text-center transition", selectedMood === mood ? "border-blue-300 bg-blue-50" : "border-slate-100 hover:bg-slate-50")}><span className="block text-[17px]">{["😊", "🙂", "😐", "😴", "😟"][i]}</span><span className="mt-1 block text-[7px] font-medium text-slate-500">{mood}</span></button>)}</div><div className="mt-4 rounded-xl bg-emerald-50/70 p-3 text-[9px] leading-4 text-emerald-900"><Check size={13} className="mr-1 inline" /> Check-in saved for this session: feeling {selectedMood.toLowerCase()}.</div></Card><Card className="p-5 sm:p-6"><SectionTitle title="Small habits, real support" /><div className="mt-3 grid gap-3 sm:grid-cols-2">{[{ title: "Take a screen break", text: "Look away from your screen between sessions." }, { title: "Keep water close", text: "A simple reminder to stay hydrated." }, { title: "Protect your sleep", text: "Rest helps you learn and remember." }, { title: "Ask for support", text: "Talk with someone you trust when stress builds." }].map((item, i) => <div key={item.title} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-[9px] font-semibold text-slate-700"><span className={cn("flex h-6 w-6 items-center justify-center rounded-lg", i === 3 ? "bg-rose-50 text-rose-600" : "bg-white text-blue-600")}><Heart size={12} /></span>{item.title}</div><p className="mt-2 text-[8px] leading-4 text-slate-500">{item.text}</p></div>)}</div><p className="mt-3 text-[8px] text-slate-400">This is general wellbeing support, not medical or psychological care.</p></Card></div></div>;
}

function Resources({ items, query, setQuery, saved, toggle }: { items: typeof resources; query: string; setQuery: (value: string) => void; saved: string[]; toggle: (title: string) => void }) {
  const colors: Record<string, string> = { blue: "bg-blue-50 text-blue-700", violet: "bg-violet-50 text-violet-700", amber: "bg-amber-50 text-amber-700", teal: "bg-teal-50 text-teal-700", rose: "bg-rose-50 text-rose-700", green: "bg-emerald-50 text-emerald-700" };
  return <div><Card className="mb-5 p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]"><label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={14} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topic, exam, or resource..." className="min-w-0 flex-1 text-[10px] outline-none" /></label><select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[10px] text-slate-500"><option>All subjects</option><option>Admissions</option><option>Study guides</option><option>Careers</option></select><select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[10px] text-slate-500"><option>All access types</option><option>Free resources</option><option>Saved</option></select></div></Card><div className="mb-4 flex items-center justify-between"><span className="text-[10px] text-slate-400">{items.length} practical guides <span className="mx-1">·</span> {saved.length} saved</span><button className="text-[9px] font-semibold text-blue-700">Recently added <ChevronDown size={11} className="ml-1 inline" /></button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => { const Icon = item.icon; const isSaved = saved.includes(item.title); return <Card key={item.title} className="p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", colors[item.color])}><Icon size={17} /></span><button aria-label={isSaved ? "Remove saved resource" : "Save resource"} onClick={() => toggle(item.title)} className={cn("rounded-lg p-1.5", isSaved ? "text-blue-700" : "text-slate-300 hover:text-blue-600")}><Heart size={15} fill={isSaved ? "currentColor" : "none"} /></button></div><span className="mt-4 inline-block rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500">{item.type}</span><h2 className="mt-2 text-[11px] font-semibold text-slate-800">{item.title}</h2><div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[8px] text-slate-400">{item.read} read <span className="mx-1">·</span> Free</span><button className="text-[9px] font-semibold text-blue-700">Open resource <ArrowUpRight size={11} className="ml-1 inline" /></button></div></Card>; })}</div>{items.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center"><Search size={20} className="mx-auto text-slate-300" /><p className="mt-3 text-[11px] font-semibold text-slate-600">No resources match that search.</p><button onClick={() => setQuery("")} className="mt-2 text-[9px] font-semibold text-blue-700">Clear search</button></div>}</div>;
}
