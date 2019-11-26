<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4"></div>
      <div class="col-4">
        <h1>Ip ESP32</h1>
        <input type="text" class="form-control" v-model="ipBaliza">
      </div>
      <div class="col-4"></div>
    </div>   
    <hr>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <h1>Credenciales WiFi</h1>
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <h5>Nombre de la red: </h5>
        <input type="text" class="form-control" v-model="nombreRed" :disabled="ipBaliza == '' || cargandoIp || enviandoCredenciales">
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <h5>Contraseña de la red: </h5>
        <input type="text" class="form-control" v-model="contrasenaRed" :disabled="ipBaliza == '' || cargandoIp || enviandoCredenciales">
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <button class="btn btn-primary btn-lg btn-block" @click="enviarCredencialesWiFi" :disabled="ipBaliza == '' || cargandoIp || enviandoCredenciales">
          <i class="fa fa-check"></i> Guardar
        </button>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Conectividad',
  data () {
    return {
      cargandoIp: false,
      enviandoCredenciales: false,

      nombreRed: '',
      contrasenaRed: ''
    }
  },
  methods: {
    enviarCredencialesWiFi() {
      this.enviandoCredenciales = true
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
        this.enviandoCredenciales = false
      }).catch(error => {
        console.log(error)
        this.enviandoCredenciales = false
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
    }
  }
};
</script>