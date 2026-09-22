if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const BACKEND_URL = (process.env.BACKEND_API_URL || '').replace(/\/$/, '');
