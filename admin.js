(function () {
  const store = window.PortfolioStore;
  const cloud = window.PortfolioCloud;
  const summaryCards = document.getElementById("summaryCards");
  const configForm = document.getElementById("configForm");
  const projectForm = document.getElementById("projectForm");
  const projectCategory = document.getElementById("projectCategory");
  const projectSubfield = document.getElementById("projectSubfield");
  const projectType = document.getElementById("projectType");
  const projectCoverImage = document.getElementById("projectCoverImage");
  const projectCoverUpload = document.getElementById("projectCoverUpload");
  const projectCoverUploadStatus = document.getElementById("projectCoverUploadStatus");
  const projectGallery = document.getElementById("projectGallery");
  const projectGalleryUpload = document.getElementById("projectGalleryUpload");
  const projectGalleryUploadStatus = document.getElementById("projectGalleryUploadStatus");
  const projectCoverPreviewImage = document.getElementById("projectCoverPreviewImage");
  const projectMediaPreviewTitle = document.getElementById("projectMediaPreviewTitle");
  const projectMediaPreviewMeta = document.getElementById("projectMediaPreviewMeta");
  const projectGalleryPreview = document.getElementById("projectGalleryPreview");
  const projectAdminList = document.getElementById("projectAdminList");
  const requestCardList = document.getElementById("requestCardList");
  const resetDataButton = document.getElementById("resetDataButton");
  const newProjectButton = document.getElementById("newProjectButton");
  const suggestGalleryOrderButton = document.getElementById("suggestGalleryOrderButton");
  const reviewGalleryOrderButton = document.getElementById("reviewGalleryOrderButton");
  const galleryOrderList = document.getElementById("galleryOrderList");
  const galleryReviewDialog = document.getElementById("galleryReviewDialog");
  const galleryReviewList = document.getElementById("galleryReviewList");
  const closeGalleryReview = document.getElementById("closeGalleryReview");
  const cancelGalleryReview = document.getElementById("cancelGalleryReview");
  const applyGalleryReview = document.getElementById("applyGalleryReview");
  const masterResumeForm = document.getElementById("masterResumeForm");
  const masterResumeFile = document.getElementById("masterResumeFile");
  const masterResumeText = document.getElementById("masterResumeText");
  const masterResumeStatus = document.getElementById("masterResumeStatus");
  const clearMasterResumeButton = document.getElementById("clearMasterResumeButton");
  const resumeOpportunityForm = document.getElementById("resumeOpportunityForm");
  const resumeEngineeringField = document.getElementById("resumeEngineeringField");
  const clearOpportunityButton = document.getElementById("clearOpportunityButton");
  const resumeScoreboard = document.getElementById("resumeScoreboard");
  const resumeKeywordStrip = document.getElementById("resumeKeywordStrip");
  const tailoredResumeOutput = document.getElementById("tailoredResumeOutput");
  const coverLetterOutput = document.getElementById("coverLetterOutput");
  const portfolioFocusOutput = document.getElementById("portfolioFocusOutput");
  const printResumePacketButton = document.getElementById("printResumePacketButton");
  const resumeHistoryList = document.getElementById("resumeHistoryList");
  const cloudAdminEmail = document.getElementById("cloudAdminEmail");
  const cloudAdminPassword = document.getElementById("cloudAdminPassword");
  const cloudSignInButton = document.getElementById("cloudSignInButton");
  const cloudSignOutButton = document.getElementById("cloudSignOutButton");
  const cloudPullButton = document.getElementById("cloudPullButton");
  const cloudPushButton = document.getElementById("cloudPushButton");
  const cloudSyncStatus = document.getElementById("cloudSyncStatus");
  let reviewGalleryItems = [];
  let uploadedResumeFileName = "";
  const maxUploadedImageWidth = 1800;
  const maxUploadedImageHeight = 1400;
  const uploadedImageQuality = 0.82;

  const keywordStopWords = new Set([
    "about",
    "after",
    "also",
    "and",
    "are",
    "based",
    "been",
    "being",
    "candidate",
    "candidates",
    "can",
    "company",
    "degree",
    "description",
    "duties",
    "engineer",
    "engineering",
    "experience",
    "for",
    "from",
    "have",
    "including",
    "intern",
    "internship",
    "into",
    "job",
    "more",
    "must",
    "our",
    "preferred",
    "qualifications",
    "required",
    "requirements",
    "responsibilities",
    "role",
    "should",
    "skills",
    "team",
    "that",
    "the",
    "their",
    "this",
    "through",
    "using",
    "will",
    "with",
    "work",
    "you",
    "your",
  ]);

  function loadState() {
    return {
      projects: store.getProjects(),
      requests: store.getRequests(),
      config: store.getConfig(),
      resumeStudio: store.getResumeStudio(),
    };
  }

  function isCloudConfigured() {
    return Boolean(cloud && cloud.isConfigured && cloud.isConfigured());
  }

  function setCloudStatus(message, tone = "") {
    if (!cloudSyncStatus) {
      return;
    }
    cloudSyncStatus.textContent = message;
    cloudSyncStatus.className = `cloud-status-pill${tone ? ` ${tone}` : ""}`;
  }

  async function getCloudSession() {
    if (!isCloudConfigured()) {
      return null;
    }
    return cloud.getSession();
  }

  async function refreshCloudStatus() {
    if (!isCloudConfigured()) {
      setCloudStatus("Supabase is not configured yet. Add your URL and anon key in supabase-config.js.");
      return;
    }

    try {
      const session = await getCloudSession();
      setCloudStatus(
        session ? `Signed in as ${session.user.email}. Local saves will sync to Supabase.` : "Supabase configured. Sign in to sync admin edits.",
        session ? "success" : ""
      );
    } catch (error) {
      setCloudStatus("Could not check Supabase session.");
    }
  }

  async function syncProjectsToCloud(projects) {
    try {
      const session = await getCloudSession();
      if (!session) {
        return;
      }
      await cloud.saveProjects(projects);
      setCloudStatus("Projects synced to Supabase.", "success");
    } catch (error) {
      setCloudStatus("Local save worked, but Supabase project sync failed.", "error");
    }
  }

  async function syncConfigToCloud(config) {
    try {
      const session = await getCloudSession();
      if (!session) {
        return;
      }
      await cloud.saveConfig(config);
      setCloudStatus("Portfolio settings synced to Supabase.", "success");
    } catch (error) {
      setCloudStatus("Local settings saved, but Supabase settings sync failed.", "error");
    }
  }

  async function signInToCloud() {
    if (!isCloudConfigured()) {
      setCloudStatus("Add your Supabase URL and anon key in supabase-config.js first.", "error");
      return;
    }

    const email = cloudAdminEmail.value.trim();
    const password = cloudAdminPassword.value;
    if (!email || !password) {
      setCloudStatus("Enter your Supabase admin email and password.", "error");
      return;
    }

    setCloudStatus("Signing in to Supabase...");
    try {
      await cloud.signIn(email, password);
      cloudAdminPassword.value = "";
      await refreshCloudStatus();
    } catch (error) {
      setCloudStatus("Supabase sign-in failed. Check the admin user and RLS setup.", "error");
    }
  }

  async function signOutOfCloud() {
    if (!isCloudConfigured()) {
      return;
    }
    try {
      await cloud.signOut();
      await refreshCloudStatus();
    } catch (error) {
      setCloudStatus("Could not sign out of Supabase.", "error");
    }
  }

  async function pushLocalDataToCloud() {
    try {
      const session = await getCloudSession();
      if (!session) {
        setCloudStatus("Sign in before pushing local data to Supabase.", "error");
        return;
      }
      await cloud.saveConfig(store.getConfig());
      await cloud.saveProjects(store.getProjects());
      setCloudStatus("Local projects and settings pushed to Supabase.", "success");
    } catch (error) {
      setCloudStatus("Push to Supabase failed. Check your policies and admin membership.", "error");
    }
  }

  async function pullCloudData() {
    try {
      const session = await getCloudSession();
      if (!session) {
        setCloudStatus("Sign in before pulling private admin data from Supabase.", "error");
        return;
      }

      const cloudState = await cloud.loadPublicState();
      if (cloudState && Array.isArray(cloudState.projects) && cloudState.projects.length) {
        store.saveProjects(cloudState.projects);
      }
      if (cloudState && cloudState.config) {
        store.saveConfig({ ...store.getConfig(), ...cloudState.config });
      }
      store.saveRequests(await cloud.getRequests());
      renderAll();
      resetProjectForm();
      setCloudStatus("Cloud projects, settings, and requests pulled into this local admin.", "success");
    } catch (error) {
      setCloudStatus("Pull from Supabase failed. Check your policies and admin membership.", "error");
    }
  }

  function saveProjects(projects) {
    try {
      store.saveProjects(projects);
      renderAll();
      syncProjectsToCloud(projects);
      return true;
    } catch (error) {
      window.alert("Could not save this project. Try fewer or smaller uploaded images, or use hosted image URLs.");
      return false;
    }
  }

  function fillConfigForm(config) {
    document.getElementById("ownerName").value = config.ownerName;
    document.getElementById("ownerSchool").value = config.school;
    document.getElementById("ownerYear").value = config.classYear;
    document.getElementById("notificationEmail").value = config.notificationEmail;
  }

  function renderSummaryCards(state) {
    summaryCards.innerHTML = `
      <article class="summary-card summary-card-projects">
        <span class="kicker">Projects</span>
        <strong>${state.projects.length}</strong>
        <p class="admin-note">Live project entries available on the home page.</p>
      </article>
      <article class="summary-card summary-card-requests">
        <span class="kicker">Requests</span>
        <strong>${state.requests.length}</strong>
        <p class="admin-note">Captured locally from the Request Portfolio form.</p>
      </article>
      <article class="summary-card summary-card-resume">
        <span class="kicker">Resume Studio</span>
        <strong>${state.resumeStudio.masterResume.content ? "Ready" : "Draft"}</strong>
        <p class="admin-note">${state.resumeStudio.packets.length} tailored packet${state.resumeStudio.packets.length === 1 ? "" : "s"} saved locally.</p>
      </article>
    `;
  }

  function populateCategorySelect() {
    projectCategory.innerHTML = "";
    store.categoryDefinitions.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.slug;
      option.textContent = category.label;
      projectCategory.appendChild(option);
    });
  }

  function populateProjectTypeSelect(selectedValue = "") {
    projectType.innerHTML = "";
    store.projectTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      if (type === selectedValue) {
        option.selected = true;
      }
      projectType.appendChild(option);
    });

    if (selectedValue && !store.projectTypes.includes(selectedValue)) {
      const option = document.createElement("option");
      option.value = selectedValue;
      option.textContent = selectedValue;
      option.selected = true;
      projectType.appendChild(option);
    }
  }

  function populateResumeFieldSelect() {
    if (!resumeEngineeringField) {
      return;
    }

    resumeEngineeringField.innerHTML = "";
    store.engineeringFields.forEach((field) => {
      const option = document.createElement("option");
      option.value = field;
      option.textContent = field;
      resumeEngineeringField.appendChild(option);
    });
  }

  function populateSubfieldSelect(categorySlug, selectedValue = "") {
    projectSubfield.innerHTML = "";
    const category = store.categoryDefinitions.find((item) => item.slug === categorySlug) || store.categoryDefinitions[0];
    let hasSelectedValue = false;

    function appendOption(parent, subfield, label) {
      const option = document.createElement("option");
      option.value = subfield.value;
      option.textContent = label || subfield.label;
      if (subfield.value === selectedValue) {
        option.selected = true;
        hasSelectedValue = true;
      }
      parent.appendChild(option);
    }

    store.getSubfieldTree(category).forEach((subfield) => {
      appendOption(projectSubfield, subfield);

      if (!subfield.children.length) {
        return;
      }

      const group = document.createElement("optgroup");
      group.label = subfield.label;
      subfield.children.forEach((child) => appendOption(group, child));
      projectSubfield.appendChild(group);
    });

    if (selectedValue && !hasSelectedValue) {
      const option = document.createElement("option");
      option.value = selectedValue;
      option.textContent = store.getSubfieldDisplay(categorySlug, selectedValue);
      option.selected = true;
      projectSubfield.appendChild(option);
    }
  }

  function serializeTags(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseGalleryLine(line) {
    const trimmed = line.trim();
    if (!trimmed) {
      return [];
    }
    if (/^data:image\//i.test(trimmed)) {
      return [trimmed];
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseGalleryInput(value) {
    return value
      .split(/\r?\n/)
      .flatMap((line) => parseGalleryLine(line));
  }

  function serializeGallery(value, coverImage) {
    const items = parseGalleryInput(value);
    if (!items.length && coverImage) {
      return [coverImage];
    }
    return items;
  }

  function setGalleryInputValue(gallery) {
    projectGallery.value = gallery.join("\n");
  }

  function isUploadedImageSource(image) {
    return /^data:image\//i.test(String(image || ""));
  }

  function formatImageSourceLabel(image, index) {
    const text = String(image || "");
    if (isUploadedImageSource(text)) {
      return `Uploaded image ${index + 1}`;
    }
    return text.length > 140 ? `${text.slice(0, 137)}...` : text;
  }

  function toCssImageUrl(image) {
    const safeImage = String(image || "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/[\r\n]/g, "");
    return `url("${safeImage}")`;
  }

  function setBackgroundPreview(element, image) {
    if (!element) {
      return;
    }

    if (image) {
      element.classList.remove("is-empty");
      element.style.setProperty("--image-url", toCssImageUrl(image));
    } else {
      element.classList.add("is-empty");
      element.style.removeProperty("--image-url");
    }
  }

  function renderProjectMediaPreview() {
    const coverImage = projectCoverImage.value.trim();
    const gallery = parseGalleryInput(projectGallery.value);
    const previewImages = gallery.length ? gallery : coverImage ? [coverImage] : [];
    const projectTitle = document.getElementById("projectTitle").value.trim() || "Untitled project";

    setBackgroundPreview(projectCoverPreviewImage, coverImage);
    if (projectMediaPreviewTitle) {
      projectMediaPreviewTitle.textContent = projectTitle;
    }
    if (projectMediaPreviewMeta) {
      const coverText = coverImage ? "Cover ready" : "No cover selected";
      const galleryText = `${gallery.length} gallery image${gallery.length === 1 ? "" : "s"}`;
      projectMediaPreviewMeta.textContent = `${coverText} - ${galleryText}`;
    }
    if (!projectGalleryPreview) {
      return;
    }

    projectGalleryPreview.innerHTML = "";
    if (!previewImages.length) {
      const emptyThumb = document.createElement("div");
      emptyThumb.className = "media-preview-thumb is-empty";
      emptyThumb.textContent = "No media";
      projectGalleryPreview.appendChild(emptyThumb);
      return;
    }

    previewImages.slice(0, 8).forEach((image, index) => {
      const thumb = document.createElement("div");
      thumb.className = "media-preview-thumb";
      thumb.title = formatImageSourceLabel(image, index);
      setBackgroundPreview(thumb, image);
      projectGalleryPreview.appendChild(thumb);
    });

    if (previewImages.length > 8) {
      const overflow = document.createElement("div");
      overflow.className = "media-preview-thumb media-preview-more";
      overflow.textContent = `+${previewImages.length - 8}`;
      projectGalleryPreview.appendChild(overflow);
    }
  }

  function setUploadStatus(element, message) {
    if (element) {
      element.textContent = message;
    }
  }

  function getImageFiles(fileList) {
    return Array.from(fileList || []).filter((file) => file.type && file.type.startsWith("image/"));
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  function resizeImageDataUrl(dataUrl, mimeType) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          maxUploadedImageWidth / image.width,
          maxUploadedImageHeight / image.height
        );

        if (scale >= 1 && dataUrl.length < 700000) {
          resolve(dataUrl);
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(dataUrl);
          return;
        }

        const outputType = mimeType === "image/png" && dataUrl.length < 700000 ? "image/png" : "image/jpeg";
        if (outputType === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(
          outputType === "image/png"
            ? canvas.toDataURL(outputType)
            : canvas.toDataURL(outputType, uploadedImageQuality)
        );
      };
      image.onerror = () => resolve(dataUrl);
      image.src = dataUrl;
    });
  }

  async function convertImageFileToDataUrl(file) {
    const dataUrl = await readFileAsDataUrl(file);
    return resizeImageDataUrl(dataUrl, file.type);
  }

  function dataUrlToBlob(dataUrl) {
    const [header, payload] = dataUrl.split(",");
    const contentType = (header.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
    const bytes = atob(payload);
    const byteNumbers = new Array(bytes.length);
    for (let index = 0; index < bytes.length; index += 1) {
      byteNumbers[index] = bytes.charCodeAt(index);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }

  async function maybeUploadProjectImage(dataUrl, fileName) {
    if (!isCloudConfigured()) {
      return dataUrl;
    }

    try {
      const session = await getCloudSession();
      if (!session) {
        return dataUrl;
      }
      const blob = dataUrlToBlob(dataUrl);
      return await cloud.uploadImage(blob, fileName);
    } catch (error) {
      setCloudStatus("Image stayed local because Supabase media upload failed.", "error");
      return dataUrl;
    }
  }

  async function handleCoverUpload(event) {
    const file = getImageFiles(event.target.files)[0];
    if (!file) {
      setUploadStatus(projectCoverUploadStatus, "Choose an image file for the cover.");
      return;
    }

    setUploadStatus(projectCoverUploadStatus, `Preparing ${file.name}...`);
    try {
      const dataUrl = await convertImageFileToDataUrl(file);
      const imageSource = await maybeUploadProjectImage(dataUrl, file.name);
      projectCoverImage.value = imageSource;
      setUploadStatus(
        projectCoverUploadStatus,
        imageSource === dataUrl ? `${file.name} uploaded for this browser.` : `${file.name} uploaded to Supabase.`
      );
      renderGalleryOrder(serializeGallery(projectGallery.value, imageSource));
      renderProjectMediaPreview();
    } catch (error) {
      setUploadStatus(projectCoverUploadStatus, "Could not upload that cover image.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event) {
    const files = getImageFiles(event.target.files);
    if (!files.length) {
      setUploadStatus(projectGalleryUploadStatus, "Choose one or more image files.");
      return;
    }

    setUploadStatus(projectGalleryUploadStatus, `Preparing ${files.length} image${files.length === 1 ? "" : "s"}...`);
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const dataUrl = await convertImageFileToDataUrl(file);
        return maybeUploadProjectImage(dataUrl, file.name);
      })
    );
    const uploadedImages = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    const failedCount = results.length - uploadedImages.length;

    if (uploadedImages.length) {
      const nextGallery = [...parseGalleryInput(projectGallery.value), ...uploadedImages];
      setGalleryInputValue(nextGallery);
      renderGalleryOrder(nextGallery);
      renderProjectMediaPreview();
    }

    const uploadedText = `${uploadedImages.length} gallery image${uploadedImages.length === 1 ? "" : "s"} uploaded`;
    const failedText = failedCount ? `, ${failedCount} failed` : "";
    setUploadStatus(projectGalleryUploadStatus, `${uploadedText}${failedText}.`);
    event.target.value = "";
  }

  function resetProjectForm() {
    projectForm.reset();
    document.getElementById("projectId").value = "";
    if (projectCoverUpload) {
      projectCoverUpload.value = "";
    }
    if (projectGalleryUpload) {
      projectGalleryUpload.value = "";
    }
    setUploadStatus(projectCoverUploadStatus, "No cover image uploaded.");
    setUploadStatus(projectGalleryUploadStatus, "No gallery images uploaded.");
    projectCategory.value = store.categoryDefinitions[0].slug;
    populateProjectTypeSelect();
    populateSubfieldSelect(projectCategory.value);
    renderGalleryOrder([]);
    renderProjectMediaPreview();
  }

  function editProject(projectId) {
    const state = loadState();
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    document.getElementById("projectId").value = project.id;
    document.getElementById("projectTitle").value = project.title;
    populateProjectTypeSelect(project.type);
    projectCategory.value = project.category;
    populateSubfieldSelect(project.category, project.subfield);
    document.getElementById("projectShortSummary").value = project.shortSummary;
    document.getElementById("projectDescription").value = project.description;
    document.getElementById("projectDetails").value = project.details;
    projectCoverImage.value = project.coverImage;
    setGalleryInputValue(project.gallery);
    document.getElementById("projectTags").value = project.tags.join(", ");
    setUploadStatus(
      projectCoverUploadStatus,
      isUploadedImageSource(project.coverImage) ? "Existing uploaded cover image loaded." : "Using a URL or hosted asset source."
    );
    setUploadStatus(
      projectGalleryUploadStatus,
      project.gallery.some(isUploadedImageSource) ? "Existing uploaded gallery images loaded." : "Using URL or hosted asset sources."
    );
    renderGalleryOrder(project.gallery);
    renderProjectMediaPreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProject(projectId) {
    const state = loadState();
    const projects = state.projects.filter((item) => item.id !== projectId);
    saveProjects(projects);
  }

  function renderProjectAdminList(projects) {
    projectAdminList.innerHTML = "";

    projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-admin-card";
      const thumb = document.createElement("div");
      thumb.className = "project-admin-thumb";
      setBackgroundPreview(thumb, project.coverImage);
      const thumbMeta = document.createElement("span");
      const galleryCount = Array.isArray(project.gallery) ? project.gallery.length : 0;
      thumbMeta.textContent = `${galleryCount} image${galleryCount === 1 ? "" : "s"}`;
      thumb.appendChild(thumbMeta);

      const body = document.createElement("div");
      body.className = "project-admin-body";

      const title = document.createElement("h3");
      title.textContent = project.title;

      const stats = document.createElement("div");
      stats.className = "stats-row";
      const category = document.createElement("span");
      category.textContent = project.categoryLabel;
      const subfield = document.createElement("span");
      subfield.textContent = store.getSubfieldDisplay(project.category, project.subfield);
      stats.appendChild(category);
      stats.appendChild(subfield);

      const summary = document.createElement("p");
      summary.className = "admin-note";
      summary.textContent = project.shortSummary;

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const editButton = document.createElement("button");
      editButton.className = "small-button";
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editProject(project.id));

      const portfolioButton = document.createElement("a");
      portfolioButton.className = "small-button";
      portfolioButton.href = `portfolio.html#${project.id}`;
      portfolioButton.textContent = "Portfolio Page";

      const deleteButton = document.createElement("button");
      deleteButton.className = "small-button danger-button";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteProject(project.id));

      actions.appendChild(editButton);
      actions.appendChild(portfolioButton);
      actions.appendChild(deleteButton);
      body.appendChild(title);
      body.appendChild(stats);
      body.appendChild(summary);
      body.appendChild(actions);
      card.appendChild(thumb);
      card.appendChild(body);
      projectAdminList.appendChild(card);
    });
  }

  function renderRequests(requests) {
    requestCardList.innerHTML = "";

    if (!requests.length) {
      requestCardList.innerHTML = `
        <div class="empty-state">
          <h3>No requests yet.</h3>
          <p>Once someone submits the Request Portfolio form, it will appear here.</p>
        </div>
      `;
      return;
    }

    requests.forEach((request) => {
      const card = document.createElement("article");
      card.className = "request-card";
      card.innerHTML = `
        <h3>${request.firstName} ${request.lastName}</h3>
        <div class="stats-row">
          <span>${request.workEmail}</span>
          <span>${request.institution}</span>
        </div>
        <p class="admin-note">Field: ${request.engineeringField || "Not provided"}</p>
        <p class="admin-note">Purpose: ${request.purpose}</p>
        <p class="admin-note">Notes: ${request.notes || "None"}</p>
      `;
      requestCardList.appendChild(card);
    });
  }

  function cleanText(value = "") {
    return String(value)
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function normalizeText(value = "") {
    return cleanText(value)
      .toLowerCase()
      .replace(/[^a-z0-9+#./ -]+/g, " ");
  }

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getOpportunityInput() {
    return {
      company: document.getElementById("resumeCompany").value.trim(),
      role: document.getElementById("resumeRole").value.trim(),
      field: resumeEngineeringField.value,
      meta: document.getElementById("resumeOpportunityMeta").value.trim(),
      link: document.getElementById("resumePostingLink").value.trim(),
      description: document.getElementById("resumeJobDescription").value.trim(),
      required: document.getElementById("resumeRequiredQualifications").value.trim(),
      preferred: document.getElementById("resumePreferredQualifications").value.trim(),
    };
  }

  function getOpportunityText(opportunity) {
    return [
      opportunity.company,
      opportunity.role,
      opportunity.field,
      opportunity.description,
      opportunity.required,
      opportunity.preferred,
    ].join(" ");
  }

  function extractKeywords(text, limit = 18) {
    const counts = new Map();
    const normalized = normalizeText(text);
    const words = normalized.match(/[a-z0-9+#./-]{3,}/g) || [];

    words.forEach((word) => {
      const token = word.replace(/^[./-]+|[./-]+$/g, "");
      if (!token || keywordStopWords.has(token) || /^\d+$/.test(token)) {
        return;
      }
      counts.set(token, (counts.get(token) || 0) + 1);
    });

    const phrases = [
      "solidworks",
      "ansys",
      "cad",
      "fea",
      "cfd",
      "gd&t",
      "manufacturing",
      "test analysis",
      "design analysis",
      "structures",
      "propulsion",
      "fluids",
      "avionics",
      "gnc",
      "thermal",
      "materials",
      "imaging",
      "sheet metal",
      "chassis",
      "aerodynamics",
      "systems engineering",
      "data analysis",
      "python",
      "matlab",
      "flight",
      "rocketry",
      "liquid oxygen",
    ];

    phrases.forEach((phrase) => {
      if (normalized.includes(phrase)) {
        counts.set(phrase, (counts.get(phrase) || 0) + 4);
      }
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([keyword]) => keyword);
  }

  function scoreText(text, keywords) {
    const normalized = normalizeText(text);
    return keywords.reduce((score, keyword) => {
      return score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  }

  function scoreProject(project, keywords, opportunityText) {
    const projectText = [
      project.title,
      project.categoryLabel,
      project.subfield,
      project.type,
      project.shortSummary,
      project.description,
      project.details,
      ...(project.tags || []),
    ].join(" ");
    const keywordScore = scoreText(projectText, keywords);
    const opportunityTerms = extractKeywords(opportunityText, 30);
    const overlapScore = scoreText(projectText, opportunityTerms);
    return keywordScore * 2 + overlapScore;
  }

  function selectProjectsForOpportunity(projects, opportunity, keywords) {
    const opportunityText = getOpportunityText(opportunity);
    return projects
      .map((project) => ({
        ...project,
        matchScore: scoreProject(project, keywords, opportunityText),
      }))
      .sort((a, b) => b.matchScore - a.matchScore || a.title.localeCompare(b.title))
      .slice(0, 4);
  }

  function extractResumeHighlights(masterResume) {
    const lines = cleanText(masterResume.content || "")
      .split("\n")
      .map((line) => line.replace(/^[*-]\s*/, "").trim())
      .filter((line) => line.length >= 18 && line.length <= 180);

    if (!lines.length) {
      return [
        "Engineering student with project experience across CAD, fabrication, analysis, research, and multidisciplinary build environments.",
      ];
    }

    return lines.slice(0, 8);
  }

  function buildSkillLine(keywords, selectedProjects) {
    const projectTags = selectedProjects.flatMap((project) => project.tags || []);
    const merged = [...new Set([...keywords.slice(0, 12), ...projectTags])].slice(0, 18);
    return merged.join(", ");
  }

  function buildResumeDraft(packet, config) {
    const { opportunity, keywords, selectedProjects, missingKeywords, masterHighlights } = packet;
    const skillLine = buildSkillLine(keywords, selectedProjects);
    const projectBullets = selectedProjects.map((project) => {
      const tags = project.tags && project.tags.length ? ` Tools/focus: ${project.tags.join(", ")}.` : "";
      return [
        `${project.title} - ${store.getSubfieldDisplay(project.category, project.subfield)}`,
        `  - ${project.shortSummary}`,
        `  - ${project.details}${tags}`,
      ].join("\n");
    }).join("\n\n");

    return cleanText(`
${config.ownerName}
${config.school} | Class of ${config.classYear} | ${config.notificationEmail}

TARGET ROLE
${opportunity.role} | ${opportunity.company}${opportunity.meta ? ` | ${opportunity.meta}` : ""}

ENGINEERING PROFILE
Engineering student focused on ${opportunity.field || "applied engineering"} with hands-on project experience in ${skillLine}. This version is tailored toward ${opportunity.company}'s ${opportunity.role} opportunity by emphasizing the strongest overlap between the posting, the master resume, and the portfolio project record.

TARGETED TECHNICAL SKILLS
${skillLine}

SELECTED EXPERIENCE FROM MASTER RESUME
${masterHighlights.map((highlight) => `- ${highlight}`).join("\n")}

PORTFOLIO PROJECTS MOST RELEVANT TO THIS ROLE
${projectBullets || "- Add projects in the Project Editor so this section can target portfolio evidence more precisely."}

KEYWORDS TO WORK INTO THE FINAL RESUME WHERE TRUE
${keywords.join(", ")}

GAPS TO REVIEW BEFORE SUBMITTING
${missingKeywords.length ? missingKeywords.map((keyword) => `- Confirm whether you have real evidence for: ${keyword}`).join("\n") : "- The master resume already covers the highest-priority posting keywords detected here."}
    `);
  }

  function buildCoverLetter(packet, config) {
    const { opportunity, selectedProjects, keywords } = packet;
    const project = selectedProjects[0];
    const projectName = project ? project.title : "my engineering portfolio work";
    const projectEvidence = project
      ? `${projectName}, where I worked through ${project.shortSummary.charAt(0).toLowerCase()}${project.shortSummary.slice(1)}`
      : "my project work, where I connect technical requirements with practical execution";

    return cleanText(`
Dear Hiring Team,

I am excited to apply for the ${opportunity.role} opportunity at ${opportunity.company}. My background as an engineering student at ${config.school} has been shaped by project work that connects CAD, analysis, build constraints, research documentation, and multidisciplinary technical communication.

What stands out about this opportunity is its emphasis on ${keywords.slice(0, 5).join(", ")}. That aligns with ${projectEvidence}. Across my portfolio, I have focused on turning open-ended technical needs into documented decisions, testable designs, and clear engineering explanations that can stand up in a review setting.

I would bring a practical, team-oriented engineering approach to this role: first understanding the constraints, then building evidence through modeling, analysis, fabrication, testing, or documentation, and finally communicating the reasoning clearly. I would welcome the opportunity to discuss how my project experience can support ${opportunity.company}'s work.

Sincerely,
${config.ownerName}
    `);
  }

  function buildPortfolioFocus(packet) {
    const { opportunity, keywords, selectedProjects, missingKeywords } = packet;
    const projectNotes = selectedProjects.map((project, index) => {
      const tags = project.tags && project.tags.length ? project.tags.join(", ") : "technical execution";
      return [
        `${index + 1}. ${project.title}`,
        `   Category: ${project.categoryLabel} / ${store.getSubfieldDisplay(project.category, project.subfield)}`,
        `   Why it matches: ${project.description}`,
        `   Interview angle: Connect ${tags} to the posting's emphasis on ${keywords.slice(0, 6).join(", ")}.`,
        `   Portfolio action: Make sure the page shows the problem, constraints, your contribution, and the result with the strongest image sequence first.`,
      ].join("\n");
    }).join("\n\n");

    return cleanText(`
TAILORED PORTFOLIO FOCUS
Target: ${opportunity.role} at ${opportunity.company}

Priority language to echo naturally:
${keywords.join(", ")}

Recommended portfolio order:
${projectNotes || "Add more project entries so the tailored portfolio can rank your strongest evidence."}

Before submitting:
${missingKeywords.length ? missingKeywords.map((keyword) => `- If true, add concrete evidence for ${keyword} to the resume or a project page.`).join("\n") : "- No major keyword gaps detected from the current master resume text."}
- Keep claims specific. Use numbers, tools, test conditions, materials, dimensions, or deliverables wherever you have them.
- Use the portfolio PDF for interview preparation: each selected project should explain the problem, your responsibility, your technical decisions, and the outcome without naming the STAR framework.
    `);
  }

  function buildTailoredPacket(opportunity, state) {
    const masterResume = state.resumeStudio.masterResume;
    const postingText = getOpportunityText(opportunity);
    const keywords = extractKeywords(postingText, 20);
    const selectedProjects = selectProjectsForOpportunity(state.projects, opportunity, keywords);
    const masterHighlights = extractResumeHighlights(masterResume);
    const missingKeywords = keywords
      .filter((keyword) => !normalizeText(masterResume.content || "").includes(keyword.toLowerCase()))
      .slice(0, 8);
    const alignment = keywords.length
      ? Math.round(((keywords.length - missingKeywords.length) / keywords.length) * 100)
      : 0;

    const packet = {
      id: `packet-${Date.now()}`,
      createdAt: new Date().toISOString(),
      opportunity,
      keywords,
      missingKeywords,
      alignment,
      selectedProjects: selectedProjects.map((project) => ({
        id: project.id,
        title: project.title,
        category: project.category,
        categoryLabel: project.categoryLabel,
        subfield: project.subfield,
        type: project.type,
        shortSummary: project.shortSummary,
        description: project.description,
        details: project.details,
        tags: project.tags,
        matchScore: project.matchScore,
      })),
      masterHighlights,
    };

    packet.resumeDraft = buildResumeDraft(packet, state.config);
    packet.coverLetter = buildCoverLetter(packet, state.config);
    packet.portfolioFocus = buildPortfolioFocus(packet);
    return packet;
  }

  function renderResumeStudio(studio) {
    if (!masterResumeText) {
      return;
    }

    const masterResume = studio.masterResume;
    if (!document.activeElement || document.activeElement !== masterResumeText) {
      masterResumeText.value = masterResume.content || "";
    }
    uploadedResumeFileName = masterResume.fileName || uploadedResumeFileName;

    const statusText = masterResume.content
      ? `Saved ${masterResume.fileName ? `from ${masterResume.fileName}` : "from pasted text"}${masterResume.updatedAt ? ` on ${new Date(masterResume.updatedAt).toLocaleDateString()}` : ""}.`
      : "No master resume saved.";
    masterResumeStatus.textContent = statusText;

    renderResumeHistory(studio.packets);
  }

  function renderResumeHistory(packets) {
    if (!resumeHistoryList) {
      return;
    }

    resumeHistoryList.innerHTML = "";
    if (!packets.length) {
      resumeHistoryList.innerHTML = `
        <div class="empty-state">
          <h3>No tailored packets yet.</h3>
          <p>Generate a packet from an opportunity to save it here.</p>
        </div>
      `;
      return;
    }

    packets.forEach((packet) => {
      const item = document.createElement("article");
      item.className = "resume-history-card";
      item.innerHTML = `
        <strong>${packet.opportunity.role}</strong>
        <p>${packet.opportunity.company}</p>
        <span>${new Date(packet.createdAt).toLocaleDateString()} | ${packet.alignment}% alignment</span>
      `;
      const button = document.createElement("button");
      button.className = "small-button";
      button.type = "button";
      button.textContent = "Load";
      button.addEventListener("click", () => renderResumePacket(packet));
      item.appendChild(button);
      resumeHistoryList.appendChild(item);
    });
  }

  function renderResumePacket(packet) {
    if (!resumeScoreboard) {
      return;
    }

    resumeScoreboard.innerHTML = `
      <div>
        <span class="kicker">Alignment</span>
        <strong>${packet.alignment}%</strong>
      </div>
      <p class="admin-note">${packet.selectedProjects.length} portfolio project${packet.selectedProjects.length === 1 ? "" : "s"} selected for ${packet.opportunity.role} at ${packet.opportunity.company}.</p>
    `;

    resumeKeywordStrip.innerHTML = "";
    packet.keywords.slice(0, 14).forEach((keyword) => {
      const chip = document.createElement("span");
      chip.className = "resume-keyword-chip";
      chip.textContent = keyword;
      resumeKeywordStrip.appendChild(chip);
    });

    tailoredResumeOutput.value = packet.resumeDraft;
    coverLetterOutput.value = packet.coverLetter;
    portfolioFocusOutput.value = packet.portfolioFocus;
  }

  function saveMasterResume() {
    const content = cleanText(masterResumeText.value);
    store.saveMasterResume({
      fileName: uploadedResumeFileName,
      content,
      updatedAt: new Date().toISOString(),
    });
    renderResumeStudio(store.getResumeStudio());
  }

  function clearMasterResumeDraft() {
    masterResumeText.value = "";
    uploadedResumeFileName = "";
    masterResumeStatus.textContent = "Draft cleared. Saved master resume is unchanged until you save.";
  }

  async function handleMasterResumeUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    uploadedResumeFileName = file.name;
    const rawText = await file.text();
    const cleaned = cleanText(rawText.replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " "));
    const readableRatio = rawText.length ? cleaned.length / rawText.length : 0;
    const likelyBinary = /\.(pdf|docx?|rtf)$/i.test(file.name) && (cleaned.length < 250 || readableRatio < 0.35);

    if (likelyBinary) {
      masterResumeStatus.textContent = `Loaded ${file.name}, but the browser could not extract clean resume text. Paste the resume text below, then save.`;
      return;
    }

    masterResumeText.value = cleaned;
    masterResumeStatus.textContent = `Loaded ${file.name}. Review the text, then save it as the master resume.`;
  }

  function clearOpportunityForm() {
    resumeOpportunityForm.reset();
    populateResumeFieldSelect();
  }

  function generateResumePacket(event) {
    event.preventDefault();
    const state = loadState();
    const opportunity = getOpportunityInput();

    if (!state.resumeStudio.masterResume.content && !masterResumeText.value.trim()) {
      masterResumeStatus.textContent = "Save a master resume first so the packet has a real baseline.";
      masterResumeText.focus();
      return;
    }

    if (!state.resumeStudio.masterResume.content && masterResumeText.value.trim()) {
      saveMasterResume();
      state.resumeStudio = store.getResumeStudio();
    }

    const packet = buildTailoredPacket(opportunity, state);
    store.addResumePacket(packet);
    renderResumePacket(packet);
    renderResumeHistory(store.getResumeStudio().packets);
    renderSummaryCards(loadState());
  }

  function copyTextFromOutput(targetId) {
    const target = document.getElementById(targetId);
    if (!target || !target.value) {
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(target.value);
      return;
    }

    target.select();
    document.execCommand("copy");
  }

  function printResumePacket() {
    const content = [
      ["Tailored Engineering Resume", tailoredResumeOutput.value],
      ["Cover Letter", coverLetterOutput.value],
      ["Portfolio Focus Packet", portfolioFocusOutput.value],
    ].filter((section) => section[1]);

    if (!content.length) {
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tailored Application Packet</title>
        <style>
          body { font-family: Arial, sans-serif; color: #172033; margin: 0; padding: 0.5in; line-height: 1.45; }
          section { break-after: page; }
          section:last-child { break-after: auto; }
          h1 { font-size: 22px; margin: 0 0 18px; }
          pre { white-space: pre-wrap; font: inherit; margin: 0; }
        </style>
      </head>
      <body>
        ${content.map(([title, text]) => `<section><h1>${escapeHtml(title)}</h1><pre>${escapeHtml(text)}</pre></section>`).join("")}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function renderAll() {
    const state = loadState();
    renderSummaryCards(state);
    fillConfigForm(state.config);
    renderProjectAdminList(state.projects);
    renderRequests(state.requests);
    renderResumeStudio(state.resumeStudio);
  }

  function buildDraftProjectForOrdering() {
    const categoryMeta = store.categoryDefinitions.find((item) => item.slug === projectCategory.value);
    return {
      id: document.getElementById("projectId").value || `proj-${Date.now()}`,
      title: document.getElementById("projectTitle").value.trim() || "Untitled Project",
      type: projectType.value,
      category: projectCategory.value,
      categoryLabel: categoryMeta ? categoryMeta.label : projectCategory.value,
      subfield: projectSubfield.value,
      shortSummary: document.getElementById("projectShortSummary").value.trim(),
      description: document.getElementById("projectDescription").value.trim(),
      details: document.getElementById("projectDetails").value.trim(),
      tags: serializeTags(document.getElementById("projectTags").value),
    };
  }

  function renderGalleryOrder(gallery) {
    if (!galleryOrderList) {
      return;
    }

    galleryOrderList.innerHTML = "";
    if (!gallery.length) {
      galleryOrderList.innerHTML = "<li>No gallery images added yet.</li>";
      return;
    }

    gallery.forEach((image, index) => {
      const item = document.createElement("li");
      item.textContent = formatImageSourceLabel(image, index);
      galleryOrderList.appendChild(item);
    });
  }

  function suggestGalleryOrder() {
    const gallery = serializeGallery(
      projectGallery.value,
      projectCoverImage.value.trim()
    );
    const orderedGallery = store.sortGalleryForProject(gallery, buildDraftProjectForOrdering());
    setGalleryInputValue(orderedGallery);
    renderGalleryOrder(orderedGallery);
    renderProjectMediaPreview();
  }

  function getGalleryPhase(image) {
    const text = String(image).toLowerCase();
    const phases = [
      ["Concept / Design", ["schematic", "concept", "design", "plan", "sketch", "cad"]],
      ["Site / Layout", ["site", "area", "space", "layout", "ground"]],
      ["Measurement / Marking", ["measure", "mark", "dimension", "tape"]],
      ["Digging / Prep", ["dig", "hole", "excavate", "post-hole"]],
      ["Concrete / Leveling", ["cement", "concrete", "post", "level", "dry"]],
      ["Assembly / Connection", ["pipe", "bar", "pullup", "dip", "assemble", "connect"]],
      ["Floor / Cleanup", ["floor", "clean", "mat", "surface"]],
      ["Paint / Finish", ["paint", "finish", "final", "complete"]],
    ];
    const phase = phases.find((item) => item[1].some((word) => text.includes(word)));
    return phase ? phase[0] : "Needs review";
  }

  function renderGalleryReview() {
    galleryReviewList.innerHTML = "";

    if (!reviewGalleryItems.length) {
      galleryReviewList.innerHTML = '<div class="empty-state"><h3>No images to review.</h3><p>Add gallery images first.</p></div>';
      return;
    }

    reviewGalleryItems.forEach((image, index) => {
      const item = document.createElement("article");
      item.className = "gallery-review-item";
      const thumb = document.createElement("div");
      thumb.className = "gallery-review-thumb";
      thumb.style.setProperty("--image-url", toCssImageUrl(image));

      const content = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${getGalleryPhase(image)}`;
      const source = document.createElement("p");
      source.textContent = formatImageSourceLabel(image, index);
      content.appendChild(title);
      content.appendChild(source);

      item.appendChild(thumb);
      item.appendChild(content);

      const actions = document.createElement("div");
      actions.className = "gallery-review-actions";

      const upButton = document.createElement("button");
      upButton.className = "small-button";
      upButton.type = "button";
      upButton.textContent = "Up";
      upButton.disabled = index === 0;
      upButton.addEventListener("click", () => moveGalleryItem(index, -1));

      const downButton = document.createElement("button");
      downButton.className = "small-button";
      downButton.type = "button";
      downButton.textContent = "Down";
      downButton.disabled = index === reviewGalleryItems.length - 1;
      downButton.addEventListener("click", () => moveGalleryItem(index, 1));

      actions.appendChild(upButton);
      actions.appendChild(downButton);
      item.appendChild(actions);
      galleryReviewList.appendChild(item);
    });
  }

  function moveGalleryItem(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= reviewGalleryItems.length) {
      return;
    }
    const nextItems = [...reviewGalleryItems];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
    reviewGalleryItems = nextItems;
    renderGalleryReview();
  }

  function openGalleryReview() {
    const gallery = serializeGallery(
      projectGallery.value,
      projectCoverImage.value.trim()
    );
    reviewGalleryItems = store.sortGalleryForProject(gallery, buildDraftProjectForOrdering());
    renderGalleryReview();
    galleryReviewDialog.showModal();
  }

  function applyReviewedGalleryOrder() {
    setGalleryInputValue(reviewGalleryItems);
    renderGalleryOrder(reviewGalleryItems);
    renderProjectMediaPreview();
    galleryReviewDialog.close();
  }

  configForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const config = {
      ownerName: document.getElementById("ownerName").value.trim(),
      school: document.getElementById("ownerSchool").value.trim(),
      classYear: document.getElementById("ownerYear").value.trim(),
      notificationEmail: document.getElementById("notificationEmail").value.trim(),
    };
    store.saveConfig(config);
    syncConfigToCloud(config);
    renderAll();
  });

  masterResumeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveMasterResume();
  });

  masterResumeFile.addEventListener("change", handleMasterResumeUpload);
  clearMasterResumeButton.addEventListener("click", clearMasterResumeDraft);
  resumeOpportunityForm.addEventListener("submit", generateResumePacket);
  clearOpportunityButton.addEventListener("click", clearOpportunityForm);
  printResumePacketButton.addEventListener("click", printResumePacket);
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => copyTextFromOutput(button.dataset.copyTarget));
  });

  projectCategory.addEventListener("change", () => {
    populateSubfieldSelect(projectCategory.value);
  });

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const state = loadState();
    const categoryMeta = store.categoryDefinitions.find((item) => item.slug === projectCategory.value);
    const coverImage = projectCoverImage.value.trim() ||
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

    const project = {
      id: document.getElementById("projectId").value || `proj-${Date.now()}`,
      title: document.getElementById("projectTitle").value.trim(),
      type: projectType.value,
      category: projectCategory.value,
      categoryLabel: categoryMeta.label,
      subfield: projectSubfield.value,
      shortSummary: document.getElementById("projectShortSummary").value.trim(),
      description: document.getElementById("projectDescription").value.trim(),
      details: document.getElementById("projectDetails").value.trim(),
      coverImage,
      gallery: [],
      tags: serializeTags(document.getElementById("projectTags").value),
      fallback: "linear-gradient(135deg, #203251, #0d1727)",
      seedManaged: false,
    };
    project.gallery = store.sortGalleryForProject(
      serializeGallery(projectGallery.value, coverImage),
      project
    );
    project.portfolioNarrative = store.buildPortfolioNarrative(project);

    const existingIndex = state.projects.findIndex((item) => item.id === project.id);
    const projects = [...state.projects];

    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }

    if (saveProjects(projects)) {
      resetProjectForm();
    }
  });

  newProjectButton.addEventListener("click", resetProjectForm);

  projectCoverUpload.addEventListener("change", handleCoverUpload);
  projectGalleryUpload.addEventListener("change", handleGalleryUpload);
  document.getElementById("projectTitle").addEventListener("input", renderProjectMediaPreview);
  projectCoverImage.addEventListener("input", renderProjectMediaPreview);
  projectGallery.addEventListener("input", () => {
    renderGalleryOrder(serializeGallery(projectGallery.value, projectCoverImage.value.trim()));
    renderProjectMediaPreview();
  });
  suggestGalleryOrderButton.addEventListener("click", suggestGalleryOrder);
  reviewGalleryOrderButton.addEventListener("click", openGalleryReview);
  applyGalleryReview.addEventListener("click", applyReviewedGalleryOrder);
  closeGalleryReview.addEventListener("click", () => galleryReviewDialog.close());
  cancelGalleryReview.addEventListener("click", () => galleryReviewDialog.close());

  cloudSignInButton.addEventListener("click", signInToCloud);
  cloudSignOutButton.addEventListener("click", signOutOfCloud);
  cloudPullButton.addEventListener("click", pullCloudData);
  cloudPushButton.addEventListener("click", pushLocalDataToCloud);

  resetDataButton.addEventListener("click", () => {
    store.resetDemoData();
    resetProjectForm();
    renderAll();
  });

  populateCategorySelect();
  populateProjectTypeSelect();
  populateResumeFieldSelect();
  resetProjectForm();
  renderAll();
  refreshCloudStatus();
})();
