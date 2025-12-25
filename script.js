// ✅ 여기에 너의 Apps Script 웹앱 URL 붙여넣기
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwzB1-eRtO785yjNCYW-66iZzIrFxob6xDtwhtE89Z9Gb94WrO566R3NxCjfkLwtSya/exec";

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Bottom sheet open/close
const backdrop = document.getElementById("backdrop");
const sheet = document.getElementById("sheet");
const openBtn = document.getElementById("openRsvpTop");
const closeBtn = document.getElementById("closeBtn");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const errorEl = document.getElementById("error");
const toast = document.getElementById("toast");

function openSheet() {
  backdrop.classList.add("open");
  sheet.classList.add("open");
  nameInput.focus();
}
function closeSheet() {
  backdrop.classList.remove("open");
  sheet.classList.remove("open");
  setError("");
  nameInput.value = "";
  messageInput.value = "";
}
function setError(msg) {
  if (msg) {
    errorEl.textContent = msg;
    errorEl.classList.add("show");
  } else {
    errorEl.classList.remove("show");
    errorEl.textContent = "";
  }
}
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.style.opacity = isLoading ? 0.7 : 1;
  submitBtn.textContent = isLoading ? "제출 중..." : "제출";
}

// 이벤트
openBtn.addEventListener("click", openSheet);
closeBtn.addEventListener("click", closeSheet);
backdrop.addEventListener("click", closeSheet);

submitBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name) { setError("이름을 입력해주세요."); return; }
  if (!message) { setError("한 마디를 입력해주세요."); return; }

  setError("");
  setLoading(true);

  try {
    // ⚠️ Apps Script는 CORS가 까다로워서, 응답 파싱 없이 "전송 성공" 기준으로 처리
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, message })
    });

    closeSheet();
    showToast();
  } catch (e) {
    setError("전송 중 오류가 발생했어요. 다시 시도해 주세요.");
  } finally {
    setLoading(false);
  }
});

// Enter 키로 제출
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitBtn.click();
});
