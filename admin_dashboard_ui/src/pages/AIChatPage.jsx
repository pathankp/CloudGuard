import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api'; // Assuming default export from api.js

const styles = {
const styles = {
    container: {
        padding: '20px',
        // fontFamily is set globally
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)', // Adjust based on header/footer height, considering margins
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
        color: 'var(--text-color)', // Use theme text color
    },
    chatWindow: {
        // Inherits .morphic-glass-element from className
        flexGrow: 1,
        padding: '15px',
        overflowY: 'auto',
        marginBottom: '15px',
        // backgroundColor is handled by .morphic-glass-element
    },
    message: {
        marginBottom: '10px',
        padding: '10px 15px', // Increased padding
        borderRadius: 'var(--default-border-radius)', // Use theme border radius
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    userMessage: {
        backgroundColor: 'var(--primary-color)', // Use theme primary color
        color: 'white', // Text on primary color is usually white
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    aiMessage: {
        backgroundColor: 'var(--secondary-accent-color)', // Use theme secondary color
        color: 'white', // Text on secondary color
        alignSelf: 'flex-start',
        marginRight: 'auto',
    },
    inputArea: {
        // Inherits .morphic-glass-element from className
        display: 'flex',
        padding: '15px', // Increased padding
        // borderTop is handled by .morphic-glass-element border
    },
    input: {
        flexGrow: 1,
        padding: '12px', // Increased padding
        fontSize: '16px',
        // border, borderRadius from global input styles in App.css
        marginRight: '10px',
    },
    button: {
        padding: '12px 18px', // Increased padding
        fontSize: '16px',
        backgroundColor: 'var(--primary-color)', // Use theme primary color
        // color, border, borderRadius from global button styles in App.css
        cursor: 'pointer',
    },
    error: {
        color: 'red', // Standard error color
        textAlign: 'center',
        marginBottom: '10px',
    }
};

const AIChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatWindowRef = useRef(null);

    // Scroll to bottom of chat window when new messages are added
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/ai/chat/', { message: input });
            const aiReply = { sender: 'ai', text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, aiReply]);
        } catch (err)
            console.error("AI Chat error:", err);
            const errorMessage = err.response?.data?.error || 'Failed to get response from AI. Please try again.';
            setError(errorMessage);
            // Optionally add error message to chat window
            // setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: `Error: ${errorMessage}`, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>AI Assistant Chat</h2>
            {error && <p style={styles.error}>{error}</p>}
            {/* Applying morphic glass to chat window */}
            <div style={styles.chatWindow} ref={chatWindowRef} className="morphic-glass-element">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            ...styles.message, 
                            ...(msg.sender === 'user' ? styles.userMessage : styles.aiMessage),
                            // ...(msg.isError && styles.error) // Optional styling for error messages in chat
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div style={{ ...styles.message, ...styles.aiMessage, fontStyle: 'italic' }}>AI is thinking...</div>}
            </div>
            {/* Applying morphic glass to input area */}
            <div style={styles.inputArea} className="morphic-glass-element">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Type your message..."
                    style={styles.input} // Uses global input styles
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} disabled={isLoading} style={styles.button}> {/* Uses global button styles */}
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default AIChatPage;
