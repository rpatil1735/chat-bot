import './style.css';
import Chatbot from '../src/chatbot';

class ChatApp {
  constructor() {
    this.chatbot = new Chatbot();
    this.messagesContainer = document.getElementById('chat-messages');
    this.messageInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');
    
    this.initializeEventListeners();
    this.addWelcomeMessage();
  }

  initializeEventListeners() {
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSendMessage();
      }
    });
  }

  addWelcomeMessage() {
    this.addMessage('👋 Hello! I\'m your AI assistant powered by DeepSeek R1. How can I help you today?', 'bot');
  }

  async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    this.addMessage(message, 'user');
    this.messageInput.value = '';
    this.setInputDisabled(true);

    // Show typing indicator
    const typingElement = this.addTypingIndicator();

    try {
      const response = await this.chatbot.sendMessage(message);
      this.removeTypingIndicator(typingElement);
      this.addMessage(response, 'bot');
    } catch (error) {
      this.removeTypingIndicator(typingElement);
      this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      console.error('Chat error:', error);
    } finally {
      this.setInputDisabled(false);
      this.messageInput.focus();
    }
  }

  addMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  addTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingElement.appendChild(avatar);
    typingElement.appendChild(typingContent);
    
    this.messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
    
    return typingElement;
  }

  removeTypingIndicator(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  setInputDisabled(disabled) {
    this.messageInput.disabled = disabled;
    this.sendButton.disabled = disabled;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});