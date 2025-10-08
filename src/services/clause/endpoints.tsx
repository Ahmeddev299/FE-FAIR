/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

export type AddCommentPayload = {
  clause_key: string;
  comment: string;
};

export type AddCommentResponse = {
  success?: boolean;
  status?: number;
  message?: string;
  data?: { comment?: { text: string; author?: string; created_at?: string } } | unknown;
};

class ClauseBaseService extends HttpService {
 
  getClausesByLease(leaseId: string): Promise<any> {
    return this.get(`clause/get_clauses/${leaseId}`);
  }

  getClauseById(leaseId: string, clauseId: string): Promise<any> {
    return this.get(`clause/read_single_clause/${leaseId}/${clauseId}`);
  }

  updateClauseStatus = (
    leaseId: string,
    payload: { clause_key: string; tag: "approved" | "reject" }
  ): Promise<any> =>
    this.put(
      `clause/landlord_clause_update_accept_reject_lease/${leaseId}`,
      payload
    )
  addCommentToClause(clauseDocId: string, payload: AddCommentPayload): Promise<AddCommentResponse> {
    return this.put(
      `clause/comment_on_signle_clauses_of_single_lease/${clauseDocId}`,
      {
        clause_key: payload.clause_key,
        clause_key_data: { text: payload.comment },
      }
    );
  }
}

export const clauseBaseService = new ClauseBaseService();
