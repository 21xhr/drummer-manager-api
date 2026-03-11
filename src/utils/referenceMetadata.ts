// src/utils/referenceMetadata.ts

type ReferenceTitleResult = {
    title: string | null;
    source: string;
};

const REQUEST_TIMEOUT_MS = 3000;

function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function getHostname(url: string): string {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
}

/*/////////////////////////////////////////////////////////////////////////////////
    Reference Metadata Fetching Logic
/////////////////////////////////////////////////////////////////////////////////*/
function isYouTubeHost(hostname: string): boolean {
    return hostname.includes('youtube.com') || hostname.includes('youtu.be');
}

function isVimeoHost(hostname: string): boolean {
    return hostname.includes('vimeo.com');
}

function isSoundCloudHost(hostname: string): boolean {
    return hostname.includes('soundcloud.com');
}
/*/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////*/

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x2F;/g, '/')
        .replace(/&#47;/g, '/')
        .trim();
}

function cleanTitle(text: string | null | undefined): string | null {
    if (!text) return null;

    const cleaned = decodeHtmlEntities(
        text
            .replace(/\s+/g, ' ')
            .replace(/\s+\|\s+YouTube$/i, '')
            .replace(/\s+-\s+YouTube$/i, '')
            .replace(/\s+\|\s+Vimeo$/i, '')
            .replace(/\s+-\s+Wikipedia$/i, '')
            .trim()
    );

    return cleaned.length > 0 ? cleaned : null;
}

async function fetchText(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'DrummerManager/1.0 (+reference title resolver)',
                'Accept': 'text/html,application/json'
            },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });

        if (!response.ok) return null;
        return await response.text();
    } catch {
        return null;
    }
}

async function fetchJson(url: string): Promise<any | null> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'DrummerManager/1.0 (+reference title resolver)',
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });

        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

function extractMetaContent(html: string, propertyName: string): string | null {
    const escaped = propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const patterns = [
        new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, 'i'),
        new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, 'i')
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
    }

    return null;
}

function extractTitleTag(html: string): string | null {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match?.[1] || null;
}

async function getOEmbedTitle(oembedUrl: string): Promise<string | null> {
    const data = await fetchJson(oembedUrl);
    return cleanTitle(data?.title);
}

async function getGenericHtmlTitle(url: string): Promise<string | null> {
    const html = await fetchText(url);
    if (!html) return null;

    const ogTitle = extractMetaContent(html, 'og:title');
    if (ogTitle) return cleanTitle(ogTitle);

    const twitterTitle = extractMetaContent(html, 'twitter:title');
    if (twitterTitle) return cleanTitle(twitterTitle);

    const titleTag = extractTitleTag(html);
    return cleanTitle(titleTag);
}

/*//////////////////////////////////////////////////////////////////////////////////
    Main Reference Title Fetching Function
//////////////////////////////////////////////////////////////////////////////////*/
export async function getReferenceTitle(url: string): Promise<ReferenceTitleResult> {
    if (!isHttpUrl(url)) {
        return { title: null, source: 'invalid_url' };
    }

    const hostname = getHostname(url);

    if (isYouTubeHost(hostname)) {
        const title = await getOEmbedTitle(
            `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
        );
        return { title, source: 'youtube' };
    }

    if (isVimeoHost(hostname)) {
        const title = await getOEmbedTitle(
            `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
        );
        return { title, source: 'vimeo' };
    }

    if (isSoundCloudHost(hostname)) {
        const title = await getOEmbedTitle(
            `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`
        );
        return { title, source: 'soundcloud' };
    }

    if (hostname.includes('spotify.com')) {
        const title = await getGenericHtmlTitle(url);
        return { title, source: 'spotify' };
    }

    if (hostname.includes('wikipedia.org')) {
        const title = await getGenericHtmlTitle(url);
        return { title, source: 'wikipedia' };
    }

    const title = await getGenericHtmlTitle(url);
    return { title, source: 'generic' };
}