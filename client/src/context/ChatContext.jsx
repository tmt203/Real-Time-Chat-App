import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  

  // INIT Socket
  useEffect(() => {
    // Create Socket client connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Run FIRST, if dependencies array change or the component unmounts
    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  // ADD ONLINE USERS
  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', user?._id);
    socket.on('getOnlineUsers', (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off('getOnlineUsers');
    };

  }, [socket]);

  // SEND MESSAGE
  useEffect(() => {
    if (socket == null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

  // RECEIVE MESSAGE AND NOTIFICATION
  useEffect(() => {
    if (socket === null) return;

    socket.on('getMessage', (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off('getMessage');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log('Error fetching users!', response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u?._id) return false;

        isChatCreated = userChats?.some((chat) =>
          chat.members[0] === u._id || chat.members[1] === u._id
        );

        return !isChatCreated;
      });

      setPotentialChats(pChats);

    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    }

    getMessages();
  }, [currentChat]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log('Error creating chat!', response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback(async (
    textMessage,
    sender,
    currentChatId,
    setTextMessage
  ) => {
    if (!textMessage) return console.log('You must type something!');

    const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage
    }));

    if (response.error) {
      return setSendTextMessageError(response);
    }

    setNewMessage(response);
    setMessages((prev) => [...prev, response]);
    setTextMessage("");

  }, []);

  return (<ChatContext.Provider value={{
    userChats,
    isUserChatsLoading,
    userChatsError,
    potentialChats,
    createChat,
    updateCurrentChat,
    currentChat,
    messages,
    isMessagesLoading,
    messagesError,
    sendTextMessage,
    onlineUsers
  }}>
    {children}
  </ChatContext.Provider>);
}