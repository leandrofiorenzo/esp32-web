import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: '',
    nombreDeLaRed: '',
    contrasenaDeLaRed: ''
  },
  mutations: {
    setBaseUrl(state, baseUrl) {
      state.baseUrl = baseUrl;
    },
    setNombreDeLaRed(state, nombreDeLaRed) {
      state.nombreDeLaRed = nombreDeLaRed
    },
    setContrasenaDeLaRed(state, contrasenaDeLaRed) {
      state.contrasenaDeLaRed = contrasenaDeLaRed
    }
  },
  actions: {
  },
  getters: {
    getBaseUrl (state) {
      return state.baseUrl
    },
    getNombreDeLaRed (state) {
      return state.nombreDeLaRed
    },
    getContrasenaDeLaRed(state) {
      return state.contrasenaDeLaRed
    }
  }
})
