// src/js/expense.js
import { auth, db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { updateChart } from "./chart.js";

const expenseForm = document.getElementById("expense-form");

async function loadExpenses() {
  const user = auth.currentUser;
  if (!user) return;
  const q = query(collection(db, "expenses"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  const data = [];
  querySnapshot.forEach((docSnap) => data.push(docSnap.data()));
  updateChart(data);
}

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [bienSo, soTien, ngay] = Array.from(expenseForm.querySelectorAll("input")).map(i => i.value);
  const user = auth.currentUser;
  await addDoc(collection(db, "expenses"), { uid: user.uid, bienSo, soTien: Number(soTien), ngay });
  expenseForm.reset();
  loadExpenses();
});

auth.onAuthStateChanged(() => loadExpenses());
