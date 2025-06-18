
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Minus, X, ChevronDown } from 'lucide-react';

interface CommerceCard {
  id: string;
  name: string;
  score: number;
  description: string;
  step: number;
}

interface CommerceDetailsProps {
  commerceCards: CommerceCard[];
  onCommerceCardsChange: (cards: CommerceCard[]) => void;
  onScoreChange: (score: number) => void;
}

const commerceCardsList = [
  {
    name: 'Arena',
    description: '1 point for each stage you constructed',
    step: 1
  },
  {
    name: 'Chamber of Commerce',
    description: '2 points for each gray card you own',
    step: 2
  },
  {
    name: 'Haven',
    description: '1 point for each brown card you own',
    step: 1
  },
  {
    name: 'Lighthouse',
    description: '1 point for each yellow card you own',
    step: 1
  },
  {
    name: 'Ludus',
    description: '1 point for each red card you own',
    step: 1
  }
];

export const CommerceDetails: React.FC<CommerceDetailsProps> = ({
  commerceCards,
  onCommerceCardsChange,
  onScoreChange
}) => {
  const calculateCommerceScore = (cards: CommerceCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const addCommerceCard = (cardTemplate: typeof commerceCardsList[0]) => {
    const newCard: CommerceCard = { 
      id: `${cardTemplate.name}-${Date.now()}`, 
      name: cardTemplate.name,
      score: 0,
      description: cardTemplate.description,
      step: cardTemplate.step
    };
    const newCards = [...commerceCards, newCard];
    onCommerceCardsChange(newCards);
    calculateCommerceScore(newCards);
  };

  const removeCommerceCard = (cardId: string) => {
    const newCards = commerceCards.filter(card => card.id !== cardId);
    onCommerceCardsChange(newCards);
    calculateCommerceScore(newCards);
  };

  const updateCommerceCard = (cardId: string, score: number) => {
    const newCards = commerceCards.map(card => 
      card.id === cardId ? { ...card, score } : card
    );
    onCommerceCardsChange(newCards);
    calculateCommerceScore(newCards);
  };

  const adjustCommerceCard = (cardId: string, delta: number) => {
    const card = commerceCards.find(c => c.id === cardId);
    if (card) {
      const newScore = Math.max(0, card.score + delta);
      updateCommerceCard(cardId, newScore);
    }
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="space-y-4">
        {/* Dropdown menu button */}
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                Select a commerce card...
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {commerceCardsList.map(cardTemplate => {
                const isAdded = commerceCards.some(card => card.name === cardTemplate.name);
                return (
                  <DropdownMenuItem
                    key={cardTemplate.name}
                    onClick={() => !isAdded && addCommerceCard(cardTemplate)}
                    disabled={isAdded}
                    className={`${isAdded ? 'opacity-50' : ''} cursor-pointer`}
                  >
                    {cardTemplate.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Added cards */}
        {commerceCards.length > 0 && (
          <div className="space-y-3">
            {commerceCards.map(card => (
              <div key={card.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-medium text-sm">{card.name}</div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustCommerceCard(card.id, -card.step)}
                      className="p-1 h-6 w-6 hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={card.score || ''}
                      onChange={(e) => updateCommerceCard(card.id, parseInt(e.target.value) || 0)}
                      placeholder="Points"
                      className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustCommerceCard(card.id, card.step)}
                      className="p-1 h-6 w-6 hover:bg-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommerceCard(card.id)}
                      className="p-1 h-6 w-6 hover:bg-red-200 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">{card.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
