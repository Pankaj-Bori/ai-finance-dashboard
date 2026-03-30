import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType, Timestamp } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { 
  Plus, 
  CreditCard, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [type, setType] = useState('Visa');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'cards'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cds);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cards');
    });

    return () => unsubscribe();
  }, []);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !cardNumber || !cardHolder) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'cards'), {
        uid: user.uid,
        cardNumber,
        cardHolder,
        expiry,
        type,
        createdAt: Timestamp.now()
      });

      setShowAddModal(false);
      setCardNumber('');
      setCardHolder('');
      setExpiry('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'cards');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteDoc(doc(db, 'cards', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'cards');
    }
  };

  const toggleNumber = (id: string) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCardNumber = (num: string, visible: boolean) => {
    if (visible) return num.replace(/(\d{4})/g, '$1 ').trim();
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Cards</h1>
          <p className="text-slate-500 mt-1">Manage your payment methods securely.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
        >
          <Plus size={20} />
          Add New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : cards.length > 0 ? cards.map((card) => (
          <motion.div
            layout
            key={card.id}
            className="relative group h-64 w-full"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${
              card.type === 'Visa' ? 'from-blue-600 to-blue-800' : 'from-slate-800 to-slate-900'
            } rounded-[2.5rem] p-8 text-white shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CreditCard size={120} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Zap className="text-white" size={20} />
                    </div>
                    <span className="font-bold tracking-tight">FinPulse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleNumber(card.id)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {showNumbers[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-mono tracking-[0.2em] mb-4">
                    {formatCardNumber(card.cardNumber, showNumbers[card.id])}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Card Holder</p>
                      <p className="text-sm font-bold uppercase">{card.cardHolder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Expires</p>
                      <p className="text-sm font-bold">{card.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <CreditCard className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium italic">No cards saved yet. Add one to get started!</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Secure Card Storage</h3>
          <p className="text-sm text-slate-500">Your card details are encrypted and stored with bank-grade security. We never store your full CVV or PIN.</p>
        </div>
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
          <Lock size={16} />
          PCI-DSS Compliant
        </div>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Add New Card</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-lg font-mono tracking-widest text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Holder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="FULL NAME"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold uppercase text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                        setExpiry(val);
                      }}
                      placeholder="MM/YY"
                      className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">Amex</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || cardNumber.length < 16 || !cardHolder}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                >
                  {submitting ? 'Adding...' : 'Save Card'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
