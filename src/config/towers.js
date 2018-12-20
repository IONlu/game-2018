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

export const getRange = tower => {
    return tower.range * tower.data.range.initial
}

export const getBugDamage = (tower, bug) => {
    return tower.damage * tower.data.damage.initial
}

export const getSpeed = tower => {
    return tower.speed * tower.data.speed.initial
}
