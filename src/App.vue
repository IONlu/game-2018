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
import Game from './components/Game.vue'
import AStar from './components/test/AStar.vue'

export default {
    name: 'App',

    components: {
        Game,
        AStar
    }
}
</script>
