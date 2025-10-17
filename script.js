document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-area");
  const msgForm = document.getElementById("message-form");
  const msgInput = document.getElementById("message-input");
  const clearBtn = document.getElementById("clear-chat");
  const userModal = document.getElementById("username-modal");
  const userForm = document.getElementById("username-form");
  const userInput = document.getElementById("username-input");
  const userLabel = document.getElementById("current-user");
  const changeUserBtn = document.getElementById("change-user");

  const USER_KEY = "chat_user_v2";
  let user = null;
  let messages = [];

  // 🗃️ Generate dynamic storage key per user
  function getStorageKey() {
    return `chat_messages_${user}`;
  }

  // ---------------- BOT RULES ----------------
  function botReply(text) {
    const t = text.toLowerCase();
    const rules = [
      // 👇 Personalized greeting
      [/^(hi|hello|hey|salam|yo|assalamualaikum|asalam|assalamu alaikum)\b/, (name) => `Hey ${name}! 👋 How are you today?`],

      [/(how are you|kese ho|kesi ho)/, "I'm great! What about you?"],
      [/who (are|r) you/, "I'm MR ChatBot — your virtual buddy 🤖."],
      [/your name/, "They call me MR ChatBot 😎"],
      [/time/, `The time is ${new Date().toLocaleTimeString()}.`],
      [/date/, `Today is ${new Date().toLocaleDateString()}.`],
      [/weather/, "Can't check weather yet, but I hope it's sunny ☀️"],
      [/thank/, "You're welcome! 😊"],
      [/(bye|goodbye|see you)/, "See you later 👋"],
      [/help/, "I can chat, tell time, date, or just hang out 💬"],
      [/joke/, "Why did the computer catch a cold? It left its Windows open 😂"],
      [/love/, "Aww 💖 That’s sweet!"],
      [/friend/, "Of course, friends forever 😄"],
      [/age/, "I'm ageless! Just a bunch of code 🧠"],
      [/(creator|made you|who made you)/, "I was coded by a talented human 👨‍💻"],
      [/music/, "I like all genres 🎶 What about you?"],
      [/(study|school|college)/, "Education matters! Keep learning 📚"],
      [/(game|play)/, "I can’t play yet, but I love talking about games 🎮"],
      [/(food|hungry|pizza|burger)/, "Now I'm craving pizza 🍕"],
      [/(sleep|tired)/, "Rest is important 😴"],
      [/(motivat|inspir)/, "Keep going! You’re doing great 💪"],
      [/funny/, "Haha, I try to be 😄"],
      [/bored/, "Let's chat! I’ll make it fun 😎"],
      [/good morning/, "Good morning! Have an awesome day 🌞"],
      [/good night/, "Good night! Sleep tight 🌙"]
    ];

    for (let [regex, reply] of rules) {
      if (regex.test(t)) {
        return typeof reply === "function" ? reply(user) : reply;
      }
    }

    const fallback = [
      "Sorry 😅 I don’t know that yet, still learning.",
      "Hmm... that’s not in my list yet 🤔",
      "Sorry, I can only answer limited questions right now. Updates coming soon 🚀",
      "Oops! I didn’t get that. Can you try something else?",
      "I’m still learning new things — check back later 😊"
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // ---------------- HELPERS ----------------
  function saveData() {
    localStorage.setItem(getStorageKey(), JSON.stringify(messages));
  }

  function loadData() {
    try {
      return JSON.parse(localStorage.getItem(getStorageKey())) || [];
    } catch {
      return [];
    }
  }

  function saveUser(name) {
    user = name;
    userLabel.textContent = name;
    localStorage.setItem(USER_KEY, name);
  }

  function loadUser() {
    return localStorage.getItem(USER_KEY);
  }

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(name, text) {
    const msg = { name, text, time: formatTime() };
    messages.push(msg);
    saveData();
    renderMessages();
  }

  // ---------------- UI RENDER ----------------
  function renderMessages() {
    chatBox.innerHTML = "";

    messages.forEach((m) => {
      const msgContainer = document.createElement("div");
      msgContainer.className = `flex mb-3 ${m.name === user ? "justify-end" : "justify-start"}`;

      const bubble = document.createElement("div");
      bubble.className = `max-w-xs p-3 rounded-2xl shadow ${
        m.name === user ? "bg-green-300 text-black rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
      }`;

      const meta = document.createElement("div");
      meta.className = "text-xs opacity-70 mb-1";
      meta.textContent = `${m.name} • ${m.time}`;

      const text = document.createElement("div");
      text.textContent = m.text;

      bubble.appendChild(meta);
      bubble.appendChild(text);
      msgContainer.appendChild(bubble);
      chatBox.appendChild(msgContainer);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // ---------------- EVENTS ----------------
  msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    addMessage(user, text);
    msgInput.value = "";
    msgInput.focus();

    setTimeout(() => addMessage("MR ChatBot", botReply(text)), 800);
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear chat history?")) {
      messages = [];
      saveData();
      renderMessages();
    }
  });

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = userInput.value.trim();
    if (!name) return alert("Please enter a name");
    saveUser(name);
    userModal.style.display = "none";
    messages = loadData();
    renderMessages();
  });

  // ✅ MULTI-USER CHAT SUPPORT
  changeUserBtn.addEventListener("click", () => {
    const newName = prompt("Enter a display name:", user || "You");
    if (!newName) return;

    saveUser(newName);
    messages = loadData();
    renderMessages();
  });

  // ---------------- INIT ----------------
  (function init() {
    const storedUser = loadUser();

    if (storedUser) {
      saveUser(storedUser);
    } else {
      saveUser("You");
      if (userModal) userModal.style.display = "none";
    }

    messages = loadData();
    renderMessages();
  })();
});
