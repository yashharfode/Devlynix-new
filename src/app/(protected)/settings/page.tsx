"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, CreditCard, Webhook, Settings as SettingsIcon, 
  Github, Linkedin, Globe, Key, Save, CheckCircle2
} from "lucide-react";

type Tab = "GENERAL" | "PROFILE" | "NOTIFICATIONS" | "INTEGRATIONS" | "BILLING";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("PROFILE");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock form state
  const [techStack, setTechStack] = useState<string[]>(["React", "TypeScript", "Next.js"]);
  const availableStack = ["React", "TypeScript", "Next.js", "Node.js", "Rust", "Solidity", "Python", "Go", "Vue"];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const toggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter(t => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const TABS = [
    { id: "GENERAL", label: "General Settings", icon: SettingsIcon },
    { id: "PROFILE", label: "Developer Profile", icon: User },
    { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
    { id: "INTEGRATIONS", label: "Integrations & API", icon: Webhook },
    { id: "BILLING", label: "Billing & Payouts", icon: CreditCard },
  ];

  if (!isLoaded) return <div className="p-8 text-gray-500 font-mono">Loading matrix...</div>;

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8 border-b border-white/5 pb-6 pt-8">
        <h1 className="text-4xl font-black tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your Hacker Passport and Organizer preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Vertical Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#c6ff00]/10 text-[#c6ff00] border border-[#c6ff00]/20 shadow-[0_0_15px_rgba(198,255,0,0.05)]" 
                    : "text-gray-500 hover:bg-[#111] hover:text-gray-300 border border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 min-h-[600px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* PROFILE TAB */}
              {activeTab === "PROFILE" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Developer Profile</h2>
                    <p className="text-gray-500 text-sm">This is your public Hacker Passport.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GitHub URL</label>
                        <div className="relative">
                          <Github className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="text" className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#c6ff00]/50 transition-colors" placeholder="https://github.com/username" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LinkedIn</label>
                        <div className="relative">
                          <Linkedin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="text" className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#c6ff00]/50 transition-colors" placeholder="https://linkedin.com/in/username" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Portfolio Website</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#c6ff00]/50 transition-colors" placeholder="https://yourdomain.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack (For Matchmaking)</label>
                      <div className="flex flex-wrap gap-2">
                        {availableStack.map(tech => (
                          <button
                            key={tech}
                            onClick={() => toggleTech(tech)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                              techStack.includes(tech) 
                                ? "bg-[#c6ff00]/10 border-[#c6ff00]/50 text-[#c6ff00]" 
                                : "bg-[#111] border-white/5 text-gray-400 hover:bg-[#151515]"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATIONS TAB */}
              {activeTab === "INTEGRATIONS" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Integrations & API</h2>
                    <p className="text-gray-500 text-sm">Connect Devlynix to your community.</p>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Key className="w-5 h-5 text-[#c6ff00]" />
                        <h3 className="font-bold">Organizer API Keys</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Use these keys to programmatically manage your hackathons.</p>
                      <div className="flex items-center gap-2">
                        <input type="password" value="dev_sec_98237498237498" readOnly className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400 font-mono" />
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">Reveal</button>
                      </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Webhook className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold">Discord / Telegram Webhooks</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">We will automatically send aesthetic embeds to your servers when hackathon states change.</p>
                      <div className="space-y-3">
                        <input type="text" placeholder="Discord Webhook URL" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50" />
                        <input type="text" placeholder="Telegram Bot Token" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "NOTIFICATIONS" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Notification Preferences</h2>
                    <p className="text-gray-500 text-sm">Control how we communicate with you.</p>
                  </div>

                  <div className="max-w-2xl space-y-4">
                    {[
                      { title: "Team Invites", desc: "When someone wants to team up with you." },
                      { title: "Submission Deadlines", desc: "24-hour and 1-hour warnings." },
                      { title: "Hackathon Updates", desc: "Announcements from organizers." },
                      { title: "Prize Distributions", desc: "When you win a bounty or track." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6ff00]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PLACEHOLDER TABS */}
              {["GENERAL", "BILLING"].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <SettingsIcon className="w-12 h-12 text-gray-600 mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-gray-400">Under Construction</h3>
                  <p className="text-gray-600 mt-2 max-w-sm">This section is being upgraded for the Devlynix v2 platform.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Global Save Button */}
          <div className="absolute bottom-8 right-8">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#c6ff00] text-black hover:bg-[#a5d600] transition-transform active:scale-95 shadow-[0_0_20px_rgba(198,255,0,0.3)] disabled:opacity-50"
            >
              {isSaving ? "Saving..." : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
