import { apiClient } from "@/lib/api";

export interface ReviewInvitationData {
  target_type: "trip" | "hotel" | "vehicle";
  booking_id: string;
  title: string;
  slug: string;
  image_url: string;
  start_date: string;
  end_date: string;
  details: Record<string, any>;
  customer_name: string;
  is_submitted: boolean;
  submitted_at: string | null;
}

export interface SubmitReviewPayload {
  title: string;
  body: string;
  rating: number;
  photos?: string[];
}

export interface SubmitReviewResponse {
  id: number;
  target_type: string;
  message: string;
}

/**
 * Fetch post-booking review invitation details using token from email link.
 */
export async function getReviewInvitation(token: string): Promise<ReviewInvitationData> {
  const data = await apiClient.get<ReviewInvitationData>(
    `/reviews/invitations/${encodeURIComponent(token)}/`
  );
  return ((data as any)?.data || data) as ReviewInvitationData;
}

/**
 * Submit customer review using the secure invitation token.
 */
export async function submitReviewInvitation(
  token: string,
  payload: SubmitReviewPayload
): Promise<SubmitReviewResponse> {
  const data = await apiClient.post<SubmitReviewResponse>(
    `/reviews/invitations/${encodeURIComponent(token)}/`,
    payload
  );
  return ((data as any)?.data || data) as SubmitReviewResponse;
}
