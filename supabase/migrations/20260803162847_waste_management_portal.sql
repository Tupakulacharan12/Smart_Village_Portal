/*
# Waste Management & Clean Village Portal

## Overview
Creates two tables for a community waste management portal:
1. waste_complaints — residents report waste/sanitation issues with their address (street/area), a message, and optional photo. Panchayat authorities can view and respond (update status + notes).
2. waste_volunteers — residents register as volunteers for cleanliness campaigns.

## New Tables

### 1. waste_complaints
Stores waste-related complaints from residents.
- id (uuid, PK)
- reporter_name (text) — name of the person reporting
- reporter_mobile (text) — 10-digit contact number
- area (text) — village area/zone
- address (text) — specific street or house address
- waste_type (text) — Garbage Overflow, Drainage, Open Dumping, Plastic, Public Toilet, Animal Waste, Other
- message (text) — description of the issue
- image_data (text, nullable) — base64 photo
- status (text, default 'pending') — pending / in-progress / resolved
- admin_notes (text, nullable) — response from authorities
- created_at (timestamptz)
- updated_at (timestamptz)

### 2. waste_volunteers
Stores volunteer registrations for cleanliness drives.
- id (uuid, PK)
- name (text)
- mobile (text)
- area (text)
- availability (text) — Weekday Mornings, Weekday Evenings, Weekends, Anytime
- message (text, nullable) — why they want to volunteer
- status (text, default 'active')
- created_at (timestamptz)

## Security
- Both tables have RLS enabled.
- TO anon, authenticated with USING (true) — public community platform, no sign-in required.
- All CRUD allowed for anon + authenticated.
*/

CREATE TABLE IF NOT EXISTS waste_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name text NOT NULL,
  reporter_mobile text NOT NULL,
  area text NOT NULL,
  address text NOT NULL,
  waste_type text NOT NULL DEFAULT 'Garbage Overflow',
  message text NOT NULL,
  image_data text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE waste_complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_waste_complaints" ON waste_complaints;
CREATE POLICY "anon_select_waste_complaints"
ON waste_complaints FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_waste_complaints" ON waste_complaints;
CREATE POLICY "anon_insert_waste_complaints"
ON waste_complaints FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_waste_complaints" ON waste_complaints;
CREATE POLICY "anon_update_waste_complaints"
ON waste_complaints FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_waste_complaints" ON waste_complaints;
CREATE POLICY "anon_delete_waste_complaints"
ON waste_complaints FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS waste_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  area text NOT NULL,
  availability text NOT NULL DEFAULT 'Weekends',
  message text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waste_volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_waste_volunteers" ON waste_volunteers;
CREATE POLICY "anon_select_waste_volunteers"
ON waste_volunteers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_waste_volunteers" ON waste_volunteers;
CREATE POLICY "anon_insert_waste_volunteers"
ON waste_volunteers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_waste_volunteers" ON waste_volunteers
;
CREATE POLICY "anon_update_waste_volunteers"
ON waste_volunteers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_waste_volunteers" ON waste_volunteers;
CREATE POLICY "anon_delete_waste_volunteers"
ON waste_volunteers FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_waste_complaints_status ON waste_complaints(status);
CREATE INDEX IF NOT EXISTS idx_waste_complaints_area ON waste_complaints(area);
CREATE INDEX IF NOT EXISTS idx_waste_volunteers_status ON waste_volunteers(status);