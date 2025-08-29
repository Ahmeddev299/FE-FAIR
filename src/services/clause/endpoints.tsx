/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class ClauseBaseService extends HttpService {
  // Fetch all clauses for a lease
  getClausesByLease(leaseId: string): Promise<any> {
    return this.get(`clause/get_clauses/${leaseId}`);
  }

  // Fetch single clause
  getClauseById(leaseId: string, clauseId: string): Promise<any> {
    return this.get(`clause/read_single_clause/${leaseId}/${clauseId}`);
  }

  // Approve / reject / edit
  updateClauseStatus = (
    leaseId: string,
    payload: { clause_key: string; tag: "approved" | "reject" }
  ): Promise<any> =>
    this.put(
      `clause/landlord_clause_update_accept_reject_lease/${leaseId}`,
      payload
    );
}

export const clauseBaseService = new ClauseBaseService();
