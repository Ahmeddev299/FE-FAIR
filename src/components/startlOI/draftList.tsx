import Image from "next/image";
import { Eye, Edit } from "lucide-react";
import { Letter } from "@/types/loi";
import { formatDate } from "@/utils/dateFormatter";

export function DraftList({ items, onView, onEdit }: { items: Letter[]; onView: (id: string)=>void; onEdit: (id: string)=>void; }) {
  if (!items?.length) return <div className="px-6 py-8 text-center text-sm text-gray-500">No draft LOIs yet.</div>;

  return (
    <div className="divide-y divide-gray-200">
      {items.map(letter => (
        <div key={letter.id} className="px-6 py-4 hover:bg-gray-50 grid grid-cols-12 items-center">
          <div className="col-span-3 flex items-center min-w-0">
            <Image src="/loititle.png" alt="LOI" width={36} height={36} className="mr-3" />
            <div className="text-sm font-medium text-gray-900 truncate">{letter.title}</div>
          </div>
          <div className="col-span-3 min-w-0 text-sm text-gray-600 truncate">{letter.propertyAddress}</div>
          <div className="col-span-2 text-sm text-gray-600">{letter?.updated_at ? formatDate(letter.updated_at) : "—"}</div>
          <div className="col-span-2"><span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">{letter?.submit_status}</span></div>
          <div className="col-span-2 flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onView(letter.id)}><Eye className="w-4 h-4 text-gray-500" /></button>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onEdit(letter.id)}><Edit className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
