import React from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default function ManagementProgress({
  approved = 1, 
  total = 4, 
  unresolved = 2,
}) {
  const pct = total ? Math.round((approved / total) * 100) : 0;
  const pending = Math.max(total - approved - unresolved, 0);
  
  return (
    <Card className="p-4 max-w-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Management Progress</h4>
      
      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-600">Clauses Approved</div>
          <div className="text-xs text-gray-600 font-medium">{approved} of {total}</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-blue-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Approved */}
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-green-700 mb-1">{approved}</div>
          <div className="text-xs text-green-700 font-medium">Approved</div>
        </div>

        {/* Pending */}
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-orange-700 mb-1">{pending}</div>
          <div className="text-xs text-orange-700 font-medium">Pending</div>
        </div>
      </div>

      {/* Unresolved Comments */}
      {unresolved > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center mt-0.5">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                <rect width="8" height="8" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-red-700 mb-1">Unresolved Comments</div>
              <div className="text-xs text-red-600">{unresolved} clauses with open comments</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}