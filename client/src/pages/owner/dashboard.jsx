import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Row, Statistic } from "antd";
import {
  getChatInstanceByUserId,
  getComplaintsByOwnerId,
  getHousesByOwnerId,
  getOwnerStat,
  getRatingByOwnerId,
} from "../../services/api";
import { useSession } from "../../context/session-provider";
import { useEffect, useState } from "react";
import { Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import useWindowSize from "../../hooks/useWindowSize";
import { FaStar } from "react-icons/fa";
const OwnerDashboard = () => {
  const { Title, Text } = Typography;
  const { session, setSession } = useSession();
  const [statistics, setStatistics] = useState({ allHouses: 0 });
  const [activityData, setActivityData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [comparisionData, setComparisonData] = useState([]);

  const getStatistics = () => {
    getHousesByOwnerId(session?._id).then((res) => {
      getChatInstanceByUserId(session?._id).then((chatRes) => {
        getComplaintsByOwnerId(session?._id).then((compRes) => {
          getOwnerStat(session?._id).then((statRes) => {
            setStatistics({
              allHouses: res?.data?.length,
              availableHouses: res?.data?.filter((item) => item.isAvailable)
                ?.length,
              allChats: chatRes?.data?.length,
              activeChats: chatRes?.data?.filter(
                (item) => item.user1Id && item.user2Id && item.houseId
              )?.length,
              rating:
                res?.data?.reduce((acc, item) => acc + item.rating, 0) /
                res?.data?.length,
              complaints: compRes?.data?.length,
            });

            setComparisonData([
              { metric: "No of Rentals", level: statRes.houses },
              { metric: "Tenant Ratings", level: statRes.rating },
            ]);
          });

          setAvailabilityData([
            {
              name: "Available Houses",
              value: res?.data?.filter((item) => item.isAvailable)?.length,
            },
            {
              name: "Unavailable Houses",
              value: res?.data?.filter((item) => !item.isAvailable)?.length,
            },
          ]);
        });
      });
    });
  };

  const getActivityData = () => {
    getHousesByOwnerId(session?._id)
      .then((res) => {
        setActivityData(getFinalLineChartData(res?.data));
      })
      .catch((err) => []);
  };

  const getFinalLineChartData = (data) => {
    const grouped = {};
    console.log("data", data);

    data.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleString("default", {
        month: "long",
      });
      grouped[month] = (grouped[month] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort(
        ([monthA], [monthB]) =>
          new Date(Date.parse(monthA + " 1, 2021")) -
          new Date(Date.parse(monthB + " 1, 2021"))
      )
      .map(([month, count]) => ({
        month,
        pv: count,
      }));
  };

  useEffect(() => {
    session && getStatistics();
    session && getActivityData();
  }, [session]);

  const { width } = useWindowSize();
  const isSmallScreen = width < 1000;
  const isSmallerScreen = width < 800;
  const COLORS = ["#0088FE", "#FFBB28"];

  const CustomYAxisTick = ({ payload, ...props }) => {
    const value =
      payload.value >= 5
        ? "Less"
        : payload.value === 1
        ? "1st"
        : payload.value === 2
        ? "2nd"
        : payload.value === 3
        ? "3rd"
        : `${payload.value}th`;
    return <text {...props}>{value}</text>;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { metric, level } = payload[0].payload;

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <p>{metric}</p>
          <div>
            {level === 1 ? (
              <Flex align="center" gap={2}>
                Top <FaStar color="gold" />
              </Flex>
            ) : (
              `Rank: ${level}`
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Flex vertical className="w-full">
      <Row gutter={[10, 10]}>
        <Col span={isSmallScreen ? 24 : 12} className="shadow-md">
          <Title level={4}>Statistics</Title>
          <Row gutter={[18, 10]} className="p-3 w-full">
            <Col span={isSmallerScreen ? 12 : 8}>
              <Card bordered={false}>
                <Statistic title="All Houses" value={statistics?.allHouses} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Available Houses"
                  value={statistics?.availableHouses}
                />
              </Card>
            </Col>
            <Col span={isSmallerScreen ? 12 : 8}>
              <Card bordered={false}>
                <Statistic title="All Chats" value={statistics?.allChats} />
              </Card>
            </Col>
            <Col span={isSmallerScreen ? 12 : 8}>
              <Card bordered={false}>
                <Statistic
                  title="Active Chats"
                  value={statistics?.activeChats}
                />
              </Card>
            </Col>
            <Col span={isSmallerScreen ? 12 : 8}>
              <Card bordered={false}>
                <Statistic title="Complaints" value={statistics?.complaints} />
              </Card>
            </Col>
            <Col span={isSmallerScreen ? 12 : 8}>
              <Card bordered={false}>
                <Flex>
                  <Statistic
                    title="Average House Ratings"
                    value={statistics?.rating}
                    precision={1}
                  />
                </Flex>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={isSmallScreen ? 24 : 12} className="shadow-md">
          <Title level={4}>Availability</Title>
          <ResponsiveContainer width={"100%"} height={300}>
            <PieChart>
              <Pie
                data={availabilityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {availabilityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      <div className="w-full mt-10">
        <Row gutter={[10, 10]}>
          <Col span={isSmallScreen ? 24 : 12} className="shadow-md">
            <Title level={4}>Activity</Title>
            {activityData?.length > 0 && (
              <ResponsiveContainer width={"100%"} height={300}>
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis ticks={[0, 5, 10, 25, 50]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Col>
          <Col span={isSmallScreen ? 24 : 12} className="shadow-md">
            <Title level={4}>How you compare</Title>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis type="category" dataKey="metric" name="Metrics" />
                <YAxis
                  type="number"
                  dataKey="level"
                  name="Level"
                  reversed
                  tick={<CustomYAxisTick />}
                  domain={[1, 5]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter
                  name="Owner Metrics"
                  data={comparisionData}
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    </Flex>
  );
};

export default OwnerDashboard;
