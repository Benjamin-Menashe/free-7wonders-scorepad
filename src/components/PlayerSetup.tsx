
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Sun, Moon } from 'lucide-react';
import { Player, WonderBoard, WonderSide } from '@/types/game';

interface PlayerSetupProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onStartScoring: () => void;
}

const wonderBoards: { key: WonderBoard; name: string; description: string }[] = [
  { key: 'alexandria', name: 'Alexandria', description: 'The Great Library' },
  { key: 'babylon', name: 'Babylon', description: 'The Hanging Gardens' },
  { key: 'ephesus', name: 'Ephesus', description: 'The Temple of Artemis' },
  { key: 'giza', name: 'Giza', description: 'The Great Pyramid' },
  { key: 'halicarnassus', name: 'Halicarnassus', description: 'The Mausoleum' },
  { key: 'olympia', name: 'Olympia', description: 'The Statue of Zeus' },
  { key: 'rhodes', name: 'Rhodes', description: 'The Colossus' },
];

const PlayerSetup: React.FC<PlayerSetupProps> = ({ players, setPlayers, onStartScoring }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<WonderBoard>('alexandria');
  const [selectedSide, setSelectedSide] = useState<WonderSide>('day');

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 7) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: newPlayerName.trim(),
        wonderBoard: selectedBoard,
        wonderSide: selectedSide,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    ));
  };

  const usedBoards = players.map(p => p.wonderBoard);
  const availableBoards = wonderBoards.filter(board => !usedBoards.includes(board.key));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-2 border-amber-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Add New Player
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Player Name
              </label>
              <Input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Wonder Board
              </label>
              <Select value={selectedBoard} onValueChange={(value: WonderBoard) => setSelectedBoard(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableBoards.map(board => (
                    <SelectItem key={board.key} value={board.key}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Board Side
              </label>
              <Select value={selectedSide} onValueChange={(value: WonderSide) => setSelectedSide(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Day Side
                    </div>
                  </SelectItem>
                  <SelectItem value="night">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Night Side
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 7 || availableBoards.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Add Player
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <Card key={player.id} className="border-2 border-gray-200 hover:border-amber-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-800">{player.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {wonderBoards.find(b => b.key === player.wonderBoard)?.name}
                    </Badge>
                    <Badge variant={player.wonderSide === 'day' ? 'default' : 'secondary'} className="text-xs">
                      {player.wonderSide === 'day' ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
                      {player.wonderSide}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlayer(player.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Wonder Board
                  </label>
                  <Select 
                    value={player.wonderBoard} 
                    onValueChange={(value: WonderBoard) => updatePlayer(player.id, { wonderBoard: value })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={player.wonderBoard}>
                        {wonderBoards.find(b => b.key === player.wonderBoard)?.name}
                      </SelectItem>
                      {availableBoards.map(board => (
                        <SelectItem key={board.key} value={board.key}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Board Side
                  </label>
                  <Select 
                    value={player.wonderSide} 
                    onValueChange={(value: WonderSide) => updatePlayer(player.id, { wonderSide: value })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">
                        <div className="flex items-center gap-2">
                          <Sun className="w-3 h-3" />
                          Day Side
                        </div>
                      </SelectItem>
                      <SelectItem value="night">
                        <div className="flex items-center gap-2">
                          <Moon className="w-3 h-3" />
                          Night Side
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start Game Button */}
      {players.length >= 3 && (
        <div className="text-center">
          <Button 
            onClick={onStartScoring}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-3"
          >
            Start Scoring ({players.length} Players)
          </Button>
        </div>
      )}

      {players.length > 0 && players.length < 3 && (
        <div className="text-center">
          <p className="text-amber-700">Add at least 3 players to start the game</p>
        </div>
      )}
    </div>
  );
};

export default PlayerSetup;
