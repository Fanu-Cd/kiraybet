import React from "react";
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
  Button,
  Divider,
  message,
} from "antd";
import useWindowSize from "../../hooks/useWindowSize";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import useLocalStorage from "../../hooks/useLocalStorage";
const Login = () => {
  const { Title, Text } = Typography;
  const router = useNavigate();
  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    pass: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const { width } = useWindowSize();
  const isSmallScreen = width < 900;

  const saveAndRedirectUser = (data) => {
    localStorage.setItem("userId", data.data._id);
    if (data?.data?.accountType === "tenant") {
      return router("/me");
    }
    return router("/owner");
  };

  const onSubmit = (data) => {
    login(data)
      .then((res) => {
        message.success("Success!");
        // reset();
        saveAndRedirectUser(res);
      })
      .catch((err) => {
        message.error("Some Error Occurred!");
      });
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className={`p-3 h-auto border rounded-md mx-auto shadow-md ${
        isSmallScreen ? `w-[80%]` : `w-[35%]`
      } mt-10`}
    >
      <Title level={4}>Log in</Title>
      <Row className="w-full h-full" gutter={[4, 4]}>
        <Col span={24} className="flex flex-col">
          <label>Email</label>
          <Input
            onChange={(e) => {
              setValue("email", e.target.value);
            }}
            status={`${errors.email ? `error` : ``}`}
            placeholder="abebe@gmail.com"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs">{errors.email.message}</Text>
          )}
        </Col>
        <Col span={24} className="flex flex-col">
          <label>Password</label>
          <Input.Password
            onChange={(e) => {
              setValue("pass", e.target.value);
            }}
            status={`${errors.pass ? `error` : ``}`}
            placeholder="At least 8 characters long"
          />
          {errors.pass && (
            <Text className="text-red-500 text-xs">{errors.pass.message}</Text>
          )}
        </Col>
        <Col span={24} className="mt-5">
          <Flex vertical align="center" justify="center">
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
              onClick={handleSubmit(onSubmit)}
            >
              Log in
            </Button>
            <Divider>Or</Divider>
            <Text>Don't have an account?</Text>
            <Link to={"/session/signup"}>
              <Button className="mt-5 bg-teal-400 text-white">
                Create Account
              </Button>
            </Link>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

export default Login;
