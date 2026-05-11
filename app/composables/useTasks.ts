import { nanoid } from "nanoid";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  dueDate: string | null;
  createdAt: string;
}

const STORAGE_KEY = "taskflow_tasks";

export const useTasks = () => {
  const tasks = useState<Task[]>("tasks", () => []);

  const loadFromStorage = () => {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) tasks.value = JSON.parse(raw);
    }
  };

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
    }
  };

  const addTask = (data: Omit<Task, "id" | "status" | "createdAt">) => {
    tasks.value.unshift({
      ...data,
      id: nanoid(),
      status: "active",
      createdAt: new Date().toISOString(),
    });
    saveToStorage();
  };

  const toggleTask = (id: string) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.status = task.status === "active" ? "completed" : "active";
      saveToStorage();
    }
  };

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    saveToStorage();
  };

  return { tasks, loadFromStorage, addTask, toggleTask, deleteTask };
};
