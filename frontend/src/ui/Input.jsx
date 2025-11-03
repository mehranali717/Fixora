export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        flex-1 pr-4 py-3 bg-white 
        border-b border-b-gray-300
        focus:outline-none 
        hover:border-b-emerald-500 
        focus:border-b-emerald-500
        transition
        ${className}
      `}
      {...props}
    />
  )
}
