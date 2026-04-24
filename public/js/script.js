// Navbar scroll effect
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Chat widget toggle and basic messaging
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function toggleChat(open) {
  if (!chatPanel) return;
  chatPanel.classList.toggle('open', open);
  chatPanel.setAttribute('aria-hidden', String(!open));
  if (open && chatInput) {
    chatInput.focus();
  }
}

function addChatMessage(message, sender) {
  if (!chatMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchChatResponse(message) {
  const response = await fetch('https://equipment-mammary-revoke.ngrok-free.dev/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message })   // ✅ fixed field name
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Adjust based on your actual backend response
  // Try data.reply, data.answer, or data.response – check with curl
  return data.reply || data.answer || data.response || "No reply field found";
}

async function handleChatSubmit(event) {
  if (!chatInput) return;
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage(message, 'user');
  chatInput.value = '';

  addChatMessage('Thinking...', 'assistant');
  const thinkingBubble = chatMessages.lastElementChild;

  try {
    const reply = await fetchChatResponse(message);
    if (thinkingBubble) {
      thinkingBubble.textContent = reply;
      thinkingBubble.className = 'chat-bubble assistant';
    }
  } catch (error) {
    if (thinkingBubble) {
      thinkingBubble.textContent = 'Unable to reach the chat backend. Check your connection or ngrok URL.';
      thinkingBubble.className = 'chat-bubble assistant';
    }
  }
}

if (chatToggle && chatPanel) {
  chatToggle.addEventListener('click', () => toggleChat(true));
}

if (chatClose && chatPanel) {
  chatClose.addEventListener('click', () => toggleChat(false));
}

if (chatForm) {
  chatForm.addEventListener('submit', handleChatSubmit);
}

if (chatInput) {
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleChat(false);
    }
  });
}
