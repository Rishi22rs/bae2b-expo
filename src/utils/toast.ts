export type ToastType = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export type ToastPayload = {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
};

type ToastHandler = (payload: ToastPayload) => void;

let toastHandler: ToastHandler | null = null;

export const setToastHandler = (handler: ToastHandler | null) => {
  toastHandler = handler;
};

export const showToast = (payload: ToastPayload | string) => {
  if (!toastHandler) {
    return;
  }

  const nextPayload: ToastPayload =
    typeof payload === 'string' ? {message: payload} : payload;

  if (!nextPayload?.message) {
    return;
  }

  toastHandler(nextPayload);
};

export const showSuccessToast = (
  message: string,
  options: Omit<ToastPayload, 'message' | 'type'> = {},
) => {
  showToast({
    ...options,
    message,
    type: 'success',
  });
};

export const showErrorToast = (
  message: string,
  options: Omit<ToastPayload, 'message' | 'type'> = {},
) => {
  showToast({
    ...options,
    message,
    type: 'error',
  });
};

export const showInfoToast = (
  message: string,
  options: Omit<ToastPayload, 'message' | 'type'> = {},
) => {
  showToast({
    ...options,
    message,
    type: 'info',
  });
};
