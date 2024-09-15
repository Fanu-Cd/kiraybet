import { Card, Flex, Image, Tag, Typography } from "antd";
import { FaEllipsisV } from "react-icons/fa";

const Card1 = ({ data }) => {
  const { title, src, location } = data;
  const { Text } = Typography;
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
              <FaEllipsisV />
            </div>
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default Card1;
