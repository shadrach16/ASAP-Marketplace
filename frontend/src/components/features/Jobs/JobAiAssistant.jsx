import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Zap } from 'lucide-react';

/**
 * A side-panel component for the ASAP platform to help clients generate
 * a job description for trade professionals using AI.
 *
 * @param {object} props
 * @param {function(string): void} props.onSuggestion - Callback function to pass the generated description to the parent.
 * @param {boolean} [props.disabled=false] - Disables the component (e.g., during form submission).
 */
const JobAiAssistant = ({ onSuggestion, disabled = false }) => {
  const [prompt, setPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'assistant',
      text: "Hey there! I'm here to help you create the perfect job posting. Tell me about your project and I'll craft a detailed, professional description that attracts the right trade professionals."
    }
  ]);

  const quickPrompts = [
    "Fix leaky pipe",
    "Install new sink",
    "Repair electrical outlet",
    "Paint bedroom",
    "Install flooring",
    "HVAC repair"
  ];

  const handleGenerateDescription = async (currentPrompt) => {
    const promptToUse = currentPrompt || prompt;
    
    if (!promptToUse.trim()) {
      setAiError("Please enter a brief description first.");
      return;
    }

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', text: promptToUse }]);
    setPrompt('');
    setAiLoading(true);
    setAiError(null);

    try {
      // Simulate API call - replace with actual aiService.generateJobDescription(promptToUse)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generatedDesc = `Professional ${promptToUse} service needed. Experienced trade professional required for quality work. Project includes detailed assessment, professional execution, and cleanup. Licensed and insured professionals preferred.`;
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Great! I've created a professional job description for your project:\n\n${generatedDesc}\n\nThis description has been added to your job posting. Feel free to refine it or ask me to adjust anything!`
      }]);

      onSuggestion(generatedDesc); // Pass the description up to the parent
    } catch (err) {
      const errorMsg = err.message || "Failed to generate description.";
      setAiError(errorMsg);
      setChatMessages(prev => [...prev, {
        type: 'error',
        text: errorMsg
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuickPrompt = (p) => {
    handleGenerateDescription(p);
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Job Description Assistant</h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full">Beta</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Write a professional post faster with AI</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full hover:bg-yellow-300 transition-colors">
              Tips
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
          
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-500">Generating description...</span>
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
                disabled={aiLoading || disabled}
                className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          {aiError && <p className="text-xs text-red-600 mb-2">{aiError}</p>}
          
          <div className="relative">
            <input
              type="text"
              id="aiPrompt"
              name="aiPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !aiLoading && !disabled && handleGenerateDescription()}
              placeholder="Describe your project (e.g., Need a licensed plumber to fix a leaky pipe...)"
              disabled={aiLoading || disabled}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleGenerateDescription()}
              disabled={aiLoading || disabled || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobAiAssistant