import Button from "./Button";

function Toast({ id, title, message, type = "success", onClose }) {
  const typeStyles = {
    success: "border-green-500/40 bg-slate-900",
    error: "border-red-500/40 bg-slate-900",
    info: "border-blue-500/40 bg-slate-900",
    warning: "border-yellow-500/40 bg-slate-900",
  };

  const badgeStyles = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400",
    warning: "text-yellow-400",
  };

  return (
    <div
      className={`w-full max-w-sm border rounded-2xl shadow-2xl p-4 ${typeStyles[type]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`font-semibold ${badgeStyles[type]}`}>{title}</p>
          {message && <p className="text-slate-300 text-sm mt-1">{message}</p>}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onClose(id)}
          className="px-3 py-1 text-sm"
        >
          ×
        </Button>
      </div>
    </div>
  );
}

export default Toast;
