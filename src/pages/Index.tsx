
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import WonderBoard from '@/components/WonderBoard';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import { calculateTotalScore, getWinner } from '@/utils/scoreCalculator';

interface PlayerData {
  id: string;
  name: string;
  board: WonderBoardType;
  side: WonderSide;
  scores: Record<ScoreCategory, number>;
  isActive: boolean;
}

const wonderBoards: WonderBoardType[] = [
  'alexandria', 'babylon', 'ephesus', 'giza', 'halicarnassus', 'olympia', 'rhodes'
];

const createEmptyScores = (): Record<ScoreCategory, number> => ({
  wonder: 0,
  wealth: 0,
  military: 0,
  culture: 0,
  commerce: 0,
  science: 0,
  guilds: 0
});

const Index = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [gameTitle, setGameTitle] = useState('7 Wonders');
  const [allExpanded, setAllExpanded] = useState(false);

  // Initialize with all 7 wonder boards
  useEffect(() => {
    const initialPlayers: PlayerData[] = wonderBoards.map((board, index) => ({
      id: `player-${index}`,
      name: '',
      board,
      side: 'day' as WonderSide,
      scores: createEmptyScores(),
      isActive: true,
    }));
    setPlayers(initialPlayers);
  }, []);

  const updatePlayerName = (playerId: string, name: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, name } : p
    ));
  };

  const updatePlayerSide = (playerId: string, side: WonderSide) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, side } : p
    ));
  };

  const updatePlayerScore = (playerId: string, category: ScoreCategory, value: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { 
        ...p, 
        scores: { ...p.scores, [category]: value }
      } : p
    ));
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, isActive: false } : p
    ));
  };

  const addSpecificBoard = (boardType: WonderBoardType) => {
    setPlayers(prev => prev.map(p => 
      p.board === boardType ? { ...p, isActive: true } : p
    ));
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
  };

  const activePlayers = players.filter(p => p.isActive);
  const playingPlayers = activePlayers.filter(p => p.name.trim() !== '');
  const removedBoards = players.filter(p => !p.isActive);
  
  // Sort active players by total score (highest first)
  const sortedActivePlayers = activePlayers
    .sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Input
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="text-4xl md:text-6xl font-bold text-amber-900 mb-4 text-center border-none bg-transparent shadow-none text-center"
            placeholder="Game Title"
          />
          <h2 className="text-lg text-amber-700 mb-6">
            Digital Scorepad
          </h2>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button 
              onClick={toggleExpandAll}
              variant="outline"
              className="flex items-center gap-2"
            >
              {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Board
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {removedBoards.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No boards removed
                  </DropdownMenuItem>
                ) : (
                  removedBoards.map(board => (
                    <DropdownMenuItem 
                      key={board.id}
                      onClick={() => addSpecificBoard(board.board)}
                    >
                      {board.board.charAt(0).toUpperCase() + board.board.slice(1)}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Wonder Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {sortedActivePlayers.map(player => (
            <WonderBoard
              key={player.id}
              board={player.board}
              playerName={player.name}
              wonderSide={player.side}
              scores={player.scores}
              onNameChange={(name) => updatePlayerName(player.id, name)}
              onSideChange={(side) => updatePlayerSide(player.id, side)}
              onScoreChange={(category, value) => updatePlayerScore(player.id, category, value)}
              onRemove={() => removePlayer(player.id)}
              isEmpty={player.name.trim() === ''}
              forceExpanded={allExpanded}
            />
          ))}
        </div>

        {/* Creator Credit */}
        <div className="text-center text-amber-700 text-sm">
          Created by Benjamin Menashe
        </div>
      </div>
    </div>
  );
};

export default Index;
