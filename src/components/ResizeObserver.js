import Vue from 'vue'
import ResizeObserver from 'resize-observer-polyfill'

let observer = new Vue({
    created () {
        this.observer = new ResizeObserver(this.onResize)
        this.callbackMap = new Map()
    },

    beforeDestroy () {
        this.observer.disconnect()
        this.callbackMap.clear()
    },

    methods: {
        observe (node, callback) {
            this.observer.observe(node)
            this.callbackMap.set(node, callback)
        },

        unobserve (node) {
            this.observer.unobserve(node)
            this.callbackMap.delete(node)
        },

        onResize (entries) {
            for (let entry of entries) {
                this.callbackMap.get(entry.target)(entry.contentRect)
            }
        }
    }
})

export default {
    name: 'ResizeObserver',

    inheritAttrs: false,

    data () {
        return {
            rootElement: null,
            contentRect: {}
        }
    },

    watch: {
        contentRect (newValue, oldValue) {
            this.$emit('resize', this.contentRect)
        },

        rootElement (newElement, oldElement) {
            if (oldElement) {
                observer.unobserve(oldElement)
            }
            if (newElement) {
                observer.observe(newElement, this.onResize)
            }
        }
    },

    mounted () {
        this.rootElement = this.$el
    },

    updated () {
        if (this.$el !== this.rootElement) {
            this.rootElement = this.$el
        }
    },

    beforeDestroy () {
        observer.unobserve(this.rootElement)
    },

    methods: {
        onResize (contentRect) {
            this.contentRect = contentRect
        }
    },

    render (h) {
        let vnodes = this.$scopedSlots.default
            ? this.$scopedSlots.default(this.contentRect)
            : this.$slots.default
        return Array.isArray(vnodes)
            ? vnodes[0]
            : vnodes
    }
}
