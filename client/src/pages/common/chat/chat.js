import { useParams } from "react-router-dom";
import {
  deleteChatMessageById,
  getChatInstanceById,
  getChatMessageByInstanceId,
  sendFilesAsMessage,
  updateChatMessageById,
} from "../../../services/api";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../../../context/session-provider";
import { DataLoader } from "../data-loader";
import { Button, Empty, Flex, Input, message, Modal, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { TiAttachment } from "react-icons/ti";
import { FaTelegramPlane, FaTrash } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import "./styles.css";
import ChatThread from "../../../components/common/chat/chat-thread";
import { formatDateWithTime } from "../../../utils/formatters";
import FetchError from "../../../components/common/fetchError";
import { MdClose } from "react-icons/md";
const Chat = () => {
  const { id } = useParams();
  const { socket, messages, setMessages, isOtherUserTyping } =
    useOutletContext();
  const { Title, Text } = Typography;
  const { session, setSession } = useSession();
  const [chatInstance, setChatInstance] = useState(null);
  const [chats, setChats] = useState([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [isErrorFetchingChats, setIsErrorFetchingChats] = useState(false);

  useEffect(() => {
    setChats(messages);
  }, [messages]);

  const getChats = () => {
    setIsFetchingChats(true);
    getChatInstanceById(id)
      .then((res) => {
        setChatInstance(res?.data);
        getChatMessageByInstanceId(id)
          .then((res) => {
            setChats(res?.data);
            setMessages(res?.data);
            setIsFetchingChats(false);
            if (chatsRef.current) {
              chatsRef.current.scrollTo({
                top: chatsRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          })
          .catch((err) => {
            setIsFetchingChats(false);
            setIsErrorFetchingChats(true);
          });
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
    id && session?._id && getChats();
  }, [session?._id, id]);

  const [newFiles, setNewFiles] = useState([]);
  const [isNewFilesModalOpen, setIsNewFilesModalOpen] = useState(false);

  const [newText, setNewText] = useState("");
  const chatsRef = useRef(null);

  const onRead = (chatId) => {
    updateChatMessageById(chatId, { isRead: true })
      .then((res) => {
        setMessages(
          messages?.map((chat) => {
            if (chat._id == chatId) {
              return { ...chat, isRead: true };
            }
            return chat;
          })
        );
        socket.emit("messageRead", { chatId });
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  const onDelete = (chatId) => {
    console.log("chatId", chatId);
    deleteChatMessageById(chatId)
      .then((res) => {
        setMessages(
          messages?.map((chat) => {
            if (chat._id == chatId) {
              return { ...chat, isDeleted: true };
            }
            return chat;
          })
        );

        socket.emit("messageDeleted", { chatId });
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  const validateMessage = () => {
    return true;
  };

  const onType = (e) => {
    setNewText(e?.target?.value);
    socket.emit("typing", {
      senderId: session?._id,
      receiverId: getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
        ?._id,
    });

    if (!e?.target?.value) {
      socket.emit("stopTyping", {
        senderId: session?._id,
        receiverId: getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
          ?._id,
      });
    }
  };

  useEffect(() => {
    console.log("isOtherUserTyping", isOtherUserTyping);
  }, [isOtherUserTyping]);

  const handleStopTyping = () => {
    socket.emit("stopTyping", {
      id,
      senderId: session?._id,
      receiverId: getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
        ?._id,
    });
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!validateMessage()) {
      return;
    }

    let newMessage = {
      senderId: session?._id,
      receiverId: getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
        ?._id,
      chatInstanceId: id,
      message: {
        text: newText.trim(),
      },
      isReply: replyToTarget ? true : false,
    };

    if (replyToTarget) newMessage.replyTo = replyToTarget?._id;

    socket.emit("sendMessage", newMessage);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setNewText("");
    setReplyToTarget(null);
  };

  const onSendFiles = () => {
    const formData = new FormData();
    formData.append("senderId", session?._id);
    formData.append("senderId", session?._id);
    formData.append("isReply", replyToTarget ? true : false);
    if (replyToTarget) formData.append("replyTo", replyToTarget?._id);

    formData.append("chatInstanceId", id);
    Array.from(newFiles).map((file) => formData.append("files", file));
    sendFilesAsMessage(formData)
      .then((res) => {
        console.log("ress", res);
        socket.emit("sendMessage", res?.data);
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
        setNewFiles([]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const isMessageFromMe = (senderId) => {
    return senderId?._id === session?._id || senderId === session?._id;
  };

  const [replyToTarget, setReplyToTarget] = useState("");

  const onReply = (targetChat) => {
    console.log("target", targetChat);
    setReplyToTarget(targetChat);
    onType(null);
  };

  const inputRef = useRef(null);
  console.log("chatInstance", chatInstance);

  return (
    <div className="h-[95%]">
      <Flex vertical align="center" justify="center" className="h-full" gap={3}>
        <div className="relative w-full">
          <Title level={4} className="h-[2rem] w-full text-center shadow-sm">
            Messages
          </Title>
          {isOtherUserTyping && (
            <div className="absolute left-0 right-0 mx-auto mt-0 bg-white rounded-md text-center p-4 w-[40%] shadow-md">
              {chatInstance?.houseId &&
                getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
                  ?.fname + " is typing..."}
            </div>
          )}
        </div>
        <div className="w-full flex-1 p-1 overflow-auto" ref={chatsRef}>
          {isFetchingChats ? (
            <div className="mx-auto w-[20%] flex flex-col justify-center items-center pt-10">
              <DataLoader />
              <Text className="text-xs">Getting Messages...</Text>
            </div>
          ) : isErrorFetchingChats ? (
            <div className="mx-auto w-[20%] flex flex-col justify-center items-center pt-10">
              <FetchError />
            </div>
          ) : chats?.length === 0 ? (
            <Empty description="No Messages with this user" />
          ) : (
            <Flex vertical className="h-full">
              {chatInstance?.houseId &&
                getFriendData(chatInstance?.user1Id, chatInstance?.user2Id) && (
                  <Text className="text-center w-full">
                    Chat for House : <b>{chatInstance?.houseId?.title}</b>
                  </Text>
                )}
              <Text className="text-center w-full font-semibold">
                Chat Started At :{" "}
                {chatInstance?.createdAt &&
                  formatDateWithTime(chatInstance?.createdAt)}
              </Text>
              <Flex vertical gap={5}>
                {chats.map((chat) => {
                  const {
                    message,
                    createdAt,
                    senderId,
                    _id,
                    isRead,
                    isDeleted,
                    isReply,
                    replyTo,
                  } = chat;
                  return (
                    <div
                      className={`max-w-[90%] ${
                        isMessageFromMe(senderId) ? `ms-auto` : "me-auto"
                      }`}
                    >
                      <ChatThread
                        data={{
                          message,
                          createdAt,
                          isRead,
                          _id,
                          isDeleted,
                          isReply,
                          replyTo,
                        }}
                        isMyMessage={isMessageFromMe(senderId)}
                        disabled={!chatInstance?.houseId}
                        onRead={onRead}
                        onDelete={onDelete}
                        onReply={onReply}
                      />
                    </div>
                  );
                })}
              </Flex>
            </Flex>
          )}
        </div>
        <div className="w-full h-[2.5rem]">
          {chatInstance?.houseId ? (
            !getFriendData(chatInstance?.user1Id, chatInstance?.user2Id) ? (
              <div className="flex justify-center items-center border p-3 rounded mt-2">
                <Text className="text-center w-full text-red-600">
                  Chat disabled because account is deleted
                </Text>
              </div>
            ) : (
              <Flex align="center" gap={2} className="h-full">
                <Button className="h-full">
                  <TiAttachment
                    size={"1.8rem"}
                    onClick={() => {
                      document.getElementById("files").click();
                    }}
                  />
                  <input
                    hidden
                    type="file"
                    accept="image/png, image/jpeg, video/mp4"
                    id="files"
                    multiple
                    maxLength={3}
                    onChange={(e) => {
                      setNewFiles(e.target.files);
                      setIsNewFilesModalOpen(true);
                    }}
                  />
                </Button>
                <div className="flex-1 h-full">
                  <div className="relative w-full h-full">
                    {replyToTarget && (
                      <div className="absolute -top-12 min-h-[2rem] w-full border bg-slate-100 rounded-md rounded-b-none p-2 flex justify-between">
                        <Text italic>
                          In Reply to :{" "}
                          {replyToTarget?.message?.text || "[File]"}
                        </Text>
                        <Button
                          className="border-none"
                          size="small"
                          onClick={() => {
                            setReplyToTarget(null);
                            onType(null);
                          }}
                        >
                          <MdClose />
                        </Button>
                      </div>
                    )}
                    <div className="h-full">
                      <form
                        id="message_form"
                        onSubmit={onSend}
                        className="h-full"
                      >
                        <Input
                          value={newText}
                          onChange={onType}
                          placeholder="Type here..."
                          className="h-full"
                          onBlur={handleStopTyping}
                          ref={inputRef}
                        />
                      </form>
                    </div>
                  </div>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  form="message_form"
                  disabled={!newText}
                  className="h-full"
                >
                  <FaTelegramPlane color="white" size={"1.2rem"} />
                </Button>
              </Flex>
            )
          ) : (
            <div className="flex justify-center items-center border p-3 rounded mt-2 h-full">
              <Text className="text-center w-full text-red-600">
                Chat disabled because house is deleted by owner
              </Text>
            </div>
          )}
        </div>
      </Flex>
      <Modal
        open={isNewFilesModalOpen}
        onOk={() => {
          setIsNewFilesModalOpen(false);
          onSendFiles();
        }}
        onCancel={() => {
          setIsNewFilesModalOpen(false);
          setNewFiles([]);
        }}
        okText="Send"
        okButtonProps={{
          style: {
            display: Array.from(newFiles)?.length > 0 ? "inline" : "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: Array.from(newFiles)?.length > 0 ? "inline" : "none",
          },
        }}
        title="Upload Files"
        maskClosable={false}
      >
        <Flex vertical align="center" justify="center" gap={10}>
          {newFiles.length > 0
            ? Array.from(newFiles).map((file, index) => {
                const fileURL = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="w-[60%] flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <img src={fileURL} alt={file.name} width="100" />
                      <p>{file.name}</p>
                    </div>
                    <Button
                      className="text-red-500"
                      icon={<FaTrash />}
                      onClick={() => {
                        setNewFiles(
                          Array.from(newFiles).filter(
                            (f) => f.name !== file.name
                          )
                        );
                      }}
                    >
                      Ignore
                    </Button>
                  </div>
                );
              })
            : "Please Close the Dialog Upload some files"}
        </Flex>
      </Modal>
    </div>
  );
};

export default Chat;
