import React from 'react';

export default function Message({ message }) {
  const cls = message.role === 'user' ? 'message user' : 'message npc';
  return <li className={cls}>{message.content}</li>;
}