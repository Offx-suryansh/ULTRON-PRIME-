let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("hello sir, what can I help you with?");
    }
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Suryansh Sharma");
    }
    else if (message.includes("open youtube")) {
        speak("opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    }
    else if (message.includes("open google")) {
        speak("opening Google...");
        window.open("https://google.com/", "_blank");
    }
    else if (message.includes("open facebook")) {
        speak("opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    }
    else if (message.includes("open instagram")) {
        speak("opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    }
    else if (message.includes("open calculator")) {
        speak("opening calculator...");
        window.open("calculator://");
    }
    else if (message.includes("open whatsapp")) {
        speak("opening WhatsApp...");
        window.open("whatsapp://");
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(time);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(date);
    }
    // Custom "Who is" responses
    else if (message.includes("who is vansh")) {
        speak("It's a very known friend of Suryansh sir");
    }
    else if (message.includes("who is sanjay")) {
        speak("It's a very known friend of Suryansh sir");
    }
    else if (message.includes("who is rajan")) {
        speak("It's a very known friend of Suryansh sir");
    }
    else if (message.includes("who is vinayak")) {
        speak("It's a very known friend of Suryansh sir");
    }
    else if (message.includes("who is sagarpreet")) {
        speak("It's a very known friend of Suryansh sir");
    }
    else if (message.includes("who is tushar")) {
        speak("It's a very known friend of Suryansh sir");
    }
    // Default: search on Google
    else {
        let finalText = "This is what I found on the internet regarding " + message.replace("ultronprime", "").replace("shifra", "");
        speak(finalText);
        window.open(`https://www.google.com/search?q=${message.replace("ultronprime", "")}`, "_blank");
    }
}
