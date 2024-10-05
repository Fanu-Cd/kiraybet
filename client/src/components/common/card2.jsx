import { Button, Card, Dropdown, Flex, Image, Tag, Typography } from "antd";
import { FaEllipsisV } from "react-icons/fa";
import { IoLogOut, IoPersonCircle, IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

const Card2 = ({ data, menuItems }) => {
  const { title, src, location } = data;

  const { Text } = Typography;
  const onClick = () => {};

  return (
    <div className="w-full h-full">
      <Card
        hoverable
        className="w-full h-full !p-0"
        cover={
          <Image
            alt="picture"
            className="w-full !h-[10rem] rounded-md"
            src={src}
          />
        }
        styles={{ body: { padding: "0", paddingTop: "5px" } }}
      >
        <Flex vertical className="w-full p-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <Text className="font-bold">{title}</Text>
              <Text>
                {location.map((loc) => (
                  <Tag>{loc}</Tag>
                ))}
              </Text>
            </div>
            <div>
              <Dropdown menu={{ items:menuItems, onClick }}>
                <Button
                  onClick={(e) => e.preventDefault()}
                  className="h-[3rem] border-none"
                >
                  <FaEllipsisV />
                </Button>
              </Dropdown>
            </div>
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default Card2;
