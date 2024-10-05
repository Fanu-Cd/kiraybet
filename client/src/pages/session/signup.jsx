import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Flex,
  Grid,
  Col,
  Input,
  Row,
  Typography,
  Select,
  Button,
  Divider,
  Space,
  Checkbox,
  message,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { IoArrowBackOutline } from "react-icons/io5";
import useWindowSize from "../../hooks/useWindowSize";
import ReCAPTCHA from "react-google-recaptcha";
import { createNewAccount, verifyRecaptcha } from "../../services/api";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { Title, Text } = Typography;
  const tenantAccountSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    email: Yup.string().required("Email is required"),
    pnumber: Yup.string()
      .required("Phone Number is required")
      .matches(
        /^[9|7]\d*$/,
        "Phone number must start with 9 or 7 and contain only digits"
      ),
    pass: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    cpass: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("pass"), null], "Passwords must match"),
  });

  const {
    handleSubmit: handleTenantAccountSubmit,
    setValue: setTenantAccountValue,
    getValues,
    reset,
    formState: { errors: tenantAccountErrors, isValid: isTenantAccountValid },
  } = useForm({
    resolver: yupResolver(tenantAccountSchema),
    mode: "onChange",
  });

  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);

  const [isAccountTypeSelected, setIsAccountTypeSelected] = useState(false);
  const [accountType, setAccountType] = useState("tenant");
  const [accountOptions, setAccountOptions] = useState([
    {
      label: "Tenant",
      value: "tenant",
    },
    {
      label: "House Owner",
      value: "house_owner",
    },
  ]);
  const { width } = useWindowSize();
  const isSmallScreen = width < 900;

  if (!isAccountTypeSelected) {
    return (
      <div className="w-[50%] mx-auto mt-10 border rounded-md p-3">
        <Title className="text-center" level={4}>
          Choose Account Type
        </Title>
        <form
          className="w-full flex flex-col justify-center items-center"
          onSubmit={() => {
            setIsAccountTypeSelected(true);
          }}
        >
          <Select
            value={accountType}
            onChange={(val) => {
              setAccountType(val);
            }}
            options={accountOptions}
            style={{ width: "50%" }}
          />
          <Button
            type="primary"
            htmlType="submit"
            className="mt-3"
            iconPosition="end"
            icon={<ArrowRightOutlined />}
          >
            Create Account
          </Button>
        </form>
      </div>
    );
  }

  const onTenantAccountSubmit = (data) => {
    // console.log("here", data);
    createNewAccount({ ...data, accountType: accountType })
      .then((res) => {
        message.success("Account Successfully Created!");
        reset();
      })
      .catch((err) => {
        message.error("Some Error Occurred!");
      });
  };
  // const [recaptchaStatus, setRecapthcaStatus] = useState("");
  // const checkRecaptcha = (token) => {
  //   setRecapthcaStatus("checking");
  //   verifyRecaptcha(token)
  //     .then((res) => {
  //       console.log("res", res);
  //       if (!res?.message === "Error") {
  //         setRecapthcaStatus("success");
  //         return;
  //       }
  //       setRecapthcaStatus("error");
  //     })
  //     .catch((err) => {
  //       setRecapthcaStatus("error");
  //       console.log("error", err);
  //     });
  // };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className={`p-3 h-auto border rounded-md mx-auto shadow-md ${
        isSmallScreen ? `w-[80%]` : `w-[50%]`
      } mt-10`}
    >
      <Title level={4}>Create New Account</Title>
      <Flex className="text-sm" align="center">
        <Text>
          Account Type :{" "}
          <b>
            {accountOptions.find((item) => item.value === accountType).label}
          </b>
        </Text>
        <Button
          type="link"
          onClick={() => {
            setIsAccountTypeSelected(false);
          }}
          className="text-xs"
        >
          Change
        </Button>
      </Flex>

      {/* {accountType === "tenant" ? ( */}
        <Row className="w-full h-full" gutter={[4, 4]}>
          <Col span={12} className="flex flex-col">
            <label>First Name</label>
            <Input
              onChange={(e) => {
                setTenantAccountValue("fname", e.target.value);
              }}
              status={`${tenantAccountErrors.fname ? `error` : ``}`}
              placeholder="Abebe"
            />
            {tenantAccountErrors.fname && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.fname.message}
              </Text>
            )}
          </Col>
          <Col span={12} className="flex flex-col">
            <label>Last Name</label>
            <Input
              onChange={(e) => {
                setTenantAccountValue("lname", e.target.value);
              }}
              status={`${tenantAccountErrors.lname ? `error` : ``}`}
              placeholder="Bikila"
            />
            {tenantAccountErrors.lname && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.lname.message}
              </Text>
            )}
          </Col>
          <Col span={12} className="flex flex-col">
            <label>Email</label>
            <Input
              onChange={(e) => {
                setTenantAccountValue("email", e.target.value);
              }}
              status={`${tenantAccountErrors.email ? `error` : ``}`}
              placeholder="abebe@gmail.com"
            />
            {tenantAccountErrors.email && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.email.message}
              </Text>
            )}
          </Col>
          <Col span={12} className="flex flex-col">
            <label>Phone Number</label>
            <Space.Compact>
              <Input style={{ width: "20%" }} value="+251" disabled />
              <Input
                onChange={(e) => {
                  setTenantAccountValue("pnumber", e.target.value);
                }}
                status={`${tenantAccountErrors.pnumber ? `error` : ``}`}
                style={{ width: "80%" }}
                placeholder="912345678"
                maxLength={8}
              />
            </Space.Compact>
            {tenantAccountErrors.pnumber && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.pnumber.message}
              </Text>
            )}
          </Col>
          <Col span={12} className="flex flex-col">
            <label>Password</label>
            <Input.Password
              onChange={(e) => {
                setTenantAccountValue("pass", e.target.value);
              }}
              status={`${tenantAccountErrors.pass ? `error` : ``}`}
              placeholder="At least 8 characters long"
            />
            {tenantAccountErrors.pass && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.pass.message}
              </Text>
            )}
          </Col>
          <Col span={12} className="flex flex-col">
            <label>Confirm Password</label>
            <Input
              onChange={(e) => {
                setTenantAccountValue("cpass", e.target.value);
              }}
              status={`${tenantAccountErrors.cpass ? `error` : ``}`}
              placeholder="At least 8 characters long"
            />
            {tenantAccountErrors.cpass && (
              <Text className="text-red-500 text-xs">
                {tenantAccountErrors.cpass.message}
              </Text>
            )}
          </Col>
          <Col span={24} className="mt-5">
            <Flex vertical align="center" justify="center">
              <Checkbox
                onChange={(v) => {
                  setIsAgreedToTerms(!v.target.value);
                }}
                value={isAgreedToTerms}
              >
                I agree to the{" "}
                <a href="/terms" className="underline text-teal-400">
                  terms and conditions
                </a>
                &nbsp;of the kiraybet pltform and Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Adipisci animi.
              </Checkbox>
              {/* <div className="my-2 w-[60%] flex flex-col justify-center">
                <ReCAPTCHA
                  sitekey={recaptchaKey}
                  onChange={(v) => {
                    checkRecaptcha(v);
                  }}
                  className="w-full"
                />
                {
                  <Text className="text-center">
                    {recaptchaStatus === "checking"
                      ? "Verifying Recaptcha..."
                      : recaptchaStatus === "error"
                      ? "Couldn't verify recapthcha!"
                      : recaptchaStatus === "success" && "Recaptcha Verified!"}
                  </Text>
                }
              </div> */}
              <Button
                type="primary"
                className="mt-5"
                disabled={!isAgreedToTerms}
                onClick={handleTenantAccountSubmit(onTenantAccountSubmit)}
              >
                Create Account
              </Button>
              <Divider>Or</Divider>
              <Text>Already have an account?</Text>
              <Link to={"/session/login"}>
                <Button className="mt-5 bg-teal-400 text-white">Log in</Button>
              </Link>
            </Flex>
          </Col>
        </Row>
      {/* // ) : ( */}
      {/* //   <div>owner account form</div> */}
      {/* // )} */}
    </Flex>
  );
};

export default SignUp;
