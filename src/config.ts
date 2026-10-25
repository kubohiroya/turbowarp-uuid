export const extensionConfig = {
  id: 'kubohiroyauuid',
  slug: 'turbowarp-uuid',
  name: 'TurboWarp-UUID',
  description: 'Generate UUID v4/v7 and validate UUID strings in TurboWarp.',
  author: 'Hiroya Kubo',
  license: 'MPL-2.0',
  unsandboxed: false,
  docsURI: 'https://kubohiroya.github.io/turbowarp-uuid/',
  blockIconURI: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="6" fill="#8A55D7"/><text x="24" y="29.76" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle" fill="#fff">ID</text></svg>')}`
} as const;
