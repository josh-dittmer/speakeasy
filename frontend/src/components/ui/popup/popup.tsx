import React, { useEffect, useState } from 'react';

import './popup.css';

export default function Popup({ children, open }: { children: React.ReactNode; open: boolean }) {
    const [appear, setAppear] = useState<boolean>(false);

    // prevents animation from playing on page load
    useEffect(() => {
        if (open) {
            setAppear(true);
        }
    }, [open]);

    return (
        <>
            {appear && (
                <div className={''}>
                    <div
                        className={
                            'fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center ' +
                            (open ? 'popup-open' : 'popup-close')
                        }
                    >
                        <div
                            className={
                                'absolute bg-bg-dark rounded-xl shadow-inner border border-bg-medium'
                            }
                        >
                            {children}
                        </div>
                    </div>
                    <div
                        className={
                            'fixed top-0 left-0 w-screen h-screen z-40 bg-black ' +
                            (open ? 'backdrop-open' : 'backdrop-close')
                        }
                    ></div>
                </div>
            )}
        </>
    );
}
