function Textarea({
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  className = "",
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none text-white ${className}`}
    />
  );
}

export default Textarea;
