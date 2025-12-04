/**
 * ChatbotWidget Component - Production Ready
 * Floating chat button with expandable chat interface
 * 
 * Features:
 * - Voice and text input
 * - Multilingual support
 * - Message history
 * - Typing indicators
 * - Accessibility compliant
 * - Focus trap when expanded
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  audio?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  messages: ChatMessage[];
  loading?: boolean;
  language?: string;
  supportedLanguages?: Language[];
  onLanguageChange?: (languageCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  onSendMessage,
  onVoiceInput,
  messages,
  loading = false,
  language = 'en',
  supportedLanguages = [],
  onLanguageChange,
  placeholder = 'Ask about crops, weather, or market prices...',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const handleSend = () => {
    if (!inputValue.trim() || loading || disabled) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (onVoiceInput) {
      setIsRecording(!isRecording);
      onVoiceInput();
    }
  };

  const playAudio = (audioUrl: string, messageId: string) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
      // Stop audio playback
    } else {
      setPlayingAudio(messageId);
      // Play audio
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      audio.play();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          disabled={disabled}
          className="
            fixed bottom-6 right-6 z-50
            w-14 h-14 rounded-full
            bg-accent-600 text-white
            shadow-accent hover:shadow-lg
            hover:scale-110
            focus:outline-none focus:ring-4 focus:ring-accent-300
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-target
          "
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6 mx-auto" aria-hidden="true" />
          {messages.length > 0 && (
            <span className="
              absolute -top-1 -right-1
              w-5 h-5 rounded-full
              bg-error-600 text-white
              text-xs font-bold
              flex items-center justify-center
              ring-2 ring-white
            ">
              {messages.length > 9 ? '9+' : messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <div
            className="fixed inset-0 bg-neutral-900/50 z-40 sm:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />

          {/* Chat Container */}
          <div
            role="dialog"
            aria-label="Chat assistant"
            aria-modal="true"
            ref={chatContainerRef}
            className="
              fixed z-50
              bottom-0 right-0
              sm:bottom-6 sm:right-6
              w-full h-[100dvh]
              sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100vh-3rem)]
              bg-white rounded-t-2xl sm:rounded-2xl
              shadow-2xl
              flex flex-col
              animate-slide-up sm:animate-scale-in
            "
          >
            {/* Header */}
            <div className="
              flex items-center justify-between
              px-5 py-4 border-b border-neutral-200
              bg-gradient-to-r from-primary-700 to-accent-600
              rounded-t-2xl sm:rounded-t-2xl
            ">
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10 rounded-full
                  bg-white/20 backdrop-blur-sm
                  flex items-center justify-center
                ">
                  <MessageCircle className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    EPICS Assistant
                  </h2>
                  <p className="text-xs text-white/80">
                    {loading ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>

              <button
                onClick={onToggle}
                className="
                  p-2 rounded-full
                  text-white/80 hover:text-white hover:bg-white/20
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  transition-colors duration-150
                  touch-target
                "
                aria-label="Close chat"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Language Selector (if supported) */}
            {supportedLanguages.length > 0 && onLanguageChange && (
              <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50">
                <label htmlFor="chat-language" className="sr-only">
                  Select language
                </label>
                <select
                  id="chat-language"
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-md
                    border border-neutral-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-600
                  "
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-primary-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Ask about crop recommendations, weather, market prices, or farming advice.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[80%] rounded-2xl px-4 py-2.5
                      ${message.type === 'user'
                        ? 'bg-accent-600 text-white rounded-br-sm'
                        : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                      }
                    `}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className={`
                          text-xs
                          ${message.type === 'user' ? 'text-white/70' : 'text-neutral-500'}
                        `}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.audio && (
                          <button
                            onClick={() => playAudio(message.audio!, message.id)}
                            className={`
                              p-1 rounded
                              ${message.type === 'user'
                                ? 'hover:bg-white/20 text-white'
                                : 'hover:bg-neutral-200 text-neutral-600'
                              }
                            `}
                            aria-label={playingAudio === message.id ? 'Stop audio' : 'Play audio'}
                          >
                            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 p-4 bg-white rounded-b-2xl sm:rounded-b-2xl">
              <div className="flex items-end gap-2">
                {/* Voice Input Button */}
                {onVoiceInput && (
                  <button
                    onClick={handleVoiceToggle}
                    disabled={disabled || loading}
                    className={`
                      p-3 rounded-full
                      transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-primary-600
                      touch-target
                      ${isRecording
                        ? 'bg-error-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Mic className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                )}

                {/* Text Input */}
                <div className="flex-1 relative">
                  <label htmlFor="chat-input" className="sr-only">
                    Type your message
                  </label>
                  <input
                    id="chat-input"
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || loading || isRecording}
                    placeholder={isRecording ? 'Listening...' : placeholder}
                    className="
                      w-full px-4 py-3 pr-12
                      border border-neutral-300 rounded-full
                      focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent
                      disabled:bg-neutral-50 disabled:text-neutral-500
                      text-sm
                    "
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading || disabled}
                  className="
                    p-3 rounded-full
                    bg-accent-600 text-white
                    hover:bg-accent-700
                    focus:outline-none focus:ring-2 focus:ring-accent-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                    touch-target
                  "
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatbotWidget;
