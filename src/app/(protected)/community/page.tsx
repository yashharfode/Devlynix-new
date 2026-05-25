import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Trophy, Medal, Star, Zap, Users } from "lucide-react";

export default async function CommunityLeaderboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch top 50 users ranked by XP
  // TODO: Fetch users from DB
  const topUsers: any[] = [];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-12 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-900/30 text-emerald-500 text-sm font-medium mb-6">
          <Trophy className="w-4 h-4" /> Global Rankings
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          The Hall of Fame
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Rankings are based on total XP earned through shipping projects, winning hackathons, and maintaining streaks.
        </p>
      </div>

      {/* Top 3 Podium (Optional extra flair) */}
      {topUsers.length >= 3 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12 px-4">
          {/* Rank 2 */}
          <div className="w-full md:w-1/3 bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 text-center order-2 md:order-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-500/50" />
            <Medal className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <div className="text-lg font-bold text-white truncate">@{topUsers[1].username}</div>
            <div className="text-sm text-emerald-600 font-mono mt-1">{topUsers[1].xp.toLocaleString()} XP</div>
          </div>

          {/* Rank 1 */}
          <div className="w-full md:w-1/3 bg-[#111] border border-emerald-900/50 rounded-2xl p-8 text-center order-1 md:order-2 relative shadow-[0_0_40px_rgba(4,120,87,0.1)] z-10 transform md:-translate-y-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <div className="text-xl font-black text-white truncate">@{topUsers[0].username}</div>
            <div className="text-md text-emerald-400 font-mono mt-1 font-bold">{topUsers[0].xp.toLocaleString()} XP</div>
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" /> {topUsers[0].streak_days} Day Streak
            </div>
          </div>

          {/* Rank 3 */}
          <div className="w-full md:w-1/3 bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 text-center order-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-700/50" />
            <Medal className="w-8 h-8 text-amber-700/70 mx-auto mb-3" />
            <div className="text-lg font-bold text-white truncate">@{topUsers[2].username}</div>
            <div className="text-sm text-emerald-600 font-mono mt-1">{topUsers[2].xp.toLocaleString()} XP</div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#111] bg-[#050505] text-xs font-mono text-gray-600 uppercase tracking-wider">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Builder</div>
          <div className="col-span-2 text-center hidden md:block">Level</div>
          <div className="col-span-3 text-right pr-4">Total XP</div>
        </div>

        <div className="divide-y divide-[#111]">
          {topUsers.map((user, index) => {
            const isCurrentUser = user.clerk_user_id === userId;
            
            return (
              <div 
                key={user.id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${
                  isCurrentUser ? 'bg-emerald-900/10' : 'hover:bg-[#111]/50'
                }`}
              >
                <div className="col-span-2 flex justify-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-emerald-500/20 text-emerald-500' :
                    index === 1 ? 'bg-gray-500/20 text-gray-400' :
                    index === 2 ? 'bg-amber-700/20 text-amber-600' :
                    'text-gray-500 bg-[#111]'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                
                <div className="col-span-7 md:col-span-5 flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate flex items-center gap-2">
                      @{user.username || 'Anonymous'}
                      {isCurrentUser && <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/30 text-emerald-500 border border-emerald-900/50">YOU</span>}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 text-emerald-700" /> {user.streak_days} days
                    </div>
                  </div>
                </div>

                <div className="col-span-2 hidden md:flex justify-center items-center">
                  <span className="px-3 py-1 rounded-full border border-[#111] bg-[#0A0A0A] text-xs text-gray-400 font-mono">
                    {user.builder_level}
                  </span>
                </div>

                <div className="col-span-3 text-right pr-4 font-mono font-bold text-emerald-500">
                  {user.xp.toLocaleString()}
                </div>
              </div>
            );
          })}
          
          {topUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No builders ranked yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple fallback icon since we didn't import User
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
