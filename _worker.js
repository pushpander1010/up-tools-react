// Minimal worker — assets binding handles everything
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
