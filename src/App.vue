<template>
    <router-view/>
</template>

<script>
import uuidv4 from 'uuid/v4'

export default {
    created () {
        this.getUUID()
        window.addEventListener('beforeunload', this.onBeforeUnload)
    },

    beforeDestroy() {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
        this.saveUUID()
    },

    methods: {
        getUUID () {
            let UUID = localStorage.getItem('UUID')
            if (!UUID) {
                UUID = uuidv4()
                localStorage.setItem('UUID', UUID)
            }
            this.$root.UUID = UUID
            return UUID
        },

        saveUUID () {
            localStorage.setItem('UUID', this.$root.UUID)
        },

        onBeforeUnload () {
            this.saveUUID()
        }
    }
}
</script>
