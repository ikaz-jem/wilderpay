export function timeAgo(isoString) {
    const now = new Date();
    const target = new Date(isoString);

    if (isNaN(target.getTime())) return 'Invalid Date';

    const diffMs = now.getTime() - target.getTime();

    if (diffMs < 0) return 'In the future';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) {
        return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
        return target.toLocaleDateString(); // e.g., "6/13/2025"
    }
}
