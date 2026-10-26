import React from 'react';
import { History, X, Trash2, ChevronRight, Leaf } from 'lucide-react';

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  history, 
  onSelectHistoryItem, 
  onClearHistory 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-[#0b170d] border-l border-[#1b3824] w-full max-w-md h-full flex flex-col p-5 shadow-2xl text-gray-200 animate-slide-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c3a25] pb-4 mb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <History className="w-5 h-5" />
            <span>Diagnosis History Log</span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#152e1c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of past diagnoses */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-50" />
              <p>No past plant diagnoses found.</p>
              <p className="text-[11px] text-gray-500 mt-1">Uploaded and analyzed crops will appear here.</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="bg-[#122217] hover:bg-[#182e1f] border border-[#1f3e28] hover:border-emerald-500/50 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#24472f] shrink-0 bg-black/40">
                    <img src={item.image} alt={item.cropName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                      {item.cropName}
                    </h5>
                    <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
                      {item.diseaseName}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {item.timestamp || 'Recent'} • {item.confidence}% Conf.
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Clear History Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-[#1c3a25] mt-4">
            <button
              onClick={onClearHistory}
              className="w-full py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History Log</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
