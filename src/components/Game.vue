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
        width: 100vw;
        height: 100vh;
        background: url(../assets/Background.svg) center center no-repeat fixed;
        background-size: cover;
    }

    .renderer {
        width: 100%;
        height: 100%;
    }
</style>

<script>
import AStar from '../AStar'
import ResizeObserver from './ResizeObserver'
import { autoDetectRenderer, Container, loaders, Sprite, Graphics, particles } from 'pixi.js'
import Viewport from 'pixi-viewport'
import Ticker from '../Ticker'
import BugSvg from '../assets/bug1.svg'
import Vector from '../Vector'

// https://en.wikipedia.org/wiki/Linear_interpolation
const lerp = (v1, v2, dt) => {
    return (1 - dt) * v1 + dt * v2
}

export default {
    name: 'Game',

    components: {
        ResizeObserver
    },

    data () {
        return {
            tileSize: 100,
            divide: 2,
            map: {
                width: 10,
                height: 11,
                data: 'SFFFFFFFFF' +
                      'WWWWWWWWWF' +
                      'FFFFFFFFFF' +
                      'FWWWWWWWWW' +
                      'FFFFFFFFFF' +
                      'WWWWWWWWWF' +
                      'FFFFFFFFFF' +
                      'FWWWWWWWWW' +
                      'FFFFFFFFFF' +
                      'WWWWWWWWWF' +
                      'EFFFFFFFFF'
            },

            resources: {},

            bugs: []
        }
    },

    computed: {
        mapSize () {
            return {
                width: this.map.width * this.tileSize,
                height: this.map.height * this.tileSize
            }
        },

        viewportSize () {
            return {
                width: this.mapSize.width,
                height: this.mapSize.height
            }
        },

        startPoint () {
            let index = [ ...this.map.data ].findIndex(type => type === 'S')
            return this.index2Point(index)
        },

        endPoint () {
            let index = [ ...this.map.data ].findIndex(type => type === 'E')
            return this.index2Point(index)
        },

        walls () {
            let walls = []
            let mapDataArray = [ ...this.map.data ]
            mapDataArray.forEach((type, index) => {
                if (type === 'W') {
                    let { x, y } = this.index2Point(index)
                    walls.push(`${x}:${y}`)
                }
            })
            return new Set(walls)
        },

        heatMap () {
            let heatMap = new Array(this.map.width * this.map.height * this.divide * this.divide).fill(Infinity)
            AStar(this.endPoint, (x, y) => {
                return x < 0 || y < 0 || x >= this.map.width || y >= this.map.height || this.walls.has(`${x}:${y}`)
            }, this.divide).forEach(({ x, y, weight }) => {
                heatMap[(y * this.map.width * this.divide) + x] = weight
            })
            return heatMap
        },

        flowField () {
            return this.heatMap.map((weight, index) => {
                if (weight === Infinity) {
                    return null
                }
                let width = this.map.width * this.divide
                let x1 = Number.isInteger(this.heatMap[index - 1]) && (index % width > 1)
                    ? this.heatMap[index - 1]
                    : weight + 0.2
                let x2 = Number.isInteger(this.heatMap[index + 1]) && (index % width < width - 1)
                    ? this.heatMap[index + 1]
                    : weight + 0.2
                let y1 = Number.isInteger(this.heatMap[index - (width * this.divide)])
                    ? this.heatMap[index - (width * this.divide)]
                    : weight + 0.2
                let y2 = Number.isInteger(this.heatMap[index + (width * this.divide)])
                    ? this.heatMap[index + (width * this.divide)]
                    : weight + 0.2

                return (new Vector(
                    x1 - x2,
                    y1 - y2
                )).normalize()
            })
        }
    },

    created () {
        this.ticker = new Ticker(10)

        // init asset loader
        this.loader = new loaders.Loader()

        this.stage = new Container()

        // create Viewport
        this.viewport = new Viewport()
        this.viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate()
        this.stage.addChild(this.viewport)

        this.loadAssets()

        this.ticker.start()

        // draw map borders
        let mapBorders = new Graphics()
        mapBorders.lineStyle(1, 0xFF0000)
        mapBorders.drawRect(0, 0, this.mapSize.width, this.mapSize.height)
        this.viewport.addChild(mapBorders)

        // draw tiles
        mapBorders.lineStyle(0)
        let tileGraphics = [ ...this.map.data ].map((type, index) => {
            let { x, y } = this.index2Point(index)
            let tile = new Graphics()
            let color = 0x000000
            switch (type) {
                case 'W':
                    color = 0xFFFFFF
                    break
                case 'S':
                    color = 0x00FF00
                    break
                case 'E':
                    color = 0xFF0000
                    break
            }
            tile.beginFill(color, 0.5)
            tile.drawRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
            tile.endFill()
            this.viewport.addChild(tile)
            return tile
        })
    },

    mounted () {
        this.renderer = autoDetectRenderer(
            this.$el.clientWidth,
            this.$el.clientHeight,
            {
                antialias: true,
                resolution: 1,
                transparent: true
            }
        )
        this.renderer.view.classList.add(this.$style.renderer)
        this.$el.appendChild(this.renderer.view)

        this.viewport.interaction = this.renderer.interaction
        this.viewport.resize(
            this.$el.clientWidth,
            this.$el.clientHeight,
            this.viewportSize.width,
            this.viewportSize.height
        )
        this.viewport.fitWorld()
        this.viewport.moveCenter(this.viewportSize.width / 2, this.viewportSize.height / 2)

        this.render()
        this.ticker.on('render', this.render)
        this.ticker.on('update', this.update)
    },

    beforeDestroy () {
        this.ticker.removeListener('render', this.renderer.render)

        // cleanup pixi
        this.stage.removeChildren()
        this.renderer.destroy()
        for (let key in this.resources) {
            this.resources[key].texture.destroy(true)
        }
    },

    methods: {
        index2Point (index) {
            return new Vector(
                index % this.map.width,
                Math.floor(index / this.map.width)
            )
        },

        render (dt) {
            this.bugs.forEach(bug => {
                bug.sprite.position.x = lerp(bug.position.x, bug.position.x + bug.velocity.x, dt)
                bug.sprite.position.y = lerp(bug.position.y, bug.position.y + bug.velocity.y, dt)
                bug.sprite.rotation = bug.velocity.angle()
            })
            this.renderer.render(this.stage)
        },

        update () {
            this.bugs.forEach(bug => {
                bug.position.add(bug.velocity)

                let x = Math.floor(bug.position.x / (this.tileSize / this.divide))
                let y = Math.floor(bug.position.y / (this.tileSize / this.divide))

                if (
                    Math.floor(x / this.divide) === this.endPoint.x &&
                    Math.floor(y / this.divide) === this.endPoint.y
                ) {
                    this.moveBugToStart(bug)
                    return
                }

                let flowFieldIndex = (y * this.map.width * this.divide) + x
                let vec = this.flowField[flowFieldIndex] || new Vector()

                bug.velocity.set(vec).multiply(10)
            })
        },

        loadAssets () {
            this.loader.add('bug', BugSvg)
            this.loader.load(this.onLoad)
        },

        onResize ({ height, width }) {
            if (this.renderer) {
                this.renderer.resize(width, height)
            }
            this.viewport.resize(
                width,
                height,
                this.viewportSize.width,
                this.viewportSize.height
            )
        },

        onLoad (loader, resources) {
            this.resources = resources

            this.startWave()
        },

        moveBugToStart (bug) {
            bug.position.set(
                this.startPoint.x * this.tileSize + (this.tileSize / 2),
                this.startPoint.y * this.tileSize + (Math.random() * this.tileSize)
            )
            bug.velocity.set(0, 0)
        },

        spawnBug () {
            let sprite = new Sprite(this.resources.bug.texture)
            sprite.scale.set(0.2)
            sprite.anchor.set(0.5)
            this.viewport.addChild(sprite)

            let bug = {
                sprite,
                position: new Vector(),
                velocity: new Vector()
            }
            this.bugs.push(bug)

            this.moveBugToStart(bug)
        },

        startWave () {
            let count = 100
            let _spawn = () => {
                if (count > 0) {
                    count--
                    this.spawnBug()
                    setTimeout(() => {
                        _spawn()
                    }, 1000)
                }
            }
            _spawn()
        }
    }
}
</script>
