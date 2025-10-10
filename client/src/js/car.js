// src/js/car.js
import { auth, db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const carList = document.getElementById("car-list");
const addCarForm = document.getElementById("add-car-form");

async function loadCars() {
  const user = auth.currentUser;
  if (!user) return;

  carList.innerHTML = "";
  const q = query(collection(db, "cars"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.bienSo}</td>
      <td>${data.hang}</td>
      <td>${data.model}</td>
      <td>${data.nam}</td>
      <td><button class="btn btn-danger btn-sm" data-id="${docSnap.id}">Xóa</button></td>
    `;
    carList.appendChild(row);
  });

  document.querySelectorAll(".btn-danger").forEach(btn => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, "cars", btn.dataset.id));
      loadCars();
    };
  });
}

addCarForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [bienSo, hang, model, nam] = Array.from(addCarForm.querySelectorAll("input")).map(i => i.value);
  const user = auth.currentUser;
  await addDoc(collection(db, "cars"), { uid: user.uid, bienSo, hang, model, nam });
  addCarForm.reset();
  loadCars();
});

auth.onAuthStateChanged(() => loadCars());

