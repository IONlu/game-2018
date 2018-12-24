<template>
    <div :class="$style.highscores">
        <div :class="$style.logoContainer">
            <div
                :class="$style.backButton"
                @click="back"
            >
                &#8249; Back
            </div>
            <img
                :class="$style.logo"
                src="../assets/svg/logo.svg">
        </div>
        <table :class="$style.highscoreTable">
            <thead>
                <tr>
                    <td colspan="4"><h3>Highscores</h3></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        v-for="(map, index) in maps"
                        :key="index"
                        @click="playMap(map.name)">
                        <table>
                            <thead>
                                <tr>
                                    <td colspan="2">
                                        <img
                                            :class="$style.mapImage"
                                            :src="map.image">
                                        {{ map.name }}
                                    </td>
                                </tr>
                                <tr><td colspan="2"><hr></td></tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(score, index) in getHighscoresByMap(map.name)"
                                    :key="score[__id]">
                                    <td>{{ index + 1 }}. {{ score.player }}</td>
                                    <td>{{ score.waveReached }}</td>
                                </tr>
                                <tr v-if="getHighscoresByMap(map.name).length === 0">
                                    <td colspan="2">No highscores</td>
                                </tr>
                            </tbody>
                        </table>
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
        overflow: hidden;
    }

    .highscores {
        overflow: auto;
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

    @media all and (min-width:1280px){
        .highscoreTable {
            margin-top: 50px;
            width: 100%;
            font-size: 3vmin;
            border-spacing: 50px;

            thead {
                tr {
                    text-align: center;
                }
            }

            tbody {
                tr {
                    td {
                        border: 1px solid white;
                        text-align: center;
                        cursor: pointer;
                        font-size: 2vmin;

                        table {
                            width: 100%;
                            thead {
                                tr {
                                    td {
                                        border: none;
                                    }
                                }
                            }
                            tbody {
                                tr {
                                    td {
                                        border: 0px;
                                        text-align: center;
                                    }
                                    td:first-child {
                                        width: 60%;
                                    }
                                    td:last-child {
                                        width: 40%;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @media all and (max-width:1280px){
        .highscoreTable {
            width:100%;
            border-spacing: 20px;

            thead {
                tr {
                    text-align: center;
                }
            }

            tbody {
                tr {
                    td {
                        border: 1px solid white;
                        display:block;
                        width:100%;
                        margin-bottom: 30px;
                        cursor: pointer;
                        table {
                            width: 100%;
                            thead {
                                td {
                                    border: none;
                                }
                            }
                            tr {
                                td {
                                    display: table-cell;
                                    border: 0px;
                                }
                            }
                        }
                    }

                }
            }
        }
    }

    .header {
        display: flex;
        justify-content: center;
    }

    .logoContainer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-right: 5vmin;
        padding-left: 5vmin;
        padding-top: 5vmin;
    }

    .backButton {
        cursor: pointer;
        padding: 20px;
    }

    .logo {
        width: 30vmin;
    }

    .mapImage {
        height: 5vmin;
    }

</style>

<script>
import axios from 'axios'
import maps from '../config/maps'

export default {
    name: 'Highscores',

    data () {
        return {
            highscores: [],
            maps: maps
        }
    },

    computed: {

    },

    mounted () {
        this.getAsyncHighscores()
    },

    methods: {
        getAsyncHighscores () {
            return axios({
                method: 'get',
                url: '/highscores'
            }).then((response) => {
                this.handleAsyncGetHighscores(response)
            }).catch((error) => {
                this.handleRequestError(error)
            })
        },

        handleAsyncGetHighscores ({ data }) {
            this.highscores = data
        },

        handleRequestError (error) {
            console.log(error)
        },

        getHighscoresByMap (map) {
            return this.highscores.filter((score) => {
                return score.map === map
            }).slice(0, 10)
        },

        back () {
            this.$router.push({
                path: '/'
            })
        }
    }
}

</script>
