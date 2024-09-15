import React from "react";
import { useLanguage } from "../context/language-provider";
import { Flex, Select } from "antd";
import { CircleFlag } from "react-circle-flags";
const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage("en"); // Access current language and changeLanguage function from context

  return (
    <Flex align="center" gap={3}>
      <CircleFlag
        countryCode={language === "en" ? "gb-eng" : "et"}
        className="h-[1rem]"
      />

      <Select
        value={language}
        onChange={(val) => {
          changeLanguage(val);
        }}
      >
        <Select.Option value="en">En</Select.Option>
        <Select.Option value="am">Am</Select.Option>
      </Select>
    </Flex>
  );
};

export default LanguageSwitcher;
