const maintenanceForm = document.querySelector("#maintenance-form");
const maintenanceHistory = document.querySelector("#maintenance-history");

let historyList = [];

maintenanceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = maintenanceForm.querySelectorAll("input");
  const record = {
    plate: inputs[0].value,
    content: inputs[1].value,
    date: inputs[2].value,
  };

  historyList.push(record);
  renderHistory();
  maintenanceForm.reset();
});

function renderHistory() {
  maintenanceHistory.innerHTML = "";
  historyList.forEach((h) => {
    maintenanceHistory.innerHTML += `
      <tr>
        <td>${h.plate}</td>
        <td>${h.content}</td>
        <td>${h.date}</td>
      </tr>
    `;
  });
}
