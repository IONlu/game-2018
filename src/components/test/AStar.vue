<template>
    <table :class="$style.grid">
        <tr
            v-for="y in (height * divide)"
            :key="y"
        >
            <td
                v-for="x in (width * divide)"
                :key="x"
                :class="cellClasses(x - 1, y - 1)"
                @click="toggleWall(x - 1, y - 1)"
            >
                <div
                    :style="arrowStyle(x - 1, y - 1)"
                >
                    →
                </div>
                <!-- {{ weight(x - 1, y - 1) }} -->
            </td>
        </tr>
    </table>
</template>

<style module>
    .grid {
        table-layout: fixed;
        border-collapse: collapse;
    }

    .cell {
        width: 2em;
        height: 2em;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        position: relative;
    }

    .start {
        background: #0F0;
    }

    .end {
        background: #F00;
    }

    .wall {
        background: #000;
        color: #FFF;
    }
</style>

<script>
import AStar from '../../AStar'

export default {
    name: 'AStar',

    data () {
        return {
            divide: 2,
            width: 10,
            height: 10,
            startPoint: {
                x: 0,
                y: 0
            },
            endPoint: {
                x: 9,
                y: 9
            },
            heatMap: [],
            flowField: [],
            walls: new Map()
        }
    },

    created () {
        this.updateFlowField()
    },

    methods: {
        weight (x, y) {
            let weight = this.heatMap[(y * this.width * this.divide) + x]
            return weight === Infinity ? '∞' : weight
        },

        angle (x, y) {
            let vec = this.flowField[(y * this.width * this.divide) + x]
            return vec ? Math.atan2(vec.y, vec.x) : 0
        },

        cellClasses (x, y) {
            x = Math.floor(x / this.divide)
            y = Math.floor(y / this.divide)
            let keyMap = `${x}:${y}`

            return {
                [this.$style.cell]: true,
                [this.$style.wall]: this.walls.has(keyMap),
                [this.$style.start]: this.startPoint.x === x && this.startPoint.y === y,
                [this.$style.end]: this.endPoint.x === x && this.endPoint.y === y
            }
        },

        arrowStyle (x, y) {
            return {
                display: this.weight(x, y) === '∞' ? 'none' : 'block',
                transform: 'rotate(' + (this.angle(x, y) * (180 / Math.PI)) + 'deg)'
            }
        },

        updateHeatMap () {
            this.heatMap = new Array(this.width * this.height * this.divide * this.divide).fill(Infinity)
            AStar(this.endPoint, (x, y) => {
                return x < 0 || y < 0 || x >= this.width || y >= this.height || this.walls.has(`${x}:${y}`)
            }, this.divide).forEach(({ x, y, weight }) => {
                this.heatMap[(y * this.width * this.divide) + x] = weight
            })
        },

        updateFlowField () {
            this.updateHeatMap()
            this.flowField = this.heatMap.map((weight, index) => {
                if (weight === Infinity) {
                    return null
                }
                let x1 = Number.isInteger(this.heatMap[index - 1]) && (index % this.width > 1)
                    ? this.heatMap[index - 1]
                    : weight + 0.2
                let x2 = Number.isInteger(this.heatMap[index + 1]) && (index % this.width < this.width - 1)
                    ? this.heatMap[index + 1]
                    : weight + 0.2
                let y1 = Number.isInteger(this.heatMap[index - (this.width * this.divide)])
                    ? this.heatMap[index - (this.width * this.divide)]
                    : weight + 0.2
                let y2 = Number.isInteger(this.heatMap[index + (this.width * this.divide)])
                    ? this.heatMap[index + (this.width * this.divide)]
                    : weight + 0.2

                return {
                    x: x1 - x2,
                    y: y1 - y2
                }
            })
        },

        toggleWall (x, y) {
            x = Math.floor(x / this.divide)
            y = Math.floor(y / this.divide)
            let keyMap = `${x}:${y}`
            if (this.walls.has(keyMap)) {
                this.walls.delete(keyMap, true)
            } else {
                this.walls.set(keyMap)
            }
            this.updateFlowField()
        }
    }
}
</script>
