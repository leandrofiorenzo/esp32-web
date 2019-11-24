<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4"></div>
      <div class="col-4">
        <h1>Ip ESP32</h1>
        <input type="text" class="form-control" v-model="baseUrl">
        <button class="btn btn-info btn-sm" :disabled="cargandoIp" @click="refreshIp">
          <i class="fa fa-sync"></i>
        </button> 
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
        <input type="text" class="form-control" v-model="nombreDeLaRed">
        {{nombreDeLaRed}}
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <h5>Contraseña de la red: </h5>
        <input type="text" class="form-control" v-model="contrasenaDeLaRed">
        {{contrasenaDeLaRed}}
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <button class="btn btn-primary btn-lg btn-block">
          <i class="fa fa-check"></i> Guardar
        </button>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

var wifi = require("node-wifi");

export default {
  name: 'HelloWorld',
  data () {
    return {
      cargandoIp: false,
      
      repositoriosCircleCI: [],
      repositoriosTravisCI: []
    }
  },
  created () {
    this.cargarRepositoriosDeCircleCI()
    this.cargarRepositoriosDeTravisCI()
  },  
  methods: {
    refreshIp () {
      this.baseUrl = ''
      this.cargandoIp = true
      axios({
        method: 'GET',
        url: 'https://esp32-api.herokuapp.com/api/v1/ip'
      }).then(response => {
        if(response.data) 
          this.baseUrl = response.data.ip || '';
        this.cargandoIp = false
      }).catch(error => {
        this.cargandoIp = false
      })
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
        this.repositoriosTravisCI = response.data.repositories.filter(e => e.active).map(e => {
          return {
            nombre: e.name
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    mockearEnvio () {
      let obj = {         
          servidorCI: 'TravisCI',
          tokenAcceso: 'zxiel_jS6Xaaok3zgnHGzQ',
          repositorioId: '27012148'
      };
      axios({
        method: 'POST',
        url: `http://${this.$store.getters.getBaseUrl}/servidor`,
        data: JSON.stringify(obj),
        headers: {
          'Content-Type': 'text/plain'
        }
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
    nombreDeLaRed: {
      get () {
        return this.$store.getters.getNombreDeLaRed
      },
      set(value) {
        this.$store.commit('setNombreDeLaRed', value)
      }
    },
    contrasenaDeLaRed: {
      get () {
        return this.$store.getters.getContrasenaDeLaRed
      },
      set(value) {
        this.$store.commit('setContrasenaDeLaRed', value)
      }
    },
  }
};
</script>


<style lang="scss" scoped>

$input-bg-static: #E53935;
$input-bg-active: #43A047;
$input-bg-disabled: #a9a4a4;
$input-bg-pseudo-static: white;

$input-width: 1.8rem;

$input-radius: calc( #{$input-width} / 2 );
$input-height: calc( #{$input-width} / 2 );
$input-light-dims: calc( #{$input-height} / 2.5 );

.item {
  padding-left: 3px;
  
  h6 {
    margin-bottom: 1px;
    font-weight: normal;
    font-size: 0.7rem !important;
  }
}

input[type="checkbox"] {
  position: relative;
  appearance: none;
  width: $input-width;
  height: $input-height;
  border-radius: $input-radius;
  outline: none; 
  background-color: $input-bg-static;
  box-shadow: 0 0 0 2px $input-bg-static;
  
  &:before, &:after {
    position: absolute;
    display: block;
    content: "";
    border-radius: 100%;
    background-color: $input-bg-pseudo-static;
    transition: transform 450ms ease;
  }
  
  &:before {
    width: calc( #{$input-width} / 2 );
    height: $input-height;
  }
  
  // active state
  &:checked {
    background-color: $input-bg-active;
    box-shadow: 0 0 0 2px $input-bg-active;
    &:before {
      transform: translateX(100%);
    }
  } 

  &:disabled {
    background-color: $input-bg-disabled;
    box-shadow: 0 0 0 2px $input-bg-disabled;
  }
}
</style>