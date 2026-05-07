(function () {
  const STORAGE_KEY = "portfolio-projects-v1";
  const REQUESTS_KEY = "portfolio-requests-v1";
  const CONFIG_KEY = "portfolio-config-v1";
  const RESUME_STUDIO_KEY = "portfolio-resume-studio-v1";

  const rocketrySubsystems = ["Mechanical/Structures", "Propulsion", "Fluids", "Avionics", "GNC"];
  const csulbInstitution = "California State University, Long Beach (CSULB) - (Long Beach, Los Angeles)";

  function sortUnique(items) {
    return [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  const categoryDefinitions = [
    {
      slug: "rocketry",
      label: "Rocketry",
      summary: "Launch systems, propulsion, structures, avionics, and GNC work.",
      subfields: [
        {
          label: "Beach Launch Team (BLT)",
          children: rocketrySubsystems,
        },
        {
          label: "SBDW",
          children: rocketrySubsystems,
        },
      ],
    },
    {
      slug: "uav-aircraft",
      label: "EV Formula / Drones / Aircraft",
      summary: "Vehicle body, airframe, chassis, CAD, simulation, and test-analysis work.",
      subfields: ["Airframe/Vehicle Body Design", "Chassis", "Aerodynamics", "Design Analysis", "Test Analysis"],
    },
    {
      slug: "research",
      label: "Research",
      summary: "Campus lab work, research documentation, datasets, posters, and technical reports.",
      subfields: ["Paper", "Thesis", "Lab Report", "Dataset", "Conference Poster", "Technical Report"],
    },
    {
      slug: "competitions",
      label: "Competitions",
      summary: "Team-based build challenges, startup competitions, and technical showcases.",
      subfields: ["LatinXTech Startup Competition", "Solar Regatta Boat Competition", "Design Challenges"],
    },
    {
      slug: "cad-projects",
      label: "CAD Projects",
      summary: "Mechanical design, assemblies, tolerancing, fixtures, and manufacturing prep.",
      subfields: ["Rig Design", "Structural Components", "Mounts and Fixtures", "Rapid Concepts"],
    },
    {
      slug: "hands-on-home-projects",
      label: "Hands-On Home Projects",
      summary: "Fabrication, repair, diagnostics, and applied problem-solving beyond the classroom.",
      subfields: [
        "Mechanical / Fabrication",
        "Interior Design / Fabrication",
        "Residential Systems",
        "Electronic Repair & Hardware Diagnostics",
      ],
    },
  ];

  const engineeringFields = [
    "Aerospace Engineering",
    "Biomedical Engineering",
    "Computer Engineering",
    "Data Science",
    "Electrical Engineering",
    "Manufacturing Engineering",
    "Mechanical Engineering",
    "Naval / Marine Engineering",
    "Research and Development",
    "Systems Engineering",
  ].sort((a, b) => a.localeCompare(b));

  const institutionGroups = {
    "Aerospace Engineering": [
      "ABL Space Systems - (Long Beach, Los Angeles)",
      "AeroVironment - (Monrovia, Los Angeles)",
      "Anduril Industries - (Costa Mesa, Los Angeles / Orange)",
      "Archer Aviation - (San Jose, Santa Clara)",
      "Astranis - (California Operations, Various Counties)",
      "Boeing Defense & Space - (El Segundo, Los Angeles)",
      "Blue Origin - (Los Angeles, Los Angeles)",
      csulbInstitution,
      "General Atomics Aeronautical Systems (GA-ASI) - (Poway, San Diego)",
      "Impulse Space - (California Operations, Various Counties)",
      "Joby Aviation - (Santa Cruz, Santa Cruz)",
      "Lockheed Martin Space - (Sunnyvale, Santa Clara)",
      "Millennium Space Systems (Boeing) - (El Segundo, Los Angeles)",
      "NASA Ames Research Center - (Moffett Field, Santa Clara)",
      "NASA Armstrong Flight Research Center - (Edwards, Kern)",
      "Jet Propulsion Laboratory (NASA) - (Pasadena, Los Angeles)",
      "Northrop Grumman - (Redondo Beach, Los Angeles)",
      "Planet Labs PBC - (San Francisco, San Francisco)",
      "Relativity Space - (Long Beach, Los Angeles)",
      "Rocket Lab USA - (Long Beach, Los Angeles)",
      "Sierra Space - (California Operations, Various Counties)",
      "Skydio - (Redwood City, San Mateo)",
      "SpaceX - (Hawthorne, Los Angeles)",
      "The Aerospace Corporation - (El Segundo, Los Angeles)",
      "Virgin Galactic (Mojave / Spaceport America) - (Mojave, Kern)",
      "Wisk Aero - (Mountain View, Santa Clara)",
    ],
    "Biomedical Engineering": [
      "Abbott",
      "Align Technology",
      "Amgen",
      "Applied Medical",
      "Becton Dickinson",
      "Bio-Rad Laboratories",
      csulbInstitution,
      "Dexcom",
      "Edwards Lifesciences",
      "Genentech",
      "Gilead Sciences",
      "Illumina",
      "Intuitive Surgical",
      "Medtronic",
      "Penumbra",
      "ResMed",
      "Thermo Fisher Scientific",
      "Varian Medical Systems",
    ],
    "Computer Engineering": [
      "Adobe",
      "Advanced Micro Devices",
      "Amazon Lab126",
      "Apple",
      "Broadcom",
      csulbInstitution,
      "Cisco",
      "Google",
      "Hewlett Packard Enterprise",
      "Intel",
      "Meta",
      "Microsoft",
      "NVIDIA",
      "Oracle",
      "Qualcomm",
      "Salesforce",
      "ServiceNow",
      "Tesla",
      "Western Digital",
    ],
    "Data Science": [
      "American Institutes for Research (AIR) - (Sacramento, Sacramento)",
    ],
    "Electrical Engineering": [
      "Advanced Micro Devices",
      "Analog Devices",
      "Apple",
      "Applied Materials",
      "Broadcom",
      csulbInstitution,
      "Cisco",
      "Intel",
      "KLA",
      "Lam Research",
      "Marvell Technology",
      "Maxim Integrated",
      "NVIDIA",
      "Qualcomm",
      "Skyworks Solutions",
      "Tesla",
      "Western Digital",
    ],
    "Manufacturing Engineering": [
      "Applied Materials",
      "Boeing Defense & Space - (El Segundo, Los Angeles)",
      "Divergent Technologies",
      "Edwards Lifesciences",
      "General Atomics Aeronautical Systems (GA-ASI) - (Poway, San Diego)",
      "Intuitive Surgical",
      "Lam Research",
      "Northrop Grumman - (Redondo Beach, Los Angeles)",
      "Relativity Space - (Long Beach, Los Angeles)",
      "Rivian",
      "Rocket Lab USA - (Long Beach, Los Angeles)",
      "SpaceX - (Hawthorne, Los Angeles)",
      "Tesla",
      "Virgin Galactic (Mojave / Spaceport America) - (Mojave, Kern)",
    ],
    "Mechanical Engineering": [
      "Applied Medical",
      "Boeing Defense & Space - (El Segundo, Los Angeles)",
      csulbInstitution,
      "Divergent Technologies",
      "Edwards Lifesciences",
      "General Atomics Aeronautical Systems (GA-ASI) - (Poway, San Diego)",
      "Intuitive Surgical",
      "Joby Aviation - (Santa Cruz, Santa Cruz)",
      "Lockheed Martin Space - (Sunnyvale, Santa Clara)",
      "Northrop Grumman - (Redondo Beach, Los Angeles)",
      "Relativity Space - (Long Beach, Los Angeles)",
      "Rivian",
      "Rocket Lab USA - (Long Beach, Los Angeles)",
      "SpaceX - (Hawthorne, Los Angeles)",
      "Tesla",
      "Virgin Galactic (Mojave / Spaceport America) - (Mojave, Kern)",
    ],
    "Naval / Marine Engineering": [
      "General Dynamics NASSCO",
      "Maritime Applied Physics Corporation",
      "Naval Information Warfare Center Pacific",
      "Naval Postgraduate School",
      "Naval Surface Warfare Center Corona Division",
      "Naval Surface Warfare Center Port Hueneme Division",
      "Scripps Institution of Oceanography",
    ],
    "Research and Development": [
      "Caltech (GALCIT) - (Pasadena, Los Angeles)",
      csulbInstitution,
      "Lawrence Berkeley National Laboratory",
      "Lawrence Livermore National Laboratory",
      "NASA Ames Research Center - (Moffett Field, Santa Clara)",
      "NASA Armstrong Flight Research Center - (Edwards, Kern)",
      "Jet Propulsion Laboratory (NASA) - (Pasadena, Los Angeles)",
      "Sandia National Laboratories California",
      "SLAC National Accelerator Laboratory - (Menlo Park, San Mateo)",
      "Stanford University Aero Labs - (Stanford, Santa Clara)",
      "The Aerospace Corporation - (El Segundo, Los Angeles)",
      "UC Berkeley Aerospace (Research) - (Berkeley, Alameda)",
      "UC Irvine",
      "UC San Diego Jacobs School (Aero Res) - (San Diego, San Diego)",
      "UCLA Henry Samueli Engineering (Aero) - (Los Angeles, Los Angeles)",
      "USC Viterbi (Aerospace Department, Research) - (Los Angeles, Los Angeles)",
    ],
    "Systems Engineering": [
      "Anduril Industries - (Costa Mesa, Los Angeles / Orange)",
      "Boeing Defense & Space - (El Segundo, Los Angeles)",
      "General Atomics Aeronautical Systems (GA-ASI) - (Poway, San Diego)",
      "Lockheed Martin Space - (Sunnyvale, Santa Clara)",
      "Jet Propulsion Laboratory (NASA) - (Pasadena, Los Angeles)",
      "Northrop Grumman - (Redondo Beach, Los Angeles)",
      "Raytheon Technologies (RTX, Space & Airborne) - (El Segundo, Los Angeles)",
      "Rocket Lab USA - (Long Beach, Los Angeles)",
      "SpaceX - (Hawthorne, Los Angeles)",
      "The Aerospace Corporation - (El Segundo, Los Angeles)",
      "Virgin Galactic (Mojave / Spaceport America) - (Mojave, Kern)",
    ],
  };

  const institutions = sortUnique(Object.values(institutionGroups).flat());

  const projectTypes = [
    "CAD / Fabrication",
    "Campus Lab Research",
    "Competition",
    "Design Analysis",
    "EV Formula Team",
    "Hands-On Technical Work",
    "Manufacturing / Build",
    "Research",
    "Student Team",
    "Test Analysis",
  ];

  const defaultConfig = {
    ownerName: "Sumit Singh",
    school: "CSULB",
    classYear: "2027",
    notificationEmail: "SumitSingh220@outlook.com",
    ownerInstitutionEmail: "Sumit.Singh-SA@csulb.edu",
  };

  const defaultResumeStudio = {
    masterResume: {
      fileName: "",
      content: "",
      updatedAt: "",
    },
    packets: [],
  };

  const seedProjects = [
    {
      id: "proj-1",
      title: "Poly Tank Motor Rig",
      category: "cad-projects",
      categoryLabel: "CAD Projects",
      subfield: "Rig Design",
      type: "CAD / Fabrication",
      shortSummary: "A poly tank motor rig developed around practical fit, support, and fabrication constraints.",
      description: "CAD-driven rig design work focused on geometry, mounting strategy, access, and build readiness.",
      details: "The work began with a need for a functional motor rig that could be represented clearly in CAD and prepared for practical fabrication. I translated the physical constraints into a structured rig layout, refined mounting and support geometry, and used the model to communicate fit, access, and manufacturability decisions. The finished project demonstrates practical design judgment, assembly thinking, and an ability to turn a rough mechanical need into a usable engineering layout.",
      tags: ["CAD", "Rig Design", "Fabrication", "Mechanical Design"],
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #223b63, #0f1828)",
    },
    {
      id: "proj-2",
      title: "Beach Launch Team (BLT) Rocket Systems",
      category: "rocketry",
      categoryLabel: "Rocketry",
      subfield: "Beach Launch Team (BLT)",
      type: "Student Team",
      shortSummary: "Rocketry team work across structures, propulsion, fluids, GNC, and avionics on liquid-oxygen launch systems.",
      description: "Beach Launch Team builds liquid-oxygen rocket systems, requiring close coordination across mechanical, fluid, control, and electronics disciplines.",
      details: "Beach Launch Team work required a systems mindset because the rocket depends on structures, propulsion, fluids, GNC, and avionics operating together. I contributed across those subsystem discussions and tasks, connecting mechanical layout choices with propellant handling, integration requirements, control needs, and launch-readiness thinking. The experience strengthened my ability to work in a multidisciplinary engineering environment where every design decision has downstream effects on build, test, safety, and operations.",
      tags: ["Liquid Oxygen", "Structures", "Propulsion", "Fluids", "GNC", "Avionics"],
      coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #1f3558, #0a0f17)",
    },
    {
      id: "proj-3",
      title: "Formula SAE EV Bodywork and Chassis Integration",
      category: "uav-aircraft",
      categoryLabel: "EV Formula / Drones / Aircraft",
      subfield: "Airframe/Vehicle Body Design",
      type: "EV Formula Team",
      shortSummary: "Formula SAE EV work using CAD and ANSYS to shape bodywork around chassis constraints.",
      description: "Formula Society of Automotive Engineers work connecting chassis packaging, aerodynamics, CAD iteration, and test analysis.",
      details: "The Formula SAE EV work starts with chassis and aerodynamic constraints that have to become manufacturable bodywork. I used CAD and ANSYS-centered design discussion to explore sheet-metal and body-panel choices around the chassis, then evaluated how those choices affected fit, packaging, and test-analysis decisions. The project shows how design intent becomes an engineering conversation: model the concept, test the assumptions, edit the geometry, and bring the team toward a cleaner build direction.",
      tags: ["FSAE", "Chassis", "Aerodynamics", "CAD", "ANSYS", "Design Analysis", "Test Analysis"],
      coverImage: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #1a304f, #0d1727)",
    },
    {
      id: "proj-4",
      title: "Sustainable Thermal Energetics using Advanced Materials & Imaging (STEAM-I)",
      category: "research",
      categoryLabel: "Research",
      subfield: "Lab Report",
      type: "Campus Lab Research",
      shortSummary: "CSULB lab research centered on sustainable thermal energetics, advanced materials, and imaging.",
      description: "Campus research lab work combining experimental thinking, materials-focused investigation, imaging, and documentation.",
      details: "The STEAM-I research environment at CSULB connects sustainable thermal energetics with advanced materials and imaging methods. My work is organized as lab research rather than a single aeronautics topic, emphasizing careful documentation, experimental context, data interpretation, and communication of technical findings. This portfolio section is designed to hold lab reports, datasets, posters, papers, and technical reports as the research record develops.",
      tags: ["STEAM-I", "CSULB", "Advanced Materials", "Imaging", "Thermal Energetics"],
      coverImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #1d3554, #111926)",
    },
    {
      id: "proj-7",
      title: "Ratchet Design for General Aviation Aircraft Engine Overhaul",
      category: "cad-projects",
      categoryLabel: "CAD Projects",
      subfield: "Mounts and Fixtures",
      type: "CAD / Fabrication",
      shortSummary: "A ratchet design concept supporting overhaul workflows for general aviation aircraft engines.",
      description: "CAD work focused on serviceability, tooling access, and practical mechanical use around engine maintenance constraints.",
      details: "The ratchet design was framed around the practical reality of general aviation aircraft engine overhaul work, where tool access, reliability, and repeatable handling matter. I approached the design by considering how a technician would engage with the mechanism during maintenance, then translated those needs into CAD geometry and fixture-minded decisions. The project demonstrates mechanical reasoning, service-oriented design, and the ability to connect tooling concepts to aerospace maintenance environments.",
      tags: ["CAD", "Ratchet Design", "General Aviation", "Engine Overhaul", "Mounts and Fixtures"],
      coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #203251, #0d1727)",
    },
    {
      id: "proj-8",
      title: "Quad-Copter with Batman Wings (QC W C W)",
      category: "uav-aircraft",
      categoryLabel: "EV Formula / Drones / Aircraft",
      subfield: "Airframe/Vehicle Body Design",
      type: "Design Analysis",
      shortSummary: "A quad-copter body design concept using wing-inspired geometry and airframe packaging decisions.",
      description: "A vehicle-body and airframe concept that keeps the category flexible for drones, cars, motorcycles, and aircraft going forward.",
      details: "The quad-copter concept explores how visual identity and airframe packaging can coexist in a small aerial vehicle. The design work is organized under Airframe/Vehicle Body Design so future vehicle projects can live in the same system whether they are aircraft, drones, cars, or motorcycles. The project can capture CAD iterations, bodywork decisions, analysis notes, and design-test revisions as the concept develops.",
      tags: ["Quad-Copter", "Airframe", "Vehicle Body Design", "CAD", "Design Analysis"],
      coverImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #1a304f, #0d1727)",
    },
    {
      id: "proj-5",
      title: "LatinXTech Startup Competition Concept",
      category: "competitions",
      categoryLabel: "Competitions",
      subfield: "LatinXTech Startup Competition",
      type: "Competition",
      shortSummary: "Showcased technical communication, design framing, and competitive presentation under constraints.",
      description: "Useful for presenting innovation-driven work with business context, technical scope, and team impact.",
      details: "Competition entries often need a different tone from pure engineering documentation. This site supports that by letting you keep the category consistent while tailoring each project's detail section around challenge framing, design value, and measurable outcomes.",
      tags: ["Competition", "Pitching", "Engineering Concept", "Teamwork"],
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #203251, #0c121d)",
    },
    {
      id: "proj-6",
      title: "Residential Systems Diagnostic Build",
      category: "hands-on-home-projects",
      categoryLabel: "Hands-On Home Projects",
      subfield: "Electronic Repair & Hardware Diagnostics",
      type: "Hands-On Technical Work",
      shortSummary: "Practical troubleshooting and applied repair work that demonstrates engineering intuition outside class.",
      description: "A place to present hands-on home and field builds that still speak to technical maturity and problem solving.",
      details: "Not every important project happens inside a formal lab or aerospace organization. This category is for work that demonstrates diagnosis, fabrication, mechanical sense, or systems troubleshooting in practical real-world settings.",
      tags: ["Diagnostics", "Repair", "Applied Skills", "Systems Thinking"],
      coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      ],
      fallback: "linear-gradient(135deg, #24395e, #0b1422)",
    },
  ];

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function canonicalizeSubfield(value = "") {
    return String(value).replace(/^SBDW Rocket(?= \/|$)/, "SBDW");
  }

  function canonicalizeResearchSubfield(value = "") {
    const normalized = canonicalizeSubfield(value);
    const legacyResearchMap = {
      Aerodynamics: "Lab Report",
      "Propulsion Research": "Paper",
      Materials: "Dataset",
      "Systems Validation": "Technical Report",
    };

    return legacyResearchMap[normalized] || normalized;
  }

  function normalizeSubfieldEntry(entry, parentValue = "") {
    if (typeof entry === "string") {
      const value = parentValue ? `${parentValue} / ${entry}` : entry;
      return {
        label: entry,
        value,
        children: [],
      };
    }

    const label = entry.label;
    const value = entry.value || (parentValue ? `${parentValue} / ${label}` : label);
    return {
      label,
      value,
      children: (entry.children || []).map((child) => normalizeSubfieldEntry(child, value)),
    };
  }

  function getCategoryDefinition(categoryOrSlug) {
    if (typeof categoryOrSlug === "string") {
      return categoryDefinitions.find((item) => item.slug === categoryOrSlug);
    }

    return categoryOrSlug;
  }

  function getSubfieldTree(categoryOrSlug) {
    const category = getCategoryDefinition(categoryOrSlug);
    return category ? category.subfields.map((entry) => normalizeSubfieldEntry(entry)) : [];
  }

  function getSubfieldOptions(categoryOrSlug) {
    const options = [];

    getSubfieldTree(categoryOrSlug).forEach((subfield) => {
      options.push({
        ...subfield,
        depth: 0,
        parentLabel: "",
      });

      subfield.children.forEach((child) => {
        options.push({
          ...child,
          depth: 1,
          parentLabel: subfield.label,
        });
      });
    });

    return options;
  }

  function getSubfieldDisplay(categoryOrSlug, value) {
    const normalizedValue = canonicalizeSubfield(value);
    const option = getSubfieldOptions(categoryOrSlug).find((item) => item.value === normalizedValue);

    if (!option) {
      return normalizedValue;
    }

    return option.parentLabel ? `${option.parentLabel} - ${option.label}` : option.label;
  }

  function isSubfieldMatch(projectSubfield, filterSubfield) {
    const projectValue = canonicalizeSubfield(projectSubfield);
    const filterValue = canonicalizeSubfield(filterSubfield);
    return projectValue === filterValue || projectValue.startsWith(`${filterValue} / `);
  }

  function getInstitutionsForField(field) {
    const fieldInstitutions = institutionGroups[field] || [];

    if (field === "Aerospace Engineering" && Array.isArray(window.CaliforniaAerospaceCompanies)) {
      return sortUnique([...fieldInstitutions, ...window.CaliforniaAerospaceCompanies]);
    }

    if (!field || !fieldInstitutions.length) {
      return institutions;
    }

    return sortUnique(fieldInstitutions);
  }

  function buildPortfolioNarrative(project) {
    const title = project.title || "Untitled Project";
    const categoryLabel = project.categoryLabel || project.category;
    const subfieldLabel = getSubfieldDisplay(project.category, project.subfield);
    const tags = Array.isArray(project.tags) && project.tags.length ? project.tags.join(", ") : "technical execution";
    const shortSummary = project.shortSummary || "structured technical work";
    const description = project.description || "The project is documented as a technical portfolio entry.";
    const details = project.details || "Additional implementation details can be added as the project record grows.";
    return [
      `${title} belongs to ${categoryLabel}, with the work centered on ${subfieldLabel}. ${description}`,
      `The engineering need called for a clear technical path from constraints to execution. The work required organizing the problem, identifying the design or research priorities, and keeping the project grounded in practical evidence rather than presentation alone.`,
      `My contribution focused on ${shortSummary.charAt(0).toLowerCase()}${shortSummary.slice(1)} The supporting work connects ${tags} with the decisions documented in the project record.`,
      `${details} The completed portfolio entry is written to support an industry panel conversation: what problem was being solved, what responsibilities mattered, what technical choices were made, and what value the work created.`,
    ].join("\n\n");
  }

  function sortGalleryForProject(gallery, project = {}) {
    if (!Array.isArray(gallery)) {
      return [];
    }

    const sequence = [
      ["schematic", "concept", "design", "plan", "sketch", "cad"],
      ["site", "area", "space", "layout", "ground"],
      ["measure", "mark", "dimension", "tape"],
      ["dig", "hole", "excavate", "post-hole"],
      ["cement", "concrete", "post", "level", "dry"],
      ["pipe", "bar", "pullup", "dip", "assemble", "connect"],
      ["floor", "clean", "mat", "surface"],
      ["paint", "finish", "final", "complete"],
    ];

    const projectText = `${project.title || ""} ${project.description || ""} ${project.details || ""}`.toLowerCase();
    const isBuildSequence = /build|fabrication|mechanical|gym|cement|pipe|post|floor|paint/.test(projectText);

    return [...gallery].sort((a, b) => {
      const score = (item) => {
        const text = String(item).toLowerCase();
        const matchIndex = sequence.findIndex((group) => group.some((word) => text.includes(word)));
        if (matchIndex >= 0) {
          return matchIndex;
        }
        return isBuildSequence ? sequence.length : 0;
      };

      return score(a) - score(b);
    });
  }

  function normalizeProject(project) {
    const categoryMeta = categoryDefinitions.find((item) => item.slug === project.category);
    const subfield = project.category === "research"
      ? canonicalizeResearchSubfield(project.subfield)
      : canonicalizeSubfield(project.subfield);

    return {
      ...project,
      categoryLabel: categoryMeta ? categoryMeta.label : project.categoryLabel || project.category,
      subfield,
      portfolioNarrative: project.portfolioNarrative || buildPortfolioNarrative({ ...project, categoryLabel: categoryMeta ? categoryMeta.label : project.categoryLabel || project.category, subfield }),
      tags: Array.isArray(project.tags) ? project.tags : [],
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      fallback: project.fallback || "linear-gradient(135deg, #233a61, #0e1624)",
    };
  }

  function getProjects() {
    const saved = readJson(STORAGE_KEY, null);
    if (!saved || !saved.length) {
      writeJson(STORAGE_KEY, seedProjects);
      return seedProjects.map(normalizeProject);
    }
    const refreshedProjects = mergeSeedProjects(saved);
    writeJson(STORAGE_KEY, refreshedProjects);
    return refreshedProjects.map(normalizeProject);
  }

  function mergeSeedProjects(projects) {
    const seedById = new Map(seedProjects.map((project) => [project.id, project]));
    const refreshed = projects.map((project) => {
      if (project.seedManaged === false || !seedById.has(project.id)) {
        return project;
      }

      return seedById.get(project.id);
    });
    const existingIds = new Set(refreshed.map((project) => project.id));
    seedProjects.forEach((project) => {
      if (!existingIds.has(project.id)) {
        refreshed.push(project);
      }
    });
    return refreshed;
  }

  function saveProjects(projects) {
    writeJson(STORAGE_KEY, projects);
  }

  function getRequests() {
    return readJson(REQUESTS_KEY, []);
  }

  function saveRequests(requests) {
    writeJson(REQUESTS_KEY, requests);
  }

  function addRequest(request) {
    const requests = getRequests();
    requests.unshift(request);
    writeJson(REQUESTS_KEY, requests);
  }

  function getConfig() {
    const saved = readJson(CONFIG_KEY, null);
    if (!saved) {
      writeJson(CONFIG_KEY, defaultConfig);
      return { ...defaultConfig };
    }
    return { ...defaultConfig, ...saved };
  }

  function saveConfig(config) {
    writeJson(CONFIG_KEY, config);
  }

  function normalizeResumeStudio(studio) {
    return {
      ...defaultResumeStudio,
      ...studio,
      masterResume: {
        ...defaultResumeStudio.masterResume,
        ...(studio && studio.masterResume ? studio.masterResume : {}),
      },
      packets: Array.isArray(studio && studio.packets) ? studio.packets : [],
    };
  }

  function getResumeStudio() {
    return normalizeResumeStudio(readJson(RESUME_STUDIO_KEY, defaultResumeStudio));
  }

  function saveResumeStudio(studio) {
    writeJson(RESUME_STUDIO_KEY, normalizeResumeStudio(studio));
  }

  function saveMasterResume(masterResume) {
    const studio = getResumeStudio();
    saveResumeStudio({
      ...studio,
      masterResume: {
        ...studio.masterResume,
        ...masterResume,
      },
    });
  }

  function addResumePacket(packet) {
    const studio = getResumeStudio();
    const packets = [packet, ...studio.packets].slice(0, 12);
    saveResumeStudio({
      ...studio,
      packets,
    });
  }

  function resetDemoData() {
    writeJson(STORAGE_KEY, seedProjects);
    writeJson(REQUESTS_KEY, []);
    writeJson(CONFIG_KEY, defaultConfig);
  }

  window.PortfolioStore = {
    STORAGE_KEY,
    RESUME_STUDIO_KEY,
    categoryDefinitions,
    engineeringFields,
    projectTypes,
    institutionGroups,
    institutions,
    getInstitutionsForField,
    getSubfieldTree,
    getSubfieldOptions,
    getSubfieldDisplay,
    isSubfieldMatch,
    buildPortfolioNarrative,
    sortGalleryForProject,
    normalizeProject,
    getProjects,
    saveProjects,
    getRequests,
    saveRequests,
    addRequest,
    getConfig,
    saveConfig,
    getResumeStudio,
    saveResumeStudio,
    saveMasterResume,
    addResumePacket,
    resetDemoData,
  };
})();
