// src/lib/utils.ts

// Format date to readable string
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Format time ago (e.g., "2 hours ago")
export function timeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs: number = now.getTime() - past.getTime();
    const diffMins: number = Math.floor(diffMs / 60000);
    const diffHours: number = Math.floor(diffMins / 60);
    const diffDays: number = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return formatDate(date);
}

// Format number with commas (e.g., 1,000)
export function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Generate random ID
export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Calculate progress percentage
export function calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
}

// Get level from points
export function getLevelFromPoints(points: number): string {
    if (points < 500) return 'Beginner';
    if (points < 1500) return 'Intermediate';
    if (points < 3000) return 'Advanced';
    return 'Master';
}

// Get next level points needed
export function getNextLevelPoints(points: number): number {
    if (points < 500) return 500 - points;
    if (points < 1500) return 1500 - points;
    if (points < 3000) return 3000 - points;
    return 0;
}

// Get progress to next level (0-100)
export function getProgressToNextLevel(points: number): number {
    if (points < 500) return calculateProgress(points, 500);
    if (points < 1500) return calculateProgress(points - 500, 1000);
    if (points < 3000) return calculateProgress(points - 1500, 1500);
    return 100;
}

// Get color based on difficulty
interface DifficultyColors {
    text: string;
    bg: string;
    border: string;
}

export function getDifficultyColor(difficulty: string): DifficultyColors {
    switch (difficulty.toLowerCase()) {
        case 'beginner':
            return { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
        case 'intermediate':
            return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
        case 'advanced':
            return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
        default:
            return { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    }
}

// Get icon based on module type
export function getModuleIcon(moduleType: string): string {
    const icons: Record<string, string> = {
        'beginner': '🌱',
        'intermediate': '🚀',
        'advanced': '🏆',
        'quiz': '📝',
        'game': '🎮',
        'simulation': '🌍',
        'python': '🐍',
        'ml': '🤖',
        'ai': '🧠',
    };
    return icons[moduleType.toLowerCase()] || '📚';
}

// Save to localStorage with error handling
export function saveToLocalStorage<T>(key: string, value: T): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Get from localStorage with error handling
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Validate email format
export function isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
export function isStrongPassword(password: string): boolean {
    return password.length >= 6;
}

// Scroll to top smoothly
export function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get query params from URL
export function getQueryParam(param: string): string | null {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
}

// Download data as JSON
export function downloadAsJSON<T>(data: T, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result: Record<string, T[]>, item: T) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

// Sum array of numbers
export function sumArray(numbers: number[]): number {
    return numbers.reduce((sum: number, num: number) => sum + num, 0);
}

// Average of array
export function averageArray(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return sumArray(numbers) / numbers.length;
}

// Get random item from array
export function randomItem<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

// Capitalize first letter
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Slugify string (for URLs)
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Check if object is empty
export function isEmptyObject(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// Sleep/delay function
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format file size
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get browser info
export function getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'Server';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
}

// Check if mobile device
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}