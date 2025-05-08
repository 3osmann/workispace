
/// <reference types="vite/client" />

declare interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'booked' | 'maintenance';
  property_type: 'office' | 'residential';
  description?: string;
  image_url?: string;
  rating: number;
  workstations?: number;
  meeting_rooms?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  wifi?: boolean;
  parking?: boolean;
  coffee?: boolean;
  reception?: boolean;
  kitchen?: boolean;
  secured?: boolean;
  accessible?: boolean;
  printers?: boolean;
  flexible_hours?: boolean;
  country?: string;
  region?: string;
}
