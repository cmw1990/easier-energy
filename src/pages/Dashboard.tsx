import React from 'react';
import ChessGame from '@/components/games/ChessGame';
import { GameAssetsGenerator } from '@/components/GameAssetsGenerator';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <GameAssetsGenerator />
      </div>
      <ChessGame />
    </div>
  );
};

export default Dashboard;