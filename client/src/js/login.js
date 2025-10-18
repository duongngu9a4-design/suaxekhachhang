import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.querySelector("#login-form");
const inputemail = document.querySelector("#email");
const inputpwd = document.querySelector("#password");

// Modal
const notifyModalEl = document.getElementById('notifyModal');
const notifyModal = new bootstrap.Modal(notifyModalEl);
const notifyMessage = document.getElementById('notifyMessage');
const notifyModalLabel = document.getElementById("notifyModalLabel");

function showModal(message, type="info") {
  const header = notifyModalLabel.parentElement;
  header.className = "modal-header text-white";

  header.classList.remove("bg-primary", "bg-success", "bg-danger", "bg-warning");
  if(type==="success") header.classList.add("bg-success");
  else if(type==="danger") header.classList.add("bg-danger");
  else if(type==="warning") header.classList.add("bg-warning");
  else header.classList.add("bg-primary");

  notifyMessage.innerHTML = message;
  notifyModal.show();
}

form.addEventListener("submit", async e=>{
  e.preventDefault();
  const email = inputemail.value.trim();
  const password = inputpwd.value.trim();

  if(!email || !password){
    showModal("⚠️ Vui lòng nhập đầy đủ Email và Mật khẩu!", "warning");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    showModal(`🎉 Đăng nhập thành công! Chào mừng <strong>${user.email}</strong>!`, "success");
    setTimeout(()=> window.location.href="index.html", 1500);

  } catch(error){
    console.error("Login error:", error);
    // tất cả lỗi login → chung
    showModal("⚠️ Email hoặc mật khẩu không đúng!", "danger");
  }
});
