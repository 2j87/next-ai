import styles from './Settings.module.css';

type Theme = 'light' | 'dark';

interface SettingsProps {
    theme: Theme | null;
    onPickTheme: (theme: Theme) => void;
}

function resolveTheme(theme: Theme | null): Theme {
    if (theme) return theme;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
}

function Settings({ theme, onPickTheme }: SettingsProps) {
    const effectiveTheme = resolveTheme(theme);

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>Ayarlar</h1>

            <h2 className={styles.sectionHeading}>Görünüm</h2>
            <div className={styles.segmented} role="group" aria-label="Görünüm">
                <button
                    type="button"
                    className={`${styles.segmentOption} ${effectiveTheme === 'light' ? styles.segmentOptionActive : ''}`}
                    onClick={() => onPickTheme('light')}
                    aria-pressed={effectiveTheme === 'light'}
                >
                    Aydınlık
                </button>
                <button
                    type="button"
                    className={`${styles.segmentOption} ${effectiveTheme === 'dark' ? styles.segmentOptionActive : ''}`}
                    onClick={() => onPickTheme('dark')}
                    aria-pressed={effectiveTheme === 'dark'}
                >
                    Karanlık
                </button>
            </div>

            <h2 className={styles.sectionHeading}>Arka plan</h2>
            <p className={styles.sectionText}>
                Türkiye'nin doğal ve tarihi güzelliklerinden bir bölge her açılışta rastgele seçilir; aynı fotoğraf,
                seçtiğin görünüm moduna göre daha aydınlık veya daha koyu tonlanır.
            </p>

            <h2 className={styles.sectionHeading}>Hakkında</h2>
            <div className={styles.aboutList}>
                <div className={styles.aboutRow}>
                    <span className={styles.aboutLabel}>Sürüm</span>
                    <span className={styles.aboutValue}>NextAI 1.0</span>
                </div>
                <div className={styles.aboutRow}>
                    <span className={styles.aboutLabel}>Kaynak</span>
                    <span className={styles.aboutValue}>Genel gönderi akışı</span>
                </div>
            </div>
        </main>
    );
}

export default Settings;
