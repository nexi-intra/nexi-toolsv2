import { useEffect, useState } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let appInsights: ApplicationInsights | null = null;

export const useApplicationInsights = (instrumentationKey: string) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!appInsights) {
      appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: instrumentationKey,
          enableAutoRouteTracking: true, // Enable this to automatically track route changes
        },
      });
      appInsights.loadAppInsights();
      appInsights.trackPageView(); // Tracks the current page view
      setIsInitialized(true);
    }
  }, [instrumentationKey]);

  const trackEvent = (name: string, properties?: { [key: string]: any }) => {
    appInsights?.trackEvent({ name, properties });
  };

  return { isInitialized, trackEvent };
};
