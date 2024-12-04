import { createRef, Dispatch, SetStateAction, useEffect } from 'react';

import './dropdown.css';

export type Option = {
    value: string;
    title: string;
};

type DropdownProps = {
    options: Option[];
    selectedOption: string;
    setSelectedOption: Dispatch<SetStateAction<string>>;
    title: string;
    submitted: boolean | undefined;
    setValid: Dispatch<SetStateAction<boolean | undefined>>;
};

const isValid = (value: string): boolean => value !== '';

export default function Dropdown({
    options,
    selectedOption,
    setSelectedOption,
    title,
    submitted,
    setValid,
}: DropdownProps) {
    const ref = createRef<HTMLDivElement>();

    const handleChange = (value: string) => {
        setSelectedOption(value);
    };

    useEffect(() => {
        setValid(isValid(selectedOption));
    }, [selectedOption, setValid]);

    useEffect(() => {
        if (ref.current && submitted && !isValid(selectedOption)) {
            ref.current.classList.remove('animate-invalid');
            ref.current.classList.add('animate-invalid');
        }
    }, [submitted, ref, selectedOption]);

    return (
        <div className="dropdown">
            <p className="text-fg-medium mb-2">{title}</p>
            <div className="">
                <select
                    value={selectedOption}
                    onChange={e => handleChange(e.target.value)}
                    className="bg-bg-light text-fg-dark p-3 rounded outline-none"
                >
                    {options.map(option => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.title}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}
