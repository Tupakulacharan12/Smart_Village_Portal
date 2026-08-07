import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Complaint, NewsItem, Notice, GalleryItem, HealthCamp, EventItem, FeedbackItem } from '@/lib/types';

export interface AdminData {
  complaints: Complaint[];
  news: NewsItem[];
  notices: Notice[];
  gallery: GalleryItem[];
  healthCamps: HealthCamp[];
  events: EventItem[];
  feedback: FeedbackItem[];
  visits: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [healthCamps, setHealthCamps] = useState<HealthCamp[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [c, n, no, g, hc, e, fb, v] = await Promise.all([
      supabase.from('complaints').select('*').order('created_at', { ascending: false }),
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('notices').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      supabase.from('health_camps').select('*').order('camp_date', { ascending: false }),
      supabase.from('events').select('*').order('event_date', { ascending: true }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
      supabase.from('visits').select('*', { count: 'exact', head: true }),
    ]);
    setComplaints(c.data ?? []);
    setNews(n.data ?? []);
    setNotices(no.data ?? []);
    setGallery(g.data ?? []);
    setHealthCamps(hc.data ?? []);
    setEvents(e.data ?? []);
    setFeedback(fb.data ?? []);
    setVisits(v.count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { complaints, news, notices, gallery, healthCamps, events, feedback, visits, loading, refresh };
}
