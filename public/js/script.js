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
// ========== NOTIFICATION SYSTEM ==========
document.addEventListener('DOMContentLoaded', () => {
  const bell = document.getElementById('notificationBell');
  const dropdown = document.getElementById('notificationDropdown');
  const badge = document.getElementById('notificationBadge');
  const list = document.getElementById('notificationList');
  const markAllBtn = document.getElementById('markAllReadBtn');

  if (!bell) return; // not logged in

  // Fetch unread count and update badge
  async function updateBadge() {
    try {
      const res = await fetch('/notifications/count');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      if (data.count > 0) {
        badge.textContent = data.count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    } catch (e) {
      // silently fail if not logged in
    }
  }

  // Fetch all notifications and render in dropdown
  async function loadNotifications() {
    try {
      const res = await fetch('/notifications');
      if (!res.ok) throw new Error('Failed');
      const notifications = await res.json();
      if (notifications.length === 0) {
        list.innerHTML = '<div style="padding:15px; text-align:center; color:rgba(255,255,255,0.5);">Aucune notification</div>';
      } else {
        list.innerHTML = notifications.map(n => `
          <div class="notif-item ${!n.is_read ? 'unread' : ''}" data-id="${n.id}" style="padding:10px 15px; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition: background 0.2s; ${!n.is_read ? 'border-left:3px solid #7c3aed;' : ''}">
            ${n.link ? `<a href="${n.link}" style="color:#c084fc; text-decoration:none;">${n.message}</a>` : `<span style="color:white;">${n.message}</span>`}
            <div style="font-size:0.7rem; color:rgba(255,255,255,0.4); margin-top:4px;">${new Date(n.created_at).toLocaleString()}</div>
          </div>
        `).join('');
        
        // Add click listeners to mark individual notifications as read
        document.querySelectorAll('.notif-item.unread').forEach(item => {
          item.addEventListener('click', async function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            await fetch(`/notifications/${id}/read`, { method: 'POST' });
            this.classList.remove('unread');
            this.style.borderLeft = 'none';
            updateBadge();
          });
        });
      }
    } catch (e) {
      list.innerHTML = '<div style="padding:15px; text-align:center; color:rgba(255,255,255,0.5);">Erreur de chargement</div>';
    }
  }

  // Toggle dropdown
  bell.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      loadNotifications();
    }
  });

  // Mark all as read
  if (markAllBtn) {
    markAllBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await fetch('/notifications/read-all', { method: 'POST' });
      loadNotifications();
      updateBadge();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notificationContainer')) {
      dropdown.style.display = 'none';
    }
  });

  // Initial badge check, then refresh every 60 seconds
  updateBadge();
  setInterval(updateBadge, 60000);
});