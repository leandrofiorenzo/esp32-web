import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ipBaliza: '',
    respondeLaBaliza: false,

    servidorCI: 'CircleCI',
    tokenAcceso: '8761a13e3eb7b85dd360b5b7b85bd63c9f8841bf',
    identificadorDelRepositorio: 'sample-repository'
  },
  mutations: {
    setIpBaliza(state, ipBaliza) {
      state.ipBaliza = ipBaliza;
    },
    setRespondeLaBaliza(state, respondeLaBaliza) {
      state.respondeLaBaliza = respondeLaBaliza
    },
    setNuevoMonitor(state, payload) {
      state.servidorCI = payload.servidorCI;
      state.tokenAcceso = payload.tokenAcceso;
      state.identificadorDelRepositorio = payload.identificadorDelRepositorio;
    }
  },
  actions: {
  },
  getters: {
    getIpBaliza(state) {
      return state.ipBaliza
    },
    getRespondeLaBaliza(state) {
      return state.respondeLaBaliza
    },
    getServidorCI(state) {
      return state.servidorCI
    },
    getTokenAcceso(state) {
      return state.tokenAcceso
    },
    getIdentificadorDelRepositorio(state) {
      return state.identificadorDelRepositorio
    }
  }
})
