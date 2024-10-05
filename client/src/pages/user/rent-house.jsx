import { Link, useParams } from "react-router-dom";
import {
  createNewChatInstance,
  getChatInstanceByUsersAndHouseId,
  getHouseById,
  getHousesBySubcity,
} from "../../services/api";
import { useEffect, useState } from "react";
import { DataLoader } from "../../pages/common/data-loader";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Grid,
  Modal,
  Pagination,
  Row,
  Space,
  Typography,
} from "antd";
import FilesViewer from "../../components/common/files-viewer";
import { FaMapMarkedAlt } from "react-icons/fa";
import Card1 from "../../components/common/card1";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  MessageOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import MapViewer from "../../components/common/map-viewer";
import { useSession } from "../../context/session-provider";
import { BiLeftArrow } from "react-icons/bi";

const RentHouse = () => {
  const { id } = useParams();
  const [isFetching, setIsFetching] = useState(false);
  const [errorFetching, setIsErrorFetching] = useState(false);

  const [isFetchingSimilarHouses, setIsFetchingSimilarHouses] = useState(false);
  const [errorFetchingSimilarHouses, setIsErrorFetchingSimilarHouses] =
    useState(false);
  const [house, setHouse] = useState(null);
  const [items, setItems] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState([]);
  const [similarHouses, setSimilarHouses] = useState([]);

  const { Title, Text } = Typography;
  const filterUnnecessaryFields = (keys) => {
    console.log("keys", keys);

    return keys.filter(
      (key) =>
        key !== "_id" &&
        key !== "ownerId" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "__v" &&
        key !== "location" &&
        key !== "mediaFilePath" &&
        key !== "password" &&
        key !== "accountStatus" &&
        key !== "accountType"
    );
  };

  const getHouseData = () => {
    setIsFetching(true);

    getHouseById(id)
      .then((res) => {
        console.log("ress", res?.data, Object.keys(res?.data));
        getSimilarHouses(res?.data?.location?.text);
        setItems(
          filterUnnecessaryFields(Object.keys(res?.data))?.map((item) => ({
            key: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
            children: res?.data[item],
          }))
        );
        setOwnerInfo(
          filterUnnecessaryFields(Object.keys(res?.data?.ownerId))?.map(
            (item) => ({
              key: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),

              children: res?.data.ownerId[item],
            })
          )
        );
        setHouse(res?.data);
        setIsFetching(false);
      })
      .catch((err) => {});
  };

  const getSimilarHouses = (subcity) => {
    setIsFetchingSimilarHouses(true);
    getHousesBySubcity(subcity)
      .then((res) => {
        setIsFetchingSimilarHouses(false);
        setSimilarHouses(res?.data);

        const houses = res?.data
          .filter((item) => item._id !== id)
          ?.map((item, index) => {
            const { _id, title, price, mediaFilePath, location, isNegotiable } =
              item;
            return {
              _id,
              key: index,
              title,
              price,
              coordinates: [location.latitude, location.longitude],
              location: [location.text, "አዲስ አበባ / Addis Ababa"],
              isNegotiable,
              src: `http://localhost:3001/${mediaFilePath[0]?.replaceAll(
                "\\",
                "/"
              )}`,
            };
          });

        const currentData = houses.slice(startIndex, startIndex + PAGE_SIZE);
        setCurrentData(currentData);
        setHomes(houses);

        console.log("houses", houses);
      })
      .catch((err) => {
        setIsFetchingSimilarHouses(false);
        setIsErrorFetchingSimilarHouses(true);
      });
  };

  useEffect(() => {
    getHouseData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const [mode, setMode] = useState("list");
  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const [homes, setHomes] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const { t } = useTranslation();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isErrorCreatingChat, setIsErrorCreatingChat] = useState(false);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const { session, setSession } = useSession();
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [newChat, setNewChat] = useState(null);
  const createChatWithOwner = () => {
    setIsCreatingChat(true);
    const data = {
      user1Id: session?._id,
      user2Id: house?.ownerId?._id,
      houseId: house?._id,
    };

    createNewChatInstance(data)
      .then((res) => {
        setIsCreatingChat(false);
        setNewChat(res?.data);
      })
      .catch((err) => {
        setIsCreatingChat(false);
        setIsErrorCreatingChat(true);
      });
  };

  const [chatStatus, setChatStatus] = useState("checking");
  const [chatInstanceId, setChatInstanceId] = useState("");
  const checkChatStatus = () => {
    getChatInstanceByUsersAndHouseId(
      session?._id,
      house?.ownerId?._id,
      house?._id
    )
      .then((res) => {
        setChatStatus(res?.data ? "exists" : "none");
        setChatInstanceId(res?.data?._id);
      })
      .catch((err) => {
        setChatStatus("error");
      });
  };

  useEffect(() => {
    session?._id && house && checkChatStatus();
  }, [session, house]);

  return (
    <div className="w-full p-3">
      {isFetching ? (
        <DataLoader />
      ) : errorFetching ? (
        "errr"
      ) : (
        <Row className="w-full" gutter={5}>
          <Col span={12} className="flex flex-col justify-center items-center">
            <Link className="w-full" to={'/me/rent'}>
              <Button type="link" icon={<ArrowLeftOutlined />}>All Houses</Button>
            </Link>
            <Title level={4}>House Details</Title>
            <Title level={5} className="w-full">
              Basic Info
            </Title>
            <Descriptions items={items} column={3} />
            <Title level={5} className="w-full mt-5">
              Address
            </Title>
            <Text className="w-full">
              This House is Located in{" "}
              <b>{house?.location?.text} Subcity, Addis Ababa, Ethiopia</b>
            </Text>
            <div className="!h-[15rem] w-full mt-2">
              <MapViewer data={homes} />
            </div>
            <Title level={5} className="w-full mt-5">
              Photos/Videos (click to preview)
            </Title>
            <FilesViewer filePaths={house?.mediaFilePath} />
            <Title level={5} className="w-full mt-5">
              Owner Info
            </Title>
            <Descriptions items={ownerInfo} column={2} />
            <Space className="mt-10">
              {chatStatus === "exists" ? (
                <Flex align="center" justify="center" vertical>
                  <Text className="font-bold">
                    You have started a chat instance for this house
                  </Text>
                  <Link className="mt-2" to={`/me/chats/${chatInstanceId}`}>
                    <Button>Go to chat</Button>
                  </Link>
                </Flex>
              ) : (
                <Button
                  icon={<MessageOutlined />}
                  onClick={() => {
                    createChatWithOwner();
                    setIsCreateChatModalOpen(true);
                  }}
                  type="primary"
                  disabled={chatStatus === "checking" || chatStatus === "error"}
                >
                  Start Chat
                </Button>
              )}
            </Space>
          </Col>
          <Col span={1}>
            <Divider
              style={{ borderColor: "#7cb305" }}
              type="vertical"
              className="h-full"
            />
          </Col>
          <Col span={11} className="flex flex-col items-center">
            <Title level={4}>
              Similar Houses in {house?.location?.text}, Addis Ababa
            </Title>
            {isFetchingSimilarHouses ? (
              <DataLoader />
            ) : errorFetchingSimilarHouses ? (
              "Error!"
            ) : (
              <div className="w-full flex flex-col justify-center items-center">
                {currentData?.length > 0 ? (
                  <Row gutter={[5, 5]} className="mt-3 w-full">
                    {[...currentData].map((house) => (
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
                          ]}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty
                    description={`No Similar Houses in ${house?.location?.text}, Addis Ababa`}
                  />
                )}

                {currentData?.length > 0 && (
                  <div className="w-full flex justify-center items-center mt-1">
                    <Pagination
                      current={currentPage}
                      pageSize={PAGE_SIZE}
                      total={homes.length}
                      onChange={onPageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      )}

      <Modal
        open={isCreateChatModalOpen}
        onCancel={() => {
          setIsCreateChatModalOpen(false);
        }}
        footer={[]}
        title="New Chat"
      >
        <Flex vertical align="center" justify="center" gap={5}>
          <Text className="text-center">
            {isCreatingChat
              ? "Creating Chat with owner..."
              : isErrorCreatingChat
              ? "Error Creating Chat"
              : "Chat Created!"}
          </Text>
          <Link to={`/me/chats/${newChat?._id}`}>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Go to chat
            </Button>
          </Link>
        </Flex>
      </Modal>
    </div>
  );
};

export default RentHouse;
