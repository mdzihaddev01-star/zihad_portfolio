'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { ZorroChatMessage } from '@/types/portfolio';
import { 
  Bot, 
  Send, 
  X, 
  Loader2 
} from 'lucide-react';

interface AskZorroWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AskZorroWidget({ isOpen, onToggle }: AskZorroWidgetProps) {
  const { t, language, dir } = useLanguage();
  const [messages, setMessages] = useState<ZorroChatMessage[]>([
    {
      id: 'welcome',
      sender: 'zorro',
      text: t.zorro.welcomeMsg,
      timestamp: 'NOW',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message on language change ONLY if user hasn't sent messages yet
  useEffect(() => {
    setMessages((prev) => {
      const hasUserMessage = prev.some((m) => m.sender === 'user');
      if (hasUserMessage) return prev;
      return [
        {
          id: 'welcome',
          sender: 'zorro',
          text: t.zorro.welcomeMsg,
          timestamp: 'NOW',
        },
      ];
    });
  }, [language, t.zorro.welcomeMsg]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    soundFx.playBlip();

    // 1. Immediately append user message to UI state
    const userMsg: ZorroChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'NOW',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/zorro', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          history: messages
            .filter((message) => message.id !== 'welcome')
            .map((message) => ({
              role: message.sender === 'user' ? 'user' : 'assistant',
              content: message.text,
            })),
        }),
      });

      const data = await res.json();
      
      // 2. Take exact data.reply from JSON response
      const botReply = data?.reply || (data?.error ? `Error: ${data.error}` : 'Thank you for your inquiry. Please use the contact section on this page to reach Mohammad Zihad.');

      const botMsg: ZorroChatMessage = {
        id: `zorro-${Date.now() + 1}`,
        sender: 'zorro',
        text: botReply,
        timestamp: 'NOW',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('ZORRO assistant fetch error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `zorro-${Date.now() + 1}`,
          sender: 'zorro',
          text: 'Unable to connect to the profile assistant server at this moment. Please use the contact section on this page to reach Mohammad Zihad.',
          timestamp: 'NOW',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isArabicText = (text: string) => /[\u0600-\u06FF]/.test(text);

  const chips = [
    t.zorro.chips.skills,
    t.zorro.chips.projects,
    t.zorro.chips.education,
    t.zorro.chips.hire,
  ];

  return (
    <>
      {/* Floating Futuristic Bot Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40 pointer-events-auto">
        <button
          onClick={() => {
            soundFx.playBlip();
            onToggle();
          }}
          title="Chat with ZORRO - Profile AI"
          className="relative group p-3.5 rounded-full bg-[#0c0c0e] border border-white/15 text-white shadow-[0_0_25px_rgba(0,0,0,0.8),0_0_15px_rgba(245,166,35,0.25)] hover:border-[#f5a623] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Subtle Warm Amber Glow Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-[#f5a623]/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#f5a623] group-hover:rotate-12 transition-transform" />
          </div>
          {/* Status Indicator */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] border border-black animate-ping" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] border border-black" />
        </button>
      </div>

      {/* Futuristic Obsidian Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 md:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[75vh] bg-[#0c0c0e] rounded-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,166,35,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-auto"
        >
          {/* Chat Window Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141418]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#f5a623]/15 border border-[#f5a623]/30 flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-[#f5a623]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-white tracking-wider font-mono uppercase">
                    Ask ZORRO
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#f5a623]/15 text-[#ffd166] border border-[#f5a623]/30">
                    PROFILE AI
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Online • Profile AI</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playBlip();
                onToggle();
              }}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg) => {
              const isRtl = isArabicText(msg.text) || (language === 'ar' && msg.sender === 'zorro');
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-line text-xs font-sans ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-semibold shadow-md rounded-br-xs'
                        : 'bg-[#141418] text-zinc-200 border border-white/10 shadow-md rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#141418] rounded-2xl p-3 border border-white/10 flex items-center gap-2 text-[#f5a623]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-mono text-[11px]">ZORRO is analyzing profile data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-white/10 flex gap-1.5 overflow-x-auto scrollbar-none bg-[#141418]">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0c0c0e] hover:bg-white/5 text-zinc-300 hover:text-[#ffd166] border border-white/10 cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box with spacebar stopPropagation fix */}
          <div className="p-3 border-t border-white/10 bg-[#141418]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.zorro.inputPlaceholder}
                className="flex-1 bg-[#0c0c0e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f5a623] font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
