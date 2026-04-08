function EmptyState({ title, description }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

export default EmptyState;
