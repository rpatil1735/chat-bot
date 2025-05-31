import axios from 'axios';

class Chatbot {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'deepseek/deepseek-r1';
    this.conversationHistory = [];
  }

  
  async sendMessage(message) {
    console.log("apiKey--->",this.apiKey)
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Vite Chatbot App'
        }
      });

      const botMessage = response.data.choices[0].message.content;
      
      // Add bot response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: botMessage
      });

      return botMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default Chatbot;