import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

const ctx = document.getElementById("expenseChart").getContext("2d");

export const expenseChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [], // ngày/tháng
    datasets: [{
      label: "Chi phí bảo dưỡng (VNĐ)",
      data: [],
      backgroundColor: "rgba(54, 162, 235, 0.6)"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Thống kê chi phí bảo dưỡng" }
    }
  }
});
