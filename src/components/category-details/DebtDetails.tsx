import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface DebtTokens {
  one: number;
  five: number;
}

interface DebtDetailsProps {
  debtTokens: DebtTokens;
  onDebtTokensChange: (tokens: DebtTokens) => void;
  onScoreChange: (score: number) => void;
}

export const DebtDetails: React.FC<DebtDetailsProps> = ({
  debtTokens,
  onDebtTokensChange,
  onScoreChange
}) => {
  const calculateDebtScore = (tokens: DebtTokens) => {
    const score = (tokens.one * -1) + (tokens.five * -5);
    onScoreChange(score);
    return score;
  };

  const updateDebtToken = (type: keyof DebtTokens, delta: number) => {
    const newTokens = { ...debtTokens, [type]: Math.max(0, debtTokens[type] + delta) };
    onDebtTokensChange(newTokens);
    calculateDebtScore(newTokens);
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="space-y-2 flex flex-col items-center">
        {[
          { type: 'one' as keyof DebtTokens, value: -1, bgColor: 'bg-gray-700', textColor: 'text-white' },
          { type: 'five' as keyof DebtTokens, value: -5, bgColor: 'bg-gray-700', textColor: 'text-white' },
        ].map(({ type, value, bgColor, textColor }) => (
          <div key={type} className="flex items-center gap-3">
            <div className={`${bgColor} ${textColor} border-2 border-red-500 w-12 h-8 flex items-center justify-center rounded font-bold text-sm`}>
              {value}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateDebtToken(type, -1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={debtTokens[type] || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const newTokens = { ...debtTokens, [type]: Math.max(0, value) };
                  onDebtTokensChange(newTokens);
                  calculateDebtScore(newTokens);
                }}
                className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateDebtToken(type, 1)}
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