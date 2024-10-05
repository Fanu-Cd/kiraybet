import {
  Button,
  Col,
  Flex,
  Input,
  List,
  message,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import Card2 from "../../components/common/card2";
import useWindowSize from "../../hooks/useWindowSize";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../context/session-provider";
import { deleteHouseById, getHousesByOwnerId } from "../../services/api";
import { DataLoader } from "../common/data-loader";
import { IoSettings, IoTrash } from "react-icons/io5";
export const MyHouses = () => {
  const { Text } = Typography;
  const { Option } = Select;
  const router = useNavigate();
  const [sortBy, setSortBy] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const dataList = ["Apple", "Banana", "Orange", "Mango", "Pineapple"];
  const [filteredData, setFilteredData] = useState(dataList);

  const [houses, setHouses] = useState([]);

  const getFinalHousesList = (data) => {
    console.log("here", data);

    const houses = data.map((item, index) => {
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

  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = isSmallScreen ? 4 : 8;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const [currentData, setCurrentData] = useState([]);

  const popoverContent = (
    <List
      dataSource={filteredData}
      renderItem={(item) => <List.Item>{item}</List.Item>}
      style={{ width: 200 }}
    />
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = dataList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setPopoverVisible(!!filtered.length); // Show popover if there are search results
    } else {
      setPopoverVisible(false); // Hide popover if input is cleared
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * PAGE_SIZE;
    const currentData = houses.slice(startIndex, startIndex + PAGE_SIZE);
    setCurrentData(currentData);
  };

  const { session, setSession } = useSession();

  const [isFetchingHouses, setIsFetchingHouses] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);

  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setIsFetchingHouses(true);
    session &&
      getHousesByOwnerId(session._id)
        .then((res) => {
          getFinalHousesList(res?.data);
        })
        .catch((err) => {
          console.log("err", err);
          setIsFetchingHouses(false);
          setIsFetchingError(true);
        });
  }, [session,refetch]);

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

  return (
    <div className="w-full flex flex-col">
      <Button
        type="primary"
        className="w-[5rem]"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          router("./new");
        }}
      >
        New
      </Button>
      <Flex justify="space-between" className="mt-3">
        <Popover
          content={popoverContent}
          visible={popoverVisible}
          placement="bottom"
          trigger="click"
          onVisibleChange={(visible) => setPopoverVisible(visible)}
        >
          <Input.Search
            value={searchValue}
            onChange={handleSearchChange}
            style={{ width: 300 }}
            placeholder="Search"
            className="max-w-[15rem]"
          />
        </Popover>

        <Flex align="center" gap={5}>
          <Text>Sort by</Text>
          <Select
            value={sortBy}
            onChange={(val) => {
              setSortBy(val);
            }}
          >
            <Option value="latest">Latest</Option>
            <Option value="oldest">Oldest</Option>
          </Select>
        </Flex>
      </Flex>

      {isFetchingHouses ? (
        <div className="flex justify-center items-center p-10">
          <DataLoader />
        </div>
      ) : isFetchingError ? (
        "Error!"
      ) : (
        <Row gutter={[5, 5]} className="mt-3">
          {[...currentData].map((house) => (
            <Col sm={12} md={6} key={house.key}>
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
                        <Button type="link" className="text-red-400">Delete</Button>
                      </Popconfirm>
                    ),
                    key: "1",
                    icon: <IoTrash color="red" />,
                  },
                ]}
              />
            </Col>
          ))}
        </Row>
      )}

      {!isFetchingError && !isFetchingHouses && (
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
