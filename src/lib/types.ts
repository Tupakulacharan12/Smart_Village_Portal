export type ComplaintStatus = 'pending' | 'in-progress' | 'completed';

export interface Complaint {
  id: string;
  ticket_no: string;
  name: string;
  mobile: string;
  email: string | null;
  area: string;
  category: string;
  description: string;
  image_data: string | null;
  status: ComplaintStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplaintTrackResult {
  ticket_no: string;
  status: ComplaintStatus;
  category: string;
  area: string;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string | null;
  notice_type: string;
  file_url: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface HealthCamp {
  id: string;
  title: string;
  description: string | null;
  camp_date: string | null;
  location: string | null;
  camp_type: string;
  contact: string | null;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  category: string;
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string | null;
  message: string;
  rating: number;
  created_at: string;
}

export interface Scheme {
  id: string;
  title: string;
  title_te?: string;
  title_hi?: string;
  category: string;
  description: string;
  eligibility: string;
  documents: string;
  benefits: string;
  lastDate: string;
  applyLink: string;
  helpline?: string;
  steps?: string[];
  tags?: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  number: string;
  icon: string;
  color: string;
}

export interface SchoolInfo {
  name: string;
  type: string;
  address: string;
  classes: string;
}

export interface TouristPlace {
  name: string;
  name_te?: string;
  name_hi?: string;
  description: string;
  distance: string;
  category: string;
  image: string;
}

export type WasteComplaintStatus = 'pending' | 'in-progress' | 'resolved';

export interface WasteComplaint {
  id: string;
  reporter_name: string;
  reporter_mobile: string;
  area: string;
  address: string;
  waste_type: string;
  message: string;
  image_data: string | null;
  status: WasteComplaintStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WasteVolunteer {
  id: string;
  name: string;
  mobile: string;
  area: string;
  availability: string;
  message: string | null;
  status: string;
  created_at: string;
}

export type EquipmentStatus = 'available' | 'rented' | 'inactive';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface EquipmentListing {
  id: string;
  owner_name: string;
  owner_mobile: string;
  equipment_name: string;
  equipment_type: string;
  description: string;
  daily_rate: number;
  area: string;
  image_data: string | null;
  status: EquipmentStatus;
  created_at: string;
}

export interface EquipmentRequest {
  id: string;
  equipment_id: string;
  requester_name: string;
  requester_mobile: string;
  message: string;
  requested_date: string | null;
  duration_days: number;
  status: RequestStatus;
  created_at: string;
}

export interface CertificateService {
  name: string;
  name_te: string;
  name_hi: string;
  icon: string;
  desc: string;
  desc_te: string;
  desc_hi: string;
  link: string;
  documents: string;
  fee: string;
  processingTime: string;
  onlineAvailable: boolean;
  offlineAvailable: boolean;
}
