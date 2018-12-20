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
                <td>Level</td>
                <td>1</td>
            </tr>
            <tr>
                <td>Range</td>
                <td>{{ tower.maxDistance }}</td>
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
        width: 100%;
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
