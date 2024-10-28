import {
  Button,
  Col,
  Empty,
  Flex,
  Input,
  List,
  message,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import Card2 from "../../components/common/card2";
import useWindowSize from "../../hooks/useWindowSize";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../context/session-provider";
import {
  deleteHouseById,
  getAllChatInstances,
  getAllSavedHouses,
  getHousesByOwnerId,
} from "../../services/api";
import { DataLoader } from "../common/data-loader";
import { IoSettings, IoTrash } from "react-icons/io5";
import FetchError from "../../components/common/fetchError";
export const MyHouses = () => {
  const { Text } = Typography;
  const { Option } = Select;
  const router = useNavigate();
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("location");
  const [filterValue, setFilterValue] = useState(null);
  const filterByOptions = [
    { value: "location", label: "Location" },
    { value: "availability", label: "Availability" },
    { value: "size", label: "Size" },
    { value: "type", label: "Type" },
    { value: "beds", label: "Beds" },
  ];
  const [filterOptions, setFilterOptions] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [houses, setHouses] = useState([]);

  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const isSmallerScreen = width < 1000;
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = isSmallScreen ? 4 : 8;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const [currentData, setCurrentData] = useState([]);
  const [initData, setInitData] = useState([]);

  const { session, setSession } = useSession();

  const [isFetchingHouses, setIsFetchingHouses] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);

  const [refetch, setRefetch] = useState(false);

  const getFinalHousesList = (data, sortBy) => {
    setInitData(data);
    setFilterOptions(
      data?.map((item) => ({
        label: item.location?.text,
        value: item.location?.text,
      }))
    );
    const finalData = sortBy
      ? sortBy === "oldest"
        ? data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : data;
    setDataList(finalData.map((item) => ({ title: item.title, id: item._id })));
    setFilteredData(
      finalData.map((item) => ({ title: item.title, id: item._id }))
    );
    const houses = finalData.map((item, index) => {
      const { _id, title, price, mediaFilePath, location, isNegotiable } = item;
      return {
        _id,
        key: index,
        title,
        price,
        coordinates: [location.latitude, location.longitude],
        location: [location.text, "አዲስ አበባ / Addis Ababa"],
        isNegotiable,
        src: `http://localhost:3001/${mediaFilePath[0]?.replaceAll("\\", "/")}`,
      };
    });

    const currentData = houses.slice(startIndex, startIndex + PAGE_SIZE);
    setHouses(houses);
    setCurrentData(currentData);
    setIsFetchingHouses(false);
    setRefetch(false);
  };

  const popoverContent = (
    <List
      dataSource={filteredData}
      renderItem={(item) => (
        <List.Item>
          <Link className="w-full" to={item.id}>
            {item.title}
          </Link>
        </List.Item>
      )}
      style={{ width: 200 }}
    />
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = dataList.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setPopoverVisible(!!filtered.length);
    } else {
      setPopoverVisible(false);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * PAGE_SIZE;
    const currentData = houses.slice(startIndex, startIndex + PAGE_SIZE);
    setCurrentData(currentData);
  };

  const deleteHouse = (id) => {
    deleteHouseById(id)
      .then((res) => {
        message.success("Successfully Deleted");
        setRefetch(true);
      })
      .catch((err) => {
        message.error("Some Error Occurred");
      });
  };

  const [analytics, setAnalytics] = useState({ chat: [], saved: [] });

  const getAnalyticsData = () => {
    getAllChatInstances().then((chatRes) => {
      console.log("chatres", chatRes);

      getAllSavedHouses().then((res) => {
        console.log("res", res);

        setAnalytics({ chat: chatRes?.data, saved: res?.data });
      });
    });
  };

  useEffect(() => {
    setIsFetchingHouses(true);
    session &&
      getHousesByOwnerId(session._id)
        .then((res) => {
          getFinalHousesList(res?.data);
        })
        .catch((err) => {
          setIsFetchingHouses(false);
          setIsFetchingError(true);
        });
  }, [session, refetch]);

  useEffect(() => {
    getFinalHousesList(initData, sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (filterBy === "location") {
      setFilterOptions(
        initData?.map((item) => ({
          label: item.location?.text,
          value: item.location?.text,
        }))
      );
    } else if (filterBy === "availability") {
      setFilterOptions(
        initData?.map((item) => ({
          label: item.isAvailable ? "Available" : "Not Availble",
          value: item.isAvailable ? "Available" : true,
        }))
      );
    } else if (filterBy === "size") {
      setFilterOptions(
        initData?.map((item) => ({
          label: item.size,
          value: item.size,
        }))
      );
    } else if (filterBy === "type") {
      setFilterOptions(
        initData?.map((item) => ({
          label: item.type,
          value: item.type,
        }))
      );
    } else if (filterBy === "beds") {
      setFilterOptions(
        initData?.map((item) => ({
          label: item.beds,
          value: item.beds,
        }))
      );
    }
  }, [filterBy]);

  useEffect(() => {
    getAnalyticsData();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <Button
        type="primary"
        className={`w-[5rem] ${
          (isFetchingError || currentData?.length === 0) && `mx-auto`
        }`}
        icon={<PlusCircleOutlined />}
        onClick={() => {
          router("./new");
        }}
      >
        New
      </Button>
      {!isFetchingError && !isFetchingHouses && currentData?.length > 0 && (
        <Flex
          justify="space-between"
          align="center"
          className="mt-3"
          vertical={isSmallerScreen}
          gap={5}
        >
          <Popover
            content={popoverContent}
            visible={popoverVisible}
            placement="bottom"
            trigger="click"
            onVisibleChange={(visible) => setPopoverVisible(visible)}
            className={`${isSmallerScreen ? `w-full` : `!w-[30%]`}`}
          >
            <Input.Search
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by title"
              className={`${isSmallerScreen ? `w-full` : `max-w-[15rem]`}`}
            />
          </Popover>
          <Row
            align={"middle"}
            gutter={[10, 5]}
            className={`${isSmallerScreen ? `w-full` : `w-[50%]`}`}
          >
            <Col span={isSmallerScreen ? 24 : 10}>
              <Flex
                align="center"
                gap={5}
                justify={`${isSmallerScreen ? `space-between` : `center`}`}
              >
                <Text>Filter by</Text>
                <Select
                  value={filterBy}
                  onChange={(val) => {
                    setFilterBy(val);
                  }}
                  options={filterByOptions}
                  className="flex-1"
                />
              </Flex>
            </Col>
            <Col span={isSmallerScreen ? 24 : 6}>
              <Select
                value={filterValue}
                onChange={(val) => {
                  setFilterValue(val);
                }}
                options={filterOptions}
                placeholder="Select Filter"
                className={isSmallerScreen && `w-full`}
              />
            </Col>
            <Col span={isSmallerScreen ? 24 : 8}>
              <Flex
                align="center"
                gap={5}
                justify={`${isSmallerScreen ? `space-between` : `center`}`}
              >
                <Text>Sort by</Text>
                <Select
                  value={sortBy}
                  onChange={(val) => {
                    setSortBy(val);
                  }}
                  className="flex-1"
                >
                  <Option value="latest">Latest</Option>
                  <Option value="oldest">Oldest</Option>
                </Select>
              </Flex>
            </Col>
          </Row>
        </Flex>
      )}

      {isFetchingHouses ? (
        <div className="flex justify-center items-center p-10">
          <DataLoader />
        </div>
      ) : isFetchingError ? (
        <div className="mx-auto border rounded mt-5">
          <FetchError onRefresh={() => setRefetch(true)} />
        </div>
      ) : (
        <Row gutter={[5, 15]} className="mt-3">
          {currentData?.length > 0 ? (
            [...currentData].map((house) => (
              <Col sm={24} md={12} lg={6} key={house.key}>
                <Card2
                  data={house}
                  menuItems={[
                    {
                      label: (
                        <Link to={`./${house._id}`}>
                          <Button
                            onClick={() => {
                              deleteHouse(house._id);
                            }}
                            type="link"
                          >
                            Settings
                          </Button>
                        </Link>
                      ),
                      key: "1",
                      icon: <IoSettings />,
                    },
                    {
                      label: (
                        <Popconfirm
                          title="Delete This House ?"
                          onConfirm={() => {
                            deleteHouse(house._id);
                          }}
                        >
                          <Button type="link" className="text-red-400">
                            Delete
                          </Button>
                        </Popconfirm>
                      ),
                      key: "1",
                      icon: <IoTrash color="red" />,
                    },
                  ]}
                  withAnalytics
                  analytics={`${
                    analytics?.chat?.filter(
                      (item) => item.houseId?._id === house._id
                    )?.length
                  } Chats started, Saved by ${
                    analytics?.saved?.filter(
                      (item) => item.houseId?._id === house._id
                    )?.length
                  } people`}
                />
              </Col>
            ))
          ) : (
            <div className="w-[40%] mx-auto">
              <Empty description="You have not posted houses yet" />
            </div>
          )}
        </Row>
      )}

      {!isFetchingError && !isFetchingHouses && currentData?.length > 0 && (
        <div className="w-full flex justify-center items-center mt-1">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={houses.length}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
