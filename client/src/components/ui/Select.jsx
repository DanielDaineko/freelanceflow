function Select({ name, value, onChange, children, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none text-white ${className}`}
    >
      {children}
    </select>
  );
}

export default Select;
