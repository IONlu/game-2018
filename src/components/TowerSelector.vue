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
            <div :class="$style.price">
                <fa-icon icon="dollar-sign" /> {{ getPrice(tower) }}
            </div>
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
        position: relative;
    }

    .image {
        width: 100%;
        padding-top: 100%;
        background-size: 150%;
        background-repeat: no-repeat;
        background-position: center 20%;
    }

    .price {
        position: absolute;
        bottom: 0.5em;
        right: 0.5em;;
        font-size: 0.5em;
    }
</style>

<script>
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
        getImageStyle (tower) {
            return {
                backgroundImage: `url(${this.towers[tower].image})`
            }
        },

        getPrice (tower) {
            return this.towers[tower].price
        },

        onTowerClick (tower) {
            this.selected = tower
            this.$emit('select', tower)
        }
    }
}
</script>
