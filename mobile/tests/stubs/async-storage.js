const state = new Map();

module.exports = {
  async getItem(key) {
    return state.has(key) ? state.get(key) : null;
  },
  async setItem(key, value) {
    state.set(key, value);
  },
  async multiRemove(keys) {
    keys.forEach((key) => state.delete(key));
  },
  __reset() {
    state.clear();
  }
};
