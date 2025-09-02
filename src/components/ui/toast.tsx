import { Toaster, ToastPosition } from 'react-hot-toast';

interface ToastProviderProps {
  position?: ToastPosition;
}

const options = { style: { borderRadius: '8px', fontWeight: '500' } };

export function ToastProvider({ position = 'top-center' }: ToastProviderProps) {
  return <Toaster position={position} toastOptions={options} />;
}
