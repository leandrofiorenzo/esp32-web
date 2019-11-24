<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-auto">
        <button class="btn btn-primary" @click="pingBaliza" :disabled="baseUrl == '' || haciendoPing">
          <i class="fas fa-sync"></i> Ping
        </button>
      </div>
      <div class="col-auto">
        <i :class="obtenerColor" class="fa fa-circle"></i>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Monitor',
  data () {
    return {
      haciendoPing: false,
      pingEstado: 1
    }
  },
  methods: {
    pingBaliza () {
      this.haciendoPing = true
      this.pingEstado = 1
      axios({
        method: 'GET',
        url: `http://${this.baseUrl}/ping`
      }).then(response => {
        this.pingEstado = 2
        this.haciendoPing = true
      }).catch(error => {
        this.pingEstado = 3
        this.haciendoPing = true
      })
    }
  },
  computed: {
    baseUrl: {
      get () {
        return this.$store.getters.getBaseUrl
      },
      set(value) {
        this.$store.commit('setBaseUrl', value)
      }
    },
    obtenerColor () {
      if(this.pingEstado == 0) return 'text-dark'
      else if(this.pingEstado == 1) return 'text-success'
      else return 'text-danger'
    }
  }
};
