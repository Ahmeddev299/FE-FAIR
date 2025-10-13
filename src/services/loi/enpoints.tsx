/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";
import { UpdateClausePayload } from "../lease/endpoint";

class LoiBaseService extends HttpService {
  private readonly prefix: string = "dashboard";
  /**
   * Loi
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
  submitLOI = (data: any): Promise<any> =>
    this.post(this.prefix + `/submit_loi`, data);
  draftLOI = (): Promise<any> =>
    this.get(this.prefix + `/mydraft_loi`, {});
  singledraftLOI = (id: string): Promise<any> =>
    this.get(this.prefix + `/get_single_loi/${id}`, {});
  aiAssistant = (data: any): Promise<any> =>
    this.post(this.prefix + `/ai_assistent`, data);
  deleteLOI = (id: string): Promise<any> =>
    this.delete(`${this.prefix}/delete_loi/${id}`, {});

  submitLOIByFile = (form: FormData): Promise<any> => {
    return this.post(this.prefix + `/submit_loi_by_file`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  readClause = (loiId: string, clause_key: string): Promise<any> => {
    return this.get(`landlord_loi/read_single_clause_of_LOI/${loiId}`, { clause_key },);
  };

  approveAll = (loiId: string): Promise<any> => {
    return this.put(`landlord_loi/approve_all_clauses_of_single_LOI/${loiId}`, {});
  };
  rejectAll = (loiId: string): Promise<any> => {
    return this.post(`landlord_loi/rejected_all_clauses_of_single_LOI/${loiId}`, {});
  };

  commentOnClause = (
    loiId: string,
    payload: { clause_key: string; clause_key_data: Record<string, any> }
  ): Promise<any> => {
    return this.post(`landlord_loi/comment_on_single_clauses_of_single_LOI/${loiId}`, payload);
  };

  approveLOIclause(
    clauseId: string,
    body: UpdateClausePayload
  ): Promise<any> {
    return this.put(
      `landlord_loi/reject_or_approve_single_clauses_of_single_LOI/${encodeURIComponent(clauseId)}`,
      body
    );
  }

  rejectLOIclause(
    clauseId: string,
    body: UpdateClausePayload
  ): Promise<any> {
    return this.put(
      `lanlord_loi/reject_or_approve_single_clauses_of_single_LOI/${encodeURIComponent(clauseId)}`,
      body
    );
  }

  decideSingleClause = (
    loiId: string,
    body: { clause_key: string; action: "approved" | "rejected"; clause_key_data?: Record<string, any> }
  ): Promise<any> => {
    return this.put(`landlord_loi/reject_or_approve_single_clauses_of_single_LOI/${loiId}`, body);
  };

  readClauseByLeaseDoc = (leaseId: string, docId: string): Promise<any> => {
    return this.get(`clause/read_single_clause_of_lease_of_user_in_landlord/${leaseId}/${docId}`, {});
  };

  landlordLOI = (): Promise<any> =>
    this.get(`/landlord_loi`, {});

}

export const loiBaseService = new LoiBaseService();