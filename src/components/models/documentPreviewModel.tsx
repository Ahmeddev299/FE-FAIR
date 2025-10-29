// components/models/documentPreviewModel.tsx
'use client';

import React, { useCallback, useRef } from 'react';
import { FileText, Download, X } from 'lucide-react';

type PreviewClause = {
  id?: string | number;
  name?: string;
  text?: string;
  status?: 'approved' | 'pending' | 'rejected';
  risk?: 'Low' | 'Medium' | 'High';
};

interface DocumentPreviewModalProps {
  onClose: () => void;
  approved?: PreviewClause[];
  pending?: PreviewClause[];
  rejected?: PreviewClause[];
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
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.click();
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const node = captureRef.current;
    if (!node) return;

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

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

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

  const allClauses: (PreviewClause & { status: 'approved' | 'pending' | 'rejected' })[] = [
    ...approved.map(clause => ({ ...clause, status: 'approved' as const })),
    ...pending.map(clause => ({ ...clause, status: 'pending' as const })),
    ...rejected.map(clause => ({ ...clause, status: 'rejected' as const })),
  ];

  const getStatusBadge = (status: 'approved' | 'pending' | 'rejected') => {
    switch (status) {
      case 'approved':
        return {
          bg: 'border border-green-500',
          text: 'text-green-700',
          label: 'Approved'
        };
      case 'pending':
        return {
          bg: 'border border-orange-500',
          text: 'text-orange-700',
          label: 'Pending'
        };
      case 'rejected':
        return {
          bg: 'border border-red-500',
          text: 'text-red-700',
          label: 'Rejected'
        };
      default:
        return {
          bg: 'border border-gray-500',
          text: 'text-gray-700',
          label: 'Unknown'
        };
    }
  };

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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div ref={captureRef} className="max-w-3xl mx-auto">
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

            {/* Linear clause layout */}
            <div className="space-y-4">
              {allClauses.map((clause, idx) => {
                const key = (clause.id ?? idx).toString();
                const displayTitle = clause.name ?? `Clause #${idx + 1}`;
                const hasText = typeof clause.text === 'string' && clause.text.length > 0;
                const statusBadge = getStatusBadge(clause.status);

                return (
                  <div key={key} className="pb-4 border-b border-gray-200 last:border-b-0">
                    {/* Clause header with title and status badge on same line */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {displayTitle}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ml-4 whitespace-nowrap`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    
                    {hasText && (
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <p>{clause.text}</p>
                      </div>
                    )}
                    
                    {clause.risk && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">
                          Risk Level: <span className="font-medium">{clause.risk}</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Document generated on {new Date().toLocaleDateString()} • 
                  Total clauses: {allClauses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {approved.length + pending.length + rejected.length} total clauses
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};