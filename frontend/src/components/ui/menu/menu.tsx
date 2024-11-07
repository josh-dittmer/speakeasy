import { Pencil, Trash } from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react'

import './menu.css'

type MenuState = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

/*
Example:


*/

export function MenuSeparator() {
    return (
        <div className="h-[0.5px] bg-fg-light mt-2 mb-2"></div>
    )
}

export function MenuItem({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
    return (
        <>
            <div onClick={() => onClick()} className="flex gap-2 items-center text-fg-dark p-1 hover:bg-bg-medium rounded mt-2 mb-2">
                {children}
            </div>
        </>
    )
}

export function MenuUp({ children, menuState }: { children: React.ReactNode[], menuState: MenuState }) {
    return (
        <>
            {menuState.open && (
                <div className="relative">
                    <div className="absolute menu-up w-full">
                        <div className="m-3 bg-bg-light p-2 rounded shadow">
                            {children.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        {item}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default function Menu({ children, menuState }: { children: React.ReactNode[], menuState: MenuState }) {
    return (
        <>
            {menuState.open && (
                <div className="relative">
                    <div className="absolute menu w-full">
                        <div className="m-3 bg-bg-light p-2 rounded shadow">
                            {children.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        {item}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}