// Public client configuration for the GitHub Pages site and local admin.
// The anon key is safe to use in the browser when Row Level Security is enabled.
// Never put a Supabase service-role key in this file.
window.PORTFOLIO_SUPABASE_CONFIG = {
  url: "",
  anonKey: "",
  stateTable: "portfolio_state",
  requestsTable: "portfolio_requests",
  mediaBucket: "portfolio-media",
};
