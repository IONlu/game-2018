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
                    <span :class="$style.small">({{ damage }})</span>
                </td>
                <td>
                    <button>Upgrade</button>
                </td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>
                    {{ speedLevel }}
                    <span :class="$style.small">({{ speed }}s)</span>
                </td>
                <td>
                    <button>Upgrade</button>
                </td>
            </tr>
            <tr>
                <td>Range</td>
                <td>
                    {{ rangeLevel }}
                    <span :class="$style.small">({{ range }})</span>
                </td>
                <td>
                    <button>Upgrade</button>
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

        speed () {
            return TowerHelpers.getSpeed(this.tower)
        },

        damage () {
            return TowerHelpers.getBugDamage(this.tower)
        }
    }
}
</script>