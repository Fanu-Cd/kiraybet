import {
  Button,
  Col,
  Flex,
  Pagination,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { useFilterContext } from "../../context/rent-filter-context";
import Card1 from "../common/card1";
import MapViewer from "../common/map-viewer";
import { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";

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
  const homes = [
    {
      title: "ባለሁለት መኝታ",
      price: "3000",
      location: ["ሜክሲኮ / Mexico", "አዲስ አበባ / Addis Ababa"],
      src: "https://images.pexels.com/photos/7031405/pexels-photo-7031405.jpeg?auto=compress&cs=tinysrgb&w=600",
      isNegotiable: true,
      accommodation: { room: 4, bed: 2, bath: 1 },
      coordinates: [9.0108, 38.7613],
    },
    {
      title: "ባለሶስት መኝታ",
      src: "https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "4000",
      isNegotiable: false,
      location: ["ካሳንቺስ / Kasanchis"],
      accommodation: { room: 3, bed: 1, bath: 1 },
      coordinates: [8.9806, 38.7993],
    },
    {
      title: "አፓርትመንት",
      src: "https://images.pexels.com/photos/7031414/pexels-photo-7031414.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "3500",
      isNegotiable: true,
      location: ["ኡራኢል / Urael"],
      accommodation: { room: 6, bed: 3, bath: 2 },
      coordinates: [9.0364, 38.7613],
    },
    {
      title: "ሙሉ ግቢ",
      src: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "2500",
      isNegotiable: true,
      location: ["መገናኛ / Megenagna"],
      accommodation: { room: 2, bed: 1, bath: 0 },
      coordinates: [9.0373, 38.7616],
    },
    {
      title: "ባለ አራት ክፍል",
      src: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "1750",
      isNegotiable: true,
      location: ["ኮዬፈጬ / Koyiefechie"],
      accommodation: { room: 2, bed: 1, bath: 0 },
      coordinates: [9.0373, 38.7616],
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = homes.slice(startIndex, startIndex + PAGE_SIZE);
  const [mode, setMode] = useState("list");
  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const { t } = useTranslation();
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
            <Text className="font-bold">12000 {`${t(`homes`)}`}</Text>
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
            <Row gutter={[5, 5]}>
              {[...currentData].map((home, index) => (
                <Col span={12} className="min-h-[15rem]">
                  <Card1 data={home} key={index} />
                </Col>
              ))}
            </Row>
            <div className="w-full flex justify-center items-center mt-1">
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={homes.length}
                onChange={onPageChange}
              />
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
