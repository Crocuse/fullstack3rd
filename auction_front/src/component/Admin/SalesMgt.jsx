import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck";

function SalesMgt() {
  const sessionId = useSelector(
    (state) => state["loginedInfos"]["loginedId"]["sessionId"]
  );
  const navigate = useNavigate();

  const chartRef = useRef(null);
  const [salesDataList, setSalesDataList] = useState([]);

  useEffect(() => {
    sessionCheck(sessionId, navigate);
    axios_sales_data();
  }, [sessionId, navigate]);

  useEffect(() => {
    if (salesDataList && salesDataList.length > 0) {
      const categories = [...new Set(salesDataList.map((data) => data.AR_REG_DATE.split(" ")[0]))];
      const createAuctionSeries = (locationNum) => ({
        name: `${locationNum}번 경매`,
        data: categories.map((date) => {
          const filteredData = salesDataList.filter(
            (data) =>
              data.AR_REG_DATE.split(" ")[0] === date &&
              data.AS_LOCATION_NUM === locationNum
          );
          return filteredData.length > 0 ? filteredData[0].AR_POINT : 0;
        }),
      });

      const options = {
        series: [
          createAuctionSeries(1),
          createAuctionSeries(2),
          createAuctionSeries(3),
          createAuctionSeries(4),
          createAuctionSeries(5),
          createAuctionSeries(6),
          createAuctionSeries(7),
          createAuctionSeries(8),
          createAuctionSeries(9),
        ],
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          type: "category",
          categories: categories,
          tickPlacement: "on",
          tickAmount: categories.length < 30 ? "dataPoints" : undefined,
          labels: {
            formatter: function(value, timestamp, opts) {
              if (categories.length < 30) {
                return value;
              } else {
                const date = new Date(value);
                const month = date.toLocaleString('default', { month: 'short' });
                return month;
              }
            },
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              colors: [],
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          title: {
            text: "가격",
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
              const locationNum = seriesIndex + 1;
              const formattedDate = w.globals.categoryLabels[dataPointIndex];
              const filteredData = salesDataList.filter(
                (data) =>
                  data.AR_REG_DATE.split(" ")[0] === formattedDate &&
                  data.AS_LOCATION_NUM === locationNum
              );
              console.log(formattedDate);
              const grName = filteredData.length > 0 ? filteredData[0].GR_NAME : "";
              return `${grName}`;
            },
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [salesDataList]);

  async function axios_sales_data() {
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/get_sales_data`);
      console.log(response.data);
      setSalesDataList(response.data);
    } catch (error) {
      console.log(error);
      setSalesDataList([]);
    }
  }

  return (
    <article>
      <div>SalesMgt</div>

      <div ref={chartRef} style={{ width: "1200px", height: "400px" }}></div>
    </article>
  );
}

export default SalesMgt;