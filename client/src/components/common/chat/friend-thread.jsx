import { Avatar, Badge, Button, Flex, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaDotCircle, FaRemoveFormat } from "react-icons/fa";
import { MdOutlineClose, MdPersonOutline } from "react-icons/md";
const { Text } = Typography;
const FriendThread = ({ data, isFriendOnline, isActiveChat, unReadCount }) => {
  return (
    <Flex
      className={`w-full min-h-[3rem] ${
        isActiveChat && `bg-slate-100`
      } rounded-md p-2`}
      align="center"
      justify="space-between"
    >
      <Badge dot={data && isFriendOnline} className="w-[3rem]">
        <Avatar
          shape="square"
          size="large"
          icon={data ? <MdPersonOutline /> : <MdOutlineClose color="red" />}
          className={`w-full ${!data && `bg-white`}`}
        />
      </Badge>
      <Text
        className={`truncate overflow-hidden whitespace-nowrap ${
          data ? `w-[55%]` : `flex-1 line-through`
        } hidden sm:inline`}
      >
        {data ? `${data.fname} ${data.lname}` : "Deleted Account"}
      </Text>
      {data && unReadCount && (
        <div className="rounded-full w-[1.5rem] h-[1.5rem] border hidden sm:flex justify-center items-center bg-orange-500 text-white">
          {unReadCount}
        </div>
      )}
    </Flex>
  );
};

export default FriendThread;
