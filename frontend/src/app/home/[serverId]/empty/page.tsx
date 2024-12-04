import ThemeToggle from '@/components/theme_toggle/theme_toggle';

export default function EmptyPage() {
    return (
        <div className="flex flex-col chat-area h-screen bg-bg-light min-w-0">
            <div className="w-full bg-bg-light flex items-center p-3 shadow-b z-10 h-header">
                <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                <p className="text-lg text-fg-medium"></p>
                <div className="block md:hidden flex grow justify-end items-center">
                    <ThemeToggle />
                </div>
            </div>
            <div className="flex justify-center items-center grow">
                <p className="text-fg-medium">Create a channel to get started!</p>
            </div>
        </div>
    );
}
