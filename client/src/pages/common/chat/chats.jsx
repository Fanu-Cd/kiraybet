import { Col, Divider, Empty, Flex, Row, Typography } from "antd";
import {
  getChatInstanceByUserId,
  updateChatMessageById,
} from "../../../services/api";
import { useEffect, useState } from "react";
import { useSession } from "../../../context/session-provider";
import { DataLoader } from "../data-loader";
import FriendThread from "../../../components/common/chat/friend-thread";
import { Link, Outlet, useParams } from "react-router-dom";
import io from "socket.io-client";
import FetchError from "../../../components/common/fetchError";

const Chats = () => {
  const { Title, Text } = Typography;
  const { session, setSession } = useSession();
  const [chats, setChats] = useState([]);
  const [finalChats, setFinalChats] = useState([]);

  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [errorFetchingChats, setIsErrorFetchingChats] = useState(false);

  const getAllChatsOfUser = () => {
    setIsFetchingChats(true);
    getChatInstanceByUserId(session?._id)
      .then((res) => {
        setChats(res?.data);
        setFinalChats(res?.data);
        setIsFetchingChats(false);
      })
      .catch((err) => {
        setIsFetchingChats(false);
        setIsErrorFetchingChats(true);
      });
  };

  const getFriendData = (user1, user2) => {
    return user1?._id !== session._id ? user1 : user2;
  };

  useEffect(() => {
    session?._id && getAllChatsOfUser();
  }, [session?._id]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

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

    socketInstance.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketInstance.on("messageRead", ({ chatId }) => {
      console.log('chatId',chatId);
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === chatId?.chatId ? { ...msg, isRead: true } : msg
        )
      );
    });

    socketInstance.on("messageDeleted", ({ chatId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === chatId?.chatId ? { ...msg, isDeleted: true } : msg
        )
      );
    });

    socketInstance.on(
      "displayTyping",
      ({ senderId: sender, receiverId: receiver }) => {
        if (receiver === session?._id) {
          setIsOtherUserTyping(true);
        }
      }
    );

    // Listen for the stop typing event
    socketInstance.on(
      "hideTyping",
      ({ senderId: sender, receiverId: receiver }) => {
        if (receiver === session?._id) {
          setIsOtherUserTyping(false);
        }
      }
    );

    return () => {
      socketInstance.disconnect();
      socketInstance.off("receiveMessage");
      socketInstance.off("displayTyping");
      socketInstance.off("hideTyping");
      socketInstance.off("messageDeleted");
      socketInstance.off("messageRead");
    };
  }, [session?._id]);

  const { id } = useParams();

  return (
    <div className="p-2 rounded-md border h-[80vh]">
      <Row className="w-full">
        <Col span={6} className="h-[80vh] overflow-auto">
          <Flex vertical className="p-2 h-full">
            <Title level={4}>Chats</Title>
            {isFetchingChats ? (
              <DataLoader />
            ) : errorFetchingChats ? (
              <FetchError description={'Error Fetching Messages'} />
            ) : (
              <Flex vertical gap={5}>
                {finalChats?.length === 0 ? (
                  <Empty description="No Chats" />
                ) : (
                  [...finalChats]?.map((chat) => {
                    return (
                      <Link to={`./${chat._id}`} className="h-auto my-1">
                        <FriendThread
                          data={getFriendData(chat.user1Id, chat.user2Id)}
                          isFriendOnline={onlineUsers?.includes(
                            getFriendData(chat.user1Id, chat.user2Id)?._id
                          )}
                          unReadCount={finalChats?.filter(chat=>chat.user1Id)?.length}
                          isActiveChat={chat?._id === id}
                        />
                      </Link>
                    );
                  })
                )}
              </Flex>
            )}
          </Flex>
        </Col>
        <Col span={18} className="h-[80vh] p-2">
          {finalChats?.length === 0 && (
            <Title level={4} className="h-[2rem] w-full text-center">
              Messages
            </Title>
          )}
          {finalChats?.length === 0 ? (
            <Flex justify="center" align="center" vertical className="h-full">
              <Empty description="Please start a chat to view messages" />
            </Flex>
          ) : (
            <Outlet
              context={{
                socket,
                messages,
                setMessages,
                isOtherUserTyping,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Chats;
