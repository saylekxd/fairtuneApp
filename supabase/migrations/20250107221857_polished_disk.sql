-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved version of the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, location_id)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    '00000000-0000-0000-0000-000000000000'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing auth users have profiles
INSERT INTO public.users (id, email, role, location_id)
SELECT id, email, 'user', '00000000-0000-0000-0000-000000000000'
FROM auth.users
ON CONFLICT (id) DO NOTHING;