(function () {
  const store = window.PortfolioStore;
  const cloud = window.PortfolioCloud;
  const state = {
    projects: store.getProjects(),
    config: store.getConfig(),
    filter: { category: "all", subfield: "" },
    institutionDirectory: [],
    verified: false,
  };

  const publicEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
  ];

  const projectGrid = document.getElementById("projectGrid");
  const filterChips = document.getElementById("filterChips");
  const categoryMenu = document.getElementById("categoryMenu");
  const portfolioMap = document.getElementById("portfolioMap");
  const labResearchPanel = document.getElementById("labResearchPanel");
  const activeFilterBanner = document.getElementById("activeFilterBanner");
  const clearFiltersButton = document.getElementById("clearFilters");
  const heroPortrait = document.getElementById("heroPortrait");

  const requestForm = document.getElementById("requestForm");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("workEmail");
  const fieldSelect = document.getElementById("engineeringField");
  const institutionInput = document.getElementById("institution");
  const institutionOptions = document.getElementById("institutionOptions");
  const verifyButton = document.getElementById("verifyButton");
  const verificationStatus = document.getElementById("verificationStatus");
  const postVerifyFields = document.getElementById("postVerifyFields");
  const requestPurpose = document.getElementById("requestPurpose");
  const submitRequestButton = document.getElementById("submitRequestButton");
  const requestResult = document.getElementById("requestResult");

  const projectModal = document.getElementById("projectModal");
  const closeModalButton = document.getElementById("closeModal");

  function isCloudConfigured() {
    return Boolean(cloud && cloud.isConfigured && cloud.isConfigured());
  }

  function applyCloudState(cloudState) {
    if (!cloudState) {
      return false;
    }

    let changed = false;
    if (cloudState.config) {
      state.config = { ...state.config, ...cloudState.config };
      changed = true;
    }
    if (Array.isArray(cloudState.projects) && cloudState.projects.length) {
      state.projects = cloudState.projects.map((project) => store.normalizeProject(project));
      changed = true;
    }
    return changed;
  }

  async function hydrateCloudData() {
    if (!isCloudConfigured()) {
      return;
    }

    try {
      const cloudState = await cloud.loadPublicState();
      if (!applyCloudState(cloudState)) {
        return;
      }
      setHeroConfig();
      populateRequestSelects();
      renderHeroPortrait();
      renderCategoryMenu();
      renderLabResearchPanel();
      renderFilterChips();
      renderPortfolioMap();
      renderProjectGrid();
      updateActiveFilterBanner();
    } catch (error) {
      console.warn("Cloud portfolio data could not be loaded.", error);
    }
  }

  function isCompleteName(value) {
    return value.trim().length >= 2;
  }

  function syncNameValidity(input, fieldLabel) {
    const value = input.value.trim();
    if (!value) {
      input.setCustomValidity("");
      return;
    }

    if (value.length < 2) {
      input.setCustomValidity(`Please lengthen this field by writing your full ${fieldLabel}.`);
      return;
    }

    input.setCustomValidity("");
  }

  function isValidWorkEmailFormat(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setHeroConfig() {
    const ownerName = state.config.ownerName || "Sumit Singh";
    const heroSchool = document.getElementById("heroSchool");
    const heroYear = document.getElementById("heroYear");
    const heroName = document.getElementById("heroName");
    const heroDisplayName = document.getElementById("heroDisplayName");
    const emailLink = document.getElementById("heroEmailLink");

    if (heroSchool) {
      heroSchool.textContent = state.config.school;
    }

    if (heroYear) {
      heroYear.textContent = state.config.classYear;
    }

    if (heroName) {
      heroName.textContent = ownerName;
    }

    if (heroDisplayName) {
      heroDisplayName.textContent = ownerName;
    }

    if (emailLink) {
      emailLink.textContent = state.config.notificationEmail;
      emailLink.href = `mailto:${state.config.notificationEmail}`;
    }
  }

  function createOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    return option;
  }

  function normalizeSearch(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  const cityCountyLookup = {
    Anaheim: "Orange",
    Burbank: "Los Angeles",
    Carpinteria: "Santa Barbara",
    Chula: "San Diego",
    "Chula Vista": "San Diego",
    "Costa Mesa": "Orange",
    "El Segundo": "Los Angeles",
    Fullerton: "Orange",
    Goleta: "Santa Barbara",
    Hawthorne: "Los Angeles",
    Irvine: "Orange",
    "Long Beach": "Los Angeles",
    "Los Angeles": "Los Angeles",
    "Moffett Field": "Santa Clara",
    Mojave: "Kern",
    "Mountain View": "Santa Clara",
    Oakland: "Alameda",
    Ontario: "San Bernardino",
    Palmdale: "Los Angeles",
    "Palo Alto": "Santa Clara",
    Pasadena: "Los Angeles",
    Poway: "San Diego",
    "Rancho Dom": "Los Angeles",
    "Rancho Dominguez": "Los Angeles",
    "Rancho Cordova": "Sacramento",
    "Redwood City": "San Mateo",
    "Redondo Beach": "Los Angeles",
    Riverside: "Riverside",
    Sacramento: "Sacramento",
    "San Diego": "San Diego",
    "San Francisco": "San Francisco",
    "San Jose": "Santa Clara",
    "Santa Clara": "Santa Clara",
    "Santa Cruz": "Santa Cruz",
    "Santa Rosa": "Sonoma",
    Sunnyvale: "Santa Clara",
    Torrance: "Los Angeles",
    "Van Nuys": "Los Angeles",
    Wilmington: "Los Angeles",
  };

  const regionalLocationLookup = {
    "Bay Area": [
      ["San Francisco", "San Francisco"],
      ["San Jose", "Santa Clara"],
      ["Oakland", "Alameda"],
      ["Palo Alto", "Santa Clara"],
      ["Redwood City", "San Mateo"],
    ],
    California: [
      ["Los Angeles", "Los Angeles"],
      ["Long Beach", "Los Angeles"],
      ["Irvine", "Orange"],
      ["San Diego", "San Diego"],
      ["San Jose", "Santa Clara"],
      ["San Francisco", "San Francisco"],
      ["Sacramento", "Sacramento"],
    ],
    "California Operations": [
      ["Los Angeles", "Los Angeles"],
      ["Long Beach", "Los Angeles"],
      ["Irvine", "Orange"],
      ["San Diego", "San Diego"],
      ["San Jose", "Santa Clara"],
      ["San Francisco", "San Francisco"],
      ["Sacramento", "Sacramento"],
    ],
    "Multiple California Cities": [
      ["Los Angeles", "Los Angeles"],
      ["Long Beach", "Los Angeles"],
      ["Irvine", "Orange"],
      ["San Diego", "San Diego"],
      ["San Jose", "Santa Clara"],
      ["San Francisco", "San Francisco"],
      ["Sacramento", "Sacramento"],
    ],
    "Northern California": [
      ["San Francisco", "San Francisco"],
      ["San Jose", "Santa Clara"],
      ["Oakland", "Alameda"],
      ["Sacramento", "Sacramento"],
    ],
    "Southern California": [
      ["Los Angeles", "Los Angeles"],
      ["Long Beach", "Los Angeles"],
      ["Irvine", "Orange"],
      ["San Diego", "San Diego"],
      ["Van Nuys", "Los Angeles"],
    ],
  };

  function sizeInstitutionSuggestions() {
    if (!institutionInput || !institutionOptions) {
      return;
    }

    const inputRect = institutionInput.getBoundingClientRect();
    const arrowZoneWidth = 34;
    const menuWidth = Math.max(260, inputRect.width - arrowZoneWidth);
    institutionOptions.style.width = `${menuWidth}px`;
  }

  function setInstitutionSuggestionsOpen(isOpen) {
    if (!institutionInput || !institutionOptions) {
      return;
    }

    const canOpen = isOpen && !institutionInput.disabled && institutionOptions.children.length > 0;
    if (canOpen) {
      sizeInstitutionSuggestions();
    }
    institutionOptions.hidden = !canOpen;
    institutionInput.setAttribute("aria-expanded", String(canOpen));
  }

  function selectInstitutionSuggestion(value) {
    institutionInput.value = value;
    setInstitutionSuggestionsOpen(false);
    unlockRequestFields();
    institutionInput.focus();
  }

  function createInstitutionSuggestion(value, displayValue = value, className = "institution-option") {
    const option = document.createElement("div");
    option.className = className;
    option.setAttribute("role", "option");
    option.tabIndex = -1;
    option.textContent = displayValue;
    option.setAttribute("aria-label", value);

    option.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    option.addEventListener("click", () => {
      selectInstitutionSuggestion(value);
    });

    return option;
  }

  function parseInstitutionEntry(value) {
    const match = value.match(/^(.*?) - \((.*)\)$/);
    if (!match) {
      return {
        groupName: value,
        children: [{ label: value, value, isHeadquarters: false }],
      };
    }

    const rawCompanyName = match[1].trim();
    const locationText = match[2].trim();
    const headquartersMatch = rawCompanyName.match(/^(.*?)\s+\(HQ\s+([^)]+)\)$/i);
    const groupName = headquartersMatch ? headquartersMatch[1].trim() : rawCompanyName;
    const hqCity = headquartersMatch ? headquartersMatch[2].trim() : "";
    const locationSplit = locationText.match(/^(.*),\s*([^,]+)$/);
    const cityText = locationSplit ? locationSplit[1].trim() : locationText;
    const countyText = locationSplit ? locationSplit[2].trim() : "";
    const cities = cityText.split(/\s*\/\s*/).map((city) => city.trim()).filter(Boolean);
    const counties = countyText.split(/\s*\/\s*/).map((county) => county.trim()).filter(Boolean);
    const hasVariousCounties = counties.some((county) => normalizeSearch(county) === "various counties");
    const seenChildren = new Set();

    let children = cities.flatMap((city, index) => {
      const normalizedCity = city.replace(/\s+(Operations|Office)$/i, "").trim();
      const regionalLocations = regionalLocationLookup[normalizedCity];
      if (hasVariousCounties && regionalLocations) {
        return regionalLocations.map(([regionalCity, regionalCounty]) => ({
          label: `${regionalCity}, ${regionalCounty}`,
          value: `${groupName} - (${regionalCity}, ${regionalCounty})`,
          isHeadquarters: Boolean(hqCity) && normalizeSearch(regionalCity) === normalizeSearch(hqCity),
          fromVariousCounties: true,
        }));
      }

      const inferredCounty = cityCountyLookup[normalizedCity];
      if (hasVariousCounties && !inferredCounty) {
        return [];
      }

      const county = inferredCounty || (counties.length === cities.length ? counties[index] : counties[0]) || "California";
      const isHeadquarters = Boolean(hqCity) && (!normalizedCity || normalizeSearch(normalizedCity) === normalizeSearch(hqCity));
      const label = isHeadquarters ? `${normalizedCity || hqCity} HQ, ${county}` : `${city}, ${county}`;

      return {
        label,
        value: `${groupName} - (${label})`,
        isHeadquarters,
        fromVariousCounties: hasVariousCounties,
      };
    });

    if (hasVariousCounties && !children.length) {
      children = regionalLocationLookup["California Operations"].map(([city, county]) => ({
        label: `${city}, ${county}`,
        value: `${groupName} - (${city}, ${county})`,
        isHeadquarters: Boolean(hqCity) && normalizeSearch(city) === normalizeSearch(hqCity),
        fromVariousCounties: true,
      }));
    }

    children = children.filter((child) => {
      const key = child.value.toLowerCase();
      if (seenChildren.has(key)) {
        return false;
      }
      seenChildren.add(key);
      return true;
    });

    return {
      groupName,
      children: children.length ? children : [{ label: locationText, value, isHeadquarters: false }],
    };
  }

  function buildInstitutionGroups(items) {
    const groups = new Map();

    items.forEach((item) => {
      const parsed = parseInstitutionEntry(item);
      if (!groups.has(parsed.groupName)) {
        groups.set(parsed.groupName, {
          name: parsed.groupName,
          children: [],
          childValues: new Set(),
          hasVariousCounties: false,
        });
      }

      const group = groups.get(parsed.groupName);
      parsed.children.forEach((child) => {
        group.hasVariousCounties = group.hasVariousCounties || Boolean(child.fromVariousCounties);
        const key = child.value.toLowerCase();
        if (!group.childValues.has(key)) {
          group.childValues.add(key);
          group.children.push(child);
        }
      });
    });

    return [...groups.values()]
      .map((group) => {
        const headquartersChild = group.children.find((child) => child.isHeadquarters);
        const headquartersCity = headquartersChild ? normalizeSearch(headquartersChild.label.split(" HQ,")[0]) : "";

        return {
          name: group.name,
          hasVariousCounties: group.hasVariousCounties,
          children: group.children.sort((a, b) => {
            if (a.isHeadquarters !== b.isHeadquarters) {
              return a.isHeadquarters ? -1 : 1;
            }

            const aIsHeadquartersCity = headquartersCity && normalizeSearch(a.label).startsWith(headquartersCity);
            const bIsHeadquartersCity = headquartersCity && normalizeSearch(b.label).startsWith(headquartersCity);
            if (aIsHeadquartersCity !== bIsHeadquartersCity) {
              return aIsHeadquartersCity ? -1 : 1;
            }

            return a.label.localeCompare(b.label);
          }),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function matchesTerms(value, terms) {
    if (!terms.length) {
      return true;
    }

    const normalizedValue = normalizeSearch(value);
    return terms.every((term) => normalizedValue.includes(term));
  }

  function createInstitutionGroup(group, children) {
    const groupNode = document.createElement("div");
    groupNode.className = "institution-group";
    groupNode.setAttribute("role", "group");
    groupNode.setAttribute("aria-label", group.name);

    const label = document.createElement("div");
    label.className = "institution-group-label";
    label.textContent = group.name;
    groupNode.appendChild(label);

    children.forEach((child) => {
      groupNode.appendChild(
        createInstitutionSuggestion(child.value, child.label, "institution-option institution-suboption")
      );
    });

    return groupNode;
  }

  function renderInstitutionSuggestions(query = "", shouldOpen = false) {
    if (!institutionOptions) {
      return;
    }

    const normalizedQuery = normalizeSearch(query);
    const terms = normalizedQuery.split(" ").filter(Boolean);
    institutionOptions.innerHTML = "";

    const groups = buildInstitutionGroups(state.institutionDirectory)
      .map((group) => {
        const groupMatches = matchesTerms(group.name, terms);
        const children = groupMatches
          ? group.children
          : group.children.filter((child) => matchesTerms(`${group.name} ${child.label} ${child.value}`, terms));

        return { ...group, children, groupMatches, totalChildren: group.children.length };
      })
      .filter((group) => group.children.length)
      .sort((a, b) => {
        if (!terms.length) {
          return a.name.localeCompare(b.name);
        }

        const aStarts = normalizeSearch(a.name).startsWith(normalizedQuery) ? 0 : 1;
        const bStarts = normalizeSearch(b.name).startsWith(normalizedQuery) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, terms.length ? 60 : state.institutionDirectory.length);

    groups.forEach((group) => {
      if (group.totalChildren === 1 && !group.hasVariousCounties) {
        const child = group.children[0];
        institutionOptions.appendChild(createInstitutionSuggestion(child.value));
        return;
      }

      institutionOptions.appendChild(createInstitutionGroup(group, group.children));
    });

    setInstitutionSuggestionsOpen(shouldOpen && groups.length > 0);
  }

  function populateRequestSelects() {
    if (!fieldSelect || !institutionInput || !institutionOptions) {
      return;
    }

    fieldSelect.innerHTML = '<option value="">Select Field...</option>';
    store.engineeringFields.forEach((field) => {
      fieldSelect.appendChild(createOption(field));
    });

    populateInstitutionSelect("");
  }

  function populateInstitutionSelect(field) {
    if (!institutionInput || !institutionOptions) {
      return;
    }

    state.institutionDirectory = store.getInstitutionsForField(field);
    institutionInput.value = "";
    renderInstitutionSuggestions("");
  }

  function renderHeroPortrait() {
    if (!heroPortrait || !state.projects.length) {
      return;
    }

    const heroProject = state.projects[0];
    heroPortrait.style.setProperty(
      "--portrait-image",
      `linear-gradient(135deg, rgba(140, 160, 188, 0.16), rgba(10, 18, 33, 0.14)), url('${heroProject.coverImage}')`
    );
  }

  function applyFilter(category, subfield = "") {
    state.filter = { category, subfield };
    renderCategoryMenu();
    renderLabResearchPanel();
    renderPortfolioMap();
    renderProjectGrid();
    renderFilterChips();
    updateActiveFilterBanner();
  }

  function updateActiveFilterBanner() {
    if (!activeFilterBanner) {
      return;
    }

    const { category, subfield } = state.filter;
    if ((category === "all" && !subfield) || category === "research") {
      activeFilterBanner.hidden = true;
      activeFilterBanner.textContent = "";
      return;
    }

    activeFilterBanner.hidden = false;
    const subfieldLabel = subfield ? store.getSubfieldDisplay(category, subfield) : "";
    activeFilterBanner.textContent = subfield
      ? `Showing ${subfieldLabel} projects inside ${getCategoryLabel(category)}.`
      : `Showing ${getCategoryLabel(category)} projects.`;
  }

  function getCategoryLabel(slug) {
    const category = store.categoryDefinitions.find((item) => item.slug === slug);
    return category ? category.label : slug;
  }

  function renderCategoryMenu() {
    if (!categoryMenu) {
      return;
    }

    categoryMenu.innerHTML = "";

    const allItem = document.createElement("section");
    allItem.className = "category-card is-all";
    if (state.filter.category === "all") {
      allItem.classList.add("active");
    }
    const allTrigger = document.createElement("button");
    allTrigger.className = "category-trigger";
    allTrigger.type = "button";
    allTrigger.innerHTML = "<strong>All</strong>";
    allTrigger.addEventListener("click", () => applyFilter("all"));
    allItem.appendChild(allTrigger);
    categoryMenu.appendChild(allItem);

    store.categoryDefinitions.forEach((category) => {
      const card = document.createElement("section");
      card.className = "category-card";
      if (category.slug === "research") {
        card.classList.add("category-card-lab");
      }
      if (state.filter.category === category.slug) {
        card.classList.add("active");
      }

      const trigger = document.createElement("button");
      trigger.className = "category-trigger";
      trigger.type = "button";
      trigger.innerHTML = `
        <strong>${category.label}</strong>
      `;
      trigger.addEventListener("click", () => applyFilter(category.slug));

      card.appendChild(trigger);

      if (category.slug === "research") {
        categoryMenu.appendChild(card);
        return;
      }

      const submenu = document.createElement("div");
      submenu.className = "submenu";

      store.getSubfieldTree(category).forEach((subfield) => {
        if (!subfield.children.length) {
          submenu.appendChild(createMenuLink(category.slug, subfield));
          return;
        }

        const group = document.createElement("div");
        group.className = "submenu-item has-children";

        const parentLink = createMenuLink(category.slug, subfield);
        parentLink.classList.add("menu-parent");

        const arrow = document.createElement("span");
        arrow.className = "menu-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = ">";
        parentLink.appendChild(arrow);

        const nestedMenu = document.createElement("div");
        nestedMenu.className = "nested-submenu";
        subfield.children.forEach((child) => {
          nestedMenu.appendChild(createMenuLink(category.slug, child));
        });

        group.appendChild(parentLink);
        group.appendChild(nestedMenu);
        submenu.appendChild(group);
      });

      card.appendChild(submenu);
      categoryMenu.appendChild(card);
    });
  }

  function createMenuLink(categorySlug, subfield) {
    const link = document.createElement("button");
    link.className = "menu-link";
    link.type = "button";
    link.textContent = subfield.label;
    if (state.filter.category === categorySlug && state.filter.subfield === subfield.value) {
      link.classList.add("active");
    }
    link.addEventListener("click", () => applyFilter(categorySlug, subfield.value));
    return link;
  }

  function renderLabResearchPanel() {
    if (!labResearchPanel) {
      return;
    }

    const researchCategory = store.categoryDefinitions.find((item) => item.slug === "research");
    if (!researchCategory || state.filter.category !== "research") {
      labResearchPanel.hidden = true;
      labResearchPanel.innerHTML = "";
      return;
    }

    labResearchPanel.hidden = false;
    labResearchPanel.innerHTML = "";

    const rail = document.createElement("div");
    rail.className = "lab-filter-rail";

    const filters = [
      { label: "All", value: "" },
      ...store.getSubfieldOptions(researchCategory).map((item) => ({
        label: item.label,
        value: item.value,
      })),
    ];

    filters.forEach((item) => {
      const button = document.createElement("button");
      button.className = "lab-filter-chip";
      button.type = "button";
      button.textContent = item.label;
      if (state.filter.subfield === item.value) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => applyFilter("research", item.value));
      rail.appendChild(button);
    });

    labResearchPanel.appendChild(rail);
  }

  function renderFilterChips() {
    if (!filterChips) {
      return;
    }

    filterChips.innerHTML = "";

    const chips = [
      { label: "All", category: "all", subfield: "" },
      ...store.categoryDefinitions.map((category) => ({
        label: category.label,
        category: category.slug,
        subfield: "",
      })),
    ];

    chips.forEach((item) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = item.label;
      if (state.filter.category === item.category && state.filter.subfield === item.subfield) {
        chip.classList.add("active");
      }
      chip.addEventListener("click", () => applyFilter(item.category, item.subfield));
      filterChips.appendChild(chip);
    });
  }

  function renderPortfolioMap() {
    if (!portfolioMap) {
      return;
    }

    portfolioMap.innerHTML = "";
    const header = document.createElement("div");
    header.className = "portfolio-map-header";
    header.innerHTML = `
      <div>
        <p class="kicker">Portfolio Map</p>
        <h3>Explore the work as a technical story.</h3>
      </div>
      <p class="section-copy">A recruiter-friendly overview that connects project families, evidence, and interview talking points without hiding the actual project cards.</p>
    `;

    const track = document.createElement("div");
    track.className = "portfolio-map-track";
    store.categoryDefinitions.forEach((category, index) => {
      const projects = state.projects.filter((project) => project.category === category.slug);
      const node = document.createElement("button");
      node.className = "portfolio-map-node";
      if (state.filter.category === category.slug) {
        node.classList.add("active");
      }
      node.type = "button";
      node.style.setProperty("--node-index", index);
      const indexLabel = document.createElement("span");
      indexLabel.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("strong");
      title.textContent = category.label;
      const count = document.createElement("small");
      count.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"}`;
      node.appendChild(indexLabel);
      node.appendChild(title);
      node.appendChild(count);
      node.addEventListener("click", () => applyFilter(category.slug));
      track.appendChild(node);
    });

    const featured = document.createElement("div");
    featured.className = "portfolio-map-featured";
    const featuredProjects = (state.filter.category
      ? state.projects.filter((project) => project.category === state.filter.category)
      : state.projects
    ).slice(0, 4);
    featuredProjects.forEach((project) => {
      const card = document.createElement("button");
      card.className = "portfolio-map-card";
      card.type = "button";
      card.style.setProperty("--image-url", `url('${project.coverImage}')`);
      const categoryLabel = document.createElement("span");
      categoryLabel.textContent = project.categoryLabel;
      const projectTitle = document.createElement("strong");
      projectTitle.textContent = project.title;
      card.appendChild(categoryLabel);
      card.appendChild(projectTitle);
      card.addEventListener("click", () => openProjectModal(project));
      featured.appendChild(card);
    });

    portfolioMap.appendChild(header);
    portfolioMap.appendChild(track);
    portfolioMap.appendChild(featured);
  }

  function buildTag(tagText) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    return tag;
  }

  function openProjectModal(project) {
    const subfieldLabel = store.getSubfieldDisplay(project.category, project.subfield);
    document.getElementById("modalKicker").textContent = `${project.categoryLabel} | ${subfieldLabel}`;
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.details;

    const modalImage = document.getElementById("modalImage");
    modalImage.style.setProperty(
      "--image-url",
      `linear-gradient(135deg, rgba(33, 57, 94, 0.55), rgba(7, 12, 20, 0.55)), url('${project.coverImage}')`
    );

    const modalTags = document.getElementById("modalTags");
    modalTags.innerHTML = "";
    project.tags.forEach((tag) => modalTags.appendChild(buildTag(tag)));

    const modalAcronyms = document.getElementById("modalAcronyms");
    if (modalAcronyms) {
      modalAcronyms.innerHTML = "";
      (project.acronyms || []).forEach((item) => {
        const row = document.createElement("span");
        row.className = "acronym-pill";
        row.textContent = `${item.acronym}: ${item.meaning}`;
        modalAcronyms.appendChild(row);
      });
    }

    const modalGallery = document.getElementById("modalGallery");
    modalGallery.innerHTML = "";
    project.gallery.forEach((image) => {
      const thumb = document.createElement("div");
      thumb.className = "gallery-thumb";
      thumb.style.setProperty(
        "--image-url",
        `linear-gradient(135deg, rgba(33, 57, 94, 0.5), rgba(7, 12, 20, 0.45)), url('${image}')`
      );
      modalGallery.appendChild(thumb);
    });

    const modalRequestLink = document.getElementById("modalRequestLink");
    if (modalRequestLink) {
      modalRequestLink.href = `request.html?project=${encodeURIComponent(project.title)}`;
    }

    projectModal.showModal();
  }

  function projectMatchesFilter(project) {
    if (state.filter.category === "all") {
      return true;
    }

    if (project.category !== state.filter.category) {
      return false;
    }

    if (!state.filter.subfield) {
      return true;
    }

    return store.isSubfieldMatch(project.subfield, state.filter.subfield);
  }

  function renderProjectGrid() {
    if (!projectGrid) {
      return;
    }

    const template = document.getElementById("projectCardTemplate");
    projectGrid.innerHTML = "";

    const filteredProjects = state.projects.filter(projectMatchesFilter);

    if (!filteredProjects.length) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <h3>No projects match this filter yet.</h3>
        <p>Add one in the admin page or clear the filter to view all work.</p>
      `;
      projectGrid.appendChild(emptyState);
      return;
    }

    filteredProjects.forEach((project) => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.querySelector(".project-image").style.setProperty(
        "--image-url",
        `linear-gradient(135deg, rgba(33, 57, 94, 0.48), rgba(7, 12, 20, 0.48)), url('${project.coverImage}')`
      );
      node.querySelector(".project-type").textContent = project.type;
      node.querySelector(".project-title").textContent = project.title;
      node.querySelector(".project-summary").textContent = project.shortSummary;

      const tagList = node.querySelector(".tag-list");
      [project.categoryLabel, store.getSubfieldDisplay(project.category, project.subfield), ...project.tags.slice(0, 2)].forEach((tag) => {
        tagList.appendChild(buildTag(tag));
      });

      node.querySelector(".project-more").addEventListener("click", () => openProjectModal(project));
      projectGrid.appendChild(node);
    });
  }

  function unlockRequestFields() {
    if (!requestForm) {
      return;
    }

    syncNameValidity(firstNameInput, "first name");
    syncNameValidity(lastNameInput, "last name");

    const hasFirstName = isCompleteName(firstNameInput.value);
    const hasLastName = isCompleteName(lastNameInput.value);
    const hasEmail = isValidWorkEmailFormat(emailInput.value);
    const hasField = Boolean(fieldSelect.value);
    const hasInstitution = Boolean(institutionInput.value.trim());

    lastNameInput.disabled = !hasFirstName;
    emailInput.disabled = !hasLastName;
    fieldSelect.disabled = !hasEmail;
    institutionInput.disabled = !fieldSelect.value;
    if (institutionInput.disabled) {
      setInstitutionSuggestionsOpen(false);
    }

    const readyToVerify =
      hasFirstName &&
      hasLastName &&
      hasEmail &&
      hasField &&
      hasInstitution;

    verifyButton.disabled = !readyToVerify;

    if (!readyToVerify && !state.verified) {
      if (!hasFirstName) {
        verificationStatus.textContent = "Enter your full first name to continue.";
      } else if (!hasLastName) {
        verificationStatus.textContent = "Enter your full last name to continue.";
      } else if (!hasEmail) {
        verificationStatus.textContent = "Enter an official company, lab, or institution email.";
      } else if (!hasField) {
        verificationStatus.textContent = "Select a field before choosing an organization.";
      } else {
        verificationStatus.textContent = "Start typing your company, lab, or institution name.";
      }
      verificationStatus.className = "helper-text";
    }
  }

  function isWorkEmail(email) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      return false;
    }
    const ownerEmails = [
      state.config.notificationEmail,
      state.config.ownerInstitutionEmail,
    ]
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean);
    if (ownerEmails.includes(trimmed)) {
      return true;
    }
    const domain = trimmed.split("@")[1];
    return !publicEmailDomains.includes(domain);
  }

  function runVerification() {
    if (!requestForm) {
      return;
    }

    const email = emailInput.value.trim();
    const institution = institutionInput.value.trim();

    if (!isWorkEmail(email)) {
      state.verified = false;
      postVerifyFields.hidden = true;
      verificationStatus.textContent = "Use an official company, lab, or institution email to continue.";
      verificationStatus.className = "helper-text error";
      return;
    }

    if (!institution) {
      state.verified = false;
      postVerifyFields.hidden = true;
      verificationStatus.textContent = "Enter a company, lab, or institution before verification.";
      verificationStatus.className = "helper-text error";
      return;
    }

    state.verified = true;
    postVerifyFields.hidden = false;
    const ownerEmails = [
      state.config.notificationEmail,
      state.config.ownerInstitutionEmail,
    ]
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean);
    const isOwnerDemo = ownerEmails.includes(email.toLowerCase());
    verificationStatus.textContent = isOwnerDemo
      ? "Owner demo verification successful. You can now submit a test portfolio request."
      : "Verification demo successful. You can now select a request purpose.";
    verificationStatus.className = "helper-text success";
    requestPurpose.disabled = false;
  }

  function syncSubmitState() {
    if (!requestForm) {
      return;
    }

    submitRequestButton.disabled = !(state.verified && requestPurpose.value);
  }

  async function handleRequestSubmit(event) {
    event.preventDefault();

    if (!state.verified || !requestPurpose.value) {
      return;
    }

    const payload = {
      id: `request-${Date.now()}`,
      createdAt: new Date().toISOString(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      workEmail: emailInput.value.trim(),
      engineeringField: fieldSelect.value,
      institution: institutionInput.value.trim(),
      purpose: requestPurpose.value,
      notes: document.getElementById("requestNotes").value.trim(),
    };

    let cloudSaved = false;
    if (isCloudConfigured()) {
      try {
        await cloud.addRequest(payload);
        cloudSaved = true;
      } catch (error) {
        console.warn("Cloud request save failed. Falling back to local request capture.", error);
      }
    }

    if (!cloudSaved) {
      store.addRequest(payload);
    }

    const subject = encodeURIComponent(`Portfolio Request from ${payload.firstName} ${payload.lastName}`);
    const body = encodeURIComponent(
      [
        `Name: ${payload.firstName} ${payload.lastName}`,
        `Work Email: ${payload.workEmail}`,
        `Field: ${payload.engineeringField}`,
        `Institution: ${payload.institution}`,
        `Purpose: ${payload.purpose}`,
        `Notes: ${payload.notes || "None"}`,
      ].join("\n")
    );

    const mailtoHref = `mailto:${state.config.notificationEmail}?subject=${subject}&body=${body}`;

    requestResult.hidden = false;
    requestResult.innerHTML = cloudSaved
      ? `
        <strong>Request submitted.</strong>
        <p>Your request was saved securely for review. You can also open an email draft if you want to send extra context.</p>
        <a class="button-secondary" href="${mailtoHref}">Open Email Draft</a>
      `
      : `
        <strong>Request captured locally.</strong>
        <p>
          Supabase is not configured or was unavailable, so this browser saved the request locally and opened a prefilled
          email draft to ${state.config.notificationEmail}.
        </p>
        <a class="button-secondary" href="${mailtoHref}">Open Email Draft</a>
      `;

    if (!cloudSaved) {
      window.location.href = mailtoHref;
    }
    requestForm.reset();
    state.verified = false;
    postVerifyFields.hidden = true;
    requestPurpose.disabled = true;
    verificationStatus.textContent = "Awaiting required fields.";
    verificationStatus.className = "helper-text";
    unlockRequestFields();
    syncSubmitState();
  }

  function attachRequestListeners() {
    if (
      !requestForm ||
      !firstNameInput ||
      !lastNameInput ||
      !emailInput ||
      !fieldSelect ||
      !institutionInput ||
      !institutionOptions ||
      !verifyButton ||
      !requestPurpose ||
      !submitRequestButton
    ) {
      return;
    }

    fieldSelect.addEventListener("change", () => {
      populateInstitutionSelect(fieldSelect.value);
    });

    institutionInput.addEventListener("input", () => {
      renderInstitutionSuggestions(institutionInput.value, true);
    });

    institutionInput.addEventListener("focus", () => {
      renderInstitutionSuggestions(institutionInput.value, true);
    });

    institutionInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setInstitutionSuggestionsOpen(false);
      }
    });

    document.addEventListener("mousedown", (event) => {
      if (institutionInput.contains(event.target) || institutionOptions.contains(event.target)) {
        return;
      }

      setInstitutionSuggestionsOpen(false);
    });

    window.addEventListener("resize", () => {
      if (!institutionOptions.hidden) {
        sizeInstitutionSuggestions();
      }
    });

    [firstNameInput, lastNameInput, emailInput, fieldSelect, institutionInput].forEach((element) => {
      element.addEventListener("input", unlockRequestFields);
      element.addEventListener("change", unlockRequestFields);
    });

    firstNameInput.addEventListener("invalid", () => syncNameValidity(firstNameInput, "first name"));
    lastNameInput.addEventListener("invalid", () => syncNameValidity(lastNameInput, "last name"));

    verifyButton.addEventListener("click", runVerification);
    requestPurpose.addEventListener("change", syncSubmitState);
    requestForm.addEventListener("submit", handleRequestSubmit);
  }

  function hydrateRequestContext() {
    if (!requestForm) {
      return;
    }

    const projectTitle = new URLSearchParams(window.location.search).get("project");
    if (!projectTitle) {
      return;
    }

    const contextNotice = document.getElementById("requestContextNotice");
    const requestNotes = document.getElementById("requestNotes");
    if (contextNotice) {
      contextNotice.hidden = false;
      contextNotice.textContent = `Request started from: ${projectTitle}`;
    }

    if (requestNotes && !requestNotes.value.trim()) {
      requestNotes.value = `Project interest: ${projectTitle}`;
    }
  }

  function attachGlobalListeners() {
    if (clearFiltersButton) {
      clearFiltersButton.addEventListener("click", () => applyFilter("all"));
    }

    if (closeModalButton) {
      closeModalButton.addEventListener("click", () => projectModal.close());
    }

    if (projectModal) {
      projectModal.addEventListener("click", (event) => {
      const rect = projectModal.getBoundingClientRect();
      const inDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!inDialog) {
        projectModal.close();
      }
      });
    }
  }

  function init() {
    setHeroConfig();
    populateRequestSelects();
    renderHeroPortrait();
    renderCategoryMenu();
    renderLabResearchPanel();
    renderFilterChips();
    renderPortfolioMap();
    renderProjectGrid();
    updateActiveFilterBanner();
    attachRequestListeners();
    hydrateRequestContext();
    attachGlobalListeners();
    unlockRequestFields();
    if (requestPurpose) {
      requestPurpose.disabled = true;
    }
  }

  init();
  hydrateCloudData();
})();
