<template>
  <div id="app">
    <div class="wrapper">
        <nav id="sidebar">
            <div class="sidebar-header">
                <h3>ESP32 Baliza</h3>               
            </div>

            <ul class="list-unstyled components">
                <li :class="ventanaActual == 'Conectividad' ? 'active' : ''">
                    <a href="#" class="text-white" style="text-decoration: none;" @click="ventanaActual = 'Conectividad'">
                        <i class="fas fa-wifi"></i>
                        Conectividad
                    </a>
                </li>
                <li :class="ventanaActual == 'Servidor' ? 'active' : ''">
                    <a href="#" class="text-white" style="text-decoration: none;" @click="ventanaActual = 'Servidor'">
                        <i class="fas fa-server"></i>
                        Servidor CI
                    </a>
                </li>
                <li :class="ventanaActual == 'Monitor' ? 'active' : ''">
                    <a href="#" class="text-white" style="text-decoration: none;" @click="ventanaActual = 'Monitor'">
                        <i class="fas fa-desktop"></i>
                        Monitor
                    </a>
                </li>
            </ul>

            <div class="pl-2 pr-2">
                <h5>Ip</h5>
                <i class="fas fa-clock"></i> {{segundosProximaActualizacionIp}}
                <br>
                {{ipBaliza.length > 0 ? ipBaliza : 'En espera'}} 
            </div>

            <hr>

            <div class="pl-2 pr-2">
                <h5>Estado
                </h5>
                <i class="fas fa-clock"></i> {{segundosProximaActualizacionEstado}}
                <br>
                <span :class="obtenerColorEstado">
                    <i class="fa fa-circle"></i>
                </span>
                 <br>
            </div>
        </nav>

        <!-- Page Content  -->
        <div id="content">     
            <conectividad v-if="ventanaActual == 'Conectividad'"></conectividad>
            <servidor v-if="ventanaActual == 'Servidor'"></servidor>
            <monitor v-if="ventanaActual == 'Monitor'"></monitor>
        </div>
    </div>
</div>
</template>

<script>

import axios from 'axios'

import Conectividad from './components/Conectividad.vue'
import Servidor from './components/Servidor.vue'
import Monitor from './components/Monitor.vue'

const TIEMPO_ACTUALIZACION_IP = 10 //segundos
const TIEMPO_ACTUALIZACION_ESTADO = 10 //segundos

export default {
    name: 'app',
    components: {
        'conectividad': Conectividad,
        'servidor': Servidor,
        'monitor': Monitor
    },
    data () {
        return {
            ventanaActual: 'Conectividad',

            estadoBaliza: 0,

            segundosProximaActualizacionIp: TIEMPO_ACTUALIZACION_IP,
            segundosProximaActualizacionEstado: TIEMPO_ACTUALIZACION_ESTADO,

            buscarIpBalizaHook: null,
            buscarEstadoBalizaHook: null
        } 
    },
    created () {
        this.buscarIpBaliza();
        this.buscarEstadoBaliza();
        this.buscarIpBalizaHook = setInterval(this.buscarIpBaliza, TIEMPO_ACTUALIZACION_IP * 1000);
        this.buscarEstadoBalizaHook = setInterval(this.buscarEstadoBaliza, TIEMPO_ACTUALIZACION_IP * 1000);
    },
    destroyed () {
        clearInterval(this.buscarIpBalizaHook)
        clearInterval(this.buscarEstadoBalizaHook)
    },
    methods: {
        buscarIpBaliza() {
            this.cuentaRegresivaIpBaliza();
            axios({
                method: 'GET',
                url: 'https://esp32-api.herokuapp.com/api/v1/ip'
            }).then(response => {
                this.ipBaliza = response.data.ip || ''
            }).catch(error => {
                this.ipBaliza = ''
            })
        },
        buscarEstadoBaliza() {
            this.estadoBaliza = 0;
            if(this.ipBaliza.length > 0) {
                this.cuentaRegresivaEstado();
                axios({
                    method: 'GET',
                    url: `http://${this.ipBaliza}/ping`,                 
                    timeout: 5000
                }).then(response => {
                    this.estadoBaliza = 1
                }).catch(error => {
                    this.estadoBaliza = 2
                })
            }
        },
        cuentaRegresivaIpBaliza () {
            if(this.segundosProximaActualizacionIp > 0) {
                setTimeout(() => {
                    this.segundosProximaActualizacionIp -= 1
                    this.cuentaRegresivaIpBaliza()
                }, 1000)
            } else {
                this.segundosProximaActualizacionIp = TIEMPO_ACTUALIZACION_IP
            }
        },
        cuentaRegresivaEstado () {
            if(this.segundosProximaActualizacionEstado > 0) {
                setTimeout(() => {
                    this.segundosProximaActualizacionEstado -= 1
                    this.cuentaRegresivaEstado()
                }, 1000)
            } else {
                this.segundosProximaActualizacionEstado = TIEMPO_ACTUALIZACION_IP
            }
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
        obtenerColorEstado () {
            if(this.estadoBaliza == 0) return 'text-dark'
            else if(this.estadoBaliza == 1) return 'bg-exitoso'
            else return 'text-danger'
        }
    }
}

</script>

<style>

.bg-exitoso {
    color: #0b6720
}

body {
    font-family: 'Poppins', sans-serif !important;
    background: #fafafa;
}

p {
    font-family: 'Poppins', sans-serif !important;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a,
a:hover,
a:focus {
    color: inherit !important;
    text-decoration: none;
    transition: all 0.3s;
}

.navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
}

.line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ddd;
    margin: 40px 0;
}

i,
span {
    display: inline-block;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */

.wrapper {
    display: flex;
    align-items: stretch;
}

#sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #7386D5;
    color: #fff;
    transition: all 0.3s;
}

#sidebar.active {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
}

#sidebar.active .sidebar-header h3,
#sidebar.active .CTAs {
    display: none;
}

#sidebar.active .sidebar-header strong {
    display: block;
}

#sidebar ul li a {
    text-align: left;
}

#sidebar.active ul li a {
    padding: 20px 10px;
    text-align: center;
    font-size: 0.85em;
}

#sidebar.active ul li a i {
    margin-right: 0;
    display: block;
    font-size: 1.8em;
    margin-bottom: 5px;
}

#sidebar.active ul ul a {
    padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
    top: auto;
    bottom: 10px;
    right: 50%;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    transform: translateX(50%);
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #6d7fcc;
}

#sidebar .sidebar-header strong {
    display: none;
    font-size: 1.8em;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}

#sidebar ul li a:hover {
    color: #7386D5 !important;
    background: #fff !important;
}

#sidebar ul li a i {
    margin-right: 10px;
}

#sidebar ul li.active>a,
a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
}

a[data-toggle="collapse"] {
    position: relative;
}

.dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
}

ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
}

ul.CTAs {
    padding: 20px;
}

ul.CTAs a {
    text-align: center;
    font-size: 0.9em !important;
    display: block;
    border-radius: 5px;
    margin-bottom: 5px;
}

a.download {
    background: #fff;
    color: #7386D5;
}

a.article,
a.article:hover {
    background: #6d7fcc !important;
    color: #fff !important;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
    width: 100%;
    padding: 20px;
    min-height: 100vh;
    transition: all 0.3s;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
    #sidebar {
        min-width: 80px;
        max-width: 80px;
        text-align: center;
        margin-left: -80px !important;
    }
    .dropdown-toggle::after {
        top: auto;
        bottom: 10px;
        right: 50%;
        -webkit-transform: translateX(50%);
        -ms-transform: translateX(50%);
        transform: translateX(50%);
    }
    #sidebar.active {
        margin-left: 0 !important;
    }
    #sidebar .sidebar-header h3,
    #sidebar .CTAs {
        display: none;
    }
    #sidebar .sidebar-header strong {
        display: block;
    }
    #sidebar ul li a {
        padding: 20px 10px;
    }
    #sidebar ul li a span {
        font-size: 0.85em;
    }
    #sidebar ul li a i {
        margin-right: 0;
        display: block;
    }
    #sidebar ul ul a {
        padding: 10px !important;
    }
    #sidebar ul li a i {
        font-size: 1.3em;
    }
    #sidebar {
        margin-left: 0;
    }
    #sidebarCollapse span {
        display: none;
    }
}
</style>