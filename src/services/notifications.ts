
import { toast } from "@/components/ui/use-toast";

// This function would be called when the bus is near a specific stop
export const sendBusNearStopNotification = (stopName: string, estimatedArrival: string) => {
  // Check if browser supports notifications
  if ('Notification' in window) {
    // Request permission if not granted
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          createNotification(stopName, estimatedArrival);
        }
      });
    } else {
      createNotification(stopName, estimatedArrival);
    }
  }
  
  // Also show as a toast notification for in-app visibility
  toast({
    title: "Bus Approaching",
    description: `Bus approaching ${stopName} in approximately ${estimatedArrival} minutes.`,
  });
};

// Helper function to create native notifications
const createNotification = (stopName: string, estimatedArrival: string) => {
  try {
    const notification = new Notification('Bus Approaching', {
      body: `Bus approaching ${stopName} in approximately ${estimatedArrival} minutes.`,
      icon: '/bus-icon.svg'
    });
    
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Function to register for push notifications with service worker
// In a real implementation, this would connect to FCM or other push service
export const registerForPushNotifications = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  return false;
};
