import { Prompt } from '../types';

const API_URL = 'http://localhost:3001/api';
const ACCESS_CODE = '1234'; // In a real app, this would be managed via session/token

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': ACCESS_CODE,
});

export const api = {
    verifyAccess: async (code: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        const data = await res.json();
        return data.success;
    },

    fetchPrompts: async (): Promise<Prompt[]> => {
        const res = await fetch(`${API_URL}/prompts`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch prompts');
        return res.json();
    },

    createPrompt: async (prompt: Prompt): Promise<Prompt> => {
        const res = await fetch(`${API_URL}/prompts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(prompt),
        });
        if (!res.ok) throw new Error('Failed to create prompt');
        return res.json();
    },

    updatePrompt: async (prompt: Prompt): Promise<Prompt> => {
        const res = await fetch(`${API_URL}/prompts/${prompt.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(prompt),
        });
        if (!res.ok) throw new Error('Failed to update prompt');
        return res.json();
    },

    deletePrompt: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/prompts/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete prompt');
    },
};
