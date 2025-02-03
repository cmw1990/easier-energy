import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameAssetsGenerator } from '@/components/GameAssetsGenerator';
import ChessGame from '@/components/games/ChessGame';
import { CheckersGame } from '@/components/games/CheckersGame';
import { ConnectFourGame } from '@/components/games/ConnectFourGame';
import { TicTacToeGame } from '@/components/games/TicTacToeGame';
import BrainMatch3 from '@/components/games/BrainMatch3';
import VisualMemory from '@/components/games/VisualMemory';
import WordAssociation from '@/components/games/WordAssociation';
import WordScramble from '@/components/games/WordScramble';
import WordMemoryChain from '@/components/games/WordMemoryChain';
import BreathingGame from '@/components/games/BreathingGame';
import BalloonJourney from '@/components/games/BalloonJourney';
import { Brain, Crown, Circle, Wind } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Game Center</h1>
        <GameAssetsGenerator />
      </div>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Board Games
          </TabsTrigger>
          <TabsTrigger value="brain" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Brain Games
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            Memory Games
          </TabsTrigger>
          <TabsTrigger value="word" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Word Games
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Breathing Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="grid gap-4">
            <ChessGame />
            <CheckersGame />
            <ConnectFourGame />
            <TicTacToeGame />
          </div>
        </TabsContent>

        <TabsContent value="brain" className="space-y-4">
          <div className="grid gap-4">
            <BrainMatch3 />
            <VisualMemory />
          </div>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <div className="grid gap-4">
            <VisualMemory />
          </div>
        </TabsContent>

        <TabsContent value="word" className="space-y-4">
          <div className="grid gap-4">
            <WordAssociation />
            <WordScramble />
            <WordMemoryChain />
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4">
          <div className="grid gap-4">
            <BreathingGame />
            <BalloonJourney />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;