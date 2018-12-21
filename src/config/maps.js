import map0Image from '../assets/maps/map0.png'
import map1Image from '../assets/maps/map1.png'
import map2Image from '../assets/maps/map2.png'
import map3Image from '../assets/maps/map3.png'

export default [
    {
        name: 'serpent',
        width: 10,
        height: 11,
        data: 'SFFFFFFFFF' +
            'WWWWWWWWWF' +
            'FFFFFFFFFF' +
            'FWWWWWWWWW' +
            'FFFFFFFFFF' +
            'WWWWWWWWWF' +
            'FFFFFFFFFF' +
            'FWWWWWWWWW' +
            'FFFFFFFFFF' +
            'WWWWWWWWWF' +
            'EFFFFFFFFF',
        startOrientation: Math.PI / 2,
        endOrientation: Math.PI / 2,
        image: map3Image
    },
    {
        name: 'spyro',
        width: 14,
        height: 14,
        data: 'WFFFFFFFFFFFFF' +
            'WFWWWWWWWWWWWF' +
            'WFWFFFFFFFFFWF' +
            'WFWFWWWWWWWFWF' +
            'WFWFWFFFFFWFWF' +
            'WFWFWFWWWFWFWF' +
            'WFWFWFWWWFWFWF' +
            'WFWFWFWEWFWFWF' +
            'WFWFWFWFWFWFWF' +
            'WFWFWFWFFFWFWF' +
            'WFWFWFWWWWWFWF' +
            'WSWFWFFFFFFFWF' +
            'WWWFWWWWWWWWWF' +
            'WWWFFFFFFFFFFF',
        startOrientation: 0,
        endOrientation: Math.PI,
        image: map0Image
    },
    {
        name: 'octet',
        width: 13,
        height: 11,
        data: 'WFFFFFFFFFFFW' +
            'FFWWWWWWWWWFF' +
            'FWWWWWWWWWWWF' +
            'FWWWWWFFFFFFF' +
            'FWWWWWFWWWWWW' +
            'FFFEWWFWWSFFF' +
            'WWWWWWFWWWWWF' +
            'FFFFFFFWWWWWF' +
            'FWWWWWWWWWWWF' +
            'FFWWWWWWWWWFF' +
            'WFFFFFFFFFFFW',
        startOrientation: Math.PI / 2,
        endOrientation: -Math.PI / 2,
        image: map2Image
    },
    {
        name: 'coil',
        width: 18,
        height: 17,
        data: 'WWWWWWWWWWWWWWWWWW' +
            'WWWWWWWWWWWWWWWWWW' +
            'FFFFFFFFFFFWWEWWWW' +
            'FWWWWWWWWWFWWFWWWW' +
            'FWWWWWWWWWFWWFWWWW' +
            'FWWFFFFFFWFWWFWWWW' +
            'FWWFWWWWFWFWWFWWWW' +
            'FWWFWFFFFWFFFFWWWW' +
            'FWWFWFWWWWWWWWWWWW' +
            'FWWFWFWWFFFFFFFSWW' +
            'FWWFWFWWFWWWWWWWWW' +
            'FWWFWFFFFWFFFFWWWW' +
            'FWWFWWWWWWFWWFWWWW' +
            'FWWFFFFFFFFWWFWWWW' +
            'FWWWWWWWWWWWWFWWWW' +
            'FWWWWWWWWWWWWFWWWW' +
            'FFFFFFFFFFFFFFWWWW',
        startOrientation: -Math.PI / 2,
        endOrientation: Math.PI,
        image: map1Image
    }
]
