export const BASEURL: string = import.meta.env.VITE_BASE_PROXY_URL as string;

export const getEncodedUrl = (query: string) =>
  `?${encodeURIComponent(`https://itunes.apple.com/${query}`)}`;
