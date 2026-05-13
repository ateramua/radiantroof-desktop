'use client';

import { useEffect } from 'react';
import { updateApiBaseUrl } from '../lib/api';

export default function ApiInitializer() {
  useEffect(() => {
    updateApiBaseUrl();
  }, []);

  return null; // This component doesn't render anything
}