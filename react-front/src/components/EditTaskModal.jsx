import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const EditTaskModal = ({ isOpen, onClose, task, fetchTasks }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Task Updated:", form);
      fetchTasks();
      onClose();
    } catch (error) {
      console.error("Ошибка обновления задачи:", error.response?.data);
      setError(error.response?.data?.message || "Ошибка при обновлении задачи");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Task</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            rows="3"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            required
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 w-full rounded"
          >
            Update
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
