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
  notification,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import useWindowSize from "../../hooks/useWindowSize";
import {
  createNewAccount,
  getUserByEmail,
  getUserByPhone,
  sendVerificationCodeViaEmail,
} from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
const SignUp = () => {
  const router = useNavigate();
  const { Title, Text } = Typography;
  const newAccountSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid Email Format").nullable(),
    pnumber: Yup.string()
      .nullable()
      .matches(
        /^[9|7]\d*$/,
        "Phone number must start with 9 or 7 and contain only digits"
      )
      .test(
        "email-or-pnumber",
        "Either email or phone number is required",
        function (value) {
          const { email } = this.parent;
          return email || value;
        }
      ),
    pass: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    cpass: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("pass"), null], "Passwords must match"),
  });

  const {
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors: newAccountErrors },
  } = useForm({
    resolver: yupResolver(newAccountSchema),
    mode: "onChange",
  });

  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [isAccountTypeSelected, setIsAccountTypeSelected] = useState(false);
  const [accountType, setAccountType] = useState("tenant");
  const accountOptions = [
    {
      label: "Tenant",
      value: "tenant",
    },
    {
      label: "House Owner",
      value: "house_owner",
    },
  ];
  const { width } = useWindowSize();
  const isSmallScreen = width < 900;
  const isSmallerScreen = width < 720;


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
            style={{ width: `${isSmallScreen ? `80%` : `30%`}` }}
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

  const onSubmit = (data) => {
    if (!validateInput(data)) {
      return;
    }
    // if (data.email) {
    //   sendEmailVerification(data.email,'code');
    // }

    createNewAccount({
      ...data,
      accountType: accountType,
      pnumber: "0" + data.pnumber,
    })
      .then((res) => {
        notification.success({
          message: "Success",
          description: "Account Successfully Created!",
        });
        reset();
        router("/session/login");
      })
      .catch((err) => {
        message.error("Some Error Occurred!");
      });
  };

  const validateInput = async (data) => {
    let isValid = true;
    if (data.email) {
      const res = await getUserByEmail(data.email);
      if (res?.data) {
        setError("email", { message: "Email is taken" });
        isValid = false;
      }
    }
    if (data.pnumber) {
      const res = await getUserByPhone("0" + data.pnumber);
      if (res?.data) {
        setError("pnumber", { message: "Phone Number is taken" });
        isValid = false;
      }
    }

    return isValid;
  };

  // const sendEmailVerification = (email,code) => {
  //   sendVerificationCodeViaEmail(email, code)
  //     .then((res) => {
  //       message.success("Email sent,");
  //     })
  //     .catch((err) => {
  //       message.error("Some Error Occurred!");
  //     });
  // };

  //  const sendOTP=(pnumber)=>{

  //  }

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

      <Row className="w-full h-full" gutter={[4, 4]}>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>First Name</label>
          <Input
            onChange={(e) => {
              setValue("fname", e.target.value);
            }}
            status={`${newAccountErrors.fname ? `error` : ``}`}
            placeholder="Abebe"
          />
          {newAccountErrors.fname && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.fname.message}
            </Text>
          )}
        </Col>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>Last Name</label>
          <Input
            onChange={(e) => {
              setValue("lname", e.target.value);
            }}
            status={`${newAccountErrors.lname ? `error` : ``}`}
            placeholder="Bikila"
          />
          {newAccountErrors.lname && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.lname.message}
            </Text>
          )}
        </Col>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>Email</label>
          <Input
            onChange={(e) => {
              setValue("email", e.target.value);
            }}
            status={`${newAccountErrors.email ? `error` : ``}`}
            placeholder="abebe@gmail.com"
          />
          {newAccountErrors.email && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.email.message}
            </Text>
          )}
        </Col>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>Phone Number</label>
          <Space.Compact>
            <Input style={{ width: "20%" }} value="+251" disabled />
            <Input
              onChange={(e) => {
                setValue("pnumber", e.target.value);
              }}
              status={`${newAccountErrors.pnumber ? `error` : ``}`}
              style={{ width: "80%" }}
              placeholder="912345678"
              maxLength={9}
            />
          </Space.Compact>
          {newAccountErrors.pnumber && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.pnumber.message}
            </Text>
          )}
        </Col>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>Password</label>
          <Input.Password
            onChange={(e) => {
              setValue("pass", e.target.value);
            }}
            status={`${newAccountErrors.pass ? `error` : ``}`}
            placeholder="At least 8 characters long"
          />
          {newAccountErrors.pass && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.pass.message}
            </Text>
          )}
        </Col>
        <Col span={`${isSmallerScreen?24:12}`} className="flex flex-col">
          <label>Confirm Password</label>
          <Input
            onChange={(e) => {
              setValue("cpass", e.target.value);
            }}
            status={`${newAccountErrors.cpass ? `error` : ``}`}
            placeholder="At least 8 characters long"
          />
          {newAccountErrors.cpass && (
            <Text className="text-red-500 text-xs">
              {newAccountErrors.cpass.message}
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
              onClick={handleSubmit(onSubmit)}
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
    </Flex>
  );
};

export default SignUp;
