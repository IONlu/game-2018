<template>
    <div :class="$style.howto" />
</template>

<style module>

    html,
    body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .howto {
        overflow: auto;
        color: white;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        font-family: Arial, sans-serif;
        font-size: 4vmin;
        background: url(../assets/svg/howto.svg) center center no-repeat fixed;
        background-size: cover;

        * {
            box-sizing: border-box;
        }
    }

</style>

<script>
export default {
    name: 'Howto'
}

</script>
