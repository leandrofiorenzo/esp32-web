import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ipBaliza: '',

    servidorCI: 'CircleCI',
    tokenAcceso: '8761a13e3eb7b85dd360b5b7b85bd63c9f8841bf',
    identificadorDelRepositorio: 'sample-repository'
  },
  mutations: {
    setIpBaliza(state, ipBaliza) {
      state.ipBaliza = ipBaliza;
    },
    setServidorCI(state, servidorCI) {
      state.servidorCI = servidorCI;
    },
    setTokenAcceso(state, tokenAcceso) {
      state.tokenAcceso = tokenAcceso;
    },
    setIdentificadorDelRepositorio(state, identificadorDelRepositorio) {
      state.identificadorDelRepositorio = identificadorDelRepositorio;
    }
  },
  actions: {
  },
  getters: {
    getIpBaliza(state) {
      return state.ipBaliza
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
