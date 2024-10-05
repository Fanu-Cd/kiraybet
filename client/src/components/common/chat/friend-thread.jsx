import { Avatar, Badge, Button, Flex, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Text } = Typography;
const FriendThread = ({ data, isFriendOnline }) => {
  return (
    <Button className="w-full text-start">
      <Badge
        status={isFriendOnline ? "success" : "default"}
        text={`${data.fname} ${data.lname}`}
      />
    </Button>
  );
};

export default FriendThread;
