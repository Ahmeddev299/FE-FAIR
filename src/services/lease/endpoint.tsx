/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

type ClauseAction = "manual_edit" | "accept_ai_suggestion";

/** Match backend exactly */
export interface UpdateClausePayload {
  clause_id: string;   // ← backend expects this
  clause_key: string;  // ← backend expects this
  details: string;     // ← backend expects this (current text to persist)
  action: ClauseAction;
}

class LeaseBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);

  submitLease = (data: any, option = {}): Promise<any> =>
    this.post(this.prefix + `/upload_lease_tenant`, data, option);

  userleasedetails = (): Promise<any> =>
    this.get(`termination/lease_of_user_for_termination`, {});

  terminatelease = (data: any, options = {}): Promise<any> =>
    this.post(`/termination`, data, options);

  getClauseDetails(leaseId: string, clauseDocId: string): Promise<any> {
    return this.get(
      `clause/read_single_clause/${encodeURIComponent(leaseId)}/${encodeURIComponent(clauseDocId)}`
    );
  }

  getSingleLeaseDetail(leaseId: string): Promise<any> {
    return this.get(`clause/get_lease/${encodeURIComponent(leaseId)}`);
  }

  getUserLeases(params?: { page?: number; limit?: number }): Promise<any> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 5;
    return this.get(`clause/get_user_leases?page=${page}&limit=${limit}`);
  }

  /**
   * PUT /clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/:clauseId
   * Body MUST be { clause_id, clause_key, details, action }
   */
  updateClauseDetailOrCurrentVersion(
    clauseId: string,
    body: UpdateClausePayload
  ): Promise<any> {
    return this.put(
      `clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/${encodeURIComponent(clauseId)}`,
      body
    );
  }

  /** Convenience helpers (optional) using the CORRECT payload keys */
  acceptClauseSuggestion(
    clauseId: string,
    clause_key: string,
    details: string
  ): Promise<any> {
    return this.updateClauseDetailOrCurrentVersion(clauseId, {
      clause_id: clauseId,
      clause_key,
      details,
      action: "accept_ai_suggestion",
    });
  }

  saveClauseManualEdit(
    clauseId: string,
    clause_key: string,
    details: string
  ): Promise<any> {
    return this.updateClauseDetailOrCurrentVersion(clauseId, {
      clause_id: clauseId,
      clause_key,
      details,
      action: "manual_edit",
    });
  }
}

export const leaseBaseService = new LeaseBaseService();
export type { ClauseAction };

