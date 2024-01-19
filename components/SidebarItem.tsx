import clsx from "clsx"
import Link from "next/link"

interface SidebarItemProps {
    label: string;
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, icon:Icon, active, onClick }) => {
    const handleClick = () => {
        if(onClick){
            return onClick()
        }
    }

  return (
    <li onClick={handleClick}>
        <Link href={href} className={clsx(`group flex gap-x-3 mb-4 rounded-md p-2 text-sm leading-6 font-semibold text-gray-200 hover:border-2 hover:border-gray-900`, active && 'bg-gray-100 text-black')}>
            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="sr-only">{label}</span>
        </Link>
    </li>
  )
}

export default SidebarItem