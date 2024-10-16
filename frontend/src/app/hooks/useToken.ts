export function useToken(): () => string {
    return (): string => {
        return 'aaa';
    }
}