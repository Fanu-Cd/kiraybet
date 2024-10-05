import { Col, Flex, Row, Select } from "antd";
import { useFilterContext } from "../../context/rent-filter-context";
import { useTranslation } from "react-i18next";
const RentFilter = () => {
  const {
    locationOptions,
    filters,
    setFilters,
    bedOptions,
    sizeOptions,
    typeOptions,
    priceRanges,
    countOptions,
  } = useFilterContext();
  const { t } = useTranslation();

  return (
    <Row className="my-3 min-h-[3rem] px-3" gutter={[10, 5]} align={"middle"}>
      <Col xs={24} sm={12} lg={6}>
        <Select
          placeholder={t("location")}
          options={locationOptions}
          value={filters.location}
          onChange={(val) => {
            setFilters({ ...filters, location: !val ? null : val });
          }}
          style={{ width: "100%" }}
          allowClear
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Select
          placeholder={t("price_range")}
          options={priceRanges}
          value={filters.priceRange}
          onChange={(val) => {
            setFilters({ ...filters, priceRange: !val ? null : val });
          }}
          style={{ width: "100%" }}
          allowClear
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Flex justify="space-between">
          <Select
            placeholder={t("type")}
            options={typeOptions}
            value={filters.type}
            onChange={(val) => {
              setFilters({ ...filters, type: !val ? null : val });
            }}
            allowClear
          />
          <Select
            placeholder={t("size")}
            options={sizeOptions}
            value={filters.size}
            onChange={(val) => {
              setFilters({ ...filters, size: !val ? null : val });
            }}
            allowClear
          />
          <Select
            placeholder={t("beds")}
            options={bedOptions}
            value={filters.bed}
            onChange={(val) => {
              setFilters({ ...filters, bed: !val ? null : val });
            }}
            allowClear
          />
        </Flex>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Flex justify="space-between">
          <Select
            placeholder={t(`count_limit`)}
            options={countOptions}
            value={filters.count}
            onChange={(val) => {
              setFilters({ ...filters, count: !val ? null : val });
            }}
            style={{ width: "100%" }}
            allowClear
          />
        </Flex>
      </Col>
    </Row>
  );
};

export default RentFilter;
