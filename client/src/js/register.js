import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.querySelector("#register-form");
const inputUsername = document.querySelector("#username");
const inputEmail = document.querySelector("#email");
const inputPwd = document.querySelector("#password");
const inputCfPwd = document.querySelector("#confirm-password");

// Modal
const notifyModalEl = document.getElementById('notifyModal');
const notifyModal = new bootstrap.Modal(notifyModalEl);
const notifyMessage = document.getElementById('notifyMessage');
const notifyModalLabel = document.getElementById("notifyModalLabel");

function showModal(message, type="info") {
  const header = notifyModalLabel.parentElement;
  header.className = "modal-header text-white";
  header.classList.remove("bg-primary","bg-success","bg-danger","bg-warning");
  if(type==="success") header.classList.add("bg-success");
  else if(type==="danger") header.classList.add("bg-danger");
  else if(type==="warning") header.classList.add("bg-warning");
  else header.classList.add("bg-primary");

  notifyMessage.innerHTML = message;
  notifyModal.show();
}

form.addEventListener("submit", async e=>{
  e.preventDefault();

  const username = inputUsername.value.trim();
  const email = inputEmail.value.trim();
  const password = inputPwd.value.trim();
  const confirmPwd = inputCfPwd.value.trim();

  if(!username || !email || !password || !confirmPwd){
    showModal("⚠️ Vui lòng điền đầy đủ thông tin!", "warning");
    return;
  }

  if(password !== confirmPwd){
    showModal("⚠️ Mật khẩu và nhập lại mật khẩu không khớp!", "warning");
    return;
  }

  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Cập nhật displayName
    await updateProfile(user, { displayName: username });

    showModal(`🎉 Đăng ký thành công! Chào mừng <strong>${user.email}</strong>!`, "success");

    setTimeout(()=> window.location.href="login.html", 1500);

  }catch(error){
    console.error("Register error:", error);
    let errorMsg = "❌ Đăng ký thất bại, thử lại!";
    switch(error.code){
      case "auth/email-already-in-use":
        errorMsg = "⚠️ Email này đã được sử dụng!";
        break;
      case "auth/invalid-email":
        errorMsg = "⚠️ Email không hợp lệ!";
        break;
      case "auth/weak-password":
        errorMsg = "⚠️ Mật khẩu quá yếu, nên ít nhất 6 ký tự!";
        break;
    }
    showModal(errorMsg, "danger");
  }
});

