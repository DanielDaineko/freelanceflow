function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = "",
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none text-white ${className}`}
    />
  );
}

export default Input;
