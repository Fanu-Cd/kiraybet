import { useParams } from "react-router-dom";
import {
  getChatInstanceById,
  getChatMessageByInstanceId,
  sendFilesAsMessage,
} from "../../../services/api";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../../../context/session-provider";
import { DataLoader } from "../data-loader";
import { Button, Empty, Flex, Input, Modal, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { TiAttachment } from "react-icons/ti";
import { FaTelegramPlane, FaTrash } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import "./styles.css";
import ChatThread from "../../../components/common/chat/chat-thread";
import { formatDateWithTime } from "../../../utils/formatters";
const Chat = () => {
  const { id } = useParams();
  const { socket, refetchChats, setRefetchChats } = useOutletContext();
  const { Title, Text } = Typography;
  const { session, setSession } = useSession();
  const [chatInstance, setChatInstance] = useState(null);
  const [chats, setChats] = useState([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [isErrorFetchingChats, setIsErrorFetchingChats] = useState(false);

  const getChats = () => {
    setIsFetchingChats(true);
    getChatInstanceById(id)
      .then((res) => {
        setChatInstance(res?.data);
        getChatMessageByInstanceId(id)
          .then((res) => {
            setChats(res?.data);
            setIsFetchingChats(false);
            setRefetchChats(false);
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
  }, [session?._id, id, refetchChats]);

  const [newFiles, setNewFiles] = useState([]);
  const [isNewFilesModalOpen, setIsNewFilesModalOpen] = useState(false);

  const [newText, setNewText] = useState("");
  const chatsRef = useRef(null);

  const validateMessage = () => {
    return true;
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!validateMessage()) {
      return;
    }

    const newMessage = {
      senderId: session?._id,
      receiverId: getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)
        ?._id,
      chatInstanceId: id,
      message: {
        text: newText.trim(),
      },
    };

    socket.emit("sendMessage", newMessage);
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }
    setNewText("");
  };

  const onSendFiles = () => {
    const formData = new FormData();
    formData.append("senderId", session?._id);
    formData.append(
      "receiverId",
      getFriendData(chatInstance?.user1Id, chatInstance?.user2Id)?._id
    );
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
    return senderId?._id === session?._id;
  };

  console.log("chatInstance", chatInstance);

  return (
    <div className="h-[95%]">
      {isFetchingChats ? (
        <DataLoader />
      ) : isErrorFetchingChats ? (
        "Error"
      ) : (
        <Flex
          vertical
          align="center"
          justify="center"
          className="h-full"
          gap={3}
        >
          <Title level={4} className="h-[2rem] w-full text-center">
            Messages
          </Title>
          <div className="chats-container w-full flex-1 border-t-2 p-1 overflow-auto">
            {chats?.length === 0 ? (
              <Empty description="No Messages with this user" />
            ) : (
              <Flex vertical className="h-full" ref={chatsRef}>
                <Text className="text-center w-full">
                  Chat for House : <b>{chatInstance?.houseId?.title}</b>
                </Text>
                <Text className="text-center w-full">
                  Started At :{" "}
                  {formatDateWithTime(chatInstance?.createdAt)}
                </Text>
                <Flex vertical gap={5}>
                  {chats.map((chat) => {
                    const { message, createdAt, senderId } = chat;
                    return (
                      <div
                        className={`max-w-[90%] ${
                          isMessageFromMe(senderId) ? `ms-auto` : "me-auto"
                        }`}
                      >
                        <ChatThread
                          data={{ message, createdAt }}
                          isMyMessage={isMessageFromMe(senderId)}
                        />
                      </div>
                    );
                  })}
                </Flex>
              </Flex>
            )}
          </div>
          <div className="w-full h-[3rem]">
            <Flex align="center" gap={2} className="h-full">
              <Button>
                <TiAttachment
                  size={"1.5rem"}
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
              <div className="flex-1">
                <form id="message_form" onSubmit={onSend}>
                  <Input
                    value={newText}
                    onChange={(e) => {
                      setNewText(e.target.value);
                    }}
                    placeholder="Type here..."
                  />
                </form>
              </div>
              <Button
                type="primary"
                htmlType="submit"
                form="message_form"
                disabled={!newText}
              >
                <FaTelegramPlane color="white" size={"1.2rem"} />
              </Button>
            </Flex>
          </div>
        </Flex>
      )}

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
