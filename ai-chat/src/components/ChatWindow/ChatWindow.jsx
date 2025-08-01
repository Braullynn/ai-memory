import React, { useState, useContext } from 'react';
import axios from 'axios';
import Message from './Message';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../../context/ThemeContext';

export default function ChatWindow() {
  const { theme } = useContext(ThemeContext);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');

  const send = async () => {
    const userMsg = { role: 'user', content: input };
    const newHist = [...history, userMsg];
    setHistory(newHist);
    setInput('');
    const { data } = await axios.post('http://localhost:4000/chat', {
      history: newHist,
      message: input
    });
    setHistory([...newHist, { role: 'assistant', content: data.reply }]);
  };

  return (
    <div className="chat-window">
      <ThemeToggle />
      <ul className="messages">
        {history.map((m, i) => <Message key={i} message={m} />)}
      </ul>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}