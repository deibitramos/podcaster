import toast from 'react-hot-toast';

const styles = {
  success: { background: '#1f2937', color: '#10b981', border: '1px solid #065f46' },
  error: { background: '#1f2937', color: '#ef4444', border: '1px solid #7f1d1d' },
  warning: { background: '#1f2937', color: '#f59e0b', border: '1px solid #78350f' },
  info: { background: '#1f2937', color: '#3b82f6', border: '1px solid #1e3a8a' },
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, { duration: 5000, style: styles.success });
  },
  error: (message: string) => {
    toast.error(message, { duration: 5000, style: styles.error });
  },
  warning: (message: string) => {
    toast(message, { duration: 5000, style: styles.warning });
  },
  info: (message: string) => {
    toast(message, { duration: 5000, style: styles.info });
  },
};
