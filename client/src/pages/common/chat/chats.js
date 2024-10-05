import { Col, Divider, Flex, Row, Typography } from "antd";
import { getChatInstanceByUserId } from "../../../services/api";
import { useEffect, useState } from "react";
import { useSession } from "../../../context/session-provider";
import { DataLoader } from "../data-loader";
import FriendThread from "../../../components/common/chat/friend-thread";
import { Link, Outlet } from "react-router-dom";
import io from "socket.io-client";

const Chats = () => {
  const { Title, Text } = Typography;
  const { session, setSession } = useSession();
  const [chats, setChats] = useState([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [errorFetchingChats, setIsErrorFetchingChats] = useState(false);

  const getAllChatsOfUser = () => {
    setIsFetchingChats(true);
    getChatInstanceByUserId(session?._id)
      .then((res) => {
        console.log("ress", res);
        setChats(res?.data);
        setIsFetchingChats(false);
      })
      .catch((err) => {
        setIsFetchingChats(false);
        setIsErrorFetchingChats(true);
      });
  };

  const getFriendData = (user1, user2) => {
    return user1._id !== session._id ? user1 : user2;
  };

  useEffect(() => {
    session?._id && getAllChatsOfUser();
  }, [session?._id]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [refetchChats, setRefetchChats] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:4000", {
      transports: ["websocket"], // Force the use of WebSocket (optional)
      withCredentials: true,
    });
    setSocket(socketInstance);

    socketInstance.emit("joinChat", { userId: session?._id });
    socketInstance.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on("newMessage", ({ senderId, message }) => {
      setMessages((prev) => [...prev, { senderId, message }]);
      setRefetchChats(true);
    });

    socketInstance.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setRefetchChats(true);
    });

    return () => {
      socketInstance.disconnect();
      socketInstance.off("receiveMessage");
    };
  }, [session?._id]);

  return (
    <div className="m-2 p-2 rounded-md border h-[85vh]">
      <Row className="w-full">
        <Col span={6} className="border-r h-[85vh]">
          <Flex vertical className="p-2">
            <Title level={4}>Chats</Title>
            {isFetchingChats ? (
              <DataLoader />
            ) : errorFetchingChats ? (
              "Error"
            ) : (
              <Flex vertical gap={5}>
                {chats?.length === 0
                  ? ""
                  : [...chats]?.map((chat) => {
                      return (
                        <Link to={`./${chat._id}`}>
                          <FriendThread
                            data={getFriendData(chat.user1Id, chat.user2Id)}
                            isFriendOnline={onlineUsers?.includes(
                              getFriendData(chat.user1Id, chat.user2Id)?._id
                            )}
                          />
                        </Link>
                      );
                    })}
              </Flex>
            )}
          </Flex>
        </Col>
        <Col span={18} className="h-[85vh] p-2">
          <Outlet context={{ socket, refetchChats, setRefetchChats }} />
        </Col>
      </Row>
    </div>
  );
};

export default Chats;
