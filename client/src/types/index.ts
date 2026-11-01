export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  account_status?: 'ACTIVE' | 'SUSPENDED';
  approvalStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  availability?: 'ONLINE' | 'OFFLINE' | 'ON_TRIP';
  ratingAvg?: number;
  ratingCount?: number;
  experienceYears?: number;
  bio?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  created_at?: string;
}

export interface Vehicle {
  id: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  fuel_type: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  notes?: string;
  created_at?: string;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience_years: number;
  service_area: string;
  approval_status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  availability: 'ONLINE' | 'OFFLINE' | 'ON_TRIP';
  rating_avg: number;
  rating_count: number;
  hourly_rate_paise: number;
  bio: string;
  documents?: DriverDocument[];
}

export interface DriverDocument {
  id: number;
  driver_id: number;
  document_type: string;
  file_path: string;
  review_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
  created_at?: string;
}

export type BookingStatus =
  | 'DRAFT'
  | 'SEARCHING'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'DISPUTED';

export interface Booking {
  id: number;
  reference_code: string;
  customer_id: number;
  driver_id?: number | null;
  vehicle_id: number;
  trip_type: string;
  pickup_address: string;
  destination_address?: string;
  start_time: string;
  duration_hours: number;
  status: BookingStatus;
  estimated_fare_paise: number;
  final_fare_paise?: number;
  platform_fee_paise?: number;
  driver_payout_paise?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Joined fields
  make?: string;
  model?: string;
  year?: number;
  registration_number?: string;
  transmission?: 'AUTOMATIC' | 'MANUAL';
  fuel_type?: string;
  customer_name?: string;
  customer_phone?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_rating?: number;
  driver_experience?: number;
  review_rating?: number;
  review_comment?: string;
}

export interface BookingEvent {
  id: number;
  booking_id: number;
  actor_id: number;
  actor_name?: string;
  actor_role?: string;
  old_status?: string;
  new_status: string;
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface PricingRule {
  id: number;
  service_area: string;
  trip_type: string;
  base_fee_paise: number;
  hourly_rate_paise: number;
  min_hours: number;
  waiting_rate_paise_per_hr: number;
  platform_commission_pct: number;
  is_active: boolean;
}

export interface SupportCase {
  id: number;
  booking_id?: number;
  creator_id: number;
  creator_name?: string;
  creator_email?: string;
  creator_role?: string;
  booking_reference?: string;
  category: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  assigned_admin_id?: number;
  resolution_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_id: number;
  actor_name?: string;
  actor_email?: string;
  action: string;
  target_type: string;
  target_id: number;
  metadata?: string;
  created_at: string;
}

