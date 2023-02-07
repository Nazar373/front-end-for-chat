import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = { current: io("http://localhost:3001/") };

export const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.current.on("changeOnline", (usersNumber) => {
      console.log(usersNumber);
      setOnlineUsers(usersNumber);
    });
    return () => {
      socket.current.off("disconnect", currentUser);
    };
  }, []);

  useEffect(() => {
    socket.current.on("showMessage", (data) => {
      setMessageList([...messageList, data]);
    });
  }, [messageList]);

  const handleClick = (e) => {
    e.preventDefault();
    socket.current.emit("addUser", { name: currentUser, id: nanoid() });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.current.emit("newMessage", { name: currentUser, text: message });
    setMessageList([...messageList, { name: currentUser, text: message }]);
  };

  return (
    <>
      <h1>Welcome to chat</h1>
      <p>online: {onlineUsers}</p>
      <p>current user: {currentUser}</p>
      <form>
        <label>
          Enter your name
          <input
          type="text"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.currentTarget.value)}
          />
        </label>
        <button onClick={handleClick}>Send</button>
      </form>
      <form>
        <label>
          Enter your message
          <input
          type="text"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
        </label>
        <button onClick={handleSendMessage}>Send</button>
      </form>

      <ul>
        {console.log('messageList', messageList)}
        {messageList.map(({name, text}, idx) => {
          return <li key={idx}>
            <span>{name}</span>: <span>{text}</span>
          </li>;
        })}
      </ul>
    </>
  );
};
