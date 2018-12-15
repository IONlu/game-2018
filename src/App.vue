<template>
    <game />
    <!-- <a-star /> -->
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>

<script>
import Vue from 'vue'
import Game from './components/Game.vue'
import AStar from './components/test/AStar.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faHeart, faAngleDoubleRight, faAngleDoubleLeft,
    faAngleDoubleUp, faAngleDoubleDown,
    faWater, faBug, faPlay
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHeart)
library.add(faAngleDoubleRight)
library.add(faAngleDoubleLeft)
library.add(faAngleDoubleUp)
library.add(faAngleDoubleDown)
library.add(faWater)
library.add(faBug)
library.add(faPlay)
Vue.component('fa-icon', FontAwesomeIcon)

export default {
    name: 'App',

    components: {
        Game,
        AStar
    }
}
</script>
