import { Button, Col, Flex, Image, Row, Space, Typography } from "antd";
import { formatDateWithTime } from "../../../utils/formatters";
import { FaEye, FaTrash } from "react-icons/fa";
import { BiReply } from "react-icons/bi";
import { useEffect } from "react";

const { Title, Text } = Typography;
const ChatThread = ({ data, isMyMessage, onRead, onDelete, onReply }) => {
  const { message, createdAt, isRead, isReply, replyTo } = data;
  const getFinalFilePath = (path) => {
    return `http://localhost:3001/${path?.replaceAll("\\\\", "/")}`;
  };

  const renderFile = (file) => {
    if (file.endsWith("jpg") || file.endsWith("jpeg") || file.endsWith("png")) {
      return (
        <Image src={getFinalFilePath(file)} width={"100%"} height={"8rem"} />
      );
    } else {
      return (
        <video className="w-[8rem] h-[8rem]" controls muted>
          <source src={getFinalFilePath(file)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    console.log("messageElement", messageElement);

    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" });
      messageElement.classList.add("bg-teal-400");

      setTimeout(() => {
        messageElement.classList.remove("bg-teal-400");
      }, 1000);
    }
  };

  useEffect(() => {
    !isRead && !isMyMessage && onRead(data?._id);
  }, [isRead, onRead, data, isMyMessage]);

  return data?.isDeleted ? (
    <Text className="text-red-600 px-3 line-through" italic>
      Deleted Message
    </Text>
  ) : (
    <div
      className="bg-slate-100 p-2 rounded-lg min-w-[10rem]"
      id={`message-${data._id}`}
    >
      {message.isText && message.text ? (
        <Flex vertical className="p-2 rounded-lg group">
          <Text>{message.text}</Text>
          <Flex justify="space-between" align="center" className="w-full">
            <Text className={`${isMyMessage && `text-end`} text-xs`} italic>
              {formatDateWithTime(createdAt)}
            </Text>
            {isMyMessage && (
              <Text className={isMyMessage && `text-end`}>
                {isRead && <FaEye size={"0.7rem"} color="teal" />}
              </Text>
            )}
          </Flex>
          {isMyMessage ? (
            <Button
              className="hidden group-hover:block "
              type="text"
              size="small"
              icon={<FaTrash color="red" size={"0.8rem"} />}
              onClick={() => {
                onDelete(data?._id);
              }}
            />
          ) : (
            <Button
              type="text"
              size="small"
              className="max-w-[3rem] text-xs mt-2"
              onClick={() => {
                onReply(data);
              }}
            >
              Reply
            </Button>
          )}
          {isMyMessage && isReply && (
            <BiReply
              className="cursor-pointer"
              onClick={() => {
                scrollToMessage(replyTo);
              }}
            />
          )}
        </Flex>
      ) : (
        message.mediaFilePath.length !== 0 && (
          <Flex vertical className="rounded-lg">
            <Row gutter={5} className="w-full">
              {message.mediaFilePath.map((file) => {
                return (
                  <Col span={Math.floor(24 / message.mediaFilePath.length)}>
                    {renderFile(file)}
                  </Col>
                );
              })}
            </Row>
            <Flex justify="space-between" align="center">
              <Text className={`${isMyMessage && `text-end`} text-xs`} italic>
                {formatDateWithTime(createdAt)}
              </Text>
              {isMyMessage && (
                <Text className={isMyMessage && `text-end`}>
                  {isRead && <FaEye size={"0.7rem"} color="teal" />}
                </Text>
              )}
            </Flex>
            {isMyMessage ? (
              <Button
                type="text"
                size="small"
                icon={<FaTrash size={"1rem"} />}
              />
            ) : (
              <Button
                type="text"
                size="small"
                className="max-w-[3rem] text-xs mt-2"
                onClick={() => {
                  onReply(data);
                }}
              >Reply</Button>
            )}
          </Flex>
        )
      )}
    </div>
  );
};

export default ChatThread;
