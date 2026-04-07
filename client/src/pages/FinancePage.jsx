import { useEffect, useMemo, useState } from "react";
import useTransactionsStore from "../store/transactionsStore";
import useProjectsStore from "../features/projects/projectsStore";

function FinancePage() {
  const {
    transactions,
    isLoading: transactionsLoading,
    error,
    fetchTransactions,
    addTransaction,
    removeTransaction,
  } = useTransactionsStore();

  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectsStore();

  const [formData, setFormData] = useState({
    amount: "",
    projectId: "",
    note: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchProjects();
  }, [fetchTransactions, fetchProjects]);

  const totalIncome = useMemo(() => {
    return transactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0);
    }, 0);
  }, [transactions]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addTransaction({
        ...formData,
        amount: Number(formData.amount),
      });

      setFormData({
        amount: "",
        projectId: "",
        note: "",
      });
    } catch {
      return;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finance</h1>
        <p className="text-slate-400">
          Track payments and monitor your income.
        </p>
      </div>

      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-3">Total Income</h2>
        <p className="text-4xl font-bold text-green-400">${totalIncome}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>

            <textarea
              name="note"
              placeholder="Payment note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={transactionsLoading || projectsLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg font-medium"
            >
              {transactionsLoading ? "Saving..." : "Add Payment"}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Payments</h2>

          {transactionsLoading && transactions.length === 0 ? (
            <p className="text-slate-400">Loading payments...</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-400">
              No payments yet. Add your first transaction.
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-green-400">
                      ${transaction.amount}
                    </h3>

                    <p className="text-slate-300 text-sm">
                      Project: {transaction.project?.title || "Unknown"}
                    </p>

                    <p className="text-slate-400 text-sm">
                      Date:{" "}
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>

                    {transaction.note && (
                      <p className="text-slate-300 text-sm mt-2">
                        {transaction.note}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeTransaction(transaction.id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancePage;
