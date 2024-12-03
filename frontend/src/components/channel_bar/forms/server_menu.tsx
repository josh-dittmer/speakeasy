import Menu, { MenuItem, MenuSeparator } from "@/components/ui/menu/menu";
import { LogOut, Pencil, Settings, Trash, Users } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import EditServer from "./edit_server";
import { ServerT } from "models";
import LeaveServer from "./leave_server";
import CreateInvite from "./create_invite";

export default function ServerMenu({ server, open, setOpen }: { server: ServerT, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [editServerOpen, setEditServerOpen] = useState<boolean>(false);
    const [leaveServerOpen, setLeaveServerOpen] = useState<boolean>(false);
    const [createInviteOpen, setCreateInviteOpen] = useState<boolean>(false);

    return (
        <>
            <Menu menuState={{ open: open, setOpen: setOpen }}>
                <MenuItem onClick={() => {
                    setOpen(false);
                    setEditServerOpen(true);
                }}>
                    <p className="text-sm grow">Server Settings</p>
                    <Settings width={15} height={15} />
                </MenuItem>
                <MenuItem onClick={() => {
                    setOpen(false);
                    setCreateInviteOpen(true);
                }}>
                    <p className="text-sm grow">Create Invite</p>
                    <Users width={15} height={15} />
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={() => {
                    setOpen(false);
                    setLeaveServerOpen(true);
                }}>
                    <p className="text-sm text-red-600 grow">Leave Server</p>
                    <LogOut width={15} height={15} className="text-red-600" />
                </MenuItem>
            </Menu>
            <EditServer server={server} menuOpen={editServerOpen} setMenuOpen={setEditServerOpen} />
            <LeaveServer server={server} menuOpen={leaveServerOpen} setMenuOpen={setLeaveServerOpen} />
            <CreateInvite server={server} menuOpen={createInviteOpen} setMenuOpen={setCreateInviteOpen} />
        </>
    )
}