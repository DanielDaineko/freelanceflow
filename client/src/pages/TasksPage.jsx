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
    updateTask,
    removeTask,
  } = useTasksStore();

  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectsStore();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
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

  const handleEdit = (task) => {
    setEditingTaskId(task.id);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      status: task.status || "todo",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProjectId) {
      return;
    }

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
        projectId: selectedProjectId,
      };

      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
      } else {
        await addTask(payload);
      }

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
      });

      setEditingTaskId(null);
    } catch {
      return;
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "todo",
    });
  };

  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done"),
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
            <h2 className="text-xl font-semibold mb-4">
              {editingTaskId ? "Edit Task" : "Add Task"}
            </h2>

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

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={tasksLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg font-medium"
              >
                {tasksLoading
                  ? "Saving..."
                  : editingTaskId
                    ? "Update Task"
                    : "Add Task"}
              </button>

              {editingTaskId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full mt-2 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg text-white"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Task Board</h2>

            {tasksLoading && tasks.length === 0 ? (
              <p className="text-slate-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-400">
                No tasks yet. Add your first task.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: "todo", title: "Todo" },
                  { key: "in_progress", title: "In Progress" },
                  { key: "done", title: "Done" },
                ].map((column) => (
                  <div
                    key={column.key}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {column.title}
                    </h3>

                    <div className="space-y-3">
                      {groupedTasks[column.key].length === 0 ? (
                        <p className="text-slate-400 text-sm">No tasks</p>
                      ) : (
                        groupedTasks[column.key].map((task) => (
                          <div
                            key={task.id}
                            className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                          >
                            <h4 className="text-white font-medium">
                              {task.title}
                            </h4>

                            <p className="text-slate-400 text-sm mt-1">
                              Priority: {task.priority}
                            </p>

                            <p className="text-slate-400 text-sm">
                              Due:{" "}
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No deadline"}
                            </p>

                            {task.description && (
                              <p className="text-slate-300 text-sm mt-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEdit(task)}
                                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-white text-sm"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => removeTask(task.id)}
                                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-white text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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
