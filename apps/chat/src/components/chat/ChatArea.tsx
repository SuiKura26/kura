"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { LoadingSteps } from "./LoadingSteps";
import { WelcomeScreen } from "./WelcomeScreen";
import { Message } from "@/types/chat";
import { Language, LoadingStep } from "@/hooks/useChat";

interface ChatAreaProps {
  messages: Message[];
  loadingStep: LoadingStep;
  language: Language;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatArea({ messages, loadingStep, language, onSuggestionClick }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingStep]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <WelcomeScreen language={language} onSuggestionClick={onSuggestionClick} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-44 md:p-6 md:pb-52">
      <div className="max-w-4xl mx-auto flex flex-col space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} language={language} />
        ))}
        
        {loadingStep && (
          <div className="flex w-full justify-start mb-6">
            <LoadingSteps step={loadingStep} language={language} />
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
