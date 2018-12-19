<template>
    <div :class="$style.container">
        <div
            v-for="(data, tower) in towers"
            :key="tower"
            :class="$style.tower"
            @click="onTowerClick(tower)"
        >
            <div
                :class="$style.image"
                :style="getImageStyle(tower)"
            />
        </div>
    </div>
</template>

<style module>
    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 0.5em;
        grid-row-gap: 0.5em;
        margin: 0.5em;
    }

    .tower {
        border: 2px solid #333;
        background: #AAA;
        padding: 1vmin;
    }

    .image {
        width: 100%;
        padding-top: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
</style>

<script>
import TowerAssets from '../assets/tower'
import TowerConfig from '../config/towers'

export default {
    data () {
        return {
            selected: null
        }
    },

    computed: {
        towers () {
            return TowerConfig
        }
    },

    methods: {
        getTowerImage (tower) {
            return TowerAssets[this.towers[tower].cannon[0]]
        },

        getImageStyle (tower) {
            return {
                backgroundImage: `url(${this.getTowerImage(tower)})`
            }
        },

        onTowerClick (tower) {
            this.selected = tower
            this.$emit('select', tower)
        }
    }
}
</script>
