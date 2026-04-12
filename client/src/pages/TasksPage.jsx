import { useEffect, useState } from "react";
import useTasksStore from "../store/tasksStore";
import useProjectsStore from "../features/projects/projectsStore";
import useToastStore from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

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

  const addToast = useToastStore((state) => state.addToast);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "todo",
    });
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
      addToast({
        title: "Project required",
        message: "Select a project before creating a task.",
        type: "warning",
      });
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

        addToast({
          title: "Task updated",
          message: "Task was updated successfully.",
          type: "success",
        });
      } else {
        await addTask(payload);

        addToast({
          title: "Task created",
          message: "New task was added successfully.",
          type: "success",
        });
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
      addToast({
        title: "Task action failed",
        message: "Please check the form and try again.",
        type: "error",
      });
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

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await removeTask(taskToDelete.id);

      addToast({
        title: "Task deleted",
        message: `"${taskToDelete.title}" was removed.`,
        type: "info",
      });

      setTaskToDelete(null);
    } catch {
      addToast({
        title: "Delete failed",
        message: "Could not delete task.",
        type: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const groupedTasks = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
    done: filteredTasks.filter((task) => task.status === "done"),
  };

  const columns = [
    { key: "todo", title: "Todo" },
    { key: "in_progress", title: "In Progress" },
    { key: "done", title: "Done" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-slate-400">Manage tasks inside your projects.</p>
      </div>

      <Card className="mb-6">
        <label className="block text-sm text-slate-300 mb-2">
          Select Project
        </label>

        <Select
          value={selectedProjectId}
          onChange={handleProjectChange}
          className="max-w-md"
        >
          <option value="">Choose a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </Select>

        {projectsLoading && (
          <p className="text-slate-400 text-sm mt-2">Loading projects...</p>
        )}
      </Card>

      {!selectedProjectId ? (
        <EmptyState
          title="Choose a project first"
          description="Select a project above to manage its tasks."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">
              {editingTaskId ? "Edit Task" : "Add Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="title"
                placeholder="Task title"
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
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </Select>

              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Select>

              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={tasksLoading}
                variant="primary"
                className="w-full"
              >
                {tasksLoading
                  ? "Saving..."
                  : editingTaskId
                    ? "Update Task"
                    : "Add Task"}
              </Button>

              {editingTaskId && (
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
              <h2 className="text-xl font-semibold">Task Board</h2>

              <div className="flex flex-col md:flex-row gap-3 md:w-auto w-full">
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="md:w-48"
                >
                  <option value="all">All statuses</option>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </Select>

                <Select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="md:w-48"
                >
                  <option value="all">All priorities</option>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </Select>
              </div>
            </div>

            {tasksLoading && tasks.length === 0 ? (
              <p className="text-slate-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Add your first task for this project."
              />
            ) : filteredTasks.length === 0 ? (
              <EmptyState
                title="No matching tasks"
                description="Try different status or priority filters."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((column) => (
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
                              <Button
                                onClick={() => handleEdit(task)}
                                variant="info"
                                className="px-3 py-2 text-sm"
                              >
                                Edit
                              </Button>

                              <Button
                                onClick={() => handleDeleteClick(task)}
                                variant="danger"
                                className="px-3 py-2 text-sm"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Delete task?"
        description={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"?`
            : "Are you sure you want to delete this task?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default TasksPage;
