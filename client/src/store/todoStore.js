// 🧠 src/store/todoStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTodoStore = create(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text) =>
        set((state) => ({
          tasks: [...state.tasks, { id: Date.now(), text, completed: false }],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "hangout-hub-todos",
    }
  )
);

export default useTodoStore;