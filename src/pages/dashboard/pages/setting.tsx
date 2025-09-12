"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getLoggedInUserAsync,
  updateLoggedInUserAsync,
} from "@/services/dashboard/asyncThunk";
import type { LoggedInUser } from "@/redux/slices/dashboardSlice";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Toast from "@/components/Toast";

type ProfileFormValues = {
  fullName: string;
  role: string; // API only accepts fullName + role
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Full name is required"),
  role: Yup.string().trim().required("Role is required"),
});

const Setting: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loggedInUser = useAppSelector((s) => s.dashboard.loggedInUser) as LoggedInUser | null;
  const isLoadingUser = useAppSelector((s) => s.dashboard.isLoadingUser);

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getLoggedInUserAsync());
  }, [dispatch]);

  const initialValues: ProfileFormValues = useMemo(
    () => ({
      fullName: loggedInUser?.fullName ?? "",
      role: (loggedInUser?.role ?? "tenant").toLowerCase(),
    }),
    [loggedInUser]
  );

  const handleSave = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await dispatch(
        updateLoggedInUserAsync({
          fullName: values.fullName.trim(),
          role: values.role.toLowerCase(),
        })
      ).unwrap();

      Toast?.fire?.({ icon: "success", title: "Profile updated" });
      setEditMode(false);
      dispatch(getLoggedInUserAsync());
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to update";
      Toast?.fire?.({ icon: "error", title: message });
    } finally {
      setIsSaving(false);
    }
  };

  const has = {
    fullName: Boolean(loggedInUser?.fullName),
    email: Boolean(loggedInUser?.email),
    role: Boolean(loggedInUser?.role),
    verified: Boolean(loggedInUser?.verified_email),
  };

  return (
    <DashboardLayout>
      {/* Back Row */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="mx-auto p-6 bg-white shadow-sm border border-gray-200 rounded">
        <div className="flex items-center gap-3">
          <div className="text-white rounded-lg p-2">
            <Image src="/account.png" alt="account" width={30} height={30} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-600">Manage your profile, billing, and preferences.</p>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto p-6 min-h-screen">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          {/* Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center">
              <Image alt="profile" src="/profile.png" width={40} height={40} className="mr-5" />
              <span className="font-bold text-gray-700">Profile Information</span>
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoadingUser}
              >
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  form="profileForm"
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* VIEW MODE (only show fields that exist in data) */}
          {!editMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {has.fullName && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-bold">Full Name</label>
                  <div className="text-gray-900">{loggedInUser!.fullName}</div>
                </div>
              )}

              {has.email && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-bold">Email Address</label>
                  <div className="text-gray-900 flex items-center">
                    {loggedInUser!.email}
                    {has.verified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              )}

              {has.role && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-bold">Role</label>
                  <div className="text-gray-900 font-semibold capitalize">
                    {String(loggedInUser!.role).toLowerCase()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT MODE (Formik) — only fields supported by API */}
          {editMode && (
            <Formik<ProfileFormValues>
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSave}
            >
              {() => (
                <Form id="profileForm" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1 font-bold">Full Name</label>
                    <Field
                      name="fullName"
                      placeholder="Enter full name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="fullName" component="div" className="mt-1 text-xs text-red-600" />
                  </div>

                  {/* Role */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1 font-bold">Role</label>
                    <Field
                      name="role"
                      as="select"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="tenant">Tenant</option>
                      <option value="landlord">Landlord</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="mt-1 text-xs text-red-600" />
                  </div>

                  {/* Form buttons (mobile-friendly) */}
                  {/* <div className="sm:col-span-2 flex items-center justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                      disabled={isSaving || !dirty || !isValid}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div> */}
                </Form>
              )}
            </Formik>
          )}
        </div>

        {/* Plan & Usage (unchanged visual) */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Plan & Usage</h3>
                <p className="text-sm text-gray-500">Current plan: Pro Plan</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                $29/month
              </span>
              <button className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium">
                Upgrade Plan
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                <span>Documents Used</span>
                <span>8 of 20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                <span>Mailbox Notices</span>
                <span>2 of 5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                <span>Storage Used</span>
                <span>1.2GB of 5GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <span className="font-medium">Next billing date:</span>{" "}
            <span className="text-gray-900 font-semibold">January 15, 2024</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Setting;
