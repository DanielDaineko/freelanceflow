import { useEffect, useState } from "react";
import useProjectsStore from "../features/projects/projectsStore";
import useClientsStore from "../features/clients/clientsStore";

function ProjectsPage() {
  const {
    projects,
    isLoading: projectsLoading,
    error,
    fetchProjects,
    addProject,
    removeProject,
  } = useProjectsStore();

  const {
    clients,
    fetchClients,
    isLoading: clientsLoading,
  } = useClientsStore();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addProject(formData);

      setFormData({
        title: "",
        description: "",
        status: "planning",
        budget: "",
        deadline: "",
        clientId: "",
      });
    } catch {
      return;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-slate-400">Create and manage client projects.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Add Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={projectsLoading || clientsLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg font-medium"
            >
              {projectsLoading ? "Saving..." : "Add Project"}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Project List</h2>

          {projectsLoading && projects.length === 0 ? (
            <p className="text-slate-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-slate-400">
              No projects yet. Add your first one.
            </p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
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

                  <button
                    onClick={() => removeProject(project.id)}
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

export default ProjectsPage;
