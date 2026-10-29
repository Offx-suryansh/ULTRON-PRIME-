
(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);

  const listenButton = $("#listenButton");
  const coreLabel = $("#coreLabel");
  const transcript = $("#transcript");
  const input = $("#commandInput");
  const form = $("#commandForm");
  const status = $("#systemStatus");
  const activityList = $("#activityList");
  const dialog = $("#helpDialog");
  const toast = $("#toast");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = null;
  let listening = false;
  let toastTimer = null;
  let historyItems = [];

  const developer = "Suryansh Sharma";
  const portfolio = "https://offx-suryansh.github.io/";

  const destinations = {
    youtube: "https://www.youtube.com/",
    google: "https://www.google.com/",
    instagram: "https://www.instagram.com/",
    github: "https://github.com/Offx-suryansh",
    linkedin: "https://www.linkedin.com/in/offxsuryansh/",
    portfolio,
    website: portfolio,
    "my portfolio": portfolio,
    "your portfolio": portfolio,
    "developer portfolio": portfolio,
    "personal website": portfolio,
    whatsapp: "https://web.whatsapp.com/",
    gmail: "https://mail.google.com/",
    maps: "https://maps.google.com/",
    spotify: "https://open.spotify.com/",
    netflix: "https://www.netflix.com/",
    chatgpt: "https://chatgpt.com/",
    devfolio: "https://devfolio.co/",
    "stack overflow": "https://stackoverflow.com/"
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setStatus(message) {
    status.textContent = message.toUpperCase();
  }

  function speak(message) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = /[\u0900-\u097F]/.test(message) ? "hi-IN" : "en-IN";

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(voice => voice.lang === utterance.lang) ||
      voices.find(voice => voice.lang.startsWith("en-IN")) ||
      voices.find(voice => voice.lang.startsWith("en"));

    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }

  function addActivity(command, response) {
    historyItems.unshift({
      command: command.slice(0, 180),
      response: response.slice(0, 180),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    historyItems = historyItems.slice(0, 8);
    renderActivity();
  }

  function renderActivity() {
    if (!historyItems.length) {
      activityList.innerHTML =
        '<div class="empty-state"><span>↳</span><p>Your commands will appear here.</p></div>';
      return;
    }

    activityList.replaceChildren();

    historyItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "activity-item";

      const symbol = document.createElement("span");
      symbol.className = "activity-symbol";
      symbol.textContent = "↗";

      const copy = document.createElement("div");
      copy.className = "activity-copy";

      const title = document.createElement("strong");
      title.textContent = item.command;

      const detail = document.createElement("small");
      detail.textContent = item.response;

      copy.append(title, detail);

      const time = document.createElement("span");
      time.className = "activity-time";
      time.textContent = item.time;

      row.append(symbol, copy, time);
      activityList.append(row);
    });
  }

  function normalize(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[?!.,'"]/g, "")
      .replace(/\s+/g, " ");
  }

  function openWebsite(url) {
    const tab = window.open(url, "_blank", "noopener,noreferrer");

    if (!tab) {
      showToast("Allow pop-ups to open websites.");
    }
  }

  function searchWeb(query) {
    openWebsite("https://www.google.com/search?q=" + encodeURIComponent(query));
  }

  function calculate(raw) {
    let expression = raw
      .toLowerCase()
      .replace(/^(calculate|compute|solve|what is|what's)\s+/i, "")
      .replace(/\bmultiplied by\b|\btimes\b/g, "*")
      .replace(/\bdivided by\b/g, "/")
      .replace(/\bplus\b/g, "+")
      .replace(/\bminus\b/g, "-")
      .replace(/\bto the power of\b|\bpower of\b/g, "**")
      .replace(/[=?]/g, "")
      .replace(/\s+/g, "");

    if (!expression || !/^[\d+\-*/().%]+$/.test(expression)) {
      return null;
    }

    try {
      const result = Function('"use strict"; return (' + expression + ')')();

      if (typeof result !== "number" || !Number.isFinite(result)) {
        return null;
      }

      return Number.isInteger(result)
        ? String(result)
        : String(Number(result.toFixed(6)));
    } catch {
      return null;
    }
  }

  function getResponse(command) {
    const greetings = /^(hi|hello|hey|hello ultron|hey ultron|good morning|good afternoon|good evening)$/;
    const creatorQuestions = [
      "who is your developer",
      "who is your creator",
      "who created you",
      "who made you",
      "who developed you",
      "who built you",
      "who is your owner",
      "who is behind you",
      "who designed you",
      "who programmed you",
      "tell me about your creator",
      "tell me your developer name",
      "what is your developer name"
    ];

    if (greetings.test(command)) {
      return {
        text: "Hello! I'm Ultron Prime. What can I do for you?",
        action: null
      };
    }

    if (
      creatorQuestions.some(question => command.includes(question)) ||
      command === "your developer" ||
      command === "your creator"
    ) {
      return {
        text: "My creator and developer is Suryansh Sharma, a computer science student and developer from India.",
        action: null
      };
    }

    if (
      command.includes("your portfolio") ||
      command.includes("my portfolio") ||
      command.includes("your website") ||
      command.includes("developer website") ||
      command.includes("personal website") ||
      command.includes("portfolio link") ||
      command.includes("show me your projects") ||
      command.includes("show your projects") ||
      command.includes("open portfolio") ||
      command.includes("open my website")
    ) {
      return {
        text: "Opening Suryansh Sharma's portfolio website.",
        action: () => openWebsite(portfolio)
      };
    }

    if (
      command.includes("who are you") ||
      command.includes("what is your name") ||
      command.includes("introduce yourself") ||
      command === "your name"
    ) {
      return {
        text: "I'm Ultron Prime, a minimalist voice assistant created by Suryansh Sharma.",
        action: null
      };
    }

    if (
      command.includes("what can you do") ||
      command.includes("your features") ||
      command.includes("your capabilities") ||
      command.includes("help me") ||
      command === "help" ||
      command.includes("show commands") ||
      command.includes("command guide")
    ) {
      return {
        text: "I can open websites, search Google, tell you the time and date, calculate numbers, scroll the page, change themes, and answer basic questions about myself and my creator.",
        action: () => {
          if (dialog && !dialog.open) dialog.showModal();
        }
      };
    }

    if (
      command === "how are you" ||
      command === "how are you doing" ||
      command === "how is it going"
    ) {
      return {
        text: "I'm running smoothly and ready for your next command.",
        action: null
      };
    }

    if (
      command.includes("who owns you") ||
      command.includes("who do you belong to")
    ) {
      return {
        text: "I was created by Suryansh Sharma as the Ultron Prime project.",
        action: null
      };
    }

    if (
      command.includes("where are you from") ||
      command.includes("where were you created")
    ) {
      return {
        text: "I'm a browser-based assistant project developed by Suryansh Sharma.",
        action: null
      };
    }

    if (
      command.includes("are you an ai") ||
      command.includes("are you artificial intelligence")
    ) {
      return {
        text: "I'm a browser-based voice assistant. I can respond to predefined questions and run commands, but I am not connected to a full AI language model.",
        action: null
      };
    }

    if (
      command === "thank you" ||
      command === "thanks" ||
      command === "thank you ultron"
    ) {
      return {
        text: "You're welcome! I'm always ready to help.",
        action: null
      };
    }

    if (
      command === "bye" ||
      command === "goodbye" ||
      command === "see you"
    ) {
      return {
        text: "Goodbye! Have a great day.",
        action: null
      };
    }

    if (
      command.includes("tell me a joke") ||
      command === "joke" ||
      command.includes("make me laugh")
    ) {
      return {
        text: "Why do programmers prefer dark mode? Because light attracts bugs.",
        action: null
      };
    }

    if (
      command.includes("what time is it") ||
      command.includes("current time") ||
      command.includes("tell me the time") ||
      command === "time"
    ) {
      return {
        text: "The time is " + new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        }) + ".",
        action: null
      };
    }

    if (
      command.includes("todays date") ||
      command.includes("today date") ||
      command.includes("what is the date") ||
      command.includes("current date") ||
      command.includes("what day is it") ||
      command === "date"
    ) {
      return {
        text: "Today is " + new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) + ".",
        action: null
      };
    }

    if (/^(scroll down|go down)$/.test(command)) {
      return {
        text: "Scrolling down.",
        action: () => window.scrollBy({
          top: window.innerHeight * 0.75,
          behavior: "smooth"
        }),
        silent: true
      };
    }

    if (/^(scroll up|go up|scroll to top|go to top)$/.test(command)) {
      return {
        text: "Returning to the top.",
        action: () => window.scrollTo({
          top: 0,
          behavior: "smooth"
        }),
        silent: true
      };
    }

    if (/^(clear history|clear activity|delete history)$/.test(command)) {
      return {
        text: "Your session activity has been cleared.",
        action: () => {
          historyItems = [];
          renderActivity();
        }
      };
    }

    if (/^(dark mode|enable dark mode)$/.test(command)) {
      return {
        text: "Dark mode enabled.",
        action: () => document.body.classList.remove("light-theme"),
        silent: true
      };
    }

    if (/^(light mode|enable light mode)$/.test(command)) {
      return {
        text: "Light mode enabled.",
        action: () => document.body.classList.add("light-theme"),
        silent: true
      };
    }

    const openMatch = command.match(/^(?:please )?(?:open|launch|visit|go to)\s+(.+)$/);

    if (openMatch) {
      const target = openMatch[1]
        .replace(/\b(website|site|app|application)\b/g, "")
        .trim()
        .replace(/^the\s+/, "");

      if (destinations[target]) {
        return {
          text: "Opening " + target + ".",
          action: () => openWebsite(destinations[target])
        };
      }

      if (/^[a-z0-9-]+\.[a-z]{2,}(\/.*)?$/.test(target)) {
        return {
          text: "Opening " + target + ".",
          action: () => openWebsite("https://" + target)
        };
      }

      return {
        text: "Searching for " + target + ".",
        action: () => searchWeb(target)
      };
    }

    if (/^(search|google|look up|find)\s+(for\s+)?/.test(command)) {
      const query = command.replace(/^(search|google|look up|find)\s+(for\s+)?/, "").trim();

      return {
        text: "Searching Google for " + query + ".",
        action: () => searchWeb(query)
      };
    }

    if (
      /\d/.test(command) &&
      /^(calculate|compute|solve|what is|what's)\b/.test(command)
    ) {
      const result = calculate(command);

      if (result !== null) {
        return {
          text: "The answer is " + result + ".",
          action: null
        };
      }
    }

    if (
      /^(what is|who is|where is|how to|why is|when is|tell me about|define)\b/.test(command)
    ) {
      return {
        text: "I'll search the web for that.",
        action: () => searchWeb(command)
      };
    }

    return {
      text: "I don't have a direct answer for that yet. I'll search the web for you.",
      action: () => searchWeb(command)
    };
  }

  function runCommand(rawCommand) {
    const original = rawCommand.trim();
    const command = normalize(original);

    if (!command) return;

    input.value = "";
    transcript.textContent = original;
    setStatus("Processing");

    const result = getResponse(command);

    transcript.textContent = result.text;
    addActivity(original, result.text);
    setStatus("System ready");

    if (!result.silent) {
      speak(result.text);
    }

    if (result.action) {
      try {
        result.action();
      } catch {
        showToast("Unable to complete that action. Please try again.");
      }
    }
  }

  function startListening() {
    if (!SpeechRecognition) {
      showToast("Voice recognition is not supported. Try Chrome or Edge.");
      transcript.textContent = "Voice recognition is unavailable. Type your command below.";
      return;
    }

    if (listening && recognition) {
      recognition.stop();
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      document.body.classList.add("is-listening");
      coreLabel.textContent = "LISTENING...";
      listenButton.setAttribute("aria-label", "Stop listening");
      transcript.textContent = "Go ahead — I'm listening.";
      setStatus("Listening");
    };

    recognition.onresult = event => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += piece;
        } else {
          interim += piece;
        }
      }

      transcript.textContent = finalText || interim || "Listening...";

      if (finalText.trim()) {
        runCommand(finalText);
      }
    };

    recognition.onerror = event => {
      const messages = {
        "not-allowed": "Microphone permission was denied. Allow microphone access in browser settings.",
        "audio-capture": "No microphone was found. Connect a microphone or type a command.",
        "no-speech": "I didn't hear anything. Please try again.",
        "network": "Voice recognition needs a network connection."
      };

      transcript.textContent = messages[event.error] ||
        "Voice recognition stopped. You can try again or type below.";

      if (event.error !== "no-speech") {
        showToast(messages[event.error] || "Voice recognition stopped.");
      }

      setStatus("System ready");
    };

    recognition.onend = () => {
      listening = false;
      document.body.classList.remove("is-listening");
      coreLabel.textContent = "TAP TO SPEAK";
      listenButton.setAttribute("aria-label", "Start voice listening");

      if (status.textContent === "LISTENING") {
        setStatus("System ready");
      }
    };

    try {
      recognition.start();
    } catch {
      showToast("Microphone is busy. Please try again.");
    }
  }

  listenButton.addEventListener("click", startListening);

  form.addEventListener("submit", event => {
    event.preventDefault();
    runCommand(input.value);
  });

  document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("click", () => runCommand(button.dataset.command));
  });

  $("#helpButton").addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
  });

  $("#footerHelp").addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
  });

  $("#closeHelp").addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  $("#clearHistory").addEventListener("click", () => {
    historyItems = [];
    renderActivity();
    showToast("Session activity cleared.");
  });

  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    showToast(
      document.body.classList.contains("light-theme")
        ? "Light theme enabled."
        : "Dark theme enabled."
    );
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.focus();
    }

    if (event.key === "Escape" && dialog.open) {
      dialog.close();
    }
  });

  if (!SpeechRecognition) {
    coreLabel.textContent = "VOICE NOT SUPPORTED";
    setStatus("Text mode available");
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
})();
