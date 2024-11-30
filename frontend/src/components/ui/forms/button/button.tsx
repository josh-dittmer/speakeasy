import { Trash } from "lucide-react"

import './button.css'

export function DeleteButton({ onClick, text }: { onClick: () => void, text: string }) {
    return (
        <div className="text-red-600 hover:text-red-800">
            <button
                onClick={onClick}
                className="flex items-center"
            >
                <Trash width={15} height={15} className="mr-2" />
                <p>{text}</p>
            </button>
        </div>
    )
}

export function CancelButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="text-fg-dark bg-bg-light hover:bg-bg-medium p-2 rounded mr-3"
        >
            Cancel
        </button>
    )
}

export function SubmitButton({ onClick, enabled, text }: { onClick: () => void, enabled: boolean | undefined, text?: string }) {
    return (
        <button
            onClick={onClick}
            className={`submit-button rounded ${enabled ? 'text-fg-accent bg-bg-accent hover:bg-bg-accent-dark' : 'text-fg-light bg-bg-light'}`}
            disabled={!enabled}
        >
            {(text) ? text : 'Save'}
        </button>
    )
}