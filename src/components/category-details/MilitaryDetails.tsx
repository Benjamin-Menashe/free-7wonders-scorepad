
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface MilitaryTokens {
  minusOne: number;
  one: number;
  three: number;
  five: number;
}

interface MilitaryDetailsProps {
  militaryTokens: MilitaryTokens;
  onMilitaryTokensChange: (tokens: MilitaryTokens) => void;
  onScoreChange: (score: number) => void;
}

export const MilitaryDetails: React.FC<MilitaryDetailsProps> = ({
  militaryTokens,
  onMilitaryTokensChange,
  onScoreChange
}) => {
  const calculateMilitaryScore = (tokens: MilitaryTokens) => {
    const score = (tokens.minusOne * -1) + (tokens.one * 1) + (tokens.three * 3) + (tokens.five * 5);
    onScoreChange(score);
    return score;
  };

  const updateMilitaryToken = (type: keyof MilitaryTokens, delta: number) => {
    const newTokens = { ...militaryTokens, [type]: Math.max(0, militaryTokens[type] + delta) };
    onMilitaryTokensChange(newTokens);
    calculateMilitaryScore(newTokens);
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="space-y-2 flex flex-col items-center">
        {[
          { type: 'minusOne' as keyof MilitaryTokens, value: -1, bgColor: 'bg-white', textColor: 'text-black' },
          { type: 'one' as keyof MilitaryTokens, value: 1, bgColor: 'bg-black', textColor: 'text-white' },
          { type: 'three' as keyof MilitaryTokens, value: 3, bgColor: 'bg-black', textColor: 'text-white' },
          { type: 'five' as keyof MilitaryTokens, value: 5, bgColor: 'bg-black', textColor: 'text-white' },
        ].map(({ type, value, bgColor, textColor }) => (
          <div key={type} className="flex items-center gap-3">
            <div className={`${bgColor} ${textColor} border-2 border-red-500 w-12 h-8 flex items-center justify-center rounded font-bold text-sm`}>
              {value > 0 ? `+${value}` : value}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateMilitaryToken(type, -1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={militaryTokens[type] || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const newTokens = { ...militaryTokens, [type]: Math.max(0, value) };
                  onMilitaryTokensChange(newTokens);
                  calculateMilitaryScore(newTokens);
                }}
                className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateMilitaryToken(type, 1)}
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
