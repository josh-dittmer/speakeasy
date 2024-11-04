import { Pencil, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react'

import './menu.css'

type MenuState = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

/*
Example:
<Menu menuState={{ open: menuOpen, setOpen: setMenuOpen }}>
    <MenuItem>
        <Pencil width={15} height={15} />
        <p>Edit</p>
    </MenuItem>
    <MenuItem>
        <Trash width={15} height={15} className="text-red-800" />
        <p className="text-red-800">Delete</p>
    </MenuItem>
</Menu>

*/

export function MenuItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-2 items-center text-fg-medium p-1 hover:bg-bg-medium rounded">
            {children}
        </div>
    )
}

export default function Menu({ children, menuState }: { children: React.ReactNode[], menuState: MenuState }) {
    return (
        <>
            {menuState.open && (
                <div className="relative">
                    <div className="absolute right-0 bg-bg-light p-2 rounded shadow w-fit">
                        {children.map((item, index) => {
                            return (
                                <>
                                    {item}
                                    {index !== children.length - 1 && (
                                        <div className="h-[0.5px] bg-fg-light mt-1 mb-1"></div>
                                    )}
                                </>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}