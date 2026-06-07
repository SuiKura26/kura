"use client";

import { useChat } from "@/hooks/useChat";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "../chat/ChatArea";
import { ChatInput } from "../chat/ChatInput";
import { Menu } from "lucide-react";

export function ChatLayout() {
  const {
    sessions,
    activeSessionId,
    messages,
    loadingStep,
    language,
    toggleLanguage,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useChat();

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar
        language={language}
        toggleLanguage={toggleLanguage}
        onNewChat={createNewSession}
        sessions={sessions}
        activeSessionId={activeSessionId}
        switchSession={switchSession}
        deleteSession={deleteSession}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-accent text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold tracking-tight">Kura</span>
        </div>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          loadingStep={loadingStep}
          language={language}
          onSuggestionClick={sendMessage}
        />

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-4 px-4 md:px-6">
          <ChatInput
            language={language}
            onSend={sendMessage}
            disabled={loadingStep !== null}
          />
          <div className="text-center mt-2 text-[10px] md:text-xs text-muted-foreground/70">
            {language === "id"
              ? "Kura dapat membuat kesalahan. Harap tinjau kembali laporan Guardian sebelum mengeksekusi."
              : "Kura can make mistakes. Please review the Guardian report before executing."}
          </div>
        </div>
      </main>
    </div>
  );
}
