import { useState } from 'react';
import { pickRandomRegion } from '../data/backgroundRegions';
import styles from './PhotoBackground.module.css';

function PhotoBackground() {
    const [region] = useState(pickRandomRegion);

    return (
        <div className={styles.wrap} aria-hidden="true">
            <div className={`${styles.layer} ${styles.blurLayer}`}>
                <img src={region.image} alt="" className={styles.img} />
            </div>
            <div className={`${styles.layer} ${styles.sharpLayer}`}>
                <img src={region.image} alt="" className={styles.img} />
            </div>
            <div className={styles.overlay} />
        </div>
    );
}

export default PhotoBackground;
