-- Add is_premium to profiles (synced from Stripe / subscription logic)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT FALSE;

-- Function to validate referral code (bypasses RLS so anonymous users can check)
CREATE OR REPLACE FUNCTION public.check_referral_code_exists(code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE referral_code IS NOT NULL
      AND upper(trim(referral_code)) = upper(trim(code))
  );
$$;

-- Optional: function to get referrer_id for applying referral (for after signup)
CREATE OR REPLACE FUNCTION public.get_referrer_id_by_code(code TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.profiles
  WHERE referral_code IS NOT NULL
    AND upper(trim(referral_code)) = upper(trim(code))
  LIMIT 1;
$$;
