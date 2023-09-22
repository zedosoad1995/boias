import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getBuoysData } from "./Services";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const categoryLabels = {
  height: ["HMAX", "HS"],
  period: ["TZ", "TP"],
  direction: ["THTP"],
  temperature: ["TEMP"],
} as Record<string, string[]>;

function App() {
  const [category, setCategory] = useState("temperature");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.5,
      },
    ],
  });
  const [rows, setRows] = useState<{ [k: string]: any }>({});

  useEffect(() => {
    getBuoysData().then((record) => setRows(record));
  }, []);

  useEffect(() => {
    if (!rows[category]) return;

    const labelNames = categoryLabels[category];
    const labels = rows[category].map((row: any) => row.SDATA);

    setData((data) => {
      const datasets = labelNames.map((label, index) => ({
        ...data.datasets[index],
        label,
        data: rows[category].map((row: any) => row[label]),
      }));

      return {
        ...data,
        labels,
        datasets,
      };
    });
  }, [rows, category]);

  const handleChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value);
  };

  return (
    <div>
      <h2>Line Chart Example</h2>
      <select name="Categorias" value={category} onChange={handleChangeCategory}>
        <option value="height">Altura</option>
        <option value="period">Período</option>
        <option value="direction">Direção</option>
        <option value="temperature">Temperatura</option>
      </select>
      <div style={{ height: "400px", width: "600px" }}>
        <Line data={data} />
      </div>
    </div>
  );
}

export default App;
