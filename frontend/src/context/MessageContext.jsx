import React, { createContext, useContext, useState } from 'react';
import {MessageContainer} from "../components/MessageContainer.jsx";

const MessageContext = createContext(undefined);

export const MessageProvider = ({children}) => {
    const [messages, setMessages] = useState([]);

    const addMessage = (message, type = "success", duration = 3000) => {
        // TODO: .substr() is deprecated
        const id = Math.random().toString(36).substr(2, 9);
        setMessages((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeMessage = (id) => {
        setMessages((prev) => prev.filter((message) => message.id !== id));
    };

    return (
        <MessageContext.Provider value={{ addMessage, removeMessage }}>
            {children}
            <MessageContainer messages={messages} />
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};

