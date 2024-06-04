const PieChart = ({dataUrl}) => {
    const chartRef = useRef(null);

    useEffect(async () => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        const data = await (await fetch(dataUrl)).json()
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(data),
            datasets: [{
              label: 'Part modale',
              data: Object.values(data).map(x=>x*100)
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          }
        });
      }
    }, []);

    return (
      <div>
        <canvas ref={chartRef} height="400"></canvas>
      </div>
    );
  };