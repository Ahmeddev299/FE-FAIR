'use client';

import React from 'react';
import { X, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';

export type PreviewStatus = 'Approved' | 'Pending' | 'Rejected';
export type PreviewRisk = 'Low' | 'Medium' | 'High' | undefined;

export type ClausePreviewItem = {
  name: string;
  text: string;
  status: PreviewStatus;
  risk?: PreviewRisk;
  comments?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  leaseTitle: string;
  address?: string;
  clauses: ClausePreviewItem[];
  generatedAt?: string;
  downloadUrl?: string;

};

export default function DocumentPreviewModal({
  open,
  onClose,
  leaseTitle,
  address,
  clauses,
  generatedAt,
  downloadUrl,
}: Props) {
  if (!open) return null;

  // ✅ no hooks here
  let approved = 0, pending = 0, rejected = 0;
  for (const c of clauses) {
    if (c.status === 'Approved') approved++;
    else if (c.status === 'Rejected') rejected++;
    else pending++;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
        <div
          className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center gap-1 mr-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-700">{approved}</span> Approved
              </span>
              <span className="inline-flex items-center gap-1 mr-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-gray-700">{pending}</span> Pending
              </span>
              <span className="inline-flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-gray-700">{rejected}</span> Rejected
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title / address */}
          <div className="px-4 sm:px-6 py-5 bg-white">
            <h2 className="text-center text-lg font-semibold tracking-wide">
              {leaseTitle || 'COMMERCIAL LEASE AGREEMENT'}
            </h2>
            {address && <p className="text-center text-xs text-gray-600 mt-1">{address}</p>}
            <p className="text-center text-xs text-gray-500 mt-1">
              This document shows the updated lease with your proposed changes
            </p>
          </div>

          {/* Clauses */}
          <div className="px-2 sm:px-4 pb-4">
            <ul className="space-y-3">
              {clauses.map((c, idx) => (
                <li key={c.name} className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            'inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ' +
                            (c.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : c.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-50 text-amber-700')
                          }
                        >
                          {c.status}
                        </span>
                        {c.risk && (
                          <span
                            className={
                              'inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ' +
                              (c.risk === 'High'
                                ? 'bg-red-100 text-red-700'
                                : c.risk === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800')
                            }
                          >
                            {c.risk} Risk
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                      {c.text || '—'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Document generated on{' '}
              {generatedAt
                ? new Date(generatedAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}