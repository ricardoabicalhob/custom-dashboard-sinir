import { ElementType } from "react"

interface CustomButtonIconProps {
    icon :ElementType
}

export default function CustomButtonIcon({ icon :Icon } :CustomButtonIconProps) {
    return(
        <div className="flex w-[15%] h-auto items-start justify-center pt-5">
            <Icon className="text-blue-400 w-6 h-6" />
        </div>
    )
}