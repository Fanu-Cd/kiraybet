import {
  AccountBookOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, message, Space, Typography } from "antd";
import {
  IoPersonCircle,
  IoPersonCircleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { HomeIllustration } from "../../assets/icons/home-illustration";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import useWindowSize from "../../hooks/useWindowSize";

const { Text } = Typography;
const ProfileCard = ({ userData, logout }) => {
  const onClick = ({ key, l }) => {
    if (Number(3) === 3) logout();
  };

  const { width } = useWindowSize();
  const isSmallerScreen = width < 600;
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
      <Button onClick={(e) => e.preventDefault()} className="h-[2.5rem]">
        <Space>
          {!isSmallerScreen && <Text>{userData?.fname}</Text>}
          <Avatar icon={<UserOutlined />} />
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default ProfileCard;
