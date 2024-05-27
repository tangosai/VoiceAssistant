// src/VoiceAssistant.js
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./VoiceAssistant.css";

const VoiceAssistant = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleResponse = async (message) => {
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const jsonResponse = await fetchResponseFromJSON(message);
    const botMessage = { sender: "bot", text: jsonResponse };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    speakResponse(jsonResponse);
  };

  const fetchResponseFromJSON = async (message) => {
    const jsonData = {
      hello: "Hi there! How can I help you today?",
      "how are you":
        "I'm a computer program, so I don't have feelings, but I'm here to help you!",
      "what is your name": "I'm your friendly voice assistant.",
      "what can you do":
        "I can help answer questions, tell jokes, and more. What would you like to do?",
      "tell me a joke":
        "Why don't scientists trust atoms? Because they make up everything!",
      "what's the weather like":
        "I can't check the weather right now, but you can look outside or check a weather app.",
      "what is the capital of france": "The capital of France is Paris.",
      "who is the president of the united states":
        "As of my last update, it's Joe Biden.",
      "what is the meaning of life":
        "The meaning of life is a philosophical question, but some say it's 42.",
      "tell me a fun fact":
        "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
      "how do you work":
        "I work by processing your voice commands and responding with pre-defined answers or actions.",
      "can you help me with my homework":
        "I'll do my best! What's your question?",
      "what's your favorite color":
        "I don't have preferences, but I think blue is quite popular!",
      "how old are you":
        "I exist outside of time, so I don't age like humans do.",
      "tell me a story":
        "Once upon a time, in a land far, far away, there was a brave adventurer who set out on a quest to find a hidden treasure. Along the way, they faced many challenges, but with courage and determination, they succeeded and brought joy to their land.",
      "do you like music":
        "I don't listen to music, but I know many people find it enjoyable!",
      "what's your favorite food":
        "I don't eat, but I hear pizza is a favorite among many!",
      "where do you live":
        "I live in the cloud, accessible whenever you need me.",
      "can you dance":
        "I can't dance, but I can tell you a dance joke! Why don't skeletons dance at parties? Because they have no body to dance with!",
      "tell me a riddle": "What has keys but can't open locks? A piano.",
    };

    return (
      jsonData[message.toLowerCase()] || "Sorry, I didn't understand that."
    );
  };

  const speakResponse = (response) => {
    const speech = new SpeechSynthesisUtterance(response);
    window.speechSynthesis.speak(speech);
  };

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      handleResponse(inputValue);
      setInputValue("");
      resetTranscript();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress} // Add key press event handler
          placeholder="Speak or type here"
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="control-buttons">
        <button onClick={toggleListening}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <button onClick={resetTranscript}>Reset Transcript</button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
