/*
  # Add genre column to tracks table

  1. Changes
    - Add genre column to tracks table
*/

ALTER TABLE tracks 
ADD COLUMN IF NOT EXISTS genre text;