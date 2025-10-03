// src/js/index.js
import { auth } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-info").innerText = `👤 ${user.email}`;
  } else {
    // Nếu chưa đăng nhập thì quay về trang login
    window.location.href = "login.html";
  }
});

// Xử lý nút đăng xuất
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Đã đăng xuất thành công");
      window.location.href = "login.html"; // Quay lại trang login
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Đăng xuất thất bại: " + error.message);
    }
  });
}
// ================= HIỂN THỊ THÔNG TIN NGƯỜI DÙNG =================
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-info").innerHTML = `<i class="fa-solid fa-user"></i> ${user.email}`;
  }
});

// ================= THÔNG TIN XE =================
const carForm = document.getElementById("add-car-form");
const carList = document.getElementById("car-list");

carForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [plate, brand, model, year] = [...carForm.querySelectorAll("input")].map(i => i.value);

  await addDoc(collection(db, "cars"), {
    plate, brand, model, year, createdAt: new Date()
  });

  carForm.reset();
  loadCars();
});

async function loadCars() {
  carList.innerHTML = "";
  const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const c = doc.data();
    carList.innerHTML += `
      <tr>
        <td>${c.plate}</td>
        <td>${c.brand}</td>
        <td>${c.model}</td>
        <td>${c.year}</td>
        <td><button class="btn btn-danger btn-sm">Xóa</button></td>
      </tr>
    `;
  });
}
loadCars();

// ================= LỊCH SỬ BẢO DƯỠNG =================
const maintenanceForm = document.getElementById("maintenance-form");
const maintenanceHistory = document.getElementById("maintenance-history");

maintenanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [plate, content, date] = [...maintenanceForm.querySelectorAll("input")].map(i => i.value);

  await addDoc(collection(db, "maintenance"), {
    plate, content, date, createdAt: new Date()
  });

  maintenanceForm.reset();
  loadMaintenance();
});

async function loadMaintenance() {
  maintenanceHistory.innerHTML = "";
  const q = query(collection(db, "maintenance"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const m = doc.data();
    maintenanceHistory.innerHTML += `
      <tr>
        <td>${m.plate}</td>
        <td>${m.content}</td>
        <td>${m.date}</td>
      </tr>
    `;
  });
}
loadMaintenance();

// ================= CHI PHÍ BẢO DƯỠNG =================
const expenseForm = document.getElementById("expense-form");
const ctx = document.getElementById("expenseChart").getContext("2d");

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [plate, amount, date] = [...expenseForm.querySelectorAll("input")].map(i => i.value);

  await addDoc(collection(db, "expenses"), {
    plate, amount: Number(amount), date, createdAt: new Date()
  });

  expenseForm.reset();
  loadExpenses();
});

async function loadExpenses() {
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const labels = [];
  const data = [];
  querySnapshot.forEach((doc) => {
    const e = doc.data();
    labels.push(e.date);
    data.push(e.amount);
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Chi phí bảo dưỡng (VNĐ)",
        data
      }]
    }
  });
}
loadExpenses();



