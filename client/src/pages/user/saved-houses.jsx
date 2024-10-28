import {
  Button,
  Col,
  Empty,
  message,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  getAllHouses,
  getSavedHouseByUserId,
  removeSavedHouseById,
} from "../../services/api";
import useWindowSize from "../../hooks/useWindowSize";
import { DataLoader } from "../common/data-loader";
import Card1 from "../../components/common/card1";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { useSession } from "../../context/session-provider";
import { FaTrash } from "react-icons/fa";
import FetchError from "../../components/common/fetchError";
const { Title, Text } = Typography;
const SavedHouses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const [homes, setHomes] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [isFetchingHouses, setIsFetchingHouses] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const { session, setSession } = useSession();

  const getFinalHousesList = (data) => {
    const houses = data.map((item, index) => {
      if (!item.houseId) {
        return item;
      }
      const { _id, title, mediaFilePath, location } = item.houseId;
      return {
        _id,
        savedHouseId: item._id,
        key: index,
        title,
        location: [location.text, "አዲስ አበባ / Addis Ababa"],
        src: `http://localhost:3001/${mediaFilePath[0]?.replaceAll("\\", "/")}`,
      };
    });

    const currentData = houses.slice(startIndex, startIndex + PAGE_SIZE);
    setHomes(houses);
    setCurrentData(currentData);
    setIsFetchingHouses(false);
    setRefetch(false);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setIsFetchingHouses(true);
    session?._id &&
      getSavedHouseByUserId(session?._id)
        .then((res) => {
          getFinalHousesList(res?.data);
        })
        .catch((err) => {
          setIsFetchingHouses(false);
          setIsFetchingError(true);
        });
  }, [refetch, session]);

  const onRemove = (savedHouseId) => {
    removeSavedHouseById(savedHouseId)
      .then((res) => {
        setRefetch(true);
        notification.success({ message: "House Removed Successfully" });
      })
      .catch((err) => {
        notification.error({ message: "Error removing house" });
      });
  };
  return (
    <div className="w-full p-3">
      <Title level={4}>Saved Houses</Title>
      {currentData?.find((item) => !item.houseId) && (
        <Text className="font-bold text-xs mt-0">
          {currentData?.find((item) => !item.houseId && !item.savedHouseId) &&
            `You have ${
              currentData?.filter((item) => !item.houseId && !item.savedHouseId)
                ?.length
            } Houses Deleted By Owner`}
        </Text>
      )}

      <div className="mt-1">
        {isFetchingHouses ? (
          <div className="flex justify-center items-center p-10">
            <DataLoader />
          </div>
        ) : isFetchingError ? (
          <div className="w-[30%] mx-auto border rounded mt-5">
            <FetchError />
          </div>
        ) : currentData?.length > 0 ? (
          <div className="w-full mt-3">
            <Row gutter={[5, 5]}>
              {currentData
                .filter((item) => item.savedHouseId)
                ?.map((house) => (
                  <Col sm={12} md={6} key={house.key}>
                    <Card1
                      data={house}
                      menuItems={[
                        {
                          label: (
                            <Link href={`./rent/${house._id}`}>
                              <Button type="link">More</Button>
                            </Link>
                          ),
                          key: "1",
                          icon: <EyeOutlined />,
                        },
                        {
                          label: (
                            <Popconfirm
                              onConfirm={() => {
                                onRemove(house?.savedHouseId);
                              }}
                              title="Remove this house?"
                            >
                              <Button type="link" className="text-red-400">
                                Remove
                              </Button>
                            </Popconfirm>
                          ),
                          key: "1",
                          icon: <FaTrash color="red" />,
                        },
                      ]}
                    />
                  </Col>
                ))}
            </Row>
          </div>
        ) : (
          <Empty description="You have no available saved house yet" />
        )}

        <div className="w-full flex justify-center items-center mt-1">
          {!isFetchingError &&
            !isFetchingHouses &&
            currentData?.length > 0 &&
            currentData?.find((item) => item.savedHouseId) && (
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={homes.length}
                onChange={onPageChange}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default SavedHouses;
