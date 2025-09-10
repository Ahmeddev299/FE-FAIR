// components/leases/ClausePanel.tsx
'use client';
import React, { useMemo, useState } from 'react';
import { Save, Edit3, Check, AlertTriangle } from 'lucide-react';
import SlideOver from '@/components/ui/SlideOver';
import Modal from '@/components/ui/Model';
import Card from '@/components/ui/Card';
import Pill, { PillTone } from '@/components/ui/Pill';
import type { UILease, UIClause } from '@/types/loi';
import { useAppDispatch } from '@/hooks/hooks';
import { acceptClauseSuggestionAsync, updateClauseCurrentVersionAsync } from '@/services/lease/asyncThunk';

const RiskPill = ({ risk }: { risk: 'High' | 'Medium' | 'Low' }) => (
  <Pill tone={risk === 'High' ? 'red' : risk === 'Medium' ? 'yellow' : 'green'}>{risk}</Pill>
);

const StatusPill = ({ status }: { status: string }) => {
  const tone: PillTone =
    status === 'Approved' ? 'green' :
    status === 'Review' ? 'red' :
    status === 'Edited' ? 'yellow' :
    'blue';
  return <Pill tone={tone}>{status}</Pill>;
};

export default function ClausePanel({
  open,
  lease,
  onClose,
  onExportLeaseCsv,
  onDownloadLeaseTxt,
}: {
  open: boolean;
  lease: UILease | null;
  onClose: () => void;
  onExportLeaseCsv: (lease: UILease) => void;
  onDownloadLeaseTxt: (lease: UILease) => void;
}) {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<UIClause | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState('');

  const clauses = useMemo(() => lease?.clauses ?? [], [lease]);
  React.useEffect(() => {
    if (clauses.length && !selected) setSelected(clauses[0]);
  }, [clauses, selected]);

  const startEdit = () => {
    if (!selected) return;
    setEditText(selected.currentVersion);
    setEditOpen(true);
  };

//   const saveEdit = async () => {
//     if (!lease || !selected) return;
//     const clauseId = lease.clauseDocId || ''; // backend log id
//     const clause_key = selected.name;
//     const details = editText;

//     try {
//       await dispatch(updateClauseCurrentVersionAsync({ clauseId, clause_key, details })).unwrap();
//       // optimistic UI update locally
//       selected.currentVersion = details;
//       (selected as any).status = 'Edited';
//       setEditOpen(false);
//     } catch {
//       // keep modal open; optionally show toast in your app
//     }
//   };

const saveEdit = async () => {
  if (!lease || !selected) return;
  const clauseId = lease.clauseDocId || '';
  const clause_key = selected.name;
  const details = editText;

  try {
    await dispatch(updateClauseCurrentVersionAsync({ clauseId, clause_key, details })).unwrap();
    // Update local selection immutably (no 'any')
    setSelected(prev =>
      prev ? { ...prev, currentVersion: details, status: 'Edited' } : prev
    );
    setEditOpen(false);
  } catch {
    // optionally toast
  }
};

const acceptAI = async () => {
  if (!lease || !selected) return;
  const clauseId = lease.clauseDocId || '';
  const clause_key = selected.name;
  const details = selected.aiSuggestion ?? '';

  try {
    await dispatch(acceptClauseSuggestionAsync({ clauseId, clause_key, details })).unwrap();
    setSelected(prev =>
      prev ? { ...prev, currentVersion: details, status: 'Approved' } : prev
    );
  } catch {
    // optionally toast
  }
};

//   const acceptAI = async () => {
//     if (!lease || !selected) return;
//     const clauseId = lease.clauseDocId || '';
//     const clause_key = selected.name;
//     const details = selected.aiSuggestion ?? '';

//     try {
//       await dispatch(acceptClauseSuggestionAsync({ clauseId, clause_key, details })).unwrap();
//       selected.currentVersion = details;
//       (selected as any).status = 'Approved';
//     } catch {
//       // optionally toast
//     }
//   };

  return (
    <SlideOver
      open={open}
      title={lease?.title}
      subtitle={lease?.property_address}
      onClose={onClose}
    >
      {lease ? (
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* left list */}
          <div className="border-b md:border-b-0 md:border-r overflow-y-auto">
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Clauses</h4>
              <div className="space-y-2">
                {lease.clauses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`w-full text-left rounded-lg p-3 border transition ${
                      selected?.id === c.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-medium text-gray-900">{c.name}</div>
                      <StatusPill status={c.status} />
                    </div>
                    <div className="mt-1"><RiskPill risk={c.risk} /></div>
                  </button>
                ))}
              </div>

              {/* quick actions for whole lease */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onExportLeaseCsv(lease)}
                  className="flex-1 h-9 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                >
                  Export Summary
                </button>
                <button
                  onClick={() => onDownloadLeaseTxt(lease)}
                  className="flex-1 h-9 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                >
                  Download All
                </button>
              </div>
            </div>
          </div>

          {/* right detail */}
          <div className="md:col-span-2 overflow-y-auto">
            {selected ? (
              <div className="p-5 space-y-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-base font-semibold text-gray-900">{selected.name}</h5>
                      <div className="mt-2 flex gap-2">
                        <RiskPill risk={selected.risk} />
                        <StatusPill status={selected.status} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={startEdit}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={acceptAI}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Accept AI
                      </button>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="mb-2 text-sm font-semibold text-gray-900">Original Clause</div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selected.currentVersion}</p>
                  </Card>

                  <Card className="p-4">
                    <div className="mb-2 text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        AI
                      </span>
                      AI Suggested Clause
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selected.aiSuggestion}</p>
                  </Card>
                </div>

                {selected.details ? (
                  <Card className="p-4 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-700">AI Analysis & Recommendations</span>
                    </div>
                    <p className="text-sm text-gray-800">{selected.details}</p>
                  </Card>
                ) : null}
              </div>
            ) : (
              <div className="p-6 text-sm text-gray-500">Select a clause to view details.</div>
            )}
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      <Modal
        open={editOpen}
        title={`Edit: ${selected?.name ?? ''}`}
        onClose={() => setEditOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditOpen(false)}
              className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        }
      >
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={12}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </Modal>
    </SlideOver>
  );
}
