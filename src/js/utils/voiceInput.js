export class VoiceInput {
    constructor(searchInput, searchCallback) {
        this.searchInput = searchInput;
        this.searchCallback = searchCallback;
        this.recognition = null;
        this.isListening = false;

        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech recognition is not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateMicrophoneButton(true);
        };

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            this.searchInput.value = transcript;
            
            // Only trigger search on final result
            if (event.results[0].isFinal) {
                this.stopListening();
                this.searchCallback();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    toggleListening() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition || this.isListening) return;

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.stopListening();
        }
    }

    stopListening() {
        if (!this.recognition || !this.isListening) return;

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Failed to stop recognition:', error);
        }
        
        this.isListening = false;
        this.updateMicrophoneButton(false);
    }

    updateMicrophoneButton(isListening) {
        const micButton = document.querySelector('.mic-btn');
        if (micButton) {
            micButton.classList.toggle('listening', isListening);
            micButton.innerHTML = `<i class="fas fa-microphone${isListening ? '-slash' : ''}"></i>`;
        }
    }
}