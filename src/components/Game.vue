<template>
    <resize-observer
        @resize="onResize"
    >
        <div
            :class="$style.container"
        />
    </resize-observer>
</template>

<style module>
    .container {
        margin: 0 auto;
        width: 100vmin;
        height: 100vmin;
    }

    .renderer {
        width: 100%;
        height: 100%;
    }
</style>

<script>
import ResizeObserver from './ResizeObserver'
import { autoDetectRenderer, Container } from 'pixi.js'
import Ticker from '../Ticker'

export default {
    name: 'Game',

    components: {
        ResizeObserver
    },

    created () {
        this.ticker = new Ticker(30)
    },

    mounted () {
        this.renderer = autoDetectRenderer(
            this.$el.clientWidth,
            this.$el.clientHeight,
            {
                antialias: true,
                transparent: false,
                resolution: 1,
                backgroundColor: 0x87CEEB
            }
        )
        this.renderer.view.classList.add(this.$style.renderer)
        this.$el.appendChild(this.renderer.view)

        this.layers = new Container()
        this.renderer.render(this.layers)

        this.ticker.on('render', this.renderer.render)
    },

    beforeDestroy () {
        this.ticker.off('render', this.renderer.render)
        this.renderer.destroy()
    },

    methods: {
        onResize ({ height, width }) {
            if (this.renderer) {
                this.renderer.resize(width, height)
            }
        }
    }
}
</script>
