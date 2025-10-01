import toast from 'react-hot-toast';

// Centralized toast configuration with consistent styling and timing
export const toastConfig = {
  // Default durations
  duration: {
    short: 2000,      // Quick feedback (2s)
    medium: 3000,     // Normal messages (3s)
    long: 5000,       // Important messages (5s)
    veryLong: 7000,   // Critical messages (7s)
  },
  
  // Consistent styling
  style: {
    success: {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    },
    loading: {
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '8px',
      },
    },
    info: {
      duration: 3000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '8px',
      },
    },
  },
};

// Custom toast functions with consistent styling
export const showToast = {
  success: (message: string, duration?: number) => {
    return toast.success(message, {
      ...toastConfig.style.success,
      duration: duration || toastConfig.duration.medium,
    });
  },
  
  error: (message: string, duration?: number) => {
    return toast.error(message, {
      ...toastConfig.style.error,
      duration: duration || toastConfig.duration.long,
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, toastConfig.style.loading);
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        loading: toastConfig.style.loading,
        success: toastConfig.style.success,
        error: toastConfig.style.error,
      }
    );
  },
  
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};
