import {
  ArrowLeftOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Select,
  Steps,
  Typography,
  theme,
  message,
  Flex,
  Input,
  InputNumber,
  Modal,
  Spin,
  Checkbox,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import FileUploader from "../../components/common/file-uploader";
import { FaMap, FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import MapLocator from "../../components/common/map-locator";
import { useSession } from "../../context/session-provider";
import { createNewRentHouse } from "../../services/api";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
const NewHouse = () => {
  const router = useNavigate();
  const { t } = useTranslation();
  const { Text, Title } = Typography;
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const basicInfoValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(5, "Please Enter at least 5 characters"),
    size: Yup.string().required("Size is required"),
    type: Yup.string().required("Type is required"),
    price: Yup.number().required("Price is required"),
    beds: Yup.string().required("Beds is required"),
    count: Yup.string().required("Amount of People is required"),
  });

  const {
    handleSubmit: handleBasicInfoSubmit,
    setValue: setBasicInfoValue,
    getValues,
    reset: resetBasicInfo,
    watch,
    formState: { errors: basicInfoErrors, isValid: isBasicInfoValid },
  } = useForm({
    resolver: yupResolver(basicInfoValidationSchema),
    mode: "onChange",
  });

  const watchName = watch("name");
  const watchBeds = watch("beds");
  const watchPrice = watch("price");
  const watchType = watch("type");
  const watchSize = watch("size");
  const watchCount = watch("count");

  useEffect(() => {
    if (Object.keys(getValues()).length > 0) setBasicInput(getValues());
  }, [getValues]);

  const next = (data) => {
    if (current === 0 && isEmptyObject(basicInfoErrors))
      setCurrent(current + 1);
    else if (
      current === 1 &&
      (fileList.length === 0 ||
        (fileList.length > 0 &&
          !fileList.find(
            (file) => file.type === "image/png" || file.type === "image/jpeg"
          )))
    ) {
      setIsUploadError(true);
      return;
    } else if (current === 1) {
      setCurrent(current + 1);
    } else if (current === 2 && !location) {
      setLocationError(true);
      return;
    } else if (current === 2) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const isEmptyObject = (obj) => {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      Object.keys(obj).length === 0
    );
  };

  const [fileList, setFileList] = useState([]);
  const [isUploadError, setIsUploadError] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isViewFileModalOpen, setIsViewFileModalOpen] = useState(false);
  const { width } = useWindowSize();
  const isSmallScreen = width < 1000;
  const isSmallerScreen = width < 600;
  const isSmallestScreen = width < 400;

  const steps = [
    {
      title: "Basic Details",
      content: (
        <Flex vertical className="p-5 min-h-[15rem]">
          <Row className="w-full h-full" gutter={[10, 10]}>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Title</label>
              <Input
                onChange={(e) => {
                  setBasicInfoValue("name", e.target.value);
                }}
                status={`${basicInfoErrors.name ? `error` : ``}`}
                placeholder="Give your house some title"
                value={watchName}
              />
              {basicInfoErrors.name && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.name.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Type</label>
              <Select
                options={typeOptions}
                onChange={(val) => {
                  setBasicInfoValue("type", val);
                }}
                status={`${basicInfoErrors.type ? `error` : ``}`}
                placeholder="Is your house a studio or apartment"
                value={watchType}
              />
              {basicInfoErrors.type && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.type.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Size</label>
              <Select
                options={sizeOptions}
                onChange={(val) => {
                  setBasicInfoValue("size", val);
                }}
                status={`${basicInfoErrors.size ? `error` : ``}`}
                placeholder="What is the size of your house?"
                value={watchSize}
              />
              {basicInfoErrors.size && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.size.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Beds</label>
              <Select
                options={bedOptions}
                onChange={(val) => {
                  setBasicInfoValue("beds", val);
                }}
                status={`${basicInfoErrors.beds ? `error` : ``}`}
                placeholder="How many beds does your house have?"
                value={watchBeds}
              />
              {basicInfoErrors.beds && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.beds.message}
                </Text>
              )}
            </Col>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Price (ETB)</label>
              <InputNumber
                min={1}
                status={`${basicInfoErrors.price ? `error` : ``}`}
                onChange={(val) => {
                  setBasicInfoValue("price", val);
                }}
                className="w-full"
                placeholder="What is payment expected for the rent?"
                value={watchPrice}
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
              >
                Negotiable
              </Checkbox>
            </Col>
            <Col span={isSmallScreen ? 24 : 12} className="flex flex-col">
              <label>Maximum people allowed</label>
              <Select
                options={countOptions}
                onChange={(val) => {
                  setBasicInfoValue("count", val);
                }}
                status={`${basicInfoErrors.count ? `error` : ``}`}
                placeholder="How many people are allowed to live?"
                value={watchCount}
              />
              {basicInfoErrors.count && (
                <Text className="text-red-500 text-xs">
                  {basicInfoErrors.count.message}
                </Text>
              )}
            </Col>
          </Row>
        </Flex>
      ),
    },
    {
      title: "Upload Media",
      content: (
        <Flex
          vertical
          className="p-5 min-h-[15rem]"
          justify="center"
          align="center"
          gap={10}
        >
          <Text className="font-semibold text-center">
            Upload upto five images or videos that describe your house (at least
            one image is mandatory)
          </Text>
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
        </Flex>
      ),
    },
    {
      title: "Location",
      content: (
        <Flex
          vertical
          className="p-5 min-h-[15rem]"
          justify="center"
          align="center"
          gap={10}
        >
          <Text className="text-center">Where is your rent house located?</Text>
          <Button
            type="primary"
            icon={<FaMapMarkerAlt />}
            onClick={() => {
              setIsMapOpen(true);
            }}
          >
            Map
          </Button>
          {location && (
            <Text className="text-center text-sm">
              Your house is located around{" "}
              <b>{location?.text} , Addis Ababa.</b>
            </Text>
          )}
          {locationError && (
            <Text className="text-center text-sm text-red-600">
              Location is required
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Review & Finish",
      content: (
        <Flex vertical align="center" justify="center" className="p-3">
          <Title level={4}>Review Your inputs</Title>
          <Flex vertical className="p-5">
            <Title level={5}>Basic Details</Title>
            <Row className="w-full h-full" gutter={[10, 10]}>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Title</label>
                <Text>{basicInput.name}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Type</label>
                <Text>{basicInput.type}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Size</label>
                <Text>{basicInput.size}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Beds</label>
                <Text>{basicInput.beds}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Price (ETB)</label>
                <Text>
                  {basicInput.price} ({" "}
                  {basicInput.isNegotiable ? "Negotiable" : "Fixed"} )
                </Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12} className="flex flex-col">
                <label>Maximum people allowed</label>
                <Text>{basicInput.count}</Text>
              </Col>
            </Row>

            <Title className="mt-3" level={5}>
              Media Uploads
            </Title>
            <Row>
              {fileList.map((file) => (
                <>
                  <Col span={isSmallestScreen ? 24 : 12}>{file.name}</Col>
                  <Col span={isSmallestScreen ? 24 : 12}>
                    <Button
                      icon={<EyeOutlined />}
                      type="text"
                      onClick={() => {
                        setSeletedFile(file);
                        setIsViewFileModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </Col>
                </>
              ))}
            </Row>

            <Title className="mt-3" level={5}>
              Location
            </Title>
            <Row>
              <Col span={isSmallestScreen ? 24 : 12}>Latitude</Col>
              <Col span={isSmallestScreen ? 24 : 12}>
                <Text>{location?.geometry?.coordinates[0]?.toFixed(3)}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12}>Longitude</Col>
              <Col span={isSmallestScreen ? 24 : 12}>
                <Text>{location?.geometry?.coordinates[1]?.toFixed(3)}</Text>
              </Col>
              <Col span={isSmallestScreen ? 24 : 12}>Place</Col>
              <Col span={isSmallestScreen ? 24 : 12}>
                <Text>{location?.text}</Text>
              </Col>
            </Row>
          </Flex>
        </Flex>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const [selectedFile, setSeletedFile] = useState(null);
  const contentStyle = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
    marginTop: 16,
  };

  const { session, setSession } = useSession();

  const getFinalData = () => {
    const data = getValues();
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("price", data.price);
    formData.append("beds", data.beds);
    formData.append(
      "isNegotiable",
      data.isNegotiable !== undefined ? data.isNegotiable : false
    );
    formData.append("maxPeople", data.count);
    formData.append("size", data.size);
    formData.append("type", data.type);
    formData.append(
      "location",
      JSON.stringify({
        latitude: location.center[1],
        longitude: location.center[0],
        text: location.text,
      })
    );
    formData.append("ownerId", session?._id);
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });
    return formData;
  };

  const onSubmit = () => {
    const data = getFinalData();
    createNewRentHouse(data)
      .then((res) => {
        notification.success({
          message: "House Successfully Added!",
          description: "Your house is posted!",
        });
        reset();
        router("/owner/my-houses");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const reset = () => {
    resetBasicInfo();
    setLocation(null);
    setFileList([]);
  };

  return (
    <div className="w-full">
      <Link to={"/owner/my-houses"}>
        <Button type="link" icon={<ArrowLeftOutlined />}>
          Back
        </Button>
      </Link>
      <Text className="text-lg block text-center">Post New House</Text>
      <div
        className={`${isSmallerScreen ? `w-[100%]` : `w-[80%]`} mx-auto mt-5`}
      >
        <form>
          <>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
              {current < steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => {
                    if (current === 0) {
                      handleBasicInfoSubmit(next)();
                      return;
                    }
                    next();
                  }}
                >
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button
                  className={`${isSmallestScreen ? `!mt-2 mx-0` : `ms-2`}`}
                  onClick={() => prev()}
                >
                  Previous
                </Button>
              )}
            </div>
          </>
        </form>
      </div>

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

      <Modal
        open={isViewFileModalOpen}
        width={"80%"}
        onClose={() => {
          setIsViewFileModalOpen(false);
        }}
        onCancel={() => {
          setIsViewFileModalOpen(false);
        }}
        footer={[]}
        title="View Uploaded File"
      >
        {selectedFile && (
          <Flex vertical className="w-full h-auto gap-3">
            <Text className="text-lg font-bold">{selectedFile.name}</Text>
            <img
              src={URL.createObjectURL(selectedFile.originFileObj)} // Create URL for preview
              alt={`preview-${selectedFile.name}`}
              style={{ height: "500px", objectFit: "cover" }}
              className="w-full"
            />
          </Flex>
        )}
      </Modal>
    </div>
  );
};

export default NewHouse;
