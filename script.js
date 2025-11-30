class FridayVirtualAssistant {
    constructor() {
        this.isAwake = false;
        this.isListening = false;
        this.recognition = null;
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        
        this.initializeElements();
        this.initializeVoiceRecognition();
        this.initializeEventListeners();
        this.startSystemMonitoring();
        this.updateDateTime();
        this.simulateWeather();
    }

    initializeElements() {
        // Main elements
        this.assistantFace = document.getElementById('assistantFace');
        this.mouth = document.getElementById('mouth');
        this.voiceWave = document.getElementById('voiceWave');
        this.commandDisplay = document.getElementById('commandDisplay');
        this.commandText = document.getElementById('commandText');
        this.statusDisplay = document.getElementById('status');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.weatherDisplay = document.getElementById('weather');

        // Buttons
        this.wakeBtn = document.getElementById('wakeBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettings = document.getElementById('closeSettings');

        // Settings
        this.settingsPanel = document.getElementById('settingsPanel');
        this.voiceGender = document.getElementById('voiceGender');
        this.speechRate = document.getElementById('speechRate');
        this.wakeWord = document.getElementById('wakeWord');
        this.themeSelect = document.getElementById('themeSelect');
        this.languageSelect = document.getElementById('languageSelect');

        // System monitor
        this.cpuUsage = document.getElementById('cpuUsage');
        this.memoryUsage = document.getElementById('memoryUsage');
        this.networkStatus = document.getElementById('networkStatus');

        // Audio
        this.wakeSound = document.getElementById('wakeSound');
        this.notificationSound = document.getElementById('notificationSound');
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = (this.languageSelect && this.languageSelect.value) || 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateStatus('Listening...');
                this.voiceWave.classList.add('active');
                this.voiceBtn.classList.add('active');
                this.showCommand('I\'m listening...');
            };

            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                this.showCommand(transcript);

                if (event.results[0].isFinal) {
                    this.processVoiceCommand(transcript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.voiceWave.classList.remove('active');
                this.voiceBtn.classList.remove('active');
                this.updateStatus('Ready');
                this.showCommand('Sorry, I didn\'t catch that. Please try again.');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.voiceWave.classList.remove('active');
                this.voiceBtn.classList.remove('active');
                if (this.isAwake) {
                    this.updateStatus('Ready');
                }
            };
            // Update recognition language if user changes it
            if (this.languageSelect) {
                this.languageSelect.addEventListener('change', (e)=>{
                    this.recognition.lang = e.target.value;
                });
            }
        } else {
            this.showCommand('Voice recognition is not supported in your browser.');
        }
    }

    initializeEventListeners() {
        // Wake button
        this.wakeBtn.addEventListener('click', () => this.toggleWakeState());

        // Voice command button
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());

        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsPanel());

        // Quick commands
        document.querySelectorAll('.command-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.currentTarget.dataset.command;
                this.executeQuickCommand(command);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === ' ') {
                e.preventDefault();
                this.toggleWakeState();
            }
            if (e.key === 'Escape') {
                this.closeSettingsPanel();
            }
        });

        // Wake word detection (simulated)
        this.setupWakeWordDetection();
    }

    toggleWakeState() {
        this.isAwake = !this.isAwake;
        
        if (this.isAwake) {
            this.wakeUp();
        } else {
            this.sleep();
        }
    }

    wakeUp() {
        this.isAwake = true;
        this.wakeBtn.classList.add('active');
        this.updateStatus('Online');
        this.showCommand('Hello! Friday at your service. How can I help you?');
        this.playSound(this.wakeSound);
        this.speak('Friday activated and ready to assist you.');
        
        // Animate face
        this.assistantFace.style.animation = 'float 6s ease-in-out infinite';
    }

    sleep() {
        this.isAwake = false;
        this.wakeBtn.classList.remove('active');
        this.updateStatus('Offline');
        this.showCommand('Friday going to sleep. Say "Wake up" or click the power button.');
        this.speak('Goodbye! Friday going to sleep.');
        
        // Stop animations
        this.assistantFace.style.animation = 'none';
        this.mouth.classList.remove('talking');
    }

    toggleVoiceRecognition() {
        if (!this.isAwake) {
            this.showCommand('Please wake me up first!');
            return;
        }

        if (!this.recognition) {
            this.showCommand('Voice recognition not available.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    processVoiceCommand(command) {
        if (!this.isAwake) return;

        const lowerCommand = command.toLowerCase();
        this.showCommand(`You said: ${command}`);
        this.updateStatus('Processing...');

        // Simulate processing delay
        setTimeout(() => {
            let response = this.generateResponse(lowerCommand);
            this.showCommand(response);
            this.speak(response);
            this.updateStatus('Ready');
        }, 1000);
    }

    executeQuickCommand(command) {
        if (!this.isAwake) {
            this.showCommand('Please wake me up first!');
            return;
        }

        const responses = {
            time: () => {
                const now = new Date();
                return `Current time is ${now.toLocaleTimeString()}`;
            },
            date: () => {
                const now = new Date();
                return `Today is ${now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}`;
            },
            weather: () => {
                return this.getWeatherUpdate();
            },
            joke: () => {
                const jokes = [
                    "Why don't scientists trust atoms? Because they make up everything!",
                    "Why did the scarecrow win an award? He was outstanding in his field!",
                    "Why don't eggs tell jokes? They'd crack each other up!",
                    "What do you call a fake noodle? An impasta!"
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            },
            news: () => {
                return "Here are the latest headlines: [Simulated News Feed] Technology advances in AI continue to revolutionize virtual assistants.";
            },
            calculate: () => {
                return "Calculator mode activated. Please say a math problem like 'What is 15 plus 27?'";
            }
        };

        if (responses[command]) {
            const response = responses[command]();
            this.showCommand(response);
            this.speak(response);
        }
    }

    generateResponse(command) {
        // Time commands
        if (command.includes('time')) {
            return `The current time is ${new Date().toLocaleTimeString()}`;
        }

        // Date commands
        if (command.includes('date')) {
            return `Today is ${new Date().toLocaleDateString()}`;
        }

        // Weather commands
        if (command.includes('weather')) {
            return this.getWeatherUpdate();
        }

        // Calculation commands
        if (command.includes('calculate') || command.includes('what is') || command.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
            return this.solveMathProblem(command);
        }

        // Greeting commands
        if (command.includes('hello') || command.includes('hi')) {
            return "Hello! Friday here. How can I assist you today?";
        }

        // Default response
        const defaultResponses = [
            "I understand you said: " + command + ". How can I help with that?",
            "Interesting command! I'm still learning, but I'll do my best to assist.",
            "I've processed your request. Is there anything specific you'd like me to do?",
            "Command received. Friday is here to help!"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    solveMathProblem(command) {
        try {
            // Extract numbers and operator
            const mathMatch = command.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
            if (mathMatch) {
                const [, num1, operator, num2] = mathMatch;
                let result;
                
                switch (operator) {
                    case '+': result = parseInt(num1) + parseInt(num2); break;
                    case '-': result = parseInt(num1) - parseInt(num2); break;
                    case '*': result = parseInt(num1) * parseInt(num2); break;
                    case '/': result = parseInt(num1) / parseInt(num2); break;
                    default: return "I can only handle basic arithmetic operations.";
                }
                
                return `The answer is ${result}`;
            }
            return "Please provide a math problem like '15 plus 27'";
        } catch (error) {
            return "Sorry, I couldn't solve that math problem.";
        }
    }

    getWeatherUpdate() {
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
        const temperatures = ['72°F', '68°F', '75°F', '70°F', '65°F'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = temperatures[Math.floor(Math.random() * temperatures.length)];
        
        return `Current weather: ${condition}, ${temp}. Perfect day for productivity!`;
    }

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        this.mouth.classList.add('talking');
        
        const utterance = new SpeechSynthesisUtterance(text);
        // Set language for TTS according to user setting
        utterance.lang = (this.languageSelect && this.languageSelect.value) || 'en-US';
        utterance.rate = parseFloat(this.speechRate.value);
        utterance.pitch = 1;
        utterance.volume = 1;

        // Voice gender selection
        const voices = this.synth.getVoices();
        const preferredVoice = this.voiceGender.value === 'female' ? 
            // prefer voice in current selected language
            (voices.find(voice => (voice.lang || '').startsWith(utterance.lang) && /female/i.test(voice.name)) ||
            voices.find(voice => (voice.lang || '').startsWith(utterance.lang) && /female/i.test(voice.name)) ||
            voices.find(voice => (voice.lang || '').startsWith(utterance.lang))) :
            (voices.find(voice => (voice.lang || '').startsWith(utterance.lang) && /male/i.test(voice.name)) ||
            voices.find(voice => (voice.lang || '').startsWith(utterance.lang)) ||
            voices[0]);

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            this.mouth.classList.add('talking');
        };

        utterance.onend = () => {
            this.mouth.classList.remove('talking');
        };

        this.synth.speak(utterance);
    }

    showCommand(text) {
        this.commandText.textContent = text;
        this.commandDisplay.style.animation = 'none';
        setTimeout(() => {
            this.commandDisplay.style.animation = 'pulse 0.5s ease';
        }, 10);
    }

    updateStatus(status) {
        this.statusDisplay.textContent = status;
    }

    updateDateTime() {
        setInterval(() => {
            const now = new Date();
            this.currentTimeDisplay.textContent = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }, 1000);
    }

    simulateWeather() {
        setInterval(() => {
            this.weatherDisplay.textContent = this.getWeatherUpdate().split(': ')[1];
        }, 30000); // Update every 30 seconds
    }

    startSystemMonitoring() {
        setInterval(() => {
            // Simulate system monitoring
            this.cpuUsage.style.width = `${Math.floor(Math.random() * 30) + 20}%`;
            this.memoryUsage.style.width = `${Math.floor(Math.random() * 40) + 30}%`;
            this.networkStatus.style.width = `${Math.floor(Math.random() * 10) + 90}%`;
        }, 2000);
    }

    setupWakeWordDetection() {
        // Simulated wake word detection
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F' && e.ctrlKey) {
                e.preventDefault();
                if (!this.isAwake) {
                    this.wakeUp();
                }
            }
        });
    }

    openSettings() {
        this.settingsPanel.classList.add('active');
    }

    closeSettingsPanel() {
        this.settingsPanel.classList.remove('active');
    }

    playSound(audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Initialize Friday when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load voices for speech synthesis
    window.speechSynthesis.onvoiceschanged = () => {
        window.friday = new FridayVirtualAssistant();
    };

    // Fallback initialization
    setTimeout(() => {
        if (!window.friday) {
            window.friday = new FridayVirtualAssistant();
        }
    }, 1000);
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);