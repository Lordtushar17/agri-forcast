import React from "react";
import EntryCard from "./EntryCard";

export default function LogsModal({
  open,
  logs,
  logsLoading,
  logsError,
  fetchLogs,
  closeModal,
  formatValue,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Telemetry Logs</h3>
              <p className="text-sm text-gray-500">Previous telemetry entries from the API</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 mr-2">{logs.length} entries</div>
              <button
                onClick={fetchLogs}
                className="px-3 py-1 rounded-md text-sm bg-white border border-gray-200"
              >
                Refresh
              </button>
              <button
                onClick={closeModal}
                className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 border border-red-100"
              >
                Close
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-auto p-5 space-y-4 bg-gray-50">
            {logsLoading && <div className="text-sm text-gray-600">Loading logs…</div>}
            {logsError && <div className="text-sm text-red-600">Error: {logsError}</div>}
            {!logsLoading && logs.length === 0 && !logsError && (
              <div className="text-sm text-gray-600">No logs available.</div>
            )}

            {!logsLoading &&
              logs.length > 0 &&
              logs.map((entry, idx) => (
                <div key={idx}>
                  <EntryCard entry={entry} index={idx} formatValue={formatValue} />
                  {idx < logs.length - 1 && <hr className="my-4 border-gray-200" />}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
