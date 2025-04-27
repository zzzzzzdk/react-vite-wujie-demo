const map = {
  '//localhost:5174/': '//localhost:5174/',
};

export default function hostMap(host) {
  if (process.env.NODE_ENV === 'production') return map[host];
  return host;
}
