const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const state = {
  flow: "scan",
  currentScreen: "login",
  screenStack: [],
  pin: [],
  pinChange: { step: "current", entry: "", current: "", next: "" },
  otpTimer: null,
  otpSec: 120,
  modalTimer: null,
  modalSec: 299,
  homeCouponAutoTimer: null,
  homeCouponAutoPausedUntil: 0,
  homePromoShown: false,
  couponTab: "active",
  selectedPoint: 0,
  review: null,
  lastSlipItem: null,
  points: [
    { name: "Point App", sub: "Sunee Grand Hotel", logo: "SUNEE<br>GRAND", color: "#B71C1C", balance: 3716 },
    { name: "สวัสดิการพนักงาน", sub: "Sunee Tower", logo: "SUNEE<br>TOWER", color: "#7B0000", balance: 1000 },
    { name: "แสตมป์โกลด์", sub: "หมดอายุ 31/08/2026", logo: "SUNEE<br>GOLD", color: "#C9A84C", balance: 100 }
  ],
  coupons: {
    active: [
      { icon: "กาแฟ", value: "20%", style: "", name: "ส่วนลดเครื่องดื่ม 20%", cond: "ซื้อขั้นต่ำ ฿100 ทุกเมนู", exp: "30 เม.ย. 2026", urgent: true },
      { icon: "อาหาร", value: "฿50", style: "gold", name: "ลด ฿50 เมนูอาหาร", cond: "สำหรับสมาชิก Gold ขึ้นไป", exp: "15 พ.ค. 2026" },
      { icon: "ของขวัญ", value: "ฟรี", style: "green", name: "ขนมฟรี 1 ชิ้น", cond: "ซื้อครบ ฿300 ขึ้นไป", exp: "1 มิ.ย. 2026" },
      { icon: "SF", value: "50 บาท", style: "blue", name: "ส่วนลด SF Cinema", cond: "ตั๋วหนัง SF ทุกเรื่อง ทุกที่นั่ง ทุกสาขา", exp: "31 ธ.ค. 2025", image: "images/coupon/1777642864744.jpg", detail: "รายละเอียดคูปอง: ส่วนลด 50 บาท สำหรับซื้อตั๋วหนัง SF ทุกเรื่อง ทุกที่นั่ง ทุกสาขา ใช้ได้ถึง 31/12/2025 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" }
    ],
    collect: [
      { icon: "พิซซ่า", value: "15%", name: "ลดพิซซ่า 15%", cond: "ทุกออเดอร์ ไม่มีขั้นต่ำ", exp: "หมด 31 พ.ค. 2026", collect: true },
      { icon: "ชา", value: "1+1", style: "gold", name: "ชาไข่มุก ซื้อ 1 แถม 1", cond: "เฉพาะสาขา Central", exp: "หมด 10 พ.ค. 2026", collect: true },
      { icon: "แต้ม", value: "2x", name: "แต้มสองเท่า Gold", cond: "เฉพาะสมาชิก Gold ขึ้นไป", exp: "หมด 30 มิ.ย. 2026", collected: true }
    ],
    used: [
      { icon: "น้ำ", value: "15%", name: "ลดเครื่องดื่ม 15%", cond: "ใช้ไปเมื่อ 20 เม.ย. 2026", exp: "ประหยัดได้ ฿45", disabled: true }
    ],
    expired: [
      { icon: "ขนม", value: "10%", name: "ลดขนม 10%", cond: "หมดอายุ 1 เม.ย. 2026", exp: "หมดอายุแล้ว", disabled: true }
    ]
  },
  events: [
    // กิจกรรม (index 0-2)
    { tag:"บุฟเฟ่ต์พิเศษ", title:"Shabu Shi Taste of Sakura", date:"30 เม.ย. - 30 มิ.ย. 2569", theme:"red", image:"images/banners/686857697_1391694419671626_4043196099224849777_n.jpg", text:"เสิร์ฟความอร่อยสไตล์ญี่ปุ่น บุฟเฟ่ต์ ฿399+ พร้อม 11 เมนูใหม่ ซุปเย็นตาโฟฮอตโตะ เสิร์ฟฟรีไม่อั้น!", section:"events" },
    { tag:"กิจกรรม", title:"SUNEE COVER DANCE", date:"2 พฤศจิกายน 2568 เวลา 15:00-20:00 น.", theme:"dance", image:"images/banners/1699330241028-3.png", text:"กิจกรรม Cover Dance ชิงรางวัลรวม 50,000 บาท พร้อมกิจกรรม Random Dance จาก Gravity Motion", section:"events" },
    { tag:"บุฟเฟ่ต์พิเศษ", title:"MK มหกรรมลูกชิ้น", date:"คุ้มเกินคุ้ม ฿299 NET/ท่าน", theme:"red", image:"images/banners/683442266_1589975659794822_2527687181127221259_n.jpg", text:"คุ้มเกินคุ้ม 299 บาท/ท่าน มหกรรมลูกชิ้น กินได้ไม่อั้น กว่า 29 เมนู อิ่มไม่อั้น 90 นาที", section:"events" },
    // ร้านค้า (index 3)
    { tag:"เครื่องดื่ม", title:"Momoyo — Matcha Frappe Snow Float", date:"ใหม่! ฿85 / ไม่ใส่ไอศกรีม ฿79", theme:"green", image:"images/banners/684904038_1391514463022955_8466438417816371258_n.jpg", text:"มัทฉะเฟรปเป้สโนวโฟลท เมนูใหม่จาก Momoyo ราคา 85 บาท หรือแบบไม่ใส่ไอศกรีม 79 บาท", section:"shops" },
    // โปรโมชั่นร้านอาหาร (index 4-7 แต่เดิม 0-2 ยังคงใช้ index 0,1,2 ด้วย)
    { tag:"โปรโมชั่น", title:"แซ่บเกินต้าน! เพิ่ม ฿39/ท่าน", date:"สั่งลิ้นวัวและเอ็นแก้วได้ไม่อั้น", theme:"red", image:"images/banners/682709069_1389829999858068_3008098668341900913_n.jpg", text:"คุ้มมาก เพิ่มเพียง 39 บาท/ท่าน สั่งลิ้นวัว และเอ็นแก้ว ได้ไม่อั้น แซ่บเกินต้าน!", section:"promos" },
    { tag:"Food Court ชั้น 1", title:"โปรวันแรงงาน จานยักษ์ ฿79", date:"1-3 พ.ค. 10:00-21:00 น.", theme:"gold", image:"images/banners/678595127_1384984320342636_8606715833503969445_n.jpg", text:"โปรวันแรงงาน จานยักษ์จัดหนัก 79 บาท มีเมนูให้เลือกหลากหลาย ก๋วยเตี๋ยวเป็ดย่าง ต้มเล้ง มะหมี่ขาหมู ผัดไทยไก่กรอบ และอีกมากมาย", section:"promos" },
    { tag:"ร้อนสุนีย์ ชั้น 1", title:"มื้อเช้าสุดคุ้ม ฿125/ท่าน", date:"จันทร์-ศุกร์ 06:30-10:00 น.", theme:"red", image:"images/banners/683643035_1390125546495180_2495150725598815981_n.jpg", text:"อิ่มอร่อยรับวันใหม่ มื้อเช้าสุดคุ้ม เพียง 125 บาท/ท่าน โปร 12 ฟรี 1 ยิ่งมาเยอะยิ่งคุ้ม โรงแรมสุนีย์แกรนด์ ชั้น 1", section:"promos" },
    // เดิม (ยังคงไว้ที่ index 7-8 สำรอง)
    { tag:"โครงการหลวง", title:"ดี อร่อย สดจากดอย", date:"6-14 กันยายน 2568", theme:"green", image:"images/banners/1699330241028-1.png", text:"พบสินค้าโครงการหลวงและวัตถุดิบสดใหม่จากดอย คัดสรรมาให้สมาชิก Sunee Member", section:"events" },
    { tag:"สินค้าเกษตร", title:"Royal Project Fair", date:"6-14 กันยายน 2568", theme:"green", image:"images/banners/1699330241028-2.png", text:"งานรวมสินค้าเกษตรคุณภาพ ผัก ผลไม้ และผลิตภัณฑ์สุขภาพจากโครงการหลวง", section:"events" }
  ]
};

function money(n) {
  return Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showScreen(name, options = {}) {
  if (state.currentScreen && state.currentScreen !== name && !options.replace) {
    state.screenStack.push(state.currentScreen);
  }
  state.currentScreen = name;
  $(".device")?.classList.toggle("auth-mode", ["login", "register", "forgotPassword"].includes(name));
  $$(".screen").forEach(s => s.classList.toggle("active", s.dataset.screen === name));
  $$(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.screenTarget === name || (name === "memberQr" && b.classList.contains("center"))));
  $$(".desktop-sidebar [data-screen-target]").forEach(b => b.classList.toggle("active", b.dataset.screenTarget === name || (name === "memberQr" && b.dataset.screenTarget === "home")));
  if (name === "scanner") {
    applyFlowCopy();
    showScanStep("scan");
  }
  if (name === "home") showHomePromoPopup();
}

function goBack() {
  const previous = state.screenStack.pop() || "home";
  showScreen(previous, { replace: true });
}

function switchLoginTab(name) {
  $$(".login-tab").forEach(t => t.classList.toggle("active", t.dataset.loginTab === name));
  $$(".login-panel").forEach(p => p.classList.toggle("active", p.dataset.loginPanel === name));
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.hidden = true), 1800);
}

function fakeQr(color = "#B71C1C") {
  const blocks = [
    [5,5,30,30,0],[65,5,30,30,0],[5,65,30,30,0],[40,5,7,7,1],[50,5,7,7,1],
    [40,15,7,7,1],[5,40,7,7,1],[15,40,7,7,1],[25,40,7,7,1],[65,40,7,7,1],
    [75,40,7,7,1],[88,40,7,7,1],[40,65,7,7,1],[50,65,7,7,1],[65,70,7,7,1],
    [40,75,7,7,1],[50,75,7,7,1],[65,80,22,7,1],[40,88,7,7,1],[55,88,7,7,1],[75,88,14,7,1]
  ];
  const rects = blocks.map(([x,y,w,h,fill]) => fill
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${color}"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="${color}" stroke-width="3"/><rect x="${x+6}" y="${y+6}" width="${w-12}" height="${h-12}" rx="2" fill="${color}"/>`
  ).join("");
  return `<svg class="qr-svg" viewBox="0 0 100 100" aria-hidden="true">${rects}<circle cx="50" cy="50" r="8" fill="${color}"/><text x="50" y="55" text-anchor="middle" font-size="9" font-weight="900" fill="white" font-family="Georgia,serif">S</text></svg>`;
}

function renderNavs() {
  const items = [
    ["home", "⌂", "หน้าหลัก"],
    ["points", "★", "แสตมป์"],
    ["scanner", "▣", "สแกน QR", "center"],
    ["coupons", "%", "คูปอง"],
    ["profile", "○", "โปรไฟล์"]
  ];
  $$(".bottom-nav").forEach(nav => {
    nav.innerHTML = items.map(([target, icon, label, cls]) =>
      `<button class="${cls || ""}" data-screen-target="${target}"><b>${icon}</b><span>${label}</span></button>`
    ).join("");
  });
}

function normalizeSuneeLogos() {
  $$(".brand-mark").forEach(mark => {
    if (mark.classList.contains("large")) return;
    mark.classList.add("app-image-logo");
    mark.innerHTML = '<img src="icon/icon-sunee.png" alt="">';
  });
}

function renderLogin() {
  $("#pinDots").innerHTML = Array.from({ length: 6 }, (_, i) => `<span data-dot="${i}"></span>`).join("");
  const nums = [1,2,3,4,5,6,7,8,9,"",0,"⌫"];
  $("#pinGrid").innerHTML = nums.map(n => `<button data-pin="${n}">${n}</button>`).join("");
  $("#otpRow").innerHTML = Array.from({ length: 6 }, (_, i) => `<input inputmode="numeric" maxlength="1" data-otp="${i}" aria-label="OTP ${i + 1}">`).join("");
}

function renderPinChange() {
  const titles = {
    current: ["ยืนยัน PIN ปัจจุบัน", "กรอก PIN 6 หลัก เพื่อดำเนินการต่อ"],
    next: ["ตั้ง PIN ใหม่", "กรอก PIN ใหม่ 6 หลัก"],
    confirm: ["ยืนยัน PIN ใหม่", "กรอก PIN ใหม่อีกครั้งให้ตรงกัน"]
  };
  const [title, hint] = titles[state.pinChange.step];
  $("#pinChangeTitle").textContent = title;
  $("#pinChangeHint").textContent = hint;
  $("#pinChangeDots").innerHTML = Array.from({ length: 6 }, (_, i) => `<span class="${i < state.pinChange.entry.length ? "filled" : ""}"></span>`).join("");
  const nums = [1,2,3,4,5,6,7,8,9,"",0,"⌫"];
  $("#pinChangeGrid").innerHTML = nums.map(n => `<button data-pin-change="${n}">${n}</button>`).join("");
  $("#pinChangeBack").hidden = state.pinChange.step === "current";
}

function openPinChangeModal() {
  state.pinChange = { step: "current", entry: "", current: "", next: "" };
  renderPinChange();
  $("#pinChangeModal").hidden = false;
}

function closePinChangeModal() {
  $("#pinChangeModal").hidden = true;
}

function advancePinChange() {
  const entry = state.pinChange.entry;
  if (state.pinChange.step === "current") {
    state.pinChange.current = entry;
    state.pinChange.step = "next";
    state.pinChange.entry = "";
    renderPinChange();
    return;
  }
  if (state.pinChange.step === "next") {
    state.pinChange.next = entry;
    state.pinChange.step = "confirm";
    state.pinChange.entry = "";
    renderPinChange();
    return;
  }
  if (entry !== state.pinChange.next) {
    toast("PIN ใหม่ไม่ตรงกัน กรุณากรอกอีกครั้ง");
    state.pinChange.entry = "";
    renderPinChange();
    return;
  }
  closePinChangeModal();
  toast("บันทึก PIN ใหม่เรียบร้อยแล้ว");
}

function pressPinChange(value) {
  if (value === "") return;
  if (value === "⌫") state.pinChange.entry = state.pinChange.entry.slice(0, -1);
  else if (state.pinChange.entry.length < 6) state.pinChange.entry += value;
  renderPinChange();
  if (state.pinChange.entry.length === 6) setTimeout(advancePinChange, 180);
}

const couponImages = [
  "images/coupon/1777642634817.jpg",
  "images/coupon/1777642646632.jpg",
  "images/coupon/1777642659466.jpg",
  "images/coupon/1777642691961.jpg",
  "images/coupon/1777642708925.jpg",
  "images/coupon/1777642731441.jpg",
  "images/coupon/1777642864744.jpg",
  "images/coupon/1777642674064.jpg",
  "images/coupon/1777642738657.jpg",
  "images/coupon/1777642699643.jpg",
  "images/coupon/1777642717108.jpg"
];

function getCouponImage(tab, index) {
  const coupon = state.coupons[tab]?.[Number(index)];
  if (coupon?.image) return coupon.image;
  const offsets = { active: 0, collect: 3, used: 7, expired: 9 };
  return couponImages[((offsets[tab] || 0) + Number(index)) % couponImages.length];
}

function isLandscapeCouponImage(src) {
  return src.includes("1777642864744");
}

function couponImageClass(src) {
  return isLandscapeCouponImage(src) ? "is-landscape" : "";
}

const homeCouponData = [
  { tag:"ส่วนลดพิเศษ", val:"20% OFF", sub:"เครื่องดื่มทุกเมนู", cond:"ซื้อขั้นต่ำ ฿100 ทุกเมนู", exp:"กดเก็บได้ถึง 30 เม.ย. 2569", color:"#B71C1C", collected:false, detail:"รายละเอียดคูปอง: ซื้อขั้นต่ำ ฿100 ทุกเมนู ใช้ได้ถึง 30 เม.ย. 2569 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" },
  { tag:"สิทธิพิเศษ Gold", val:"฿50 OFF", sub:"เมนูอาหารทุกชนิด", cond:"สำหรับสมาชิก Gold ขึ้นไป", exp:"กดเก็บได้ถึง 15 พ.ค. 2569", color:"linear-gradient(135deg,#C9A84C,#E6B800)", collected:false, detail:"รายละเอียดคูปอง: สำหรับสมาชิก Gold และ Platinum เท่านั้น ใช้ได้ถึง 15 พ.ค. 2569 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" },
  { tag:"ของฟรี!", val:"ฟรี 1 ชิ้น", sub:"ขนมและเบเกอรี่", cond:"ซื้อครบ ฿300 ขึ้นไป", exp:"กดเก็บได้ถึง 1 มิ.ย. 2569", color:"linear-gradient(135deg,#2E7D32,#388E3C)", collected:false, detail:"รายละเอียดคูปอง: ซื้อครบ ฿300 ขึ้นไปในรายการขนมและเบเกอรี่ ใช้ได้ถึง 1 มิ.ย. 2569 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" },
  { tag:"สะสมแต้มพิเศษ", val:"2x Points", sub:"ทุกการใช้จ่าย", cond:"ใช้ได้เฉพาะ Weekend", exp:"กดเก็บได้ถึง 30 มิ.ย. 2569", color:"linear-gradient(135deg,#6A1B9A,#7B1FA2)", collected:false, detail:"รายละเอียดคูปอง: รับแต้มสะสมสองเท่าทุกวันเสาร์-อาทิตย์ ใช้ได้ถึง 30 มิ.ย. 2569 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" },
  { tag:"ห้องพักพิเศษ", val:"15% OFF", sub:"ห้องพัก Deluxe", cond:"จองล่วงหน้า 7 วัน", exp:"กดเก็บได้ถึง 31 ก.ค. 2569", color:"linear-gradient(135deg,#0277BD,#01579B)", collected:false, detail:"รายละเอียดคูปอง: จองห้องพัก Deluxe ล่วงหน้าอย่างน้อย 7 วัน ใช้ได้ถึง 31 ก.ค. 2569 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" },
  { tag:"Movie Time", val:"50 บาท", sub:"ตั๋วหนัง SF", cond:"ส่วนลดตั๋วหนัง SF ทุกเรื่อง", exp:"กดเก็บได้ถึง 31 ธ.ค. 2568", color:"#0c1f4d", collected:false, image:"images/coupon/1777642864744.jpg", detail:"รายละเอียดคูปอง: ส่วนลด 50 บาท สำหรับตั๋วหนัง SF ทุกเรื่อง ทุกที่นั่ง ทุกสาขา ใช้ได้ถึง 31/12/2025 กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์" }
];

function renderHomeCoupons() {
  $("#homeCoupons").innerHTML = homeCouponData.map((c, i) => `
    <article class="home-coupon ${couponImageClass(c.image || couponImages[i])}" data-home-coupon="${i}" style="cursor:pointer;">
      <div class="home-coupon-img"><img src="${c.image || couponImages[i]}" alt="${c.val}"></div>
      <div class="body">
        <p>${c.cond}</p>
        <span class="home-coupon-exp">${c.exp}</span>
        <button data-collect-home="${i}">${c.collected ? "ใช้" : "กดเก็บคูปอง"}</button>
      </div>
    </article>
  `).join("");
}

function setupHomeCouponAutomation() {
  const strip = $("#homeCoupons");
  if (!strip) return;

  const pause = () => {
    state.homeCouponAutoPausedUntil = Date.now() + 6000;
  };

  ["pointerdown", "wheel", "touchstart"].forEach(eventName => {
    strip.addEventListener(eventName, pause, { passive: true });
  });

  clearInterval(state.homeCouponAutoTimer);
  state.homeCouponAutoTimer = setInterval(() => {
    if (state.currentScreen !== "home") return;
    if (Date.now() < state.homeCouponAutoPausedUntil) return;
    const card = strip.querySelector(".home-coupon");
    if (!card) return;
    const gap = 10;
    const step = card.offsetWidth + gap;
    const nearEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
    strip.scrollTo({
      left: nearEnd ? 0 : strip.scrollLeft + step,
      behavior: "smooth"
    });
  }, 3500);
}

function renderPoints() {
  const html = state.points.map((p, i) => `
    <button class="stamp-card" data-open-point="${i}">
      <span class="stamp-logo" style="background:${p.color}">${p.logo}</span>
      <span class="info"><h3>${p.name}</h3><p>${p.sub}</p></span>
      <strong>${money(p.balance)}</strong>
    </button>
  `).join("");
  $("#pointList").innerHTML = html;
  $("#stampList").innerHTML = html;
}

function renderCoupons() {
  const labels = { active: `ใช้ได้ (${state.coupons.active.length})`, collect: "เก็บคูปอง", used: "ใช้แล้ว", expired: "หมดอายุ" };
  const collectAllTab = state.couponTab === "collect"
    ? `<button class="coupon-tabs-collect-all" data-collect-all>กดเก็บทั้งหมด</button>`
    : "";
  $("#couponTabs").innerHTML = Object.entries(labels).map(([key, label]) =>
    `<button class="${state.couponTab === key ? "active" : ""}" data-coupon-tab="${key}">${label}</button>`
  ).join("") + collectAllTab;
  const collectAll = state.couponTab === "collect"
    ? `<button class="collect-all-btn" data-collect-all>กดเก็บทั้งหมด</button>`
    : "";
  $("#couponList").innerHTML = collectAll + state.coupons[state.couponTab].map((c, i) => {
    const image = getCouponImage(state.couponTab, i);
    return `
    <article class="coupon-item ${couponImageClass(image)}" data-coupon-detail="${state.couponTab}:${i}" ${c.disabled ? 'style="opacity:.55;filter:grayscale(.4)"' : ""}>
      <div class="coupon-image-side"><img src="${image}" alt="${c.name}"></div>
      <div class="coupon-body">
        <h3>${c.name}</h3><p>${c.cond}</p>
        <div class="coupon-footer">
          <span class="${c.urgent ? "urgent" : ""}">${c.exp}</span>
          <button ${c.disabled || c.collected ? "disabled" : ""} data-coupon-action="${c.collect ? "collect" : "use"}">${c.collected ? "เก็บแล้ว" : c.collect ? "เก็บ" : c.disabled ? "ปิด" : "ใช้เลย"}</button>
        </div>
      </div>
    </article>
  `}).join("");
}

function renderPromosFull() {
  const items = state.events.filter(ev => ev.section === "promos");
  $("#promoListFull").innerHTML = items.map(ev => {
    const idx = state.events.indexOf(ev);
    return `<button data-event-detail="${idx}">
      <span class="promo-thumb ${ev.image ? "image" : ev.theme}">${ev.image ? `<img src="${ev.image}" alt="">` : ""}</span>
      <span><small>${ev.tag}</small><b>${ev.title}</b><em>${ev.date}</em></span>
    </button>`;
  }).join("");
}

function renderShopsFull() {
  const items = state.events.filter(ev => ev.section === "shops");
  $("#shopListFull").innerHTML = items.map(ev => {
    const idx = state.events.indexOf(ev);
    return `<button data-event-detail="${idx}">
      <span class="promo-thumb ${ev.image ? "image" : ev.theme}">${ev.image ? `<img src="${ev.image}" alt="">` : ""}</span>
      <span><small>${ev.tag}</small><b>${ev.title}</b><em>${ev.date}</em></span>
    </button>`;
  }).join("");
}

function renderEventList() {
  const items = state.events.filter(ev => ev.section === "events");
  $("#eventList").innerHTML = items.map(ev => {
    const idx = state.events.indexOf(ev);
    return `<button class="event-list-item" data-event-detail="${idx}">
      <span class="event-thumb ${ev.image ? "" : ev.theme}">${ev.image ? `<img src="${ev.image}" alt="">` : ""}</span>
      <span><small>${ev.tag}</small><b>${ev.title}</b><em>${ev.date}</em></span>
    </button>`;
  }).join("");
}

function renderHomeEvents() {
  const items = state.events
    .map((ev, idx) => ({ ...ev, idx }))
    .filter(ev => ev.section === "events")
    .sort(() => Math.random() - 0.5)
    .slice(0, 7);

  $("#homeEvents").innerHTML = items.map(ev => `
    <button class="event-card banner-card" data-event-detail="${ev.idx}">
      ${ev.image ? `<img src="${ev.image}" alt="${ev.title}">` : `<small>${ev.tag}</small><h2>${ev.title}</h2><p>${ev.date}</p>`}
    </button>
  `).join("");
}

function openEventDetail(index) {
  const ev = state.events[Number(index)] || state.events[0];
  $("#eventDetailTitle").textContent = ev.tag;
  $("#eventDetailHero").className = `event-detail-hero ${ev.theme}`;
  $("#eventDetailHero").style.setProperty("--event-bg", ev.image ? `url("${ev.image}")` : "none");
  $("#eventDetailHero").innerHTML = ev.image
    ? `<img src="${ev.image}" alt="${ev.title}">`
    : `<small>${ev.tag}</small><h2>${ev.title.replace(" ", "<br>")}</h2>`;
  $("#eventDetailTag").textContent = ev.tag;
  $("#eventDetailName").textContent = ev.title;
  $("#eventDetailDate").textContent = ev.date;
  $("#eventDetailText").textContent = ev.text;
  showScreen("eventDetail");
}

function openQrModal(title, value, color = "#B71C1C", code = "SM-KP-2024-7823XF") {
  $("#modalTitle").textContent = title;
  $("#modalValue").textContent = value;
  $("#modalCode").textContent = code;
  $("#modalQr").hidden = false;
  $("#modalQr").innerHTML = fakeQr(color);
  $("#modalCouponImage").className = "coupon-modal-image";
  $("#modalCouponImage").hidden = true;
  $("#modalBarcode").hidden = true;
  $("#modalUseNow").hidden = true;
  $("#couponDetailText").hidden = true;
  $("#qrModal").hidden = false;
  startModalTimer();
}

function openCouponDetail(tab, index) {
  const coupon = state.coupons[tab]?.[Number(index)];
  if (!coupon) return;
  $("#modalTitle").textContent = coupon.name;
  $("#modalSub").textContent = coupon.cond;
  $("#modalValue").textContent = `${coupon.value} • ${coupon.exp}`;
  $("#modalCode").textContent = `COUP-${tab.toUpperCase()}-${String(Number(index) + 1).padStart(3, "0")}`;
  $("#modalCouponImage").hidden = false;
  const couponImage = getCouponImage(tab, index);
  $("#modalCouponImage").className = `coupon-modal-image ${couponImageClass(couponImage)}`;
  $("#modalCouponImage").innerHTML = `<img src="${couponImage}" alt="${coupon.name}">`;
  $("#modalQr").hidden = true;
  $("#modalBarcode").hidden = false;
  $("#modalUseNow").hidden = coupon.disabled || coupon.collected;
  $("#couponDetailText").hidden = false;
  $("#couponDetailText").textContent = coupon.detail || `รายละเอียดคูปอง: ${coupon.cond} ใช้ได้ถึง ${coupon.exp} กรุณาแสดง QR Code หรือ Barcode นี้ต่อพนักงานก่อนใช้สิทธิ์`;
  $("#qrModal").hidden = false;
  startModalTimer();
}

function openHomeCouponUse(index) {
  const coupon = homeCouponData[Number(index)];
  if (!coupon) return;
  $("#modalTitle").textContent = coupon.val;
  $("#modalSub").textContent = coupon.cond;
  $("#modalValue").textContent = `${coupon.sub} • ${coupon.exp}`;
  $("#modalCode").textContent = `HOME-COUP-${String(Number(index) + 1).padStart(3, "0")}`;
  $("#modalCouponImage").hidden = false;
  const couponImage = coupon.image || couponImages[Number(index)];
  $("#modalCouponImage").className = `coupon-modal-image ${couponImageClass(couponImage)}`;
  $("#modalCouponImage").innerHTML = `<img src="${couponImage}" alt="${coupon.val}">`;
  $("#modalQr").hidden = true;
  $("#modalBarcode").hidden = false;
  $("#modalUseNow").hidden = false;
  $("#couponDetailText").hidden = false;
  $("#couponDetailText").textContent = coupon.detail;
  $("#qrModal").hidden = false;
  startModalTimer();
}

function openHomeCouponDetail(index) {
  const i = Number(index);
  const c = homeCouponData[i];
  if (!c) return;
  const homeImage = c.image || couponImages[i];
  $("#hcmTop").classList.toggle("is-landscape", isLandscapeCouponImage(homeImage));
  $("#hcmTop").style.background = `linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.22)), url("${homeImage}") center / contain no-repeat, #fff`;
  $("#hcmTag").textContent = c.tag;
  $("#hcmVal").textContent = c.val;
  $("#hcmSub").textContent = c.sub;
  $("#hcmCond").textContent = c.cond;
  $("#hcmExp").textContent = c.exp;
  $("#hcmDetail").textContent = c.detail;
  const btn = $("#hcmActionBtn");
  btn.textContent = c.collected ? "ใช้คูปอง" : "กดเก็บคูปอง";
  btn.onclick = () => {
    if (!c.collected) {
      c.collected = true;
      renderHomeCoupons();
      btn.textContent = "ใช้คูปอง";
      toast("เก็บคูปองแล้ว");
    } else {
      $("#homeCouponModal").hidden = true;
      openHomeCouponUse(i);
    }
  };
  $("#homeCouponModal").hidden = false;
}

function showHomePromoPopup() {
  if (state.homePromoShown) return;
  state.homePromoShown = true;
  setTimeout(() => {
    if (state.currentScreen === "home") $("#homePromoPopup").hidden = false;
  }, 650);
}

function closeQrModal() {
  $("#qrModal").hidden = true;
  clearInterval(state.modalTimer);
}

function startModalTimer() {
  clearInterval(state.modalTimer);
  state.modalSec = 299;
  tickModal();
  state.modalTimer = setInterval(() => {
    state.modalSec -= 1;
    if (state.modalSec < 0) return closeQrModal();
    tickModal();
  }, 1000);
}

function tickModal() {
  const m = String(Math.floor(state.modalSec / 60)).padStart(2, "0");
  const s = String(state.modalSec % 60).padStart(2, "0");
  $("#modalTimer").textContent = `หมดอายุใน ${m}:${s}`;
}

function startOtpTimer() {
  clearInterval(state.otpTimer);
  state.otpSec = 120;
  $("#resendOtp").disabled = true;
  tickOtp();
  state.otpTimer = setInterval(() => {
    state.otpSec -= 1;
    if (state.otpSec <= 0) {
      clearInterval(state.otpTimer);
      $("#otpCountdown").textContent = "หมดอายุแล้ว";
      $("#resendOtp").disabled = false;
      return;
    }
    tickOtp();
  }, 1000);
}

function tickOtp() {
  $("#otpCountdown").textContent = `${String(Math.floor(state.otpSec / 60)).padStart(2, "0")}:${String(state.otpSec % 60).padStart(2, "0")}`;
}

function resetOtp() {
  clearInterval(state.otpTimer);
  $("#phoneEntry").hidden = false;
  $("#otpEntry").hidden = true;
  $$("[data-otp]").forEach(i => (i.value = ""));
}

function showScanStep(step) {
  $$("[data-scan-step]").forEach(s => s.classList.toggle("active", s.dataset.scanStep === step));
  const scanner = $('[data-screen="scanner"]');
  if (scanner) scanner.classList.toggle("light-mode", step !== "scan");
}

function applyFlowCopy() {
  const transfer = state.flow === "transfer";
  $("#scanTitle").textContent = transfer ? "สแกน QR Code สมาชิกปลายทาง" : "แสกน QR Code ของลูกค้า";
  $("#scanSub").textContent = transfer ? "เพื่อเลือก Point และโอนให้สมาชิกปลายทาง" : "เพื่อตรวจสอบและตัดใช้แต้ม";
  $("#scanNow").textContent = transfer ? "Scanner" : "สแกน QR Code";
  $("#foundAvatar").textContent = transfer ? "ป" : "ธ";
  $("#foundLabel").textContent = transfer ? "สมาชิกปลายทาง" : "สมาชิกที่พบ";
  $("#foundName").textContent = transfer ? "คุณปริม วัฒนากุล" : "คุณKP ธวัลรัตน์ ทองคำ";
  $("#foundCode").textContent = transfer ? "SM-PR-2025-01982" : "SM-KP-2024-00847";
  $("#scanSuccessText").textContent = transfer ? "Scanner สำเร็จ เลือกรายการ My Point ที่ต้องการโอน" : "สแกน QR สำเร็จ เลือกรายการ My Point ที่ต้องการตัดใช้";
  $("#pointListTitle").textContent = transfer ? "Point List" : "My Point";
  $("#pointListSub").textContent = transfer ? "เลือก point ที่จะโอน ระบุยอด และหมายเหตุได้" : "เลื่อนเลือกรายการ แล้วระบุยอดด้านล่าง";
  $("#redeemNote").placeholder = transfer ? "หมายเหตุการโอน (ไม่บังคับ)" : "หมายเหตุ (ไม่บังคับ)";
  $("#reviewRedeem").textContent = transfer ? "ตรวจสอบรายการโอน" : "ตรวจสอบตัดจ่าย";
  $("#scanAgain").textContent = "ยกเลิก";
  $("#reviewTitle").textContent = transfer ? "สรุปรายการโอน" : "สรุปรายการตัดจ่าย";
  $("#reviewWarning").textContent = transfer ? "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน การโอน Point ไม่สามารถยกเลิกได้หลังยืนยันแล้ว" : "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน การตัดจ่ายแต้มไม่สามารถยกเลิกได้หลังยืนยันแล้ว";
  $("#confirmRedeem").textContent = transfer ? "ยืนยันโอน" : "ยืนยันตัดใช้";
  $("#doneTitle").textContent = transfer ? "โอน Point สำเร็จ!" : "ตัดใช้สำเร็จ!";
  $("#finishRedeem").textContent = "เสร็จสิ้น";
}

function renderRedeemCards() {
  $("#redeemCards").innerHTML = state.points.map((p, i) => `
    <button class="pick-card ${i === state.selectedPoint ? "active" : ""}" data-select-point="${i}">
      <div class="pick-head">
        <span class="pick-logo" style="background:${p.color}">${p.logo}</span>
        <span><h3>${p.name}</h3><p>${p.sub}</p></span>
      </div>
      <p>ยอดคงเหลือ</p>
      <strong>${money(p.balance)}</strong>
      <p>แต้ม</p>
      <em>${i === state.selectedPoint ? "เลือกแล้ว" : "แตะเพื่อเลือก"}</em>
    </button>
  `).join("");
  const p = state.points[state.selectedPoint];
  $("#redeemName").textContent = p.name;
  $("#redeemBalance").textContent = money(p.balance);
  renderTransferDestination();
}

function renderTransferDestination() {
  let box = $("#transferDestinationBox");
  if (state.flow !== "transfer") {
    if (box) box.remove();
    return;
  }
  if (!box) {
    box = document.createElement("div");
    box.id = "transferDestinationBox";
    box.className = "transfer-destination-box";
    $(".redeem-form").before(box);
  }
  box.innerHTML = `
    <div>
      <span>สมาชิกปลายทาง</span>
      <strong>คุณปริม วัฒนากุล</strong>
      <code>SM-PR-2025-01982</code>
    </div>
  `;
}

function reviewRedeem() {
  const transfer = state.flow === "transfer";
  const point = state.points[state.selectedPoint];
  const amount = Number($("#redeemAmount").value.replace(/,/g, ""));
  const note = $("#redeemNote").value.trim();
  if (!amount || amount <= 0) return toast(transfer ? "กรุณาระบุจำนวน Point ที่ต้องการโอน" : "กรุณาระบุจำนวนแต้มที่ต้องการตัด");
  if (amount > point.balance) return toast("จำนวนแต้มเกินยอดคงเหลือ");
  const remain = point.balance - amount;
  state.review = { point, index: state.selectedPoint, amount, note, remain, flow: state.flow };
  $("#reviewDetails").innerHTML = transfer ? `
    <div><dt>สมาชิกปลายทาง</dt><dd>คุณปริม วัฒนากุล<br><small>SM-PR-2025-01982</small></dd></div>
    <div><dt>รายการ</dt><dd>${point.name}</dd></div>
    <div><dt>ยอดคงเหลือปัจจุบัน</dt><dd>${money(point.balance)} แต้ม</dd></div>
    <div><dt>หมายเหตุ</dt><dd>${note || "—"}</dd></div>
    <div><dt>ยอดโอน</dt><dd>${amount.toLocaleString("th-TH")} แต้ม</dd></div>
    <div><dt>คงเหลือหลังโอน</dt><dd>${money(remain)} แต้ม</dd></div>
  ` : `
    <div><dt>สมาชิก</dt><dd>คุณKP ธวัลรัตน์ ทองคำ<br><small>SM-KP-2024-00847</small></dd></div>
    <div><dt>รายการ</dt><dd>${point.name}</dd></div>
    <div><dt>ยอดคงเหลือปัจจุบัน</dt><dd>${money(point.balance)} แต้ม</dd></div>
    <div><dt>หมายเหตุ</dt><dd>${note || "—"}</dd></div>
    <div><dt>ตัดใช้</dt><dd>${amount.toLocaleString("th-TH")} แต้ม</dd></div>
    <div><dt>คงเหลือหลังตัด</dt><dd>${money(remain)} แต้ม</dd></div>
  `;
  showScanStep("review");
}

function confirmRedeem() {
  const r = state.review;
  if (!r) return;
  const transfer = r.flow === "transfer";
  const balanceBefore = r.point.balance;
  state.points[r.index].balance = r.remain;
  renderPoints();
  renderRedeemCards();
  const txn = `TXN-${Date.now().toString().slice(-8)}`;
  const slipItem = createSlipItem({
    flow: transfer ? "transfer" : "redeem",
    type: transfer ? "โอน Point" : "แลกสิทธิ์",
    point: r.point.name,
    ref: transfer ? "SM-PR-2025-01982" : txn,
    time: "01/05/2026 - 15:41",
    amt: `- ${money(r.amount)} แต้ม`,
    balBefore: `${money(balanceBefore)} แต้ม`,
    bal: `${money(r.remain)} แต้ม`,
    note: r.note || "—",
    txn,
    receiver: transfer ? "คุณปริม วัฒนากุล" : "",
    receiverCode: transfer ? "SM-PR-2025-01982" : ""
  });
  state.lastSlipItem = slipItem;
  $("#doneMessage").textContent = transfer ? `โอน ${r.amount.toLocaleString("th-TH")} แต้ม จาก "${r.point.name}" สำเร็จ` : `ตัดใช้ ${r.amount.toLocaleString("th-TH")} แต้ม จาก "${r.point.name}" สำเร็จ`;
  if (transfer) renderTransferHistory(r, slipItem);
  $("#receipt").innerHTML = renderSlipHtml(slipItem, true);
  $("#redeemAmount").value = "";
  $("#redeemNote").value = "";
  showScanStep("done");
  startDoneSession();
}

let doneSessionTimer = null;

function startDoneSession() {
  clearDoneSession();
  doneSessionTimer = setTimeout(() => {
    toast("⚠️ Session หมดอายุ เกินระยะเวลาที่ทำการ");
    setTimeout(() => {
      clearDoneSession();
      showScreen("home");
    }, 2000);
  }, 120000);
}

function clearDoneSession() {
  clearTimeout(doneSessionTimer);
  doneSessionTimer = null;
}

function createSlipItem(item = {}) {
  return {
    flow: item.flow || "history",
    type: item.type || "รายการ",
    member: item.member || "คุณKP ธวัลรัตน์ ทองคำ",
    memberCode: item.memberCode || "SM-KP-2024-00847",
    receiver: item.receiver || "",
    receiverCode: item.receiverCode || "",
    point: item.point || $("#historyPointName")?.textContent || "Point App",
    ref: item.ref || "—",
    time: item.time || "01/05/2026 - 15:41",
    amt: item.amt || "—",
    balBefore: item.balBefore || "—",
    bal: item.bal || "—",
    note: item.note || "—",
    txn: item.txn || item.ref || "—"
  };
}

function renderSlipHtml(item, collapsible = true) {
  const slip = createSlipItem(item);
  const title = slip.flow === "transfer" ? "สลิปการโอน Point" : "สลิปรายการ Point";
  const rows = [
    ["ประเภท", slip.type, ""],
    ["รายการ Point", slip.point, ""],
    ["สมาชิก", `${slip.member}<br><code>${slip.memberCode}</code>`, ""],
    slip.receiver ? ["สมาชิกปลายทาง", `${slip.receiver}<br><code>${slip.receiverCode}</code>`, "receipt-extra"] : null,
    ["ยอดรายการ", slip.amt, "amount"],
    ["หมายเหตุ", slip.note, "receipt-extra"],
    ["วันที่/เวลา", slip.time, "receipt-extra"],
    ["เลขอ้างอิง", `<code>${slip.ref}</code>`, "receipt-extra"],
    ["เลข TXN", `<code>${slip.txn}</code>`, "receipt-extra"]
  ].filter(Boolean);

  return `
    <div class="receipt-head">
      <strong>${title}</strong>
      ${collapsible ? `<button type="button" class="receipt-toggle" data-receipt-toggle>หุบ/ย่อ</button>` : ""}
    </div>
    ${rows.map(([label, value, extraClass]) => `
      <div class="receipt-row ${extraClass}">
        <span>${label}</span>
        <b>${value}</b>
      </div>
    `).join("")}
  `;
}

function slipText(item) {
  const slip = createSlipItem(item);
  return [
    slip.flow === "transfer" ? "สลิปการโอน Point — Sunee Member" : "สลิปรายการ Point — Sunee Member",
    `ประเภท: ${slip.type}`,
    `รายการ Point: ${slip.point}`,
    `สมาชิก: ${slip.member} (${slip.memberCode})`,
    slip.receiver ? `สมาชิกปลายทาง: ${slip.receiver} (${slip.receiverCode})` : "",
    `ยอดรายการ: ${slip.amt}`,
    `หมายเหตุ: ${slip.note}`,
    `วันที่/เวลา: ${slip.time}`,
    `เลขอ้างอิง: ${slip.ref}`,
    `เลข TXN: ${slip.txn}`
  ].filter(Boolean).join("\n");
}

function saveSlip(item) {
  const slip = createSlipItem(item);
  const rows = [
    ["ประเภท", slip.type],
    ["รายการ Point", slip.point],
    ["สมาชิก", `${slip.member} (${slip.memberCode})`],
    ...(slip.receiver ? [["สมาชิกปลายทาง", `${slip.receiver} (${slip.receiverCode})`]] : []),
    ["ยอดรายการ", slip.amt],
    ["หมายเหตุ", slip.note],
    ["วันที่/เวลา", slip.time],
    ["เลขอ้างอิง", slip.ref],
    ["เลข TXN", slip.txn]
  ];
  const width = 1080;
  const rowHeight = 74;
  const height = 260 + rows.length * rowHeight + 80;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  let saved = false;

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast("บันทึกสลิปเป็นไฟล์รูปภาพแล้ว");
  };

  const drawCanvasWallpaper = () => {
    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#fff8f4");
    base.addColorStop(.45, "#ffffff");
    base.addColorStop(1, "#f8efe6");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = .12;
    const redGlow = ctx.createRadialGradient(120, 80, 20, 120, 80, 420);
    redGlow.addColorStop(0, "#B71C1C");
    redGlow.addColorStop(1, "rgba(183,28,28,0)");
    ctx.fillStyle = redGlow;
    ctx.fillRect(0, 0, width, height);

    const goldGlow = ctx.createRadialGradient(width - 80, height - 40, 10, width - 80, height - 40, 520);
    goldGlow.addColorStop(0, "#C9A84C");
    goldGlow.addColorStop(1, "rgba(201,168,76,0)");
    ctx.fillStyle = goldGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#B71C1C";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(width - 120, 160, 170, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(100, height - 120, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "900 260px Georgia, serif";
    ctx.fillStyle = "#B71C1C";
    ctx.textAlign = "center";
    ctx.fillText("S", width / 2, height / 2 + 90);
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,.70)";
    ctx.fillRect(0, 0, width, height);
  };

  const drawCoverImage = img => {
    const scale = Math.max(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;
    ctx.save();
    ctx.globalAlpha = .16;
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.fillRect(0, 0, width, height);
  };

  const drawSlip = wallpaper => {
    if (saved) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    if (wallpaper) drawCoverImage(wallpaper);
    else drawCanvasWallpaper();
    ctx.fillStyle = "#B71C1C";
    ctx.fillRect(0, 0, width, 20);
    ctx.fillStyle = "#111111";
    ctx.textAlign = "center";
    ctx.font = "700 46px 'Noto Sans Thai', sans-serif";
    ctx.fillText(slip.flow === "transfer" ? "สลิปการโอน Point" : "สลิปรายการ Point", width / 2, 100);
    ctx.font = "500 26px 'Noto Sans Thai', sans-serif";
    ctx.fillStyle = "#777777";
    ctx.fillText("SUNEE MEMBER", width / 2, 142);
    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 188);
    ctx.lineTo(width - 70, 188);
    ctx.stroke();

    let y = 240;
    rows.forEach(([label, value]) => {
      ctx.fillStyle = "#777777";
      ctx.textAlign = "left";
      ctx.font = "400 28px 'Noto Sans Thai', sans-serif";
      ctx.fillText(label, 80, y);
      ctx.fillStyle = label === "ยอดรายการ" ? "#B71C1C" : "#111111";
      ctx.textAlign = "right";
      ctx.font = label === "ยอดรายการ" ? "700 32px 'Noto Sans Thai', sans-serif" : "700 28px 'Noto Sans Thai', sans-serif";
      ctx.fillText(String(value), width - 80, y);
      ctx.strokeStyle = "#f0f0f0";
      ctx.beginPath();
      ctx.moveTo(80, y + 28);
      ctx.lineTo(width - 80, y + 28);
      ctx.stroke();
      y += rowHeight;
    });

    const exportDataUrl = allowRetry => {
      try {
        const url = canvas.toDataURL("image/png");
        if (!url || url === "data:,") throw new Error("empty png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `sunee-slip-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        saved = true;
        toast("บันทึกสลิปเป็นไฟล์ PNG แล้ว");
      } catch (error) {
        if (allowRetry) {
          ctx.clearRect(0, 0, width, height);
          drawSlip(null);
        } else {
          toast("บันทึก PNG ไม่สำเร็จ");
        }
      }
    };

    const exportPng = allowRetry => {
      try {
        if (!canvas.toBlob) {
          exportDataUrl(allowRetry);
          return;
        }
        canvas.toBlob(blob => {
          if (saved) return;
          if (!blob) {
            exportDataUrl(allowRetry);
            return;
          }
          saved = true;
          downloadBlob(blob, `sunee-slip-${Date.now()}.png`);
        }, "image/png");
      } catch (error) {
        if (allowRetry) {
          ctx.clearRect(0, 0, width, height);
          drawSlip(null);
        } else {
          exportDataUrl(false);
        }
      }
    };
    exportPng(Boolean(wallpaper));
  };

  // Avoid drawing local file:// images into canvas; browsers can taint the
  // canvas and block PNG export. The on-screen receipt still uses the PNG CSS
  // wallpaper, while the saved image uses a canvas-drawn branded wallpaper.
  drawSlip(null);
}

function slipFromHistoryArticle(article) {
  const title = article.querySelector("b")?.textContent?.trim() || "รายการ";
  const ref = article.querySelector("span")?.textContent?.trim() || "—";
  const time = article.querySelector("time")?.textContent?.trim() || "—";
  const strong = article.querySelector("strong");
  const amount = [...(strong?.childNodes || [])]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join(" ") || "—";
  const bal = strong?.querySelector("small")?.textContent?.trim() || "—";
  return createSlipItem({
    flow: article.dataset.flow || "history",
    type: article.dataset.type || title,
    point: article.dataset.point || $("#historyPointName")?.textContent || "Point App",
    ref: article.dataset.ref || ref,
    time: article.dataset.time || time,
    amt: article.dataset.amt || amount,
    balBefore: article.dataset.balBefore || "—",
    bal: article.dataset.bal || bal,
    note: article.dataset.note || "—",
    txn: article.dataset.txn || ref,
    receiver: article.dataset.receiver || "",
    receiverCode: article.dataset.receiverCode || ""
  });
}

function openHistorySlipModal(item) {
  const modal = $("#historySlipModal");
  if (!modal) return;
  const slip = createSlipItem(item);
  $("#hsmTitle").textContent = slip.flow === "transfer" ? "สลิปการโอน Point" : "สลิปรายการ Point";
  $("#hsmReceipt").innerHTML = renderSlipHtml(slip, true);
  $("#hsmShareBtn").onclick = () => saveSlip(slip);
  modal.hidden = false;
}

function shareSlip() {
  if (!state.lastSlipItem) return;
  saveSlip(state.lastSlipItem);
}

function historyArticleHtml(item, pointName) {
  const slip = createSlipItem({ ...item, point: item.point || pointName });
  return `<article
      class="history-item"
      data-flow="${slip.flow}"
      data-type="${slip.type}"
      data-point="${slip.point}"
      data-ref="${slip.ref}"
      data-time="${slip.time}"
      data-amt="${slip.amt}"
      data-bal="${slip.bal}"
      data-bal-before="${slip.balBefore}"
      data-note="${slip.note}"
      data-txn="${slip.txn}"
      data-receiver="${slip.receiver}"
      data-receiver-code="${slip.receiverCode}">
      <div class="history-row-main">
        <div><b>${slip.type}</b><span>${slip.ref}</span><time>${slip.time}</time></div>
        <strong>${slip.amt}<small>${slip.bal}</small><button class="history-expand-toggle" type="button" aria-label="ขยายรายการ"></button></strong>
      </div>
      <div class="history-row-extra">
        <button type="button" data-history-slip-open>ดูสลิป</button>
      </div>
    </article>`;
}

function renderTransferHistory(r, slipItem = null) {
  $("#historyTitle").textContent = r.point.name;
  $("#historyPointName").textContent = r.point.name;
  $("#historyCurrentBalance").textContent = money(r.remain);
  const txn = `TXN-${Date.now().toString().slice(-8)}`;
  const currentSlip = slipItem || createSlipItem({
    flow: "transfer",
    type: "โอน Point",
    point: r.point.name,
    ref: "SM-PR-2025-01982",
    time: "01/05/2026 - 15:41",
    amt: `- ${money(r.amount)} แต้ม`,
    bal: `${money(r.remain)} แต้ม`,
    note: r.note || "—",
    txn,
    receiver: "คุณปริม วัฒนากุล",
    receiverCode: "SM-PR-2025-01982"
  });
  const slipItems = [
    currentSlip,
    { type:"ซื้อสินค้า", ref:"5576905-00039", time:"01/05/2026 - 13:49", amt:"-400.00", bal:"3,316.00" },
    { type:"ซื้อสินค้า", ref:"7680932-10547230048625336", time:"01/05/2026 - 09:24", amt:"-47.00", bal:"3,716.00" },
    { type:"ซื้อสินค้า", ref:"4566905-0034", time:"01/05/2026 - 09:21", amt:"-153.00", bal:"3,763.00" }
  ];
  $("#historyList").innerHTML = slipItems.map(item => historyArticleHtml(item, r.point.name)).join("");
}

function renderPointHistory(index) {
  const point = state.points[index];
  $("#historyTitle").textContent = point.name;
  $("#historyPointName").textContent = point.name;
  $("#historyCurrentBalance").textContent = money(point.balance);
  const items = [
    { type:"ซื้อสินค้า", ref:"5576905-00039", time:"01/05/2026 - 13:49", amt:"-400.00", bal:money(point.balance) },
    { type:"ซื้อสินค้า", ref:"7680932-10547230048625336", time:"01/05/2026 - 09:24", amt:"-47.00", bal:money(point.balance + 400) },
    { type:"ซื้อสินค้า", ref:"4566905-0034", time:"01/05/2026 - 09:21", amt:"-153.00", bal:money(point.balance + 447) }
  ];
  $("#historyList").innerHTML = items.map(item => historyArticleHtml(item, point.name)).join("");
}

function bindEvents() {
  document.addEventListener("click", e => {
    const slideBtn = e.target.closest("[data-slide-target]");
    if (slideBtn) {
      const strip = document.getElementById(slideBtn.dataset.slideTarget);
      if (strip) {
        const firstItem = strip.firstElementChild;
        const styles = getComputedStyle(strip);
        const gap = parseFloat(styles.columnGap || styles.gap) || 12;
        const step = firstItem ? firstItem.getBoundingClientRect().width + gap : strip.clientWidth * 0.85;
        strip.scrollBy({
          left: step * Number(slideBtn.dataset.slideDir || 1),
          behavior: "smooth"
        });
        if (strip.id === "homeCoupons") state.homeCouponAutoPausedUntil = Date.now() + 6000;
      }
    }

    const target = e.target.closest("[data-screen-target]");
    if (target) {
      if (target.dataset.screenTarget === "scanner") state.flow = "scan";
      showScreen(target.dataset.screenTarget);
    }

    const receiptToggle = e.target.closest("[data-receipt-toggle]");
    if (receiptToggle) {
      const receipt = receiptToggle.closest(".receipt");
      const collapsed = receipt.classList.toggle("is-collapsed");
      receiptToggle.textContent = collapsed ? "ขยาย" : "หุบ/ย่อ";
    }

    if (e.target.closest("[data-screen-back]")) {
      goBack();
    }

    if (e.target.closest("[data-profile-save]")) {
      toast("บันทึกข้อมูลเรียบร้อยแล้ว");
      goBack();
    }

    if (e.target.id === "historyMonthSelect") {
      e.stopPropagation();
    }

    if (e.target.closest("[data-register-submit]")) {
      toast("สมัครสมาชิกเรียบร้อยแล้ว");
      showScreen("login", { replace: true });
    }

    if (e.target.closest("[data-open-pin-change]")) {
      openPinChangeModal();
    }

    const pinChange = e.target.closest("[data-pin-change]");
    if (pinChange) {
      pressPinChange(pinChange.dataset.pinChange);
    }

    if (e.target.id === "pinChangeBack") {
      state.pinChange.step = state.pinChange.step === "confirm" ? "next" : "current";
      state.pinChange.entry = "";
      renderPinChange();
    }

    if (e.target.closest("[data-transfer-flow]")) {
      state.flow = "transfer";
      showScreen("scanner");
    }

    if (e.target.closest("[data-history-use]")) {
      state.flow = "scan";
      showScreen("scanner");
    }

    if (e.target.closest("[data-history-transfer]")) {
      state.flow = "transfer";
      showScreen("scanner");
    }

    if (e.target.closest("[data-coupon-collect-link]")) {
      state.couponTab = "collect";
      renderCoupons();
      showScreen("coupons");
    }

    if (e.target.closest("[data-shops-link]")) {
      renderShopsFull();
      showScreen("shops");
    }

    if (e.target.closest("[data-promos-link]")) {
      renderPromosFull();
      showScreen("promos");
    }

    if (e.target.closest("[data-events-link]")) {
      renderEventList();
      showScreen("events");
    }

    const eventDetail = e.target.closest("[data-event-detail]");
    if (eventDetail) {
      openEventDetail(eventDetail.dataset.eventDetail);
    }

    const loginTab = e.target.closest("[data-login-tab]");
    if (loginTab) switchLoginTab(loginTab.dataset.loginTab);

    const pin = e.target.closest("[data-pin]");
    if (pin) {
      const value = pin.dataset.pin;
      if (value === "") return;
      if (value === "⌫") state.pin.pop();
      else if (state.pin.length < 6) state.pin.push(value);
      $$("[data-dot]").forEach((dot, i) => dot.classList.toggle("filled", i < state.pin.length));
      if (state.pin.length === 6) setTimeout(() => {
        state.pin = [];
        $$("[data-dot]").forEach(dot => dot.classList.remove("filled"));
        showScreen("home");
      }, 300);
    }

    if (e.target.id === "bioLogin" || e.target.id === "bioButton") {
      $("#bioStatus").textContent = "กำลังตรวจสอบ...";
      setTimeout(() => {
        $("#bioStatus").textContent = "แตะเพื่อสแกนลายนิ้วมือ";
        showScreen("home");
      }, 700);
    }

    if (e.target.id === "sendOtp") {
      const phone = $("#phoneInput").value.replace(/\D/g, "");
      if (phone.length < 9) return toast("กรุณาใส่เบอร์โทรศัพท์ให้ครบถ้วน");
      $("#otpPhone").textContent = `${phone.slice(0,3)}-${phone.slice(3,6)}-${phone.slice(6)}`;
      $("#phoneEntry").hidden = true;
      $("#otpEntry").hidden = false;
      startOtpTimer();
      $("[data-otp]")?.focus();
    }

    if (e.target.id === "phoneLogin") {
      const phone = $("#phoneInput").value.replace(/\D/g, "");
      const password = $("#phonePassword").value.trim();
      if (phone.length < 9) return toast("กรุณาใส่เบอร์โทรศัพท์ให้ครบถ้วน");
      if (!password) return toast("กรุณากรอกรหัสผ่าน");
      showScreen("home");
    }

    if (e.target.id === "forgotPassword") {
      showScreen("forgotPassword");
    }

    if (e.target.id === "sendPasswordSms") {
      toast("ส่ง SMS ยืนยันแล้ว");
      showScreen("login", { replace: true });
      switchLoginTab("phone");
    }

    if (e.target.id === "verifyOtp") {
      const otp = $$("[data-otp]").map(i => i.value).join("");
      if (otp.length < 6) return toast("กรุณาใส่รหัส OTP ให้ครบ 6 หลัก");
      resetOtp();
      showScreen("home");
    }
    if (e.target.id === "resendOtp") startOtpTimer();
    if (e.target.id === "changePhone") resetOtp();

    const openPoint = e.target.closest("[data-open-point]");
    if (openPoint) {
      renderPointHistory(Number(openPoint.dataset.openPoint));
      showScreen("history");
    }

    const slipOpen = e.target.closest("[data-history-slip-open]");
    if (slipOpen) {
      const historyRow = slipOpen.closest("#historyList article");
      openHistorySlipModal(slipFromHistoryArticle(historyRow));
    }

    const historyToggle = e.target.closest(".history-item");
    if (historyToggle && !e.target.closest("[data-history-slip-open]")) {
      historyToggle.classList.toggle("expanded");
    }

    const couponTab = e.target.closest("[data-coupon-tab]");
    if (couponTab) {
      state.couponTab = couponTab.dataset.couponTab;
      renderCoupons();
    }

    const couponAction = e.target.closest("[data-coupon-action]");
    if (couponAction) {
      e.stopPropagation();
      if (couponAction.dataset.couponAction === "collect") {
        couponAction.textContent = "เก็บแล้ว";
        couponAction.disabled = true;
        toast("เก็บคูปองแล้ว");
      } else {
        const detail = couponAction.closest("[data-coupon-detail]")?.dataset.couponDetail.split(":");
        if (detail) openCouponDetail(detail[0], detail[1]);
      }
    }

    const couponDetail = e.target.closest("[data-coupon-detail]");
    if (couponDetail && !e.target.closest("[data-coupon-action]")) {
      const [tab, index] = couponDetail.dataset.couponDetail.split(":");
      openCouponDetail(tab, index);
    }

    if (e.target.id === "modalUseNow") {
      toast("แสดงโค้ดสำหรับใช้คูปองแล้ว");
    }

    if (e.target.closest("[data-collect-all]")) {
      state.coupons.collect.forEach(c => {
        if (c.collect) {
          c.collect = false;
          c.collected = true;
        }
      });
      renderCoupons();
      toast("เก็บคูปองทั้งหมดแล้ว");
    }

    const homeCouponCard = e.target.closest("[data-home-coupon]");
    if (homeCouponCard && !e.target.closest("[data-collect-home]")) {
      openHomeCouponDetail(homeCouponCard.dataset.homeCoupon);
    }

    const collectHomeBtn = e.target.closest("[data-collect-home]");
    if (collectHomeBtn) {
      const i = Number(collectHomeBtn.dataset.collectHome);
      const c = homeCouponData[i];
      if (!c.collected) {
        c.collected = true;
        renderHomeCoupons();
        toast("เก็บคูปองแล้ว");
      } else {
        openHomeCouponUse(i);
      }
    }

    if (e.target.closest("[data-home-collect-all]")) {
      homeCouponData.forEach(c => (c.collected = true));
      state.coupons.collect.forEach(c => {
        if (c.collect) {
          c.collect = false;
          c.collected = true;
        }
      });
      renderHomeCoupons();
      toast("เก็บคูปองทั้งหมดแล้ว");
    }

    if (e.target.id === "closeModal" || e.target.id === "qrModal") closeQrModal();
    if (e.target.id === "saveQr") toast("บันทึก QR แล้ว (จำลอง)");
    if (e.target.id === "shareQr") toast("แชร์ QR แล้ว (จำลอง)");

    if (e.target.id === "scanNow") {
      renderRedeemCards();
      showScanStep("redeem");
    }
    if (e.target.id === "scanAgain" || e.target.id === "reviewCancel") showScreen("home");
    if (e.target.id === "finishRedeem") {
      clearDoneSession();
      showScreen("home", { replace: true });
      showScreen("history");
    }
    if (e.target.closest("#shareSlip")) shareSlip();

    const selectPoint = e.target.closest("[data-select-point]");
    if (selectPoint) {
      state.selectedPoint = Number(selectPoint.dataset.selectPoint);
      renderRedeemCards();
    }

    const amt = e.target.closest("[data-amt]");
    if (amt) {
      const p = state.points[state.selectedPoint];
      $("#redeemAmount").value = amt.dataset.amt === "max" ? p.balance : Math.min(Number(amt.dataset.amt), p.balance);
    }

    if (e.target.id === "reviewRedeem") reviewRedeem();
    if (e.target.id === "confirmRedeem") confirmRedeem();
    const scanBack = e.target.closest("[data-scan-back]");
    if (scanBack) showScanStep(scanBack.dataset.scanBack);
  });

  document.addEventListener("input", e => {
    if (e.target.id === "phoneInput") e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.matches("[data-phone-only]")) e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (e.target.matches("[data-pin-only]")) e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
    if (e.target.matches("[data-otp]")) {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 1);
      if (e.target.value) {
        const next = $(`[data-otp="${Number(e.target.dataset.otp) + 1}"]`);
        if (next) next.focus();
      }
      if ($$("[data-otp]").map(i => i.value).join("").length === 6) setTimeout(() => $("#verifyOtp").click(), 150);
    }
    if (e.target.id === "redeemAmount") e.target.value = e.target.value.replace(/[^\d.]/g, "");
  });

  document.addEventListener("change", e => {
    if (e.target.id === "historyMonthSelect") {
      const label = e.target.options[e.target.selectedIndex]?.textContent || "";
      toast(`แสดงรายการเดือน ${label}`);
    }
  });

  $("#galleryInput").addEventListener("change", e => {
    if (!e.target.files.length) return;
    renderRedeemCards();
    showScanStep("redeem");
    e.target.value = "";
  });
}

function init() {
  renderNavs();
  renderLogin();
  renderHomeCoupons();
  setupHomeCouponAutomation();
  renderPoints();
  renderCoupons();
  renderHomeEvents();
  renderEventList();
  normalizeSuneeLogos();
  renderPromosFull();
  renderShopsFull();
  $("#memberQrCode").innerHTML = fakeQr();
  $("#modalQr").innerHTML = fakeQr();
  renderRedeemCards();
  bindEvents();

  // Member QR popup
  document.getElementById("openMemberQr").addEventListener("click", () => {
    document.getElementById("memberQrModal").hidden = false;
  });
  document.getElementById("closeMemberQr").addEventListener("click", () => {
    document.getElementById("memberQrModal").hidden = true;
  });
  document.getElementById("memberQrModal").addEventListener("click", e => {
    if (e.target === document.getElementById("memberQrModal"))
      document.getElementById("memberQrModal").hidden = true;
  });

  document.getElementById("closeHomeCoupon").addEventListener("click", () => {
    document.getElementById("homeCouponModal").hidden = true;
  });
  document.getElementById("homeCouponModal").addEventListener("click", e => {
    if (e.target === document.getElementById("homeCouponModal"))
      document.getElementById("homeCouponModal").hidden = true;
  });

  // History slip modal
  const hsmClose = () => { document.getElementById("historySlipModal").hidden = true; };
  document.getElementById("closeHistorySlip").addEventListener("click", hsmClose);
  document.getElementById("closeHistorySlipBtn")?.addEventListener("click", hsmClose);
  document.getElementById("historySlipModal").addEventListener("click", e => {
    if (e.target === document.getElementById("historySlipModal")) hsmClose();
  });

  document.getElementById("closePinChange").addEventListener("click", closePinChangeModal);
  document.getElementById("pinChangeModal").addEventListener("click", e => {
    if (e.target === document.getElementById("pinChangeModal")) closePinChangeModal();
  });

  const promoPopup = document.getElementById("homePromoPopup");
  const closePromo = () => (promoPopup.hidden = true);
  document.getElementById("closeHomePromo").addEventListener("click", closePromo);
  promoPopup.addEventListener("click", e => {
    if (e.target === promoPopup) closePromo();
  });
  ["homePromoDetail", "homePromoAction"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
      closePromo();
      openHomeCouponDetail(2);
    });
  });
}

init();
