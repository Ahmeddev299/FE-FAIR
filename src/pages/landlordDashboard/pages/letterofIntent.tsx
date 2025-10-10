"use client";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, MessageSquare } from "lucide-react";
import {  useState } from "react";
import LOIList from "@/components/landlord/loi/list/LOIList";
import { CLAUSES, LOIS } from "@/components/landlord/loi/data";
import EmptyMiddle from "@/components/landlord/EmptyMiddle";
import ClausesGrid from "@/components/landlord/loi/clauses/ClausesGrid";
import ClauseDetail from "@/components/landlord/loi/clauses/ClausesDetails";
import { Clause, LOI } from "@/components/landlord/loi/types";
import { DashboardLayout } from "@/components/layouts";
import GhostIconCircle from "@/components/landlord/loi/ui/GhostIconCircle";


export default function LetterOfIntents() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LOI["status"]>("All");
  const [tenantFilter, setTenantFilter] = useState<"All Tenants" | string>("All Tenants");

  const [selected, setSelected] = useState<LOI | null>(null);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);

  const onSelectLOI = (l: LOI) => {
    setSelected(l);
    setSelectedClause(null);
    setTimeout(() => setSelectedClause(CLAUSES[0]), 50);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="px-6">
          <div className="bg-white">
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-gray-200 text-sm">
              <Link href="/dashboard/pages/mainpage" className="inline-flex items-center gap-1 text-gray-600 hover:underline">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-800">Review LOIs</span>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 min-h-[85vh]">
              {/* LEFT: LOIs */}
              <LOIList
                all={LOIS}
                selectedId={selected?.id ?? null}
                onSelect={onSelectLOI}
                query={query}
                setQuery={setQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                tenantFilter={tenantFilter}
                setTenantFilter={setTenantFilter}
              />

              {/* MIDDLE: Clauses */}
              <section
                className={clsx(
                  "p-5 bg-white",
                  selected ? "md:col-span-8" : "md:col-span-4",
                  !selected && "border-r border-gray-200"
                )}
              >
                {!selected ? (
                  <EmptyMiddle />
                ) : (
                  <div className="space-y-4">
                    <ClausesGrid
                      clauses={CLAUSES}
                      selectedId={selectedClause?.id ?? null}
                      onSelect={(c) => setSelectedClause(c)}
                    />
                    {selectedClause && <ClauseDetail clause={selectedClause} />}
                  </div>
                )}
              </section>

              {!selected && (
                <aside className="md:col-span-4 p-4 md:p-5 border-gray-200">
                  <div className="h-full grid place-items-center text-center">
                    <div className="space-y-2 text-sm text-gray-500">
                      <GhostIconCircle>
                        <MessageSquare className="h-6 w-6" />
                      </GhostIconCircle>
                      <div className="font-medium text-gray-700">No LOI Selected</div>
                      <p className="max-w-[230px]">Select an LOI to view comments and discussions.</p>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
