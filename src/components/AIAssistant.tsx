import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, BrainCircuit, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  transactions: any[];
}

export default function AIAssistant({ transactions }: AIAssistantProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSpending = async () => {
    if (transactions.length === 0) {
      setError("Add some transactions first so I can analyze your spending patterns!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `
        Analyze the following personal finance transactions and provide 3 concise, actionable financial tips.
        Focus on spending patterns, potential savings, and budget optimization.
        Format the response as a JSON array of objects with 'title', 'description', and 'type' (one of: 'saving', 'warning', 'insight').
        
        Transactions:
        ${JSON.stringify(transactions.map(t => ({ amount: t.amount, type: t.type, category: t.category, description: t.description })))}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '[]');
      setAnalysis(result);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Failed to analyze spending. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <BrainCircuit size={20} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">AI Financial Assistant</h3>
        </div>

        <p className="text-blue-100 text-sm leading-relaxed mb-8">
          Get personalized insights and savings tips based on your recent spending habits.
        </p>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-sm font-medium text-blue-100">Analyzing your patterns...</p>
            </motion.div>
          ) : analysis ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {(analysis as any).map((tip: any, index: number) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {tip.type === 'saving' ? <TrendingUp size={16} className="text-green-300" /> : 
                       tip.type === 'warning' ? <AlertCircle size={16} className="text-yellow-300" /> : 
                       <Lightbulb size={16} className="text-blue-200" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{tip.title}</h4>
                      <p className="text-xs text-blue-100 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setAnalysis(null)}
                className="w-full py-2 text-xs font-bold text-blue-200 hover:text-white transition-colors"
              >
                Reset Analysis
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-xs text-red-100 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
              <button
                onClick={analyzeSpending}
                className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Analyze My Spending
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
