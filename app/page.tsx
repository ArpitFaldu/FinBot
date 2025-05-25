'use client';

import styles from './styles.module.css';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { from: 'user', text: 'How much should I invest monthly to reach ₹10 lakhs in 5 years?' },
    { from: 'bot', text: 'To reach ₹10 lakhs in 5 years with an expected 12% annual return, you should invest around ₹11,000 per month in a large/mid cap fund!' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Ensure content is scrolled to top on initial load
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input;
  setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
  setInput('');

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMessage }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.error) {
      setMessages((prev) => [...prev, { from: 'bot', text: `Error: ${data.error}` }]);
    } else {
      setMessages((prev) => [...prev, { from: 'bot', text: data.answer }]);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    setMessages((prev) => [...prev, { 
      from: 'bot', 
      text: error instanceof Error ? error.message : 'Network error. Please try again.' 
    }]);
  }
};
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.leftPane}>
        <div className={styles.headerSection}>
          <div className={styles.backgroundWrapper} />
          <div className={styles.overlay} />
          <img
            className={styles.logo}
            src="/finance_logo.jpg"
            alt="FinBot Logo"
            draggable={false}
            width={250}
          />
          <h1 className={styles.brandTitle}>FinBot</h1>
          <p className={styles.subheading}>Your Personal Financial Advisor</p>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.scrollableContent} ref={contentRef}>
            <div className={styles.infoBox}>
              <p><strong>Welcome to FinBot AI</strong> — your smart assistant for personal finance queries!</p>
              
              <p>To get the best answers, try to be specific with your questions:</p>
              <ul>
                <li>"How to save tax legally?"</li>
                <li>"Best SIP plans for beginners?"</li>
                <li>"How to create a monthly budget?"</li>
              </ul>

              <p>
              1. Personal Finance Assistant:
              Helps users with questions about budgeting, saving, investing, and financial planning.
              </p>

              <p>
              2. Instant AI Responses:
              Provides quick, AI-powered answers to a wide range of finance-related queries.
              </p>

              <p>
              3. User-Friendly Chat Interface:
              Simple input box where users type their questions and get immediate replies.
              </p>

              <p>
              4. Conversation History:
              Displays past messages from both user and assistant, making it easy to track the chat flow.
              </p>

              <p>
              5. Auto-Scroll Feature:
              Automatically scrolls chat to the latest message for smooth user experience.
              </p>

              <p>
              6. Informative Left Panel:
              Shows tips, guides, and important financial concepts in an easy-to-read format alongside the chat.
              </p>

              <p>
              7. Attractive Design:
              Uses a visually appealing background with overlay for readability, plus clear fonts and accessible layout.
             </p>

              <p>
              8. Responsive Interaction:
              Supports sending messages by clicking "Send" or pressing "Enter" key.
              </p>

              <p>
              9. Encourages Smart Money Management:
              Motivates users to plan and make informed financial decisions for a stress-free future.
             </p>

              <p><strong>Important Note:</strong> While FinBot provides helpful guidance, financial decisions should consider your personal situation. For critical matters, we recommend consulting a certified financial professional.</p>

              <p>Start chatting on the right side, and let's make smart money moves together!</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.rightPane}>
        <div className={styles.chatBox}>
          <h2>Welcome to FinBot 👋</h2>
          <p className={styles.chatIntro}>
            Ask me anything about personal finance, investments, or budgeting!
          </p>
          <div className={styles.chatArea}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.from === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot}
                aria-live="polite"
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className={styles.inputArea}>
            <textarea
              rows={2}
              className={styles.input}
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Chat input"
            />
            <button
              className={styles.button}
              onClick={sendMessage}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}