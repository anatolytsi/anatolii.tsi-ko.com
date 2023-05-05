import Link from "next/link";

import styles from './layout.module.scss';

interface NavItemProps {
  text: string
  href: string
  active: boolean
}

const NavItem = ({ text, href, active }: NavItemProps) => {
  return (
    <Link 
      href={href} 
      className={`${styles.item} ${active ? styles.active : ''}`}
    >
      {text}
    </Link>
  );
};

export default NavItem;
