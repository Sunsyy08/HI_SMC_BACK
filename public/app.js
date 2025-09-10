// 화면 요소 가져오기
const homeScreen = document.getElementById("homeScreen");
const loginScreen = document.getElementById("loginScreen");
const registerScreen = document.getElementById("registerScreen");

const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const main = document.querySelector("main");

// ---------------------------
// 사이드바 토글
// 사이드바 토글
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  main.classList.toggle("shift");
});

// ---------------------------
// 상단 버튼 (홈, 로그인, 회원가입)
// ---------------------------
document.getElementById("homeBtn").addEventListener("click", () => showScreen("home"));
document.getElementById("loginBtn").addEventListener("click", () => showScreen("login"));
document.getElementById("registerBtn").addEventListener("click", () => showScreen("register"));

// 화면 전환 함수
function showScreen(screen) {
  homeScreen.classList.add("hidden");
  loginScreen.classList.add("hidden");
  registerScreen.classList.add("hidden");

  if (screen === "home") homeScreen.classList.remove("hidden");
  if (screen === "login") loginScreen.classList.remove("hidden");
  if (screen === "register") registerScreen.classList.remove("hidden");

  // 사이드바 자동 닫기
  sidebar.classList.remove("show");
  main.classList.remove("shift");
}

// ---------------------------
// 사이드바 메뉴 클릭 이벤트
// ---------------------------
sidebar.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    const menu = item.textContent;
    console.log("메뉴 클릭:", menu);
    alert(menu + " 메뉴 클릭됨");
    sidebar.classList.remove("show");
    main.classList.remove("shift");
  });
});

// ---------------------------
// 회원가입
// ---------------------------
document.getElementById("doRegisterBtn").addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value;
  const name = document.getElementById("regName").value;
  const password = document.getElementById("regPassword").value;

  if (!email || !name || !password) {
    registerMsg.textContent = "모든 항목을 입력해주세요.";
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password })
    });
    const data = await res.json();
    registerMsg.textContent = data.message;

    if (data.message === "회원가입 성공") showScreen("login");
  } catch (err) {
    registerMsg.textContent = "서버 오류, 다시 시도해주세요.";
    console.error(err);
  }
});

// ---------------------------
// 로그인
// ---------------------------
document.getElementById("doLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    loginMsg.textContent = "모든 항목을 입력해주세요.";
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    loginMsg.textContent = data.message || "로그인 성공";

    if (data.token) {
      localStorage.setItem("token", data.token);
      showScreen("home");
    }
  } catch (err) {
    loginMsg.textContent = "서버 오류, 다시 시도해주세요.";
    console.error(err);
  }
});
