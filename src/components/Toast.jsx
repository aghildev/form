// Toast.js
import React from 'react';
import styles from '../css/Toast.module.css';

const Toast = ({ message, onClose }) => {
    return (
        <div className={styles.toastContainer}>
            <div className={styles.toastMessage}>
                {message}
            </div>
            <button className={styles.toastCloseButton} onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default Toast;
