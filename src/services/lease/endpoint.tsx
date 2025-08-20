/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class LeaseBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  /**
   * Lease
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
  submitLease = (data: any, option = {}): Promise<any> =>
    this.post(this.prefix + `/upload_lease_tenant`, data, option);
  userleasedetails = (): Promise<any> =>
    this.get(`termination/lease_of_user_for_termination`, {})
  terminatelease = (data: any, options = {}): Promise<any> =>
    this.post(`/termination`, data, options);
  // leaseBaseService.ts
  getClauseDetails(leaseId: string, clauseDocId: string): Promise<any> {
    return this.get(
      `clause/read_single_clause/${encodeURIComponent(leaseId)}/${encodeURIComponent(clauseDocId)}`
    );
  }
    getSingleLeaseDetail(leaseId: string): Promise<any> {
      console.log("lease",leaseId)
    return this.get(
      `clause/get_lease/${leaseId}`
    );
  }

  // `/get_single_loi/${id}`

}

export const leaseBaseService = new LeaseBaseService();