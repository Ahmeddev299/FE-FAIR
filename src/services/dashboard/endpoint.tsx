/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class DashboardBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  /**
   * Lease
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
   dashboardStats = (): Promise<any> =>
      this.get(this.prefix + `/`, {})
}

export const dashboardStatusService = new DashboardBaseService();