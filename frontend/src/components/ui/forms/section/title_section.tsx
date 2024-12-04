import { LucideProps } from 'lucide-react';

export default function TitleSection({
    title,
    icon: Icon,
}: {
    title: string;
    icon: React.FC<LucideProps>;
}) {
    return (
        <div className="flex items-center p-3">
            <Icon width={25} height={25} className="text-fg-medium" />
            <h1 className="ml-3 text-fg-dark text-2xl">{title}</h1>
        </div>
    );
}
