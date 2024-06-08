import { useCallback, useEffect, useState } from "react";

export enum AlertType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    Info = 'info',
}

type Props = {
    type: AlertType;
    message: string;
    show: boolean;
    onDismiss: (show: boolean) => void;
}

function AlertInfo(props: { type: AlertType }) {
    switch (props.type) {
        case AlertType.Success:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )

        case AlertType.Error:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )

        case AlertType.Warning:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            )
        
        default:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            )
    }
}

export function Toast(props: Props) {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertType>(AlertType.Info);

    useEffect(() => {
        if (props.show) {
            let timeout = 2;
            setSeverity(props.type);
            setMessage(props.message);
            const interval = setInterval(() => {
                if (timeout > 0) {
                    timeout--;
                } else {
                    clearInterval(interval);
                    props.onDismiss(false);
                }
            }, 1000);
        }
    }, [props.show]);

    const color = useCallback((type: AlertType) => {
        switch(type) {
            case AlertType.Success:
                return 'bg-green-500 text-white'
            case AlertType.Error:
                return 'bg-red-500 text-white'
            case AlertType.Warning:
                return 'bg-yellow-500 text-black'
            default:
                return 'bg-blue-500 text-white'
        }
    }, [])

    return (
        <>
            {props.show && (
                <div className="fixed top-6 left-0 right-0 w-fit m-auto flex flex-col justify-start items-center z-[9999]">
                    <div className={"flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow space-x " + color(severity)} role="alert">
                        <AlertInfo type={severity} />
                        <div className="ps-4 text-sm font-normal">{ message }</div>
                    </div>
                </div>
            )}
        </>
    )
}
