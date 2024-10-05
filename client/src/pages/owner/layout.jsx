import React, { useState } from "react";
import {
  DashboardFilled,
  DashboardOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Typography } from "antd";
import Navbar from "../../components/common/navbar";
import { HomeIllustration } from "../../assets/icons/home-illustration";
import WordMark from "../../components/common/word-mark";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/session-provider";
const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const OwnerLayout = () => {
  const router = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const links = [
    { title: "", component: <WordMark />, isComponent: true, to: "/" },
  ];

  const navItems = [
    {
      key: "0",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => {
        router("./dashboard");
      },
    },
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "My Houses",
      onClick: () => {
        router("./my-houses");
      },
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      label: "Discover",
      onClick: () => {
        router("./discover");
      },
    },
  ];

  const [selectedKey, setSelectedKey] = useState(["0"]);

  const { session, setSession } = useSession();

  return (
    <div className="w-[98%] my-2 mx-auto h-auto">
      <Navbar links={links} withProfileCard={true} session={session} />
      <Layout className="mt-2">
        <Sider
          className="!bg-white border h-[calc(100vh-7rem)]"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            items={navItems}
            selectedKeys={[selectedKey]}
            onClick={(v) => {
              setSelectedKey(v.key);
            }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              height: 40,
            }}
            className="flex justify-between items-center"
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 30,
                height: 30,
              }}
            />

            <Text>{navItems[selectedKey].label}</Text>
            <Text></Text>
          </Header>

          <Content
            style={{
              margin: "5px 24px 0 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default OwnerLayout;
