import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: ''
  },
  mutations: {
    setBaseUrl(state, baseUrl) {
      state.baseUrl = baseUrl;
    }
  },
  actions: {
  },
  getters: {
    getBaseUrl (state) {
      return state.baseUrl
    }
  }
})
