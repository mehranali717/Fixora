export default function Button({ children, variant = 'primary', className = '', ...props }) {
const base = 'px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1';


const variants = {
primary: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-indigo-500',
outline: 'border border-[#00d492] text-[#00d492] hover:bg-emerald-50 focus:ring-indigo-200',
secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400'
}


return (
<button className={`${base} ${variants[variant]} ${className}`} {...props}>
{children}
</button>
)
}