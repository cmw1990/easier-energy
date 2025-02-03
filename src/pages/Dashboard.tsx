import React from 'react';
import ChessGame from '@/components/games/ChessGame';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <ChessGame />
    </div>
  );
};

export default Dashboard;