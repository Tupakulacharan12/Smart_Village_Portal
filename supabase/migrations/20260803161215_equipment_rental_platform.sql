/*
# Smart Agricultural Equipment Rental & Sharing Platform

## Overview
Creates two tables to support a community equipment sharing platform where farmers can
list agricultural equipment they own (tractors, rotavators, harvesters, pumps, etc.)
for rent or sharing, and other farmers can browse listings and send rental requests
with a message to the owner.

## New Tables

### 1. equipment_listings
Stores equipment that farmers make available for rent or sharing.
- id (uuid, PK)
- owner_name (text) — name of the farmer listing the equipment
- owner_mobile (text) — contact number, 10 digits
- equipment_name (text) — e.g. "Tractor - Mahindra 575"
- equipment_type (text) — category: Tractor, Rotavator, Harvester, Pump Set, Sprayer, etc.
- description (text) — details about condition, capacity, etc.
- daily_rate (numeric) — rental fee per day in rupees (0 = free sharing)
- area (text) — location within the village
- image_data (text, nullable) — base64-encoded photo of the equipment
- status (text, default 'available') — available / rented / inactive
- created_at (timestamptz)

### 2. equipment_requests
Stores rental requests sent by farmers to equipment owners.
- id (uuid, PK)
- equipment_id (uuid, FK → equipment_listings.id ON DELETE CASCADE)
- requester_name (text) — name of the farmer requesting
- requester_mobile (text) — contact number
- message (text) — message to the equipment owner
- requested_date (date) — when they need the equipment
- duration_days (integer) — how many days they need it
- status (text, default 'pending') — pending / approved / rejected
- created_at (timestamptz)

## Security
- Both tables have RLS enabled.
- Policies use TO anon, authenticated since this is a public community platform (no sign-in required).
- All CRUD operations allowed for anon + authenticated — the data is intentionally shared publicly.
*/

CREATE TABLE IF NOT EXISTS equipment_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  owner_mobile text NOT NULL,
  equipment_name text NOT NULL,
  equipment_type text NOT NULL,
  description text NOT NULL DEFAULT '',
  daily_rate numeric NOT NULL DEFAULT 0,
  area text NOT NULL DEFAULT '',
  image_data text,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE equipment_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_equipment_listings" ON equipment_listings;
CREATE POLICY "anon_select_equipment_listings"
ON equipment_listings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_equipment_listings" ON equipment_listings;
CREATE POLICY "anon_insert_equipment_listings"
ON equipment_listings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_equipment_listings" ON equipment_listings;
CREATE POLICY "anon_update_equipment_listings"
ON equipment_listings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_equipment_listings" ON equipment_listings;
CREATE POLICY "anon_delete_equipment_listings"
ON equipment_listings FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS equipment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment_listings(id) ON DELETE CASCADE,
  requester_name text NOT NULL,
  requester_mobile text NOT NULL,
  message text NOT NULL DEFAULT '',
  requested_date date,
  duration_days integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE equipment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_select_equipment_requests"
ON equipment_requests FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_insert_equipment_requests"
ON equipment_requests FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_update_equipment_requests"
ON equipment_requests FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_delete_equipment_requests"
ON equipment_requests FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_equipment_listings_status ON equipment_listings(status);
CREATE INDEX IF NOT EXISTS idx_equipment_listings_type ON equipment_listings(equipment_type);
CREATE INDEX IF NOT EXISTS idx_equipment_requests_equipment_id ON equipment_requests(equipment_id);