import { useEffect, useState } from "react";
import useProjectsStore from "../features/projects/projectsStore";
import useClientsStore from "../features/clients/clientsStore";
import useToastStore from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

function ProjectsPage() {
  const {
    projects,
    isLoading: projectsLoading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    removeProject,
  } = useProjectsStore();

  const {
    clients,
    fetchClients,
    isLoading: clientsLoading,
  } = useClientsStore();

  const addToast = useToastStore((state) => state.addToast);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    budget: "",
    deadline: "",
    clientId: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "planning",
      budget: project.budget ?? "",
      deadline: project.deadline
        ? new Date(project.deadline).toISOString().split("T")[0]
        : "",
      clientId: project.clientId || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        budget: formData.budget === "" ? "" : Number(formData.budget),
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);

        addToast({
          title: "Project updated",
          message: "Project was updated successfully.",
          type: "success",
        });
      } else {
        await addProject(payload);

        addToast({
          title: "Project created",
          message: "New project was added successfully.",
          type: "success",
        });
      }

      setFormData({
        title: "",
        description: "",
        status: "planning",
        budget: "",
        deadline: "",
        clientId: "",
      });

      setEditingProjectId(null);
    } catch {
      addToast({
        title: "Project action failed",
        message: "Please check the form and try again.",
        type: "error",
      });
      return;
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setFormData({
      title: "",
      description: "",
      status: "planning",
      budget: "",
      deadline: "",
      clientId: "",
    });
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await removeProject(projectToDelete.id);

      addToast({
        title: "Project deleted",
        message: `"${projectToDelete.title}" was removed.`,
        type: "info",
      });

      setProjectToDelete(null);
    } catch {
      addToast({
        title: "Delete failed",
        message: "Could not delete project.",
        type: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
  };

  const filteredProjects = projects.filter((project) => {
    if (statusFilter === "all") return true;
    return project.status === statusFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-slate-400">Create and manage client projects.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {editingProjectId ? "Edit Project" : "Add Project"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
            />

            <Textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />

            <Select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>

            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
            </Select>

            <Input
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
            />

            <Input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={projectsLoading || clientsLoading}
              variant="primary"
              className="w-full"
            >
              {projectsLoading
                ? "Saving..."
                : editingProjectId
                  ? "Update Project"
                  : "Add Project"}
            </Button>

            {editingProjectId && (
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Project List</h2>

            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="md:max-w-xs"
            >
              <option value="all">All statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          {projectsLoading && projects.length === 0 ? (
            <p className="text-slate-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Add your first project to start tracking work and budgets."
            />
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              title="No matching projects"
              description="Try a different project status filter."
            />
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>

                    <p className="text-slate-300 text-sm">
                      Client: {project.client?.name || "Unknown"}
                    </p>

                    <p className="text-slate-400 text-sm mt-1">
                      Status: {project.status}
                    </p>

                    <p className="text-slate-400 text-sm">
                      Budget:{" "}
                      {project.budget ? `$${project.budget}` : "Not set"}
                    </p>

                    <p className="text-slate-400 text-sm">
                      Deadline:{" "}
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "No deadline"}
                    </p>

                    {project.description && (
                      <p className="text-slate-300 text-sm mt-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(project)} variant="info">
                      Edit
                    </Button>

                    <Button
                      onClick={() => handleDeleteClick(project)}
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
        isOpen={!!projectToDelete}
        title="Delete project?"
        description={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.title}"?`
            : "Are you sure you want to delete this project?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default ProjectsPage;
