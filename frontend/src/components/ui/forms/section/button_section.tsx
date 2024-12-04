import { ReactElement } from 'react';
import { CancelButton, DeleteButton, SubmitButton } from '../button/button';

type ButtonSectionProps = {
    children:
    | [
        ReactElement<typeof DeleteButton>,
        ReactElement<typeof CancelButton>,
        ReactElement<typeof SubmitButton>,
    ]
    | [
        ReactElement<typeof CancelButton>,
        ReactElement<typeof SubmitButton>
    ]
    | [ReactElement<typeof SubmitButton>]
};

export default function ButtonSection({ children }: ButtonSectionProps) {
    return (
        <div className="flex items-center p-3">
            {children.length === 3 && (
                <>
                    {children[0]}
                    <div className="flex grow justify-end">
                        {children[1]}
                        {children[2]}
                    </div>
                </>
            )}
            {children.length === 2 && (
                <div className="flex grow justify-end">
                    {children[0]}
                    {children[1]}
                </div>
            )}
            {children.length === 1 && (
                <div className="flex grow justify-end">
                    {children[0]}
                </div>
            )}
        </div>
    );
}
