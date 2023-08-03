import { useToast } from 'vue-toast-notification'
const toastOriginal = useToast({
  duration: 5000,
  // position: top, bottom, top-right, bottom-right,top-left, bottom-left
  position: 'top-right',
})

type ToastMethod = 'success' | 'error' | 'info' | 'warning'

// A queue to keep track of toasts that should be displayed.
// This is to support the case where toasts are triggered _before_ the
// feature flag is enabled.
const queue: Array<{
  type: ToastMethod
  message: string
}> = []
const enqueue = (type: ToastMethod) => (message: string) => {
  queue.push({ type, message })
}

// Stub a fake toast object that will queue up toasts until the feature
// flag is enabled.
// In the codebase we only ever use:
//  * toast.success
//  * toast.error
//  * toast.info
//  * toast.warning
const toastFake = {
  success: enqueue('success'),
  error: enqueue('error'),
  info: enqueue('info'),
  warning: enqueue('warning'),
}

// Override the original toast object with the fake methods.
// We assume the feature flag is disabled until the network request
// completes.
const toast = { ...toastOriginal, ...toastFake }

export const enableToast = () => {
  // Replace the stubbed toast object with the real one.
  toast.success = toastOriginal.success;
  toast.error = toastOriginal.error;
  toast.warning = toastOriginal.warning;

  // As there are no feature flags, enabling 'info' toast by default.
  toast.info = toastOriginal.info;

  // Display any toasts for the enabled types
  // that were queued up before the feature flag was enabled.
  queue.forEach(({ type, message }) => {
    toast[type](message);
    console.log(`Displaying ${type} message: ${message}`);
  });
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast,
    },
  }
})
