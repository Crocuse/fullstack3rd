import React, { useEffect, useRef, useState } from "react";
import ApexCharts from 'apexcharts';
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";

function SalesMgt() {
  const chartRef = useRef(null);
  const [salesDataList, setSalesDataList] = useState([]);


  useEffect(() => {

    axios_sales_data();

    const options = {
      series: [
        { name: '1번 경매', data: [44, 55, 41, 67, 22, 43] },
        { name: '2번 경매', data: [13, 23, 20, 8, 13, 27] },
        { name: '3번 경매', data: [11, 17, 15, 15, 21, 14] },
        { name: '4번 경매', data: [21, 7, 25, 13, 22, 8] },
        { name: '5번 경매', data: [21, 7, 25, 13, 22, 8] },
        { name: '6번 경매', data: [21, 7, 25, 13, 22, 8] },
        { name: '7번 경매', data: [21, 7, 25, 13, 22, 8] },
        { name: '8번 경매', data: [21, 7, 25, 13, 22, 8] },
        { name: '9번 경매', data: [21, 7, 25, 13, 22, 8] },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: true }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: 'bottom', offsetX: -10, offsetY: 0 }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
          dataLabels: {
            total: {
              enabled: true,
              style: { fontSize: '13px', fontWeight: 900 }
            }
          }
        },
      },
      xaxis: {
        type: 'datetime',
        categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
      },
      legend: { position: 'right', offsetY: 40 },
      fill: { opacity: 1 }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);


  async function axios_sales_data() {
    try {
      const response = await axios.get(
        `${SERVER_URL.SERVER_URL()}/admin/get_sales_data`
      );
      setSalesDataList(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <article>
      <div>SalesMgt</div>
      <div ref={chartRef}></div>
    </article>
  );
}

export default SalesMgt;