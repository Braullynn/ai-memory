// (caso queira expor endpoints /memory para debug ou limpeza)
import axios from 'axios';
import { API_URL } from './config';

export async function clearMemory() {
  await axios.delete(`${API_URL}/memory`);
}