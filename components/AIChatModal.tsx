'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AIChatModal.module.css';
import { fetchAIResponse } from '@/lib/ai-assistant';

interface AIChatModalProps {
  livePrice: string;
  sentimentLabel: string;
  realBurned: number;
  userBalance: number;
}

export default function AIChatModal({ livePrice, sentimentLabel, realBurned, userBalance }: AIChatModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am ZNTC AI. How can I help you navigate the Base ecosystem today?' }
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userPrompt }]);
    setMessages((prev) => [...prev, { role: 'assistant', content: 'Analyzing Base on-chain data...' }]);

    try {
      const contextData = { livePrice, sentiment: sentimentLabel, burned: realBurned, userBalance };
      const aiResponse = await fetchAIResponse(userPrompt, contextData);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: aiResponse };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Error connecting to AI core.' };
        return updated;
      });
    }
  };

  return (
    <>
      <div className={styles.aiFab} onClick={() => setIsOpen(!isOpen)}>
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'}`}></i>
      </div>

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <span>
              <i className={`fa-solid fa-robot ${styles.chatHeaderIcon}`}></i> ZNTC AI ASSISTANT
            </span>
            <i className="fa-solid fa-chevron-down" style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)}></i>
          </div>

          <div ref={chatContainerRef} className={styles.messagesContainer}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className={styles.chatForm}>
            <input
              type="text"
              placeholder="Ask AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitBtn}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
