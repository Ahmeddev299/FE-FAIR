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
    draftLOI = (): Promise<any> =>
      this.get(this.prefix + `/mydraft_loi`, {});
    singledraftLOI = (id: string): Promise<any> =>
      this.get(this.prefix + `/get_single_loi/${id}`, {});
  }

  export const loiBaseService = new LoiBaseService();