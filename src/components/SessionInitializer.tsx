'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLMSStore } from '@/stores/useLMSStore';

export default function SessionInitializer() {
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const fetchCourses = useLMSStore((state) => state.fetchCourses);

  useEffect(() => {
    refreshSession();
    fetchCourses();
  }, [refreshSession, fetchCourses]);

  return null;
}
