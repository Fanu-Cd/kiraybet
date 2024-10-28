import { Flex } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import WordMark from "../../components/common/word-mark";
const Session = () => {
  return (
    <Flex vertical>
      <Navbar />
      <Outlet />
    </Flex>
  );
};

export default Session;
