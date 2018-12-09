const isVector = vector => {
    return vector.hasOwnProperty &&
        vector.hasOwnProperty('x') &&
        vector.hasOwnProperty('y')
}

export default class Vector {
    constructor (...args) {
        this.set(...args)
    }

    clone () {
        return new Vector(this)
    }

    copy (vector) {
        return this.set(vector)
    }

    equals (vector) {
        return this.x === vector.x && this.y === vector.y
    }

    set (xOrVector = 0, y = 0) {
        if (isVector(xOrVector)) {
            this.x = xOrVector.x
            this.y = xOrVector.y
        } else {
            this.x = xOrVector
            this.y = y
        }
        return this
    }

    angle () {
        return Math.atan2(this.y, this.x) + (Math.PI / 2)
    }

    negate () {
        this.x = -this.x
        this.y = -this.y
        return this
    }

    add (vector) {
        if (isVector(vector)) {
            this.x += vector.x
            this.y += vector.y
        } else {
            this.x += vector
            this.y += vector
        }
        return this
    }

    substract (vector) {
        if (isVector(vector)) {
            this.x -= vector.x
            this.y -= vector.y
        } else {
            this.x -= vector
            this.y -= vector
        }
        return this
    }

    multiply (vector) {
        if (isVector(vector)) {
            this.x *= vector.x
            this.y *= vector.y
        } else {
            this.x *= vector
            this.y *= vector
        }
        return this
    }

    divide (vector) {
        if (isVector(vector)) {
            if (vector.x !== 0) {
                this.x /= vector.x
            }
            if (vector.y !== 0) {
                this.y /= vector.y
            }
        } else {
            if (vector !== 0) {
                this.x /= vector
                this.y /= vector
            }
        }
        return this
    }

    dot (vector) {
        return this.x * vector.x + this.y * vector.y
    }

    cross (vector) {
        return this.x * vector.y - this.y * vector.x
    }

    length () {
        return Math.sqrt(this.dot(this))
    }

    normalize () {
        return this.divide(this.length())
    }

    min () {
        return Math.min(this.x, this.y)
    }

    max () {
        return Math.max(this.x, this.y)
    }

    toArray (n) {
        return [this.x, this.y].slice(0, n || 2)
    }

    rotate (angle) {
        let x = this.x
        let y = this.y
        let cosAngle = Math.cos(angle)
        let sinAngle = Math.sin(angle)
        this.x = (x * cosAngle) - (y * sinAngle)
        this.y = (x * sinAngle) + (y * cosAngle)
        return this
    }
}
