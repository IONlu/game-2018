import Vue from 'vue'
import Router from 'vue-router'
import MapSelector from './views/MapSelector.vue'
import Highscores from './views/Highscores.vue'
import Game from './views/Game.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            alias: '/select',
            name: 'Select',
            component: MapSelector
        },
        {
            path: '/highscores',
            name: 'Highscores',
            component: Highscores
        },
        {
            path: '/play/:mapIndex',
            name: 'Play',
            component: Game
        }
    ]
})
