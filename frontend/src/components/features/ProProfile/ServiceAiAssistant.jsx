import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Zap } from 'lucide-react';

const ServiceAiAssistant = ({ onSuggestion }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'assistant',
      text: "Hey there, I'm Asa, your AI Service Assistant. I'm here to help you write a service post that gets noticed. What do you need done?"
    }
  ]);

  const quickPrompts = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Lawn care",
    "Painting",
    "Cleaning"
  ];

  const handleGenerate = async (currentPrompt) => {
    if (!currentPrompt || currentPrompt.trim().length < 3) {
      setError('Please describe your service.');
      return;
    }

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', text: currentPrompt }]);
    setPrompt('');
    setLoading(true);
    setError('');

    try {
      // Simulate AI response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestion = {
        title: `Professional ${currentPrompt} Services`,
        description: `Expert ${currentPrompt} service with years of experience. Quality work guaranteed, competitive pricing, and flexible scheduling available.`
      };

      // Add AI response to chat
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Great! I've drafted a service post for "${currentPrompt}". Here's what I came up with:\n\n**Title:** ${suggestion.title}\n\n**Description:** ${suggestion.description}\n\nFeel free to refine it or ask me to adjust anything!`
      }]);

      if (onSuggestion) {
        onSuggestion(suggestion);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Failed to get AI suggestions.';
      setError(errMsg);
      setChatMessages(prev => [...prev, {
        type: 'error',
        text: errMsg
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (p) => {
    handleGenerate(p);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200   overflow-hidden flex flex-col h-[600px] max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Refine your service post</h3>
            </div>
          </div>
          <span className="text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full">Beta</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Service post strength: 1 of 4</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full hover:bg-yellow-300 transition-colors">
            3 tips
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : msg.type === 'error'
                ? 'bg-red-100 text-red-700 rounded-tl-sm'
                : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-tl-sm'
            }`}>
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-gray-500">Asa is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleQuickPrompt(p)}
              disabled={loading}
              className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleGenerate(prompt)}
            placeholder="Reply to Asa..."
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleGenerate(prompt)}
            disabled={loading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed   transition-all"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper
export default function App() {
  const [suggestion, setSuggestion] = useState(null);

  return (
      <ServiceAiAssistant onSuggestion={setSuggestion} />
  );
}