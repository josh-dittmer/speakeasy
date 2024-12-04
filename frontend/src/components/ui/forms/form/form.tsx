import './form.css';

export function NormalForm({ width, height, children }: { width?: string, height?: string, children: React.ReactNode }) {
    return <div style={{ width: width, height: height }} className="normal-form text-md">{children}</div>;
}

export function SmallForm({ children }: { children: React.ReactNode }) {
    return <div className="small-form text-xs">{children}</div>;
}
