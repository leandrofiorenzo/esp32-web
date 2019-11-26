import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ipBaliza: ''
  },
  mutations: {
    setIpBaliza(state, ipBaliza) {
      state.ipBaliza = ipBaliza;
    }
  },
  actions: {
  },
  getters: {
    getIpBaliza (state) {
      return state.ipBaliza
    }
  }
})
