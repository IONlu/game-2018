<template>
    <div :class="$style.container">
        <img
            :class="$style.howto"
            src="../assets/svg/howto.svg"
        >
    </div>
</template>

<style module>
    .container {
        overflow-x: auto;
        overflow-y: hidden;
        width: 100vw;
        height: 100vh;
    }

    .howto {
        height: 100%;
    }
</style>

<script>
export default {
    name: 'Howto'
}
</script>
