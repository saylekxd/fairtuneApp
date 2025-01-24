/*
  # Fix User Policies

  1. Changes
    - Drop and recreate user policies to avoid conflicts
    - Simplify access control
*/

-- Drop all existing policies for users table
DROP POLICY IF EXISTS "Users can view profiles in their location" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create new policies
CREATE POLICY "view_own_profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "view_all_users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "update_own_profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);