// components/models/documentPreviewModel.tsx
'use client';

import React, { useCallback, useRef } from 'react';
import { FileText, Download, X } from 'lucide-react';

// Extend the base Clause with optional fields your UI uses
type PreviewClause = {
  id?: string | number;
  name?: string;
  text?: string;
  status?: string;
  risk?: 'Low' | 'Medium' | 'High';
};

interface DocumentPreviewModalProps {
  onClose: () => void;
  approved?: PreviewClause[];
  pending?: PreviewClause[];
  rejected?: PreviewClause[];
  /** Optional direct file to download; if omitted we generate a PDF of the preview */
  downloadUrl?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  onClose,
  approved = [],
  pending = [],
  rejected = [],
  downloadUrl,
}) => {
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    // If API already gives you a PDF, prefer that
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.click();
      return;
    }

    // Otherwise: capture the preview area and build a PDF on the fly
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const node = captureRef.current;
    if (!node) return;

    // Make sure the background is white and scale is decent for readability
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Add extra pages if content is taller than a single page
    let heightLeft = imgHeight - pageHeight;
    let position = -pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
    }

    pdf.save('lease-preview.pdf');
  }, [downloadUrl]);

  const sections: Array<{
    title: string;
    color: string;   // border color
    badgeCls: string;
    items: PreviewClause[];
    badgeText: string;
  }> = [
    {
      title: 'Approved',
      color: 'border-green-500',
      badgeCls: 'bg-green-100 text-green-700',
      items: approved,
      badgeText: 'Approved',
    },
    {
      title: 'Pending',
      color: 'border-orange-500',
      badgeCls: 'bg-orange-100 text-orange-700',
      items: pending,
      badgeText: 'Pending',
    },
    {
      title: 'Rejected',
      color: 'border-red-500',
      badgeCls: 'bg-red-100 text-red-700',
      items: rejected,
      badgeText: 'Rejected',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Document Preview</h2>
              <p className="text-sm text-gray-600">Preview your updated lease document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body (capture this for PDF) */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div ref={captureRef} className="max-w-2xl mx-auto">
            {/* Legend with dynamic counts */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Approved ({approved.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-sm text-gray-600">Pending ({pending.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Rejected ({rejected.length})</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">COMMERCIAL LEASE AGREEMENT</h1>
              <p className="text-xs text-gray-500 mt-1">
                This document shows the updated lease with your latest clause decisions
              </p>
            </div>

            {/* Dynamically render sections */}
            <div className="space-y-6">
              {sections.map(({ title, color, badgeCls, items, badgeText }) =>
                items.length ? (
                  <div key={title} className={`border-l-4 ${color} pl-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${badgeCls}`}>{badgeText}</span>
                    </div>

                    <div className="space-y-4">
                      {items.map((c, idx) => {
                        const key = (c.id ?? idx).toString();
                        const displayTitle = c.name ?? `Clause #${idx + 1}`;
                        const hasText = typeof c.text === 'string' && c.text.length > 0;
                        const hasStatus = typeof c.status === 'string' && c.status.length > 0;

                        return (
                          <div key={key} className="bg-gray-50 rounded p-3 border border-gray-200">
                            <div className="font-medium text-gray-900">{displayTitle}</div>
                            {hasText && <p className="text-sm text-gray-700 mt-1">{c.text}</p>}
                            {hasStatus && (
                              <p className="text-xs text-gray-500 italic mt-1">Status: {c.status}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Document generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
