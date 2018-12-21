<template>
    <game
        v-if="map"
        :key="mapIndex"
        :map="map"
    />
</template>

<script>
import Game from '../components/Game'
import maps from '../config/maps'

export default {
    components: {
        Game
    },

    computed: {
        mapIndex () {
            return parseInt(this.$route.params.mapIndex, 10) || 0
        },

        map () {
            return maps[this.mapIndex]
        }
    }
}
</script>
