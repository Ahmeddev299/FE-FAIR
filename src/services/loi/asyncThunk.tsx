/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loiBaseService } from "./enpoints";
import type { LOIApiPayload } from "@/types/loi";
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";

type SubmitByFilePayload = { file: File; leaseId?: string };
type SubmitByFileReturn = { id: string };

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
  SubmitByFileReturn,          // <-- normalized return type
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

    // Possible server shapes → normalize here
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