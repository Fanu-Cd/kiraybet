import React, { useEffect, useState } from "react";
import {
  DashboardFilled,
  DashboardOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
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
import { IoMailOpenOutline } from "react-icons/io5";
import useWindowSize from "../../hooks/useWindowSize";
import { MdReportProblem } from "react-icons/md";
const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const OwnerLayout = () => {
  const router = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
      key: "3",
      icon: <MessageOutlined />,
      label: "Chats",
      onClick: () => {
        router("./chats");
      },
    },
    {
      key: "4",
      icon: <MdReportProblem />,
      label: "Complaints",
      onClick: () => {
        router("./complaints");
      },
    },
  ];

  const [selectedKey, setSelectedKey] = useState(["0"]);

  const { session, setSession } = useSession();
  const onLogout = () => {
    localStorage.removeItem("userId");
    setSession(null);
    router("/");
  };

  const getMenuItemByUrl = () => {
    if (window.location.pathname.includes("/owner/my-houses")) {
      return "My Houses";
    }
    if (window.location.pathname.includes("/owner/dashboard")) {
      return "Dashboard";
    }
    if (window.location.pathname.includes("/owner/chats")) {
      return "Chats";
    }
    if (window.location.pathname.includes("/owner/complaints")) {
      return "Complaints";
    }
    return null;
  };
  const { width } = useWindowSize();
  const isSmallScreen = width < 800;

  useEffect(() => {
    setCollapsed(true);
  }, [isSmallScreen]);

  return (
    <div className="w-[98%] my-2 mx-auto h-auto">
      <Navbar withProfileCard={true} session={session} logout={onLogout} />
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
            className={`${
              isSmallScreen && `hidden`
            } md:flex justify-between items-center`}
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

            <Text>{getMenuItemByUrl() || navItems[selectedKey].label}</Text>
            <Text></Text>
          </Header>

          <Content
            style={{
              margin: "5px 24px 0 16px",
              padding: 12,
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
