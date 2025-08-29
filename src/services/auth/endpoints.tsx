/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class AuthBaseService extends HttpService {
  private readonly prefix: string = "auth";

  // NEW: fetch lists
  getAllLandlords = (): Promise<any> =>
    this.get(this.prefix + `/get_all_landlord`);

  getAllTenants = (): Promise<any> =>
    this.get(this.prefix + `/get_all_tenants`);

  /**
   * User auth endpoints (existing)
   */
  signUp = (data: any): Promise<any> =>
    this.post(this.prefix + `/sign_up`, data);
  signIn = (data: any): Promise<any> =>
    this.post(this.prefix + `/sign_in`, data);
  socialSignIn = (data: any): Promise<any> =>
    this.post(this.prefix + `/google_login`, data);
  forgetPassword = (data: any): Promise<any> =>
    this.post(this.prefix + `/change_password`, data);
  verifyOTP = (data: any): Promise<any> =>
    this.post(this.prefix + `/verify_email_to_reset_password`, data);
  resetPassword = (data: any): Promise<any> =>
    this.post(this.prefix + `/reset_password`, data);
}

export const authBaseService = new AuthBaseService();
