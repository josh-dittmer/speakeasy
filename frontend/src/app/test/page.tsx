'use client';

import { CancelButton, DeleteButton, SubmitButton } from '@/components/ui/forms/button/button';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import { NormalForm } from '@/components/ui/forms/form/form';
import ButtonSection from '@/components/ui/forms/section/button_section';
import TitleSection from '@/components/ui/forms/section/title_section';
import TextBox from '@/components/ui/forms/text_box/text_box';
import { Plus } from 'lucide-react';
import { maxFileSize, S3Keys } from 'models';
import { useState } from 'react';

export default function TestPage() {
    const [testValue, setTestValue] = useState<string>('');
    const [testValid, setTestValid] = useState<boolean>();

    const [test2Value, setTest2Value] = useState<string>('');
    const [test2Valid, setTest2Valid] = useState<boolean>();

    const [testImageFile, setTestImageFile] = useState<File>();

    const [submitted] = useState<boolean>(true);

    const valid = testValid && test2Valid;

    return (
        <div className="bg-bg-dark">
            <NormalForm>
                <TitleSection title={'Test Form'} icon={Plus} />
                <ImageUpload
                    existingImageId={null}
                    existingImageLocation={S3Keys.messageFiles}
                    title={'Test Image Upload'}
                    maxSize={maxFileSize}
                    file={testImageFile}
                    setFile={setTestImageFile}
                    onInvalid={message => console.log(message)}
                />
                <TextBox
                    value={testValue}
                    setValue={setTestValue}
                    title={'Test #1'}
                    placeholder="Test..."
                    maxChars={20}
                    submitted={submitted}
                    setValid={setTestValid}
                />
                <TextBox
                    value={test2Value}
                    setValue={setTest2Value}
                    title={'Test #2'}
                    placeholder="Test 2..."
                    maxChars={15}
                    submitted={submitted}
                    setValid={setTest2Valid}
                />
                <ButtonSection>
                    <DeleteButton onClick={() => console.log('test')} text={'Delete test'} />
                    <CancelButton onClick={() => console.log('test')} />
                    <SubmitButton onClick={() => console.log('test')} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </div>
    );
}
