const coreSongs = [
  ["Bohemian Rhapsody", "Queen"], ["Shape of You", "Ed Sheeran"], ["River Flows in You", "Yiruma"], ["Hotel California", "Eagles"],
  ["Let It Be", "The Beatles"], ["Fur Elise", "Beethoven"], ["Stairway to Heaven", "Led Zeppelin"], ["Perfect", "Ed Sheeran"],
  ["Canon in D", "Pachelbel"], ["Wonderwall", "Oasis"], ["Someone Like You", "Adele"], ["Imagine", "John Lennon"],
  ["Hallelujah", "Leonard Cohen"], ["Yesterday", "The Beatles"], ["Numb", "Linkin Park"], ["Clocks", "Coldplay"],
  ["Fix You", "Coldplay"], ["Thinking Out Loud", "Ed Sheeran"], ["Believer", "Imagine Dragons"], ["Viva La Vida", "Coldplay"],
  ["Take On Me", "a-ha"], ["All of Me", "John Legend"], ["My Heart Will Go On", "Celine Dion"], ["Smells Like Teen Spirit", "Nirvana"],
  ["Back in Black", "AC/DC"], ["Sweet Child O' Mine", "Guns N' Roses"], ["Zombie", "The Cranberries"], ["Hey Jude", "The Beatles"],
  ["Nothing Else Matters", "Metallica"], ["Skyfall", "Adele"], ["Senorita", "Shawn Mendes"], ["A Thousand Years", "Christina Perri"],
  ["Chasing Cars", "Snow Patrol"], ["Creep", "Radiohead"], ["Iris", "Goo Goo Dolls"], ["One", "U2"], ["No Woman No Cry", "Bob Marley"],
  ["Stand By Me", "Ben E. King"], ["Rocket Man", "Elton John"], ["Piano Man", "Billy Joel"], ["Unchained Melody", "The Righteous Brothers"],
  ["The Scientist", "Coldplay"], ["Yellow", "Coldplay"], ["Photograph", "Ed Sheeran"], ["Demons", "Imagine Dragons"], ["Shallow", "Lady Gaga"],
  ["Someone You Loved", "Lewis Capaldi"], ["Bad Guy", "Billie Eilish"], ["Lovely", "Billie Eilish"], ["Stay", "The Kid LAROI"],
  ["Blinding Lights", "The Weeknd"], ["Save Your Tears", "The Weeknd"], ["As It Was", "Harry Styles"], ["Watermelon Sugar", "Harry Styles"],
  ["Drivers License", "Olivia Rodrigo"], ["Good 4 U", "Olivia Rodrigo"], ["Lose Yourself", "Eminem"], ["Counting Stars", "OneRepublic"],
  ["Despacito", "Luis Fonsi"], ["La Bamba", "Ritchie Valens"], ["Billie Jean", "Michael Jackson"], ["Thriller", "Michael Jackson"],
  ["Beat It", "Michael Jackson"], ["Africa", "Toto"], ["Take Me Home, Country Roads", "John Denver"], ["Dust in the Wind", "Kansas"],
  ["Tears in Heaven", "Eric Clapton"], ["The A Team", "Ed Sheeran"], ["Love Story", "Taylor Swift"], ["Blank Space", "Taylor Swift"],
  ["Anti-Hero", "Taylor Swift"], ["Cruel Summer", "Taylor Swift"], ["Shake It Off", "Taylor Swift"], ["Bad Romance", "Lady Gaga"],
  ["Poker Face", "Lady Gaga"], ["Halo", "Beyonce"], ["Rolling in the Deep", "Adele"], ["Set Fire to the Rain", "Adele"],
  ["Easy On Me", "Adele"], ["Time After Time", "Cyndi Lauper"], ["Every Breath You Take", "The Police"], ["With or Without You", "U2"],
];

const expandedSongs = coreSongs.flatMap(([title, artist], i) => {
  const baseMidi = 55 + (i % 18);
  const notes = Array.from({ length: 12 }, (_, n) => baseMidi + [0, 3, 5, 7, 5, 3, 0, 2, 4, 7, 4, 2][n]);
  const tempo = 60 + (i * 7) % 90;
  return [
    { title, artist, genre: "Popular", instruments: ["piano", "guitar"], tempo, notes },
    { title: `${title} (Acoustic)`, artist, genre: "Popular", instruments: ["guitar"], tempo: Math.max(55, tempo - 8), notes: [...notes].reverse() },
    { title: `${title} (Piano Solo)`, artist, genre: "Popular", instruments: ["piano"], tempo: tempo + 4, notes },
  ];
});

const songs = expandedSongs;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const page = document.body.dataset.page;
const storage = { instrument: "songAtlas.instrument", song: "songAtlas.song" };
const get = (k) => localStorage.getItem(storage[k]);
const set = (k, v) => localStorage.setItem(storage[k], v);
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
const midiToNoteName = (m) => `${NOTE_NAMES[m % 12]}${Math.floor(m / 12) - 1}`;

const setupDarkVeilBackground = () => {
  if (document.querySelector("#darkVeilCanvas")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "darkVeilCanvas";
  canvas.className = "darkveil-canvas";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let raf = 0;
  const speed = 0.5;
  const warpAmount = 0.12;

  const resize = () => {
    canvas.width = Math.max(1, Math.floor(window.innerWidth));
    canvas.height = Math.max(1, Math.floor(window.innerHeight));
  };

  const drawFrame = (timeMs) => {
    const t = (timeMs / 1000) * speed;
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#020005");
    bg.addColorStop(1, "#070012");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const drawRibbon = (phase, hueShift) => {
      const cx = w * (0.25 + 0.5 * Math.sin(t * 0.23 + phase));
      const cy = h * (0.26 + 0.18 * Math.cos(t * 0.37 + phase));
      const radiusX = w * (0.65 + 0.05 * Math.sin(t * 0.2 + phase));
      const radiusY = h * (0.32 + 0.04 * Math.cos(t * 0.28 + phase));

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(radiusX, radiusY));
      grad.addColorStop(0, `hsla(${268 + hueShift}, 95%, 64%, 0.95)`);
      grad.addColorStop(0.18, `hsla(${260 + hueShift}, 95%, 56%, 0.7)`);
      grad.addColorStop(0.5, `hsla(${258 + hueShift}, 90%, 35%, 0.35)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.sin(t * 0.42 + phase) * warpAmount);
      ctx.translate(-w / 2, -h / 2);
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };

    drawRibbon(0.0, 0);
    drawRibbon(1.7, 12);
    drawRibbon(3.1, -10);

    raf = requestAnimationFrame(drawFrame);
  };

  resize();
  raf = requestAnimationFrame(drawFrame);
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  });
};
setupDarkVeilBackground();

const setupCardNav = () => {
  const nav = document.querySelector("#cardNav");
  const toggle = document.querySelector("#menuToggle");
  if (!nav || !toggle) return;
  const onToggle = () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", onToggle);
  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  });
};
setupCardNav();

const setupMagicBentoEffects = () => {
  const navContent = document.querySelector(".card-nav-content");
  const cards = Array.from(document.querySelectorAll(".nav-card"));
  if (!navContent || !cards.length) return;

  const glowColor = "132, 0, 255";
  const spotlightRadius = 400;

  const spotlight = document.createElement("div");
  spotlight.className = "global-spotlight";
  navContent.appendChild(spotlight);

  const setCardGlow = (card, mouseX, mouseY, intensity) => {
    const rect = card.getBoundingClientRect();
    const x = ((mouseX - rect.left) / rect.width) * 100;
    const y = ((mouseY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
    card.style.setProperty("--glow-intensity", String(Math.max(0, Math.min(1, intensity))));
    card.style.setProperty("--glow-color", glowColor);
  };

  const spawnParticles = (card) => {
    const rect = card.getBoundingClientRect();
    const count = 12;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("div");
      particle.className = "magic-particle";
      particle.style.left = `${Math.random() * rect.width}px`;
      particle.style.top = `${Math.random() * rect.height}px`;
      particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 90}px`);
      particle.style.setProperty("--dy", `${(Math.random() - 0.5) * 90}px`);
      particle.style.setProperty("--dur", `${1.7 + Math.random() * 1.8}s`);
      card.appendChild(particle);
      setTimeout(() => particle.remove(), 3500);
    }
  };

  cards.forEach((card) => {
    card.classList.add("magic-bento-card--border-glow");
    card.addEventListener("mouseenter", () => spawnParticles(card));
    card.addEventListener("click", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "magic-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    });
  });

  const onMouseMove = (event) => {
    const navRect = navContent.getBoundingClientRect();
    const inside = event.clientX >= navRect.left && event.clientX <= navRect.right && event.clientY >= navRect.top && event.clientY <= navRect.bottom;
    if (!inside) {
      spotlight.style.opacity = "0";
      cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
      return;
    }

    spotlight.style.opacity = "1";
    spotlight.style.left = `${event.clientX - navRect.left}px`;
    spotlight.style.top = `${event.clientY - navRect.top}px`;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      const intensity = Math.max(0, 1 - distance / spotlightRadius);
      setCardGlow(card, event.clientX, event.clientY, intensity);
    });
  };

  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("beforeunload", () => document.removeEventListener("mousemove", onMouseMove));
};
setupMagicBentoEffects();


if (page === "main") {
  history.replaceState({}, "", "/Main");
  document.querySelectorAll(".instrument-big").forEach((b) => b.addEventListener("click", () => {
    const instrument = b.textContent.trim().toLowerCase();
    set("instrument", instrument);
    localStorage.removeItem(storage.song);
    location.href = `Song-${instrument}.html`;
  }));
}

if (page === "song-piano" || page === "song-guitar") {
  const instrument = page === "song-piano" ? "piano" : "guitar";
  set("instrument", instrument);
  history.replaceState({}, "", `/Song-${instrument}`);
  const search = document.querySelector("#searchInput");
  const list = document.querySelector("#songList");
  const topGradient = document.querySelector("#topGradient");
  const bottomGradient = document.querySelector("#bottomGradient");
  document.querySelector("#backToMain")?.addEventListener("click", () => (location.href = "Main.html"));

  let filtered = [];
  let selectedIndex = -1;

  const updateGradients = () => {
    if (!list || !topGradient || !bottomGradient) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    topGradient.style.opacity = String(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    bottomGradient.style.opacity = scrollHeight <= clientHeight ? "0" : String(Math.min(bottomDistance / 50, 1));
  };

  const selectSong = (song) => {
    set("song", song.title);
    location.href = "preview.html";
  };

  const render = () => {
    const q = search.value.trim().toLowerCase();
    filtered = songs
      .filter((song) => song.instruments.includes(instrument) && `${song.title} ${song.artist}`.toLowerCase().includes(q))
      .slice(0, 300);

    list.innerHTML = "";
    selectedIndex = filtered.length ? 0 : -1;

    filtered.forEach((song, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = `item ${selectedIndex === index ? "selected" : ""}`;
      wrapper.dataset.index = String(index);
      wrapper.setAttribute("role", "option");
      wrapper.setAttribute("aria-selected", selectedIndex === index ? "true" : "false");

      const title = document.createElement("p");
      title.className = "item-title";
      title.textContent = song.title;

      const sub = document.createElement("p");
      sub.className = "item-sub";
      sub.textContent = `${song.artist} • ${song.genre} • ${song.tempo} BPM`;

      wrapper.append(title, sub);
      wrapper.addEventListener("mouseenter", () => {
        selectedIndex = index;
        list.querySelectorAll(".item").forEach((el, i) => {
          el.classList.toggle("selected", i === selectedIndex);
          el.setAttribute("aria-selected", i === selectedIndex ? "true" : "false");
        });
      });
      wrapper.addEventListener("click", () => selectSong(song));
      list.append(wrapper);
    });

    updateGradients();
  };

  const ensureVisible = () => {
    const selectedItem = list.querySelector(`[data-index="${selectedIndex}"]`);
    if (!selectedItem) return;
    const extraMargin = 50;
    const containerTop = list.scrollTop;
    const containerHeight = list.clientHeight;
    const itemTop = selectedItem.offsetTop;
    const itemBottom = itemTop + selectedItem.offsetHeight;
    if (itemTop < containerTop + extraMargin) {
      list.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
    } else if (itemBottom > containerTop + containerHeight - extraMargin) {
      list.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: "smooth" });
    }
  };

  const onKeyDown = (event) => {
    if (!["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(event.key)) return;
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      if (!filtered.length) return;
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
    } else if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      if (!filtered.length) return;
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (event.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < filtered.length) {
        event.preventDefault();
        selectSong(filtered[selectedIndex]);
      }
    }

    list.querySelectorAll(".item").forEach((el, i) => {
      el.classList.toggle("selected", i === selectedIndex);
      el.setAttribute("aria-selected", i === selectedIndex ? "true" : "false");
    });
    ensureVisible();
  };

  search.addEventListener("input", render);
  list.addEventListener("scroll", updateGradients);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("beforeunload", () => window.removeEventListener("keydown", onKeyDown));
  render();
}

if (page === "preview") {
  const instrument = get("instrument");
  const songTitle = get("song");
  const song = songs.find((s) => s.title === songTitle && s.instruments.includes(instrument));
  if (!song || !instrument) {
    location.href = "Main.html";
  } else {
    const instLetter = instrument[0].toUpperCase();
    history.replaceState({}, "", `/Preview-${instLetter}${slug(song.title)}`);

    const previewTitle = document.querySelector("#previewTitle");
    const previewMeta = document.querySelector("#previewMeta");
    const countdownLabel = document.querySelector("#countdownLabel");
    const staff = document.querySelector("#staff");
    const tempoLabel = document.querySelector("#tempoLabel");
    const progressLabel = document.querySelector("#progressLabel");
    const currentNoteLabel = document.querySelector("#currentNoteLabel");
    const skipCountdown = document.querySelector("#skipCountdown");
    previewTitle.textContent = `${song.title} (${instrument})`;
    previewMeta.textContent = `${song.artist} • ${song.genre}`;
    tempoLabel.textContent = song.tempo;

    let idx = 0;
    let loop = 0;
    let playing = false;
    let timer = null;
    let raf = 0;
    let last = performance.now();

    const midiToY = (m) => 280 - (Math.max(52, Math.min(84, m)) - 52) * 5;
    const drawStaff = () => [120, 145, 170, 195, 220].forEach((y) => {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", "50"); l.setAttribute("x2", "950"); l.setAttribute("y1", y); l.setAttribute("y2", y);
      l.setAttribute("stroke", "#85785f"); l.setAttribute("stroke-width", "2");
      staff.append(l);
    });
    const blend = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

    const drawQuarterNote = (x, y, fill, isCurrent) => {
      const noteHead = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      noteHead.setAttribute("cx", x);
      noteHead.setAttribute("cy", y);
      noteHead.setAttribute("rx", "11");
      noteHead.setAttribute("ry", "8");
      noteHead.setAttribute("transform", `rotate(-22 ${x} ${y})`);
      noteHead.setAttribute("fill", fill);
      noteHead.setAttribute("stroke", "#10162e");
      noteHead.setAttribute("stroke-width", "1.2");
      noteHead.setAttribute("opacity", isCurrent ? "1" : "0.72");

      const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
      stem.setAttribute("d", `M ${x + 8} ${y - 2} L ${x + 8} ${y - 44}`);
      stem.setAttribute("stroke", "#1b2a52");
      stem.setAttribute("stroke-width", "2.2");
      stem.setAttribute("stroke-linecap", "round");

      const flag = document.createElementNS("http://www.w3.org/2000/svg", "path");
      flag.setAttribute("d", `M ${x + 8} ${y - 43} C ${x + 23} ${y - 39}, ${x + 20} ${y - 25}, ${x + 9} ${y - 18}`);
      flag.setAttribute("fill", "none");
      flag.setAttribute("stroke", "#1b2a52");
      flag.setAttribute("stroke-width", "2");
      flag.setAttribute("stroke-linecap", "round");

      if (isCurrent) {
        const pulse = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        pulse.setAttribute("attributeName", "transform");
        pulse.setAttribute("type", "scale");
        pulse.setAttribute("values", "1 1;1.08 1.08;1 1");
        pulse.setAttribute("dur", "0.6s");
        pulse.setAttribute("repeatCount", "indefinite");
        pulse.setAttribute("additive", "sum");
        noteHead.append(pulse);
      }

      staff.append(noteHead);
      staff.append(stem);
      staff.append(flag);

      if (y < 118 || y > 222) {
        const ledger = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ledger.setAttribute("x1", x - 16);
        ledger.setAttribute("x2", x + 16);
        ledger.setAttribute("y1", y);
        ledger.setAttribute("y2", y);
        ledger.setAttribute("stroke", "#76684b");
        ledger.setAttribute("stroke-width", "1.8");
        staff.append(ledger);
      }
    };

    const draw = () => {
      staff.innerHTML = "";
      drawStaff();
      const c = idx % song.notes.length;
      const near = c >= song.notes.length - 3;
      const mix = near ? (c - (song.notes.length - 3)) / 2 : 0;
      const color = `rgb(${blend([245, 158, 11], [122, 125, 133], mix).join(",")})`;
      song.notes.forEach((m, n) => {
        const x = 130 + (((n - c + song.notes.length) % song.notes.length) * 70);
        const y = midiToY(m);
        drawQuarterNote(x, y, n === c ? color : "#364a7d", n === c);
      });
      currentNoteLabel.textContent = midiToNoteName(song.notes[c]);
      progressLabel.textContent = `${Math.floor((c / (song.notes.length - 1 || 1)) * 100)}%`;
    };

    const startPlay = () => { playing = true; last = performance.now(); countdownLabel.textContent = "Playing now"; skipCountdown.classList.add("hidden"); };
    const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
    const reset = () => { playing = false; stopTimer(); idx = 0; loop = 0; draw(); countdownLabel.textContent = "Reset complete. Press Start."; skipCountdown.classList.add("hidden"); };

    document.querySelector("#startPlayback").addEventListener("click", () => {
      if (playing) return;
      stopTimer();
      let v = 5;
      skipCountdown.classList.remove("hidden");
      countdownLabel.textContent = `Starting in ${v}...`;
      timer = setInterval(() => {
        v -= 1;
        if (v >= 0) countdownLabel.textContent = `Starting in ${v}...`;
        else { stopTimer(); startPlay(); }
      }, 1000);
    });

    skipCountdown.addEventListener("click", () => { stopTimer(); startPlay(); });
    document.querySelector("#resetPlayback").addEventListener("click", reset);
    document.querySelector("#backToSongs").addEventListener("click", () => (location.href = `Song-${instrument}.html`));

    const animate = (ts) => {
      raf = requestAnimationFrame(animate);
      if (!playing) return;
      if (ts - last >= 60000 / song.tempo) {
        idx += 1;
        if (idx >= song.notes.length) { idx = 0; loop += 1; }
        draw();
        last = ts;
        if (loop >= 1 && idx === song.notes.length - 1) {
          playing = false;
          countdownLabel.textContent = "Finished one full pass.";
        }
      }
    };

    draw();
    raf = requestAnimationFrame(animate);
    window.addEventListener("beforeunload", () => { stopTimer(); cancelAnimationFrame(raf); });
  }
}
