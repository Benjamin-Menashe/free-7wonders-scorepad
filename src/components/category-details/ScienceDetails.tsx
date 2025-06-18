
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface ScienceSymbols {
  gear: number;
  tablet: number;
  compass: number;
}

interface ScienceDetailsProps {
  scienceSymbols: ScienceSymbols;
  onScienceSymbolsChange: (symbols: ScienceSymbols) => void;
  onScoreChange: (score: number) => void;
}

export const ScienceDetails: React.FC<ScienceDetailsProps> = ({
  scienceSymbols,
  onScienceSymbolsChange,
  onScoreChange
}) => {
  const calculateScienceScore = (symbols: ScienceSymbols) => {
    const gearScore = symbols.gear * symbols.gear;
    const tabletScore = symbols.tablet * symbols.tablet;
    const compassScore = symbols.compass * symbols.compass;
    const minSymbols = Math.min(symbols.gear, symbols.tablet, symbols.compass);
    const setScore = minSymbols * 7;
    const totalScore = gearScore + tabletScore + compassScore + setScore;
    onScoreChange(totalScore);
    return totalScore;
  };

  const updateScienceSymbol = (type: keyof ScienceSymbols, delta: number) => {
    const newSymbols = { ...scienceSymbols, [type]: Math.max(0, scienceSymbols[type] + delta) };
    onScienceSymbolsChange(newSymbols);
    calculateScienceScore(newSymbols);
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="space-y-2 flex flex-col items-center">
        {[
          { type: 'gear' as keyof ScienceSymbols, name: 'Gear', image: '/lovable-uploads/57cf6465-fad3-46e7-aab6-0078037e7d97.png' },
          { type: 'tablet' as keyof ScienceSymbols, name: 'Tablet', image: '/lovable-uploads/e4de2ac1-7db7-4bb7-97ab-585914f3a40c.png' },
          { type: 'compass' as keyof ScienceSymbols, name: 'Compass', image: '/lovable-uploads/25de66f2-6275-40db-b4ef-244ea6bc058b.png' },
        ].map(({ type, name, image }) => (
          <div key={type} className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center rounded border-2 border-green-500" style={{ backgroundColor: '#ede9e6' }}>
              <img src={image} alt={name} className="w-6 h-6 object-contain" />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateScienceSymbol(type, -1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={scienceSymbols[type] || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const newSymbols = { ...scienceSymbols, [type]: Math.max(0, value) };
                  onScienceSymbolsChange(newSymbols);
                  calculateScienceScore(newSymbols);
                }}
                className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateScienceSymbol(type, 1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
