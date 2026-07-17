const chatToggle = document.getElementById('chat-toggle');
const toggleIcon = document.getElementById('toggle-icon');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (chatWindow.classList.contains('hidden')) {
        toggleIcon.className = 'fas fa-comment-dots text-2xl';
        chatToggle.classList.remove('rotate-90');
    } else {
        toggleIcon.className = 'fas fa-times text-2xl';
        chatInput.focus();
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    appendMessage(messageText, 'user');
    chatInput.value = '';

    await getAIResponse(messageText);
});

function appendMessage(text, sender) {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-2 animate-message ${sender === 'user' ? 'justify-end space-x-reverse' : ''}`;

    const botAvatar = `
        <div class="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <i class="fas fa-robot text-xs"></i>
        </div>
    `;
    const userAvatar = `
        <div class="w-8 h-8 bg-gradient-to-tr from-slate-400 to-slate-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <i class="fas fa-user text-xs"></i>
        </div>
    `;

    messageDiv.innerHTML = `
        ${sender === 'user' ? userAvatar : botAvatar}
        <div class="${sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'} p-3.5 rounded-2xl shadow-sm max-w-[80%]">
            <p class="text-sm leading-relaxed">${text}</p>
            <span class="text-[9px] ${sender === 'user' ? 'text-blue-200' : 'text-slate-400'} block mt-1.5 text-right font-medium">${time}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

async function getAIResponse(userMessage) {
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        typingIndicator.classList.add('hidden');
        appendMessage(data.reply, 'bot');

    } catch (error) {
        console.error("Erreur :", error);
        typingIndicator.classList.add('hidden');
        appendMessage("Oups, une petite coupure de courant... Assure-toi que ton serveur est bien lancé en local !", "bot");
    }
}

function scrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}
