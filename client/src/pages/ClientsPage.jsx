import { useEffect, useState } from "react";
import useClientsStore from "../features/clients/clientsStore";
import useToastStore from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

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

  const addToast = useToastStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "active",
    notes: "",
  });

  const [editingClientId, setEditingClientId] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

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

        addToast({
          title: "Client updated",
          message: "Client information was updated successfully.",
          type: "success",
        });
      } else {
        await addClient(formData);

        addToast({
          title: "Client created",
          message: "New client was added successfully.",
          type: "success",
        });
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
      addToast({
        title: "Client action failed",
        message: "Please check the form and try again.",
        type: "error",
      });
      return;
    }
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setFormData({
      name: "",
      email: "",
      company: "",
      status: "active",
      notes: "",
    });
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await removeClient(clientToDelete.id);

      addToast({
        title: "Client deleted",
        message: `"${clientToDelete.name}" was removed.`,
        type: "info",
      });

      setClientToDelete(null);
    } catch {
      addToast({
        title: "Delete failed",
        message: "Could not delete client.",
        type: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setClientToDelete(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Clients</h1>
        <p className="text-slate-400">Manage your freelance clients here.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {editingClientId ? "Edit Client" : "Add Client"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Client name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
            />

            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </Select>

            <Textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full"
            >
              {isLoading
                ? "Saving..."
                : editingClientId
                  ? "Update Client"
                  : "Add Client"}
            </Button>

            {editingClientId && (
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
          <h2 className="text-xl font-semibold mb-4">Client List</h2>

          {isLoading && clients.length === 0 ? (
            <p className="text-slate-400">Loading clients...</p>
          ) : clients.length === 0 ? (
            <EmptyState
              title="No clients yet"
              description="Add your first client to start managing your freelance business."
            />
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
                    <Button onClick={() => handleEdit(client)} variant="info">
                      Edit
                    </Button>

                    <Button
                      onClick={() => handleDeleteClick(client)}
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

      <ConfirmDialog
        isOpen={!!clientToDelete}
        title="Delete client?"
        description={
          clientToDelete
            ? `Are you sure you want to delete "${clientToDelete.name}"?`
            : "Are you sure you want to delete this client?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default ClientsPage;
