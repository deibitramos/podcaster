export const BASEURL = import.meta.env.VITE_BASE_PROXY_URL as string;
export const REACT_SCAN = import.meta.env.VITE_REACT_SCAN === 'true';
export const DEV = import.meta.env.DEV;

export const getEncodedUrl = (query: string) =>
  `?${encodeURIComponent(`https://itunes.apple.com/${query}`)}`;
