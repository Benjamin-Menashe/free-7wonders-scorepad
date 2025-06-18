
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trophy } from 'lucide-react';
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

  const activePlayers = players.filter(p => p.isActive);
  const playingPlayers = activePlayers.filter(p => p.name.trim() !== '');
  
  // Sort active players by total score (highest first)
  const sortedActivePlayers = activePlayers
    .sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores));

  const winner = getWinner(
    playingPlayers.map(p => ({ id: p.id, name: p.name })),
    Object.fromEntries(playingPlayers.map(p => [p.id, p.scores]))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            7 Wonders Digital Scorepad
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Track scores for the legendary board game of ancient civilizations
          </p>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg">
              <Trophy className="w-6 h-6" />
              <span className="font-bold text-lg">
                {winner.name} leads with {winner.score} points!
              </span>
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Wonder Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            />
          ))}
        </div>

        {/* Active Players Summary */}
        {playingPlayers.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Standings</h3>
            <div className="space-y-2">
              {playingPlayers
                .sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores))
                .map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-gray-600">
                        ({player.board} - {player.side})
                      </span>
                    </div>
                    <span className="font-bold text-xl text-amber-600">
                      {calculateTotalScore(player.scores)} pts
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
