<template>
  <div class="container-flluid">
    <h1>Servidor de CI</h1>
    <hr>
    <div class="alert alert-warning" v-if="baseUrl == ''">
      <strong>Por favor, antes de continuar configure la ip del ESP32.</strong>
    </div>
    <div class="row">
      <div class="col-4">
        <h3 class="mb-3">Servidor a utilizar: </h3>
        <button class="btn" :disabled="baseUrl == ''" @click="servidorCISeleccionado('TravisCI')" :class="servidorCI == 'TravisCI' ? 'btn-primary' : 'btn-outline-primary'">
          Travis CI
        </button>
        <button class="btn ml-2" :disabled="baseUrl == ''" @click="servidorCISeleccionado('CircleCI')" :class="servidorCI == 'CircleCI' ? 'btn-primary' : 'btn-outline-primary'">
          Circle CI
        </button>
      </div>
      <div class="col-4">
        <h3 class="mb-3">Repositorio: </h3>
        <select v-if="servidorCI == 'TravisCI'" class="form-control" :disabled="servidorCI == '' || baseUrl == ''">
          <option value="">Seleccione...</option>
          <option v-for="repositorioCircleCI in repositoriosCircleCI" :key="repositorioCircleCI.nombre" :value="repositorioCircleCI.nombre">{{repositorioCircleCI.nombre}}</option>
        </select>

        <select v-else class="form-control" :disabled="servidorCI == '' || baseUrl == ''">
          <option value="">Seleccione...</option>
          <option v-for="repositorioTravisCI in repositoriosTravisCI" :key="repositorioTravisCI.nombre" :value="repositorioTravisCI.nombre">{{repositorioTravisCI.nombre}}</option>
        </select>
      </div>
      <div class="col-4">
        <h3 class="mb-3">Token de acceso: </h3>
        <input type="text" class="form-control" v-model="tokenAcceso" :disabled="servidorCI == ''">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-4">
        <button @click="enviarServidorCI" class="btn btn-lg btn-primary btn-block" :disabled="!puedeGuardar">
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
  name: 'HelloWorld',
  data () {
    return {
      servidorCI: '',
      tokenAcceso: '',
      repositorioId: '',

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
      if(servidorCI == 'TravisCI') {
        this.tokenAcceso = 'asd'
      } else if(servidorCI == 'CircleCI') {
        this.tokenAcceso = 'asdsad'
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
        this.repositoriosTravisCI = response.data.repositories.filter(e => e.active).map(e => {
          return {
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
          repositorioId: this.repositorioId
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
    puedeGuardar () {
      return this.tokenAcceso != '' && this.repositorioId != '' && this.servidorCI != ''
    }
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