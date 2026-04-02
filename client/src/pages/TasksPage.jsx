import { useEffect, useState } from "react";
import useTasksStore from "../store/tasksStore";
import useProjectsStore from "../features/projects/projectsStore";

function TasksPage() {
  const {
    tasks,
    isLoading: tasksLoading,
    error,
    fetchTasks,
    addTask,
    removeTask,
  } = useTasksStore();

  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectsStore();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [selectedProjectId, fetchTasks]);

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProjectId) {
      return;
    }

    try {
      await addTask({
        ...formData,
        projectId: selectedProjectId,
        deadline: formData.deadline || null, // 🔥 ВОТ ЭТО ВАЖНО
      });

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        deadline: "",
      });
    } catch {
      return;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-slate-400">Manage tasks inside your projects.</p>
      </div>

      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <label className="block text-sm text-slate-300 mb-2">
          Select Project
        </label>

        <select
          value={selectedProjectId}
          onChange={handleProjectChange}
          className="w-full max-w-md px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none text-white"
        >
          <option value="">Choose a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        {projectsLoading && (
          <p className="text-slate-400 text-sm mt-2">Loading projects...</p>
        )}
      </div>

      {!selectedProjectId ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Choose a project first to manage tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Task title"
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
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

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
                disabled={tasksLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg font-medium"
              >
                {tasksLoading ? "Saving..." : "Add Task"}
              </button>
            </form>
          </div>

          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Task List</h2>

            {tasksLoading && tasks.length === 0 ? (
              <p className="text-slate-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-400">
                No tasks yet. Add your first task.
              </p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {task.title}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
                        Status: {task.status}
                      </p>

                      <p className="text-slate-400 text-sm">
                        Priority: {task.priority}
                      </p>

                      <p className="text-slate-400 text-sm">
                        Deadline:{" "}
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : "No deadline"}
                      </p>

                      {task.description && (
                        <p className="text-slate-300 text-sm mt-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeTask(task.id)}
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
      )}
    </div>
  );
}

export default TasksPage;
