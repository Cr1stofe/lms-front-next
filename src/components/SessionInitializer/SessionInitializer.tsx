'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLMSStore } from '@/stores/useLMSStore';
import { Role } from '@/lib/types';

interface SessionInitializerProps {
  initialRole?: string;
}

export default function SessionInitializer({ initialRole }: SessionInitializerProps) {
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const fetchCourses = useLMSStore((state) => state.fetchCourses);

  useEffect(() => {
    if (initialRole && initialRole !== 'public') {
      useAuthStore.setState({ role: initialRole.toLowerCase() as Role });
    }
    refreshSession();
    fetchCourses();
  }, [initialRole, refreshSession, fetchCourses]);

  return null;
}
