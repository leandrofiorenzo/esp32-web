<template>
  <div class="container-flluid">
    <h1>Servidor CI</h1>
    <hr>
    <div v-if="ipBaliza == ''" class="alert alert-danger">
      <strong>La baliza aún no ha reportado su ip.</strong>
    </div>
    <div v-if="!respondeLaBaliza" class="alert alert-danger">
      <strong>La baliza no está respondiendo.</strong>
    </div>   
    <div class="row">
      <div class="col-5 text-center">
        <h3 class="mb-3">Servidor a utilizar: </h3>
        <div class="row">
          <div class="col-6">
            <button class="btn btn-block ml-2" :disabled="ipBaliza == '' || !respondeLaBaliza || grabandoNuevoMonitor" @click="servidorCISeleccionado('CircleCI')" :class="servidorCI == 'CircleCI' ? 'btn-primary' : 'btn-outline-primary'">
              Circle CI
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-block" :disabled="ipBaliza == '' || !respondeLaBaliza || grabandoNuevoMonitor" @click="servidorCISeleccionado('TravisCI')" :class="servidorCI == 'TravisCI' ? 'btn-primary' : 'btn-outline-primary'">
              Travis CI
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5 text-center">
        <h3 class="mb-3">Repositorio: </h3>
        <select v-if="servidorCI == 'CircleCI'" v-model="identificadorDelRepositorio" class="form-control" :disabled="servidorCI == '' || !respondeLaBaliza || ipBaliza == '' || grabandoNuevoMonitor">
          <option value="">Seleccione...</option>
          <option v-for="repositorioCircleCI in repositoriosCircleCI" :key="repositorioCircleCI.nombre" :value="repositorioCircleCI.nombre">{{repositorioCircleCI.nombre}}</option>
        </select>
        <select v-else v-model="identificadorDelRepositorio" class="form-control" :disabled="servidorCI == '' || !respondeLaBaliza || ipBaliza == '' || grabandoNuevoMonitor">
          <option value="">Seleccione...</option>
          <option v-for="repositorioTravisCI in repositoriosTravisCI" :key="repositorioTravisCI.id" :value="repositorioTravisCI.id">{{repositorioTravisCI.nombre}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5 text-center">
        <h3 class="mb-3">Token de acceso: </h3>
        <input type="text" class="form-control" v-model="tokenAcceso" :disabled="servidorCI == '' || !respondeLaBaliza || grabandoNuevoMonitor">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-5">
        <button @click="grabarNuevoMonitor" class="btn btn-lg btn-primary btn-block" :disabled="!puedeGrabar">
          <i class="fa fa-check"></i> Grabar
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Servidor',
  data () {
    return {
      grabandoNuevoMonitor: false,

      servidorCI: 'CircleCI',
      tokenAcceso: '8761a13e3eb7b85dd360b5b7b85bd63c9f8841bf',
      identificadorDelRepositorio: 'sample-repository',

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
      this.identificadorDelRepositorio = ''
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
    grabarNuevoMonitor () {
      let obj = {         
          servidorCI: this.servidorCI,
          tokenAcceso: this.tokenAcceso,
          identificadorDelRepositorio: this.identificadorDelRepositorio.toString()
      };

      this.grabandoNuevoMonitor = true

      axios({
        method: 'POST',
        url: `http://${this.ipBaliza}/servidor`,
        data: JSON.stringify(obj),
        headers: {
          'Content-Type': 'text/plain'
        }
      }).then(response => {
        this.grabandoNuevoMonitor = false

        this.$store.commit('setNuevoMonitor', {
          servidorCI: this.servidorCI,
          tokenAcceso: this.tokenAcceso,
          identificadorDelRepositorio: this.identificadorDelRepositorio
        })

      }).catch(error => {
        this.grabandoNuevoMonitor = false
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
      return this.ipBaliza != '' &&
        this.tokenAcceso != '' && 
        this.identificadorDelRepositorio != '' && 
        this.servidorCI != '' && 
        this.respondeLaBaliza &&
        !this.grabandoNuevoMonitor 
    }
  }
};
</script>