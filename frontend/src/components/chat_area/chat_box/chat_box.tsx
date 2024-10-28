'use client';

import { createMessage } from '@/lib/api/requests';
import { createMessageMutation } from '@/lib/mutations/create_message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ChannelT, CreateMessageRequestT } from 'models';
import Image from 'next/image';
import { ChangeEvent, createRef, FormEvent, KeyboardEvent, useState } from 'react';

import './chat_box.css'

export default function ChatBox({ channel }: { channel: ChannelT }) {
    const [messageContent, setMessageContent] = useState<string>('');
    const [files, setFiles] = useState<Array<File>>([]);
    
    const textBoxRef = createRef<HTMLTextAreaElement>();
    const textAreaRef = createRef<HTMLDivElement>();
    const fileUploadRef = createRef<HTMLInputElement>();

    const queryClient = useQueryClient();
    const { mutate } = createMessageMutation(queryClient, channel.channelId);

    const onMessageInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessageContent(e.target.value);
        
        const maxHeight = 300/*px*/;

        if (textBoxRef.current) {
            textBoxRef.current.style.height = '';
            textBoxRef.current.style.height = Math.min(textBoxRef.current.scrollHeight, maxHeight) + 'px';
        }
    };

    const sendMessage = () => {
        mutate({
            content: messageContent,
            files: files
        });

        setMessageContent('');
        if (textBoxRef.current) {
            textBoxRef.current.style.height = '';
        }

        setFiles([]);

        if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
        }
    }

    const playAnimation = (className: 'empty' | 'sent') => {
        if (textAreaRef.current) {
            textAreaRef.current?.classList.remove('empty');
            textAreaRef.current?.classList.remove('sent');
            textAreaRef.current?.offsetHeight; // this resets the animation for some unknown reason
            textAreaRef.current?.classList.add(className);
        }
    }

    const onMessageKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (messageContent.length === 0) {
                playAnimation('empty');
            } else {
                playAnimation('sent');
                sendMessage();
            }
            
            e.preventDefault();
        }
    }

    const onAddFile = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles((old) => {
            const newFiles = [...old];
            if (e.target.files) {
                for (let i = 0; i < e.target.files.length; i++) {
                    newFiles.push(e.target.files[i]);
                }
            }
            return newFiles;
        })
    };

    return (
        <div className="flex justify-center items-center w-full p-3">
            <div className="">
                {files.map((file) => {
                    return <p>{file.name}</p>
                })}
            </div>
            <div className="w-full flex items-center bg-bg-medium p-3 rounded text-nowrap chat-box" ref={textAreaRef}>
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
                    id="file"
                    ref={fileUploadRef}
                    onChange={onAddFile}
                    className="hidden"
                />
                <label 
                    htmlFor="file"
                    className=""
                >
                    <div className="ml-2 bg-bg-light hover:bg-bg-dark p-2 rounded-full shadow">
                        <Plus width={15} height={15} className="text-fg-dark"></Plus>
                    </div>
                </label>
            </div>
        </div>
    )
}