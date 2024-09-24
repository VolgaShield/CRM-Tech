import styles from './PageButton.module.scss';

const PageButton = ({ children, ...props }) => {
  return (
    <button className={styles.pageButton} {...props} >{children}</button>
  )
}

export default PageButton;