export interface DashboardTransaction {
  id: string;
  hash: string;
  amount: string;
  asset: string;
  status: "pending" | "submitted" | "success" | "failed";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSigner {
  id: string;
  publicKey: string;
  status: "active" | "inactive";
  balance: string;
  inFlight: number;
  totalUses: number;
  sequenceNumber: string;
}
