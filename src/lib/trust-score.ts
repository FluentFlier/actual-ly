import { differenceInMonths } from "date-fns";

type TrustInputs = {
  phoneVerified: boolean;
  emailVerified: boolean;
  verifiedConnections: number;
  createdAt: string | Date;
  engagementPoints: number;
};

export type TrustScoreBreakdown = {
  total: number;
  humanVerification: number;
  email: number;
  accountAge: number;
  connections: number;
  engagement: number;
};

export function calculateTrustScore({
  phoneVerified,
  emailVerified,
  verifiedConnections,
  createdAt,
  engagementPoints,
}: TrustInputs): TrustScoreBreakdown {
  const humanVerification = phoneVerified ? 50 : 0;
  const email = emailVerified ? 10 : 0;
  const accountAge = Math.min(20, Math.max(0, differenceInMonths(new Date(), new Date(createdAt)) * 2));
  const connections = Math.min(10, Math.max(0, verifiedConnections));
  const engagement = Math.min(10, Math.max(0, engagementPoints));
  const total = Math.min(100, humanVerification + email + accountAge + connections + engagement);

  return { total, humanVerification, email, accountAge, connections, engagement };
}
