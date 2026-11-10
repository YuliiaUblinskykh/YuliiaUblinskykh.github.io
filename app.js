"use strict";

const burger = document.querySelector(".burger");
const panel = document.querySelector("#mobile-menu");
function setMenu(open) {
  if (!burger || !panel) return;
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  panel.classList.toggle("is-open", open);
  panel.inert = !open;
  document.body.classList.toggle("menu-open", open);
}
if (burger && panel) {
  burger.addEventListener("click", () =>
    setMenu(burger.getAttribute("aria-expanded") !== "true"),
  );
  panel
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
}

(() => {
  document.querySelectorAll(".for-whom").forEach((section) => {
    const timeline = section.querySelector(".for-whom__timeline");
    const steps = [...section.querySelectorAll("[data-whom-step]")];
    const reveals = section.querySelectorAll("[data-whom-reveal]");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      steps.forEach((step) => step.classList.add("is-visible"));
      reveals.forEach((el) => el.classList.add("is-visible"));
      timeline.style.setProperty("--timeline-progress", 1);
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.15,
        },
      );

      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }

    let ticking = false;

    function updateTimeline() {
      const rect = timeline.getBoundingClientRect();
      const isDesktop = window.matchMedia("(min-width: 701px)").matches;
      const trigger = window.innerHeight * 0.65;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (trigger - rect.top) / (rect.height + window.innerHeight * 0.25),
        ),
      );

      timeline.style.setProperty("--timeline-progress", progress);
      steps.forEach((step, index) => {
        let active;
        if (isDesktop) {
          const dotPosition = (index + 0.06) / steps.length;
          active = progress >= dotPosition;
        } else {
          const stepRect = step.getBoundingClientRect();
          const stepCenter = stepRect.top - rect.top + stepRect.height / 2;
          active = rect.height * progress >= stepCenter;
        }
        step.classList.toggle("is-visible", active);
      });
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateTimeline);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    updateTimeline();
  });
})();

(() => {
  const nodes = [...document.querySelectorAll("[data-site-reveal]")];
  if (!nodes.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
  );
  nodes.forEach((node) => observer.observe(node));
  document.documentElement.classList.add("js-motion");

  requestAnimationFrame(() => {
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < innerHeight * 0.92)
        node.classList.add("is-revealed");
    });
  });
})();

(() => {
  const carousel = document.querySelector("[data-program-carousel]");
  if (!carousel) return;
  const viewport = carousel.querySelector(".day-program__viewport");
  const cards = [...carousel.querySelectorAll(".day-program__card")];
  const prev = carousel.querySelector("[data-program-prev]");
  const next = carousel.querySelector("[data-program-next]");
  const current = carousel.querySelector("[data-program-current]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function index() {
    const x = viewport.scrollLeft;
    let best = 0,
      dist = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - cards[0].offsetLeft - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  }
  function update() {
    const i = index();
    current.textContent = String(i + 1).padStart(2, "0");
    prev.disabled = i === 0;
    next.disabled = i === cards.length - 1;
  }
  function go(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    viewport.scrollTo({
      left: cards[i].offsetLeft - cards[0].offsetLeft,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  prev.addEventListener("click", () => go(index() - 1));
  next.addEventListener("click", () => go(index() + 1));
  let raf = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();
})();

(() => {
  const root = document.querySelector("[data-reviews-carousel]");
  if (!root) return;
  const viewport = root.querySelector(".reviews__viewport");
  const items = [...root.querySelectorAll(".reviews__item")];
  const prev = root.querySelector("[data-reviews-prev]");
  const next = root.querySelector("[data-reviews-next]");
  const current = root.querySelector("[data-reviews-current]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function activeIndex() {
    let best = 0,
      distance = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(
        el.offsetLeft - items[0].offsetLeft - viewport.scrollLeft,
      );
      if (d < distance) {
        distance = d;
        best = i;
      }
    });
    return best;
  }
  function update() {
    const i = activeIndex();
    current.textContent = String(i + 1).padStart(2, "0");
    prev.disabled = viewport.scrollLeft <= 2;
    next.disabled =
      viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
  }
  function go(i) {
    i = Math.max(0, Math.min(items.length - 1, i));
    viewport.scrollTo({
      left: items[i].offsetLeft - items[0].offsetLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }
  prev.addEventListener("click", () => go(activeIndex() - 1));
  next.addEventListener("click", () => go(activeIndex() + 1));
  let frame = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();
})();

// Google Apps Script web app URL (/exec). Telegram credentials stay in Script Properties.
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxxwJhDyocmAoLEO9sBuQzY4khqep1QWrwYGnftRGT9HpvffnakhuXaVM7rVcJRQjf5VA/exec";

// Apps Script receives a simple cross-origin POST, then we verify Telegram delivery
// through a JSONP status lookup. Never claim success without confirmed status.
async function sendApplication(payload) {
  if (
    !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
      APPS_SCRIPT_URL,
    )
  ) {
    throw new Error("Спочатку встав URL Google Apps Script у app.js.");
  }
  const id = crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const data = new URLSearchParams({ ...payload, id, website: "" });
  // Opaque response is NOT a delivery confirmation.
  await fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", body: data });
  const deadline = Date.now() + 25000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const result = await new Promise((resolve, reject) => {
      const callback = `__yuliiaStatus_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timer = setTimeout(
        () => finish(null, new Error("Не вдалося перевірити статус")),
        5000,
      );
      function finish(value, error) {
        clearTimeout(timer);
        script.remove();
        delete window[callback];
        if (error) reject(error);
        else resolve(value);
      }
      window[callback] = (value) => finish(value);
      script.onerror = () =>
        finish(null, new Error("Не вдалося перевірити статус"));
      script.src = `${APPS_SCRIPT_URL}?id=${encodeURIComponent(id)}&callback=${callback}&_=${Date.now()}`;
      document.head.appendChild(script);
    });
    if (result?.status === "sent") return;
    if (result?.status === "error")
      throw new Error("Telegram не прийняв заявку. Перевір налаштування бота.");
  }
  throw new Error(
    "Не вдалося підтвердити доставку. Перевір Telegram перед повторною спробою.",
  );
}

(() => {
  const triggers = [
    ...document.querySelectorAll(
      "a.header-ticket, #mobile-menu a, a.primary-button",
    ),
  ].filter(
    (a) =>
      a.classList.contains("header-ticket") ||
      /квит|хочу бути там|заброню|місце/i.test(a.textContent),
  );
  const modal = document.createElement("div");
  modal.className = "booking-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking-modal__backdrop" data-booking-close></div>
    <section class="booking-modal__panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" tabindex="-1">
      <button class="booking-modal__close" type="button" data-booking-close aria-label="Закрити форму">×</button>
      <p class="booking-modal__eyebrow">30 СІЧНЯ 2027 · КИЇВ</p>
      <h2 id="booking-title">НЕ ЧЕКАЙ.<br>ЗАБИРАЙ КВИТОК ЗАРАЗ.</h2>
      <p class="booking-modal__intro">Забронюй місце на «Заведи своє життя» за спеціальною ціною передпродажу.</p>
      <div class="booking-modal__prices"><div><span>1 квиток</span><strong>1 200 грн</strong></div><div><span>Від 2 квитків · за один</span><strong>1 000 грн</strong></div></div>
      <p class="booking-modal__hint">Після передпродажу — від 2 000 грн.</p>
      <p class="booking-modal__intro">Залиш контакти, щоб зафіксувати ціну. Юлія особисто зв’яжеться з тобою та допоможе оформити квиток.</p>
      <form class="booking-form" novalidate>
        <label>Твоє ім’я та прізвище <input name="name" type="text" autocomplete="name" minlength="2" maxlength="100" required placeholder="Твоє ім’я та прізвище"></label>
        <label>Номер телефону <input name="phone" type="tel" autocomplete="tel" inputmode="tel" minlength="9" maxlength="25" required placeholder="+380 ..."></label>
        <label>Кількість квитків <select name="quantity" required>${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select></label>
        <div class="booking-form__total"><span>До оплати після підтвердження</span><strong data-booking-total>1 200 грн</strong></div>
        <label class="booking-form__consent"><input name="consent" type="checkbox" required><span>Погоджуюся на обробку контактних даних для бронювання квитків.</span></label>
        <p class="booking-form__status" role="status" aria-live="polite"></p>
        <button type="submit" class="booking-form__submit">ЗАБРОНЮВАТИ МІСЦЕ <span class="long-arrow" aria-hidden="true"></span></button>
      </form>
    </section>`;
  document.body.appendChild(modal);
  const form = modal.querySelector("form");
  const status = modal.querySelector(".booking-form__status");
  const submit = form.querySelector('button[type="submit"]');
  const qty = form.elements.quantity;
  const total = modal.querySelector("[data-booking-total]");
  const money = (amount) =>
    new Intl.NumberFormat("uk-UA").format(amount) + " грн";
  const updateTotal = () => {
    const n = Number(qty.value);
    total.textContent = money(n * (n >= 2 ? 1000 : 1200));
  };
  qty.addEventListener("change", updateTotal);
  updateTotal();
  let returnFocus = null;
  function close() {
    modal.hidden = true;
    document.body.classList.remove("booking-open");
    returnFocus?.focus();
  }
  function open(opener) {
    returnFocus = opener;
    setMenu(false);
    modal.hidden = false;
    document.body.classList.add("booking-open");
    status.textContent = "";
    modal.querySelector(".booking-modal__close").focus();
  }
  triggers.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      open(a);
    }),
  );
  modal
    .querySelectorAll("[data-booking-close]")
    .forEach((el) => el.addEventListener("click", close));
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
    if (e.key !== "Tab") return;
    const focusable = [
      ...modal.querySelectorAll("button, input, select"),
    ].filter((el) => !el.disabled);
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    if (name.length < 2 || !/^[+\d\s()\-]{9,25}$/.test(phone)) {
      status.textContent = "Перевір ім’я та номер телефону.";
      return;
    }
    const quantity = Number(qty.value);
    submit.disabled = true;
    status.textContent = "Надсилаємо бронювання…";
    try {
      const amount = quantity * (quantity >= 2 ? 1000 : 1200);
      const message = [
        "🎟 НОВЕ БРОНЮВАННЯ · Заведи своє життя",
        "30 січня 2027 · Київ",
        `Ім’я: ${name}`,
        `Телефон: ${phone}`,
        `Квитків: ${quantity}`,
        `Сума: ${money(amount)}`,
      ].join("\n");
      await sendApplication({
        kind: "ticket",
        name,
        phone,
        quantity: String(quantity),
      });
      form.reset();
      updateTotal();
      close();
      showThankYou("ticket");
    } catch (error) {
      status.textContent = error.message || "Не вдалося надіслати заявку.";
    } finally {
      submit.disabled = false;
    }
  });
})();

// Confirmation windows appear only after Google Apps Script confirms delivery.
const thankYouContent = {
  ticket: `
    <h2>Чудово! ❤️</h2>
    <p>Твоя заявка на тренінг</p>
    <p>«Заведи своє життя» вже у нас!</p>
    <p><strong>Ти обрала спеціальну передпродажну пропозицію.</strong></p>
    <p>Юлія особисто зв’яжеться з тобою за вказаним номером, щоб надати реквізити для оплати та узгодити оформлення квитків.</p>
    <p>А поки збережи дату:</p>
    <p><strong>30 січня 2027 року | Київ</strong></p>
    <p>Попереду особливий день, нові знайомства, емоції та зустріч із жінками, які теж хочуть більшого від життя.</p>
    <p>До зустрічі! ❤️</p>
    <p><strong>«Заведи своє життя» - почни з того, щоб обрати себе.</strong></p>
		<p><strong>Можеш поки що підписатись на Юлію&nbsp;</strong></p>
    <p><a class="thank-you-modal__instagram" href="https://www.instagram.com/yuliaublinskykh?mdxt=M2hpbXBsdmNlNGtl" target="_blank" rel="noopener noreferrer" aria-label="Підписатися на Юлію в Instagram">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      <span>Підписатися в Instagram</span>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
    </a></p>`,
  excursion: `
    <h2>Ти вже на крок ближче до знайомства! ❤️</h2>
    <p>Дякую за твою цікавість до авторської гри «Важливий крок»!</p>
    <p>Твоя заявка на безоплатну&nbsp; екскурсію по грі отримана.</p>
    <p>Найближчим часом ми зв’яжемося з тобою, щоб узгодити деталі зустрічі та розповісти, як усе відбуватиметься.</p>
    <p>На тебе чекає знайомство з Юлією Ублінських, можливість побачити психологічну гру зсередини, спробувати її на собі та відчути атмосферу майбутньої події «Заведи своє життя».</p>
    <p><strong>Можеш поки що підписатись на Юлію&nbsp;</strong></p>
    <p><a class="thank-you-modal__instagram" href="https://www.instagram.com/yuliaublinskykh?mdxt=M2hpbXBsdmNlNGtl" target="_blank" rel="noopener noreferrer" aria-label="Підписатися на Юлію в Instagram">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      <span>Підписатися в Instagram</span>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
    </a></p>`,
};
function showThankYou(kind) {
  const dialog = document.createElement("div");
  dialog.className = "booking-modal thank-you-modal";
  dialog.innerHTML = `
    <div class="booking-modal__backdrop" data-thankyou-close></div>
    <section class="booking-modal__panel thank-you-modal__panel" role="dialog" aria-modal="true" aria-label="Підтвердження заявки" tabindex="-1">
      <button class="booking-modal__close" type="button" data-thankyou-close aria-label="Закрити">×</button>
      <div class="thank-you-modal__content">${thankYouContent[kind]}</div>
    </section>`;
  document.body.appendChild(dialog);
  document.body.classList.add("booking-open");
  const dismiss = () => {
    dialog.remove();
    document.body.classList.remove("booking-open");
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (event) => {
    if (event.key === "Escape") dismiss();
  };
  dialog
    .querySelectorAll("[data-thankyou-close]")
    .forEach((el) => el.addEventListener("click", dismiss));
  document.addEventListener("keydown", onKey);
  dialog.querySelector(".booking-modal__close").focus();
}

// Free game excursion: a separate form, using the same Telegram credentials.
(() => {
  const triggers = [...document.querySelectorAll(".game-invitation__button")];
  if (!triggers.length) return;
  const modal = document.createElement("div");
  modal.className = "booking-modal excursion-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking-modal__backdrop" data-excursion-close></div>
    <section class="booking-modal__panel" role="dialog" aria-modal="true" aria-labelledby="excursion-title" tabindex="-1">
      <button class="booking-modal__close" type="button" data-excursion-close aria-label="Закрити форму">×</button>
      <p class="booking-modal__eyebrow">АВТОРСЬКА ГРА «ВАЖЛИВИЙ КРОК»</p>
      <h2 id="excursion-title">ПОЗНАЙОМИМОСЯ <em>БЛИЖЧЕ?</em></h2>
      <p class="booking-modal__intro">Запрошую тебе на безоплатну екскурсію у світ гри «Важливий крок». Залиш свої контакти — ми зв’яжемося з тобою та розповімо про деталі зустрічі.</p>
      <form class="booking-form excursion-form">
        <label>Ім’я <input name="firstName" type="text" autocomplete="given-name" minlength="2" maxlength="60" required placeholder="Твоє ім’я"></label>
        <label>Прізвище <input name="lastName" type="text" autocomplete="family-name" minlength="2" maxlength="60" required placeholder="Твоє прізвище"></label>
        <label>Номер телефону <input name="phone" type="tel" autocomplete="tel" inputmode="tel" minlength="9" maxlength="25" required placeholder="+380 ..."></label>
        <label class="booking-form__consent"><input name="consent" type="checkbox" required><span>Погоджуюся на обробку контактних даних для зв’язку щодо екскурсії.</span></label>
        <p class="booking-form__status" role="status" aria-live="polite"></p>
        <button type="submit" class="booking-form__submit">ЗАПИСАТИСЯ НА ЕКСКУРСІЮ <span class="long-arrow" aria-hidden="true"></span></button>
      </form>
    </section>`;
  document.body.appendChild(modal);
  const form = modal.querySelector("form");
  const status = modal.querySelector(".booking-form__status");
  const submit = form.querySelector('[type="submit"]');
  let returnFocus = null;
  function close() {
    modal.hidden = true;
    document.body.classList.remove("booking-open");
    returnFocus?.focus();
  }
  function open(opener) {
    returnFocus = opener;
    setMenu(false);
    modal.hidden = false;
    document.body.classList.add("booking-open");
    status.textContent = "";
    modal.querySelector(".booking-modal__close").focus();
  }
  triggers.forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      open(link);
    }),
  );
  modal
    .querySelectorAll("[data-excursion-close]")
    .forEach((el) => el.addEventListener("click", close));
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll("button, input")].filter(
      (el) => !el.disabled,
    );
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === focusable[focusable.length - 1]
    ) {
      event.preventDefault();
      focusable[0].focus();
    }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const firstName = form.elements.firstName.value.trim();
    const lastName = form.elements.lastName.value.trim();
    const phone = form.elements.phone.value.trim();
    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !/^[+\d\s()\-]{9,25}$/.test(phone)
    ) {
      status.textContent = "Перевір ім’я, прізвище та номер телефону.";
      return;
    }
    const message = [
      "🌿 НОВА ЗАЯВКА · БЕЗКОШТОВНА ЕКСКУРСІЯ",
      "Авторська гра «Важливий крок»",
      `Ім’я: ${firstName}`,
      `Прізвище: ${lastName}`,
      `Телефон: ${phone}`,
    ].join("\n");
    submit.disabled = true;
    status.textContent = "Надсилаємо заявку…";
    try {
      await sendApplication({ kind: "excursion", firstName, lastName, phone });
      form.reset();
      close();
      showThankYou("excursion");
    } catch (error) {
      status.textContent = error.message || "Не вдалося надіслати заявку.";
    } finally {
      submit.disabled = false;
    }
  });
})();

// Seamless marquee: fill the viewport and loop by exactly one group width.
(() => {
  const marquees = document.querySelectorAll(".retro-marquee");
  if (!marquees.length) return;

  function setupMarquee(marquee) {
    const track = marquee.querySelector(".retro-marquee__track");
    const original = track?.querySelector(".retro-marquee__group");
    if (!track || !original) return;

    // Avoid duplicating existing markup clones on every resize.
    track.querySelectorAll(".retro-marquee__group").forEach((group) => {
      if (group !== original) group.remove();
    });

    const groupWidth = original.getBoundingClientRect().width;
    if (!groupWidth) return;
    const needed = Math.max(2, Math.ceil(marquee.clientWidth / groupWidth) + 1);
    for (let i = 1; i < needed; i++) {
      const clone = original.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }

    track.style.setProperty("--marquee-distance", `${groupWidth}px`);
    const speed = window.matchMedia("(max-width: 700px)").matches ? 25 : 32;
    track.style.setProperty("--marquee-duration", `${speed}s`);
  }

  let frame = 0;
  function refresh() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => marquees.forEach(setupMarquee));
  }
  refresh();
  window.addEventListener("resize", refresh, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
})();

// Плаваюча кнопка повернення на початок сторінки.
(() => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Повернутися на початок сторінки");
  button.setAttribute("title", "Нагору");
  button.innerHTML = `
  <svg
    width="20"
    height="30"
    viewBox="0 0 20 30"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 28V2M2.5 9.5L10 2L17.5 9.5"
      stroke="currentColor"
      stroke-width="1.15"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;
  document.body.appendChild(button);

  let scheduled = false;
  const updateVisibility = () => {
    const visible = window.scrollY > Math.max(500, window.innerHeight * 0.75);
    button.classList.toggle("is-visible", visible);
    button.tabIndex = visible ? 0 : -1;
    scheduled = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateVisibility);
    },
    { passive: true },
  );
  window.addEventListener("resize", updateVisibility);
  button.addEventListener("click", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  });
  updateVisibility();
})();
