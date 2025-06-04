import API_BASE_URL from '@/lib/config';

export async function handleQA(question: string) {
  const user_id = localStorage.getItem('userId');
  const chat_session_id = localStorage.getItem('chatSessionId');
  const response = await fetch(`${API_BASE_URL}chatbot/qa/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question, chat_session_id, user_id })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'QA request failed');
  }
  console.log('QA response: ', data);
  localStorage.setItem('chatSessionId', data.chat_session_id);
  localStorage.setItem('questionId', data.question_id);
  return data.answer;
}

export async function handleSaveEditedMessage(
  chat_session_id: string,
  qa_id: string,
  new_answer: string
) {
  const response = await fetch(`${API_BASE_URL}chatbot/qa/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ chat_session_id, qa_id, new_answer })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save edited answer');
  }
  console.log('Updated QA response: ', data);
  return data;
}

export async function getChatHistory(user_id: string) {
  const response = await fetch(`${API_BASE_URL}chatbot/all-chat-session/${user_id}/`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch chat session ID');
  }
  console.log('Chat session ID: ', data);
  localStorage.setItem('chatHistory', data);
  return data;
}

export async function getQAFromChatSessionId(chat_session_id: string) {
  const response = await fetch(`${API_BASE_URL}chatbot/qa-pairs/${chat_session_id}/`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch QA data');
  }
  console.log('QA data from chat session: ', data);
  return data;
}