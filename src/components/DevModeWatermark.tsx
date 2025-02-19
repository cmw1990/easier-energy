import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, Clock, Edit, ChevronUp, ChevronDown } from 'lucide-react';

interface DevModeInfo {
  lastBuilt: string;
  lastEdit: string;
  branch?: string;
  commitHash?: string;
}

export function DevModeWatermark({ 
  lastBuilt, 
  lastEdit, 
  branch = 'surf1',
  commitHash = 'latest'
}: DevModeInfo) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`fixed bottom-4 left-4 max-w-[300px] bg-black/80 text-white text-xs p-3 rounded-lg shadow-lg z-50 transition-all duration-200 ${
        isExpanded ? 'translate-y-0' : 'translate-y-[80%]'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Development Mode
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 hover:bg-white/10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-200 ${
        isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
      }`}>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="h-3 w-3" />
          <span>Built: {new Date(lastBuilt).toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300">
          <GitBranch className="h-3 w-3" />
          <span>{branch} ({commitHash.substring(0, 7)})</span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-300">
          <Edit className="h-3 w-3 mt-1" />
          <span className="line-clamp-2">{lastEdit}</span>
        </div>
      </div>
    </div>
  );
}
