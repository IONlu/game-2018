import CanonImage from '../assets/svg/canon.svg'
import IonImage from '../assets/svg/ion.svg'
import ShieldImage from '../assets/svg/shield.svg'
import TankImage from '../assets/svg/tank.svg'
import TracerImage from '../assets/svg/tracer.svg'

export default {
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
            initial: 80
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
            initial: 100
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
            initial: 1
        }
    },

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
            initial: 5
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
            initial: 5
        }
    }
}

export const getLevelPrice = (tower, level) => {
    return Math.round(tower.data.price * (level / 4))
}

export const getRange = tower => {
    return Math.round((tower.data.range.initial + ((tower.range - 1) * 0.5)) * 100) / 100
}

export const getBugDamage = (tower, bug) => {
    return Math.round((tower.data.damage.initial + ((tower.damage - 1) * tower.data.damage.initial * 0.5)) * 100) / 100
}

export const getSpeed = tower => {
    return Math.round((tower.data.speed.initial / (1 + ((tower.speed - 1) * 0.1))) * 100) / 100
}
