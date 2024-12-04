'use client';

import { useCreateMessageMutation } from '@/lib/mutations/create_message';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import {
    allowedImageMimes,
    allowedMimes,
    ChannelT,
    maxFileSize,
    maxMessageLength,
    maxNumFiles
} from 'models';
import Image from 'next/image';
import { ChangeEvent, createRef, KeyboardEvent, useMemo, useState } from 'react';

import { CLIENT_ID } from '@/lib/util/client_id';
import './chat_box.css';

function FilePreview({ file, removeFile }: { file: File; removeFile: (file: File) => void }) {
    const isImg = allowedImageMimes.includes(file.type);

    const imgUrl = useMemo(() => (isImg ? URL.createObjectURL(file) : undefined), [file, isImg]);

    if (isImg && imgUrl) {
        return (
            <div className="relative m-3">
                <div className="absolute top-[-10px] left-[-10px]">
                    <button
                        className="p-1 bg-red-600 hover:bg-red-800 rounded-full text-white shadow"
                        onClick={() => removeFile(file)}
                    >
                        <X width={15} height={15} />
                    </button>
                </div>
                <Image
                    src={imgUrl}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full max-h-32 rounded"
                    alt="Message image"
                />
            </div>
        );
    }

    return <div className=""></div>;
}

export default function ChatBox({ channel }: { channel: ChannelT }) {
    const [messageContent, setMessageContent] = useState<string>('');
    const [files, setFiles] = useState<Array<File>>([]);

    const textBoxRef = createRef<HTMLTextAreaElement>();
    const textAreaRef = createRef<HTMLDivElement>();
    const fileUploadRef = createRef<HTMLInputElement>();

    const queryClient = useQueryClient();
    const { mutate } = useCreateMessageMutation(queryClient, channel.channelId, CLIENT_ID);

    const onMessageInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessageContent(e.target.value);

        const maxHeight = 300; /*px*/

        if (textBoxRef.current) {
            textBoxRef.current.style.height = '';
            textBoxRef.current.style.height =
                Math.min(textBoxRef.current.scrollHeight, maxHeight) + 'px';
        }
    };

    const sendMessage = () => {
        if (messageContent.length > maxMessageLength) {
            // max length exceeded
            return;
        }

        mutate({
            content: messageContent,
            files: files,
        });

        setMessageContent('');
        if (textBoxRef.current) {
            textBoxRef.current.style.height = '';
        }

        setFiles([]);

        clearFile();
    };

    const playAnimation = (className: 'empty' | 'sent') => {
        if (textAreaRef.current) {
            textAreaRef.current?.classList.remove('empty');
            textAreaRef.current?.classList.remove('sent');
            textAreaRef.current?.offsetHeight; // this resets the animation for some unknown reason
            textAreaRef.current?.classList.add(className);
        }
    };

    const onMessageKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (messageContent.length === 0 && files.length === 0) {
                playAnimation('empty');
            } else {
                playAnimation('sent');
                sendMessage();
            }

            e.preventDefault();
        }
    };

    const clearFile = () => {
        if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
        }
    };

    const onAddFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        if (e.target.files.length + files.length > maxNumFiles) {
            /*errorAlertState.setTitle('Too many files!');
            errorAlertState.setDescription(`You can upload a maximum of ${maxNumFiles} files at a time!`);
            errorAlertState.setOpen(true);*/
            clearFile();
            return;
        }

        for (let i = 0; i < e.target.files.length; i++) {
            if (e.target.files[i].size > maxFileSize) {
                /*errorAlertState.setTitle('File too big!');
                errorAlertState.setDescription(`Files cannot exceed a size of ${maxFileSize / (1000 * 1000)}MB! Sorry my AWS free tier is already used up 💀`);
                errorAlertState.setOpen(true);*/
                clearFile();
                return;
            } else if (!allowedMimes.includes(e.target.files[i].type)) {
                /*errorAlertState.setTitle('Disallowed file type!');
                errorAlertState.setDescription('One or more of the selected files have disallowed types!');
                errorAlertState.setOpen(true);*/
                clearFile();
                return;
            }
        }

        const newFiles: File[] = [...files];
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                console.log(e.target.files[i]);
                newFiles.push(e.target.files[i]);
            }
        }
        clearFile();

        setFiles(newFiles);
    };

    const removeFile = (file: File) => {
        const i = files.indexOf(file);
        if (i > -1) {
            setFiles(old => {
                const newFiles = [...old];
                newFiles.splice(i, 1);
                return newFiles;
            });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full p-3">
            {files.length > 0 && (
                <div className="flex justify-center items-center bg-bg-medium p-7 rounded-t-lg w-full">
                    {files.map((file, index) => {
                        return <FilePreview key={index} file={file} removeFile={removeFile} />;
                    })}
                </div>
            )}
            <div
                className="w-full flex items-center bg-bg-medium p-3 rounded text-nowrap chat-box"
                ref={textAreaRef}
            >
                <textarea
                    placeholder={`Send a message to ${channel.name}...`}
                    className="grow bg-bg-medium text-fg-medium focus:outline-none h-chat-box resize-none"
                    rows={1}
                    ref={textBoxRef}
                    value={messageContent}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onMessageInput(e)}
                    onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => onMessageKeyDown(e)}
                />
                <input
                    type="file"
                    id="file-chat"
                    ref={fileUploadRef}
                    onChange={onAddFile}
                    className="hidden"
                    multiple
                />
                <label htmlFor="file-chat" className="">
                    <div className="ml-2 bg-bg-light hover:bg-bg-dark p-2 rounded-full shadow">
                        <Plus width={15} height={15} className="text-fg-dark"></Plus>
                    </div>
                </label>
            </div>
        </div>
    );
}
