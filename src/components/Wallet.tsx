import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType, Timestamp } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Wallet as WalletIcon, Plus, Minus, ArrowUpRight, ArrowDownRight, CreditCard, Landmark, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setBalance(userDoc.data().balance || 0);
        } else {
          // Create user doc if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            balance: 0,
            currency: 'USD'
          });
          setBalance(0);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'users');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !amount) return;

    setAdding(true);
    const numAmount = parseFloat(amount);

    try {
      const newBalance = balance + numAmount;
      await updateDoc(doc(db, 'users', user.uid), {
        balance: newBalance
      });

      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        amount: numAmount,
        type: 'income',
        category: 'wallet',
        date: Timestamp.now(),
        description: 'Added to wallet'
      });

      setBalance(newBalance);
      setAmount('');
      setActionMessage('Money added successfully!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    } finally {
      setAdding(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setActionMessage(`${action} feature coming soon!`);
    setTimeout(() => setActionMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm"
          >
            {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Wallet</h1>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Landmark size={16} />
          Connected Bank: Chase Bank
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden h-64 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <WalletIcon size={120} />
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Current Balance</p>
                <h2 className="text-5xl font-bold tracking-tight">${balance.toLocaleString()}</h2>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Coins className="text-blue-400" />
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-400/20">
                <ArrowUpRight size={14} /> +$1,240.00
              </div>
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-400/20">
                <ArrowDownRight size={14} /> -$430.00
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleQuickAction('Transfer')}
                className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-2xl text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ArrowUpRight size={24} />
                </div>
                <span className="text-sm font-bold">Transfer</span>
              </button>
              <button 
                onClick={() => handleQuickAction('Pay Bills')}
                className="flex flex-col items-center gap-3 p-6 bg-green-50 rounded-2xl text-green-600 hover:bg-green-100 transition-colors border border-green-100 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <CreditCard size={24} />
                </div>
                <span className="text-sm font-bold">Pay Bills</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Add Money</h3>
          <p className="text-slate-400 text-sm mb-8">Top up your wallet balance instantly.</p>

          <form onSubmit={handleAddMoney} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
                >
                  +${val}
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                disabled={adding || !amount}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {adding ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus size={20} />
                    Add to Wallet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
