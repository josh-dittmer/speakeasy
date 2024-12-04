export default function DescriptionSection({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-3">
            <p className="text-fg-dark mb-2">{children}</p>
        </div>
    );
}
