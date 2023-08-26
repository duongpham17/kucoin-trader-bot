import { KLines } from '@redux/types/trades';
import Container from '@components/containers/Style1';
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Prices = ({klines}:{klines: KLines}) => {

  const theme = localStorage.getItem("theme");

  const candlestick_data = klines.map(([time, open, high, low, close, volume]) => ({
    x: time,//UK(new Date(time)), 
    y: [open, high, low, close]
  }));

  const series = [
    {
      data: candlestick_data
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar:{
        show: false
      }
    },
    tooltip:{
      enabled: true,
      theme: "",
      x:{
        show: true,
        format: 'dd MMM yyyy HH:mm:ss',
      },
    },
    grid: {
      show: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false, // Set this to false to use local time
        format: 'MMM dd, yyyy', // Customize the date format
      },
      crosshairs: {
        show: true,
        stroke: {
          color: '#6042d7', // Color of the crosshair line
          width: 1, // Width of the crosshair line
          dashArray: 1, // Dash array for stroke
        },
        fill: {
          type: 'solid', // Fill type
          color: 'red', // Transparent color
        },
      },
      
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
        stroke: {
          color: '#6042d7', // Color of the crosshair line
          width: 1, // Width of the crosshair line
          dashArray: 1, // Dash array for stroke
        },
      }
    }
  };

  return (
    <Container style={{padding: "1rem 0"}}>
      <ReactApexChart options={options} series={series} type="candlestick" height={400} />
      <style>
        {`
          .apexcharts-yaxistooltip, .apexcharts-xaxistooltip, .apexcharts-tooltip {
            background-color: transparent;
            padding: 0.5rem;
            border: 1px solid transparent,
            color: ${theme?.includes("night") ? "black" : "white"},
            box-shadow: 0px 0px 0px 0px white
          }
        `}
      </style>
    </Container>
  );
}

export default Prices;