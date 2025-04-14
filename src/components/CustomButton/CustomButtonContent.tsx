import { ReactNode } from "react"

interface CustomButtonContentProps {
    children :ReactNode
}

export default function CustomButtonContent({ children } :CustomButtonContentProps) {
    return(
        <div className="flex flex-col h-full w-[70%] items-start justify-center py-4 px-2">
            { children }
        </div>
    )
}