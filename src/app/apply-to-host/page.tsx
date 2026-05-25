"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Sparkles, Building2, MapPin, Calendar, Users, Target, FileText, 
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Globe, Banknote, ShieldAlert,
  Link as LinkIcon, Gift, CheckSquare, Webhook, Lightbulb, Code
} from "lucide-react";
import { hostHackathonSchema, HostHackathonFormValues } from "@/lib/validations";

const STEPS = [
  { id: 1, title: "Identity", icon: Terminal },
  { id: 2, title: "Logistics", icon: MapPin },
  { id: 3, title: "Tracks", icon: Target },
  { id: 4, title: "Rules", icon: ShieldAlert },
  { id: 5, title: "Sponsors", icon: Gift },
  { id: 6, title: "Dev Ecosystem", icon: Code },
];

export default function HostHackathonWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HostHackathonFormValues>({
    resolver: zodResolver(hostHackathonSchema),
    defaultValues: {
      name: "", tagline: "", slug: "", logoUrl: "", bannerUrl: "",
      primaryColor: "", twitterUrl: "", discordUrl: "", websiteUrl: "", description: "",
      mode: "ONLINE", location: "", startDate: "", endDate: "", applicationDeadline: "", submissionDeadline: "",
      expectedHackers: 100, registrationLimit: undefined, contactEmail: "", internationalSwagShipping: false,
      tracks: [{ name: "", description: "", sponsor: "", prizeAmount: 0 }],
      bounties: [],
      minTeamSize: 1, maxTeamSize: 4, allowedRoles: ["STUDENT", "PROFESSIONAL"],
      eligibilityRules: "", judgingCriteria: [{ name: "Technical Complexity", weight: 30 }], judges: [], agreeToCodeOfConduct: undefined,
      sponsors: [], mentors: [], needsSponsorship: false, announcementWebhook: "",
      requiredApis: "", recommendedTechStack: [], requireGithubRepo: true, requireVideoDemo: true, allowPrePitching: false
    },
    mode: "onChange"
  });

  const { control, watch, trigger, handleSubmit, formState: { errors } } = form;
  
  const { fields: trackFields, append: appendTrack, remove: removeTrack } = useFieldArray({ control, name: "tracks" });
  const { fields: judgeFields, append: appendJudge, remove: removeJudge } = useFieldArray({ control, name: "judges" });
  const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({ control, name: "judgingCriteria" });
  const { fields: sponsorFields, append: appendSponsor, remove: removeSponsor } = useFieldArray({ control, name: "sponsors" });

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

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['name', 'tagline', 'slug', 'description'];
    else if (currentStep === 2) fieldsToValidate = ['mode', 'location', 'startDate', 'endDate', 'applicationDeadline', 'submissionDeadline', 'expectedHackers', 'contactEmail'];
    else if (currentStep === 3) fieldsToValidate = ['tracks', 'bounties'];
    else if (currentStep === 4) fieldsToValidate = ['minTeamSize', 'maxTeamSize', 'allowedRoles', 'judgingCriteria', 'agreeToCodeOfConduct'];
    else if (currentStep === 5) fieldsToValidate = ['sponsors', 'mentors', 'announcementWebhook'];
    else if (currentStep === 6) fieldsToValidate = ['requireGithubRepo'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: HostHackathonFormValues) => {
    setIsSubmitting(true);
    try {
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c6ff00]/30 font-sans overflow-x-hidden">
      {/* Background Cinematic Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#c6ff00]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#c6ff00]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Progress & Advanced Tools */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="sticky top-12 space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c6ff00]/10 border border-[#c6ff00]/20 text-[#c6ff00] text-xs font-bold uppercase tracking-widest mb-4">
                <Rocket className="w-3 h-3" /> Organizer Console
              </div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Architect the Future.
              </h1>
            </div>

            {/* Progress Stepper */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#c6ff00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-4 relative z-10">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                      currentStep > step.id ? 'bg-[#c6ff00] text-black shadow-[0_0_15px_rgba(198,255,0,0.4)]' :
                      currentStep === step.id ? 'bg-[#111] border-2 border-[#c6ff00] text-[#c6ff00]' :
                      'bg-[#111] border border-white/10 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <div className={`font-medium transition-colors ${currentStep === step.id ? 'text-white' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`absolute left-5 top-10 w-[2px] h-4 transition-colors ${currentStep > step.id ? 'bg-[#c6ff00]/50' : 'bg-white/5'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Budget Estimator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A]/80 border border-[#c6ff00]/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(198,255,0,0.05)]"
            >
              <div className="flex items-center gap-2 text-[#c6ff00] mb-4 font-bold text-sm uppercase tracking-wider">
                <Banknote className="w-4 h-4" /> Live Budget Matrix
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400"><span>🍕 Food & Drink</span> <span>${estimatedBudget.food.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>👕 Swag & Merch</span> <span>${estimatedBudget.swag.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>☁️ Cloud / APIs</span> <span>${estimatedBudget.servers.toLocaleString()}</span></div>
                {watchedMode !== "ONLINE" && <div className="flex justify-between text-gray-400"><span>🏟️ Venue Setup</span> <span>${estimatedBudget.venue.toLocaleString()}</span></div>}
                <div className="flex justify-between text-[#c6ff00]/80"><span>🏆 Prize Pool</span> <span>${estimatedBudget.prizes.toLocaleString()}</span></div>
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-between font-bold text-white text-lg">
                  <span>Total Est.</span>
                  <span className="text-[#c6ff00]">${totalBudget.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Right Side: Wizard Form Area */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col">
            
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
                  className="absolute inset-0 overflow-y-auto pr-4 scrollbar-theme"
                >
                  
                  {/* STEP 1: IDENTITY */}
                  {currentStep === 1 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Identity & Brand</h2><p className="text-gray-500 text-sm">Let's give your hackathon a personality.</p></div>
                      
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hackathon Name</label>
                            <input {...form.register("name")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#c6ff00]/50 transition-colors" placeholder="e.g. CyberPunk Build 2026" />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">URL Slug</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">devlynix.com/</span>
                              <input {...form.register("slug")} className="w-full bg-[#111] border border-white/10 rounded-xl pl-[110px] pr-4 py-3 text-white focus:border-[#c6ff00]/50" placeholder="cyberpunk-2026" />
                            </div>
                            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tagline</label>
                          <input {...form.register("tagline")} className={`w-full bg-[#111] border ${errors.tagline ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-[#c6ff00]/50`} placeholder="Code the future. (min 10 chars)" />
                          {errors.tagline && <p className="text-red-400 text-xs mt-1">{errors.tagline.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                          <textarea {...form.register("description")} rows={4} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#c6ff00]/50" placeholder="Tell hackers what they will be building..."></textarea>
                          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Color (Hex)</label><input {...form.register("primaryColor")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="#c6ff00" /></div>
                          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Website</label><input {...form.register("websiteUrl")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="https://" /></div>
                          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Discord/Twitter</label><input {...form.register("discordUrl")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="https://" /></div>
                        </div>

                        <div className="p-6 rounded-2xl border-2 border-dashed border-white/10 bg-[#111]/50 text-center hover:border-[#c6ff00]/30 transition-colors cursor-pointer group">
                          <Globe className="w-8 h-8 text-gray-600 mx-auto mb-3 group-hover:text-[#c6ff00] transition-colors" />
                          <div className="text-sm font-bold text-gray-300">Upload Logo & Banner</div>
                          <div className="text-xs text-gray-500 mt-1">Drag and drop or click to browse (Supabase Storage)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: LOGISTICS */}
                  {currentStep === 2 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Logistics & Timeline</h2><p className="text-gray-500 text-sm">When and where is the magic happening?</p></div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Event Mode</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['ONLINE', 'IRL', 'HYBRID'].map(mode => (
                              <label key={mode} className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${watchedMode === mode ? 'bg-[#c6ff00]/10 border-[#c6ff00] text-[#c6ff00] shadow-[0_0_20px_rgba(198,255,0,0.15)]' : 'bg-[#111] border-white/5 text-gray-500 hover:bg-[#151515]'}`}>
                                <input type="radio" value={mode} {...form.register("mode")} className="hidden" />
                                <div className="font-bold text-sm">{mode}</div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {watchedMode !== "ONLINE" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Venue Location</label>
                            <input {...form.register("location")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#c6ff00]/50" placeholder="e.g. Moscone Center, SF" />
                            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Registration Open</label>
                            <input type="datetime-local" {...form.register("startDate")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Application Deadline</label>
                            <input type="datetime-local" {...form.register("applicationDeadline")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hacking Ends</label>
                            <input type="datetime-local" {...form.register("endDate")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Submission Deadline</label>
                            <input type="datetime-local" {...form.register("submissionDeadline")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Hackers</label>
                            <input type="number" {...form.register("expectedHackers")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email</label>
                            <input type="email" {...form.register("contactEmail")} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" />
                          </div>
                        </div>

                        {/* NEXT LEVEL FIELD: Swag Shipping */}
                        <div className="p-5 border border-white/10 bg-[#111] rounded-2xl flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white mb-1">International Swag Shipping</div>
                            <div className="text-xs text-gray-500">Will you provide international shipping for swags?</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...form.register("internationalSwagShipping")} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6ff00]"></div>
                          </label>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* STEP 3: TRACKS & BOUNTIES */}
                  {currentStep === 3 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Tracks & Prizes</h2><p className="text-gray-500 text-sm">Define the hacking categories and prize pools.</p></div>

                      <div className="space-y-4">
                        {trackFields.map((field, index) => (
                          <div key={field.id} className="bg-[#111] p-5 rounded-2xl border border-white/5 relative group">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Track Name</label><input {...form.register(`tracks.${index}.name`)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Best AI App" /></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Prize ($)</label><input type="number" {...form.register(`tracks.${index}.prizeAmount`)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-[#c6ff00]" /></div>
                            </div>
                            <input {...form.register(`tracks.${index}.description`)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Description of what hackers should build..." />
                            {trackFields.length > 1 && (
                              <button type="button" onClick={() => removeTrack(index)} className="absolute -right-2 -top-2 bg-red-500/20 text-red-500 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                            )}
                          </div>
                        ))}
                        
                        <button type="button" onClick={() => appendTrack({ name: "", description: "", sponsor: "", prizeAmount: 0 })} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:text-[#c6ff00] hover:border-[#c6ff00]/50 transition-all font-bold text-sm flex items-center justify-center gap-2">
                          <Target className="w-4 h-4" /> Add Another Track
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: RULES & JUDGING */}
                  {currentStep === 4 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Rules & Judging</h2><p className="text-gray-500 text-sm">Configure matchmaking limits, code of conduct, and evaluation matrices.</p></div>

                      <div className="grid grid-cols-2 gap-4 bg-[#111] p-5 rounded-2xl border border-white/5">
                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Min Team Size</label><input type="number" {...form.register("minTeamSize")} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white text-center" /></div>
                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Team Size</label><input type="number" {...form.register("maxTeamSize")} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white text-center" /></div>
                      </div>

                      <div className="bg-[#111] p-5 rounded-2xl border border-white/5">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Judging Criteria Matrix</label>
                        {criteriaFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 mb-3">
                            <input {...form.register(`judgingCriteria.${index}.name`)} placeholder="e.g. Technical Complexity" className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="number" {...form.register(`judgingCriteria.${index}.weight`)} placeholder="Weight (%)" className="w-24 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <button type="button" onClick={() => removeCriteria(index)} className="text-gray-500 hover:text-red-400 px-2">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => appendCriteria({ name: "", weight: 10 })} className="text-[#c6ff00] text-sm font-bold hover:text-[#a5d600]">+ Add Criteria</button>
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
                        <button type="button" onClick={() => appendJudge({ name: "", role: "", linkedin: "" })} className="text-[#c6ff00] text-sm font-bold hover:text-[#a5d600]">+ Add Judge</button>
                      </div>

                      {/* NEXT LEVEL FIELD: Code of Conduct */}
                      <div className="flex items-start gap-3 p-4 bg-[#c6ff00]/5 border border-[#c6ff00]/20 rounded-xl">
                        <input type="checkbox" {...form.register("agreeToCodeOfConduct")} className="mt-1 w-4 h-4 accent-[#c6ff00]" />
                        <div>
                          <div className="text-sm font-bold text-[#c6ff00]">I agree to the Devlynix Organizer Code of Conduct</div>
                          <div className="text-xs text-[#c6ff00]/70 mt-1">I will provide a safe, inclusive, and transparent environment for all hackers.</div>
                        </div>
                      </div>
                      {errors.agreeToCodeOfConduct && <p className="text-red-400 text-xs mt-1">{errors.agreeToCodeOfConduct.message}</p>}

                    </div>
                  )}

                  {/* STEP 5: SPONSORS & MENTORS */}
                  {currentStep === 5 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Sponsors & Webhooks</h2><p className="text-gray-500 text-sm">Automate your communication and feature your partners.</p></div>

                      <div className="bg-[#111] p-5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                          <Webhook className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">Auto-Announcements Webhook</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Input your Discord/Telegram Webhook URL to send automated updates to your community when hackathon state changes (Registration Open, Deadlines, Winners).</p>
                        <input {...form.register("announcementWebhook")} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#c6ff00]/50" placeholder="https://discord.com/api/webhooks/..." />
                      </div>

                      <div className="bg-[#111] p-5 rounded-2xl border border-white/5">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sponsors</label>
                        {sponsorFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 mb-3">
                            <input {...form.register(`sponsors.${index}.name`)} placeholder="Sponsor Name" className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <select {...form.register(`sponsors.${index}.tier`)} className="bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                              <option value="PLATINUM">Platinum</option><option value="GOLD">Gold</option><option value="SILVER">Silver</option><option value="PARTNER">Partner</option>
                            </select>
                            <button type="button" onClick={() => removeSponsor(index)} className="text-gray-500 hover:text-red-400 px-2">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => appendSponsor({ name: "", tier: "PARTNER", logoUrl: "" })} className="text-[#c6ff00] text-sm font-bold hover:text-[#a5d600]">+ Add Sponsor</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: DEV ECOSYSTEM */}
                  {currentStep === 6 && (
                    <div className="space-y-6 pb-20">
                      <div><h2 className="text-2xl font-bold text-white mb-1">Developer Ecosystem</h2><p className="text-gray-500 text-sm">Define what makes a valid submission.</p></div>

                      <div className="space-y-4">
                        <div className="p-5 border border-white/10 bg-[#111] rounded-2xl flex items-center justify-between">
                          <div><div className="font-bold text-white mb-1">Require Public GitHub Repo</div><div className="text-xs text-gray-500">Hackers must provide a valid repository URL to submit.</div></div>
                          <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" {...form.register("requireGithubRepo")} className="sr-only peer" /><div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6ff00]"></div></label>
                        </div>

                        <div className="p-5 border border-white/10 bg-[#111] rounded-2xl flex items-center justify-between">
                          <div><div className="font-bold text-white mb-1">Require Video Pitch (Demo)</div><div className="text-xs text-gray-500">Submissions must include a YouTube or Loom URL.</div></div>
                          <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" {...form.register("requireVideoDemo")} className="sr-only peer" /><div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6ff00]"></div></label>
                        </div>

                        {/* NEXT LEVEL FIELD: Idea Pitching */}
                        <div className="p-5 border border-[#c6ff00]/20 bg-[#c6ff00]/5 rounded-2xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 font-bold text-[#c6ff00] mb-1"><Lightbulb className="w-4 h-4" /> Pre-Hackathon Idea Pitching</div>
                            <div className="text-xs text-[#c6ff00]/70">Allow hackers to pitch ideas and form teams before the official start date.</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" {...form.register("allowPrePitching")} className="sr-only peer" /><div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6ff00]"></div></label>
                        </div>
                      </div>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error Message if Validation Fails */}
            {Object.keys(errors).length > 0 && (
              <div className="px-8 pb-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Please fill out all required fields correctly to proceed. Check for minimum lengths or invalid formats.
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-20 bg-[#0A0A0A]">
              <button 
                type="button" 
                onClick={handlePrev} 
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              {currentStep < STEPS.length ? (
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
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm bg-[#c6ff00] text-black hover:bg-[#a5d600] transition-transform active:scale-95 shadow-[0_0_30px_rgba(198,255,0,0.4)] disabled:opacity-50"
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
