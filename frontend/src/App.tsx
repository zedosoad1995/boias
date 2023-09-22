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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Sales",
      data: [3, 2, 5, 8, 4],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.4)",
      tension: 0.5,
    },
  ],
};

function App() {
  return (
    <div>
      <h2>Line Chart Example</h2>
      <div style={{ height: "400px", width: "600px" }}>
        <Line data={data} />
      </div>
    </div>
  );
}

export default App;
