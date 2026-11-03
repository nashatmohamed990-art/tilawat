const ar = new Intl.NumberFormat("ar-EG");
const SURAH_NAMES = [
  "","الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة",
  "يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
  "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
  "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت",
  "الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات",
  "الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف",
  "الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح",
  "الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير",
  "الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس",
  "الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة",
  "التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد",
  "الإخلاص","الفلق","الناس"
];

const SURAH_EN = [
  "","Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah",
  "Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Taha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum",
  "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat",
  "Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat",
  "At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah","As-Saf",
  "Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh",
  "Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir",
  "Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams",
  "Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat","Al-Qari'ah",
  "At-Takathur","Al-'Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad",
  "Al-Ikhlas","Al-Falaq","An-Nas"
];

function guessCountry(name) {
  const n = name || "";
  if (/الدوسري|السديس|المعيقلي|الشريم|الغامدي|العجمي|القطامي|بليلة|الوهيبي|الجليل/.test(n)) return "السعودية";
  if (/المنشاوي|الحصري|الطبلاوي|البنا|رفعت|مصطفى إسماعيل/.test(n)) return "مصر";
  if (/العفاسي|مشاري/.test(n)) return "الكويت";
  if (/عبد الباسط|عبدالباسط/.test(n)) return "مصر";
  return "—";
}

function bioFor() {
  return "تلاوات مرتّلة برواية معتمدة · جاهزة للاستماع المباشر.";
}

const FAMOUS = [
  "السديس","المعيقلي","العفاسي","المنشاوي","عبد الباسط","الدوسري",
  "الغامدي","الشريم","الحصري","الطبلاوي","مشاري","ياسر","خليل"
];

const PHOTO_MAP = [];

function photoFor(name) {
  return "";
}

function avatarHtml(name) {
  const letter = initial(name);
  const palettes = [
    ["1b5a4f", "e6ba76"],
    ["145247", "d6a861"],
    ["1f6b5d", "f0d9a8"],
    ["0e3d36", "c9a86c"],
    ["2a6f5f", "e6ba76"],
    ["174a42", "d4b483"]
  ];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % 997;
  const [bg, fg] = palettes[h % palettes.length];
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=${bg}&color=${fg}&size=128&bold=true&font-size=0.5`;
  return `<img src="${fallback}" alt="${letter}" loading="lazy" />`;
}

let RECITERS = [];
let queue = [];
let index = 0;
let audio;
let repeatMode = false;

function pad(n) { return String(n).padStart(3, "0"); }
function byId(id) { return RECITERS.find((r) => String(r.id) === String(id)); }
function surahUrl(reciter, n) { return reciter.server + pad(n) + ".mp3"; }
function surahTitle(n) { return "سورة " + (SURAH_NAMES[n] || n); }

function downloadSurah(url, filename) {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "tilawa.mp3";
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadCurrent() {
  const item = queue[index];
  if (!item) return;
  const name = (item.reciterName || "قارئ") + " - " + (item.title || "سورة") + ".mp3";
  downloadSurah(item.url, name);
}

function fmtTime(s) {
  if (!isFinite(s) || s < 0) return "٠:٠٠";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ss = String(sec).padStart(2, "0");
  return ar.format(m) + ":" + ss.replace(/\d/g, (d) => ar.format(+d));
}

function normalizeArabic(s) {
  return String(s || "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .trim()
    .toLowerCase();
}

function initial(name) {
  return (name || "ق").trim().charAt(0);
}

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
      if (t) t.textContent = "تعذر التشغيل";
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
  document.querySelectorAll(".surah-row").forEach((el) => {
    el.classList.toggle("on", Number(el.dataset.n) === item.n);
  });
  try {
    localStorage.setItem("tilawat-last", JSON.stringify({
      reciterId: item.reciterId, n: item.n, title: item.title, url: item.url,
      reciterName: item.reciterName || ""
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
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  });
  document.getElementById("dock-prev")?.addEventListener("click", () => playAt(index - 1));
  document.getElementById("dock-next")?.addEventListener("click", () => playAt(index + 1));
  document.getElementById("dock-close")?.addEventListener("click", () => {
    a.pause();
    a.removeAttribute("src");
    document.getElementById("dock").hidden = true;
    document.body.classList.remove("has-dock");
  });
  document.getElementById("dock-seek")?.addEventListener("input", (e) => {
    if (!a.duration) return;
    a.currentTime = a.duration * (Number(e.target.value) / 1000);
  });
  document.getElementById("dock-dl")?.addEventListener("click", () => downloadCurrent());
}

function normalize(data) {
  const out = [];
  for (const r of data.reciters || []) {
    let best = null;
    for (const m of r.moshaf || []) {
      if ((m.surah_total || 0) < 30) continue;
      if (!best || m.surah_total > best.surah_total) best = m;
      if (m.surah_total === 114 && String(m.name || "").includes("مرتل")) {
        best = m; break;
      }
    }
    if (!best) continue;
    out.push({
      id: r.id, name: r.name, letter: r.letter || r.name[0],
      rewaya: best.name || "",
      server: (best.server || "").replace(/\/?$/, "/"),
      surahs: String(best.surah_list || "").split(",").map(Number).filter(Boolean),
      count: Number(best.surah_total) || 0
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  return out;
}

function isFamous(name) {
  return FAMOUS.some((f) => name.includes(f));
}

function renderFavReciters() {
  const sec = document.getElementById("favs");
  const row = document.getElementById("fav-row");
  if (!sec || !row) return;
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem("tilawat-fav-reciters") || "[]"); } catch (_) {}
  const list = ids.map((id) => byId(id)).filter(Boolean);
  if (!list.length) {
    sec.hidden = true;
    row.innerHTML = "";
    return;
  }
  sec.hidden = false;
  row.innerHTML = list.map((r) => `
    <a class="reciter-card" href="reciter.html?id=${r.id}">
      <div class="reciter-avatar">${avatarHtml(r.name)}</div>
      <strong>${r.name}</strong>
      <span>${ar.format(r.count)} سورة</span>
    </a>
  `).join("");
}

function renderFamous() {
  const row = document.getElementById("famous-row");
  if (!row) return;
  let list = RECITERS.filter((r) => isFamous(r.name) && r.count >= 100);
  if (list.length < 6) list = RECITERS.filter((r) => r.count >= 114).slice(0, 12);
  else list = list.slice(0, 12);
  row.innerHTML = list.map((r) => `
    <a class="reciter-card" href="reciter.html?id=${r.id}">
      <div class="reciter-avatar">${avatarHtml(r.name)}</div>
      <strong>${r.name}</strong>
      <span>${ar.format(r.count)} سورة</span>
    </a>
  `).join("");
}

function renderHome() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const q = (document.getElementById("q")?.value || "").trim();
  const letter = document.querySelector(".letters button.on")?.dataset.letter || "";
  let list = RECITERS;
  if (letter) list = list.filter((r) => r.letter === letter);
  if (q) {
    const nq = normalizeArabic(q);
    list = list.filter((r) => normalizeArabic(r.name).includes(nq) || r.name.includes(q));
  }
  const rc = document.getElementById("result-count");
  if (rc) rc.textContent = ar.format(list.length) + " قارئ";
  const loading = document.getElementById("loading");
  if (loading) loading.hidden = true;
  grid.innerHTML = list.map((r) => `
    <a class="card" href="reciter.html?id=${r.id}">
      <div class="card-avatar">${avatarHtml(r.name)}</div>
      <div>
        <strong>${r.name}</strong>
        <span>${ar.format(r.count)} سورة</span>
      </div>
    </a>
  `).join("");
  const empty = document.getElementById("empty");
  if (empty) empty.hidden = list.length !== 0;
}

function renderLetters() {
  const box = document.getElementById("letters");
  if (!box) return;
  const letters = [...new Set(RECITERS.map((r) => r.letter))].sort((a, b) => a.localeCompare(b, "ar"));
  box.innerHTML =
    `<button type="button" class="on" data-letter="">الكل</button>` +
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
  document.title = reciter.name + " | تلاوات";

  const nameEl = document.getElementById("reciter-name");
  if (nameEl) nameEl.textContent = reciter.name;

  const countryEl = document.getElementById("reciter-country");
  if (countryEl) countryEl.innerHTML = `<span class="dot"></span> ${guessCountry(reciter.name)}`;

  const bioEl = document.getElementById("reciter-bio");
  if (bioEl) bioEl.textContent = bioFor();

  const metaEl = document.getElementById("reciter-meta");
  if (metaEl) metaEl.textContent = ar.format(reciter.count) + " سورة";

  const photoEl = document.getElementById("reciter-photo");
  if (photoEl) photoEl.innerHTML = avatarHtml(reciter.name);

  document.getElementById("btn-share")?.addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: reciter.name, url });
      else await navigator.clipboard.writeText(url);
    } catch (_) {}
  });

  const favBtn = document.getElementById("btn-fav");
  if (favBtn) {
    const key = "tilawat-fav-reciters";
    let favs = [];
    try { favs = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) {}
    const isOn = favs.includes(String(reciter.id));
    favBtn.textContent = isOn ? "★" : "☆";
    favBtn.classList.toggle("on", isOn);
    favBtn.onclick = () => {
      let list = [];
      try { list = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) {}
      const sid = String(reciter.id);
      if (list.includes(sid)) list = list.filter((x) => x !== sid);
      else list.push(sid);
      localStorage.setItem(key, JSON.stringify(list));
      favBtn.textContent = list.includes(sid) ? "★" : "☆";
      favBtn.classList.toggle("on", list.includes(sid));
    };
  }

  const list = document.getElementById("surah-list");
  if (list) {
    list.innerHTML = reciter.surahs.map((n) => {
      const url = surahUrl(reciter, n);
      const fname = reciter.name + " - " + (SURAH_NAMES[n] || n) + ".mp3";
      return `
      <div class="surah-row" data-n="${n}" role="button" tabindex="0">
        <span class="sr-num">${ar.format(n)}</span>
        <span class="sr-body">
          <strong>${SURAH_NAMES[n] || n}</strong>
          <em>${SURAH_EN[n] || ""}</em>
        </span>
        <span class="sr-actions">
          <a class="sr-dl" href="${url}" download="${fname}" target="_blank" rel="noopener" title="تنزيل" aria-label="تنزيل">↓</a>
        </span>
      </div>`;
    }).join("");
    list.onclick = (e) => {
      if (e.target.closest(".sr-dl")) return;
      const row = e.target.closest(".surah-row");
      if (!row) return;
      playReciter(reciter, Number(row.dataset.n));
    };
  }

  const sq = document.getElementById("surah-q");
  if (sq && list) {
    sq.oninput = () => {
      const q = sq.value.trim();
      list.querySelectorAll(".surah-row").forEach((row) => {
        const n = Number(row.dataset.n);
        const name = SURAH_NAMES[n] || "";
        const en = SURAH_EN[n] || "";
        const nq = normalizeArabic(q);
        const match = !q || normalizeArabic(name).includes(nq) || name.includes(q) || en.toLowerCase().includes(q.toLowerCase()) || String(n).includes(q);
        row.hidden = !match;
      });
    };
  }

  const playAll = document.getElementById("play-all");
  if (playAll) {
    playAll.onclick = () => {
      playReciter(reciter);
      playAll.classList.add("playing");
    };
  }
}

function resumeLast() {
  try {
    const raw = localStorage.getItem("tilawat-last");
    if (!raw) return;
    const last = JSON.parse(raw);
    if (!last || !last.url) return;
    queue = [{
      n: last.n,
      url: last.url,
      title: last.title || "سورة",
      reciterName: last.reciterName || "",
      reciterId: last.reciterId
    }];
    index = 0;
    const a = ensureAudio();
    a.src = last.url;
    showDock(last.title || "سورة", last.reciterName || "");
    a.pause();
    const btn = document.getElementById("dock-play");
    if (btn) btn.textContent = "▶";
  } catch (_) {}
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
    if (loading) loading.textContent = "تعذر التحميل. حدّث الصفحة.";
    return;
  }
  if (document.getElementById("grid")) {
    renderFavReciters();
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
  resumeLast();
}

boot();
