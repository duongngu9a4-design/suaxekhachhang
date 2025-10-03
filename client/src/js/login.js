import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.querySelector("#login-form");
const inputemail = document.querySelector("#email");
const inputpwd = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = inputemail.value;
  const password = inputpwd.value;

  try {
    // Đăng nhập với Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert("Đăng nhập thành công! Xin chào " + user.email);

    // Ví dụ: chuyển hướng sang trang chủ
    window.location.href = "index.html";

  } catch (error) {
    console.error("Login error: ", error);
    alert(error.message);
  }
});
