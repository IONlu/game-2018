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
                <td>{{ tower.damage }}</td>
                <td>
                    <button>Upgrade</button>
                </td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>{{ tower.speed }}</td>
                <td>
                    <button>Upgrade</button>
                </td>
            </tr>
            <tr>
                <td>Range</td>
                <td>{{ tower.range }}</td>
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
</style>

<script>
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
        }
    }
}
</script>
