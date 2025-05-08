
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";

// Enhanced toast with better error handling
export const toast = {
  ...hookToast,
  error: (message: string) => {
    console.error(message); // Log error for debugging
    return hookToast({
      title: "Erreur",
      description: message,
      variant: "destructive",
    });
  }
};

export const useToast = useHookToast;
