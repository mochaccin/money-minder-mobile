import axios from 'axios';
import { Card } from '../models/data';


const userId = "6752261b020cfec6c361f005"
const API_BASE_URL = 'http://192.168.100.2:3000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCards = async (): Promise<Card[]> => {
  try {
    const response = await api.get<Card[]>(`/users/${userId}/cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const addCard = async (cardData: Omit<Card, '_id' | 'spends'>): Promise<Card> => {
    try {
      const response = await api.post<{ InsertedID: string }>('/cards', cardData);
      const cardId = response.data.InsertedID;
  
      const cardWithUser = await addCardToUser(cardId); 
  
      return cardWithUser;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };
  
  export const addCardToUser = async (cardId: string): Promise<Card> => {
    try {
      const response = await api.post<Card>(`/users/${userId}/cards`, { cardId });
      return response.data;
    } catch (error) {
      console.error('Error adding card to user:', error);
      throw error;
    }
  };

export const fetchCardDetails = async (cardId: string): Promise<Card> => {
  try {
    const response = await api.get<Card>(`/cards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error;
  }
};

