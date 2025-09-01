/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

class AuthBaseService extends HttpService {
  private readonly prefix = "auth";

  // Auth
  signUp = (data: any) => this.post(`${this.prefix}/sign_up`, data);
  signIn = (data: any) => this.post(`${this.prefix}/sign_in`, data);
  socialSignIn = (data: any) => this.post(`${this.prefix}/google_login`, data);

  // NEW: fetch lists
  getAllLandlords = (): Promise<any> => this.get(`${this.prefix} + /get_all_landlord`);
  getAllTenants = (): Promise<any> => this.get(`${this.prefix} + /get_all_tenants`);

  // Password reset FLOW (match backend)
  // 1) email -> send OTP
  requestPasswordReset = (data: { email: string }) =>
    this.post(`${this.prefix}/reset_password`, data);

  // 2) verify OTP
  verifyResetOtp = (data: { email: string; OTP: string | number }) =>
    this.post(`${this.prefix}/verify_email_to_reset_password`, data);

  verifySignupOtp = (data: { email: string; OTP: string | number }) =>
  this.post(`${this.prefix}/email_varification`, data);

  // 3) change password
  setNewPassword = (data: { email: string; OTP: string | number; newPassword: string , confirmPassword: string}) =>
    this.post(`${this.prefix}/change_password`, data);
}

export const authBaseService = new AuthBaseService();
