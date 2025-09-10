// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { HttpService } from "../index";

// // class LeaseBaseService extends HttpService {
// //   private readonly prefix: string = "dashboard";

// //   /**
// //    * Lease
// //    * @paramdata
// //    */
// //   auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);
// //   submitLease = (data: any, option = {}): Promise<any> =>
// //     this.post(this.prefix + `/upload_lease_tenant`, data, option);
// //   userleasedetails = (): Promise<any> =>
// //     this.get(`termination/lease_of_user_for_termination`, {})
// //   terminatelease = (data: any, options = {}): Promise<any> =>
// //     this.post(`/termination`, data, options);
// //   // leaseBaseService.ts
// //   getClauseDetails(leaseId: string, clauseDocId: string): Promise<any> {
// //     return this.get(
// //       `clause/read_single_clause/${encodeURIComponent(leaseId)}/${encodeURIComponent(clauseDocId)}`
// //     );
// //   }
// //   getSingleLeaseDetail(leaseId: string): Promise<any> {
// //     console.log("lease", leaseId)
// //     return this.get(
// //       `clause/get_lease/${leaseId}`
// //     );
// //   }
// //   // GET /clause/get_user_leases?pagae=1&limit=5
// //   getUserLeases(params?: { page?: number; limit?: number }): Promise<any> {
// //     const page = params?.page ?? 1;
// //     const limit = params?.limit ?? 5;
// //     return this.get(`clause/get_user_leases?page=${page}&limit=${limit}`);
// //   }



// //   // `/get_single_loi/${id}`

// // }

// // export const leaseBaseService = new LeaseBaseService();



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { HttpService } from "../index";

// type ClauseAction = "manual_edit" | "accept_ai_suggestion";

// export interface UpdateClausePayload {
//   clause_id: string;
//   clause_title: string;
//   current_version?: string;
//   ai_suggested_clause_details?: string;
//   action: ClauseAction;
// }

// class LeaseBaseService extends HttpService {
//   private readonly prefix: string = "dashboard";

//   /**
//    * Lease
//    * @param data
//    */
//   auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);

//   submitLease = (data: any, option = {}): Promise<any> =>
//     this.post(this.prefix + `/upload_lease_tenant`, data, option);

//   userleasedetails = (): Promise<any> =>
//     this.get(`termination/lease_of_user_for_termination`, {});

//   terminatelease = (data: any, options = {}): Promise<any> =>
//     this.post(`/termination`, data, options);

//   // Read a single clause doc
//   getClauseDetails(leaseId: string, clauseDocId: string): Promise<any> {
//     return this.get(
//       `clause/read_single_clause/${encodeURIComponent(leaseId)}/${encodeURIComponent(clauseDocId)}`
//     );
//   }

//   // Get a single lease by id
//   getSingleLeaseDetail(leaseId: string): Promise<any> {
//     return this.get(`clause/get_lease/${encodeURIComponent(leaseId)}`);
//   }

//   // GET /clause/get_user_leases?page=1&limit=5
//   getUserLeases(params?: { page?: number; limit?: number }): Promise<any> {
//     const page = params?.page ?? 1;
//     const limit = params?.limit ?? 5;
//     return this.get(`clause/get_user_leases?page=${page}&limit=${limit}`);
//   }

//   /**
//    * Update a clause's current_version / details for a single lease (handles both manual edit and accept-ai flows)
//    * PUT /clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/:clauseId
//    */
//   updateClauseDetailOrCurrentVersion(
//     clauseId: string,
//     body: UpdateClausePayload
//   ): Promise<any> {
//     return this.put(
//       `clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/${encodeURIComponent(
//         clauseId
//       )}`,
//       body
//     );
//   }


//   /**
//    * OPTIONAL convenience helpers
//    */
//   acceptClauseSuggestion(clauseId: string, clause_key: string, details: string , aiText:str): Promise<any> {
//     console.log("clauseId", clauseId)
//     return this.updateClauseDetailOrCurrentVersion(clauseId, {
//       clause_id: clauseId,
//       clause_title: clause_key,
//       current_version: details,
//       ai_suggested_clause_details: aiText,
//       action: "accept_ai_suggestion",
//     });
//   }

//   saveClauseManualEdit(clauseId: string, clauseTitle: string, newText: string): Promise<any> {
//     return this.updateClauseDetailOrCurrentVersion(clauseId, {
//       clause_id: clauseId,
//       clause_title: clauseTitle,
//       current_version: newText,
//       action: "manual_edit",
//     });
//   }
// }

// export const leaseBaseService = new LeaseBaseService();

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from "../index";

type ClauseAction = "manual_edit" | "accept_ai_suggestion";

/** Match backend exactly */
export interface UpdateClausePayload {
  clause_id: string;   // ← backend expects this
  clause_key: string;  // ← backend expects this
  details: string;     // ← backend expects this (current text to persist)
  action: ClauseAction;
}

class LeaseBaseService extends HttpService {
  private readonly prefix: string = "dashboard";

  auth = (data: any): Promise<any> => this.get(this.prefix + ``, data);

  submitLease = (data: any, option = {}): Promise<any> =>
    this.post(this.prefix + `/upload_lease_tenant`, data, option);

  userleasedetails = (): Promise<any> =>
    this.get(`termination/lease_of_user_for_termination`, {});

  terminatelease = (data: any, options = {}): Promise<any> =>
    this.post(`/termination`, data, options);

  getClauseDetails(leaseId: string, clauseDocId: string): Promise<any> {
    return this.get(
      `clause/read_single_clause/${encodeURIComponent(leaseId)}/${encodeURIComponent(clauseDocId)}`
    );
  }

  getSingleLeaseDetail(leaseId: string): Promise<any> {
    return this.get(`clause/get_lease/${encodeURIComponent(leaseId)}`);
  }

  getUserLeases(params?: { page?: number; limit?: number }): Promise<any> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 5;
    return this.get(`clause/get_user_leases?page=${page}&limit=${limit}`);
  }

  /**
   * PUT /clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/:clauseId
   * Body MUST be { clause_id, clause_key, details, action }
   */
  updateClauseDetailOrCurrentVersion(
    clauseId: string,
    body: UpdateClausePayload
  ): Promise<any> {
    return this.put(
      `clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/${encodeURIComponent(clauseId)}`,
      body
    );
  }

  /** Convenience helpers (optional) using the CORRECT payload keys */
  acceptClauseSuggestion(
    clauseId: string,
    clause_key: string,
    details: string
  ): Promise<any> {
    return this.updateClauseDetailOrCurrentVersion(clauseId, {
      clause_id: clauseId,
      clause_key,
      details,
      action: "accept_ai_suggestion",
    });
  }

  saveClauseManualEdit(
    clauseId: string,
    clause_key: string,
    details: string
  ): Promise<any> {
    return this.updateClauseDetailOrCurrentVersion(clauseId, {
      clause_id: clauseId,
      clause_key,
      details,
      action: "manual_edit",
    });
  }
}

export const leaseBaseService = new LeaseBaseService();
export type { ClauseAction };

