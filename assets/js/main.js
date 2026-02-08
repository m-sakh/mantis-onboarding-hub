// Lightweight local checklist persistence + very basic search
(function () {
  // ---- Checklist persistence ----
  const checklists = document.querySelectorAll(".checklist");
  checklists.forEach((wrap) => {
    const key = wrap.getAttribute("data-checklist");
    if (!key) return;

    const boxes = Array.from(wrap.querySelectorAll('input[type="checkbox"]'));
    const saved = JSON.parse(localStorage.getItem(`mantis_checklist_${key}`) || "[]");

    boxes.forEach((box, idx) => {
      if (saved[idx] === true) box.checked = true;
      box.addEventListener("change", () => {
        const state = boxes.map(b => b.checked);
        localStorage.setItem(`mantis_checklist_${key}`, JSON.stringify(state));
      });
    });
  });

  const resetBtn = document.getElementById("resetChecklist");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith("mantis_checklist_"));
      allKeys.forEach(k => localStorage.removeItem(k));
      location.reload();
    });
  }

  // ---- Simple site search (hardcoded index) ----
  const siteSearch = document.getElementById("siteSearch");
  const searchResults = document.getElementById("searchResults");
  if (!siteSearch || !searchResults) return;

  const pages = [
    { title: "Start: First 60 minutes", url: "start.html", keywords: ["start", "fast path", "deep path", "access", "homeworks"] },
    { title: "Checklist: Day -X → Day 9", url: "checklist.html", keywords: ["checklist", "day 1", "homeworks", "proposal", "milestones", "mentor", "weekly update"] },
    { title: "Tools: where things live", url: "tools.html", keywords: ["tools", "docs", "github", "where things live", "help"] },
    { title: "GitHub: repos + tasks", url: "github.html", keywords: ["github", "repos", "tasks", "issues", "projects", "pull request", "pr"] },
    { title: "FAQ", url: "faq.html", keywords: ["faq", "milestones", "proposal template"] }
  ];

  function renderResults(items) {
    searchResults.innerHTML = "";
    if (!items.length) {
      searchResults.innerHTML = `<div class="small muted">No matches.</div>`;
      return;
    }
    items.slice(0, 6).forEach(item => {
      const a = document.createElement("a");
      a.href = item.url;
      a.textContent = item.title;
      searchResults.appendChild(a);
    });
  }

  siteSearch.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ""; return; }
    const hits = pages.filter(p => {
      const hay = (p.title + " " + p.keywords.join(" ")).toLowerCase();
      return hay.includes(q);
    });
    renderResults(hits);
  });
})();

