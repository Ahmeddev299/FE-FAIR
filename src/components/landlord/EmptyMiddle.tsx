export default function EmptyMiddle() {
  return (
    <div className="h-full grid place-items-center text-center text-gray-600">
      <div className="space-y-2">
        <div className="mx-auto h-9 w-9 rounded-full bg-gray-100 grid place-items-center text-gray-500">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm6 1v5h5"/></svg>
        </div>
        <div className="font-semibold text-gray-700">Select an LOI to Review</div>
        <p className="max-w-[260px] text-sm text-gray-500">Choose an LOI from the list to start reviewing clauses and comments.</p>
      </div>
    </div>
  );
}
