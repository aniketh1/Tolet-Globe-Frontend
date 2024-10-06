
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../constant/constant";
import axios from "axios";

const Filters = ({ SetIsOpen }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    bhk: [],
    residential: [],
    commercial: [],
    others: "",
    preferenceHousing: "",
    genderPreference: "",
    houseType: [],
  });

  const navigate = useNavigate();


  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => {
      if (Array.isArray(prevFilters[key])) {
        if (prevFilters[key].includes(value)) {
          return {
            ...prevFilters,
            [key]: prevFilters[key].filter(item => item !== value)
          };
        } else {
          return {
            ...prevFilters,
            [key]: [...prevFilters[key], value]
          };
        }
      } else {
        const newFilters = {
          ...prevFilters,
          [key]: prevFilters[key] === value ? "" : value,
        };
        if (key === "preferenceHousing" && value === "Family") {
          newFilters.genderPreference = "";
        }
        return newFilters;
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      bhk: [],
      residential: [],
      commercial: [],
      others: "",
      preferenceHousing: "",
      genderPreference: "",
      houseType: [],
    });
  };

  const seeResults = async () => {
    setIsLoading(true);
    const cleanedFilters = {
      ...filters,
      bhk: filters.bhk.map(bhk => bhk.replace(/[^0-9]/g, "")),
    };
    const queryString = Object.keys(cleanedFilters)
      .filter((key) => cleanedFilters[key].length > 0 || cleanedFilters[key] !== "")
      .map((key) => {
        const value = Array.isArray(cleanedFilters[key])
          ? cleanedFilters[key].map(encodeURIComponent).join(",")
          : encodeURIComponent(cleanedFilters[key]);
        return `${encodeURIComponent(key)}=${value}`;
      })
      .join("&");


    navigate(`/property-listing?${queryString}`);
    const url = `${BASE_URL}property/filter?${queryString}`;


    try {
      const response = await axios.get(url);
      console.log(response.data);
      setProperties(response.data.data); // Update properties with the filtered results
      if (response.data.data.length === 0) {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      SetIsOpen(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div>
          <p className="text-white font-bold text-2xl"></p>
        </div>
      )}
      <div className="lg:w-[450px] md:w-[380px] w-[320px] bg-white text-black flex flex-col justify-between rounded-b-2xl shadow-md">
        <div className="text-xl font-medium py-3 flex items-center justify-center border-b-2">
          <p>All Filters</p>
        </div>
        <div className="flex flex-col items-start justify-start p-4 gap-3">
          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">BHK</p>
            <div className="flex flex-wrap items-start gap-2 hover:cursor-pointer">
              {["+ 1 BHK", "+ 2 BHK", "+ 3 BHK", "+ 4 BHK", "+ >4 BHK"].map(
                (bhk, index) => (
                  <div
                    key={index}
                    className={`h-7 w-20 text-xs font-light border border-[#4A7F79] rounded-md flex items-center justify-center ${
                      filters.bhk.includes(bhk) ? "bg-[#4A7F79] text-white" : ""
                    }`}
                    onClick={() => handleFilterChange("bhk", bhk)}
                  >
                    {bhk}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">Residential</p>
            <div className="flex flex-wrap gap-2">

              {["+ Flat", "+ House/Villa"].map((type, index) => (
                <div
                  key={index}
                  className={`hover:cursor-pointer h-7 w-24 text-xs font-light border border-[#4A7F79] rounded-md flex items-center justify-center ${
                    filters.residential.includes(type) ? "bg-[#4A7F79] text-white" : ""
                  }`}
                  onClick={() => handleFilterChange("residential", type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">Commercial</p>
            <div className="flex flex-wrap items-start gap-2">
              {["+ Office Space", "+ Shop/Showroom", "+ Warehouse/Godown", "+ Building/Complex"].map((type, index) => (

                <div
                  key={index}
                  className={`hover:cursor-pointer h-7 w-32 text-xs font-light border border-[#4A7F79] rounded-md flex items-center justify-center ${
                    filters.commercial.includes(type) ? "bg-[#4A7F79] text-white" : ""
                  }`}
                  onClick={() => handleFilterChange("commercial", type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>


          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">Others</p>
            <div className="flex">

              <div
                className={`hover:cursor-pointer w-28 h-7 text-xs font-light border border-[#4A7F79] rounded-md flex items-center justify-center ${
                  filters.others === "+ Farm house" ? "bg-[#4A7F79] text-white" : ""
                }`}
                onClick={() => handleFilterChange("others", "+ Farm house")}
              >
                + Farm house
              </div>
            </div>
          </div>

          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">Preference Housing</p>
            <div className="flex flex-wrap gap-2 hover:cursor-pointer">
              <select
                className="h-7 w-28 text-xs font-light border border-[#4A7F79] rounded-md bg-white"
                value={filters.preferenceHousing}
                onChange={(e) => handleFilterChange("preferenceHousing", e.target.value)}
              >
                <option value="">Select one</option>
                <option value="Family">Family</option>
                <option value="Bachelors">Bachelors</option>
              </select>
              <select
                className={`h-7 w-28 text-xs font-light border rounded-md ${
                  filters.preferenceHousing === "Family"
                    ? "border-gray-300 text-gray-400 bg-gray-100"
                    : "border-[#4A7F79] text-black bg-white"
                }`}
                value={filters.genderPreference}
                onChange={(e) => handleFilterChange("genderPreference", e.target.value)}
                disabled={filters.preferenceHousing === "Family"}
              >
                <option value="">
                  {filters.preferenceHousing === "Family" ? "N/A for Family" : "Select Gender"}
                </option>
                {filters.preferenceHousing !== "Family" && (
                  <>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Both">Both</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="w-full mb-3">
            <p className="text-base font-medium text-[#696969] mb-2">House Type</p>
            <div className="flex flex-wrap items-start gap-2">
              {["Full-Furnished", "Semi-Furnished", "Non-Furnished"].map(
                (type, index) => (
                  <div
                    key={index}
                    className={`hover:cursor-pointer h-7 w-28 text-xs font-light border border-[#4A7F79] rounded-md flex items-center justify-center ${
                      filters.houseType.includes(type) ? "bg-[#4A7F79] text-white" : ""
                    }`}
                    onClick={() => handleFilterChange("houseType", type)}
                  >
                    {type}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t-2 py-3 px-4 flex items-center justify-center gap-4">
          <button
            className="h-9 w-32 border rounded-md border-[#40B5A8] text-[#40b5a8] text-sm font-light"
            onClick={resetFilters}
          >
            Reset filters
          </button>
          <button
            className="h-9 w-32 border rounded-md bg-[#40B5A8] border-[#4A7F79] text-white text-sm font-light"
            onClick={seeResults}
          >
            See Results
          </button>
        </div>
      </div>
    </>
  );
};

export default Filters;
