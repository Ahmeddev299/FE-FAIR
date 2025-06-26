/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class AuthBaseService extends HttpService {
  private readonly prefix: string = "auth";

  /**
   * User
   * @paramdata
   */
  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
  signUp = (data: any): Promise<any> =>
    this.put(this.prefix + `/sign-up`, data);
  signIn = (data: any): Promise<any> =>
    this.post(this.prefix + `/sign-in`, data);
  socialSignIn = (data: any): Promise<any> =>
    this.post(this.prefix + `/social-sign-in`, data);
  forgetPassword = (data: any): Promise<any> =>
    this.post(this.prefix + `/request-otp`, data);
  verifyOTP = (data: any): Promise<any> =>
    this.post(this.prefix + `/verify-otp`, data);
  resetPassword = (data: any): Promise<any> =>
    this.post(this.prefix + `/change-password`, data);
}

export const authBaseService = new AuthBaseService();
