
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Trash2, Sun, Moon } from 'lucide-react';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import ScoreCategories from './ScoreCategories';
import { calculateTotalScore } from '@/utils/scoreCalculator';

interface WonderBoardProps {
  board: WonderBoardType;
  playerName: string;
  wonderSide: WonderSide;
  scores: Record<ScoreCategory, number>;
  onNameChange: (name: string) => void;
  onBoardChange?: (board: WonderBoardType) => void;
  onSideChange: (side: WonderSide) => void;
  onScoreChange: (category: ScoreCategory, value: number) => void;
  onRemove: () => void;
  isEmpty: boolean;
  forceExpanded?: boolean;
  availableBoards?: WonderBoardType[];
  showBoardSelector?: boolean;
}

const wonderBoardNames: Record<WonderBoardType, string> = {
  alexandria: 'Alexandria',
  babylon: 'Babylon',
  ephesus: 'Ephesus',
  giza: 'Giza',
  halicarnassus: 'Halicarnassus',
  olympia: 'Olympia',
  rhodes: 'Rhodes',
};

const WonderBoard: React.FC<WonderBoardProps> = ({
  board,
  playerName,
  wonderSide,
  scores,
  onNameChange,
  onBoardChange,
  onSideChange,
  onScoreChange,
  onRemove,
  isEmpty,
  forceExpanded = false,
  availableBoards = [],
  showBoardSelector = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalScore = calculateTotalScore(scores);
  const expanded = forceExpanded || isExpanded;

  const handleBoardChange = (newBoard: WonderBoardType) => {
    if (onBoardChange) {
      onBoardChange(newBoard);
    }
  };

  return (
    <Card className={`transition-colors ${
      isEmpty 
        ? 'border-2 border-dashed border-gray-300 bg-gray-50/50' 
        : 'border-2 border-amber-200 shadow-lg hover:shadow-xl'
    }`}>
      <CardHeader 
        className={`cursor-pointer transition-colors ${
          isEmpty 
            ? 'bg-gray-100' 
            : `bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600`
        }`}
        onClick={() => !forceExpanded && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {showBoardSelector && onBoardChange ? (
                <Select value={board} onValueChange={handleBoardChange}>
                  <SelectTrigger 
                    className="bg-white/90 text-gray-800 border-white/50 hover:bg-white focus:bg-white min-w-[140px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={board}>
                      {wonderBoardNames[board]} (Current)
                    </SelectItem>
                    {availableBoards.map(availableBoard => (
                      <SelectItem key={availableBoard} value={availableBoard}>
                        {wonderBoardNames[availableBoard]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <CardTitle className={`text-lg font-bold ${isEmpty ? 'text-gray-600' : 'text-white'}`}>
                  {wonderBoardNames[board]}
                </CardTitle>
              )}
              
              <Select value={wonderSide} onValueChange={onSideChange}>
                <SelectTrigger 
                  className={`w-32 ${
                    isEmpty 
                      ? 'bg-white border-gray-300 text-gray-700' 
                      : 'bg-white/90 text-gray-800 border-white/50 hover:bg-white focus:bg-white'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Day
                    </div>
                  </SelectItem>
                  <SelectItem value="night">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Night
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Input
              value={playerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter player name"
              className={`font-medium ${
                isEmpty 
                  ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500' 
                  : 'bg-white/90 text-gray-900 border-white/50 placeholder:text-gray-600 focus:bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {!isEmpty && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {totalScore} pts
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`${
                isEmpty 
                  ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
            {!forceExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className={`${
                  isEmpty 
                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-200' 
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-4">
          <ScoreCategories
            scores={scores}
            onScoreChange={onScoreChange}
            wonderBoard={board}
            wonderSide={wonderSide}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default WonderBoard;
