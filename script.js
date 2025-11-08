const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voice = document.querySelector("#voice");

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-IN"; // Changed to proper Hindi locale
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("शुभ प्रभात सर");
    }
    else if (hours >= 12 && hours < 16) {
        speak("शुभ दोपहर सर");
    } else {
        speak("शुभ संध्या सर");
    }
}
window.addEventListener('load', () => {
    wishMe();
});

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

recognition.continuous = false;
recognition.lang = 'hi-IN';

recognition.onstart = () => {
    voice.style.display = "block";
    btn.style.display = "none";
};

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    voice.style.display = "none";
    btn.style.display = "flex";
    speak("क्षमा करें, मैं आपकी आवाज नहीं सुन पा रहा हूं");
};

recognition.onend = () => {
    voice.style.display = "none";
    btn.style.display = "flex";
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});
function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";
    
    // Basic commands
    if (message.includes("hello") || message.includes("hey") || message.includes("हैलो") || message.includes("नमस्ते")) {
        speak("नमस्ते, मैं आपकी कैसे मदद कर सकता हूं?");
    }
    else if (message.includes("who are you") || message.includes("तुम कौन हो")) {
        speak("मैं एक आभासी सहायक हूं, जिसे आयुष सर ने बनाया है");
    }
    
    // Time and Date commands
    else if (message.includes("time") || message.includes("समय")) {
        const time = new Date().toLocaleString('hi-IN', {hour: "numeric", minute: "numeric"});
        speak("वर्तमान समय है " + time);
    }
    else if (message.includes("date") || message.includes("तारीख")) {
        const date = new Date().toLocaleString('hi-IN', {day: "numeric", month: "long", year: "numeric"});
        speak("आज की तारीख है " + date);
    }
    
    // Website opening commands
    else if (message.includes("open youtube") || message.includes("यूट्यूब खोलो")) {
        speak("यूट्यूब खोल रहा हूं");
        window.open("https://youtube.com/", "_blank");
    }
    else if (message.includes("open google") || message.includes("गूगल खोलो")) {
        speak("गूगल खोल रहा हूं");
        window.open("https://google.com/", "_blank");
    }
    else if (message.includes("open facebook") || message.includes("फेसबुक खोलो")) {
        speak("फेसबुक खोल रहा हूं");
        window.open("https://facebook.com/", "_blank");
    }
    else if (message.includes("open instagram") || message.includes("इंस्टाग्राम खोलो")) {
        speak("इंस्टाग्राम खोल रहा हूं");
        window.open("https://instagram.com/", "_blank");
    }
    
    // App opening commands
    else if (message.includes("open calculator") || message.includes("कैलकुलेटर खोलो")) {
        speak("कैलकुलेटर खोल रहा हूं");
        window.open("calculator://");
    }
    else if (message.includes("open whatsapp") || message.includes("व्हाट्सएप खोलो")) {
        speak("व्हाट्सएप खोल रहा हूं");
        window.open("whatsapp://");
    }
    
    // Default search handler
    else {
        const searchQuery = message
            .replace("friday", "")
            .replace("फ्राइडे", "")
            .trim();
        const finalText = "मैं इंटरनेट पर " + searchQuery + " के बारे में खोज रहा हूं";
        speak(finalText);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
    }
}
