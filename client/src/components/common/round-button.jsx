import { Typography } from "antd";
const { Text } = Typography;
export const RoundButton = ({
  text,
  icon,
  radius,
  color,
  bgColor,
  padding,
}) => {
  return (
    <button
      className={`btn flex items-center ${radius && `rounded-2xl`} ${
        color && `text-${color}`
      } ${bgColor && `bg-${bgColor}`} p-3`}
    >
      {icon && icon}
      {text && <Text className={`text-${`black`} ms-2`}>{text}</Text>}
    </button>
  );
};
