import { ButtonHTMLAttributes, ReactNode } from "react";

interface CustomButtonRootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children :ReactNode
}

export default function CustomButtonRoot ({ children, ...props } :CustomButtonRootProps) {
    return(
        <button {...props} className="flex w-full items-stretch justify-between h-fit rounded-lg bg-[#29292E] hover:bg-[#333339] cursor-pointer">
            { children }
        </button>
    )
}