import { Button, Flex, Result, Typography } from "antd";
import { IoRefreshOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
const { Text } = Typography;
const FetchError = ({ description, onRefresh }) => {
  return (
    <Result
      status="error"
      title={
        description ? (
          description
        ) : (
          <Flex vertical justify="center" align="center">
            <Text className="text-sm text-red-500">Some Error Occurred</Text>
            {onRefresh && (
              <Button
                className="mt-2"
                onClick={onRefresh}
                icon={<IoRefreshOutline />}
              >
                Refresh
              </Button>
            )}
          </Flex>
        )
      }
      className="p-3"
      icon={
        <MdErrorOutline
          size={"2.5rem"}
          style={{ margin: "auto" }}
          color="red"
        />
      }
    />
  );
};

export default FetchError;
