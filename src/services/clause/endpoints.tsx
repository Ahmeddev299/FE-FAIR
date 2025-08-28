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
  updateClause(leaseId: string, clauseId: string, data: any): Promise<any> {
    return this.put(`clause/update_lease/${leaseId}/${clauseId}`, data);
  }
}

export const clauseBaseService = new ClauseBaseService();
