<template>
    <router-view/>
</template>

<script>
import uuidv4 from 'uuid/v4'
import hash from 'hash.js'

const UUID = localStorage.getItem('UUID') || uuidv4()
localStorage.setItem('UUID', UUID)
window.addEventListener('beforeunload', () => {
    localStorage.setItem('UUID', UUID)
})
const hashStr = str => {
    return hash.sha1().update(UUID + str).digest('hex') + '-' + UUID
}

export default {
    provide: {
        hash: hashStr
    }
}
</script>
