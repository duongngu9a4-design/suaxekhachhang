import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, query, where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

// Forms và lists
const addCarForm = document.getElementById("add-car-form");
const carList = document.getElementById("car-list");

const maintenanceForm = document.getElementById("maintenance-form");
const maintenanceList = document.getElementById("maintenance-history");

const expenseForm = document.getElementById("expense-form");
const expenseChart = document.getElementById("expenseChart");
let chart = null;

// =================== LOGOUT ===================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  // Clear dữ liệu cũ
  carList.innerHTML = "";
  maintenanceList.innerHTML = "";
  if (chart) {
    chart.destroy();
    chart = null;
  }
  window.location.href = "login.html";
});

// =================== CHECK LOGIN ===================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userInfo.innerHTML = `<i class="fa-solid fa-user"></i> ${user.email}`;

  // Load dữ liệu theo user.uid
  await loadCars(user.uid);
  await loadMaintenance(user.uid);
  await loadExpenses(user.uid);
});

// =================== CARS ===================
addCarForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const [bienSo, hang, model, namSX] = [...addCarForm.querySelectorAll("input")].map(i => i.value.trim());

  await addDoc(collection(db, "cars"), {
    uid: user.uid,
    bienSo, hang, model, namSX,
    createdAt: new Date()
  });

  addCarForm.reset();
  loadCars(user.uid);
});

async function loadCars(uid) {
  carList.innerHTML = "";
  const q = query(collection(db, "cars"), where("uid", "==", uid));
  const snap = await getDocs(q);
  snap.forEach(docSnap => {
    const car = docSnap.data();
    carList.innerHTML += `
      <tr>
        <td>${car.bienSo}</td>
        <td>${car.hang}</td>
        <td>${car.model}</td>
        <td>${car.namSX}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteCar('${docSnap.id}')">Xóa</button></td>
      </tr>`;
  });
}

window.deleteCar = async function(id) {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, "cars", id));
  loadCars(user.uid);
};

// =================== MAINTENANCE ===================
maintenanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const [bienSo, noiDung, ngay] = [...maintenanceForm.querySelectorAll("input")].map(i => i.value.trim());

  await addDoc(collection(db, "maintenance"), {
    uid: user.uid,
    bienSo, noiDung, ngay
  });

  maintenanceForm.reset();
  loadMaintenance(user.uid);
});

async function loadMaintenance(uid) {
  maintenanceList.innerHTML = "";
  const q = query(collection(db, "maintenance"), where("uid", "==", uid));
  const snap = await getDocs(q);
  snap.forEach(docSnap => {
    const m = docSnap.data();
    maintenanceList.innerHTML += `
      <tr>
        <td>${m.bienSo}</td>
        <td>${m.noiDung}</td>
        <td>${m.ngay}</td>
      </tr>`;
  });
}

// =================== EXPENSES ===================
expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const [bienSo, soTien, ngay] = [...expenseForm.querySelectorAll("input")].map(i => i.value.trim());

  await addDoc(collection(db, "expenses"), {
    uid: user.uid,
    bienSo,
    soTien: Number(soTien),
    ngay
  });

  expenseForm.reset();
  loadExpenses(user.uid);
});

async function loadExpenses(uid) {
  const q = query(collection(db, "expenses"), where("uid", "==", uid));
  const snap = await getDocs(q);

  const labels = [];
  const values = [];

  snap.forEach(docSnap => {
    const e = docSnap.data();
    labels.push(e.bienSo);
    values.push(e.soTien);
  });

  if (chart) chart.destroy();
  chart = new Chart(expenseChart, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Chi phí bảo dưỡng (VNĐ)",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}




