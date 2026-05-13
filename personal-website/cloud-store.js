(function () {
  const config = window.PORTFOLIO_SUPABASE_CONFIG || {};
  let client = null;

  function isConfigured() {
    return Boolean(config.url && config.anonKey && window.supabase && window.supabase.createClient);
  }

  function getClient() {
    if (!isConfigured()) {
      return null;
    }
    if (!client) {
      client = window.supabase.createClient(config.url, config.anonKey);
    }
    return client;
  }

  function getStateTable() {
    return config.stateTable || "portfolio_state";
  }

  function getRequestsTable() {
    return config.requestsTable || "portfolio_requests";
  }

  function getMediaBucket() {
    return config.mediaBucket || "portfolio-media";
  }

  function throwIfError(error) {
    if (error) {
      throw error;
    }
  }

  function slugifyFileName(fileName = "image") {
    const cleaned = String(fileName)
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64);
    return cleaned || "image";
  }

  function getFileExtension(fileName = "", contentType = "") {
    if (contentType.includes("png")) {
      return "png";
    }
    if (contentType.includes("webp")) {
      return "webp";
    }
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      return "jpg";
    }
    const fromName = String(fileName).match(/\.([a-z0-9]+)$/i);
    if (fromName) {
      return fromName[1].toLowerCase();
    }
    return "jpg";
  }

  async function getSession() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return null;
    }
    const { data, error } = await supabaseClient.auth.getSession();
    throwIfError(error);
    return data.session;
  }

  async function signIn(email, password) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    throwIfError(error);
    return data.session;
  }

  async function signOut() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return;
    }
    const { error } = await supabaseClient.auth.signOut();
    throwIfError(error);
  }

  async function loadPublicState() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return null;
    }

    const { data, error } = await supabaseClient
      .from(getStateTable())
      .select("key,value")
      .in("key", ["projects", "config"]);
    throwIfError(error);

    return (data || []).reduce(
      (state, row) => {
        state[row.key] = row.value;
        return state;
      },
      { projects: null, config: null }
    );
  }

  async function saveStateValue(key, value) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabaseClient
      .from(getStateTable())
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    throwIfError(error);
  }

  async function saveProjects(projects) {
    return saveStateValue("projects", projects);
  }

  async function saveConfig(siteConfig) {
    return saveStateValue("config", siteConfig);
  }

  async function addRequest(request) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabaseClient.from(getRequestsTable()).insert({
      id: request.id,
      payload: request,
      created_at: request.createdAt || new Date().toISOString(),
    });
    throwIfError(error);
  }

  async function getRequests() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from(getRequestsTable())
      .select("payload,created_at")
      .order("created_at", { ascending: false });
    throwIfError(error);
    return (data || []).map((row) => row.payload);
  }

  async function uploadImage(file, fileName) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const contentType = file.type || "image/jpeg";
    const extension = getFileExtension(fileName, contentType);
    const path = `projects/${Date.now()}-${slugifyFileName(fileName)}.${extension}`;
    const { error } = await supabaseClient.storage
      .from(getMediaBucket())
      .upload(path, file, {
        cacheControl: "31536000",
        contentType,
        upsert: false,
      });
    throwIfError(error);

    const { data } = supabaseClient.storage.from(getMediaBucket()).getPublicUrl(path);
    return data.publicUrl;
  }

  window.PortfolioCloud = {
    isConfigured,
    getClient,
    getSession,
    signIn,
    signOut,
    loadPublicState,
    saveProjects,
    saveConfig,
    addRequest,
    getRequests,
    uploadImage,
  };
})();
