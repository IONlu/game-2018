<template>
    <div :class="$style.mapSelector">
        <div :class="$style.logoContainer">
            <img
                :class="$style.logo"
                src="../assets/svg/logo.svg">
        </div>
        <table :class="$style.mapTable">
            <thead>
                <tr>
                    <td colspan="4"><h3>Select to play</h3></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        v-for="(map, index) in maps"
                        :key="index"
                        @click="playMap(map.name)">
                        <img
                            :class="$style.mapImage"
                            :src="map.image">
                        <div>
                            {{ map.name }}
                        </div>
                    </td>
                </tr>
                <tr :class="$style.buttons">
                    <td
                        colspan="2"
                        @click="showHowto">
                        <div>How to play</div>
                    </td>
                    <td
                        colspan="2"
                        @click="showHighscores">
                        <div>Highscores</div>
                    </td>
                </tr>
            </tbody>
        </table>
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

    @media all and (max-width:1000px){
        .mapTable{
            width:100%;
            border-spacing: 50px;

            td{
                display:block;
                width:100%;
                margin-bottom: 30px;
                cursor: pointer;
            }

            tr{
                display:block;
                margin-bottom:30px;
            }

            .buttons {
                td {
                    text-align: center;
                    height: 10vmin;
                    div {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }

    .mapTable {
        margin-top: 50px;
        width: 100%;
        font-size: 4vmin;
        border-spacing: 50px;

        thead {
            tr {
                text-align: center;
            }
        }

        tbody {
            tr {
                td {
                    text-align: center;
                    border: 1px solid white;
                    cursor: pointer;
                }
            }
        }

        .buttons {
            height: 10vmin;

            td {
                text-align: center;
                vertical-align: middle;
            }
        }
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
