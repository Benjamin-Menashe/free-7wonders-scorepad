
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Minus, X, ChevronDown } from 'lucide-react';

interface CultureCard {
  id: string;
  score: number;
}

interface CultureDetailsProps {
  cultureCards: CultureCard[];
  onCultureCardsChange: (cards: CultureCard[]) => void;
  onScoreChange: (score: number) => void;
}

const predefinedCards = [
  { name: 'Altar', value: 3 },
  { name: 'Aqueduct', value: 5 },
  { name: 'Baths', value: 3 },
  { name: 'Courthouse', value: 4 },
  { name: 'Gardens', value: 5 },
  { name: 'Palace', value: 8 },
  { name: 'Pantheon', value: 7 },
  { name: 'Senate', value: 6 },
  { name: 'Statue', value: 4 },
  { name: 'Theater', value: 3 },
  { name: 'Temple', value: 4 },
  { name: 'Town Hall', value: 6 },
  { name: 'Well', value: 3 },
];

export const CultureDetails: React.FC<CultureDetailsProps> = ({
  cultureCards,
  onCultureCardsChange,
  onScoreChange
}) => {
  const calculateCultureScore = (cards: CultureCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const addCultureCard = () => {
    const newCard = { id: `card-${Date.now()}`, score: 0 };
    const newCards = [newCard, ...cultureCards];
    onCultureCardsChange(newCards);
    calculateCultureScore(newCards);
  };

  const addPredefinedCard = (cardName: string, cardValue: number) => {
    const newCard = { id: `card-${Date.now()}-${cardName}`, score: cardValue };
    const newCards = [newCard, ...cultureCards];
    onCultureCardsChange(newCards);
    calculateCultureScore(newCards);
  };

  const removeCultureCard = (cardId: string) => {
    const newCards = cultureCards.filter(card => card.id !== cardId);
    onCultureCardsChange(newCards);
    calculateCultureScore(newCards);
  };

  const updateCultureCard = (cardId: string, score: number) => {
    const newCards = cultureCards.map(card => 
      card.id === cardId ? { ...card, score } : card
    );
    onCultureCardsChange(newCards);
    calculateCultureScore(newCards);
  };

  const adjustCultureCard = (cardId: string, delta: number) => {
    const card = cultureCards.find(c => c.id === cardId);
    if (card) {
      const newScore = Math.max(0, card.score + delta);
      updateCultureCard(cardId, newScore);
    }
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={addCultureCard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add Card
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Add Specific Card
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {predefinedCards.map(card => (
                <DropdownMenuItem 
                  key={card.name}
                  onClick={() => addPredefinedCard(card.name, card.value)}
                  className="flex justify-between"
                >
                  <span>{card.name}</span>
                  <span className="text-sm text-gray-500">{card.value} pts</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {cultureCards.length > 0 && (
          <div className="space-y-2 w-full max-w-xs">
            {cultureCards.map(card => (
              <div key={card.id} className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCultureCard(card.id, -1)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={card.score || ''}
                    onChange={(e) => updateCultureCard(card.id, parseInt(e.target.value) || 0)}
                    placeholder="Points"
                    className="w-20 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCultureCard(card.id, 1)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCultureCard(card.id)}
                  className="p-1 h-6 w-6 hover:bg-red-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
