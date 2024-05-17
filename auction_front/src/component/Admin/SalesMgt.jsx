import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck";
import "../../css/Admin/SalesMgt.css";
import { DatePicker, Checkbox } from "antd";
import LoadingModal from "../include/LoadingModal";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;

function formatDate(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    console.error("Invalid date object:", date);
    return "";
  }
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day);
}

function SalesMgt() {
  const sessionId = useSelector(
    (state) => state["loginedInfos"]["loginedId"]["sessionId"]
  );
  const navigate = useNavigate();

  const chartRef = useRef(null);
  const [salesDataList, setSalesDataList] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    sessionCheck(sessionId, navigate);
    axios_sales_data();
  }, [sessionId, navigate]);

  const filteredData = useMemo(() => {
    return salesDataList.filter((data) => {
      const date = formatDate(new Date(data.AR_REG_DATE));
      const locationNum = data.AS_LOCATION_NUM;
      // 선택한 날짜 범위에 해당하는 데이터만 필터링
      return (
        (selectedDates.length === 0 || selectedDates.includes(date)) &&
        selectedLocations.includes(locationNum)
      );
    });
  }, [salesDataList, selectedDates, selectedLocations]);
  

  const categories = useMemo(() => {
    return [...new Set(salesDataList.map((data) => formatDate(new Date(data.AR_REG_DATE))))];
  }, [salesDataList]);

  useEffect(() => {
    setSelectedDates(categories);
  }, [categories]);

  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current;
      const ctx = canvas.getContext("2d");
  
      canvas.width = 800;
      canvas.height = 200;
  
      const createDataset = (locationNum) => ({
        label: `${locationNum}번 경매`,
        data: categories.map((date) => {
          const filteredLocationData = filteredData.filter(
            (data) =>
              formatDate(new Date(data.AR_REG_DATE)) === date &&
              data.AS_LOCATION_NUM === locationNum
          );
          return filteredLocationData.length > 0 ? filteredLocationData[0].AR_POINT : 0;
        }),
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`,
      });
  
      const datasets = selectedLocations.map((locationNum) => createDataset(locationNum));
  
      const filteredCategories = categories.filter((date) => selectedDates.includes(date));
  
      console.log("filteredCategories:", filteredCategories);
      console.log("selectedDates:", selectedDates);
  
      const chartData = {
        labels: filteredCategories,
        datasets: datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.filter((_, index) => selectedDates.includes(categories[index])),
        })),
      };

      const chartOptions = {
        plugins: {
          title: {
            display: true,
            text: "Sales Chart",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const locationNum = selectedLocations[context.datasetIndex];
                const formattedDate = context.label;
                const filteredTooltipData = salesDataList.filter(
                  (data) =>
                    formatDate(new Date(data.AR_REG_DATE)) === formattedDate &&
                    data.AS_LOCATION_NUM === locationNum
                );
                const grName = filteredTooltipData.length > 0 ? filteredTooltipData[0].GR_NAME : "";
                return `${grName}: ${context.formattedValue}`;
              },
            },
          },
          legend: {
            position: "right",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "가격",
            },
          },
        },
      };

      const chart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });

      return () => {
        chart.destroy();
      };
    }
  }, [filteredData, selectedDates, selectedLocations, categories, salesDataList]);

  async function axios_sales_data() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/get_sales_data`);
      console.log(response.data);
      setSalesDataList(response.data);
    } catch (error) {
      console.log(error);
      setError("데이터 로딩 중 오류가 발생했습니다.");
      setSalesDataList([]);
    } finally {
      setIsLoading(false);
    }
  }
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].toDate();
      const endDate = dates[1].toDate();
  
      const generatedDates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        generatedDates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      setSelectedDates(generatedDates);
    } else {
      // RangePicker가 선택된 상태가 아닌 경우, 모든 날짜를 선택한 것으로 간주합니다.
      const allDates = salesDataList.map((data) => formatDate(new Date(data.AR_REG_DATE)));
      setSelectedDates(allDates);
    }
  };

  const handleLocationChange = (checkedValues) => {
    setSelectedLocations(checkedValues);
  };

  return (
    <article className="sales-mgt">
      <div className="sales-mgt-title">SALES CHART</div>
      <div className="sales-mgt-filters">
        <div className="sales-mgt-date-filter">
          <RangePicker
            onChange={handleDateChange}
            defaultValue={[
              selectedDates.length > 0 ? parseDate(selectedDates[0]) : null,
              selectedDates.length > 0 ? parseDate(selectedDates[selectedDates.length - 1]) : null,
            ]}
            // format="YYYY-MM-DD"
          />
        </div>
        <div className="sales-mgt-location-filter">
          <Checkbox.Group
            options={[...Array(9)].map((_, index) => ({
              label: `${index + 1}번 경매`,
              value: index + 1,
            }))}
            value={selectedLocations}
            onChange={handleLocationChange}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingModal />
      ) : error ? (
        <div className="sales-mgt-error">
          {error}
          <button onClick={axios_sales_data}>다시 시도</button>
        </div>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </article>
  );
}

export default SalesMgt;