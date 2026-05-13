(function () {
  const store = window.PortfolioStore;
  const cloud = window.PortfolioCloud;
  const documentRoot = document.getElementById("portfolioDocument");
  const printButton = document.getElementById("printPortfolioButton");
  const ownerName = document.getElementById("portfolioOwnerName");

  function buildTag(tag) {
    const span = document.createElement("span");
    span.className = "portfolio-tag";
    span.textContent = tag;
    return span;
  }

  function createImageTile(image) {
    const tile = document.createElement("div");
    tile.className = "portfolio-image-tile";
    tile.style.setProperty("--image-url", `url('${image}')`);
    return tile;
  }

  function compactNarrative(text, maxWords = 430) {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      return text;
    }

    return `${words.slice(0, maxWords).join(" ")}...`;
  }

  function renderProjectPage(project, index) {
    const page = document.createElement("article");
    const hasDeepGallery = project.gallery.length > 4;
    page.className = `portfolio-page project-packet${hasDeepGallery ? " has-continuation" : ""}`;
    page.id = project.id;

    const subfieldLabel = store.getSubfieldDisplay(project.category, project.subfield);
    const narrative = compactNarrative(project.portfolioNarrative || store.buildPortfolioNarrative(project));
    const primaryImages = project.gallery.slice(0, 4);
    const supportingImages = project.gallery.slice(4, 10);

    page.innerHTML = `
      <section class="portfolio-sheet portfolio-sheet-main">
        <div class="portfolio-page-header">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <p class="kicker">${project.categoryLabel} / ${subfieldLabel}</p>
            <h2>${project.title}</h2>
          </div>
        </div>
        <div class="portfolio-page-grid">
          <section class="portfolio-narrative">
            ${narrative.split("\n\n").map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </section>
          <aside class="portfolio-side-panel">
            <strong>${project.type}</strong>
            <p>${project.shortSummary}</p>
            <div class="portfolio-tag-list"></div>
            <div class="portfolio-acronym-list"></div>
          </aside>
        </div>
        <div class="portfolio-gallery"></div>
      </section>
    `;

    const tagList = page.querySelector(".portfolio-tag-list");
    [subfieldLabel, ...project.tags.slice(0, 7)].forEach((tag) => tagList.appendChild(buildTag(tag)));

    const acronymList = page.querySelector(".portfolio-acronym-list");
    (project.acronyms || []).slice(0, 4).forEach((item) => {
      const row = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = item.acronym;
      row.appendChild(label);
      row.append(`: ${item.meaning}`);
      acronymList.appendChild(row);
    });

    const gallery = page.querySelector(".portfolio-gallery");
    primaryImages.forEach((image) => gallery.appendChild(createImageTile(image)));

    if (supportingImages.length) {
      const continuation = document.createElement("section");
      continuation.className = "portfolio-sheet portfolio-sheet-support";
      continuation.innerHTML = `
        <div class="portfolio-page-header compact">
          <span>${String(index + 1).padStart(2, "0")}B</span>
          <div>
            <p class="kicker">Supporting Evidence</p>
            <h2>${project.title}</h2>
          </div>
        </div>
        <p class="portfolio-support-copy">
          Additional images are arranged in the saved project sequence to show the design, build, test,
          or documentation progression without extending this packet beyond two pages for one entry.
        </p>
        <div class="portfolio-gallery support-gallery"></div>
      `;
      supportingImages.forEach((image) => continuation.querySelector(".support-gallery").appendChild(createImageTile(image)));
      page.appendChild(continuation);
    }

    return page;
  }

  function renderPortfolio(config = store.getConfig(), projects = store.getProjects()) {
    ownerName.textContent = config.ownerName;
    documentRoot.innerHTML = "";

    const cover = document.createElement("section");
    cover.className = "portfolio-cover portfolio-sheet";
    cover.innerHTML = `
      <p class="kicker">Engineering Portfolio Packet</p>
      <h1>${config.ownerName}</h1>
      <p>${config.school} / Class of ${config.classYear}</p>
      <p class="portfolio-cover-copy">
        Selected projects and research entries prepared as an interview-ready technical packet.
        Each page frames the engineering context, responsibilities, technical work, and value created.
      </p>
    `;
    documentRoot.appendChild(cover);

    projects.forEach((project, index) => {
      documentRoot.appendChild(renderProjectPage(project, index));
    });
  }

  async function hydrateCloudPortfolio() {
    if (!cloud || !cloud.isConfigured || !cloud.isConfigured()) {
      return;
    }

    try {
      const cloudState = await cloud.loadPublicState();
      const config = cloudState && cloudState.config ? { ...store.getConfig(), ...cloudState.config } : store.getConfig();
      const projects =
        cloudState && Array.isArray(cloudState.projects) && cloudState.projects.length
          ? cloudState.projects.map((project) => store.normalizeProject(project))
          : store.getProjects();
      renderPortfolio(config, projects);
    } catch (error) {
      console.warn("Cloud portfolio packet data could not be loaded.", error);
    }
  }

  printButton.addEventListener("click", () => window.print());
  renderPortfolio();
  hydrateCloudPortfolio();
})();
