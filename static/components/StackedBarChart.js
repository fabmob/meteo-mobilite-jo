const StackedBarChart = ({ dataUrl, labelColorMap }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const transportModeTranslation = {
    "NOT_DEFINED": "Non défini",
    "UNKNOWN": "Inconnu",
    "PASSENGER_CAR": "Voiture",
    "MOTORCYCLE": "Moto",
    "HEAVY_DUTY_VEHICLE": "Camion",
    "BUS": "Bus",
    "COACH": "Navette",
    "RAIL_TRIP": "Train/Métro",
    "BOAT_TRIP": "Vateau",
    "BIKE_TRIP": "Vélo",
    "PLANE": "Avion",
    "SKI": "Ski",
    "FOOT": "Marche",
    "IDLE": "Inactif",
    "OTHER": "Autre",
    "SCOOTER": "Trotinette",
    "HIGH_SPEED_TRAIN": "TGV"
  }
  useEffect(() => {
    const fetchDataAndUpdateChart = async () => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        const data = await (await fetch(dataUrl)).json()
        // Input is a bit scuffed, with data after midnight put in front instead of after
        // For the sake of speed, this is a hack to put data at the end
        // TODO: this really should be done in backend
        let nb_labels_after_midnight
        for (nb_labels_after_midnight = 0; nb_labels_after_midnight < data.labels.length; nb_labels_after_midnight++) {
          if (data.labels[nb_labels_after_midnight] > "03:00") {
            break
          }
        }
        const chartData = {
          labels: data.labels.slice(nb_labels_after_midnight).concat(data.labels.slice(0, nb_labels_after_midnight)),
          datasets: data.datasets.map(dataset => {
            return {
              label: transportModeTranslation[dataset.label],
              data: dataset.data.slice(nb_labels_after_midnight).concat(dataset.data.slice(0, nb_labels_after_midnight)),
              backgroundColor: labelColorMap ? labelColorMap[dataset.label] : undefined
            }
          })
        };
        if (chartInstanceRef.current) {
          // Update existing chart
          chartInstanceRef.current.data = chartData;
          chartInstanceRef.current.update();
        } else {
          // Create new chart
          chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                }
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true
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
  }, [dataUrl]);

  return (
    <div  style={{height: "250px"}}>
      <canvas ref={chartRef} width="40"></canvas>
    </div>
  );
};