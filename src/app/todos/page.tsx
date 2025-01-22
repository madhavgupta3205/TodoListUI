"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import "../globals.css";
interface Todo {
  todo_id: number;
  title: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const router = useRouter();

  const handleAddTodo = async () => {
    try {
      if (newTodo != "") {
        const response = await api.post("/todos", { title: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo("");
      }
      else{
        alert("enter a task");
      }
    } catch (error) {
      alert("Error adding todo");
    }
  };

  const handleToggleCompletion = async (todoId: number, completed: boolean) => {
    try {
      const response = await api.put(`/todos/${todoId}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === todoId
            ? { ...todo, completed: response.data.completed }
            : todo
        )
      );
    } catch (error) {
      alert("Error toggling completion status");
    }
  };

  const handleSaveEdit = async () => {
    if (editingTodo) {
      try {
        const response = await api.put(`/todos/${editingTodo.todo_id}`, {
          title: newTodo,
        });
        setTodos(
          todos.map((todo) =>
            todo.todo_id === editingTodo.todo_id
              ? { ...todo, title: response.data.title }
              : todo
          )
        );
        setNewTodo("");
        setEditingTodo(null);
      } catch (error) {
        alert("Error editing todo");
      }
    }
  };
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
  };
  
  const handleDeleteTodo = async (todoId: number) => {
    try {
      await api.delete(`/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo.todo_id !== todoId));
    } catch (error) {
      alert("Error deleting todo");
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get("/todos");
        setTodos(response.data);
      } catch (error) {
        localStorage.removeItem("jwt");
        router.push("/");
      }
    };

    fetchTodos();
  }, [router, handleAddTodo]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <button
        onClick={handleLogout}
        className="self-end bg-red-500 text-white p-2 rounded mb-4"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-6">Your Todos</h1>
      <div className="w-full max-w-md">
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={editingTodo ? "Edit todo" : "Add a new todo"}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={editingTodo ? handleSaveEdit : handleAddTodo}
            className="bg-blue-500 text-white p-2 rounded ml-2"
          >
            {editingTodo ? "Save" : "Add"}
          </button>
        </div>
        <ul>
          {todos.map((todo,index) => (
            <li
              key={index}
              className={`p-2 mb-2 border rounded ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleCompletion(todo.todo_id, todo.completed)}
                    className="mr-2"
                  />
                  {todo.title}
                </div>
                <div>
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.todo_id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
