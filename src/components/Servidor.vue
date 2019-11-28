<template>
  <div class="container-flluid">
    <h1>Servidor de CI</h1>
    <hr>
    <div class="alert alert-warning" v-if="ipBaliza == ''">
      <strong>Por favor, antes de continuar configure la ip del ESP32.</strong>
    </div>
    <div class="row">
      <div class="col-4">
        <h3 class="mb-3">Servidor a utilizar: </h3>
        <button class="btn" :disabled="ipBaliza == '' || enviandoServidor" @click="servidorCISeleccionado('TravisCI')" :class="servidorCI == 'TravisCI' ? 'btn-primary' : 'btn-outline-primary'">
          Travis CI
        </button>
        <button class="btn ml-2" :disabled="ipBaliza == '' || enviandoServidor" @click="servidorCISeleccionado('CircleCI')" :class="servidorCI == 'CircleCI' ? 'btn-primary' : 'btn-outline-primary'">
          Circle CI
        </button>
      </div>
      <div class="col-4">
        <h3 class="mb-3">Repositorio: </h3>
        <select v-if="servidorCI == 'CircleCI'" v-model="repositorioId" class="form-control" :disabled="servidorCI == '' || ipBaliza == '' || enviandoServidor">
          <option value="">Seleccione...</option>
          <option v-for="repositorioCircleCI in repositoriosCircleCI" :key="repositorioCircleCI.nombre" :value="repositorioCircleCI.nombre">{{repositorioCircleCI.nombre}}</option>
        </select>

        <select v-else v-model="repositorioId" class="form-control" :disabled="servidorCI == '' || ipBaliza == '' || enviandoServidor">
          <option value="">Seleccione...</option>
          <option v-for="repositorioTravisCI in repositoriosTravisCI" :key="repositorioTravisCI.id" :value="repositorioTravisCI.id">{{repositorioTravisCI.nombre}}</option>
        </select>
      </div>
      <div class="col-4">
        <h3 class="mb-3">Token de acceso: </h3>
        <input type="text" class="form-control" v-model="tokenAcceso" :disabled="servidorCI == '' || enviandoServidor">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <button @click="enviarServidorCI" class="btn btn-lg btn-primary btn-block" :disabled="!puedeGuardar || enviandoServidor">
          <i class="fa fa-check"></i> Grabar
        </button>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Servidor',
  data () {
    return {
      enviandoServidor: false,

      repositoriosCircleCI: [],
      repositoriosTravisCI: []
    }
  },
  created () {
    this.cargarRepositoriosDeCircleCI()
    this.cargarRepositoriosDeTravisCI()
  },  
  methods: {
    servidorCISeleccionado (servidorCI) {
      this.servidorCI = servidorCI
      this.repositorioId = ''
      if(servidorCI == 'TravisCI') {
        this.tokenAcceso = 'zxiel_jS6Xaaok3zgnHGzQ'
      } else if(servidorCI == 'CircleCI') {
        this.tokenAcceso = '8761a13e3eb7b85dd360b5b7b85bd63c9f8841bf'
      }
    },
    cargarRepositoriosDeCircleCI() {
      axios({
        method: 'GET',
        url: 'https://circleci.com/api/v1.1/projects?circle-token=8761a13e3eb7b85dd360b5b7b85bd63c9f8841bf'
      }).then(response => {
        this.repositoriosCircleCI = response.data.map(e => {
          return {
            nombre: e.reponame
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    cargarRepositoriosDeTravisCI() {
      axios({
        method: 'GET',
        url: 'https://api.travis-ci.org/repos',
        headers: {
          "Authorization": "token zxiel_jS6Xaaok3zgnHGzQ",
          "Travis-API-Version": "3"
        }
      }).then(response => {
        this.repositoriosTravisCI = response.data.repositories
          .filter(e => e.active)
          .map(e => {
            return {
              id: e.id,
              nombre: e.name
            }
          })
      }).catch(error => {
        console.log(error)
      })
    },
    enviarServidorCI () {
      let obj = {         
          servidorCI: this.servidorCI,
          tokenAcceso: this.tokenAcceso,
          repositorioId: this.repositorioId.toString()
      };

      this.enviandoServidor = true

      axios({
        method: 'POST',
        url: `http://${this.ipBaliza}/servidor`,
        data: JSON.stringify(obj),
        headers: {
          'Content-Type': 'text/plain'
        }
      }).then(response => {
        this.enviandoServidor = false
      }).catch(error => {
        this.enviandoServidor = false
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
    servidorCI: {
      get() {
        return this.$store.getters.getServidorCI
      },
      set(value) {
        this.$store.commit('setServidorCI', value)
      }
    },
    tokenAcceso: {
      get() {
        return this.$store.getters.getTokenAcceso
      },
      set(value) {
        this.$store.commit('setTokenAcceso', value)
      }
    },
    repositorioId: {
      get() {
        return this.$store.getters.getIdentificadorDelRepositorio
      },
      set(value) {
        this.$store.commit('setIdentificadorDelRepositorio', value)
      }
    },
    puedeGuardar () {
      return this.tokenAcceso != '' && this.repositorioId != '' && this.servidorCI != ''
    }
  }
};
</script>