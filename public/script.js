const socket = io();
const username = prompt("Enter your username:");

if (username) {
  socket.emit('join', username);
}

const usersList = document.getElementById('users-list');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendGroupBtn = document.getElementById('sendGroup');
const sendPrivateBtn = document.getElementById('sendPrivate');

// Update user list
socket.on('user-list', (users) => {
  usersList.innerHTML = users
    .map((user) => `<li>${user}</li>`)
    .join('');
});

// Handle group messages
sendGroupBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('group-message', message);
    messageInput.value = '';
  }
});

socket.on('group-message', ({ user, message }) => {
  messagesDiv.innerHTML += `<div><strong>${user}:</strong> ${message}</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Handle private messages
sendPrivateBtn.addEventListener('click', () => {
  const to = prompt("Enter the recipient's username:");
  const message = messageInput.value.trim();
  if (to && message) {
    socket.emit('private-message', { to, message });
    messageInput.value = '';
  }
});

socket.on('private-message', ({ from, message }) => {
  messagesDiv.innerHTML += `<div><strong>Private from ${from}:</strong> ${message}</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
