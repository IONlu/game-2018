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
                    <fa-icon icon="dollar-sign" /> {{ money }}
                </div>
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
                    <tower-selector
                        :class="$style.towerSelector"
                        @select="onBuildTowerClick"
                    />
                </div>
            </div>
            <resize-observer
                @resize="updateRendererSize"
            >
                <div
                    ref="renderContainer"
                    :class="$style.renderContainer"
                />
            </resize-observer>
            <div
                v-if="showNextWaveButton"
                :class="$style.nextWave"
                @click="nextWave"
            >
                <fa-icon icon="play" /> Next Wave
                <template v-if="noBugsLeftCountDown">
                    <fa-icon icon="clock" /> {{ noBugsLeftCountDown }}
                </template>
            </div>
        </div>
    </resize-observer>
</template>

<style module>
    .game {
        width: 100vw;
        height: 100vh;
        font-family: Arial, sans-serif;
        font-size: 4vmin;
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
        height: calc(100vh - 5vmin);
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
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nextWave {
        position: absolute;
        border-radius: 1vmax;
        background: #00000099;
        color: #FFF;
        border-style: solid;
        border-color: #999;
        right: 1vmin;
        padding: 1vmin;
        cursor: pointer;
    }

    .landscape .nextWave {
        bottom: 1vmin;
    }

    .portrait .nextWave {
        top: calc(5vmin + 1em);
    }

    .towerSelector {
        width: 100%;
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
import TowerConfig from '../config/towers'
import TowerSelector from './TowerSelector'

export default {
    name: 'Game',

    components: {
        ResizeObserver,
        TowerSelector
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
            bullets: [],
            selectedTile: null,
            health: 100,
            bugsLeft: 0,
            wave: 0,
            screen: {
                width: window.clientWidth,
                height: window.clientHeight
            },
            showPanel: true,
            lastBugSpawned: true,
            debug: false,
            money: 100,
            gameSpeed: 20,
            allBugsKilledCounter: 0,
            nextWaveTimeout: 200
        }
    },

    computed: {
        isMobile () {
            return this.screen.width <= 1000 && this.screen.height <= 1000
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
        },

        canStartNextWave () {
            return this.wave === 0 || this.lastBugSpawned
        },

        noBugsLeftCountDown () {
            if (this.bugsLeft > 0) {
                return ''
            }
            let seconds = Math.floor((this.nextWaveTimeout - this.allBugsKilledCounter) / 20)
            return seconds
        },

        showNextWaveButton () {
            return this.wave > 0 && this.canStartNextWave
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
        },

        debug () {
            if (this.debug) {
                this.viewport.addChild(this.debugContainer)
            } else {
                this.viewport.removeChild(this.debugContainer)
            }
        },

        gameSpeed () {
            this.ticker.fps = this.gameSpeed
        },

        bugsLeft () {
            this.allBugsKilledCounter = 0
        },

        allBugsKilledCounter () {
            if (this.lastBugSpawned && this.allBugsKilledCounter >= this.nextWaveTimeout) {
                this.nextWave()
            }
        }
    },

    created () {
        this.ticker = new Ticker(this.gameSpeed)

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

        // create healthbar container
        this.healthBarContainer = new Container()
        this.viewport.addChild(this.healthBarContainer)

        // create bullet container
        this.bulletContainer = new Container()
        this.viewport.addChild(this.bulletContainer)

        // create container for the ui elements
        this.uiContainer = new Container()
        this.viewport.addChild(this.uiContainer)

        // create debug container
        this.debugContainer = new Container()

        this.loadAssets()

        if (!document.hidden) {
            this.ticker.start()
        }

        // draw tiles
        ;([ ...this.map.data ]).map((type, index) => {
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

        // global keydown
        window.addEventListener('keydown', this.onGlobalKeyDown)

        // check if document is visible
        document.addEventListener('visibilitychange', this.onVisibilityChange)
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
        this.updateRendererSize()
        this.fitWorld()

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

        window.removeEventListener('keydown', this.onGlobalKeyDown)
        document.removeEventListener('visibilitychange', this.onVisibilityChange)
    },

    methods: {
        index2Point (index) {
            return new Vector(
                index % this.map.width,
                Math.floor(index / this.map.width)
            )
        },

        isRemoved (item) {
            return !item || item.removed
        },

        fitWorld () {
            this.viewport.moveCenter(
                (this.viewportSize.width / 2) - this.tileSize,
                (this.viewportSize.height / 2) - this.tileSize
            )
            this.viewport.fitWorld(true)
        },

        render (dt) {
            this.bugs.forEach(bug => {
                bug.sprite.position.x = bug.position.x + (bug.velocity.x * dt)
                bug.sprite.position.y = bug.position.y + (bug.velocity.y * dt)
                bug.sprite.rotation = bug.velocity.angle()

                bug.healthBar.position.set(bug.sprite.position.x, bug.sprite.position.y - 40)
            })
            this.towers.forEach(tower => {
                if (this.debug) {
                    tower.debugGraphics.clear()
                }

                if (!this.isRemoved(tower.targetBug)) {
                    tower.cannonSprite.rotation = new Vector(tower.targetBug.sprite.position.x, tower.targetBug.sprite.position.y)
                        .substract(tower.cannonSprite.position.x, tower.cannonSprite.position.y)
                        .angle()

                    if (this.debug) {
                        tower.debugGraphics.lineStyle(2, 0x00FF00)
                        tower.debugGraphics.moveTo(tower.cannonSprite.position.x, tower.cannonSprite.position.y)
                        tower.debugGraphics.lineTo(tower.targetBug.sprite.position.x, tower.targetBug.sprite.position.y)
                    }
                }
            })
            this.bullets.forEach(bullet => {
                bullet.sprite.position.x = bullet.position.x + (bullet.velocity.x * dt)
                bullet.sprite.position.y = bullet.position.y + (bullet.velocity.y * dt)
                bullet.sprite.rotation = bullet.velocity.angle()
            })
            this.renderer.render(this.stage)
        },

        update () {
            if (this.bugs.length === 0) {
                this.allBugsKilledCounter++
            }

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
                if (this.isRemoved(tower.targetBug) || !this.towerCanReachBug(tower, tower.targetBug)) {
                    tower.targetBug = this.bugs.find(bug => {
                        return this.towerCanReachBug(tower, bug)
                    })
                }
                tower.bulletTimeoutCounter++
                if (tower.bulletTimeoutCounter === 20) {
                    tower.bulletTimeoutCounter = 0
                    this.shoot(tower)
                }
            })

            this.bullets.forEach(bullet => {
                if (this.isRemoved(bullet.targetBug)) {
                    bullet.removed = true
                } else {
                    bullet.position.add(bullet.velocity)
                    let targetVector = bullet.targetBug.position.clone().substract(bullet.position)
                    if (targetVector.length() <= 30) {
                        bullet.targetBug.health -= 10
                        if (bullet.targetBug.health <= 10) {
                            bullet.targetBug.removed = true
                            this.money += 5
                        }
                        this.updateHealthBar(bullet.targetBug)
                        bullet.removed = true
                    } else {
                        bullet.velocity.set(targetVector).normalize().multiply(30)
                    }
                }
            })

            // remove items
            this.removeBullets()
            this.removeBugs()
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

        updateRendererSize () {
            let dpr = window.devicePixelRatio || 1
            let width = this.$refs.renderContainer.clientWidth * dpr
            let height = this.$refs.renderContainer.clientHeight * dpr
            let viewportCenter = this.viewport.center

            if (this.renderer) {
                this.renderer.resize(width, height)
            }
            this.viewport.resize(
                width,
                height,
                this.viewportSize.width,
                this.viewportSize.height
            )
            this.viewport.moveCenter(viewportCenter.x, viewportCenter.y)
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

        spawnBug (texture, wave) {
            let sprite = new Sprite(texture)
            sprite.scale.set(0.2)
            sprite.anchor.set(0.5)
            this.bugContainer.addChild(sprite)

            let healthBar = new Graphics()
            healthBar.pivot.set(25, 2)
            this.healthBarContainer.addChild(healthBar)

            let health = 100 + (20 * Math.pow(wave - 1, 1.2))

            let bug = {
                sprite,
                position: new Vector(),
                velocity: new Vector(),
                speed: 5 + Math.random(),
                rotationSpeed: 0.5 + (Math.random() / 4),
                tile: new Vector(),
                random: Math.random() * 1000,
                maxHealth: health,
                health: health,
                removed: false,
                healthBar
            }
            this.bugs.push(bug)

            this.moveBugToStart(bug)
            this.updateHealthBar(bug)
        },

        updateHealthBar (bug) {
            bug.healthBar.clear()
            bug.healthBar.lineStyle(4, 0xFF0000)
            bug.healthBar.moveTo(0, 0)
            bug.healthBar.lineTo(50, 0)
            bug.healthBar.lineStyle(4, 0x00FF00)
            bug.healthBar.moveTo(0, 0)
            bug.healthBar.lineTo((bug.health / bug.maxHealth) * 50, 0)
        },

        nextWave () {
            if (!this.canStartNextWave) {
                return
            }

            // random bug texture
            let bugKeys = Object.keys(BugAssets)
            let randomBugKey = bugKeys[Math.floor(Math.random() * bugKeys.length)]
            let bugTexture = this.resources['bug:' + randomBugKey].texture

            let count = 30
            let tickCounter = 0
            this.lastBugSpawned = false
            this.wave++
            this.bugsLeft += count
            let wave = this.wave

            let _spawn = () => {
                tickCounter++
                if (tickCounter === 20) {
                    tickCounter = 0
                    count--
                    this.spawnBug(bugTexture, wave)
                    if (count === 0) {
                        if (this.wave === wave) {
                            this.lastBugSpawned = true
                        }
                        this.ticker.removeListener('update', _spawn)
                    }
                }
            }
            this.ticker.on('update', _spawn)
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
            bug.removed = true
        },

        removeBugs () {
            this.bugs = this.bugs.filter(bug => {
                if (!bug.removed) {
                    return true
                }
                this.bugsLeft--
                this.bugContainer.removeChild(bug.sprite)
                bug.sprite.destroy({
                    children: true
                })
                this.healthBarContainer.removeChild(bug.healthBar)
                bug.healthBar.destroy({
                    children: true
                })
                return false
            })
        },

        removeBullets () {
            this.bullets = this.bullets.filter(bullet => {
                if (!bullet.removed) {
                    return true
                }
                this.bulletContainer.removeChild(bullet.sprite)
                bullet.sprite.destroy({
                    children: true
                })
                return false
            })
        },

        togglePanel () {
            if (this.isMobile) {
                this.showPanel = !this.showPanel
            }
        },

        hasTower (x, y) {
            return this.towers.find(tower => {
                return tower.tilePosition.x === x && tower.tilePosition.y === y
            })
        },

        buildTower (data, x, y) {
            if (!this.isBlocked(x, y) || this.hasTower(x, y) || this.money < data.price) {
                return
            }

            this.money -= data.price

            let tilePosition = new Vector(x, y)
            let position = tilePosition.clone().add(0.5).multiply(this.tileSize)

            // create baseSprite
            let baseSprite = new Sprite(this.resources['tower:' + data.base[0]].texture)
            baseSprite.scale.set(0.3)
            baseSprite.anchor.set(0.5)
            baseSprite.position.set(position.x, position.y)
            this.towerContainer.addChild(baseSprite)

            // create cannonSprite
            let cannonSprite = new Sprite(this.resources['tower:' + data.cannon[0]].texture)
            cannonSprite.scale.set(0.25)
            cannonSprite.anchor.set(...data.anchor)
            cannonSprite.position.set(position.x, position.y)
            this.towerContainer.addChild(cannonSprite)

            // debug graphics
            let debugGraphics = new Graphics()
            this.debugContainer.addChild(debugGraphics)

            this.towers.push({
                tilePosition,
                position,
                baseSprite,
                cannonSprite,
                maxDistance: 3,
                targetBug: null,
                debugGraphics,
                bullet: data.bullet,
                bulletTimeoutCounter: 0
            })
        },

        shoot (tower) {
            let position = tower.position.clone()

            // create bulletSprite
            let sprite = new Sprite(this.resources['tower:' + tower.bullet[0]].texture)
            sprite.scale.set(0.1)
            sprite.anchor.set(0.5)
            sprite.position.set(position.x, position.y)
            this.bulletContainer.addChild(sprite)

            this.bullets.push({
                position,
                targetBug: tower.targetBug,
                sprite,
                velocity: new Vector()
            })
        },

        onBuildTowerClick (tower) {
            if (!this.selectedTile) {
                return
            }
            this.buildTower(TowerConfig[tower], this.selectedTile.x, this.selectedTile.y)
        },

        onGlobalKeyDown (evt) {
            if (evt.key === 'd' && evt.altKey) {
                evt.preventDefault()
                this.debug = !this.debug
            }

            if (evt.key === 's' && evt.altKey) {
                evt.preventDefault()
                this.gameSpeed += 20
                if (this.gameSpeed > 60) {
                    this.gameSpeed = 20
                }
            }

            if (evt.key.match(/^[0-9]+$/)) {
                let towerIndex = parseInt(evt.key, 10) - 1
                let towerKeys = Object.keys(TowerConfig)
                if (towerIndex < towerKeys.length) {
                    this.onBuildTowerClick(towerKeys[towerIndex])
                }
            }
        },

        onVisibilityChange () {
            if (document.hidden) {
                this.ticker.stop()
            } else {
                this.ticker.start()
            }
        }
    }
}
</script>
