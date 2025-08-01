/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class LeaseBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  /**
   * Lease
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
  submitLease = (data: any): Promise<any> =>
    this.post(this.prefix + `/upload_lease_tenant`, data);
}

export const leaseBaseService = new LeaseBaseService();