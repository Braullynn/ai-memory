import React from 'react';
import ChatWindow from './components/ChatWindow/ChatWindow';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ChatWindow />
    </ThemeProvider>
  );
}

export default App;
