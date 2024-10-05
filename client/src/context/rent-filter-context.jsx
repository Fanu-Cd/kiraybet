import { t } from "i18next";
import React, { createContext, useState, useContext } from "react";
import { subCities } from "../utils/sub-cities";

const FilterContext = createContext();
export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    location: null,
    priceRange: null,
    type: null,
    size: null,
    bed: null,
    count: null,
  });
  const locationOptions = subCities;
  const priceRanges = [
    {
      label: `${t("price")} : 10${t("thousand")}-40${t("thousand")}`,
      value: "min-10-max-40",
    },
    {
      label: `${t("price")} : 40${t("thousand")}-100${t("thousand")}`,
      value: "min-40-max-100",
    },
  ];
  const typeOptions = [
    { label: t("studio"), value: "studio" },
    { label: t("apartment"), value: "apartment" },
  ];
  const sizeOptions = [
    { label: `${t("size")} 2X2`, value: "2X2" },
    { label: `${t("size")} 3X2`, value: "3X2" },
    { label: `${t("size")} 3X4`, value: "3X4" },
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

  return (
    <FilterContext.Provider
      value={{
        filters,
        locationOptions,
        setFilters,
        priceRanges,
        typeOptions,
        sizeOptions,
        bedOptions,
        countOptions,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
