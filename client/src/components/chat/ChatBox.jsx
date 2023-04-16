import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { fetchRecipientUser } from "../../hooks/fetchRecipientUser";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage
  } = useContext(ChatContext);
  const { recipientUser } = fetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser) return (
    <p style={{ textAlign: "center", width: "100%" }}>
      No conversation selected yet...
    </p>
  );

  if (isMessagesLoading) return (
    <p style={{ textAlign: "center", width: "100%" }}>
      Loading chat...
    </p>
  );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages && messages.map((message, index) => {
          return (
            <Stack
              key={index}
              className={`${message?.senderId === user?._id
                ? 'message self align-self-end flex-grow-0'
                : 'message align-self-start flex-grow-0'}`}
              ref={scroll}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          );
        })}
      </Stack>
      <Stack
        direction="horizontal"
        gap={3}
        className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)">
        </InputEmoji>
        <button
          className="send-btn"
          onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-white" />
        </button>
      </Stack>
    </Stack>
  );
}

export default ChatBox;