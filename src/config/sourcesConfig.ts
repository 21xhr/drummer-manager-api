// config/sourcesConfig.ts
/**
 * TRUSTED_SOURCES defines the whitelist for the Automated Profiling system.
 * Links from these domains are automatically approved and may trigger metadata fetching.
 */
export const TRUSTED_SOURCES = {
  VIDEO: [
    'youtube.com',
    'youtu.be',
    'vimeo.com'
  ],
  AUDIO: [
    'spotify.com',
    'music.youtube.com',
    'soundcloud.com',
    'bandcamp.com',
    'deezer.com',
    'tidal.com',
    'qobuz.com',
    'suno.com',
    'udio.com'
  ],
  WIKI: [
    'wikipedia.org',
    'britannica.com'
  ],
  DOCUMENT: [
    'drive.google.com',
    'dropbox.com'
  ]
};

/**
 * Checks if a given URL belongs to the trusted whitelist for its type.
 */
export const isTrustedUrl = (type: string, url: string): boolean => {
  if (!url) return true; // Empty URLs (like in OTHER) are technically trusted
  const typeKey = type.toUpperCase() as keyof typeof TRUSTED_SOURCES;
  const whitelist = TRUSTED_SOURCES[typeKey];
  if (!whitelist) return false;
  
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return whitelist.some(trusted => domain.includes(trusted));
  } catch {
    return false;
  }
};