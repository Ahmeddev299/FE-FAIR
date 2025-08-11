/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class AuthBaseService extends HttpService {
  private readonly prefix: string = "auth";

  /**
   * User
   * @paramdata
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
