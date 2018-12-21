<template>
    <div :class="$style.mapSelector">
        <div :class="$style.logoContainer">
            <img
                :class="$style.logo"
                src="../assets/svg/logo.svg">
        </div>
        <div :class="$style.header">
            <h3>Select to play</h3>
        </div>
        <div :class="$style.mapsContainer">
            <div
                v-for="(map, index) in maps"
                :key="index"
                :class="$style.mapContainer"
                @click="playMap(map.name)"
            >
                <img
                    :class="$style.mapImage"
                    :src="map.image">
                <div>
                    {{ map.name }}
                </div>
            </div>
        </div>
        <div :class="$style.mapsContainer">
            <div
                :class="$style.buttonContainer"
                @click="showHowto"
            >
                How to play
            </div>
            <div
                :class="$style.buttonContainer"
                @click="showHighscores"
            >
                Highscores
            </div>
        </div>
    </div>
</template>

<style module>
    html,
    body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: auto;
    }

    .mapSelector {
        overflow-y: auto;
        overflow-x: hidden;
        color: white;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        font-family: Arial, sans-serif;
        font-size: 4vmin;
        background: url(../assets/svg/Background.svg) center center no-repeat fixed;
        background-size: cover;

        * {
            box-sizing: border-box;
        }
    }

    .header {
        display: flex;
        justify-content: center;
    }

    .logoContainer {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        padding-right: 5vmin;
        padding-left: 5vmin;
        padding-top: 5vmin;
    }

    .logo {
        width: 30vmin;
    }

    .mapsContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        flex-wrap: wrap;
    }

    @media screen and (max-width: 1000px) {
        .mapContainer {
            min-width: 50vmin;
        }
    }

    @media screen and (min-width: 1000px) {
        .mapContainer {
            min-width: 40vmin;
        }
    }

    .mapContainer {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        border: 1px solid white;
        margin: 3vmin;
        font-size: .6em;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(0, 79, 132, 0.2);
        flex-basis: 1;
        max-width: 60vmin;
        min-height: 35vmin;
        cursor: pointer;
    }

    @media screen and (max-width: 1000px) {
        .buttonContainer {
            min-width: 50vmin;
        }
    }

    .buttonContainer {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        border: 1px solid white;
        margin: 3vmin;
        font-size: 1em;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(0, 79, 132, 0.2);
        cursor: pointer;
        font-weight: bold;
        min-height: 10vmin;
    }

    .mapImage {
        width: 25vmin;
        margin-bottom: 30px;
    }

</style>

<script>
import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faHeart, faAngleDoubleRight, faAngleDoubleLeft,
    faAngleDoubleUp, faAngleDoubleDown,
    faWater, faBug, faPlay, faDollarSign, faClock
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import maps from '../config/maps'

library.add(faHeart)
library.add(faAngleDoubleRight)
library.add(faAngleDoubleLeft)
library.add(faAngleDoubleUp)
library.add(faAngleDoubleDown)
library.add(faWater)
library.add(faBug)
library.add(faPlay)
library.add(faDollarSign)
library.add(faClock)
Vue.component('fa-icon', FontAwesomeIcon)

export default {
    name: 'MapSelector',

    data () {
        return {
            maps: maps
        }
    },

    methods: {
        playMap (name) {
            this.$router.push({
                name: 'Play',
                params: {
                    mapName: name
                }
            })
        },

        showHighscores () {
            this.$router.push({
                name: 'Highscores'
            })
        },

        showHowto () {
            this.$router.push({
                name: 'Howto'
            })
        }
    }
}
</script>
