const projects = [
  {
    id: "p1",
    title: "Job Sapo/ Job Posting",
    client: "Japanese Company",
    type: "website",
    live: "https://job---sapo.com/",
    // repo: "https://github.com/khencel/job-matching",
    tech: ["Next.js", "Python", "MySQL", "React.js", "Redux","Email Gateway"],
    // description: "A matching service that connects employers, job seekers, and workplaces.",
    notes: [
      "Role: Full-stack",
      "Highlights: Auth, admin panel, multi-step forms",
    ],
  },
  {
    id: "p2",
    title: "Metro Pacific Health",
    client: "Concept Machine",
    type: "website",
    live: "https://www.metropacifichealth.com/",
    repo: "",
    tech: ["Laravel Nova", "MySQL", "PHP", "Bootstrap","JavaScript"],
    // description: "Largest group of private hospitals and other healthcare facilities in the Philippines, with 29 hospitals like Makati Medical Center, Cardinal Santos Medical Center, Asian Hospital and Medical Center, Riverside Medical Center, and Davao Doctors Hospital, as well as 36 outpatient care Centers, 6 cancer care centers, 2 allied health colleges, and a centralized laboratory – all of them embodying medical excellence and providing compassionate care.",
    notes: ["Role: Full-stack", "Highlights: Orders, payments, inventory"],
  },
  {
    id: "p3",
    title: "C2M3I",
    client: "Concept Machine",
    type: "website",
    live: "https://c2m3i.com/",
    repo: "",
    tech: ["Laravel Nova", "MySQL", "PHP", "Bootstrap","JavaScript"],
    // description: "E-commerce storefront with product management and checkout integration.",
    notes: ["Role: Full-stack", "Highlights: Orders, payments, inventory"],
  },
  {
    id: "p4",
    title: "Just Add Water",
    client: "Concept Machine",
    type: "website",
    live: "https://justaddwater.com.ph/",
    repo: "",
    tech: ["Laravel Nova", "MySQL", "PHP", "Bootstrap","JavaScript"],
    // description: "E-commerce storefront with product management and checkout integration.",
    notes: ["Role: Full-stack", "Highlights: Orders, payments, inventory"],
  }
];

const elGrid = document.getElementById("projectsGrid");
const elEmpty = document.getElementById("emptyState");
const elSearch = document.getElementById("search");
const elFilterTech = document.getElementById("filterTech");
const elFilterType = document.getElementById("filterType");
const elYear = document.getElementById("year");
const elStatProjects = document.getElementById("statProjects");

/* Theme */
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
themeIcon.textContent = savedTheme === "light" ? "☀️" : "🌙";

themeBtn.addEventListener("click", () => {
  const isLight = document.documentElement.dataset.theme === "light";
  document.documentElement.dataset.theme = isLight ? "dark" : "light";
  const newTheme = isLight ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  themeIcon.textContent = newTheme === "light" ? "☀️" : "🌙";
});

/* Footer year */
elYear.textContent = new Date().getFullYear();

/* Stats */
elStatProjects.textContent = String(projects.length);

/* Build filter options */
const techSet = new Set();
projects.forEach(p => p.tech.forEach(t => techSet.add(t)));
[...techSet].sort().forEach(t => {
  const opt = document.createElement("option");
  opt.value = t;
  opt.textContent = t;
  elFilterTech.appendChild(opt);
});

function badgeType(type){
  const map = { website:"Website", webapp:"Web App", ecommerce:"E-commerce", landing:"Landing" };
  return map[type] || type;
}

function render(list){
  elGrid.innerHTML = "";

  if (!list.length){
    elEmpty.hidden = false;
    return;
  }
  elEmpty.hidden = true;

  for (const p of list){
    const card = document.createElement("article");
    card.className = "card project";

    card.innerHTML = `
      <div class="project__top">
        <div>
          <div class="project__title">${escapeHtml(p.title)}</div>
          <div class="project__client">${escapeHtml(p.client || "")}</div>
        </div>
        <div class="project__type">${badgeType(p.type)}</div>
      </div>

      <p class="project__desc">${escapeHtml(p.description || "")}</p>

      <div class="project__tags">
        ${p.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div class="project__actions">
        <a class="btn" href="${p.live}" target="_blank" rel="noreferrer">Live</a>
        ${p.repo ? `<a class="btn btn--ghost" href="${p.repo}" target="_blank" rel="noreferrer">Code</a>` : ""}
       
      </div>
    `;

    elGrid.appendChild(card);
  }

  // Wire up modal buttons
  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-open")));
  });
}

function getFiltered(){
  const q = (elSearch.value || "").toLowerCase().trim();
  const tech = elFilterTech.value;
  const type = elFilterType.value;

  return projects.filter(p => {
    const matchesType = type === "all" || p.type === type;
    const matchesTech = tech === "all" || p.tech.includes(tech);

    const hay = [
      p.title, p.client, p.type,
      ...(p.tech || []),
      p.description,
      ...(p.notes || []),
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesQuery = !q || hay.includes(q);
    return matchesType && matchesTech && matchesQuery;
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Modal */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalLive = document.getElementById("modalLive");
const modalRepo = document.getElementById("modalRepo");
const modalNotes = document.getElementById("modalNotes");

function openModal(id){
  const p = projects.find(x => x.id === id);
  if (!p) return;

  modalTitle.textContent = p.title;
  modalMeta.textContent = `${badgeType(p.type)} • ${p.client || "—"}`;
  modalDesc.textContent = p.description || "";

  modalTags.innerHTML = (p.tech || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  modalLive.href = p.live || "#";
  modalLive.style.display = p.live ? "inline-flex" : "none";

  modalRepo.href = p.repo || "#";
  modalRepo.style.display = p.repo ? "inline-flex" : "none";

  modalNotes.innerHTML = (p.notes && p.notes.length)
    ? `<div class="divider"></div><ul class="bullets">${p.notes.map(n => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`
    : "";

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.dataset && t.dataset.close) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

/* Filters */
["input", "change"].forEach(evt => {
  elSearch.addEventListener(evt, () => render(getFiltered()));
  elFilterTech.addEventListener(evt, () => render(getFiltered()));
  elFilterType.addEventListener(evt, () => render(getFiltered()));
});

/* Contact form: copy message */
const contactForm = document.getElementById("contactForm");
const copyHint = document.getElementById("copyHint");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  const text = `Name: ${name}\n\nMessage:\n${message}`;
  try{
    await navigator.clipboard.writeText(text);
    copyHint.textContent = "Copied! Paste it to email or messenger.";
  }catch{
    copyHint.textContent = "Copy failed. Please copy manually.";
  }
});

/* Initial render */
render(projects);