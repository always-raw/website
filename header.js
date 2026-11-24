// ---------- Shared header & footer ----------
// Injected on every page. Edit the nav or footer HERE only.
(function () {
  const pages = [
    { file: "stories.html",    label: "Stories" },
    { file: "reportage.html",  label: "Reportage" },
    { file: "tearsheets.html", label: "Tearsheets" },
    { file: "about.html",      label: "About" }
  ];

  // Current page = last part of the URL ("" when browsing a folder -> index.html)
  const current = location.pathname.split("/").pop() || "index.html";

  const navLinks = pages.map(p => {
    const isActive = p.file === current ? ' class="active"' : "";
    return `        <a href="${p.file}"${isActive}>${p.label}</a>`;
  }).join("\n");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<a class="logo" href="index.html">Nikos Kanistras</a>\n' +
    '    <nav class="site-nav">\n' +
    navLinks + "\n    </nav>";
  document.body.prepend(header);   // safe: runs before the page content

  // The homepage deliberately has no footer (body class "home")
  if (!document.body.classList.contains("home")) {
    // The footer must be attached AFTER the page content exists,
    // otherwise it lands at the top. Wait for the DOM to finish loading.
    document.addEventListener("DOMContentLoaded", () => {
      const footer = document.createElement("footer");
      footer.className = "site-footer";
      footer.innerHTML = "<p>&copy; Nikos Kanistras All Rights Reserved.</p>";
      document.body.appendChild(footer);
    });
  }
})();