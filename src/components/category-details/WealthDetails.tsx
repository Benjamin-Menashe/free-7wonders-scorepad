
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface WealthDetailsProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  onScoreChange: (score: number) => void;
}

export const WealthDetails: React.FC<WealthDetailsProps> = ({
  coins,
  onCoinsChange,
  onScoreChange
}) => {
  const calculateWealthScore = (coinCount: number) => {
    const score = Math.floor(coinCount / 3);
    onScoreChange(score);
    return score;
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-medium">Total coins:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCoins = Math.max(0, coins - 1);
              onCoinsChange(newCoins);
              calculateWealthScore(newCoins);
            }}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            value={coins || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onCoinsChange(value);
              calculateWealthScore(value);
            }}
            className="w-24 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCoins = coins + 1;
              onCoinsChange(newCoins);
              calculateWealthScore(newCoins);
            }}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
