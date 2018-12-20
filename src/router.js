import Vue from 'vue'
import Router from 'vue-router'
import MapSelector from './views/MapSelector.vue'
import Highscores from './views/Highscores.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'MapSelector',
            component: MapSelector
        },
        {
            path: '/highscores',
            name: 'Highscores',
            component: Highscores
        }
    ]
})
