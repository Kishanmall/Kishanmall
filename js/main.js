(function () {
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // loader: particles -> ring -> logo -> shutter
  var loader = document.getElementById("loader");
  root.classList.add("loading");
  var done = false;
  function finish() {
    if (done) return; done = true;
    loader.classList.add("out");
    setTimeout(function () { loader.style.display = "none"; root.classList.remove("loading"); }, 1000);
  }
  loader.addEventListener("click", finish);
  setTimeout(finish, reduce ? 700 : 3300);
  requestAnimationFrame(function () { requestAnimationFrame(function () { loader.classList.add("go"); }); });
  var lp = document.getElementById("lp"), t0 = performance.now();
  (function tick(now) {
    if (done) return;
    var p = Math.min(1, (now - t0) / 2600);
    lp.textContent = Math.round(p * 100) + "%";
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  if (!reduce) {
    var cv = document.getElementById("lc"), x = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2), W, H, P = [];
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = W / 2, cy = H / 2 - 20;
    for (var i = 0; i < 130; i++) {
      var a = Math.random() * 6.283, r0 = Math.max(W, H) * (.25 + Math.random() * .5), r1 = 80 + Math.random() * 100;
      P.push({ sx: cx + Math.cos(a) * r0, sy: cy + Math.sin(a) * r0, tx: cx + Math.cos(a + 1) * r1, ty: cy + Math.sin(a + 1) * r1, s: Math.random() * 1.4 + .5, d: Math.random() * .4, w: Math.random() < .35 });
    }
    var s0 = performance.now();
    (function draw(now) {
      if (done && now - s0 > 4400) return;
      x.clearRect(0, 0, W, H);
      var t = (now - s0) / 1000;
      for (var i = 0; i < P.length; i++) {
        var q = P[i], k = Math.min(1, Math.max(0, (t - q.d) / 1.5)); k = 1 - Math.pow(1 - k, 3);
        var fade = t > 2.4 ? Math.max(0, 1 - (t - 2.4) * 2) : 1;
        x.globalAlpha = (.15 + .6 * k) * fade;
        x.fillStyle = q.w ? "#dfe8f7" : "#3f86ff";
        x.beginPath(); x.arc(q.sx + (q.tx - q.sx) * k, q.sy + (q.ty - q.sy) * k, q.s, 0, 6.283); x.fill();
      }
      requestAnimationFrame(draw);
    })(s0);
  }

  // mobile menu
  var menu = document.querySelector(".menu"), nav = document.querySelector(".nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "×" : "☰";
  }
  menu.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  document.getElementById("year").textContent = new Date().getFullYear();

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // 3D tilt (mouse only)
  if (reduce || !fine) return;
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    var max = parseFloat(el.dataset.tilt) || 8;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.classList.add("live");
      el.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () {
      el.classList.remove("live");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
})();
