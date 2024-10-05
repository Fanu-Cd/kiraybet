import { Button, Col, Flex, Image, Row, Space, Typography } from "antd";
import { formatDateWithTime } from "../../../utils/formatters";
import { FaTrash } from "react-icons/fa";
import { BiReply } from "react-icons/bi";

const { Title, Text } = Typography;
const ChatThread = ({ data, isMyMessage }) => {
  const { message, createdAt } = data;
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

  return (
    <div className="bg-white p-2 rounded-lg">
      {message.isText && message.text ? (
        <Flex vertical className="p-2 rounded-lg">
          <Text>{message.text}</Text>
          <Text className={isMyMessage && `text-end`}>
            {formatDateWithTime(createdAt)}
          </Text>
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
            <Text className={isMyMessage && `text-end`}>
              {formatDateWithTime(createdAt)}
            </Text>
          </Flex>
        )
      )}

      {/* {isMyMessage ? (
        <Button type="text" icon={<FaTrash size={"1rem"} />} />
      ) : (
        <Button type="text" icon={<BiReply size={"1rem"} />} />
      )} */}
    </div>
  );
};

export default ChatThread;
