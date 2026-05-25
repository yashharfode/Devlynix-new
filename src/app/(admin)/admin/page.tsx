import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users, Terminal, FileText, Activity, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Securely verify admin role
  // TODO: Fetch user from DB
  const user: any = { role: "ADMIN" }; // Mocked

  if (user?.role !== "ADMIN") {
    redirect("/hub");
  }

  // Fetch metrics
  // TODO: Fetch from DB
  const totalUsers = 0;
  const activeHackathons = 0;
  const pendingApps = 0;
  const totalSubmissions = 0;

  // Recent Users
  // TODO: Fetch from DB
  const recentUsers: any[] = [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 border-b border-[#111] pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">High-level metrics and system status.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Metric Cards */}
        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-[#c6ff00]/50 hover:shadow-[0_0_15px_rgba(198,255,0,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Total Builders</span>
            <Users className="w-4 h-4 text-[#c6ff00]" />
          </div>
          <div className="text-3xl font-medium text-white">{totalUsers.toLocaleString()}</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-[#c6ff00]/50 hover:shadow-[0_0_15px_rgba(198,255,0,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Active Hackathons</span>
            <Terminal className="w-4 h-4 text-[#c6ff00]" />
          </div>
          <div className="text-3xl font-medium text-white">{activeHackathons.toLocaleString()}</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-[#c6ff00]/50 hover:shadow-[0_0_15px_rgba(198,255,0,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Pending Apps</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-white">{pendingApps.toLocaleString()}</span>
            {pendingApps > 0 && <span className="text-xs text-purple-400 animate-pulse">Needs Review</span>}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-[#c6ff00]/50 hover:shadow-[0_0_15px_rgba(198,255,0,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Projects Shipped</span>
            <Activity className="w-4 h-4 text-[#c6ff00]" />
          </div>
          <div className="text-3xl font-medium text-white">{totalSubmissions.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Recent Registrations</h2>
            <Link href="/admin/users" className="text-xs text-[#c6ff00]/80 hover:text-[#c6ff00] transition-colors">View All →</Link>
          </div>
          
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-[#111] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs text-gray-500 font-mono">
                    {u.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="text-sm text-gray-300 font-medium">{u.username || 'Anonymous'}</div>
                    <div className="text-xs text-gray-600">{new Date(u.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${
                  u.role === 'ADMIN' ? 'bg-red-900/20 text-red-500' :
                  u.role === 'ORGANIZER' ? 'bg-[#c6ff00]/10 text-[#c6ff00]' :
                  'bg-[#111] text-gray-500'
                }`}>
                  {u.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors">
          <h2 className="text-lg font-medium text-white mb-6">System Health</h2>
          <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#c6ff00]/10 border border-[#c6ff00]/30 shadow-[0_0_20px_rgba(198,255,0,0.1)] flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-[#c6ff00]" />
            </div>
            <div>
              <div className="text-[#c6ff00] font-medium">All Systems Operational</div>
              <p className="text-xs text-gray-600 mt-1">Database and Auth services are functioning normally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
