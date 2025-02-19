interface DevModeInfo {
  lastBuilt: string;
  lastEdit: string;
}

export function DevModeWatermark({ lastBuilt, lastEdit }: DevModeInfo) {
  return (
    <div className="fixed bottom-4 left-4 max-w-[300px] bg-black/80 text-white text-xs p-3 rounded-lg shadow-lg z-50">
      <div className="font-semibold mb-1">Development Mode</div>
      <div className="text-gray-300 text-[10px]">
        <div>Built: {lastBuilt}</div>
        <div className="mt-1">Last edit: {lastEdit}</div>
      </div>
    </div>
  );
}
