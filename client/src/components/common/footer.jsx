import { Row, Col, Typography, List, Flex, Input, Button, Divider } from "antd";
import { Link } from "react-router-dom";
import { MdOutlineDeveloperMode } from "react-icons/md";
const { Title, Text } = Typography;
const { Item } = List;
const Footer = () => {
  return (
    <div className="min-h-[5rem] w-full border text-center p-5 bg-slate-800 mt-10">
      <Row className="w-full">
        <Col span={24} className="flex justify-between items-center 3">
          <Flex vertical align="start">
            <Text className="text-teal-400">Kiray Bet</Text>
            <Text className="text-white">&copy;2024 All rights reserved</Text>
          </Flex>
          <Flex gap={5}>
            <a
              href="https://github.com/facu-cd"
              className="flex items-center gap-1 hover:underline"
            >
              <MdOutlineDeveloperMode color="orange" />
              <Text className="text-white hover:text-teal-400">Developer</Text>
            </a>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
