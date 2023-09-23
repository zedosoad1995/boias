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
import { downloadExcel, downloadSelectedExcel, filterByDate, subsample } from "./Utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const colors = ["rgba(93, 120, 255, 1)", "rgba(255, 87, 87, 1)"];

const categoryLabels = {
  height: ["HMAX", "HS"],
  period: ["TZ", "TP"],
  direction: ["THTP"],
  temperature: ["TEMP"],
} as Record<string, string[]>;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [range, setRange] = useState("today");
  const [category, setCategory] = useState("temperature");
  const [data, setData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Temperature",
        data: [] as any[],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  });
  const [rows, setRows] = useState<{ [k: string]: any }>({});

  useEffect(() => {
    getBuoysData()
      .then((record) => setRows(record))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!rows[category]) return;

    const labelNames = categoryLabels[category];

    const categoryData = filterByDate(rows[category], range);

    const labels = subsample(categoryData.map((row: any) => row.SDATA));

    setData((data) => {
      const datasets = labelNames.map((label, index) => ({
        ...data.datasets[index],
        borderColor: colors[index],
        backgroundColor: colors[index],
        label,
        data: subsample(categoryData.map((row: any) => row[label])),
        tension: 0.4,
        cubicInterpolationMode: "monotone",
      }));

      return {
        ...data,
        labels: labels,
        datasets,
      };
    });
  }, [rows, category, range]);

  const handleChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value);
  };
  const handleChangeRange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(event.currentTarget.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDownload = () => {
    downloadSelectedExcel(filterByDate(rows[category], range));
  };

  const handleDownloadAll = () => {
    downloadExcel([
      { sheetName: "height", data: rows.height },
      { sheetName: "period", data: rows.period },
      { sheetName: "direction", data: rows.direction },
      { sheetName: "temperature", data: rows.temperature },
    ]);
  };

  return (
    <div className="container">
      <h2>Boías do Algarve</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <select name="Categorias" value={category} onChange={handleChangeCategory}>
          <option value="height">Altura</option>
          <option value="period">Período</option>
          <option value="direction">Direção</option>
          <option value="temperature">Temperatura</option>
        </select>
        <select name="Range" value={range} onChange={handleChangeRange}>
          <option value="today">Hoje</option>
          <option value="last_week">Semana</option>
          <option value="last_month">Mês</option>
          <option value="last_year">Ano</option>
          <option value="total">Total</option>
        </select>
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleDownloadAll}>Download Tudo</button>
      </div>
      {isLoading && <div style={{ marginTop: 8 }}>A carregar...</div>}
      {!isLoading && (
        <div style={{ width: "100%", overflowX: isMobile ? "auto" : undefined }}>
          <div
            style={{
              height: "70vh",
              width: isMobile ? 700 : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Line
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
