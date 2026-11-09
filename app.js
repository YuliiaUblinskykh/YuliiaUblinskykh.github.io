"use strict";

const TICKET_URL = "";
const burger = document.querySelector(".burger");
const panel = document.querySelector("#mobile-menu");
const ticket = document.querySelector("[data-ticket-link]");
const ticketNote = document.querySelector("#ticket-note");
function setMenu(open) {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  panel.classList.toggle("is-open", open);
  panel.inert = !open;
  document.body.classList.toggle("menu-open", open);
}
burger.addEventListener("click", () =>
  setMenu(burger.getAttribute("aria-expanded") !== "true"),
);
panel
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
if (TICKET_URL) {
  ticket.href = TICKET_URL;
  document.querySelector(".header-ticket").href = TICKET_URL;
} else {
  ticket.addEventListener("click", (event) => {
    event.preventDefault();
    ticketNote.hidden = false;
  });
  document
    .querySelector(".header-ticket")
    .addEventListener("click", (event) => {
      event.preventDefault();
      setMenu(false);
      ticket.scrollIntoView({ behavior: "smooth", block: "center" });
      ticketNote.hidden = false;
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
    const isDesktop = window.matchMedia('(min-width: 701px)').matches;
    const trigger = window.innerHeight * 0.65;
    const progress = Math.max(0, Math.min(1,
      (trigger - rect.top) / (rect.height + window.innerHeight * 0.25)
    ));

    timeline.style.setProperty('--timeline-progress', progress);
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
      step.classList.toggle('is-visible', active);
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
  const nodes = [...document.querySelectorAll('[data-site-reveal]')];
  if (!nodes.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.08, rootMargin: '0px 0px -25px 0px'});
  nodes.forEach(node => observer.observe(node));
  document.documentElement.classList.add('js-motion');

  requestAnimationFrame(() => {
    nodes.forEach(node => {
      if (node.getBoundingClientRect().top < innerHeight * .92) node.classList.add('is-revealed');
    });
  });
})();



(() => {
 const carousel=document.querySelector('[data-program-carousel]'); if(!carousel)return;
 const viewport=carousel.querySelector('.day-program__viewport');
 const cards=[...carousel.querySelectorAll('.day-program__card')];
 const prev=carousel.querySelector('[data-program-prev]');
 const next=carousel.querySelector('[data-program-next]');
 const current=carousel.querySelector('[data-program-current]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function index(){const x=viewport.scrollLeft;let best=0,dist=Infinity;cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-cards[0].offsetLeft-x);if(d<dist){dist=d;best=i}});return best}
 function update(){const i=index();current.textContent=String(i+1).padStart(2,'0');prev.disabled=i===0;next.disabled=i===cards.length-1}
 function go(i){i=Math.max(0,Math.min(cards.length-1,i));viewport.scrollTo({left:cards[i].offsetLeft-cards[0].offsetLeft,behavior:reduced?'instant':'smooth'})}
 prev.addEventListener('click',()=>go(index()-1));next.addEventListener('click',()=>go(index()+1));
 let raf=0;viewport.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)},{passive:true});window.addEventListener('resize',update);update();
})();


(() => {
 const root=document.querySelector('[data-reviews-carousel]');if(!root)return;
 const viewport=root.querySelector('.reviews__viewport');
 const items=[...root.querySelectorAll('.reviews__item')];
 const prev=root.querySelector('[data-reviews-prev]');
 const next=root.querySelector('[data-reviews-next]');
 const current=root.querySelector('[data-reviews-current]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function activeIndex(){let best=0,distance=Infinity;items.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-items[0].offsetLeft-viewport.scrollLeft);if(d<distance){distance=d;best=i}});return best}
 function update(){const i=activeIndex();current.textContent=String(i+1).padStart(2,'0');prev.disabled=viewport.scrollLeft<=2;next.disabled=viewport.scrollLeft>=viewport.scrollWidth-viewport.clientWidth-2}
 function go(i){i=Math.max(0,Math.min(items.length-1,i));viewport.scrollTo({left:items[i].offsetLeft-items[0].offsetLeft,behavior:reduced?'auto':'smooth'})}
 prev.addEventListener('click',()=>go(activeIndex()-1));next.addEventListener('click',()=>go(activeIndex()+1));
 let frame=0;viewport.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)},{passive:true});window.addEventListener('resize',update);update();
})();

if (!TICKET_URL) {
  document.querySelectorAll('a.primary-button[href="#ticket"]:not([data-ticket-link])').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      ticket.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ticketNote.hidden = false;
    });
  });
}


// Seamless marquee: fill the viewport and loop by exactly one group width.
(() => {
  const marquees = document.querySelectorAll('.retro-marquee');
  if (!marquees.length) return;

  function setupMarquee(marquee) {
    const track = marquee.querySelector('.retro-marquee__track');
    const original = track?.querySelector('.retro-marquee__group');
    if (!track || !original) return;

    // Avoid duplicating existing markup clones on every resize.
    track.querySelectorAll('.retro-marquee__group').forEach((group) => {
      if (group !== original) group.remove();
    });

    const groupWidth = original.getBoundingClientRect().width;
    if (!groupWidth) return;
    const needed = Math.max(2, Math.ceil(marquee.clientWidth / groupWidth) + 1);
    for (let i = 1; i < needed; i++) {
      const clone = original.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    track.style.setProperty('--marquee-distance', `${groupWidth}px`);
    const speed = window.matchMedia('(max-width: 700px)').matches ? 25 : 32;
    track.style.setProperty('--marquee-duration', `${speed}s`);
  }

  let frame = 0;
  function refresh() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => marquees.forEach(setupMarquee));
  }
  refresh();
  window.addEventListener('resize', refresh, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
})();
