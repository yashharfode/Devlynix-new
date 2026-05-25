-- ==========================================
-- DEVLYNIX SUPABASE SCHEMA (ADVANCED TOOLS)
-- ==========================================

-- 1. HACKATHONS
CREATE TABLE public.hackathons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    mode TEXT CHECK (mode IN ('ONLINE', 'IRL', 'HYBRID')),
    location TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    min_team_size INT DEFAULT 1,
    max_team_size INT DEFAULT 4,
    allowed_roles TEXT[] DEFAULT '{"STUDENT", "PROFESSIONAL"}',
    estimated_hackers INT DEFAULT 0,
    estimated_budget DECIMAL(12, 2) DEFAULT 0.00,
    organizer_id TEXT NOT NULL, -- Clerk User ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HACKATHON TRACKS (For custom prize allocations)
CREATE TABLE public.hackathon_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Web3", "AI", "Open Source"
    description TEXT,
    prize_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HACKATHON JUDGES
CREATE TABLE public.hackathon_judges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HACKERS (Profiles for the Tinder-like Team Builder)
CREATE TABLE public.hackers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    primary_role TEXT CHECK (primary_role IN ('FRONTEND', 'BACKEND', 'FULLSTACK', 'DESIGNER', 'PM', 'AI_ENGINEER', 'WEB3_DEV')),
    looking_for_team BOOLEAN DEFAULT TRUE,
    pre_hackathon_pitch_opt_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HACKER SKILLS (For advanced matching)
CREATE TABLE public.hacker_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hacker_id UUID REFERENCES public.hackers(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL, -- e.g. "React", "Rust", "Solidity", "Figma"
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5)
);

-- 6. TEAM MATCHING REQUESTS (The "Swipe" mechanism)
-- Status: PENDING, ACCEPTED (Match!), REJECTED (Pass)
CREATE TABLE public.team_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.hackers(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.hackers(id) ON DELETE CASCADE,
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id, hackathon_id)
);

-- RLS (Row Level Security) Example Policies
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hackathons"
    ON public.hackathons FOR SELECT
    USING (true);

CREATE POLICY "Organizers can create hackathons"
    ON public.hackathons FOR INSERT
    WITH CHECK (auth.uid()::text = organizer_id); -- Assuming JWT mapping is setup with Clerk
