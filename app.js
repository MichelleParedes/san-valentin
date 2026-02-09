document.addEventListener("DOMContentLoaded", () => {
  const screenHome = document.getElementById("screenHome");
  const screenLetter = document.getElementById("screenLetter");
  const openBtn = document.getElementById("openBtn");
  const backBtn = document.getElementById("backBtn");
  const timerEl = document.getElementById("timer");
  const petals = document.getElementById("petals");

  // ✅ Música
  const bgMusic = document.getElementById("bgMusic");
  let musicStarted = false;

  // 13 de mayo de 2022 00:00:00 (Mayo = 4)
  const startDate = new Date(2022, 4, 13, 0, 0, 0);
  let timerInterval = null;

  function pad2(n){ return String(n).padStart(2, "0"); }

  function updateTimer(){
    const now = new Date();
    const diff = Math.max(0, now - startDate);

    const totalSeconds = Math.floor(diff / 1000);
    const days  = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins  = Math.floor((totalSeconds % 3600) / 60);
    const secs  = totalSeconds % 60;

    timerEl.textContent = `${days} días ${pad2(hours)} horas ${pad2(mins)} minutos ${pad2(secs)} segundos`;
  }

  /* Lluvia constante */
  function spawnPetal(){
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = "❤";

    const size = 10 + Math.random()*18;
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random()*160 - 80);
    const duration = 5 + Math.random()*4;
    const opacity = 0.35 + Math.random()*0.55;

    const colors = ["#ff2f75", "#ff4d8d", "#ff7bb3", "#ff9ac9"];
    p.style.color = colors[(Math.random()*colors.length) | 0];

    p.style.left = `${startX}px`;
    p.style.fontSize = `${size}px`;
    p.style.opacity = opacity.toFixed(2);

    petals.appendChild(p);

    const start = performance.now();
    const startY = -30;
    const endY = window.innerHeight + 40;

    function anim(now){
      const t = (now - start) / (duration*1000);
      if(t >= 1){
        p.remove();
        return;
      }

      const tt = t*t*(3 - 2*t);
      const x = startX + drift * tt;
      const y = startY + (endY - startY) * tt;

      p.style.transform = `translate(${x - startX}px, ${y}px) rotate(${tt*220}deg)`;
      requestAnimationFrame(anim);
    }

    requestAnimationFrame(anim);
  }

  setInterval(spawnPetal, 170);

  function openLetter(){
    // ✅ iniciar música al tocar (compat WhatsApp)
    if (!musicStarted) {
      bgMusic.volume = 0.6;
      bgMusic.play().catch(() => {});
      musicStarted = true;
    }

    screenHome.classList.add("hidden");
    screenLetter.classList.remove("hidden");

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    screenLetter.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeLetter(){
    screenLetter.classList.add("hidden");
    screenHome.classList.remove("hidden");

    if(timerInterval) clearInterval(timerInterval);

    // ✅ detener música al volver (si quieres que siga, dímelo y lo cambio)
    bgMusic.pause();
    bgMusic.currentTime = 0;
    musicStarted = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  openBtn.addEventListener("click", openLetter);
  backBtn.addEventListener("click", closeLetter);
});
