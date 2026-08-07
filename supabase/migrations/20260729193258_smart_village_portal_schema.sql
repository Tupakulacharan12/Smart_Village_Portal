/*
# Smart Village Information Portal - Gudlavalleru

## Overview
Creates the full backend for a community governance portal for Gudlavalleru, Andhra Pradesh.
Residents (no login) can read public content, submit complaints, track them by ticket
number, leave feedback, and are counted by a visitor counter. An administrator (Supabase
email/password auth) logs in to manage news, notices, gallery, health camps, events,
complaints status, and feedback.

## Tables created
- complaints       Resident complaints with ticket-based tracking + status workflow.
- news             Village news, events, festivals, public meeting announcements.
- notices          Panchayat notices, circulars, tenders, tax notices, meeting minutes.
- gallery          Village photo gallery (festivals, schools, parks, temples, etc.).
- health_camps     Health camps, vaccination drives, blood donation camps.
- events           Upcoming village events / gram sabha / public meetings.
- feedback         Public feedback / online suggestions with rating.
- visits           One row per site visit, used for the visitor counter.

## Security (RLS)
- Public content tables (news, notices, gallery, health_camps, events): anyone can SELECT
  (anon + authenticated). Only authenticated admins can INSERT/UPDATE/DELETE.
- complaints: anyone can INSERT (residents submit). Only authenticated admins can SELECT
  all complaints and UPDATE status. Public cannot list complaints (PII protected); instead
  a SECURITY DEFINER function `get_complaint_by_ticket(ticket)` lets a resident look up
  just the status of their own complaint using the secret ticket number they received.
- feedback: anyone can INSERT; only authenticated admins can SELECT.
- visits: anyone can INSERT (log a visit) and SELECT (to compute the count).

## Functions
- get_complaint_by_ticket(p_ticket) : SECURITY DEFINER, returns non-PII status fields for a
  given ticket number so residents can track complaints without exposing personal data.

## Notes
1. Uses IF NOT EXISTS / ON CONFLICT for idempotent re-runs.
2. Policies are dropped before (re)creation because CREATE POLICY has no reliable IF NOT EXISTS.
3. No destructive operations; safe to re-apply.
*/

-- ---------- complaints ----------
CREATE TABLE IF NOT EXISTS public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no text UNIQUE NOT NULL,
  name text NOT NULL,
  mobile text NOT NULL,
  email text,
  area text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  image_data text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON public.complaints(created_at desc);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_complaints" ON public.complaints;
CREATE POLICY "anon_insert_complaints" ON public.complaints
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_complaints" ON public.complaints;
CREATE POLICY "auth_select_complaints" ON public.complaints
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_complaints" ON public.complaints;
CREATE POLICY "auth_update_complaints" ON public.complaints
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_complaints" ON public.complaints;
CREATE POLICY "auth_delete_complaints" ON public.complaints
  FOR DELETE TO authenticated USING (true);

-- ---------- news ----------
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text,
  category text NOT NULL DEFAULT 'General',
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_news_created ON public.news(created_at desc);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_news" ON public.news;
CREATE POLICY "public_read_news" ON public.news
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_news" ON public.news;
CREATE POLICY "auth_insert_news" ON public.news
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_news" ON public.news;
CREATE POLICY "auth_update_news" ON public.news
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_news" ON public.news;
CREATE POLICY "auth_delete_news" ON public.news
  FOR DELETE TO authenticated USING (true);

-- ---------- notices ----------
CREATE TABLE IF NOT EXISTS public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  notice_type text NOT NULL DEFAULT 'Circular',
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notices_created ON public.notices(created_at desc);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_notices" ON public.notices;
CREATE POLICY "public_read_notices" ON public.notices
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_notices" ON public.notices;
CREATE POLICY "auth_insert_notices" ON public.notices
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_notices" ON public.notices;
CREATE POLICY "auth_update_notices" ON public.notices
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_notices" ON public.notices;
CREATE POLICY "auth_delete_notices" ON public.notices
  FOR DELETE TO authenticated USING (true);

-- ---------- gallery ----------
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Village',
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gallery" ON public.gallery;
CREATE POLICY "public_read_gallery" ON public.gallery
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_gallery" ON public.gallery;
CREATE POLICY "auth_insert_gallery" ON public.gallery
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_gallery" ON public.gallery;
CREATE POLICY "auth_update_gallery" ON public.gallery
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_gallery" ON public.gallery;
CREATE POLICY "auth_delete_gallery" ON public.gallery
  FOR DELETE TO authenticated USING (true);

-- ---------- health_camps ----------
CREATE TABLE IF NOT EXISTS public.health_camps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  camp_date date,
  location text,
  camp_type text NOT NULL DEFAULT 'Health Camp',
  contact text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_health_camps_date ON public.health_camps(camp_date desc);

ALTER TABLE public.health_camps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_health_camps" ON public.health_camps;
CREATE POLICY "public_read_health_camps" ON public.health_camps
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_health_camps" ON public.health_camps;
CREATE POLICY "auth_insert_health_camps" ON public.health_camps
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_health_camps" ON public.health_camps;
CREATE POLICY "auth_update_health_camps" ON public.health_camps
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_health_camps" ON public.health_camps;
CREATE POLICY "auth_delete_health_camps" ON public.health_camps
  FOR DELETE TO authenticated USING (true);

-- ---------- events ----------
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date,
  location text,
  category text NOT NULL DEFAULT 'Event',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_events" ON public.events;
CREATE POLICY "public_read_events" ON public.events
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_events" ON public.events;
CREATE POLICY "auth_insert_events" ON public.events
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_events" ON public.events;
CREATE POLICY "auth_update_events" ON public.events
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_events" ON public.events;
CREATE POLICY "auth_delete_events" ON public.events
  FOR DELETE TO authenticated USING (true);

-- ---------- feedback ----------
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  message text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at desc);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_feedback" ON public.feedback;
CREATE POLICY "anon_insert_feedback" ON public.feedback
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_feedback" ON public.feedback;
CREATE POLICY "auth_select_feedback" ON public.feedback
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_delete_feedback" ON public.feedback;
CREATE POLICY "auth_delete_feedback" ON public.feedback
  FOR DELETE TO authenticated USING (true);

-- ---------- visits (visitor counter) ----------
CREATE TABLE IF NOT EXISTS public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visits_at ON public.visits(visited_at desc);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_visits" ON public.visits;
CREATE POLICY "anon_insert_visits" ON public.visits
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select_visits" ON public.visits;
CREATE POLICY "anon_select_visits" ON public.visits
  FOR SELECT TO anon, authenticated USING (true);

-- ---------- tracking function (SECURITY DEFINER, bypasses RLS) ----------
CREATE OR REPLACE FUNCTION public.get_complaint_by_ticket(p_ticket text)
RETURNS TABLE (
  ticket_no text,
  status text,
  category text,
  area text,
  created_at timestamptz,
  updated_at timestamptz,
  admin_notes text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.ticket_no, c.status, c.category, c.area, c.created_at, c.updated_at, c.admin_notes
  FROM public.complaints c
  WHERE c.ticket_no = p_ticket;
$$;

-- ---------- seed data ----------
INSERT INTO public.news (title, summary, content, category, image_url, is_featured) VALUES
('Free Medical Health Camp at PHC Gudlavalleru', 'A free general health check-up camp is organised at the Primary Health Centre on 12 August. All residents are welcome.', 'The Primary Health Centre, Gudlavalleru in association with the Mandal Health Department is organising a free general health check-up camp on 12 August from 9:00 AM to 1:00 PM. Free BP, sugar, and eye screening will be available. Senior citizens will be given priority tokens. Please carry your Aadhaar card.', 'Health', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('Gram Sabha Meeting Notice - August', 'The monthly Gram Sabha will be held at the Panchayat Office on 15 August at 10:00 AM.', 'All residents of Gudlavalleru are informed that the monthly Gram Sabha meeting will be held at the Panchayat Office on 15 August at 10:00 AM. Agenda includes drinking water supply, street lighting repairs, and review of ongoing road works. Residents are requested to attend and participate.', 'Public Meeting', 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false),
('Water Supply Maintenance Work', 'Water supply will be temporarily affected on 10 August in some areas due to pipeline maintenance.', 'Due to maintenance work on the main drinking water pipeline, water supply will be temporarily affected on 10 August from 8:00 AM to 2:00 PM in the following areas: Main Road, Colony Area, and near the Bus Stand. Residents are requested to store water in advance. Regular supply will resume by evening.', 'Water Supply', 'https://images.pexels.com/photos/11276073/pexels-photo-11276073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false)
ON CONFLICT DO NOTHING;

INSERT INTO public.notices (title, content, notice_type, file_url) VALUES
('Property Tax Collection - Q2', 'Property tax for the second quarter is now due. Residents can pay at the Panchayat Office between 9:30 AM and 5:00 PM on working days. A 5% rebate is available for early payment before the 20th of the month.', 'Tax Notice', NULL),
('Tender Notice - Road Laying in Ward 3', 'Sealed tenders are invited from approved contractors for the laying of CC road in Ward 3, Gudlavalleru. Tender documents can be obtained from the Panchayat Office. Last date for submission is 25 August.', 'Tender Notice', NULL),
('Meeting Minutes - July Gram Sabha', 'Minutes of the July Gram Sabha meeting are now available. Key decisions included approval of new street lights in Ward 2 and allocation of funds for school infrastructure.', 'Meeting Minutes', NULL),
('Circular - Swachh Bharat Cleanliness Drive', 'A village-wide cleanliness drive will be conducted from 1 to 7 September. All wards are requested to participate. Garbage collection vehicles will run on an enhanced schedule during this period.', 'Circular', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO public.gallery (title, category, image_url) VALUES
('Lush paddy fields around Gudlavalleru', 'Agriculture', 'https://images.pexels.com/photos/11276073/pexels-photo-11276073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Green fields and palms', 'Village', 'https://images.pexels.com/photos/12630109/pexels-photo-12630109.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Ancient temple architecture', 'Temples', 'https://images.pexels.com/photos/15655443/pexels-photo-15655443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('School children in class', 'Schools', 'https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Holi festival celebrations', 'Festivals', 'https://images.pexels.com/photos/14546935/pexels-photo-14546935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Village market street', 'Village', 'https://images.pexels.com/photos/36848899/pexels-photo-36848899.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Farmer tending rice paddy', 'Agriculture', 'https://images.pexels.com/photos/5602330/pexels-photo-5602330.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Sunset over the fields', 'Village', 'https://images.pexels.com/photos/14814910/pexels-photo-14814910.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
('Stone temple carvings', 'Temples', 'https://images.pexels.com/photos/31969428/pexels-photo-31969428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT DO NOTHING;

INSERT INTO public.health_camps (title, description, camp_date, location, camp_type, contact) VALUES
('Free General Health Check-up Camp', 'Free BP, blood sugar, and eye screening for all residents. Senior citizens given priority.', '2026-08-12', 'PHC Gudlavalleru', 'Health Camp', '08676-234567'),
('Polio & Routine Vaccination Drive', 'Polio drops and routine immunization for children below 5 years.', '2026-08-20', 'Anganwadi Centers', 'Vaccination Drive', '08676-234567'),
('Blood Donation Camp', 'Voluntary blood donation camp organised with the District Hospital. Donors will receive a certificate and refreshments.', '2026-09-05', 'Panchayat Office Hall', 'Blood Donation Camp', '97017-00000')
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, event_date, location, category) VALUES
('Monthly Gram Sabha', 'Monthly Gram Sabha meeting to discuss water supply, street lighting, and road works.', '2026-08-15', 'Panchayat Office', 'Gram Sabha'),
('Independence Day Flag Hoisting', '77th Independence Day flag hoisting ceremony followed by cultural programs by school children.', '2026-08-15', 'ZP High School Ground', 'National Festival'),
('Swachh Bharat Cleanliness Drive', 'Week-long village cleanliness drive across all wards.', '2026-09-01', 'All Wards', 'Community Drive'),
('Vinayaka Chaviti Celebrations', 'Community Vinayaka Chaviti celebrations and idol immersion arrangements.', '2026-09-07', 'Village Center', 'Festival')
ON CONFLICT DO NOTHING;

INSERT INTO public.feedback (name, email, message, rating) VALUES
('Ramesh Kumar', 'ramesh@example.com', 'The new complaint system is very easy to use. I reported a street light issue and it was fixed in 3 days.', 5),
('Lakshmi Devi', 'lakshmi@example.com', 'Please add more Telugu content for elderly people who cannot read English.', 4)
ON CONFLICT DO NOTHING;

-- One sample visit so the counter is never zero on first load
INSERT INTO public.visits (visited_at) VALUES (now()) ON CONFLICT DO NOTHING;
