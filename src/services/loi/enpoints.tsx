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
  aiAssistant = (data: any): Promise<any> =>
    this.post(this.prefix + `/ai_assistent`, data); 
  deleteLOI = (id: string): Promise<any> =>
    this.delete(`${this.prefix}/delete_loi/${id}`, {});

  submitLOIByFile = (form: FormData): Promise<any> => {
    return this.post(this.prefix + `/submit_loi_by_file`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };


}

export const loiBaseService = new LoiBaseService();