import EventEmitter from 'events'

export default class Ticker extends EventEmitter {
    constructor (fps) {
        super()

        this.delta = 1000 / fps
        this.isRunning = false
        this.handle = null
        this.lastFrameTime = null
    }

    start () {
        if (this.isRunning) {
            return
        }
        this.isRunning = true
        this.lastFrameTime = performance.now()
        this._nextFrame()
    }

    stop () {
        if (!this.isRunning) {
            return
        }
        this._cancelNext()
        this.lastFrameTime = null
        this.isRunning = false
    }

    _nextFrame () {
        this._cancelNext()
        this.handle = requestAnimationFrame(() => {
            // handle update
            var now = performance.now()

            while (this.lastFrameTime < now) {
                this.lastFrameTime += this.delta
                this.emit('update')
            }

            // handle render
            this.emit('render', (this.delta - this.lastFrameTime + now) / this.delta, now)

            // start next frame
            this._nextFrame()
        })
    }

    _cancelNext () {
        if (this.handle) {
            cancelAnimationFrame(this.handle)
        }
    }
}
