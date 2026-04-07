import { useEffect, useState } from "react";
import useClientsStore from "../features/clients/clientsStore";

function ClientsPage() {
  const {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    removeClient,
  } = useClientsStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "active",
    notes: "",
  });

  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (client) => {
    setEditingClientId(client.id);

    setFormData({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      status: client.status || "active",
      notes: client.notes || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingClientId) {
        await updateClient(editingClientId, formData);
      } else {
        await addClient(formData);
      }

      setFormData({
        name: "",
        email: "",
        company: "",
        status: "active",
        notes: "",
      });

      setEditingClientId(null);
    } catch {
      return;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Clients</h1>
        <p className="text-slate-400">Manage your freelance clients here.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingClientId ? "Edit Client" : "Add Client"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Client name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            >
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg font-medium"
            >
              {isLoading
                ? "Saving..."
                : editingClientId
                  ? "Update Client"
                  : "Add Client"}
            </button>

            {editingClientId && (
              <button
                type="button"
                onClick={() => {
                  setEditingClientId(null);
                  setFormData({
                    name: "",
                    email: "",
                    company: "",
                    status: "active",
                    notes: "",
                  });
                }}
                className="w-full mt-2 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg text-white"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Client List</h2>

          {isLoading && clients.length === 0 ? (
            <p className="text-slate-400">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-slate-400">
              No clients yet. Add your first one.
            </p>
          ) : (
            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {client.name}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {client.company || "No company"}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {client.email || "No email"}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Status: {client.status}
                    </p>
                    {client.notes && (
                      <p className="text-slate-300 text-sm mt-2">
                        {client.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeClient(client.id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;
