import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { DEMO_MODE, getDemoChatbotReply } from '../config/demoData';
import { useLanguage } from '../contexts/LanguageContext';

const languageLabels = {
  te: 'Telugu',
  hi: 'Hindi',
  en: 'English'
};

const buildContextSummary = (context = {}) => {
  const parts = [];
  if (context.state) parts.push(`State: ${context.state}`);
  if (context.district) parts.push(`District: ${context.district}`);
  if (context.soil_type) parts.push(`Soil Type: ${context.soil_type}`);
  if (context.season) parts.push(`Season: ${context.season}`);
  if (context.top_crops?.length) parts.push(`Top crops: ${context.top_crops.join(', ')}`);
  if (context.temperature) parts.push(`Temperature: ${context.temperature}°C`);
  if (context.humidity) parts.push(`Humidity: ${context.humidity}%`);
  
  const contextInfo = parts.length
    ? `IMPORTANT CONTEXT - Use this information when responding:\n${parts.join(' • ')}\n\nCRITICAL INSTRUCTIONS:\n- DO NOT ask the user for soil type or season - these are already known from the context above.\n- ONLY ask for the crop name if the user's question requires crop-specific information (like fertilizers, pesticides, etc.).\n- If the user asks about fertilizers, pesticides, or crop-specific advice, ask: "Which crop are you asking about?"\n- Use the soil type and season from context automatically.`
    : 'Respond as an agronomy copilot.';
  
  return contextInfo;
};

const Chatbot = ({ userContext = {}, language }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeakNext, setAutoSpeakNext] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const langCode = useMemo(() => {
    if (language === 'te') return 'te-IN';
    if (language === 'hi') return 'hi-IN';
    return 'en-IN';
  }, [language]);

  const contextMessage = useMemo(() => buildContextSummary(userContext), [userContext]);

  useEffect(() => {
    const greeting = t('chatbot.greeting');
    setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
    setChatHistory([
      { role: 'system', content: contextMessage },
      { role: 'assistant', content: greeting }
    ]);
  }, [contextMessage, t]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const speak = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text, opts = { viaVoice: false }) => {
    if (!text.trim() || isSending) return;
    const content = text.trim();
    const userMessage = { role: 'user', content };
    setMessages((prev) => [...prev, { ...userMessage, timestamp: new Date() }]);
    const historyWithUser = [...chatHistory, userMessage];
    setChatHistory(historyWithUser);
    setInputValue('');
    setIsSending(true);
    if (opts.viaVoice) setAutoSpeakNext(true);

    try {
      let assistantResponse = null;
      let assistantAudio = null;

      if (DEMO_MODE) {
        assistantResponse = getDemoChatbotReply({
          language,
          history: historyWithUser,
          context: userContext
        });
      } else {
        const response = await fetch('http://localhost:5001/chatbot/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            language,
            history: historyWithUser,
            context: userContext
          })
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Chatbot failed');
        }
        assistantResponse = data.response_text;
        assistantAudio = data.audio_response;
      }

      if (assistantResponse) {
        const assistantMessage = { role: 'assistant', content: assistantResponse, audio: assistantAudio };
        setMessages((prev) => [...prev, { ...assistantMessage, timestamp: new Date() }]);
        setChatHistory((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);

        if (opts.viaVoice || autoSpeakNext) {
          if (assistantAudio) {
            const audio = new Audio(`data:audio/mp3;base64,${assistantAudio}`);
            audio.play();
          } else {
            speak(assistantResponse);
          }
          setAutoSpeakNext(false);
        }
      }
    } catch (error) {
      const fallback = { role: 'assistant', content: `⚠️ ${error.message || 'Network error'}` };
      setMessages((prev) => [...prev, { ...fallback, timestamp: new Date() }]);
      setChatHistory((prev) => [...prev, { role: fallback.role, content: fallback.content }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }
    
    if (typeof window === 'undefined') {
      const warning = { role: 'assistant', content: 'Voice recognition is not available in this environment.' };
      setMessages((prev) => [...prev, { ...warning, timestamp: new Date() }]);
      return;
    }
    
    // Check for SpeechRecognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      const warning = { 
        role: 'assistant', 
        content: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice input.' 
      };
      setMessages((prev) => [...prev, { ...warning, timestamp: new Date() }]);
      setChatHistory((prev) => [...prev, { role: warning.role, content: warning.content }]);
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = langCode;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          setInputValue(transcript);
          sendMessage(transcript, { viaVoice: true });
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        recognitionRef.current = null;
        
        let errorMessage = 'Voice recognition error. Please try again.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone not found. Please check your microphone settings.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
        }
        
        const errorMsg = { role: 'assistant', content: errorMessage };
        setMessages((prev) => [...prev, { ...errorMsg, timestamp: new Date() }]);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setIsListening(false);
      const errorMsg = { 
        role: 'assistant', 
        content: 'Failed to start voice recognition. Please try again or type your message.' 
      };
      setMessages((prev) => [...prev, { ...errorMsg, timestamp: new Date() }]);
    }
  };

  const languageLabel = languageLabels[language] || 'English';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-24"
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-6 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/80">Multilingual Copilot</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Agri Voice Assist</h2>
          <p className="text-sm text-white/80">Respond in {languageLabel}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">🤖</div>
      </div>

      <div className="h-[420px] space-y-4 overflow-y-auto bg-slate-50 px-4 py-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center text-cyan-600">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow
                ${isUser ? 'rounded-tr-none bg-cyan-500 text-white' : 'rounded-tl-none bg-white text-gray-800'}`}
              >
                <p>{msg.content}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                  {msg.audio && (
                    <button
                      onClick={() => {
                        const audio = new Audio(`data:audio/mp3;base64,${msg.audio}`);
                        audio.play();
                      }}
                      className="inline-flex items-center gap-1 text-cyan-600"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Play
                    </button>
                  )}
                  <span>{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white px-4 py-5">
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
        >
          <div className="relative flex-1">
            <input
              className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 pr-24 text-sm font-medium text-slate-600 shadow-lg placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
              placeholder={t('chatbot.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="absolute right-1 top-1 inline-flex items-center rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
            >
              {isSending ? (
                <span className="animate-pulse text-xs font-semibold">...</span>
              ) : (
                <>
                  Send <Send className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleVoice}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-cyan-100 shadow-lg ${
              isListening ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;

