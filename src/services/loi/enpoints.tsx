/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class LoiBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  /**
   * Loi
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
  submitLOI = (data: any): Promise<any> =>
    this.post(this.prefix + `/submit_loi`, data);
}

export const loiBaseService = new LoiBaseService();
