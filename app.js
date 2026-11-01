const ar = new Intl.NumberFormat("ar-EG");
const SURAH_NAMES = ["","الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
const FAMOUS = ["السديس","المعيقلي","العفاسي","المنشاوي","عبد الباسط","الدوسري","الغامدي","الشريم","الحصري","الطبلاوي","مشاري"];

let RECITERS = [];
let queue = [];
let index = 0;
let audio;
let repeatMode = false;

function pad(n) { return String(n).padStart(3, "0"); }
function byId(id) { return RECITERS.find((r) => String(r.id) === String(id)); }
function surahUrl(reciter, n) { return reciter.server + pad(n) + ".mp3"; }
function surahTitle(n) { return "سورة " + (SURAH_NAMES[n] || n); }
function fmtTime(s) {
  if (!isFinite(s) || s < 0) return "٠:٠٠";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ss = String(sec).padStart(2, "0");
  return ar.format(m) + ":" + ss.replace(/\d/g, (d) => ar.format(+d));
}
function initial(name) { return (name || "ق").trim().charAt(0); }

function ensureAudio() {
  if (!audio) {
    audio = document.createElement("audio");
    audio.preload = "metadata";
    document.body.appendChild(audio);
    audio.addEventListener("timeupdate", () => {
      const seek = document.getElementById("dock-seek");
      const cur = document.getElementById("dock-cur");
      const dur = document.getElementById("dock-dur");
      if (seek && audio.duration) seek.value = Math.floor((audio.currentTime / audio.duration) * 1000);
      if (cur) cur.textContent = fmtTime(audio.currentTime);
      if (dur) dur.textContent = fmtTime(audio.duration || 0);
    });
    audio.addEventListener("loadedmetadata", () => {
      const dur = document.getElementById("dock-dur");
      if (dur) dur.textContent = fmtTime(audio.duration || 0);
    });
    audio.addEventListener("play", () => {
      const btn = document.getElementById("dock-play");
      if (btn) btn.textContent = "Ⅱ";
      document.body.classList.add("has-dock");
      try {
        if ("mediaSession" in navigator && queue[index]) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: queue[index].title,
            artist: queue[index].reciterName || "تلاوات",
            album: "القرآن الكريم"
          });
        }
      } catch (_) {}
    });
    audio.addEventListener("pause", () => {
      const btn = document.getElementById("dock-play");
      if (btn) btn.textContent = "▶";
    });
    audio.addEventListener("ended", () => {
      if (repeatMode) { audio.currentTime = 0; audio.play().catch(() => {}); }
      else playAt(index + 1);
    });
    audio.addEventListener("error", () => {
      const t = document.getElementById("dock-title");
      if (t) t.textContent = "تعذر التشغيل · جرب سورة أخرى";
    });
  }
  return audio;
}

function showDock(title, sub) {
  const dock = document.getElementById("dock");
  if (!dock) return;
  dock.hidden = false;
  document.body.classList.add("has-dock");
  const t = document.getElementById("dock-title");
  const s = document.getElementById("dock-sub");
  if (t) t.textContent = title;
  if (s) s.textContent = sub || "";
}

function playAt(i) {
  if (!queue.length) return;
  if (i < 0) i = queue.length - 1;
  if (i >= queue.length) i = 0;
  index = i;
  const item = queue[index];
  const a = ensureAudio();
  a.src = item.url;
  showDock(item.title, item.reciterName || "");
  a.play().catch(() => {});
  document.querySelectorAll(".surah").forEach((el) => {
    el.classList.toggle("on", Number(el.dataset.n) === item.n);
  });
  try {
    localStorage.setItem("tilawat-last", JSON.stringify({
      reciterId: item.reciterId, n: item.n, title: item.title, url: item.url
    }));
  } catch (_) {}
}

function playReciter(reciter, startSurah) {
  const list = reciter.surahs.slice();
  const start = startSurah ? list.indexOf(startSurah) : 0;
  queue = list.map((n) => ({
    n, url: surahUrl(reciter, n), title: surahTitle(n),
    reciterName: reciter.name, reciterId: reciter.id
  }));
  playAt(start >= 0 ? start : 0);
}

function bindDock() {
  const play = document.getElementById("dock-play");
  if (!play || play.dataset.bound) return;
  play.dataset.bound = "1";
  const a = ensureAudio();
  play.addEventListener("click", () => {
    if (a.paused) a.play().catch(() => {}); else a.pause();
  });
  document.getElementById("dock-prev")?.addEventListener("click", () => playAt(index - 1));
  document.getElementById("dock-next")?.addEventListener("click", () => playAt(index + 1));
  document.getElementById("dock-close")?.addEventListener("click", () => {
    a.pause(); a.removeAttribute("src");
    document.getElementById("dock").hidden = true;
    document.body.classList.remove("has-dock");
  });
  document.getElementById("dock-list")?.addEventListener("click", () => {
    if (location.pathname.endsWith("reciter.html")) return;
    const last = sessionStorage.getItem("tilawat-last-reciter");
    if (last) location.href = "reciter.html?id=" + last;
  });
  document.getElementById("dock-seek")?.addEventListener("input", (e) => {
    if (!a.duration) return;
    a.currentTime = a.duration * (Number(e.target.value) / 1000);
  });
  document.getElementById("dock-repeat")?.addEventListener("click", (e) => {
    repeatMode = !repeatMode;
    e.currentTarget.classList.toggle("on", repeatMode);
  });
  document.getElementById("dock-speed")?.addEventListener("click", (e) => {
    const rates = [1, 1.25, 1.5, 0.75];
    const cur = a.playbackRate || 1;
    const next = rates[(rates.indexOf(cur) + 1) % rates.length];
    a.playbackRate = next;
    e.currentTarget.textContent = next === 1 ? "١×" : String(next).replace(".", "٫") + "×";
  });
}

function normalize(data) {
  const out = [];
  for (const r of data.reciters || []) {
    let best = null;
    for (const m of r.moshaf || []) {
      if ((m.surah_total || 0) < 30) continue;
      if (!best || m.surah_total > best.surah_total) best = m;
      if (m.surah_total === 114 && String(m.name || "").includes("مرتل")) { best = m; break; }
    }
    if (!best) continue;
    out.push({
      id: r.id, name: r.name, letter: r.letter || r.name[0], rewaya: best.name || "",
      server: (best.server || "").replace(/\/?$/, "/"),
      surahs: String(best.surah_list || "").split(",").map(Number).filter(Boolean),
      count: Number(best.surah_total) || 0
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  return out;
}

function isFamous(name) { return FAMOUS.some((f) => name.includes(f)); }

function renderFamous() {
  const row = document.getElementById("famous-row");
  if (!row) return;
  let list = RECITERS.filter((r) => isFamous(r.name) && r.count >= 100);
  if (list.length < 6) list = RECITERS.filter((r) => r.count >= 114).slice(0, 12);
  else list = list.slice(0, 12);
  row.innerHTML = list.map((r) => `
    <a class="reciter-card" href="reciter.html?id=${r.id}">
      <div class="reciter-avatar">${initial(r.name)}</div>
      <strong>${r.name}</strong>
      <span>${ar.format(r.count)} سورة</span>
      <span class="play-mini" data-id="${r.id}" onclick="event.preventDefault();event.stopPropagation();quickPlay(${r.id})">▶</span>
    </a>`).join("");
}

window.quickPlay = function (id) {
  const r = byId(id);
  if (r) playReciter(r);
};

function renderHome() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const q = (document.getElementById("q")?.value || "").trim();
  const letter = document.querySelector(".letters button.on")?.dataset.letter || "";
  let list = RECITERS;
  if (letter) list = list.filter((r) => r.letter === letter);
  if (q) list = list.filter((r) => r.name.includes(q));
  const rc = document.getElementById("result-count");
  if (rc) rc.textContent = ar.format(list.length) + " قارئ";
  const loading = document.getElementById("loading");
  if (loading) loading.hidden = true;
  grid.innerHTML = list.map((r) => `
    <a class="card" href="reciter.html?id=${r.id}">
      <span class="letter">${r.letter}</span>
      <strong>${r.name}</strong>
      <span>${ar.format(r.count)} سورة</span>
    </a>`).join("");
  const empty = document.getElementById("empty");
  if (empty) empty.hidden = list.length !== 0;
}

function renderLetters() {
  const box = document.getElementById("letters");
  if (!box) return;
  const letters = [...new Set(RECITERS.map((r) => r.letter))].sort((a, b) => a.localeCompare(b, "ar"));
  box.innerHTML = `<button type="button" class="on" data-letter="">الكل</button>` +
    letters.map((l) => `<button type="button" data-letter="${l}">${l}</button>`).join("");
  box.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    box.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
    renderHome();
  });
}

function renderReciter() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const reciter = byId(id);
  if (!reciter) {
    const name = document.getElementById("reciter-name");
    if (name) name.textContent = "جارٍ التحميل…";
    return;
  }
  sessionStorage.setItem("tilawat-last-reciter", String(reciter.id));
  document.title = reciter.name + " | تلاوات القرآن الكريم";
  document.getElementById("reciter-name").textContent = reciter.name;
  document.getElementById("rewaya").textContent = reciter.rewaya;
  document.getElementById("reciter-meta").textContent = ar.format(reciter.count) + " سورة متاحة";
  const list = document.getElementById("surah-list");
  list.innerHTML = reciter.surahs.map((n) => `
    <button class="surah" type="button" data-n="${n}">
      <b>${ar.format(n)}</b>
      <span><strong>${surahTitle(n)}</strong><em>اضغط للتشغيل</em></span>
      <span class="play">▶</span>
    </button>`).join("");
  list.onclick = (e) => {
    const row = e.target.closest(".surah");
    if (!row) return;
    playReciter(reciter, Number(row.dataset.n));
  };
  document.getElementById("play-all").onclick = () => playReciter(reciter);
}

async function boot() {
  bindDock();
  try {
    const res = await fetch("https://www.mp3quran.net/api/v3/reciters?language=ar");
    const data = await res.json();
    RECITERS = normalize(data);
  } catch (err) {
    console.error(err);
    const loading = document.getElementById("loading");
    if (loading) loading.textContent = "تعذر تحميل قائمة القراء. حدّث الصفحة.";
    return;
  }
  if (document.getElementById("grid")) {
    renderFamous();
    renderLetters();
    renderHome();
    document.getElementById("q")?.addEventListener("input", renderHome);
    document.getElementById("search-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      renderHome();
      document.getElementById("all")?.scrollIntoView({ behavior: "smooth" });
    });
  }
  if (document.getElementById("surah-list")) renderReciter();
}

boot();
