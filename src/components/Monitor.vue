<template>
  <div class="container-fluid">
    <h1>Monitor</h1>
    <hr>
    <div v-if="mostrarError" class="alert alert-danger">
      <strong>Configure el servidor de integración continua.</strong>
    </div>
    <div class="row">
      <div class="alert col-5" :class="obtenerBuildClass"> 
        Corriendo en {{servidorCI}}
        <h4>
          <icon :name="obtenerBuildIcon"></icon>
          {{build.name}}
        </h4>
        <br>
        <h6 v-if="obtenerDuracionBuild">
           <icon name="clock"></icon>
          {{obtenerDuracionBuild}} seg
        </h6> 
        <h6 v-else>
          En curso
        </h6>      
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      mostrarError: false,
      estadoBuild: '',
      
      build: {
        name: '',
        startedAt: null,
        finishedAt: null
      }
    }
  },
  created () {
    this.obtenerEstadoUltimoBuild();
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
        if(estadoBuildString == "created") this.estadoBuild = 'EnCurso';               
        else if(estadoBuildString == "started") this.estadoBuild = 'EnCurso';    
        else if(estadoBuildString == "failed") this.estadoBuild = 'Fallido';
        else if(estadoBuildString == "passed") this.estadoBuild = 'Exitoso';
        else this.estadoBuild = 'Desconocido';

        this.$forceUpdate();

        this.build = {
          name: ultimoBuild.repository.name,
          startedAt: ultimoBuild.started_at,
          finishedAt: ultimoBuild.finished_at
        }

        setTimeout(this.obtenerEstadoUltimoBuild, 5000);
      }).catch(error => {
        console.log(error);
        setTimeout(this.obtenerEstadoUltimoBuild, 5000);
      })
    },
    obtenerEstadoUltimoBuildCircleCI () {
      axios({
        method: 'GET',
        url: `https://circleci.com/api/v1.1/project/github/leandrofiorenzo/${this.identificadorDelRepositorio}?circle-token="${this.tokenAcceso}&limit=1`
      }).then(response => {
        let ultimoBuild = response.data[0]
        let estadoBuildString = ultimoBuild.status
        if(estadoBuildString == "queued") this.estadoBuild = 'EnCurso';                    
        else if(estadoBuildString == "running") this.estadoBuild = 'EnCurso';
        else if(estadoBuildString == "failed") this.estadoBuild = 'Fallido';
        else if(estadoBuildString == "success") this.estadoBuild = 'Exitoso';
        else this.estadoBuild = 'Desconocido';

        this.$forceUpdate();

        this.build = {
          name: ultimoBuild.reponame,
          startedAt: ultimoBuild.start_time,
          finishedAt: ultimoBuild.stop_time
        }
        setTimeout(this.obtenerEstadoUltimoBuild, 5000);
      }).catch(error => {
        console.log(error)
        setTimeout(this.obtenerEstadoUltimoBuild, 5000);
      })
    },
  },
  computed: {
    obtenerBuildClass() {
      if(this.estadoBuild == "EnCurso") return 'alert-info';
      else if(this.estadoBuild == "Fallido") return 'alert-danger';
      else if(this.estadoBuild == "Exitoso") return 'alert-success';
      else return 'alert-dark';
    },
    obtenerBuildIcon() {
      if(this.estadoBuild == "EnCurso") return 'running';
      else if(this.estadoBuild == "Fallido") return 'times';
      else if(this.estadoBuild == "Exitoso") return 'check';
      else return 'question';
    },
    obtenerDuracionBuild() {
      if(this.build.startedAt && this.build.finishedAt)
        return Math.floor(moment.duration(moment(this.build.finishedAt).diff(moment(this.build.startedAt))).asSeconds())
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
