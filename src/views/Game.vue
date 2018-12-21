<template>
    <game
        v-if="map"
        :key="mapName"
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
        map () {
            return this.mapByName
        },

        mapByName () {
            return maps.find((map) => {
                return map.name === this.$route.params.mapName
            })
        },

        mapName () {
            this.mapByName.name || 'serpent'
        }
    }
}
</script>
