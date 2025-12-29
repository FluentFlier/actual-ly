export type UserProfile = {
  id: string;
  clerk_id: string;
  username: string;
  email: string | null;
  phone: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  trust_score: number;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
};
