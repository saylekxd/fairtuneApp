-- Drop existing policies
DROP POLICY IF EXISTS "allow_read_own_user" ON users;
DROP POLICY IF EXISTS "allow_update_own_user" ON users;

-- Create new policies for users table
CREATE POLICY "allow_insert_user"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "allow_read_user"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "allow_update_user"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Update the handle_new_user function to be more permissive
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, location_id)
  VALUES (
    new.id,
    new.email,
    'user',
    '00000000-0000-0000-0000-000000000000'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();