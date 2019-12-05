<template>
  <div class="container-fluid">
    <h1>Credenciales WiFi</h1>
    <hr>
    <div v-if="ipBaliza == ''" class="alert alert-danger">
      <strong>La baliza aún no ha reportado su ip.</strong>
    </div>
    <div v-if="!respondeLaBaliza" class="alert alert-danger">
      <strong>La baliza no está respondiendo.</strong>
    </div>
    <div class="row mt-4">
      <div class="col-5">
        <h5>Nombre de la red: </h5>
        <input type="text" class="form-control" v-model="nombreRed" :disabled="ipBaliza == '' || !respondeLaBaliza || grabandoNuevasCredencialesWiFi">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5">
        <h5>Contraseña de la red: </h5>
        <input type="text" class="form-control" v-model="contrasenaRed" :disabled="ipBaliza == '' || !respondeLaBaliza || grabandoNuevasCredencialesWiFi">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5">
        <button class="btn btn-primary btn-lg btn-block" @click="grabarCredencialesWiFi" :disabled="!puedeGrabar">
          <i class="fa fa-check"></i> Grabar
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Conectividad',
  data () {
    return {
      grabandoNuevasCredencialesWiFi: false,

      nombreRed: '',
      contrasenaRed: ''
    }
  },
  methods: {
    grabarCredencialesWiFi() {
      this.grabandoNuevasCredencialesWiFi = true
      axios({
        method: 'POST',
        url: `http://${this.ipBaliza}/wifi`,
        data: {
          username: this.nombreRed,
          password: this.contrasenaRed
        },
        headers: {
          'Content-Type': 'text/plain'
        }
      }).then(response => {
        console.log(resopnse)
        this.grabandoNuevasCredencialesWiFi = false
      }).catch(error => {
        console.log(error)
        this.grabandoNuevasCredencialesWiFi = false
      })
    }
  },
  computed: {
    ipBaliza: {
      get () {
        return this.$store.getters.getIpBaliza
      },
      set(value) {
        this.$store.commit('setIpBaliza', value)
      }
    },
    respondeLaBaliza () {
      return this.$store.getters.getRespondeLaBaliza
    }, 
    puedeGrabar () {
      return  this.ipBaliza != '' &&
        this.respondeLaBaliza &&
        !this.grabandoNuevasCredencialesWiFi
    }
  }
};
</script>