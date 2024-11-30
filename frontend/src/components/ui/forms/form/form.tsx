import './form.css'

export function NormalForm({ children }: { children: React.ReactNode }) {
    return (
        <div className="normal-form text-md">
            {children}
        </div>
    )
}

export function SmallForm({ children }: { children: React.ReactNode }) {
    return (
        <div className="small-form text-xs">
            {children}
        </div>
    )
}