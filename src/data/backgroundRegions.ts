import anitkabir from '../assets/backgrounds/anitkabir.jpg';
import ararat from '../assets/backgrounds/ararat.jpg';
import ayder from '../assets/backgrounds/ayder.jpg';
import cappadocia from '../assets/backgrounds/cappadocia.jpg';
import ephesus from '../assets/backgrounds/ephesus.jpg';
import pamukkale from '../assets/backgrounds/pamukkale.jpg';
import turquoiseCoast from '../assets/backgrounds/turquoise-coast.jpg';
import vanLake from '../assets/backgrounds/van-lake.jpg';

export interface BackgroundRegion {
    id: string;
    name: string;
    image: string;
}

export const BACKGROUND_REGIONS: BackgroundRegion[] = [
    { id: 'cappadocia', name: 'Kapadokya', image: cappadocia },
    { id: 'pamukkale', name: 'Pamukkale', image: pamukkale },
    { id: 'turquoise-coast', name: 'Turkuaz Kıyı', image: turquoiseCoast },
    { id: 'ararat', name: 'Ağrı Dağı', image: ararat },
    { id: 'ayder', name: 'Ayder Yaylası', image: ayder },
    { id: 'ephesus', name: 'Efes', image: ephesus },
    { id: 'van-lake', name: 'Van Gölü', image: vanLake },
    { id: 'anitkabir', name: 'Anıtkabir', image: anitkabir },
];

export function pickRandomRegion(): BackgroundRegion {
    return BACKGROUND_REGIONS[Math.floor(Math.random() * BACKGROUND_REGIONS.length)];
}
