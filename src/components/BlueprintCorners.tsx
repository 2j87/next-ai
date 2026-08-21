import styles from '../styles/blueprint.module.css';

function BlueprintCorners() {
    return (
        <>
            <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
        </>
    );
}

export default BlueprintCorners;
