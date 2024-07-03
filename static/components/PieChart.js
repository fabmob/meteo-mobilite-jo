const PieChart = ({ dataJson, dataUrl, dataKey, labelColorMap }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchDataAndUpdateChart = async () => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        let data;
        if (dataUrl) {
          data = await (await fetch(dataUrl)).json();
        } else {
          data = dataJson
        }
        if (!data) {
          return
        }
        if (dataKey) {
          data = data[dataKey];
        }

        const chartData = {
          labels: Object.keys(data),
          datasets: [{
            label: 'Part modale',
            data: Object.values(data).map(x => x * 100),
            backgroundColor: labelColorMap ? Object.keys(data).map(label => labelColorMap[label]) : undefined
          }]
        };
        if (chartInstanceRef.current) {
          // Update existing chart
          chartInstanceRef.current.data = chartData;
          chartInstanceRef.current.update();
        } else {
          // Create new chart
          chartInstanceRef.current = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom"
                }
              }
            }
          });
        }
      }
    };

    fetchDataAndUpdateChart();

    // Clean up function to destroy the chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [dataJson, dataUrl, dataKey]); // Add dataUrl and dataKey as dependencies

  return (
    <div  style={{height: "250px"}}>
      <canvas ref={chartRef} width="40"></canvas>
    </div>
  );
};