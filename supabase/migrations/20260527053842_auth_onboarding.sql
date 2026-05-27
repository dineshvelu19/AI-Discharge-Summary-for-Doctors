CREATE TYPE public.user_onboarding_status AS ENUM ('invited', 'first_login', 'nda_accepted', 'active');

ALTER TABLE public.users
ADD COLUMN onboarding_status public.user_onboarding_status DEFAULT 'invited';
