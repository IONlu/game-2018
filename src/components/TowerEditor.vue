<template>
    <div>
        <div :class="$style.tower">
            <div
                :class="$style.image"
                :style="imageStyle"
            />
        </div>
        <table :class="$style.table">
            <tr>
                <td>Damage</td>
                <td>
                    {{ damageLevel }}
                    <span :class="$style.small">({{ damage }} <fa-icon icon="angle-double-right" /> {{ nextDamage }})</span>
                </td>
                <td>
                    <fa-icon icon="dollar-sign" /> {{ getUpgradePrice('damage') }}
                </td>
                <td>
                    <button
                        :class="game.$style.button"
                        @click="upgrade('damage')"
                    >
                        <fa-icon icon="angle-double-up" /> Upgrade
                    </button>
                </td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>
                    {{ speedLevel }}
                    <span :class="$style.small">({{ speed }}s <fa-icon icon="angle-double-right" /> {{ nextSpeed }}s)</span>
                </td>
                <td>
                    <fa-icon icon="dollar-sign" /> {{ getUpgradePrice('speed') }}
                </td>
                <td>
                    <button
                        :class="game.$style.button"
                        @click="upgrade('speed')"
                    >
                        <fa-icon icon="angle-double-up" /> Upgrade
                    </button>
                </td>
            </tr>
            <tr>
                <td>Range</td>
                <td>
                    {{ rangeLevel }}
                    <span :class="$style.small">({{ range }} <fa-icon icon="angle-double-right" /> {{ nextRange }})</span>
                </td>
                <td>
                    <fa-icon icon="dollar-sign" /> {{ getUpgradePrice('range') }}
                </td>
                <td>
                    <button
                        :class="game.$style.button"
                        @click="upgrade('range')"
                    >
                        <fa-icon icon="angle-double-up" /> Upgrade
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>

<style module>
    .tower {
        margin: 0 auto;
        width: 30%;
        border: 2px solid #333;
        background: #AAA;
        padding: 1vmin;
    }

    .image {
        width: 100%;
        padding-top: 100%;
        background-size: 150%;
        background-repeat: no-repeat;
        background-position: center 20%;
    }

    .table {
        margin: 0 auto;
        font-size: 0.5em;

        td {
            padding: 0.2em 0.5em;
        }
    }

    .small {
        font-style: italic;
        opacity: 0.5;
        font-size: 0.8em;
    }
</style>

<script>
import * as TowerHelpers from '../config/towers'

export default {
    props: {
        game: {
            type: Object,
            required: true
        },

        tower: {
            type: Object,
            required: true
        }
    },

    computed: {
        imageStyle () {
            return {
                backgroundImage: `url(${this.tower.data.image})`
            }
        },

        rangeLevel () {
            return this.tower.range
        },

        speedLevel () {
            return this.tower.speed
        },

        damageLevel () {
            return this.tower.damage
        },

        range () {
            return TowerHelpers.getRange(this.tower)
        },

        nextRange () {
            return TowerHelpers.getRange(this.tower, this.tower.range + 1)
        },

        speed () {
            return TowerHelpers.getSpeed(this.tower)
        },

        nextSpeed () {
            return TowerHelpers.getSpeed(this.tower, this.tower.speed + 1)
        },

        damage () {
            return TowerHelpers.getBugDamage(this.tower)
        },

        nextDamage () {
            return TowerHelpers.getBugDamage(this.tower, null, this.tower.damage + 1)
        }
    },

    methods: {
        upgrade (type) {
            let price = this.getUpgradePrice(type)
            if (this.game.money >= price) {
                this.game.money -= price
                this.tower[type]++
                if (type === 'range') {
                    this.game.updateTowerRangeOverlay()
                }
            }
        },

        getUpgradePrice (type) {
            return TowerHelpers.getLevelPrice(this.tower, this.tower[type] + 1)
        }
    }
}
</script>
