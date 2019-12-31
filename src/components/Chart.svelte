<script>
  import ApexCharts from "apexcharts";
  import { onMount } from "svelte";

  export let datas = [];
  export let queryInterval;

  let chart;

  onMount(() => {
    const summedData = generateSeriesData(datas, queryInterval);

    const options = {
      chart: {
        type: "line",
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: queryInterval,
          data: summedData
        }
      ],
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false
        },
        labels: {
          datetimeFormatter: {
            year: "yyyy",
            month: "MMMM",
            day: "d"
          }
        }
      },

      yaxis: {
        show: false
      },
      grid: {
        show: false
      },
      stroke: {
        curve: "smooth",
        lineCap: "round"
      }
    };

    chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  });

  function generateSeriesData(datas, queryInterval) {
    let seriesData = [];

    datas.forEach((data, i) => {
      if (data.date >= queryInterval) {
        seriesData.push({
          x: new Date(data.date).getTime(),
          y: data.amount
        });
      }
    });

    let summedData = [];

    seriesData.forEach((data, i, arry) => {
      if (i > 0 && data.x === arry[i - 1].x) {
        summedData[summedData.length - 1].y =
          summedData[summedData.length - 1].y + data.y;
      } else {
        summedData.push(data);
      }
    });

    summedData.forEach((data, i, arry) => {
      if (i > 0) {
        data.y = data.y + arry[i - 1].y;
      }
    });

    return summedData;
  }

  function updateChart(datas, queryInterval) {
    const summedData = generateSeriesData(datas, queryInterval);
    chart.updateSeries([
      {
        data: summedData
      }
    ]);
  }

  $: if (chart) {
    updateChart(datas, queryInterval);
  }
</script>

<div class="w-full mb-8" id="chart" />
