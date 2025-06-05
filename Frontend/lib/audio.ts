import API_BASE_URL from '@/lib/config';

export default async function sendRequestWithAudio(audioBlob: Blob) {
    const userId = localStorage.getItem('userId') || '';
    const chatSessionId = localStorage.getItem('chatSessionId') || '';
}

export async function textToSpeech(text: string) {
    const response = await fetch(`${API_BASE_URL}chatbot/tts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        throw new Error('Failed to convert text to speech');
    }
    const data = await response.json();
    return data;
}