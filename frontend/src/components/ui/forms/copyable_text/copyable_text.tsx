import { Copy } from 'lucide-react';
import { createRef } from 'react';
import './copyable_text.css';

export default function CopyableText({ title, text }: { title: string, text: string }) {
    const inputRef = createRef<HTMLInputElement>();
    const containerRef = createRef<HTMLDivElement>();

    const handleCopy = () => {
        if (inputRef.current && containerRef.current) {
            //inputRef.current.select();
            //inputRef.current.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(inputRef.current.value);

            containerRef.current.classList.remove('animate-copied');
            containerRef.current.offsetHeight;
            containerRef.current.classList.add('animate-copied');
        }
    };

    return (
        <div className="copyable-text flex items-center justify-center">
            <div>
                <p className="text-fg-medium mb-2">{title}</p>
                <div className="flex items-center gap-2 bg-bg-medium p-3 rounded border-2 border-bg-medium" ref={containerRef}>
                    <input
                        type="text"
                        value={text}
                        ref={inputRef}
                        className="text-xs bg-transparent text-fg-dark outline-none w-72"
                    />
                    <button onClick={handleCopy}>
                        <Copy width={15} height={15} className="text-fg-dark" />
                    </button>
                </div>
            </div>
        </div>
    )
}