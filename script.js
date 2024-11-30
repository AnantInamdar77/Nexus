// script.js
document.getElementById('sendBtn').addEventListener('click', () => {
    const messageBox = document.getElementById('messageBox');
    const messageText = messageBox.value.trim();
  
    if (messageText !== '') {
      const messagesDiv = document.querySelector('.messages');
      const newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.innerHTML = `<span class="username">You:</span> ${messageText}`;
      messagesDiv.appendChild(newMessage);
      messageBox.value = '';
      messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
    }
  });
  