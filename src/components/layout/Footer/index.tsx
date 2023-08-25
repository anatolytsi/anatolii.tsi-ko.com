import styles from './Footer.module.scss';

//#f5f5f7
export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div>
                <p>
                    &copy;{new Date().getFullYear()} 
                    <a href="https://www.linkedin.com/in/anatolytsi/"
                       target="_blank">
                        Anatolii Tsirkunenko
                    </a>
                </p>
            </div>
        </footer>
    )
}
