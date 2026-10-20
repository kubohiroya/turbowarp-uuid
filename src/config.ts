export const extensionConfig = {
  id: 'kubohiroyauuid',
  slug: 'turbowarp-uuid',
  name: 'TurboWarp-UUID',
  description: 'Generate UUID v4/v7 and validate UUID strings in TurboWarp.',
  author: 'Hiroya Kubo',
  license: 'MPL-2.0',
  unsandboxed: false,
  docsURI: 'https://kubohiroya.github.io/turbowarp-uuid/',
  blockIconURI: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="3" y="7" width="42" height="34" rx="8" fill="#0f766e"/><text x="24" y="30" text-anchor="middle" fill="white" font-family="monospace" font-size="17">ID</text></svg>')}`
} as const;
