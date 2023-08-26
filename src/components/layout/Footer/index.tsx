import styles from './Footer.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.links}>
                    <a className={styles.link} href='https://github.com/anatolytsi/' target='_blank'>
                        <FontAwesomeIcon icon={faGithub} size='lg' />
                    </a>
                    <span className={styles.divider}>/</span>
                    <a className={styles.link} href='https://linkedin.com/in/anatolytsi/' target='_blank'>
                        <FontAwesomeIcon icon={faLinkedinIn} size='lg' />
                    </a>
                    <span className={styles.divider}>/</span>
                    <a className={styles.link} href='mailto:anatolii@tsi-ko.com' target='_blank'>
                        <FontAwesomeIcon icon={faEnvelope} size='lg' />
                    </a>
                </div>
                <p>
                    Copyright &copy; {new Date().getFullYear()} 
                    <a href="https://www.linkedin.com/in/anatolytsi/"
                       target="_blank">
                        Anatolii Tsirkunenko
                    </a>
                </p>
            </div>
        </footer>
    )
}
