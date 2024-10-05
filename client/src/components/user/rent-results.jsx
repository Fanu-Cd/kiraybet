import {
  Button,
  Col,
  Empty,
  Flex,
  message,
  Pagination,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { useFilterContext } from "../../context/rent-filter-context";
import Card1 from "../common/card1";
import MapViewer from "../common/map-viewer";
import { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";
import {
  ArrowRightOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getAllHouses,
  getSavedHouseByUserAndHouseId,
  saveNewHouse,
} from "../../services/api";
import { DataLoader } from "../../pages/common/data-loader";
import { useSession } from "../../context/session-provider";
import { FaSave } from "react-icons/fa";

const RentResults = () => {
  const {
    filters,
    setFilters,
    bedOptions,
    sizeOptions,
    typeOptions,
    priceRanges,
  } = useFilterContext();
  const { Title, Text, Link } = Typography;
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const [mode, setMode] = useState("list");
  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const [homes, setHomes] = useState([]);
  const [housesData, setHousesData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const { t } = useTranslation();

  const getFinalHousesList = (data) => {
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
    setHomes(houses);
    setCurrentData(currentData);
    setIsFetchingHouses(false);
    setRefetch(false);
  };

  const sortOptions = [
    { label: t("latest"), value: "latest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("least_price"), value: "price_asc" },
    { label: t("highest_price"), value: "price_desc" },
  ];
  const [sortBy, setSortBy] = useState("latest");

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const [isFetchingHouses, setIsFetchingHouses] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);

  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setIsFetchingHouses(true);
    getAllHouses()
      .then((res) => {
        getFinalHousesList(res?.data);
        setHousesData(res?.data);
      })
      .catch((err) => {
        setIsFetchingHouses(false);
        setIsFetchingError(true);
      });
  }, [refetch]);

  const resetFilters = () => {
    setFilters({
      location: null,
      priceRange: null,
      type: null,
      size: null,
      bed: null,
      count: null,
    });
  };

  const { session, setSession } = useSession();

  const onSaveHouse = (houseId) => {
    const data = {
      houseId,
      userId: session?._id,
    };
    saveNewHouse(data)
      .then((res) => {
        message.success("House Saved Successfully");
      })
      .catch((err) => {
        message.error("Error saving House");
      });
  };

  const comparePriceWithFilter = (filterPrice, housePrice) => {
    const finalFilterPrice = {
      min: Number(filterPrice.split("min-")[1]?.slice(0, 2)) * 1000,
      max: Number(filterPrice.split("max-")[1]?.slice(0, 2)) * 1000,
    };

    return Number(
      Number(housePrice) >= finalFilterPrice.min &&
        Number(housePrice) <= finalFilterPrice.max
    );
  };

  const filterHouses = () => {
    const filteredHouses = housesData.filter((house) => {
      const isHouseMatch =
        (filters.bed ? house.beds === filters.bed : true) &&
        (filters.count ? house.maxPeople === filters.count : true) &&
        (filters.size ? house.size === filters.size : true) &&
        (filters.type ? house.type === filters.type : true) &&
        (filters.location
          ? house.location.text
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          : true) &&
        (filters.price
          ? comparePriceWithFilter(filters.priceRange, house.price)
          : true);
      console.log("mact", isHouseMatch);

      return isHouseMatch;
    });
    getFinalHousesList(filteredHouses);
  };

  const [houseSaveStatus, setHouseSaveStatus] = useState("checking");
  const checkHouseSaveStatus = (houseId) => {
    getSavedHouseByUserAndHouseId(session?._id, houseId)
      .then((res) => {
        setHouseSaveStatus(res?.data ? "saved" : "none");
      })
      .catch((err) => {
        setHouseSaveStatus("error");
      });
  };

  return (
    <div className="h-auto">
      {isSmallScreen && (
        <Flex
          gap={5}
          justify="center"
          align="center"
          className="w-[10rem] mx-auto"
        >
          <Text>List</Text>
          <Switch
            onChange={(checked) => {
              setMode(checked ? "map" : "list");
            }}
          ></Switch>
          <Text>Map</Text>
        </Flex>
      )}

      <Row className="mt-3 h-full items-stretch" gutter={5}>
        <Col
          className={`${
            !isSmallScreen || (isSmallScreen && mode === "list")
              ? `flex flex-col h-auto`
              : `hidden`
          }`}
          span={!isSmallScreen ? 12 : mode === "list" && 24}
        >
          {/* <Title level={4}>{getSearchValue()}</Title> */}
          <Flex justify="space-between">
            <Title level={4}>{t(`search_results`)}</Title>
            <Button
              size="small"
              type="link"
              icon={<CloseOutlined />}
              onClick={resetFilters}
            >
              {t(`clear_filters`)}
            </Button>
          </Flex>
          <div className="flex justify-between items-center">
            <Text className="font-bold">
              {currentData?.length}&nbsp;
              {currentData?.length === 1 ? t(`home`) : `${t(`homes`)}`}
            </Text>
            <Flex align="center" justify="end" className="min-w-[60%]" gap={3}>
              <Text className="text-sm">{t("sort")} : </Text>
              <Select style={{ width: "60%" }} value={sortBy}>
                {sortOptions.map((item) => (
                  <Select.Option
                    onChange={(val) => {
                      setSortBy(val);
                    }}
                    value={item.value}
                  >
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Flex>
          </div>
          <div className="mt-1">
            {isFetchingHouses ? (
              <div className="flex justify-center items-center p-10">
                <DataLoader />
              </div>
            ) : isFetchingError ? (
              "Error!"
            ) : currentData?.length > 0 ? (
              <Row gutter={[5, 5]} className="mt-3">
                {[...currentData].map((house) => (
                  <Col sm={12} md={6} key={house.key}>
                    <Card1
                      data={house}
                      menuItems={[
                        {
                          label: (
                            <Link href={`./rent/${house._id}`}>
                              <Button type="link" icon={<EyeOutlined />}>
                                More
                              </Button>
                            </Link>
                          ),
                          key: "1",
                        },
                        {
                          label: (
                            <Button
                              type="link"
                              onClick={() => {
                                onSaveHouse(house._id);
                              }}
                              disabled={
                                houseSaveStatus === "checking" ||
                                houseSaveStatus === "saved" ||
                                houseSaveStatus === "error"
                              }
                              icon={<FaSave />}
                            >
                              Save
                            </Button>
                          ),
                          key: "2",
                        },
                      ]}
                      onOpenDropDown={() => {
                        checkHouseSaveStatus(house?._id);
                      }}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No Houses" />
            )}

            <div className="w-full flex justify-center items-center mt-1">
              {!isFetchingError &&
                !isFetchingHouses &&
                currentData?.length > 0 && (
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={homes.length}
                    onChange={onPageChange}
                  />
                )}
            </div>
          </div>
        </Col>

        <Col
          span={!isSmallScreen ? 12 : mode === "map" && 24}
          className={`${
            !isSmallScreen || (isSmallScreen && mode === "map")
              ? `${isSmallScreen && `h-[25rem]`}`
              : `hidden`
          }`}
        >
          <MapViewer data={homes} />
        </Col>
      </Row>
    </div>
  );
};

export default RentResults;
