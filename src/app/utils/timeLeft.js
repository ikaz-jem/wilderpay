export function timeLeft(isoString) {
    const now = new Date();
    const target = new Date(isoString);

    if (isNaN(target.getTime())) return 'Invalid Date';
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) return 'Unlocked';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
    } else {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} left`;
    }
}