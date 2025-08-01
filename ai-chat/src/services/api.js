import axios from 'axios';
import { API_URL } from './config';

export async function sendMessage(history, message) {
  const res = await axios.post(`${API_URL}/chat`, { history, message });
  return res.data.reply;
}