import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, X } from 'lucide-react';


interface CityCard {
  id: string;
  name: string;
  score: number;
  description?: string;
  isVariable: boolean;
  step?: number;
}

interface CityDetailsProps {
  cityCards: CityCard[];
  onCityCardsChange: (cards: CityCard[]) => void;
  onScoreChange: (score: number) => void;
}

const cityCardsList = [
  { name: 'Architect Firm', points: 2, isVariable: false },
  { name: 'Brotherhood', points: 4, isVariable: false },
  { name: 'Capitol', points: 8, isVariable: false },
  { name: 'Cells', points: 0, isVariable: true, description: '2 points for each 1 military victory token you own', step: 2 },
  { name: 'Cenotaph', points: 5, isVariable: false },
  { name: 'Chamber of Builders', points: 4, isVariable: false },
  { name: 'City Gates', points: 4, isVariable: false },
  { name: 'Consulate', points: 2, isVariable: false },
  { name: 'Customs', points: 4, isVariable: false },
  { name: 'Embassy', points: 3, isVariable: false },
  { name: 'Guardhouse', points: 0, isVariable: true, description: '3 points for each 3 military victory token you own', step: 3 },
  { name: 'Hideout', points: 2, isVariable: false },
  { name: 'Lair', points: 3, isVariable: false },
  { name: 'Mint', points: 8, isVariable: false },
  { name: 'Prison', points: 0, isVariable: true, description: '4 points for each 5 military victory token you own', step: 4 },
  { name: 'Residence', points: 1, isVariable: false },
  { name: 'Secret Network', points: 0, isVariable: true, description: '1 point for each black card you own', step: 1 },
  { name: 'Sepulcher', points: 4, isVariable: false },
  { name: 'Slave Market', points: 0, isVariable: true, description: '1 point for each military victory token you own', step: 1 },
  { name: 'Tabularium', points: 6, isVariable: false },
  { name: 'Trade Center', points: 6, isVariable: false },
];

export const CityDetails: React.FC<CityDetailsProps> = ({
  cityCards,
  onCityCardsChange,
  onScoreChange
}) => {
  const calculateCityScore = (cards: CityCard[]) => {
    const total = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(total);
    return total;
  };

  const addCityCard = (cardTemplate: typeof cityCardsList[0]) => {
    const newCard: CityCard = {
      id: Math.random().toString(36).substr(2, 9),
      name: cardTemplate.name,
      score: cardTemplate.points,
      description: cardTemplate.description,
      isVariable: cardTemplate.isVariable,
      step: cardTemplate.step
    };
    
    const updatedCards = [...cityCards, newCard];
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const removeCityCard = (cardId: string) => {
    const updatedCards = cityCards.filter(card => card.id !== cardId);
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const updateCityCard = (cardId: string, score: number) => {
    const updatedCards = cityCards.map(card =>
      card.id === cardId ? { ...card, score } : card
    );
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const adjustCityCard = (cardId: string, delta: number) => {
    const card = cityCards.find(c => c.id === cardId);
    if (card && card.isVariable) {
      const newScore = Math.max(0, card.score + delta);
      updateCityCard(cardId, newScore);
    }
  };

  const availableCards = cityCardsList.filter(
    template => !cityCards.some(card => card.name === template.name)
  );

  return (
    <div className="p-3 bg-white border-t space-y-3">
      {availableCards.length > 0 && (
        <div className="space-y-2">
          <Select onValueChange={(value) => {
            const cardTemplate = cityCardsList.find(card => card.name === value);
            if (cardTemplate) {
              addCityCard(cardTemplate);
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Add city card..." />
            </SelectTrigger>
            <SelectContent>
              {availableCards.map((card) => (
                <SelectItem key={card.name} value={card.name}>
                  {card.name} ({card.isVariable ? 'Variable' : `${card.points} points`})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {cityCards.length > 0 && (
        <div className="space-y-2">
          {cityCards.map((card) => (
            <Card key={card.id} className="relative">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{card.name}</div>
                    {card.description && (
                      <div className="text-xs text-gray-600 mt-1">
                        {card.description}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {card.isVariable ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => adjustCityCard(card.id, -(card.step || 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="min-w-[2rem] text-center font-medium">
                          {card.score}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => adjustCityCard(card.id, card.step || 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <span className="min-w-[2rem] text-center font-medium">
                        {card.score}
                      </span>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 ml-2"
                      onClick={() => removeCityCard(card.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cityCards.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-4">
          No city cards selected
        </div>
      )}
    </div>
  );
};