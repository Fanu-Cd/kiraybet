import { useParams } from "react-router-dom";
import {
  deleteRentHouseMedia,
  getHouseById,
  updateHouseById,
} from "../../services/api";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Image,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
  Typography,
} from "antd";
import {
  HomeOutlined,
  PictureOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FileUploader from "../../components/common/file-uploader";
import { FaMapMarkerAlt } from "react-icons/fa";
import MapLocator from "../../components/common/map-locator";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
const HouseSettings = () => {
  const { id } = useParams();
  const router = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [files, setFiles] = useState([]);
  const [hasChanges, setHasChanges] = useState(false); //use this to track changes
  const [isAvailable, setIsAvailable] = useState(false);
  const getHouseData = () => {
    setIsFetching(true);

    getHouseById(id)
      .then((res) => {
        const {
          title,
          type,
          size,
          beds,
          maxPeople,
          price,
          location,
          mediaFilePath,
          isNegotiable,
        } = res?.data;

        setFiles(
          res?.data?.mediaFilePath?.map((item, index) => ({
            index: index + 1,
            src: `http://localhost:3001/${item?.replaceAll("\\", "/")}`,
          }))
        );

        setLocation(res?.data?.location);

        setBasicInfoValue("name", title);
        setBasicInfoValue("type", type);
        setBasicInfoValue("size", size);
        setBasicInfoValue("beds", beds);
        setBasicInfoValue("count", maxPeople);
        setBasicInfoValue("price", price);
        setBasicInfoValue("isNegotiable", isNegotiable);
        setIsFetching(false);
        setBasicInput({ ...basicInput, id: res?.data?._id });
        setIsAvailable(res?.data?.isAvailable);
      })
      .catch((err) => {
        message.error("cant fech data");
      });
  };

  useEffect(() => {
    getHouseData();
  }, [id]);

  const { t } = useTranslation();
  const { Text, Title } = Typography;
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(1);

  const basicInfoValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(5, "Please Enter at least five characters"),
    size: Yup.string().required("Size is required"),
    type: Yup.string().required("Type is required"),
    price: Yup.number().required("Price is required"),
    beds: Yup.string().required("Beds is required"),
    count: Yup.string().required("Amount of people is required"),
  });

  const {
    handleSubmit: handleBasicInfoSubmit,
    setValue: setBasicInfoValue,
    getValues,
    watch,
    reset,
    formState: { errors: basicInfoErrors, isValid: isBasicInfoValid },
  } = useForm({
    resolver: yupResolver(basicInfoValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (Object.keys(getValues()).length > 0 && !isFetching)
      setBasicInput({ ...basicInput, ...getValues() });
  }, [getValues, isFetching]);

  const typeOptions = [
    { label: t("studio"), value: "studio" },
    { label: t("apartment"), value: "apartment" },
  ];
  const sizeOptions = [
    { label: `${t("size")} 2X2`, value: "2x2" },
    { label: `${t("size")} 3X2`, value: "3x2" },
    { label: `${t("size")} 3X4`, value: "3x4" },
  ];
  const bedOptions = [
    { label: `1 ${t(`beds`)}`, value: "1" },
    { label: `2  ${t(`beds`)}`, value: "2" },
    { label: `3  ${t(`beds`)}`, value: "3" },
  ];
  const countOptions = [
    { label: `${t(`only_1_person`)}`, value: "only-1" },
    { label: `${t(`upto_2_people`)}`, value: "max-2" },
    { label: `${t(`any`)}`, value: "any" },
  ];

  const [basicInput, setBasicInput] = useState({
    title: "",
    type: null,
    beds: null,
    count: null,
    price: "",
    size: null,
    isNegotiable: true,
  });

  const [fileList, setFileList] = useState([]);
  const [isUploadError, setIsUploadError] = useState(false);

  const isEmptyObject = (obj) => {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      Object.keys(obj).length === 0
    );
  };

  const onDelete = (file) => {
    deleteRentHouseMedia(basicInput.id, file.src?.split("rent-houses/")[1])
      .then((res) => {
        notification.success({ message: "File Successfully Removed" });
        getHouseData();
      })
      .catch((err) => {
        notification.error({ message: "Error deleting file" });
      });
  };

  const onSave = () => {
    if (isEmptyObject(basicInfoErrors)) {
      if (files?.length === 0 && fileList?.length === 0) {
        setIsUploadError(true);
        setActiveKey(2);
        return;
      }

      if (
        (fileList?.length > 0 || files?.length > 0) &&
        !fileList.find(
          (file) => file.type === "image/png" || file.type === "image/jpeg"
        ) &&
        !files.find(
          (file) => file.src.includes("png") || file.src.includes("jpg")
        )
      ) {
        setIsUploadError(true);
        setActiveKey(2);
        return;
      }

      if (!location) {
        setLocationError(true);
        return;
      }

      updateHouse();
    } else setActiveKey(1);
  };

  const getFinalData = () => {
    const data = getValues();
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("price", data.price);
    formData.append("beds", data.beds);
    formData.append("isNegotiable", data.isNegotiable);
    formData.append("isAvailable", isAvailable);
    formData.append("maxPeople", data.count);
    formData.append("size", data.size);
    formData.append("type", data.type);
    formData.append(
      "location",
      JSON.stringify({
        latitude: location.latitude || location.center[1],
        longitude: location.longitude || location.center[0],
        text: location.text,
      })
    );
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });
    return formData;
  };

  const updateHouse = () => {
    const data = getFinalData(basicInput);
    updateHouseById(basicInput.id, data)
      .then((res) => {
        notification.success({ message: "House Successfully updated!" });
        router("/owner/my-houses");
      })
      .catch((err) => {
        notification.error({ message: "Couldn't Update House!" });
      });
  };

  const { width } = useWindowSize();
  const isSmallScreen = width < 1000;
  const isSmallerScreen = width < 600;
  const isSmallestScreen = width < 400;

  const tabItems = [
    {
      key: 1,
      label: "Basic Info",
      icon: <HomeOutlined />,
      children: (
        <Flex vertical className="p-5">
          <Row className="w-full h-full" gutter={[10, 10]}>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Title</label>
              <Input
                onChange={(e) => {
                  setBasicInfoValue("name", e.target.value);
                }}
                status={`${basicInfoErrors.name ? `error` : ``}`}
                placeholder="Give your house some title"
                value={watch("name")}
              />
              {basicInfoErrors.name && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.name.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Type</label>
              <Select
                options={typeOptions}
                onChange={(val) => {
                  setBasicInfoValue("type", val);
                }}
                status={`${basicInfoErrors.type ? `error` : ``}`}
                placeholder="Is your house a studio or apartment"
                value={watch("type")}
              />
              {basicInfoErrors.type && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.type.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Size</label>
              <Select
                options={sizeOptions}
                onChange={(val) => {
                  setBasicInfoValue("size", val);
                }}
                status={`${basicInfoErrors.size ? `error` : ``}`}
                placeholder="What is the size of your house?"
                value={watch("size")}
              />
              {basicInfoErrors.size && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.size.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Beds</label>
              <Select
                options={bedOptions}
                onChange={(val) => {
                  setBasicInfoValue("beds", val);
                }}
                status={`${basicInfoErrors.beds ? `error` : ``}`}
                placeholder="How many beds does your house have?"
                value={watch("beds")}
              />
              {basicInfoErrors.beds && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.beds.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Price (ETB)</label>
              <InputNumber
                min={1}
                status={`${basicInfoErrors.price ? `error` : ``}`}
                onChange={(val) => {
                  setBasicInfoValue("price", val);
                }}
                className="w-full"
                placeholder="What is payment expected for the rent?"
                value={watch("price")}
              />
              {basicInfoErrors.price && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.price.message}
                </Text>
              )}
              <Checkbox
                className="mt-1"
                onChange={(e) => {
                  setBasicInfoValue("isNegotiable", e.target.checked);
                  setBasicInput({
                    ...basicInput,
                    isNegotiable: e.target.checked,
                  });
                }}
                checked={basicInput.isNegotiable}
                value={watch("isNegotiable")}
              >
                Negotiable
              </Checkbox>
            </Col>
            <Col span={isSmallerScreen ? 24 : 12} className="flex flex-col">
              <label>Maximum people allowed</label>
              <Select
                options={countOptions}
                onChange={(val) => {
                  setBasicInfoValue("count", val);
                }}
                status={`${basicInfoErrors.count ? `error` : ``}`}
                placeholder="How many people are allowed to live?"
                value={watch("count")}
              />
              {basicInfoErrors.count && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.count.message}
                </Text>
              )}
            </Col>
          </Row>
          {!isEmptyObject(basicInfoErrors) && (
            <Text className="text-center mt-2" type="danger">
              Please fill the specified inputs.
            </Text>
          )}
        </Flex>
      ),
    },
    {
      key: 2,
      label: "Media",
      icon: <PictureOutlined />,
      children: (
        <Row className="w-full" gutter={[5, 5]} justify={"center"}>
          <Col span={isSmallScreen ? 24 : 11}>
            <div className="w-full flex flex-col justify-center items-center">
              <Title level={4}>Uploaded Media</Title>
              <List
                itemLayout="horizontal"
                className="w-full"
                dataSource={files}
                renderItem={(file) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        title="Delete File ?"
                        onConfirm={() => {
                          onDelete(file);
                        }}
                      >
                        <Button type="link" icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Flex align="center" gap={5}>
                          <Title level={5}>{file.index}.</Title>
                          <div className="border rounded w-[5rem] h-[5rem]">
                            <Image
                              alt="picture"
                              className="w-full !h-[5rem] object-cover rounded-md"
                              src={file.src}
                            />
                          </div>
                        </Flex>
                      }
                      description={file.path}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Col>
          <Col span={isSmallScreen ? 24 : 1}>
            <Divider
              style={{ borderColor: "#7cb305" }}
              type={isSmallScreen ? `horizontal` : `vertical`}
              className={isSmallScreen ? "!w-full" : "h-full"}
            />
          </Col>
          <Col span={isSmallScreen ? 24 : 12}>
            <div className="w-full flex flex-col justify-center items-center">
              <Title level={4}>Add New Files</Title>
              <FileUploader
                maxSize={2}
                fileList={fileList}
                setFileList={setFileList}
              />
              {isUploadError && (
                <Text className="text-center mt-2" type="danger">
                  Please upload at least one image.
                </Text>
              )}
            </div>
          </Col>
        </Row>
      ),
    },
    {
      key: 3,
      label: "Location",
      icon: <EnvironmentOutlined className="align-middle" />,
      children: (
        <Flex vertical className="p-5" justify="center" align="center" gap={10}>
          <Text>Where is your rent house located?</Text>
          <Button
            type="primary"
            icon={<FaMapMarkerAlt />}
            onClick={() => {
              setIsMapOpen(true);
            }}
          >
            Select on Map
          </Button>
          {location && (
            <Text className="text-center text-sm">
              Your house is located around{" "}
              <b>{location?.text} , Addis Ababa.</b>
            </Text>
          )}
          {locationError && (
            <Text className="text-center text-sm text-red">
              Location is required
            </Text>
          )}
        </Flex>
      ),
    },
    {
      key: 4,
      label: "Availability",
      icon: <CheckCircleOutlined />,
      children: (
        <Flex vertical align="center" justify="center" gap={10}>
          <Text className="text-lg">Is this house available for rent now?</Text>
          <Switch
            checked={isAvailable}
            checkedChildren="Yes"
            unCheckedChildren="No"
            onChange={(val) => {
              setIsAvailable(val);
            }}
          />
        </Flex>
      ),
    },
    {
      key: 5,
      label: "Finish",
      icon: <SaveOutlined />,
      children: (
        <Flex vertical align="center" justify="center" gap={10}>
          <Text>Click Save to Finish.</Text>
          <Button
            type="primary"
            onClick={() => {
              handleBasicInfoSubmit(onSave)();
            }}
          >
            Save
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center w-full">
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        items={tabItems}
        className="w-full"
      />
      <Modal
        open={isMapOpen}
        width={"80%"}
        onClose={() => {
          setIsMapOpen(false);
        }}
        onCancel={() => {
          setIsMapOpen(false);
        }}
        onOk={() => {
          setIsMapOpen(false);
        }}
        maskClosable={false}
        title="Map"
      >
        <MapLocator
          onLocationSelect={(location) => {
            if (Array.isArray(location)) {
              const finalLoc = location.find(
                (item) => item.place_type[0] === "municipality"
              );
              setLocation(finalLoc);
            }
          }}
        />
        <div className="mx-auto flex justify-center mt-2">
          <Text>
            {location === "loading" ? (
              <Flex align="center" gap={3}>
                <Spin indicator={<LoadingOutlined spin />} size="small" />
                <Text>Loading...</Text>
              </Flex>
            ) : location === "error" ? (
              "Some error occurred!"
            ) : (
              location && (
                <b>
                  {`Your house is located at :
              ${location?.text}`}{" "}
                  , Addis Ababa
                </b>
              )
            )}
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default HouseSettings;
