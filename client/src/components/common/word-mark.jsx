import { Flex } from "antd";
import { Typography } from "antd";
import { HomeIllustration } from "../../assets/icons/home-illustration";
const WordMark = () => {
  const { Text } = Typography;
  return (
    <Flex gap={2} className="" align="center">
      <HomeIllustration />
      <Text className="font-bold">Kiray bet</Text>
    </Flex>
  );
};

export default WordMark;
