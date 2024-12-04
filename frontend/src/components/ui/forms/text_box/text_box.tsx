import { createRef, Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import './text_box.css';

type TextBoxProps = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    title: string;
    multiline?: boolean;
    placeholder: string;
    maxChars: number;
    hideCount?: boolean;
    optional?: boolean;
    submitted: boolean | undefined;
    setValid: Dispatch<SetStateAction<boolean | undefined>>;
};

export default function TextBox({
    value,
    setValue,
    title,
    multiline,
    placeholder,
    maxChars,
    optional,
    hideCount,
    submitted,
    setValid,
}: TextBoxProps) {
    const ref = createRef<HTMLDivElement>();

    const isValid = useCallback((value: string): boolean =>
        !!((optional || value.length > 0) && (!maxChars || (maxChars && value.length <= maxChars))), [maxChars, optional]);

    const handleChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        setValid(isValid(value));
    }, [value, isValid, setValid]);

    useEffect(() => {
        if (ref.current && submitted && !isValid(value)) {
            ref.current.classList.remove('animate-invalid');
            ref.current.classList.add('animate-invalid');
        }
    }, [submitted, isValid, ref, value]);

    return (
        <div className="text-box">
            <p className="text-fg-medium mb-2">{title}</p>
            <div
                className="flex items-center p-1 bg-bg-medium border border-bg-medium rounded"
                ref={ref}
            >
                {multiline && (
                    <textarea
                        rows={2}
                        placeholder={placeholder}
                        className="resize-none grow outline-none p-1 text-fg-dark bg-bg-medium"
                        value={value}
                        onChange={e => handleChange(e.target.value)}
                    />
                )}
                {!multiline && (
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="min-w-0 grow outline-none p-1 text-fg-dark bg-bg-medium"
                        value={value}
                        onChange={e => handleChange(e.target.value)}
                    />
                )}
                {!hideCount && (
                    <div className="p-1">
                        <p
                            className={
                                'text-xs ' + (isValid(value) ? 'text-fg-medium' : 'text-red-600')
                            }
                        >
                            {value.length}/{maxChars}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
