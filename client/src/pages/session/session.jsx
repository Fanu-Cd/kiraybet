import { Flex } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import WordMark from "../../components/common/word-mark";
const Session = () => {
  const links = [
    { title: "", component: <WordMark />, isComponent: true, to: "/" },
  ];

  return (
    <Flex vertical>
      <Navbar links={links} />
      <Outlet />
    </Flex>
  );
};

export default Session;
