import { ElementType } from "react"

interface CustomButtonIconActionProps {
    icon :ElementType
}

export default function CustomButtonIconAction({ icon :Icon } :CustomButtonIconActionProps) {
    return(
        <div className="flex w-[15%] h-auto items-center justify-center">
            <Icon className="w-4 h-4 text-gray-500"/>
        </div>
    )
}