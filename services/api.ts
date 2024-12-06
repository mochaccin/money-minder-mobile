import axios from 'axios';
import { Card, Spend, User } from '../models/data';


export const userId = "67533d546d8a2f335c74e6eb"
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

export const fetchUserSpends = async (userId: string): Promise<Spend[]> => {
  try {
    const response = await api.get<Spend[]>(`/users/${userId}/spends`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user spends:', error);
    throw error;
  }
};

export const fetchCardSpends = async (cardId: string): Promise<Spend[]> => {
  try {
    const response = await api.get<Spend[]>(`/cards/${cardId}/spends`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card spends:', error);
    throw error;
  }
};

export const addSpend = async (spendData: Omit<Spend, 'id'>): Promise<Spend> => {
  try {
    const response = await api.post<Spend>('/spends', spendData);
    return response.data;
  } catch (error) {
    console.error('Error adding spend:', error);
    throw error;
  }
};

export const createSpend = async (spendData: Omit<Spend, 'id'>): Promise<string> => {
  try {
    const response = await api.post<{ InsertedID: string }>('/spends', spendData);
    return response.data.InsertedID;
  } catch (error) {
    console.error('Error creating spend:', error);
    throw error;
  }
};

export const addSpendToUser = async (userId: string, spendId: string): Promise<void> => {
  try {
    await api.post(`/users/${userId}/spends`, { spendId });
  } catch (error) {
    console.error('Error adding spend to user:', error);
    throw error;
  }
};

export const addSpendToCard = async (cardId: string, spendId: string): Promise<void> => {
  try {
    await api.post(`/cards/${cardId}/spends`, { spendId });
  } catch (error) {
    console.error('Error adding spend to card:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  try {
    await api.put(`/users/${userId}/balance`, { newBalance });
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

export const removeSpendFromUser = async (spendId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}/spends`, { data: { spendId } });
  } catch (error) {
    console.error(`Error removing spend ${spendId} from user:`, error);
    throw error;
  }
};

export const removeSpendFromCard = async (
  cardId: string,
  spendId: string
): Promise<void> => {
  try {
    await api.delete(`/cards/${cardId}/spends`, { data: { spendId } });
  } catch (error) {
    console.error(`Error removing spend ${spendId} from card ${cardId}:`, error);
    throw error;
  }
};

export const removeCardFromUser = async (cardId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}/cards`, { data: { cardId } });
  } catch (error) {
    console.error(`Error removing card ${cardId} from user's cards array:`, error);
    throw error;
  }
};


export const deleteSpend = async (spendId: string): Promise<void> => {
  try {
    await api.delete(`/spends/${spendId}`);
  } catch (error) {
    console.error(`Error deleting spend ${spendId}:`, error);
    throw error;
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    await api.delete(`/cards/${cardId}`);
  } catch (error) {
    console.error(`Error deleting card ${cardId}:`, error);
    throw error;
  }
};