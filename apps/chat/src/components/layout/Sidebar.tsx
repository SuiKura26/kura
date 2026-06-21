"use client";

import { MessageSquarePlus, History, Wallet, Languages, Moon, Sun, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { ConnectButton } from "@mysten/dapp-kit";
import { Language } from "@/hooks/useChat";
import { ChatSession } from "@/types/chat";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaucetButton } from "@/components/chat/FaucetButton";

interface SidebarProps {
  language: Language;
  toggleLanguage: () => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ language, toggleLanguage, onNewChat, sessions, activeSessionId, switchSession, deleteSession, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    id: {
      newChat: "Obrolan Baru",
      history: "Riwayat",
      wallet: "Hubungkan Wallet",
    },
    en: {
      newChat: "New Chat",
      history: "History",
      wallet: "Connect Wallet",
    }
  };

  const text = t[language];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <a 
              href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "http://localhost:3000"}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/kura-logo-dark-mode.png"
                  alt="Kura"
                  width={32}
                  height={32}
                  className="hidden dark:block object-contain"
                />
                <Image
                  src="/kura-logo-light-mode.png"
                  alt="Kura"
                  width={32}
                  height={32}
                  className="block dark:hidden object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">Kura</span>
            </a>

            <button
              className="md:hidden p-1 rounded-md hover:bg-accent text-muted-foreground"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Action */}
          <button
            onClick={() => {
              onNewChat();
              setIsMobileOpen(false);
            }}
            className="flex items-center space-x-2 w-full p-3 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium mb-6"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{text.newChat}</span>
          </button>

          {/* History */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center">
              <History className="w-3 h-3 mr-2" />
              {text.history}
            </div>
            <div className="space-y-1 pr-2">
              {sessions.length === 0 ? (
                <div className="text-xs text-muted-foreground italic px-2">Belum ada riwayat</div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${
                      activeSessionId === session.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-foreground/80"
                    }`}
                    onClick={() => switchSession(session.id)}
                  >
                    <span className="text-sm truncate flex-1">{session.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded text-muted-foreground transition-all"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t space-y-2 mt-auto">

            {/* Faucet — Above Wallet */}
            <div className="w-full flex justify-center mb-2">
              <FaucetButton variant="compact" />
            </div>

            {/* Wallet Connect */}
            <div className="w-full flex justify-center mb-2">
              <ConnectButton 
                connectText={text.wallet} 
                className="!w-full !rounded-lg !bg-primary/10 hover:!bg-primary/20 !text-primary !text-sm !font-medium !h-[44px]"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={toggleLanguage}
                className="flex-1 flex items-center justify-center p-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm"
                title="Toggle Language"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="uppercase font-semibold text-xs">{language}</span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 flex items-center justify-center p-2 rounded-lg border bg-background hover:bg-accent transition-colors"
                title="Toggle Theme"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
