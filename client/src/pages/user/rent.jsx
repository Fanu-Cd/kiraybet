import { Col, Flex, Grid, Row } from "antd";
import RentFilter from "../../components/user/rent-filter";
import RentResults from "../../components/user/rent-results";
import { FilterProvider } from "../../context/rent-filter-context";

const Rent = () => {
  return (
    <FilterProvider>
      <Flex vertical>
        <RentFilter />
        <RentResults />
      </Flex>
    </FilterProvider>
  );
};

export default Rent;
