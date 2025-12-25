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
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function saveRsvp(name, message) {
  // 로컬 스토리지에서 기존 데이터 가져오기
  let rsvpList = JSON.parse(localStorage.getItem("rsvpList")) || [];

  // 중복 확인 (같은 이름으로 이미 신청했는지)
  const isDuplicate = rsvpList.some(item => item.name === name);
  if (isDuplicate) {
    setError("이미 신청하신 이름입니다.");
    return false;
  }

  // 새 신청 추가
  const newRsvp = {
    id: Date.now(),
    name: name,
    message: message,
    timestamp: new Date().toLocaleString("ko-KR")
  };

  rsvpList.push(newRsvp);
  localStorage.setItem("rsvpList", JSON.stringify(rsvpList));
  return true;
}

// 이벤트 리스너
openBtn.addEventListener("click", openSheet);
closeBtn.addEventListener("click", closeSheet);
backdrop.addEventListener("click", closeSheet);

submitBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  // 유효성 검사
  if (!name) {
    setError("이름을 입력해주세요.");
    return;
  }
  if (!message) {
    setError("한 마디를 입력해주세요.");
    return;
  }

  // 저장
  if (saveRsvp(name, message)) {
    closeSheet();
    showToast();
  }
});

// Enter 키로 제출
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});