import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Button, Flex, Space } from "antd";
import { Typography } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const MapViewer = ({ data }) => {
  const { Text } = Typography;
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  const { t } = useTranslation();

  return (
    <MapContainer
      center={[9.0366, 38.761]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item, index) => (
        <Marker
          key={index}
          position={[item.coordinates[0], item.coordinates[1]]}
        >
          <Popup>
            <Flex vertical align="center" justify="center">
              <Text className="font-bold w-full">{item.title}</Text>
              <Flex>
                <FaMapMarkerAlt color="teal" />
                {item.location.map(
                  (itm, index) =>
                    `${itm}${
                      item.location.indexOf(item.location[index + 1]) !== -1
                        ? `, `
                        : ``
                    }`
                )}
              </Flex>
              <Link to={`/me/rent/${item._id}`}>
                <Button
                  type="primary"
                  size="small"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  className="mt-2"
                >
                  {t("view")}
                </Button>
              </Link>
            </Flex>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapViewer;
