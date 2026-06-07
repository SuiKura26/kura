"use client";

import { Message } from "@/types/chat";
import { TransactionCard } from "./TransactionCard";
import { Language } from "@/hooks/useChat";
import Image from "next/image";

interface MessageBubbleProps {
  message: Message;
  language: Language;
}

export function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 mt-1 ${isUser ? "ml-3" : "mr-3"}`}>
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              U
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center p-1 border">
               <Image
                  src="/kura-logo-dark-mode.png"
                  alt="Kura"
                  width={24}
                  height={24}
                  className="hidden dark:block object-contain"
                />
                <Image
                  src="/kura-logo-light-mode.png"
                  alt="Kura"
                  width={24}
                  height={24}
                  className="block dark:hidden object-contain"
                />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          {message.type === "text" && (
            <div 
              className={`p-3 md:p-4 rounded-2xl text-sm md:text-base shadow-sm ${
                isUser 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-muted text-foreground rounded-tl-sm border"
              }`}
            >
              {message.content}
            </div>
          )}

          {message.type === "transaction" && message.transactionData && (
            <div className="flex flex-col space-y-3">
              <div className="p-3 md:p-4 rounded-2xl text-sm md:text-base shadow-sm bg-muted text-foreground rounded-tl-sm border w-fit">
                {message.content}
              </div>
              <TransactionCard data={message.transactionData} language={language} />
            </div>
          )}

          {/* Timestamp */}
          <span className={`text-[10px] text-muted-foreground mt-1 px-1 ${isUser ? "text-right" : "text-left"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
