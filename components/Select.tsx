"use client"

import ReactSelect from 'react-select'

interface SelectProps{
    label: string
    value?: Record<string, any>
    onChange: (value: Record<string, any>) => void
    options: Record<string, any>[]
    disabled?: boolean
}

const Select:React.FC<SelectProps> = ({label, value, onChange, options, disabled}) => {
  return (
    <div className="z-[100]">
        <label className="block text-sm font-medium leading-6 text-gray-300">{label}</label>
        <div className="mt-2">
            <ReactSelect isDisabled={disabled} value={value} onChange={onChange} isMulti options={options} menuPortalTarget={document.body} styles={{menuPortal: (base) => ({
                ...base,
                color:"black",
                borderColor:"#2d2b2b",
                zIndex: 999,
            }), control:(base) =>({...base, backgroundColor:"#2d2b2b"}), multiValue:(base)=>({...base,color:"white",backgroundColor:"gray"}) }} classNames={{control: () => "text-md bg-[#2d2b2b]"}} />
        </div>
    </div>
  )
}

export default Select