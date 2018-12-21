import CanonImage from '../assets/svg/canon.svg'
import IonImage from '../assets/svg/ion.svg'
import ShieldImage from '../assets/svg/shield.svg'
import TankImage from '../assets/svg/tank.svg'
import TracerImage from '../assets/svg/tracer.svg'

export default {
    tank: {
        cannon: [
            'tank'
        ],
        base: [
            'base1',
            'base2',
            'base3'
        ],
        bullet: [
            'tankammo'
        ],
        price: 10,
        image: TankImage,
        speed: {
            initial: 1
        },
        range: {
            initial: 3
        },
        damage: {
            initial: 5,
            type: 'normal'
        }
    },

    cannon: {
        cannon: [
            'canon'
        ],
        base: [
            'base1',
            'base2',
            'base3'
        ],
        bullet: [
            'canonammo'
        ],
        price: 40,
        image: CanonImage,
        speed: {
            initial: 3
        },
        range: {
            initial: 2
        },
        damage: {
            initial: 80,
            type: 'splash'
        }
    },

    ion: {
        cannon: [
            'ion'
        ],
        base: [
            'base1',
            'base2',
            'base3'
        ],
        bullet: [
            'ionammo'
        ],
        price: 40,
        image: IonImage,
        speed: {
            initial: 6
        },
        range: {
            initial: 2
        },
        damage: {
            initial: 100,
            type: 'normal'
        }
    },

    shield: {
        cannon: [
            'shield'
        ],
        base: [
            'base1',
            'base2',
            'base3'
        ],
        bullet: [
            'shieldammo'
        ],
        price: 30,
        image: ShieldImage,
        speed: {
            initial: 1
        },
        range: {
            initial: 2
        },
        damage: {
            initial: 1,
            type: 'freeze'
        }
    },

    tracer: {
        cannon: [
            'tracer'
        ],
        base: [
            'base1',
            'base2',
            'base3'
        ],
        bullet: [
            'tracerammo'
        ],
        price: 30,
        image: TracerImage,
        speed: {
            initial: 0.3
        },
        range: {
            initial: 4
        },
        damage: {
            initial: 5,
            type: 'normal'
        }
    }
}

export const getLevelPrice = (tower, level) => {
    return Math.round(tower.data.price * (level / 4))
}

export const getRange = (tower, level) => {
    level = level || tower.range
    return Math.round((tower.data.range.initial + ((level - 1) * 0.5)) * 100) / 100
}

export const getBugDamage = (tower, bug, level) => {
    level = level || tower.damage
    if (tower.data.damage.type === 'freeze') {
        return Math.round((1 / ((level + 5) / 5)) * 100) / 100
    }
    return Math.round((tower.data.damage.initial + ((level - 1) * tower.data.damage.initial * 0.5)) * 100) / 100
}

export const getSpeed = (tower, level) => {
    level = level || tower.speed
    return Math.round((tower.data.speed.initial / (1 + ((level - 1) * 0.1))) * 100) / 100
}
