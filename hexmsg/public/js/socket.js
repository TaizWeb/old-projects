let userid;
let initialScrollHeight;
const socket = io(); // Linking the socket object to the server
function sendMessage() { // Sends a message back to the server
	const chatInput = document.getElementById("chat_input");
	const chatSubmitIcon = document.getElementById("chat_submit_icon");
	let chatInputChars = chatInput.value.toString().split("");
	for (let i = 0; i < chatInputChars.length; i++) {
		if (chatInputChars[i] == " ") chatInputChars[i] = "";
		else break;
	}
	chatInput.value = chatInputChars.join('');
	if (chatInput.value.length < 1000 && chatInput.value.length >= 1) {
		socket.emit("message", chatInput.value);
		chatInput.value = "";
		chatSubmitIcon.classList.remove("filled");
		chatSubmitIcon.classList.add("empty");
	}
	else {
		if (chatInput.value.length > 1000) alert("Messages need to be under 1000 characters!");
	}
}

// Emoji parser, converts :emoji: -> ascii variant
function parseEmoji(text) {
	for (var emoji in availableEmoji) {
		let emojiRegex = new RegExp(":" + emoji + ":", "g");
		text = text.replace(emojiRegex, availableEmoji[emoji]);
	}
	return text;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	const chatInput = document.getElementById("chat_input");
	const chatSubmit = document.getElementById("chat_submit");
	const chatSubmitIcon = document.getElementById("chat_submit_icon");
	initialScrollHeight = document.getElementById("messages").scrollHeight;
	chatSubmit.addEventListener("click", sendMessage); // Sends the message when the submit button is clicked
	chatInput.addEventListener("keydown", (key) => { // Activates when a key is pressed
		if (key.keyCode == 13) sendMessage(); // Checks if the pressed key was the <ENTER> key, if so, it will send the message
	});
	chatInput.addEventListener("keyup", (key) => {
		if (chatInput.value.length == 0) {
			chatSubmitIcon.classList.remove("filled");
			chatSubmitIcon.classList.add("empty");
		} else {
			chatSubmitIcon.classList.remove("empty");
			chatSubmitIcon.classList.add("filled");
		}
	});
});

// Socket Events
socket.on('broadcast', (data) => { // On receiving data from the server, it appends it to the messages body
	const messagesDiv = document.getElementById("messages");
	const oldScrollHeight = messagesDiv.scrollHeight;
	data.text = parseEmoji(data.text);
	if (userid == data.clientid) messagesDiv.innerHTML += `<div class='message sent' style='background-color:${data.color};border-color:${data.color}'><p id='${data.clientid}'>${data.text}</p></div>`; // If the sender was the current client...
	else messagesDiv.innerHTML += `<div class='message' style='background-color:${data.color};border-color:${data.color}'><p id='${data.clientid}'>${data.text}</p></div>`;
	if (messagesDiv.scrollTop == (oldScrollHeight - initialScrollHeight)) messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('bot_message', (data) => {
	const messagesDiv = document.getElementById("messages");
	messagesDiv.innerHTML += data.html;
});

socket.on('startup', (data) => {
	userid = data.userid;
});

socket.on('client_error', (data) => {
	alert("Error: " + data);
});
