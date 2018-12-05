export default (targetPoint, isBlocked, divide = 2) => {
    let open = new Map()
    let closed = new Map()

    // init open list wit target cells
    for (let i = 0; i < divide; i++) {
        for (let j = 0; j < divide; j++) {
            let x = (targetPoint.x * divide) + i
            let y = (targetPoint.y * divide) + j
            open.set(`${x}:${y}`, {
                x,
                y,
                weight: 0
            })
        }
    }

    while (open.size > 0) {
        // find open point with smallest weight
        let point = null
        open.forEach(newPoint => {
            if (!point || newPoint.weight < point.weight) {
                point = newPoint
            }
        })

        // add neighbour points
        let neighbourWeight = point.weight + 1

        for (let x = point.x - 1; x <= point.x + 1; x++) {
            for (let y = point.y - 1; y <= point.y + 1; y++) {
                let mapKey = `${x}:${y}`
                if (
                    (x !== point.x || y !== point.y) &&
                    !closed.has(mapKey) &&
                    !isBlocked(Math.floor(x / divide), Math.floor(y / divide))
                ) {
                    let isDiagonal = x !== point.x && y !== point.y
                    if (
                        !isDiagonal || (
                            !isBlocked(Math.floor(x / divide), Math.floor(point.y / divide)) &&
                            !isBlocked(Math.floor(point.x / divide), Math.floor(y / divide))
                        )
                    ) {
                        let current = open.get(mapKey)
                        if (!current || current.weight > neighbourWeight) {
                            open.set(mapKey, {
                                x,
                                y,
                                weight: neighbourWeight
                            })
                        }
                    }
                }
            }
        }

        let mapKey = `${point.x}:${point.y}`
        closed.set(mapKey, point)
        open.delete(mapKey)
    }

    return closed
}
