<template>
    <div :class="$style.highscores">
        <div :class="$style.logoContainer">
            <img
                :class="$style.logo"
                src="../assets/svg/logo.svg">
        </div>
        <div :class="$style.header">
            <h3>Highscores</h3>
        </div>
        <div
            v-if="highscores"
            :class="$style.highscoresContainer">
            <div
                v-for="(map, index) in maps"
                :key="index"
                :class="$style.mapHighscore"
            >
                <div :class="$style.highscoreHeader">
                    <img
                        :class="$style.mapImage"
                        :src="map.image">
                    <h4>Map {{ index }}</h4>
                </div>
                <div
                    v-for="(score, index) in getHighscoresByMap(index)"
                    :key="score['_id']"
                    :class="$style.entry"
                >
                    <div :class="$style.playerName">
                        {{ index + 1 }}. {{ score.player }}
                    </div>
                    <div :class="$style.score">
                        {{ score.waveReached }}
                    </div>
                </div>
                <div
                    v-if="getHighscoresByMap(index).length === 0"
                    :class="$style.entry">
                    No highscores
                </div>
            </div>
        </div>
    </div>
</template>

<style module>

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

    .header {
        display: flex;
        justify-content: center;
    }

    .logoContainer {
        display: flex;
        justify-content: flex-end;
        padding-right: 5vmin;
        padding-top: 5vmin;
    }

    .logo {
        width: 30vmin;
    }

    .highscoresContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    @media screen and (max-width: 1000px) {
        .mapHighscore {
            min-width: 50vmin;
        }
    }

    @media screen and (min-width: 1000px) {
        .mapHighscore {
            min-width: 40vmin;
        }
    }

    .mapHighscore {
        display: flex;
        flex: 1;
        justify-content: flex-start;
        border: 1px solid white;
        margin: 3vmin;
        font-size: .6em;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(0, 79, 132, 0.2);
        flex-basis: 1;
        max-width: 60vmin;
        min-height: 20vmin;
    }

    .highscoreHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h4 {
            margin: 0;
        }
        padding-bottom: 30px;
        border-bottom: 1px solid white;
        margin-bottom: 30px;
    }

    .mapImage {
        height: 5vmin;
    }

    .entry {
        display: flex;
        justify-content: space-between;
    }

    .playerName {
        /* text-align: center; */
        margin: 10px;
    }

    .score {
        /* text-align: center; */
        margin: 10px;
    }

</style>

<script>
import axios from 'axios'
import maps from '../config/maps'

export default {
    name: 'Highscores',

    data () {
        return {
            highscores: null,
            maps: maps
        }
    },

    computed: {

    },

    mounted () {
        axios.defaults.baseURL = 'http://192.168.0.63:3000'
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
            })
        }
    }
}

</script>
