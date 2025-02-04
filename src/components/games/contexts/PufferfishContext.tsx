import { createContext, useContext, ReactNode } from 'react';

interface PufferfishContextType {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const PufferfishContext = createContext<PufferfishContextType | null>(null);

export function PufferfishProvider({ children, breathPhase }: { children: ReactNode; breathPhase: PufferfishContextType['breathPhase'] }) {
  return (
    <PufferfishContext.Provider value={{ breathPhase }}>
      {children}
    </PufferfishContext.Provider>
  );
}

export function usePufferfish() {
  const context = useContext(PufferfishContext);
  if (!context) {
    throw new Error('usePufferfish must be used within a PufferfishProvider');
  }
  return context;
}