"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { Language } from "@/hooks/useChat";

interface ChatInputProps {
  language: Language;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ language, onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = {
    id: {
      placeholder: "Ketik perintah transaksi Anda di sini...",
    },
    en: {
      placeholder: "Type your transaction command here...",
    }
  };

  const text = t[language];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-end w-full max-w-4xl mx-auto p-4 bg-background/80 backdrop-blur-md rounded-2xl border shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={text.placeholder}
        disabled={disabled}
        rows={1}
        className="w-full resize-none bg-transparent outline-none p-2 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        maxLength={500}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="ml-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
      
      {/* Character counter */}
      <div className="absolute bottom-2 right-14 text-xs text-muted-foreground pointer-events-none">
        {input.length}/500
      </div>
    </div>
  );
}
