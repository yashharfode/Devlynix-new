"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Sparkles, Building2, MapPin, Calendar, Users, Target, FileText, 
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Globe, Banknote, ShieldAlert 
} from "lucide-react";
import { hostHackathonSchema, HostHackathonFormValues } from "@/lib/validations";

const STEPS = [
  { id: 1, title: "Identity", icon: Terminal },
  { id: 2, title: "Logistics", icon: MapPin },
  { id: 3, title: "Tracks", icon: Target },
  { id: 4, title: "Rules", icon: ShieldAlert },
];

export default function HostHackathonWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HostHackathonFormValues>({
    resolver: zodResolver(hostHackathonSchema),
    defaultValues: {
      name: "", tagline: "", slug: "", logoUrl: "", bannerUrl: "",
      mode: "ONLINE", location: "", startDate: "", endDate: "", expectedHackers: 100,
      tracks: [{ name: "", prizeAmount: 0 }],
      minTeamSize: 1, maxTeamSize: 4, allowedRoles: ["STUDENT", "PROFESSIONAL"],
      judges: []
    },
    mode: "onChange"
  });

  const { control, watch, trigger, handleSubmit, formState: { errors } } = form;
  
  const { fields: trackFields, append: appendTrack, remove: removeTrack } = useFieldArray({ control, name: "tracks" });
  const { fields: judgeFields, append: appendJudge, remove: removeJudge } = useFieldArray({ control, name: "judges" });

  const watchedHackers = watch("expectedHackers");
  const watchedTracks = watch("tracks");
  const watchedMode = watch("mode");

  // Dynamic Budget Estimator
  const estimatedBudget = {
    food: watchedMode !== "ONLINE" ? watchedHackers * 50 : 0,
    swag: watchedHackers * 25,
    servers: watchedHackers * 5,
    venue: watchedMode !== "ONLINE" ? 5000 : 0,
    prizes: watchedTracks.reduce((acc, track) => acc + (Number(track.prizeAmount) || 0), 0)
  };
  const totalBudget = Object.values(estimatedBudget).reduce((a, b) => a + b, 0);

  // AI Sponsor Matchmaking Logic (UI Placeholder)
  const getAISponsors = () => {
    const trackNames = watchedTracks.map(t => t.name.toLowerCase());
    let sponsors: string[] = [];
    if (trackNames.some(t => t.includes('ai') || t.includes('ml'))) sponsors.push("OpenAI", "Anthropic", "Hugging Face");
    if (trackNames.some(t => t.includes('web3') || t.includes('crypto'))) sponsors.push("Polygon", "Solana", "Ethereum Foundation");
    if (trackNames.some(t => t.includes('cloud') || t.includes('saas'))) sponsors.push("AWS", "Vercel", "Cloudflare");
    return sponsors.length > 0 ? sponsors : ["GitHub", "Stripe", "Supabase"];
  };

  const aiSponsors = getAISponsors();

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['name', 'tagline', 'slug'];
    else if (currentStep === 2) fieldsToValidate = ['mode', 'location', 'startDate', 'endDate', 'expectedHackers'];
    else if (currentStep === 3) fieldsToValidate = ['tracks'];
    else if (currentStep === 4) fieldsToValidate = ['minTeamSize', 'maxTeamSize', 'allowedRoles', 'judges'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: HostHackathonFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API / Supabase Insertion
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Submitted to Supabase:", data);
      alert("Hackathon successfully drafted!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* Background Cinematic Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10 flex gap-8">
        
        {/* Left Sidebar: Progress & Advanced Tools */}
        <div className="w-1/3 hidden lg:flex flex-col gap-8">
          <div className="sticky top-12 space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Rocket className="w-3 h-3" /> Organizer Console
              </div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Architect the Future.
              </h1>
            </div>

            {/* Progress Stepper */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-6 relative z-10">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentStep > step.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
                      currentStep === step.id ? 'bg-[#111] border-2 border-cyan-400 text-cyan-400' :
                      'bg-[#111] border border-white/10 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <div className={`font-medium transition-colors ${currentStep === step.id ? 'text-white' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`absolute left-5 w-[2px] h-10 mt-12 transition-colors ${currentStep > step.id ? 'bg-purple-500/50' : 'bg-white/5'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature A: Dynamic Budget Estimator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A]/80 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.05)]"
            >
              <div className="flex items-center gap-2 text-purple-400 mb-4 font-bold text-sm uppercase tracking-wider">
                <Banknote className="w-4 h-4" /> Live Budget Matrix
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400"><span>🍕 Food & Drink</span> <span>${estimatedBudget.food.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>👕 Swag & Merch</span> <span>${estimatedBudget.swag.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>☁️ Cloud / APIs</span> <span>${estimatedBudget.servers.toLocaleString()}</span></div>
                {watchedMode !== "ONLINE" && <div className="flex justify-between text-gray-400"><span>🏟️ Venue Setup</span> <span>${estimatedBudget.venue.toLocaleString()}</span></div>}
                <div className="flex justify-between text-purple-400/80"><span>🏆 Prize Pool</span> <span>${estimatedBudget.prizes.toLocaleString()}</span></div>
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-between font-bold text-white text-lg">
                  <span>Total Est.</span>
                  <span className="text-cyan-400">${totalBudget.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Feature C: AI Sponsor Matchmaking */}
            {currentStep >= 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-16 h-16" /></div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2 font-bold text-sm uppercase tracking-wider relative z-10">
                  <Sparkles className="w-4 h-4" /> AI Sponsor Match
                </div>
                <p className="text-xs text-gray-400 mb-4 relative z-10">Based on your {watchedTracks.length} tracks, our AI suggests targeting:</p>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {aiSponsors.map(sponsor => (
                    <span key={sponsor} className="px-3 py-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
                      {sponsor}
                    </span>
                  ))}
                </div>
                {/* Feature B Trigger */}
                <button type="button" className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                  <FileText className="w-3 h-3" /> Auto-Generate Pitch Deck
                </button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Side: Wizard Form Area */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Form Content Area */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  
                  {/* STEP 1: IDENTITY */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Identity & Brand</h2>
                        <p className="text-gray-500 text-sm">Let's give your hackathon a personality.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hackathon Name</label>
                          <input {...form.register("name")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700" placeholder="e.g. CyberPunk Build 2026" />
                          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tagline</label>
                            <input {...form.register("tagline")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-700" placeholder="Code the future." />
                            {errors.tagline && <p className="text-red-400 text-xs mt-1">{errors.tagline.message}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">URL Slug</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">devlynix.com/</span>
                              <input {...form.register("slug")} className="w-full bg-[#111] border border-white/10 rounded-xl pl-[110px] pr-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-700" placeholder="cyberpunk-2026" />
                            </div>
                            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border-2 border-dashed border-white/10 bg-[#111]/50 text-center hover:border-purple-500/30 transition-colors cursor-pointer group">
                          <Globe className="w-8 h-8 text-gray-600 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
                          <div className="text-sm font-bold text-gray-300">Upload Logo & Banner</div>
                          <div className="text-xs text-gray-500 mt-1">Drag and drop or click to browse (Supabase Storage)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: LOGISTICS */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Logistics & Timeline</h2>
                        <p className="text-gray-500 text-sm">When and where is the magic happening?</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Event Mode</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['ONLINE', 'IRL', 'HYBRID'].map(mode => (
                              <label key={mode} className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${watchedMode === mode ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'bg-[#111] border-white/5 text-gray-500 hover:bg-[#151515]'}`}>
                                <input type="radio" value={mode} {...form.register("mode")} className="hidden" />
                                <div className="font-bold text-sm">{mode}</div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {watchedMode !== "ONLINE" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Venue Location</label>
                            <input {...form.register("location")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-700" placeholder="e.g. Moscone Center, SF" />
                            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                            <input type="datetime-local" {...form.register("startDate")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]" />
                            {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
                            <input type="datetime-local" {...form.register("endDate")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]" />
                            {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Hackers <span className="text-purple-500/50 lowercase normal-case text-[10px] ml-2">(Drives Budget Estimator)</span></label>
                          <input type="number" {...form.register("expectedHackers")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50" />
                          {errors.expectedHackers && <p className="text-red-400 text-xs mt-1">{errors.expectedHackers.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: TRACKS & BOUNTIES */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Tracks & Bounties</h2>
                        <p className="text-gray-500 text-sm">Define the hacking categories and prize pools.</p>
                      </div>

                      <div className="space-y-4">
                        {trackFields.map((field, index) => (
                          <motion.div key={field.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 items-start bg-[#111] p-4 rounded-2xl border border-white/5 relative group">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Track Name</label>
                              <input {...form.register(`tracks.${index}.name`)} className="w-full bg-transparent border-b border-white/10 px-1 py-2 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-gray-700" placeholder="e.g. Best Consumer AI App" />
                              {errors.tracks?.[index]?.name && <p className="text-red-400 text-xs mt-1">{errors.tracks[index].name?.message}</p>}
                            </div>
                            <div className="w-32">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Prize ($)</label>
                              <input type="number" {...form.register(`tracks.${index}.prizeAmount`)} className="w-full bg-transparent border-b border-white/10 px-1 py-2 text-white focus:outline-none focus:border-cyan-500 transition-all text-right font-mono text-cyan-400" />
                            </div>
                            {trackFields.length > 1 && (
                              <button type="button" onClick={() => removeTrack(index)} className="absolute -right-2 -top-2 bg-red-500/20 text-red-500 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                            )}
                          </motion.div>
                        ))}
                        
                        <button type="button" onClick={() => appendTrack({ name: "", prizeAmount: 0 })} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all font-bold text-sm flex items-center justify-center gap-2">
                          <Target className="w-4 h-4" /> Add Another Track
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: RULES & JUDGING */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Rules & Judges</h2>
                        <p className="text-gray-500 text-sm">Configure matchmaking rules and expert panels.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-[#111] p-5 rounded-2xl border border-white/5">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Min Team Size</label>
                          <input type="number" {...form.register("minTeamSize")} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-center" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Team Size</label>
                          <input type="number" {...form.register("maxTeamSize")} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-center" />
                          {errors.maxTeamSize && <p className="text-red-400 text-xs mt-1 absolute">{errors.maxTeamSize.message}</p>}
                        </div>
                      </div>

                      <div className="bg-[#111] p-5 rounded-2xl border border-white/5">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Judges (Optional)</label>
                        {judgeFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 mb-3">
                            <input {...form.register(`judges.${index}.name`)} placeholder="Name" className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <input {...form.register(`judges.${index}.role`)} placeholder="Role / Company" className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <button type="button" onClick={() => removeJudge(index)} className="text-gray-500 hover:text-red-400 px-2">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => appendJudge({ name: "", role: "", linkedin: "" })} className="text-cyan-400 text-sm font-bold hover:text-cyan-300">+ Add Judge</button>
                      </div>

                      {/* Tinder-Builder callout */}
                      <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/30 flex gap-4 items-start">
                        <Users className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-white mb-1">Tinder-Like Team Builder Activated</div>
                          <div className="text-xs text-purple-200/70">Hackers will be able to swipe on profiles to find missing roles (Frontend, Backend, etc) to form teams automatically based on your limits.</div>
                        </div>
                      </div>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center relative z-20">
              <button 
                type="button" 
                onClick={handlePrev} 
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 transition-transform active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50"
                >
                  {isSubmitting ? "Deploying..." : "Launch Hackathon"} <Rocket className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
