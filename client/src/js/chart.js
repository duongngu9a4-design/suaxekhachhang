// src/js/chart.js
let chart;

export function updateChart(data) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const grouped = {};

  data.forEach(item => {
    grouped[item.ngay] = (grouped[item.ngay] || 0) + item.soTien;
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Chi phí bảo dưỡng (VNĐ)", data: values }]
    }
  });
}
