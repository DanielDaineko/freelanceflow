import { useEffect, useMemo, useState } from "react";
import useTransactionsStore from "../store/transactionsStore";
import useProjectsStore from "../features/projects/projectsStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

function FinancePage() {
  const {
    transactions,
    isLoading: transactionsLoading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactionsStore();

  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectsStore();

  const [editingTransactionId, setEditingTransactionId] = useState(null);

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

  const handleEdit = (transaction) => {
    setEditingTransactionId(transaction.id);

    setFormData({
      amount: transaction.amount ?? "",
      projectId: transaction.projectId || "",
      note: transaction.note || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingTransactionId) {
        await updateTransaction(editingTransactionId, payload);
      } else {
        await addTransaction(payload);
      }

      setFormData({
        amount: "",
        projectId: "",
        note: "",
      });

      setEditingTransactionId(null);
    } catch {
      return;
    }
  };

  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setFormData({
      amount: "",
      projectId: "",
      note: "",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finance</h1>
        <p className="text-slate-400">
          Track payments and monitor your income.
        </p>
      </div>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Total Income</h2>
        <p className="text-4xl font-bold text-green-400">${totalIncome}</p>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {editingTransactionId ? "Edit Payment" : "Add Payment"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <Select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>

            <Textarea
              name="note"
              placeholder="Payment note"
              value={formData.note}
              onChange={handleChange}
              rows={4}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={transactionsLoading || projectsLoading}
              variant="primary"
              className="w-full"
            >
              {transactionsLoading
                ? "Saving..."
                : editingTransactionId
                  ? "Update Payment"
                  : "Add Payment"}
            </Button>

            {editingTransactionId && (
              <Button
                type="button"
                onClick={handleCancelEdit}
                variant="secondary"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </form>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Payments</h2>

          {transactionsLoading && transactions.length === 0 ? (
            <p className="text-slate-400">Loading payments...</p>
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No payments yet"
              description="Add your first payment to start tracking income."
            />
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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(transaction)}
                      variant="info"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => removeTransaction(transaction.id)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default FinancePage;
