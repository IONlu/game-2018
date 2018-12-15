<template>
    <resize-observer
        @resize="onResize"
    >
        <div
            :class="mainClasses"
        >
            <div
                :class="$style.topBar"
            >
                <div>
                    <fa-icon icon="water" /> {{ wave }}
                </div>
                <div>
                    <fa-icon icon="bug" /> {{ bugsLeft }}
                </div>
                <div>
                    <fa-icon icon="heart" /> {{ health }}
                </div>
            </div>
            <div
                :class="panelClasses"
            >
                <div
                    :class="$style.panelToggle"
                    @click="togglePanel"
                >
                    <fa-icon :icon="togglePanelIcon" />
                </div>
                <div :class="$style.panelContent">
                    Left Panel
                    <button @click="onBuildTowerClick">Tower 1</button>
                </div>
            </div>
            <resize-observer
                @resize="onRenderContainerResize"
            >
                <div
                    ref="renderContainer"
                    :class="$style.renderContainer"
                />
            </resize-observer>
            <div
                :class="$style.nextWave"
                @click="nextWave"
            >
                <fa-icon icon="play" /> Next Wave
            </div>
        </div>
    </resize-observer>
</template>

<style module>
    .game {
        width: 100vw;
        height: 100vh;
        font-family: Arial, sans-serif;
        background: url(../assets/Background.svg) center center no-repeat fixed;
        background-size: cover;

        * {
            box-sizing: border-box;
        }
    }

    .renderContainer {
        display: inline-block;
        width: 70vw;
        height: calc(100vh - 5vmin);
    }

    .panel {
        float: left;
        width: 30vw;
        max-width: 100%;
        height: 95vh;
        background: #00000099;
        color: #FFF;
        border-style: solid;
        border-color: #999;
        border-width: 0 2px 0 0;
        display: inline-block;
    }

    .panelToggle {
        display: none;
        position: absolute;
        height: 50px;
        width: 50px;
        background: #00000099;
        color: #FFF;
        border-style: solid;
        border-color: #999;
        align-items: center;
        justify-content: center;
        font-size: 30px;
    }

    .mobile {
        .renderContainer {
            width: 100vw;
        }

        &.landscape {
            .panel {
                position: absolute;
                width: 300px;
                left: -300px;
                transition: left 0.2s;

                &.showPanel {
                    left: 0px;
                }
            }

            .panelToggle {
                display: flex;
                left: 100%;
                top: calc(50% - 25px);
                border-width: 2px 2px 2px 0;
                border-radius: 0 20px 20px 0;
            }
        }

        &.portrait {
            .panel {
                width: 100vw;
                position: absolute;
                height: 300px;
                max-height: 100vh;
                bottom: -300px;
                transition: bottom 0.2s;
                border-width: 2px 0 0 0;

                &.showPanel {
                    bottom: 0px;
                }
            }

            .panelToggle {
                display: flex;
                top: -50px;
                left: calc(50% - 25px);
                border-width: 2px 2px 0 2px;
                border-radius: 20px 20px 0 0;
            }
        }
    }

    .renderer {
        width: 100%;
        height: 100%;
    }

    .topBar {
        height: 5vmin;
        line-height: 5vmin;
        width: 100%;
        background: #00000099;
        color: #FFF;
        border-style: solid;
        border-color: #999;
        border-width: 0 0 2px 0;
        font-size: 3vmin;
        text-align: right;
        display: flex;
        justify-content: space-between;
        padding: 0 1em;
    }

    .panelContent {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .nextWave {
        position: absolute;
        border-radius: 20px;
        background: #00000099;
        color: #FFF;
        border-style: solid;
        border-color: #999;
        right: 1em;
        padding: 1em;
    }

    .landscape .nextWave {
        bottom: 1em;
    }

    .portrait .nextWave {
        top: calc(5vmin + 1em);
    }
</style>

<script>
import AStar from '../AStar'
import ResizeObserver from './ResizeObserver'
import { autoDetectRenderer, Container, loaders, Sprite, Graphics } from 'pixi.js'
import Viewport from 'pixi-viewport'
import Ticker from '../Ticker'
import Vector from '../Vector'
import BugAssets from '../assets/bugs'
import TowerAssets from '../assets/tower'

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
            bugs: [],
            towers: [],
            selectedTile: null,
            health: 100,
            bugsLeft: 0,
            wave: 0,
            screen: {
                width: window.clientWidth,
                height: window.clientHeight
            },
            showPanel: true,
            lastBugSpawned: true
        }
    },

    computed: {
        isMobile () {
            return this.screen.width <= 1000 || this.screen.height <= 1000
        },

        isPortrait () {
            return this.screen.width < this.screen.height
        },

        mainClasses () {
            return {
                [this.$style.game]: true,
                [this.$style.mobile]: this.isMobile,
                [this.$style.portrait]: this.isPortrait,
                [this.$style.landscape]: !this.isPortrait
            }
        },

        panelClasses () {
            return {
                [this.$style.panel]: true,
                [this.$style.showPanel]: this.showPanel
            }
        },

        mapSize () {
            return {
                width: this.map.width * this.tileSize,
                height: this.map.height * this.tileSize
            }
        },

        viewportSize () {
            return {
                width: this.mapSize.width + (2 * this.tileSize),
                height: this.mapSize.height + (2 * this.tileSize)
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
            AStar(this.endPoint, this.isBlocked, this.divide).forEach(({ x, y, weight }) => {
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
                    : weight
                let x2 = Number.isInteger(this.heatMap[index + 1]) && (index % width < width - 1)
                    ? this.heatMap[index + 1]
                    : weight
                let y1 = Number.isInteger(this.heatMap[index - (width * this.divide)])
                    ? this.heatMap[index - (width * this.divide)]
                    : weight
                let y2 = Number.isInteger(this.heatMap[index + (width * this.divide)])
                    ? this.heatMap[index + (width * this.divide)]
                    : weight

                return (new Vector(
                    x1 - x2,
                    y1 - y2
                )).normalize()
            })
        },

        pixel2TileRatio () {
            return this.divide / this.tileSize
        },

        togglePanelIcon () {
            if (this.isPortrait) {
                return this.showPanel
                    ? 'angle-double-down'
                    : 'angle-double-up'
            }
            return this.showPanel
                ? 'angle-double-left'
                : 'angle-double-right'
        }
    },

    watch: {
        selectedTile () {
            if (this.selectedTile) {
                this.uiContainer.addChild(this.selectedTileOverlay)
                this.selectedTileOverlay.position.set(
                    this.selectedTile.x * this.tileSize,
                    this.selectedTile.y * this.tileSize
                )
                this.showPanel = true
            } else {
                this.uiContainer.removeChild(this.selectedTileOverlay)
            }
        },

        isMobile () {
            this.showPanel = !this.isMobile
        }
    },

    created () {
        this.ticker = new Ticker(30)

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
        this.viewport.on('clicked', this.onClick)
        this.stage.addChild(this.viewport)

        // create container for the map
        this.mapContainer = new Container()
        this.viewport.addChild(this.mapContainer)

        // create container for the bugs
        this.bugContainer = new Container()
        this.viewport.addChild(this.bugContainer)

        // create container for towers
        this.towerContainer = new Container()
        this.viewport.addChild(this.towerContainer)

        // create container for the ui elements
        this.uiContainer = new Container()
        this.viewport.addChild(this.uiContainer)

        this.loadAssets()

        this.ticker.start()

        // draw tiles
        let tileGraphics = [ ...this.map.data ].map((type, index) => {
            let color
            switch (type) {
                case 'F':
                    color = 0x999999
                    break
                case 'S':
                    color = 0x00FF00
                    break
                case 'E':
                    color = 0xFF0000
                    break
                default:
                    return
            }
            let { x, y } = this.index2Point(index)
            let tile = new Graphics()
            tile.beginFill(color, 0.5)
            tile.drawRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
            tile.endFill()
            this.mapContainer.addChild(tile)
            return tile
        })

        // create selected tile overlay
        this.selectedTileOverlay = new Graphics()
        this.selectedTileOverlay.lineStyle(5, 0x3333FF, 0.7, 1)
        this.selectedTileOverlay.beginFill(0x3333FF, 0.5)
        this.selectedTileOverlay.drawRect(0, 0, this.tileSize, this.tileSize)
    },

    mounted () {
        this.renderer = autoDetectRenderer(
            this.$refs.renderContainer.clientWidth,
            this.$refs.renderContainer.clientHeight,
            {
                antialias: true,
                resolution: 1,
                transparent: true
            }
        )
        this.renderer.view.classList.add(this.$style.renderer)
        this.$refs.renderContainer.appendChild(this.renderer.view)

        this.viewport.interaction = this.renderer.interaction
        this.viewport.resize(
            this.$refs.renderContainer.clientWidth,
            this.$refs.renderContainer.clientHeight,
            this.viewportSize.width,
            this.viewportSize.height
        )
        this.viewport.fitWorld()
        this.viewport.moveCenter((this.viewportSize.width / 2) - this.tileSize, (this.viewportSize.height / 2) - this.tileSize)

        this.render()
        this.ticker.on('render', this.render)
        this.ticker.on('update', this.update)
    },

    beforeDestroy () {
        this.ticker.removeListener('render', this.renderer.render)

        // cleanup pixi
        this.stage.destroy({
            children: true,
            texture: true,
            baseTexture: true
        })
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
                bug.sprite.position.x = bug.position.x + (bug.velocity.x * dt)
                bug.sprite.position.y = bug.position.y + (bug.velocity.y * dt)
                bug.sprite.rotation = bug.velocity.angle()
            })
            this.towers.forEach(tower => {
                tower.debugGraphics.clear()
                tower.debugGraphics.lineStyle(5, 0x00FF00)
                if (tower.bug) {
                    tower.cannonSprite.rotation = new Vector(tower.bug.sprite.position.x, tower.bug.sprite.position.y)
                        .substract(tower.cannonSprite.position.x, tower.cannonSprite.position.y)
                        .angle()

                    tower.debugGraphics.moveTo(tower.cannonSprite.position.x, tower.cannonSprite.position.y)
                    tower.debugGraphics.lineTo(tower.bug.sprite.position.x, tower.bug.sprite.position.y)
                }
            })
            this.renderer.render(this.stage)
        },

        update () {
            this.bugs.forEach(bug => {
                bug.position.add(bug.velocity)

                let flowFieldTile = this.getFlowFieldTile(bug.position)
                let { x, y } = flowFieldTile
                if (
                    Math.floor(x / this.divide) === this.endPoint.x &&
                    Math.floor(y / this.divide) === this.endPoint.y
                ) {
                    this.handleBugReachesEnd(bug)
                    return
                }

                // TODO: check collision
                let flowFieldIndex = (y * this.map.width * this.divide) + x
                if (!this.flowField[flowFieldIndex]) {
                    // TODO: not yet working correctly
                    // bug lost => move back to last known tile
                    flowFieldTile = bug.flowFieldTile
                    x = flowFieldTile.x
                    y = flowFieldTile.y
                    bug.position.set(
                        (x + 0.5) * (this.tileSize / this.divide),
                        (y + 0.5) * (this.tileSize / this.divide)
                    )
                    flowFieldIndex = (y * this.map.width * this.divide) + x
                } else {
                    bug.flowFieldTile = flowFieldTile
                }

                let targetVelocity = this.flowField[flowFieldIndex].clone().multiply(bug.speed)
                let steeringForce = targetVelocity.clone()
                    .rotate(Math.sin(bug.random + ((bug.position.x + bug.position.y) / (this.tileSize / 2))) / 5) // bug sinus moving
                    .substract(bug.velocity)
                if (steeringForce.length() > bug.rotationSpeed) {
                    steeringForce.normalize().multiply(bug.rotationSpeed)
                }

                bug.velocity.add(steeringForce).normalize().multiply(bug.speed)

                // check collision
                let targetX = Math.floor((bug.position.x + bug.velocity.x) * this.pixel2TileRatio / this.divide)
                let targetY = Math.floor((bug.position.y + bug.velocity.y) * this.pixel2TileRatio / this.divide)
                if (this.isBlocked(targetX, targetY)) {
                    let diffX = Math.abs((targetX * this.divide) - x)
                    let diffY = Math.abs((targetY * this.divide) - y)
                    if (diffX < diffY) {
                        bug.velocity.set(bug.velocity.x, -bug.velocity.y)
                    } else if (diffX < diffY) {
                        bug.velocity.set(-bug.velocity.x, bug.velocity.y)
                    } else {
                        bug.velocity.negate()
                    }
                    bug.velocity.add(targetVelocity).normalize().multiply(bug.speed)
                }
            })

            this.towers.forEach(tower => {
                if (!tower.bug || tower.bug.removed || !this.towerCanReachBug(tower, tower.bug)) {
                    tower.bug = this.bugs.find(bug => {
                        return this.towerCanReachBug(tower, bug)
                    })
                }
            })
        },

        towerCanReachBug (tower, bug) {
            return new Vector(bug.position.x, bug.position.y)
                .substract(tower.cannonSprite.position.x, tower.cannonSprite.position.y)
                .length() <= (tower.maxDistance * this.tileSize)
        },

        loadAssets () {
            for (let key in BugAssets) {
                this.loader.add('bug:' + key, BugAssets[key])
            }
            for (let key in TowerAssets) {
                this.loader.add('tower:' + key, TowerAssets[key])
            }
            this.loader.load(this.onLoad)
        },

        onRenderContainerResize ({ height, width }) {
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

        onResize ({ height, width }) {
            this.screen.width = width
            this.screen.height = height
        },

        onLoad (loader, resources) {
            this.resources = resources

            this.nextWave()
        },

        moveBugToStart (bug) {
            bug.position.set(
                this.startPoint.x * this.tileSize + (this.tileSize / 2),
                this.startPoint.y * this.tileSize + (Math.random() * this.tileSize)
            )
            bug.velocity.set(0, 0)
            bug.flowFieldTile = this.getFlowFieldTile(bug.position)
        },

        getFlowFieldTile (position) {
            return new Vector(
                Math.floor(position.x * this.pixel2TileRatio),
                Math.floor(position.y * this.pixel2TileRatio)
            )
        },

        spawnBug (texture) {
            let sprite = new Sprite(texture)
            sprite.scale.set(0.2)
            sprite.anchor.set(0.5)
            this.bugContainer.addChild(sprite)

            let bug = {
                sprite,
                position: new Vector(),
                velocity: new Vector(),
                speed: 5 + Math.random(),
                rotationSpeed: 0.5 + (Math.random() / 4),
                tile: new Vector(),
                random: Math.random() * 1000,
                maxHealth: 100,
                health: 100,
                removed: false
            }
            this.bugs.push(bug)

            this.moveBugToStart(bug)
        },

        nextWave () {
            // random bug texture
            let bugKeys = Object.keys(BugAssets)
            let randomBugKey = bugKeys[Math.floor(Math.random() * bugKeys.length)]
            let bugTexture = this.resources['bug:' + randomBugKey].texture

            let count = 50
            this.lastBugSpawned = false
            this.wave++
            this.bugsLeft += count
            let _spawn = () => {
                if (count > 0) {
                    count--
                    this.spawnBug(bugTexture)
                    setTimeout(() => {
                        _spawn()
                    }, 1000)
                } else {
                    this.lastBugSpawned = true
                }
            }
            _spawn()
        },

        isBlocked (x, y) {
            return x < 0 || y < 0 || x >= this.map.width || y >= this.map.height || this.walls.has(`${x}:${y}`)
        },

        onClick (evt) {
            let tile = {
                x: Math.floor(evt.world.x / this.tileSize),
                y: Math.floor(evt.world.y / this.tileSize)
            }
            if (this.isBlocked(tile.x, tile.y)) {
                this.selectedTile = {
                    x: Math.floor(evt.world.x / this.tileSize),
                    y: Math.floor(evt.world.y / this.tileSize)
                }
            }
        },

        handleBugReachesEnd (bug) {
            this.health--
            this.bugsLeft--

            this.removeBug(bug)
        },

        removeBug (bug) {
            bug.removed = true
            let index = this.bugs.indexOf(bug)
            if (index > -1) {
                this.bugs.splice(index, 1)
            }
            bug.sprite.destroy({
                children: true
            })
        },

        togglePanel () {
            if (this.isMobile) {
                this.showPanel = !this.showPanel
            }
        },

        hasTower (x, y) {
            return this.towers.find(tower => {
                return tower.position.x === x && tower.position.y === y
            })
        },

        buildTower (type, x, y) {
            if (!this.isBlocked(x, y) || this.hasTower(x, y)) {
                return
            }

            // create baseSprite
            let baseSprite = new Sprite(this.resources['tower:base1'].texture)
            baseSprite.scale.set(0.3)
            baseSprite.anchor.set(0.5)
            baseSprite.position.set((x + 0.5) * this.tileSize, (y + 0.5) * this.tileSize)
            this.towerContainer.addChild(baseSprite)

            // create cannonSprite
            let cannonSprite = new Sprite(this.resources['tower:' + type].texture)
            cannonSprite.scale.set(0.35)
            cannonSprite.anchor.set(0.5)
            cannonSprite.position.set((x + 0.5) * this.tileSize, (y + 0.5) * this.tileSize)
            this.towerContainer.addChild(cannonSprite)

            // debug graphics
            let debugGraphics = new Graphics()
            this.towerContainer.addChild(debugGraphics)

            this.towers.push({
                position: new Vector(x, y),
                baseSprite,
                cannonSprite,
                maxDistance: 3,
                targetBug: null,
                debugGraphics
            })
        },

        onBuildTowerClick () {
            if (!this.selectedTile) {
                return
            }
            this.buildTower('cannon', this.selectedTile.x, this.selectedTile.y)
        }
    }
}
</script>
