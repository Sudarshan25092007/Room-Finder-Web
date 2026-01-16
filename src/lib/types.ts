export type Room = {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  location: string;
  rent: number;
  property_type: string;
  tenant_preference: string;
  contact_number: string;
  images: string[] | null;
  created_at?: string;
};


