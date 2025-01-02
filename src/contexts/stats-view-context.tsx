import { createContext, useContext, useState, ReactNode } from 'react';

interface StatsViewContextType {
  selectedView: string;
  setSelectedView: (view: string) => void;
  availableViews: string[];
  setAvailableViews: (views: string[]) => void;
}

const StatsViewContext = createContext<StatsViewContextType>({ 
  selectedView: 'summary', 
  setSelectedView: () => {}, 
  availableViews: ['summary'], 
  setAvailableViews: () => {} 
});

export function StatsViewProvider({ children }: { children: ReactNode }) {
  const [selectedView, setSelectedView] = useState<string>('summary');
  const [availableViews, setAvailableViews] = useState<string[]>(['summary']);

  return (
    <StatsViewContext.Provider value={{
      selectedView,
      setSelectedView,
      availableViews,
      setAvailableViews,
    }}>
      {children}
    </StatsViewContext.Provider>
  );
}

export function useStatsView() {
  const context = useContext(StatsViewContext);
  if (context === undefined) {
    throw new Error('useStatsView must be used within a StatsViewProvider');
  }
  return context;
}
