import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse } from '../services/geminiChatService';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function SyariahChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Assalamualaikum! Saya Asisten Syariah Nur Holis Regency. Ada yang bisa saya bantu terkait hunian tanpa riba kami?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare chat history for API (simplified for this use case)
    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const responseText = await getGeminiResponse(userMessage.text, history);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        id="chatbot-toggle"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-colors duration-300",
          isOpen ? "hidden" : "flex items-center justify-center bg-emerald-600 dark:bg-emerald-500 text-white"
        )}
        aria-label="Buka Chat Asisten Syariah"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="ml-2 font-bold hidden md:inline">Tanya Syariah AI</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '550px' 
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300",
              isMinimized && "w-[250px]"
            )}
          >
            {/* Header */}
            <div className="bg-emerald-600 dark:bg-emerald-700 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Asisten Syariah</h3>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    <span className="text-[10px] opacity-80">Online 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-emerald-500 rounded transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-emerald-500 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "flex max-w-[85%] items-start space-x-2",
                        msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                          msg.role === 'user' ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        )}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm shadow-sm",
                          msg.role === 'user' 
                            ? "bg-emerald-600 text-white rounded-tr-none" 
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                        )}>
                          {msg.text}
                          <div className={cn(
                            "text-[10px] mt-1 opacity-50",
                            msg.role === 'user' ? "text-right text-emerald-100" : "text-left"
                          )}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span className="text-sm text-slate-500">Berjalan di jalan Allah...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tanya tentang riba, denda, dll..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 p-2 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-center mt-2 text-slate-400">
                    Didukung oleh Gemini AI • Prinsip Syariah Murni
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
