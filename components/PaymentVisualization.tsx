'use client';

import { useState, useEffect } from 'react';

interface PaymentVisualizationProps {
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'completed' | 'failed';
}

export default function PaymentVisualization({ transactions }: PaymentVisualizationProps) {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  
  useEffect(() => {
    // Calculate total earnings
    const total = transactions
      .filter(tx => tx.status === 'completed' && tx.type === 'incoming')
      .reduce((sum, tx) => sum + tx.amount, 0);
    setTotalEarnings(total);
    
    // Calculate daily earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daily = transactions
      .filter(tx => {
        const txDate = new Date(tx.timestamp);
        return tx.status === 'completed' && 
               tx.type === 'incoming' && 
               txDate >= today;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    setDailyEarnings(daily);
    
    // Calculate weekly earnings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekly = transactions
      .filter(tx => {
        const txDate = new Date(tx.timestamp);
        return tx.status === 'completed' && 
               tx.type === 'incoming' && 
               txDate >= weekStart;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    setWeeklyEarnings(weekly);
  }, [transactions]);
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
      
      <div className="text-3xl font-bold mb-2">{totalEarnings.toFixed(6)} ETH</div>
      <div className="text-sm text-gray-400 mb-6">u2248 ${(totalEarnings * 3000).toFixed(2)} USD</div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Today</div>
          <div className="text-xl font-semibold">{dailyEarnings.toFixed(6)} ETH</div>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">This Week</div>
          <div className="text-xl font-semibold">{weeklyEarnings.toFixed(6)} ETH</div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {transactions.length > 0 ? (
          transactions
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
                <div>
                  <div className={`text-sm ${tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'incoming' ? 'Received' : 'Sent'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="font-semibold">
                  {tx.type === 'incoming' ? '+' : '-'}{tx.amount.toFixed(6)} ETH
                </div>
              </div>
            ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            No transactions yet
          </div>
        )}
      </div>
      
      <button className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
        Withdraw Funds
      </button>
    </div>
  );
}
