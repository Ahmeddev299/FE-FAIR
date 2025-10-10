export type Status = "New" | "In Review" | "Finalized" | "Rejected";
export type Risk = "Low" | "Medium" | "High";

export type LOI = {
  id: string;
  title: string;
  company: string;
  address: string;
  rent: string;
  date: string;
  status: Status;
  approved: number;
  pending: number;
  tenantName: string;
};

export type Clause = {
  id: string;
  title: string;
  risk: Risk;
  approved?: number;
  comments?: number;
  issue?: string;
  text: string;
  aiNote?: string;
};
