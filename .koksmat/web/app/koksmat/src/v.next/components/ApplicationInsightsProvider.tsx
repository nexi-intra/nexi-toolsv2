'use client'

import React from 'react';
import { useApplicationInsights } from '../hooks/useApplicationInsights';

interface ApplicationInsightsProviderProps {
  instrumentationKey: string;
  children: React.ReactNode;
}

export const ApplicationInsightsProvider: React.FC<ApplicationInsightsProviderProps> = ({
  instrumentationKey,
  children
}) => {
  const { isInitialized } = useApplicationInsights(instrumentationKey);

  if (!isInitialized) {
    return null; // Or a loading indicator
  }

  return <>{children}</>;
};

