"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Award, Banknote, BookOpen, Building2,
  Check, CheckCircle2, ChevronDown, CircleHelp, Compass, GraduationCap, Heart, IndianRupee,
  MapPin, Menu, ShieldCheck, SlidersHorizontal, Sparkles, Target, TrendingUp, Users, Wallet,
} from "lucide-react";

type Persona = "student" | "parent";
type Step = "welcome" | "academics" | "diagnostic" | "dashboard";
type Category = "OC" | "EWS" | "BC" | "SC" | "ST";
type Region = "AU" | "SVU" | "OU" | "Open";
type Entrance = "eapcet" | "jee" | "advanced";

type AcademicProfile = {
  board: string; tenth: string; group: string; pcm: string; jeeApplication: string;
  jeePercentile: string; jeeRank: string; examState: string; eapcetMarks: string;
  eapcetRank: string; advancedQualified: string; advancedRank: string; region: Region;
  category: Category; bcSubcategory: string; girlsQuota: boolean; reimbursement: boolean;
};

type College = {
  name: string; code: string; city: string; region: Region; branch: string;
  entrance: Entrance; cutoff: number; categoryRelaxation: number; fees: number;
  package: number; placement: number; branchFit: number; safety: number; brand: number;
  accent: string; badge: string;
};

const initialProfile: AcademicProfile = {
  board: "CBSE", tenth: "", group: "MPC", pcm: "", jeeApplication: "", jeePercentile: "",
  jeeRank: "", examState: "Andhra Pradesh", eapcetMarks: "", eapcetRank: "",
  advancedQualified: "No", advancedRank: "", region: "AU", category: "OC",
  bcSubcategory: "BC-A", girlsQuota: false, reimbursement: false,
};

const colleges: College[] = [
  { name: "IIT Hyderabad", code: "IITH", city: "Hyderabad", region: "OU", branch: "Computer Science", entrance: "advanced", cutoff: 850, categoryRelaxation: 0.35, fees: 280000, package: 2200000, placement: 96, branchFit: 98, safety: 91, brand: 99, accent: "from-orange-500 to-rose-500", badge: "IIT" },
  { name: "NIT Warangal", code: "NITW", city: "Warangal", region: "OU", branch: "Computer Science", entrance: "jee", cutoff: 4200, categoryRelaxation: 0.55, fees: 175000, package: 1850000, placement: 94, branchFit: 97, safety: 92, brand: 97, accent: "from-rose-500 to-orange-400", badge: "NIT" },
  { name: "JNTU Hyderabad", code: "JNTUH", city: "Hyderabad", region: "OU", branch: "Computer Science", entrance: "eapcet", cutoff: 1800, categoryRelaxation: 0.38, fees: 65000, package: 950000, placement: 86, branchFit: 96, safety: 86, brand: 91, accent: "from-violet-600 to-indigo-500", badge: "Top pick" },
  { name: "College of Engineering, AU", code: "AUCE", city: "Visakhapatnam", region: "AU", branch: "Computer Science", entrance: "eapcet", cutoff: 1450, categoryRelaxation: 0.42, fees: 60000, package: 920000, placement: 84, branchFit: 96, safety: 91, brand: 93, accent: "from-blue-600 to-cyan-500", badge: "University" },
  { name: "JNTU Kakinada", code: "JNTUK", city: "Kakinada", region: "AU", branch: "Computer Science", entrance: "eapcet", cutoff: 2600, categoryRelaxation: 0.45, fees: 60000, package: 780000, placement: 80, branchFit: 95, safety: 89, brand: 89, accent: "from-indigo-600 to-blue-500", badge: "Strong fit" },
  { name: "CBIT", code: "CBIT", city: "Hyderabad", region: "OU", branch: "Computer Science", entrance: "eapcet", cutoff: 900, categoryRelaxation: 0.34, fees: 140000, package: 1100000, placement: 89, branchFit: 97, safety: 87, brand: 91, accent: "from-emerald-500 to-teal-500", badge: "Industry ready" },
  { name: "Vasavi College of Engineering", code: "VASV", city: "Hyderabad", region: "OU", branch: "Computer Science", entrance: "eapcet", cutoff: 1250, categoryRelaxation: 0.36, fees: 135000, package: 1000000, placement: 88, branchFit: 96, safety: 90, brand: 89, accent: "from-amber-500 to-orange-400", badge: "Student favorite" },
  { name: "VR Siddhartha Engineering College", code: "VRSEC", city: "Vijayawada", region: "AU", branch: "Computer Science", entrance: "eapcet", cutoff: 3400, categoryRelaxation: 0.43, fees: 95000, package: 720000, placement: 77, branchFit: 94, safety: 91, brand: 83, accent: "from-sky-500 to-blue-500", badge: "Great community" },
  { name: "SVU College of Engineering", code: "SVUCE", city: "Tirupati", region: "SVU", branch: "Computer Science", entrance: "eapcet", cutoff: 3100, categoryRelaxation: 0.44, fees: 55000, package: 710000, placement: 76, branchFit: 94, safety: 93, brand: 86, accent: "from-fuchsia-500 to-violet-500", badge: "University" },
];

const questions = [
  { eyebrow: "Your interests", title: "Which engineering spaces spark your curiosity?", type: "domain", options: ["Software & AI", "Electronics & robotics", "Mechanical & automotive", "Civil & infrastructure"] },
  { eyebrow: "Your priorities", title: "What matters more in your college choice?", type: "tradeoff", options: ["Computer Science at a growing college", "A core branch at a top university", "I’m open to either — show me the best fit"] },
  { eyebrow: "Family finances", title: "What annual out-of-pocket budget feels comfortable?", type: "budget", options: ["Under ₹1.5 lakh", "₹1.5–3.5 lakh", "Above ₹3.5 lakh"] },
  { eyebrow: "Your home base", title: "How far from home would you feel comfortable studying?", type: "distance", options: ["Within my district", "Within 300 km", "Anywhere in India"] },
  { eyebrow: "Life after college", title: "What’s your current post-graduation direction?", type: "goal", options: ["Industry placements", "Higher studies · M.Tech / MS", "Civil services or government roles"] },
  { eyebrow: "A shared decision", title: "What should your family weigh most heavily?", type: "values", options: ["Campus safety", "Hostel & student life", "Coding culture", "NIRF ranking"] },
] as const;

type Answers = { domain: string; tradeoff: string; budget: string; loan: boolean; distance: string; goal: string; values: string[]; ratings: Record<string, number> };
type Weights = { placement: number; affordability: number; location: number; branch: number };

const initialAnswers: Answers = { domain: "", tradeoff: "", budget: "", loan: false, distance: "", goal: "", values: [], ratings: {} };
const initialWeights: Weights = { placement: 32, affordability: 26, location: 16, branch: 26 };
const formatINR = (value: number) => value >= 100000 ? `₹${(value / 100000).toFixed(value % 100000 ? 1 : 0)}L` : `₹${Math.round(value / 1000)}k`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[13px] font-semibold text-slate-700">{label}</span>{children}{hint && <span className="mt-1.5 block text-[11px] text-slate-400">{hint}</span>}</label>;
}

function SelectInput({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder?: string }) {
  return <div className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
    {placeholder && <option value="">{placeholder}</option>}{options.map((option) => <option key={option}>{option}</option>)}
  </select><ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" /></div>;
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <input value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />;
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${inverse ? "bg-white/15 text-white" : "bg-violet-100 text-violet-700"}`}><Compass size={19} strokeWidth={2.2} /></span><span className={`text-[19px] font-bold tracking-[-.045em] ${inverse ? "text-white" : "text-slate-900"}`}>pathwise<span className={inverse ? "text-violet-200" : "text-violet-600"}>.</span></span></div>;
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [persona, setPersona] = useState<Persona>("student");
  const [profile, setProfile] = useState<AcademicProfile>(initialProfile);
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [weights, setWeights] = useState<Weights>(initialWeights);
  const [showAll, setShowAll] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const updateProfile = <K extends keyof AcademicProfile>(key: K, value: AcademicProfile[K]) => setProfile((current) => ({ ...current, [key]: value }));
  const selectedBranch = answers.domain === "Electronics & robotics" ? "Electronics & Communication" : answers.domain === "Mechanical & automotive" ? "Mechanical" : answers.domain === "Civil & infrastructure" ? "Civil" : "Computer Science";
  const fitIndex = useMemo(() => {
    const pcm = Math.min(100, Math.max(0, Number(profile.pcm) || 0));
    const rank = Number(profile.eapcetRank) || Number(profile.jeeRank) || 25000;
    const rankScore = profile.eapcetRank ? Math.max(25, 100 - Math.log10(Math.max(rank, 1)) * 14) : profile.jeePercentile ? Number(profile.jeePercentile) : 62;
    const diagnostics = (answers.domain ? 20 : 0) + (answers.goal ? 20 : 0) + (answers.tradeoff ? 20 : 0) + (answers.budget ? 20 : 0) + (answers.distance ? 10 : 0) + (answers.values.length ? 10 : 0);
    return Math.round(Math.min(100, Math.max(0, pcm * 0.35 + rankScore * 0.4 + diagnostics * 0.25)));
  }, [profile.pcm, profile.eapcetRank, profile.jeeRank, profile.jeePercentile, answers]);

  const rankedColleges = useMemo(() => {
    const applicantRank = (entrance: Entrance) => {
      if (entrance === "advanced") return Number(profile.advancedRank) || 16000;
      if (entrance === "jee") return Number(profile.jeeRank) || (profile.jeePercentile ? Math.max(1000, Math.round((100 - Number(profile.jeePercentile)) * 12000)) : 18000);
      return Number(profile.eapcetRank) || 18000;
    };
    const categoryFactor = profile.category === "SC" ? 2.45 : profile.category === "ST" ? 2.8 : profile.category === "BC" ? 1.55 : profile.category === "EWS" ? 1.2 : 1;
    return colleges.map((college) => {
      const regionFactor = college.region === profile.region ? 1.12 : profile.region === "Open" ? 1 : 0.88;
      const girlFactor = profile.girlsQuota ? 1.08 : 1;
      const cutoff = college.cutoff * (1 + (categoryFactor - 1) * college.categoryRelaxation) * regionFactor * girlFactor;
      const rank = applicantRank(college.entrance);
      const probability = Math.max(3, Math.min(96, Math.round(50 + (cutoff - rank) / Math.max(cutoff * 0.55, 1) * 40)));
      const effectiveFees = profile.reimbursement && college.fees <= 100000 ? Math.max(0, college.fees - 70000) : college.fees;
      const budgetCeiling = (answers.budget === "Under ₹1.5 lakh" ? 150000 : answers.budget === "₹1.5–3.5 lakh" ? 350000 : answers.budget === "Above ₹3.5 lakh" ? 500000 : 250000) + (answers.loan ? 100000 : 0);
      const feeScore = Math.max(5, Math.min(100, 100 - (effectiveFees / budgetCeiling) * 15 - (Math.max(0, effectiveFees - budgetCeiling) / budgetCeiling) * 50));
      const locationScore = college.region === profile.region ? 92 : profile.region === "Open" ? 74 : 65;
      const branchScore = answers.domain ? Math.max(35, college.branch.includes(selectedBranch.split(" ")[0]) ? college.branchFit : college.branchFit - 27) : college.branchFit;
      const weightTotal = weights.placement + weights.affordability + weights.location + weights.branch;
      const weightedScore = college.placement * weights.placement + feeScore * weights.affordability + locationScore * weights.location + branchScore * weights.branch;
      const suitability = Math.round(weightTotal === 0 ? (college.placement + feeScore + locationScore + branchScore) / 4 : weightedScore / weightTotal);
      return { ...college, probability, suitability, effectiveFees, cutoff: Math.round(cutoff) };
    }).sort((a, b) => b.suitability - a.suitability);
  }, [profile, answers.domain, answers.budget, answers.loan, selectedBranch, weights]);

  const alignmentScore = useMemo(() => {
    let score = 72;
    if (answers.budget === "Under ₹1.5 lakh" && profile.reimbursement) score += 9;
    if (answers.distance === "Within my district" && profile.region !== "Open") score += 5;
    if (answers.values.includes("Campus safety")) score += 6;
    if (answers.goal === "Industry placements" && answers.domain === "Software & AI") score += 5;
    return Math.min(97, score);
  }, [answers, profile.reimbursement, profile.region]);

  const recommended = showAll ? rankedColleges : rankedColleges.slice(0, 6);
  const answerValue = (type: typeof questions[number]["type"]) => {
    if (type === "values") return answers.values;
    return answers[type];
  };
  const setAnswer = (type: typeof questions[number]["type"], value: string) => {
    if (type === "values") setAnswers((current) => {
      const values = current.values.includes(value) ? current.values.filter((item) => item !== value) : [...current.values, value];
      return { ...current, values, ratings: { ...current.ratings, [value]: values.includes(value) ? (current.ratings[value] || 3) : 0 } };
    });
    else setAnswers((current) => ({ ...current, [type]: value }));
  };
  const setValueRating = (value: string, rating: number) => setAnswers((current) => ({
    ...current,
    values: current.values.includes(value) ? current.values : [...current.values, value],
    ratings: { ...current.ratings, [value]: rating },
  }));
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc]">
      <header className="relative z-20 mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand />
        <div className="hidden items-center gap-8 text-[13px] font-medium text-slate-500 md:flex">
          {step === "dashboard" ? <><span className="text-violet-700">Your shortlist</span><span>How it works</span><span>About us</span><button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-600"><CircleHelp size={15} /> Need a hand?</button></> : <><span>How it works</span><span>For families</span><span>About us</span><button onClick={() => { setPersona("parent"); setStep("academics"); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-600 transition hover:border-violet-200 hover:text-violet-700">I’m a parent</button></>}
        </div>
        <button aria-label="Open navigation" onClick={() => setMobileMenu((open) => !open)} className="rounded-lg p-2 text-slate-600 md:hidden"><Menu size={21} /></button>
        {mobileMenu && <div className="absolute right-5 top-[65px] z-30 flex min-w-48 flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-soft md:hidden"><button onClick={() => setMobileMenu(false)} className="rounded-xl px-3 py-2.5 text-left text-sm text-slate-600">How it works</button><button onClick={() => { setPersona("parent"); setStep("academics"); setMobileMenu(false); }} className="rounded-xl px-3 py-2.5 text-left text-sm text-violet-700">I’m a parent</button></div>}
      </header>

      {step === "welcome" && (
        <section className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1440px] items-center gap-12 px-5 pb-16 pt-7 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:px-12 lg:pb-24 lg:pt-0">
          <div className="absolute -left-52 top-[8%] h-[530px] w-[530px] rounded-full bg-violet-100/70 blur-[100px]" />
          <div className="absolute right-[10%] top-[12%] h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-[100px]" />
          <div className="relative z-10 max-w-[610px] py-10 lg:py-0">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-violet-700 shadow-sm"><Sparkles size={14} /> A clearer way to choose what’s next</div>
            <h1 className="max-w-[620px] text-[43px] font-semibold leading-[1.09] tracking-[-.055em] text-slate-900 sm:text-[58px] lg:text-[64px]">The right engineering college starts with <span className="text-violet-600">your story.</span></h1>
            <p className="mt-6 max-w-[475px] text-[16px] leading-7 text-slate-500 sm:text-[17px]">Data-backed engineering admission decisions, made together. Find colleges that fit your rank, your budget, and the future you’re imagining.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { setPersona("student"); setStep("academics"); }} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(99,68,214,.22)] transition hover:-translate-y-0.5 hover:bg-violet-700">I’m a student <ArrowRight size={16} className="transition group-hover:translate-x-0.5" /></button>
              <button onClick={() => { setPersona("parent"); setStep("academics"); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"><Users size={16} /> I’m a parent</button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] text-slate-400"><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Your data stays private</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span>No account needed</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span>About 5 minutes</span></div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[590px]">
            <div className="absolute -left-5 top-20 z-20 hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card sm:block">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp size={19} /></span><div><div className="text-[11px] text-slate-400">Placement outlook</div><div className="mt-0.5 text-sm font-semibold text-slate-800">Strong fit found</div></div><ArrowUpRight size={15} className="text-emerald-500" /></div>
            </div>
            <div className="absolute -right-2 bottom-16 z-20 hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card sm:block"><div className="flex items-center gap-3"><div className="flex -space-x-2"><div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[10px] font-bold text-violet-700">S</div><div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-bold text-amber-700">P</div></div><div><div className="text-[11px] text-slate-400">Decisions made together</div><div className="text-sm font-semibold text-slate-800">92% aligned</div></div></div></div>
            <div className="rounded-[30px] border border-white/80 bg-white/90 p-3 shadow-[0_35px_90px_rgba(61,45,113,.13)] backdrop-blur sm:p-4">
              <div className="app-grid relative overflow-hidden rounded-[23px] bg-[#f6f4fb] p-5 sm:p-7">
                <div className="relative z-10 flex items-center justify-between"><div><div className="text-xs font-medium text-slate-500">Your decision, made clearer</div><div className="mt-1 text-lg font-semibold tracking-tight text-slate-900">A shortlist that feels right</div></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm"><Target size={19} /></span></div>
                <div className="relative z-10 mt-6 rounded-2xl border border-violet-100/70 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-sm font-bold text-white">AU</div><div><div className="text-sm font-semibold text-slate-800">Andhra University</div><div className="mt-0.5 text-[11px] text-slate-400">AUCE · Computer Science</div></div></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Realistic</span></div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5"><div><div className="text-[10px] text-slate-400">Your chance</div><div className="mt-1 text-sm font-semibold text-emerald-600">Good fit</div></div><div><div className="text-[10px] text-slate-400">Est. fees / yr</div><div className="mt-1 text-sm font-semibold text-slate-700">₹60k</div></div><div><div className="text-[10px] text-slate-400">Median package</div><div className="mt-1 text-sm font-semibold text-slate-700">₹9.2 LPA</div></div></div>
                </div>
                <div className="relative z-10 mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white bg-white/80 p-3.5"><div className="flex items-center justify-between"><span className="text-[11px] text-slate-500">Family alignment</span><Heart size={14} className="text-violet-500" /></div><div className="mt-2 flex items-end gap-1"><span className="text-2xl font-semibold tracking-tight">92</span><span className="mb-1 text-[11px] text-slate-400">/ 100</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" /></div></div><div className="rounded-2xl border border-white bg-white/80 p-3.5"><div className="flex items-center justify-between"><span className="text-[11px] text-slate-500">4-year value</span><Banknote size={14} className="text-emerald-500" /></div><div className="mt-2 text-2xl font-semibold tracking-tight">8.4<span className="ml-1 text-sm text-slate-500">×</span></div><div className="mt-1 text-[10px] text-slate-400">projected return on cost</div></div></div>
                <div className="pointer-events-none absolute -bottom-16 -right-20 h-64 w-64 rounded-full border border-violet-200/70" /><div className="pointer-events-none absolute -bottom-6 -right-10 h-44 w-44 rounded-full border border-violet-200/50" />
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-1.5"><span className="h-1.5 w-6 rounded-full bg-violet-500" /><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /></div>
          </div>
        </section>
      )}

      {step === "academics" && (
        <section className="mx-auto max-w-[1040px] px-5 pb-16 pt-5 sm:px-8">
          <div className="mb-8 flex items-center justify-between">
            <button onClick={() => setStep("welcome")} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-violet-700"><ArrowLeft size={15} /> Back</button>
            <div className="flex items-center gap-2 text-[11px] font-medium text-violet-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">1</span> Your academics <span className="mx-1 text-slate-300">—</span><span className="text-slate-400">2 of 3</span></div>
          </div>
          <div className="mb-7 h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-1/3 rounded-full bg-violet-500 transition-all" /></div>
          <div className="mb-7"><div className="mb-2 text-[11px] font-semibold uppercase tracking-[.13em] text-violet-600">A strong start</div><h1 className="text-3xl font-semibold tracking-[-.04em] text-slate-900 sm:text-[36px]">Let’s get to know your academics.</h1><p className="mt-2 text-sm leading-6 text-slate-500">A few details help us make your shortlist genuinely yours. Estimates are okay — you can refine them later.</p></div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><BookOpen size={18} /></span><div><h2 className="text-sm font-semibold text-slate-800">Secondary education <span className="font-normal text-slate-400">(Class 10)</span></h2><p className="mt-0.5 text-xs text-slate-400">Your foundational academic record</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Education board"><SelectInput value={profile.board} onChange={(value) => updateProfile("board", value)} options={["CBSE", "ICSE", "State Board", "Other"]} /></Field><Field label="Overall marks or percentage" hint="Enter a percentage from 0 to 100"><TextInput value={profile.tenth} onChange={(value) => updateProfile("tenth", value)} placeholder="e.g. 92" type="number" /></Field></div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><GraduationCap size={19} /></span><div><h2 className="text-sm font-semibold text-slate-800">Higher secondary <span className="font-normal text-slate-400">(Class 12 / Intermediate)</span></h2><p className="mt-0.5 text-xs text-slate-400">Your subjects and PCM aggregate</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Intermediate group"><SelectInput value={profile.group} onChange={(value) => updateProfile("group", value)} options={["MPC", "Other"]} /></Field><Field label="PCM aggregate percentage"><TextInput value={profile.pcm} onChange={(value) => updateProfile("pcm", value)} placeholder="e.g. 88.5" type="number" /></Field></div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Award size={18} /></span><div><h2 className="text-sm font-semibold text-slate-800">Competitive entrance exams</h2><p className="mt-0.5 text-xs text-slate-400">Share any results you have — every field is optional</p></div></div>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field label="JEE Main application number"><TextInput value={profile.jeeApplication} onChange={(value) => updateProfile("jeeApplication", value)} placeholder="Optional" /></Field>
                <Field label="JEE Main percentile"><TextInput value={profile.jeePercentile} onChange={(value) => updateProfile("jeePercentile", value)} placeholder="e.g. 92.4" type="number" /></Field>
                <Field label="JEE Main All India Rank"><TextInput value={profile.jeeRank} onChange={(value) => updateProfile("jeeRank", value)} placeholder="e.g. 18,500" type="number" /></Field>
                <Field label="EAPCET exam state"><SelectInput value={profile.examState} onChange={(value) => updateProfile("examState", value)} options={["Andhra Pradesh", "Telangana"]} /></Field>
                <Field label="EAPCET marks"><TextInput value={profile.eapcetMarks} onChange={(value) => updateProfile("eapcetMarks", value)} placeholder="Optional" type="number" /></Field>
                <Field label="EAPCET state rank"><TextInput value={profile.eapcetRank} onChange={(value) => updateProfile("eapcetRank", value)} placeholder="e.g. 4,200" type="number" /></Field>
                <Field label="JEE Advanced qualified?"><SelectInput value={profile.advancedQualified} onChange={(value) => updateProfile("advancedQualified", value)} options={["No", "Yes"]} /></Field>
                {profile.advancedQualified === "Yes" && <Field label="JEE Advanced rank"><TextInput value={profile.advancedRank} onChange={(value) => updateProfile("advancedRank", value)} placeholder="e.g. 5,200" type="number" /></Field>}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><ShieldCheck size={18} /></span><div><h2 className="text-sm font-semibold text-slate-800">Regional & category preferences</h2><p className="mt-0.5 text-xs text-slate-400">Used to make regional cutoff estimates more relevant</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="University region"><SelectInput value={profile.region} onChange={(value) => updateProfile("region", value as Region)} options={["AU", "SVU", "OU", "Open"]} /></Field><Field label="Admission category"><SelectInput value={profile.category} onChange={(value) => updateProfile("category", value as Category)} options={["OC", "EWS", "BC", "SC", "ST"]} /></Field>{profile.category === "BC" && <Field label="BC subcategory"><SelectInput value={profile.bcSubcategory} onChange={(value) => updateProfile("bcSubcategory", value)} options={["BC-A", "BC-B", "BC-C", "BC-D", "BC-E"]} /></Field>}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => updateProfile("girlsQuota", !profile.girlsQuota)} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${profile.girlsQuota ? "border-violet-200 bg-violet-50/60" : "border-slate-100 bg-slate-50/60 hover:bg-white"}`}><span><span className="block text-xs font-semibold text-slate-700">Girls’ quota</span><span className="mt-1 block text-[10px] text-slate-400">Include eligible seat relaxations</span></span><span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${profile.girlsQuota ? "bg-violet-500" : "bg-slate-300"}`}><span className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${profile.girlsQuota ? "translate-x-4" : ""}`} /></span></button>
                <button type="button" onClick={() => updateProfile("reimbursement", !profile.reimbursement)} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${profile.reimbursement ? "border-violet-200 bg-violet-50/60" : "border-slate-100 bg-slate-50/60 hover:bg-white"}`}><span><span className="block text-xs font-semibold text-slate-700">Fee reimbursement</span><span className="mt-1 block text-[10px] text-slate-400">Estimate eligible AP / TS support</span></span><span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${profile.reimbursement ? "bg-violet-500" : "bg-slate-300"}`}><span className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${profile.reimbursement ? "translate-x-4" : ""}`} /></span></button>
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-5 text-slate-400"><CircleHelp size={12} className="mt-0.5 shrink-0" /> Reimbursement and reservation eligibility depend on current government rules and your circumstances. We’ll show estimates, not eligibility decisions.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row"><span className="text-[11px] text-slate-400">Your details aren’t stored or shared.</span><button onClick={() => { setQuestion(0); setStep("diagnostic"); }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:w-auto">Continue to preferences <ArrowRight size={16} /></button></div>
        </section>
      )}

      {step === "diagnostic" && (
        <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[980px] flex-col px-5 pb-12 pt-5 sm:px-8">
          <div className="mb-8 flex items-center justify-between"><button onClick={() => setStep("academics")} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-violet-700"><ArrowLeft size={15} /> Back to academics</button><div className="flex items-center gap-2 text-[11px] font-medium text-violet-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">2</span> Getting to know you</div></div>
          <div className="mb-6 h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${Math.round(((question + 1) / questions.length) * 100)}%` }} /></div>
          <div className="flex flex-1 flex-col justify-center pb-12">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-violet-600"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100"><Sparkles size={14} /></span>{questions[question].eyebrow}</div>
            <div className="flex items-end justify-between gap-4"><h1 className="max-w-[650px] text-3xl font-semibold leading-tight tracking-[-.04em] text-slate-900 sm:text-[40px]">{questions[question].title}</h1><span className="mb-1 hidden text-xs text-slate-400 sm:block">0{question + 1} <span className="mx-1">/</span> 06</span></div>
            <p className="mt-3 text-sm text-slate-500">{questions[question].type === "values" ? "Rate each from 1 (not a priority) to 5 (essential to our decision)." : "There’s no wrong answer — this is about what feels right for you."}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {questions[question].options.map((option, index) => {
                const selected = Array.isArray(answerValue(questions[question].type)) ? (answerValue(questions[question].type) as string[]).includes(option) : answerValue(questions[question].type) === option;
                if (questions[question].type === "values") return <div key={option} className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${selected ? "border-violet-200 bg-violet-50/60" : "border-slate-200 bg-white"}`}><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${selected ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>{index === 0 ? <ShieldCheck size={16} /> : index === 1 ? <Building2 size={16} /> : index === 2 ? <Sparkles size={16} /> : <Award size={16} />}</span><span className="text-sm font-medium text-slate-700">{option}</span></div><div className="flex items-center gap-1.5">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} aria-label={`${option}: rate ${rating} out of 5`} onClick={() => setValueRating(option, rating)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${answers.ratings[option] === rating ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-700"}`}>{rating}</button>)}</div></div>;
                return <button key={option} onClick={() => setAnswer(questions[question].type, option)} className={`group flex min-h-[74px] items-center gap-4 rounded-2xl border p-4 text-left transition ${selected ? "border-violet-300 bg-violet-50/80 shadow-[0_0_0_3px_rgba(115,87,232,.06)]" : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${selected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"}`}>{selected ? <Check size={16} /> : String.fromCharCode(65 + index)}</span><span className={`text-sm font-medium ${selected ? "text-violet-800" : "text-slate-700"}`}>{option}</span></button>;
              })}
            </div>
            {questions[question].type === "budget" && <button onClick={() => setAnswers((current) => ({ ...current, loan: !current.loan }))} className={`mt-4 flex items-center gap-2 text-xs font-medium ${answers.loan ? "text-violet-700" : "text-slate-500 hover:text-violet-700"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${answers.loan ? "border-violet-500 bg-violet-500 text-white" : "border-slate-300"}`}>{answers.loan && <Check size={11} />}</span>We’d consider an education loan</button>}
            <div className="mt-9 flex items-center justify-between"><button onClick={() => question > 0 && setQuestion((current) => current - 1)} disabled={question === 0} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-white disabled:opacity-30"><ArrowLeft size={15} /> Previous</button><button onClick={() => question < questions.length - 1 ? setQuestion((current) => current + 1) : setStep("dashboard")} disabled={questions[question].type === "values" ? answers.values.length < questions[question].options.length : !answers[questions[question].type]} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-45">{question === questions.length - 1 ? "Build my shortlist" : "Next question"} <ArrowRight size={15} /></button></div>
            <div className="mt-5 flex justify-center gap-1.5">{questions.map((_, index) => <button key={index} aria-label={`Go to question ${index + 1}`} onClick={() => setQuestion(index)} className={`h-1.5 rounded-full transition-all ${question === index ? "w-7 bg-violet-500" : "w-1.5 bg-slate-200 hover:bg-violet-200"}`} />)}</div>
          </div>
        </section>
      )}

      {step === "dashboard" && (
        <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs text-slate-400"><span>Home</span><span>/</span><span className="font-medium text-slate-600">Your decision dashboard</span></div><button onClick={() => setStep("academics")} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-violet-200 hover:text-violet-700"><SlidersHorizontal size={14} /> Edit your profile</button></div>
          <div className="relative mb-6 overflow-hidden rounded-[24px] bg-[#221b42] px-5 py-6 text-white sm:px-8 sm:py-7">
            <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-1 -top-14 h-52 w-52 rounded-full border border-white/10" /><div className="absolute right-[17%] top-3 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-5"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-violet-200"><Sparkles size={13} /> Your engineering roadmap</div><h1 className="text-[26px] font-semibold tracking-[-.04em] sm:text-[32px]">{persona === "parent" ? "A clearer decision, as a family." : "A clearer next step, together."}</h1><p className="mt-2 max-w-[600px] text-sm leading-6 text-violet-100/70">Built around your {profile.examState === "Andhra Pradesh" ? "AP" : "TS"} EAPCET profile, {profile.region} region, and what matters to your family.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.08] px-3 py-2 text-[11px] text-violet-100"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Profile complete</div></div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Aptitude & fitment</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Target size={16} /></span></div><div className="mt-3 flex items-end gap-1"><span className="text-[34px] font-semibold tracking-[-.06em]">{fitIndex}</span><span className="mb-1.5 text-xs text-slate-400">/ 100</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all" style={{ width: `${fitIndex}%` }} /></div><div className="mt-2 text-[10px] text-slate-400">Academics + exam profile + preferences</div></div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Family alignment</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500"><Heart size={16} /></span></div><div className="mt-3 flex items-end gap-1"><span className="text-[34px] font-semibold tracking-[-.06em]">{alignmentScore}</span><span className="mb-1.5 text-xs text-slate-400">%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500 transition-all" style={{ width: `${alignmentScore}%` }} /></div><div className="mt-2 text-[10px] text-slate-400">Shared priorities, safety & affordability</div></div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Estimated net fees</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Wallet size={16} /></span></div><div className="mt-3 flex items-end gap-1"><span className="text-[34px] font-semibold tracking-[-.06em]">{profile.reimbursement ? "₹0–30k" : "₹60k–1.4L"}</span><span className="mb-1.5 text-xs text-slate-400">/ yr</span></div><div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600"><CheckCircle2 size={12} />{profile.reimbursement ? "Illustrative reimbursement applied" : answers.loan ? "Loan willingness noted in planning" : "Before any applicable aid"}</div><div className="mt-1 text-[10px] text-slate-400">Excludes living costs; verify with college</div></div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Profile snapshot</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><GraduationCap size={16} /></span></div><div className="mt-3 text-xl font-semibold tracking-tight">{profile.region} Region · {profile.category}</div><div className="mt-2 text-[11px] text-slate-500">{profile.eapcetRank ? `EAPCET rank ${Number(profile.eapcetRank).toLocaleString("en-IN")}` : "Add your EAPCET rank for better estimates"}</div><button onClick={() => setStep("academics")} className="mt-2 text-[10px] font-semibold text-violet-600 hover:text-violet-800">Update academic details →</button></div>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><div className="mb-1 text-[10px] font-semibold uppercase tracking-[.14em] text-violet-600">Your personalized shortlist</div><h2 className="text-xl font-semibold tracking-tight text-slate-900">Colleges worth exploring</h2><p className="mt-1 text-xs text-slate-400">Rank-aware possibilities, matched to the things your family values.</p></div><div className="flex gap-2 text-[10px]"><span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1.5 font-medium text-rose-700"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Dream</span><span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Realistic</span><span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Safe</span></div></div>
              <div className="space-y-3">
                {recommended.map((college) => {
                  const classification = college.probability < 30 ? "Dream" : college.probability > 70 ? "Safe" : "Realistic";
                  const tagStyle = classification === "Dream" ? "bg-rose-50 text-rose-700" : classification === "Safe" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";
                  const netFee = college.effectiveFees;
                  return <article key={college.code} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${college.accent} text-[11px] font-bold tracking-wide text-white shadow-sm`}>{college.code.slice(0, 3)}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-800">{college.name}</h3><span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">{college.code}</span></div><div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400"><span className="flex items-center gap-1"><MapPin size={11} /> {college.city}</span><span>·</span><span>{college.badge}</span></div></div></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tagStyle}`}>{classification} · {college.probability}%</span></div>
                    <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-slate-100 pt-3.5 sm:grid-cols-4"><div><div className="text-[10px] text-slate-400">Branch</div><div className="mt-1 text-xs font-semibold text-slate-700">{answers.tradeoff === "A core branch at a top university" && college.entrance === "eapcet" ? "Electronics / CSE" : answers.domain ? selectedBranch : college.branch}</div></div><div><div className="text-[10px] text-slate-400">Est. net fees / yr</div><div className="mt-1 text-xs font-semibold text-slate-700">{formatINR(netFee)}{profile.reimbursement && college.fees <= 100000 && <span className="ml-1 text-[9px] text-emerald-600">aid est.</span>}</div></div><div><div className="text-[10px] text-slate-400">Median package</div><div className="mt-1 text-xs font-semibold text-slate-700">{formatINR(college.package)}<span className="font-normal text-slate-400"> / yr</span></div></div><div><div className="text-[10px] text-slate-400">Suitability</div><div className="mt-1 flex items-center gap-1.5"><span className="text-xs font-semibold text-violet-700">{college.suitability}</span><span className="h-1 w-12 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-violet-500" style={{ width: `${college.suitability}%` }} /></span></div></div></div>
                  </article>;
                })}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-[10px] leading-5 text-violet-800"><span><span className="font-semibold">A note on estimates:</span> Illustrative, not official cutoff data. Confirm current-year cutoffs, fees, seat rules and eligibility with the counselling authority.</span><CircleHelp size={16} className="ml-3 shrink-0 text-violet-500" /></div>
              <button onClick={() => setShowAll((value) => !value)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700">{showAll ? "Show fewer colleges" : "Explore all recommendations"}{showAll ? <ArrowDown size={14} className="rotate-180" /> : <ArrowRight size={14} />}</button>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-5">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><SlidersHorizontal size={15} className="text-violet-600" /><h2 className="text-sm font-semibold text-slate-800">Make it yours</h2></div><p className="mt-1.5 text-[10px] text-slate-400">Tune what matters most. Shortlist updates live.</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">LIVE</span></div>
                <div className="mt-5 space-y-5">
                  {([["placement", "Placement outcomes", TrendingUp], ["affordability", "Fee affordability", IndianRupee], ["location", "Closer to home", MapPin], ["branch", "Branch preference", Sparkles]] as const).map(([key, label, Icon]) => <label key={key} className="block"><span className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2 text-[11px] font-medium text-slate-600"><Icon size={13} className="text-slate-400" />{label}</span><span className="text-[10px] font-semibold tabular-nums text-violet-700">{weights[key]}%</span></span><input aria-label={`${label} weight`} className="range-input h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200" type="range" min="0" max="100" value={weights[key]} onChange={(event) => setWeights((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}
                </div>
                <button onClick={() => setWeights(initialWeights)} className="mt-5 text-[10px] font-semibold text-violet-600 hover:text-violet-800">Reset priorities</button>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#f2fbf7] to-white p-5 shadow-card">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><TrendingUp size={16} /></span><h2 className="text-sm font-semibold text-slate-800">Your ROI snapshot</h2></div><span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-emerald-700">Illustrative</span></div>
                <p className="mt-3 text-[10px] leading-5 text-slate-500">A simple comparison using the leading fit in your shortlist — not a salary guarantee.</p>
                {(() => { const best = rankedColleges[0]; const fourYearCost = best.effectiveFees * 4 + 320000; const threeYearSalary = best.package * 3; const multiplier = (threeYearSalary / Math.max(fourYearCost, 1)).toFixed(1); return <><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-[9px] text-slate-400">4-year total cost*</div><div className="mt-1.5 text-lg font-semibold tracking-tight text-slate-800">{formatINR(fourYearCost)}</div><div className="mt-1 text-[9px] text-slate-400">tuition + est. living costs</div></div><div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-[9px] text-slate-400">3-year gross pay**</div><div className="mt-1.5 text-lg font-semibold tracking-tight text-emerald-700">{formatINR(threeYearSalary)}</div><div className="mt-1 text-[9px] text-slate-400">at median package estimate</div></div></div><div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-600 px-3.5 py-3 text-white"><span className="text-[11px] font-medium">Indicative salary / cost</span><span className="text-lg font-semibold">{multiplier}×</span></div></>; })()}
                <p className="mt-3 text-[9px] leading-4 text-slate-400">*Living costs assumed at ₹80k/year. **Gross, before taxes, expenses and placement variation. Salaries are not assured.</p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4"><div className="flex gap-2.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-violet-600" /><div><div className="text-xs font-semibold text-slate-800">Made for both of you</div><p className="mt-1.5 text-[10px] leading-5 text-slate-500">Share this shortlist with your family and compare priorities together. Your information stays on this device.</p><button onClick={() => window.print()} className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-violet-700 hover:text-violet-900"><ArrowUpRight size={12} /> Print or save shortlist</button></div></div></div>
            </aside>
          </div>
        </section>
      )}
      <footer className={`mx-auto max-w-[1440px] px-5 pb-7 sm:px-8 lg:px-12 ${step === "welcome" ? "hidden" : ""}`}><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-5 text-[10px] text-slate-400"><Brand /><span>Built to help families make confident, informed decisions.</span><span>Admission & financial figures are indicative only.</span></div></footer>
    </main>
  );
}
