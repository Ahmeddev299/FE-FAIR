/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { addBulletCommentAsync, changeBulletTextAsync, approveRejectBulletAsync } from "@/services/clause/asyncThunk";
import Toast from "@/components/Toast";

// Helper: update a nested bullet inside your state by (section, bullet_number).
// Adjust this to your exact state shape. Here we assume `state.clauseList` is an array
// of { section: string, bullets: [{ bullet_number, text, comments, status }] }
const patchBullet = (
  state: any,
  key: { section: string; bullet_number: string | number },
  updater: (b: any) => void
) => {
  const secIdx = state.clauseList.findIndex((s: any) => s.section?.toLowerCase() === key.section.toLowerCase());
  if (secIdx < 0) return;
  const section = state.clauseList[secIdx];
  const bIdx = section.bullets?.findIndex?.((b: any) => `${b.bullet_number}` === `${key.bullet_number}`);
  if (bIdx < 0) return;
  updater(section.bullets[bIdx]);
};

export const clauseSlice = createSlice({
  name: "clause",
  initialState: {
    isLoading: false,
    clauseError: "",
    clauseList: [] as any[],   // [{ section, bullets: [{ bullet_number, text, comments, status }] }]
  },
  reducers: {
    setClauseLoading: (state, action) => { state.isLoading = action.payload; },
    setClauseError: (state, action) => { state.clauseError = action.payload; },
    resetClauseState: (state) => { state.isLoading = false; state.clauseError = ""; },
    // (Optionally add a setter to hydrate clauseList from API if needed)
  },
  extraReducers: (builder) => {
    builder
      // comment
      .addCase(addBulletCommentAsync.fulfilled, (state, { payload }) => {
        patchBullet(state, payload, (b) => {
          b.comments = Array.isArray(b.comments) ? b.comments : [];
          b.comments.push({ text: payload.text, author: "You", created_at: new Date().toISOString() });
          b.commentsUnresolved = (b.commentsUnresolved ?? 0) + 1;
        });
        Toast.fire({ icon: "success", title: "Comment added" });
      })
      .addCase(addBulletCommentAsync.rejected, (state, { payload }) => {
        state.clauseError = payload as string;
        Toast.fire({ icon: "error", title: payload as string });
      })

      // change text
      .addCase(changeBulletTextAsync.fulfilled, (state, { payload }) => {
        patchBullet(state, payload, (b) => { b.text = payload.text; });
        Toast.fire({ icon: "success", title: "Clause text updated" });
      })
      .addCase(changeBulletTextAsync.rejected, (state, { payload }) => {
        state.clauseError = payload as string;
        Toast.fire({ icon: "error", title: payload as string });
      })

      // approve / reject
      .addCase(approveRejectBulletAsync.fulfilled, (state, { payload }) => {
        patchBullet(state, payload, (b) => { b.status = payload.action; });
        Toast.fire({ icon: "success", title: payload.action === "approved" ? "Approved" : "Rejected" });
      })
      .addCase(approveRejectBulletAsync.rejected, (state, { payload }) => {
        state.clauseError = payload as string;
        Toast.fire({ icon: "error", title: payload as string });
      });
  },
});

export const { setClauseLoading, setClauseError, resetClauseState } = clauseSlice.actions;
export const selectClause = (state: any) => state.clause;
export default clauseSlice.reducer;
