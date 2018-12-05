export default class Map {
    constructor (data) {
        let [ widthPart ] = data.match(/^[0-9]+/)
        this.fields = data.slice(widthPart.length).split('')
        this.width = parseInt(widthPart, 10)
        this.height = Math.ceil(this.fields.length / this.width)
        this.startPoint = this.index2Point(this.fields.findIndex(field => field === 'S'))
        this.endPoint = this.index2Point(this.fields.findIndex(field => field === 'E'))
        this.heatMap = []
    }

    index2Point (index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        }
    }

    point2Index (point) {
        return (point.y * this.width) + point.x
    }

    getFieldByPoint (point) {
        let index = this.point2Index(point)
        return this.fields[index] || 'W' // convert to wall if undefined
    }
}
