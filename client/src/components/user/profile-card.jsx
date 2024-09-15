import { DownOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, message, Space, Typography } from "antd";
import { IoPersonCircle } from "react-icons/io5";
import { HomeIllustration } from "../../assets/icons/home-illustration";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";

const { Text } = Typography;
const ProfileCard = () => {
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const items = [
    {
      label: "My Profile",
      key: "1",
      icon: <IoPersonCircle />,
    },
    {
      label: "Settings",
      key: "2",
      icon: <IoSettings />,
    },
    {
      label: "Log Out",
      key: "3",
      icon: <IoLogOut />,
    },
  ];

  return (
    <Dropdown menu={{ items, onClick }}>
      <Button onClick={(e) => e.preventDefault()} className="h-[3rem]">
        <Space>
          <Text>Fanuel</Text>
          <Avatar src={<HomeIllustration />} />
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default ProfileCard;
