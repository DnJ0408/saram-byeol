// 개발 환경(pnpm dev)에서는 localhost로 리다이렉션
// 배포 환경(pnpm start 또는 배포 사이트)에서는 실제 도메인으로 리다이렉션
const isDev = process.env.NODE_ENV === 'development';

const BASE_URL = isDev ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL : process.env.NEXT_PUBLIC_PROJECT_BASE_URL;

export const REDIRECT_TO = `${BASE_URL}/auth/callback`;
