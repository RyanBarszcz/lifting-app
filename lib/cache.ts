
const CACHE_TTL = 1000 * 60 * 5; // 5 min

export function getCache(key: string) {
    const raw = localStorage.getItem(key);
    if(!raw) return null;

    const parsed = JSON.parse(raw);

    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
    if(isExpired) {
        localStorage.removeItem(key);
        return null;
    }

    return parsed.data;
}

export function setCache(key: string, data: any){
    localStorage.setItem(
        key,
        JSON.stringify({
            data,
            timestamp: Date.now(),
        })
    )
}

export function invalidateCachePrefix(prefix: string) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }
}

export function invalidateCache(key: string) {
    localStorage.removeItem(key);
}