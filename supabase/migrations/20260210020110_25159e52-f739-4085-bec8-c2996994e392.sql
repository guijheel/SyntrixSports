
-- Table for storing normalized match data from multiple APIs
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
  league TEXT NOT NULL,
  season TEXT,
  sport TEXT NOT NULL DEFAULT 'football',
  
  -- Teams
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_logo TEXT,
  away_logo TEXT,
  home_ranking INTEGER,
  away_ranking INTEGER,
  
  -- Score
  home_score INTEGER,
  away_score INTEGER,
  
  -- Stats (JSONB for flexibility)
  stats JSONB DEFAULT '{}'::jsonb,
  
  -- Odds (JSONB array of bookmaker odds)
  odds JSONB DEFAULT '[]'::jsonb,
  
  -- Source tracking
  data_source TEXT,
  source_priority INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(external_id, data_source)
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

-- Only admins can manage matches
CREATE POLICY "Admins can manage matches"
  ON public.matches FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for common queries
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_matches_league ON public.matches(league);
CREATE INDEX idx_matches_sport ON public.matches(sport);
CREATE INDEX idx_matches_status ON public.matches(status);
