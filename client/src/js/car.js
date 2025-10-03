import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const carForm = document.getElementById("add-car-form");
const carList = document.getElementById("car-list");

const carCollection = collection(db, "cars");

// Lưu thông tin xe
carForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const plate = document.getElementById("car-plate").value;
  const brand = document.getElementById("car-brand").value;
  const model = document.getElementById("car-model").value;
  const year = document.getElementById("car-year").value;

  try {
    await addDoc(carCollection, {
      plate,
      brand,
      model,
      year,
      createdAt: new Date()
    });

    carForm.reset();
    loadCars();
  } catch (err) {
    console.error("Lỗi khi thêm xe:", err);
    alert("Không thể thêm xe!");
  }
});

// Hiển thị danh sách xe
async function loadCars() {
  carList.innerHTML = "";
  const snapshot = await getDocs(carCollection);

  snapshot.forEach((docSnap) => {
    const car = docSnap.data();
    const row = `
      <tr>
        <td>${car.plate}</td>
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.year}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteCar('${docSnap.id}')">Xóa</button>
        </td>
      </tr>
    `;
    carList.innerHTML += row;
  });
}

// Xóa xe
window.deleteCar = async (id) => {
  try {
    await deleteDoc(doc(db, "cars", id));
    loadCars();
  } catch (err) {
    console.error("Lỗi khi xóa xe:", err);
  }
};

// Load ngay khi mở tab
loadCars();

