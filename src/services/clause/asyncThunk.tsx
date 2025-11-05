/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clauseBaseService, AddBulletCommentPayload, ChangeBulletTextPayload, ApproveRejectPayload } from "./endpoints";
import { HttpService } from "../index";
import ls from "localstorage-slim";

// Small helper
const setToken = () => {
  const token = `${ls.get("access_token", { decrypt: true })}`;
  HttpService.setToken(token);
};

// Add comment to a bullet
export const addBulletCommentAsync = createAsyncThunk<
  AddBulletCommentPayload,
  { leaseId: string } & AddBulletCommentPayload,
  { rejectValue: string }
>("clause/bullet/comment", async ({ leaseId, ...payload }, { rejectWithValue }) => {
  try {
    setToken();
    const res = await clauseBaseService.addBulletComment(leaseId, payload);
    if (res?.status === 200 || res?.success) return payload;
    return rejectWithValue(res?.message || "Failed to add comment");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Failed to add comment");
  }
});

// Change bullet text
export const changeBulletTextAsync = createAsyncThunk<
  ChangeBulletTextPayload,
  { leaseId: string } & ChangeBulletTextPayload,
  { rejectValue: string }
>("clause/bullet/change", async ({ leaseId, ...payload }, { rejectWithValue }) => {
  try {
    setToken();
    const res = await clauseBaseService.changeBulletText(leaseId, payload);
    if (res?.status === 200 || res?.success) return payload;
    return rejectWithValue(res?.message || "Failed to change clause text");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Failed to change clause text");
  }
});

// Approve / Reject bullet
export const approveRejectBulletAsync = createAsyncThunk<
  ApproveRejectPayload,
  { leaseId: string } & ApproveRejectPayload,
  { rejectValue: string }
>("clause/bullet/approveReject", async ({ leaseId, ...payload }, { rejectWithValue }) => {
  try {
    setToken();
    const res = await clauseBaseService.approveOrRejectBullet(leaseId, payload);
    if (res?.status === 200 || res?.success) return payload;
    return rejectWithValue(res?.message || "Failed to update status");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Failed to update status");
  }
});
