import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

interface ToastProps {
    title?: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, open, onOpenChange }) => {
    return (
        <ToastPrimitive.Provider>
            <ToastPrimitive.Root
                open={open}
                onOpenChange={onOpenChange}
                className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded shadow-md gap-4"
            >
                <div className="flex items-center">
                    <div>
                        {/* {title ?? <ToastPrimitive.Title className="font-bold">{title}</ToastPrimitive.Title>} */}
                        <ToastPrimitive.Description className="font-semibold text-gray-800">{description}</ToastPrimitive.Description>
                    </div>
                </div>
                <ToastPrimitive.Close className="text-gray-500 hover:text-gray-700" aria-label="Close">
                    ✖
                </ToastPrimitive.Close>
            </ToastPrimitive.Root>
            <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-4" />
        </ToastPrimitive.Provider>
    );
};

export default Toast;
