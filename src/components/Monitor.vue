<template>
  <div class="container-fluid">
    <h1>Utilizando: {{servidorCI}}</h1>
    <hr>
    <div v-if="mostrarError" class="alert alert-danger">
      <strong>Configure el servidor de integración continua.</strong>
    </div>
    <h3>- Repositorio: </h3>
    <h4>{{build.name}}</h4>
    <br>
    <h3>- Inició a las: </h3>
    <h4>{{build.startedAt}}</h4>
    <br>
    <h3>- Terminó a las: </h3>
    <h4>{{build.finishedAt}}</h4>
    <br>
    <h3>- Estado: </h3>
    <span :class="obtenerBuildClass">
      <i class="fa fa-circle fa-4x"></i>
    </span>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      mostrarError: false,
      hookEstadoBuild: null,
      estadoBuild: "Desconocido",
      
      build: {
        name: '',
        startedAt: '',
        finishedAt: ''
      }
    }
  },
  created () {
    this.obtenerEstadoUltimoBuild();
    this.hookEstadoBuild = setInterval(this.obtenerEstadoUltimoBuild, 5000)
  },
  destroyed () {
    clearInterval(this.hookEstadoBuild)
  },
  methods: {
    obtenerEstadoUltimoBuild () {
      if(this.servidorCI == 'TravisCI') this.obtenerEstadoUltimoBuildTravisCI()
      else if(this.servidorCI == 'CircleCI') this.obtenerEstadoUltimoBuildCircleCI()
      else this.mostrarError = true
    },
    obtenerEstadoUltimoBuildTravisCI () {
      axios({
        method: 'GET',
        url: `https://api.travis-ci.org/repo/${this.identificadorDelRepositorio}/builds?limit=1`,
        headers: {
          "Authorization": `token ${this.tokenAcceso}`,
          "Travis-API-Version": "3"
        }
      }).then(response => {
        let ultimoBuild = response.data.builds[0];
        let estadoBuildString = ultimoBuild.state
        if(estadoBuildString == "created") this.estadoBuild = "EnCurso";               
        else if(estadoBuildString == "started") this.estadoBuild = "EnCurso";    
        else if(estadoBuildString == "failed") this.estadoBuild = "Fallido";
        else if(estadoBuildString == "passed") this.estadoBuild = "Exitoso";
        else this.estadoBuild = "Desconocido";

        this.build = {
          name: ultimoBuild.repository.name,
          startedAt: ultimoBuild.started_at,
          finishedAt: ultimoBuild.finished_at
        }
      }).catch(error => {
        console.log(error);
      })
    },
    obtenerEstadoUltimoBuildCircleCI () {
      axios({
        method: 'GET',
        url: `https://circleci.com/api/v1.1/project/github/leandrofiorenzo/${this.identificadorDelRepositorio}?circle-token="${this.tokenAcceso}&limit=1`
      }).then(response => {
        let ultimoBuild = response.data[0]
        let estadoBuildString = ultimoBuild.status
        if(estadoBuildString == "queued") this.estadoBuild = "EnCurso";                    
        else if(estadoBuildString == "running") this.estadoBuild = "EnCurso";
        else if(estadoBuildString == "failed") this.estadoBuild = "Fallido";
        else if(estadoBuildString == "success") this.estadoBuild = "Exitoso";
        else this.estadoBuild = "Desconocido";

        this.build = {
          name: ultimoBuild.reponame,
          startedAt: ultimoBuild.start_time,
          finishedAt: ultimoBuild.stop_time
        }
      }).catch(error => {
        console.log(error)
      })
    },
  },
  computed: {
    obtenerBuildClass() {
      if(this.estadoBuild == "EnCurso") return 'text-warning'
      else if(this.estadoBuild == "Fallido") return 'text-danger'
      else if(this.estadoBuild == "Exitoso") return 'text-success'
      else return 'text-dark'
    },
    servidorCI() {
      return this.$store.getters.getServidorCI
    },
    tokenAcceso() {
      return this.$store.getters.getTokenAcceso
    },
    identificadorDelRepositorio() {
      return this.$store.getters.getIdentificadorDelRepositorio
    }
  }
}
</script>
