import React from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const DeleteTaskModal = ({ isOpen, onClose, taskId, fetchTasks }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Task Deleted:", taskId);
      fetchTasks(); 
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error.response?.data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white rounded w-1/3 shadow-lg">
        <h2 className="rounded-t bg-red-200 px-6 py-3 text-lg font-bold flex justify-center items-center">
          <span className="mr-2">❗</span> Delete Task
        </h2>
        <p className="text-gray-600 text-sm mt-2 mx-6">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-center my-4 mx-6">
          <button
            className="mr-2 px-2 py-1.5 border border-none text-sm rounded text-gray-600 hover:bg-gray-200"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className="px-2 py-1.5 text-red-500 rounded hover:bg-red-200"
            onClick={handleDelete}
          >
            DELETE
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
