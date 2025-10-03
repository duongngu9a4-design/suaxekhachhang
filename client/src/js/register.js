import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const form = document.querySelector("#register-form");
const inputusername = document.querySelector("#username");
const inputemail = document.querySelector("#email");
const inputpwd = document.querySelector("#password");
const inputconfirmpwd = document.querySelector("#confirm-password");

// Bắt sự kiện submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = inputusername.value;
  const email = inputemail.value;
  const password = inputpwd.value;
  const confirmPassword = inputconfirmpwd.value;

  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp");
    return;
  }

  try {
    // 1. Tạo user trong Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Lưu thêm thông tin vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: email,
      createdAt: new Date()
    });

    alert("Đăng ký thành công!");
    form.reset();

  } catch (error) {
    console.error("Error: ", error);
    alert(error.message);
  }
});

