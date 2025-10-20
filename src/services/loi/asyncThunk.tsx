/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loiBaseService } from "./enpoints";
import type { LOIApiPayload } from "@/types/loi";
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import { UpdateClauseArgs } from "../lease/asyncThunk";

type SubmitByFilePayload = { file: File; leaseId?: string };
type SubmitByFileReturn = { id: string };


const setBearer = () => {
  const token: string = `${ls.get("access_token", { decrypt: true })}`;
  if (token) HttpService.setToken(token);
};


export const submitLOIAsync = createAsyncThunk(
  "/loi/submit",
  async (data: LOIApiPayload, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const res = await loiBaseService.submitLOI(data);

      if (res?.success === false && res?.status === 400) {
        return rejectWithValue(res?.message ?? "Bad Request");
      }

      return res;
    } catch (error: any) {
      if (error.response?.data?.message) return rejectWithValue(error.response.data.message);
      if (error.response?.message) return rejectWithValue(error.response.message);
      if (error.message) return rejectWithValue(error.message);
      return rejectWithValue("An unexpected error occurred while submitting LOI");
    }
  }
);

export const getDraftLOIsAsync = createAsyncThunk(
  "loi/fetchDrafts",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await loiBaseService.draftLOI(); // API call

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch drafts");
    }
  }
);

export const getAllLandlordLOIsAsync = createAsyncThunk(
  "loi/landlordallLois",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await loiBaseService.landlordLOI();

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch drafts");
    }
  }
);

export const runAiAssistantAsync = createAsyncThunk(
  "loi/aiAssistant",
  async (data: any, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await loiBaseService.aiAssistant(data);

      if (response.success === false && response.status === 400) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) return rejectWithValue(error.response.data.message);
      if (error.response?.message) return rejectWithValue(error.response.message);
      if (error.message) return rejectWithValue(error.message);
      return rejectWithValue("AI Assistant request failed");
    }
  }
);

export const getLOIDetailsById = createAsyncThunk(
  "loi/fetchSingleDraft",
  async (loiId: string, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await loiBaseService.singledraftLOI(loiId);

      if (response.success || response.status === 200) {
        Toast.fire({ icon: "success", title: response.message as string });
      }

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response);
    }
  }
);

export const submitLOIByFileAsync = createAsyncThunk<
  SubmitByFileReturn,
  SubmitByFilePayload,
  { rejectValue: string }
>("loi/submitByFile", async ({ file, leaseId }, { rejectWithValue }) => {
  try {
    const token: string = `${ls.get("access_token", { decrypt: true })}`;
    HttpService.setToken(token);

    const form = new FormData();
    form.append("file", file);
    if (leaseId) form.append("doc_id", leaseId);

    const response = await loiBaseService.submitLOIByFile(form);

    if (response.success === false && response.status === 400) {
      return rejectWithValue(response.message);
    }

    const raw = response.data;
    let id: string | undefined;
    if (typeof raw === "string") id = raw;
    else if (raw?.id) id = raw.id;
    else if (raw?.data?.id) id = raw.data.id;
    else if (typeof raw?.data === "string") id = raw.data;

    if (!id) throw new Error("Missing id in submit LOI response");
    return { id };
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string }; message?: string }; message?: string };
    if (e.response?.data?.message) return rejectWithValue(e.response.data.message);
    if (e.response?.message) return rejectWithValue(e.response.message);
    if (e.message) return rejectWithValue(e.message);
    return rejectWithValue("An unexpected error occurred while submitting LOI by file");
  }
});

export const submitLOIByFileAsyncNoId = createAsyncThunk<
  SubmitByFileReturn,
  SubmitByFilePayload,
  { rejectValue: string }
>("loi/submitByFileNoId", async ({ file }, { rejectWithValue }) => {
  try {
    const token: string = `${ls.get("access_token", { decrypt: true })}`;
    HttpService.setToken(token);

    const form = new FormData();
    form.append("file", file);

    const response = await loiBaseService.submitLOIByFilenoId(form);

    if (response.success === false && response.status === 400) {
      return rejectWithValue(response.message);
    }

    const raw = response.data;
    let id: string | undefined;
    if (typeof raw === "string") id = raw;
    else if (raw?.id) id = raw.id;
    else if (raw?.data?.id) id = raw.data.id;
    else if (typeof raw?.data === "string") id = raw.data;

    if (!id) throw new Error("Missing id in submit LOI response");
    return { id };
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string }; message?: string }; message?: string };
    if (e.response?.data?.message) return rejectWithValue(e.response.data.message);
    if (e.response?.message) return rejectWithValue(e.response.message);
    if (e.message) return rejectWithValue(e.message);
    return rejectWithValue("An unexpected error occurred while submitting LOI by file");
  }
});


export const deleteLOIAsync = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("loi/delete", async (loiId, { rejectWithValue }) => {
  try {
    const token: string = `${ls.get("access_token", { decrypt: true })}`;
    HttpService.setToken(token);
    const response = await loiBaseService.deleteLOI(loiId);

    if (response?.success === false) {
      return rejectWithValue(response?.message || "Failed to delete LOI");
    }
    return { id: loiId };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.message ||
      err?.message ||
      "Delete failed";
    return rejectWithValue(msg);
  }
});

/* ------------------------- landlord side ------------------------- */
export const llReadClauseAsync = createAsyncThunk(
  "landlord/readClause",
  async (data: { loiId: string; clause_key: string }, { rejectWithValue }) => {
    try {
      setBearer();
      const res = await loiBaseService.readClause(data.loiId, data.clause_key);
      if (res?.success === false) return rejectWithValue(res?.message || "Failed");
      return { clause_key: data.clause_key, data: res.data };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || "Failed to read clause");
    }
  }
);

export const llApproveAllAsync = createAsyncThunk(
  "landlord/approveAll",
  async (loiId: string, { rejectWithValue }) => {
    try {
      setBearer();
      const res = await loiBaseService.approveAll(loiId);
      if (res?.success === false) return rejectWithValue(res?.message || "Failed");
      Toast.fire({ icon: "success", title: res?.message || "All clauses approved" });
      return { loiId };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || "Approve all failed");
    }
  }
);

export const llRejectAllAsync = createAsyncThunk(
  "landlord/rejectAll",
  async (loiId: string, { rejectWithValue }) => {
    try {
      setBearer();
      const res = await loiBaseService.rejectAll(loiId);
      if (res?.success === false) return rejectWithValue(res?.message || "Failed");
      Toast.fire({ icon: "success", title: res?.message || "All clauses rejected" });
      return { loiId };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || "Reject all failed");
    }
  }
);

export const llCommentClauseAsync = createAsyncThunk(
  "landlord/commentClause",
  async (data: { loiId: string; clause_key: string; text: string }, { rejectWithValue }) => {
    try {
      setBearer();
      const res = await loiBaseService.commentOnClause(data.loiId, {
        clause_key: data.clause_key,
        clause_key_data: { text: data.text },
      });
      if (res?.success === false) return rejectWithValue(res?.message || "Failed");
      Toast.fire({ icon: "success", title: "Comment added" });
      return { clause_key: data.clause_key, text: data.text };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || "Comment failed");
    }
  }
);


export const llDecideClauseAsync = createAsyncThunk(
  "landlord/decideClause",
  async (
    payload: { loiId: string; clause_key: string; action: "approved" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      setBearer();
      const res = await loiBaseService.decideSingleClause(payload.loiId, payload);
      if (res?.success === false) return rejectWithValue(res?.message || "Failed");
      const msg = payload.action === "approved" ? "Clause approved" : "Clause rejected";
      Toast.fire({ icon: "success", title: msg });
      return payload;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || "Action failed");
    }
  }
);

export const approveLoillApi = createAsyncThunk(
  "loi/approvelandlord",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await loiBaseService.approveLOIclause(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "approved",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }
      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);

export const rejectLoillApi = createAsyncThunk(
  "loi/rejectlandlord",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await loiBaseService.rejectLOIclause(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "rejected",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }
      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);