-- Profiles table (matches user profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    employee_id TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    department TEXT,
    access_level TEXT,
    permissions TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    member_since TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Events table (handles society events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_time TEXT NOT NULL,
    location TEXT,
    capacity INTEGER DEFAULT 300,
    registered_count INTEGER DEFAULT 0,
    privacy TEXT DEFAULT 'Members Only',
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Posts table (manages updates and news)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    type TEXT DEFAULT 'regular' CHECK (type IN ('promoted', 'regular')),
    media_url TEXT,
    reach_count INTEGER DEFAULT 0,
    interaction_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Connections Queue table (verification approvals)
CREATE TABLE IF NOT EXISTS public.connections_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'declined')),
    blockchain_verified BOOLEAN DEFAULT FALSE,
    warning_flag TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Groups table (chat groups/chapters)
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    description TEXT,
    member_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Basic Public Access Policies (Read allowed for authenticated users)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to groups" ON public.groups FOR SELECT USING (true);

-- Admin CRUD Policies
CREATE POLICY "Allow admins all access to everything" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admins all access to events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admins all access to posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admins all access to queue" ON public.connections_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admins all access to groups" ON public.groups FOR ALL USING (true) WITH CHECK (true);
