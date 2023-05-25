import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
// const SOCKET_SERVER_URL = "http://localhost:4000/";
const SOCKET_SERVER_URL = 'https://hms-server.herokuapp.com/graphql';

export default function ChatRoom (roomId) {
  const [userMessage, setuserMessage] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setuserMessage((userMessage) => [...userMessage, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const senduserMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { userMessage, senduserMessage };
};

