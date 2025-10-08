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

  getloiData = (): Promise<any> =>
    this.get(this.prefix + `/get_all_loi_for_lease_submittion`, {});

  getLoggedInUser = (): Promise<any> =>
    this.get(`/auth/get_logged_in_user`, {});

  downloadloi = (data: any, option = {}): Promise<any> =>
    this.post(this.prefix + `/download_template_data`, data, option);

  changeLoggedInUser = (body: { fullName: string; role: string }): Promise<any> =>
    this.put(`/auth/update_logged_in_user`, body);

}

export const dashboardStatusService = new DashboardBaseService();

