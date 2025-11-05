/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

export type BulletKey = { section: string; bullet_number: string | number };

export type AddBulletCommentPayload = BulletKey & { text: string };
export type ChangeBulletTextPayload  = BulletKey & { text: string };
export type ApproveRejectPayload     = BulletKey & { action: "approved" | "rejected" };

class ClauseBaseService extends HttpService {
  // PUT /leases/comment/:leaseId  { section, bullet_number, text }
  addBulletComment(leaseId: string, payload: AddBulletCommentPayload): Promise<any> {
    return this.put(`leases/comment/${leaseId}`, payload);
  }

  // PUT /leases/clause_change/:leaseId  { section, bullet_number, text }
  changeBulletText(leaseId: string, payload: ChangeBulletTextPayload): Promise<any> {
    return this.put(`leases/clause_change/${leaseId}`, payload);
  }

  // PUT /leases/approve_or_reject/:leaseId  { section, bullet_number, action }
  approveOrRejectBullet(leaseId: string, payload: ApproveRejectPayload): Promise<any> {
    return this.put(`leases/approve_or_reject/${leaseId}`, payload);
  }
}

export const clauseBaseService = new ClauseBaseService();
