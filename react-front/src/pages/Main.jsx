import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationControls from "../components/PaginationControls";
import { useNavigate } from "react-router-dom";
import TaskModal from "../components/TaskModal";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";

const API_URL = "http://localhost:5000/api/tasks";

const Main = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sort, setSort] = useState({
    column: "created_at",
    sort: "asc",
  });
  const [archiveSort, setArchiveSort] = useState({
    title: "asc",
    created_at: "asc",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);
  useEffect(() => {
    fetchTasks();
  }, [filter, sort, page, limit]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        status: filter || "",
        sortBy: sort.column,
        order: sort.sort,
        userTasksOnly: true,
        page: page,
        limit: limit,
      };
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setTasks(res.data.items || res.data);
      setTotalTasks(res.data.total);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortHandler = async (event) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.children[0].getAttribute("values");
    if (name == "title") {
      setArchiveSort((prev) => ({
        ...prev,
        title: value,
      }));
    } else {
      setArchiveSort((prev) => ({
        ...prev,
        created_at: value,
      }));
    }
    setSort({
      column: name,
      sort: value,
    });
  };
  const toDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="p-5 bg-gray-300 border flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 mr-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          Task Manager
        </h1>
      </div>
      <div className="flex w-full ">
        <div className="w-1/5">
          <div className="hover:bg-gray-200 px-5 py-2">
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 mr-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Tasks
            </p>
          </div>
          <div onClick={logout} className="hover:bg-red-200 px-5 py-2 w-full">
            <button className="flex items-center">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="p-2 w-full">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap flex bg-blue-500 text-white px-4 text-sm py-2 rounded"
            >
              ADD TASK
            </button>
            <div className=" w-full flex justify-center">
              <select
                className="p-2 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <main>
            <div className="container mx-auto mt-8">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className=" px-4 py-2">
                      <div className="flex">
                        Title
                        <button
                          name="title"
                          className={
                            sort.column == "title"
                              ? "text-gray-800"
                              : "text-gray-400"
                          }
                          onClick={sortHandler}
                        >
                          {archiveSort.title == "asc" ? (
                            <svg
                              values="desc"
                              className={`w-6 h-6`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 9-7 7-7-7"
                              />
                            </svg>
                          ) : (
                            <svg
                              values="asc"
                              className="w-6 h-6"
                              stroke="currentColor"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m5 15 7-7 7 7"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </th>
                    <th className=" px-4 py-2">
                      <div className="flex">Description</div>
                    </th>
                    <th className=" px-4 py-2">
                      <div className="flex">Status</div>
                    </th>
                    <th className=" px-4 py-2">
                      <div className="flex">
                        Created At
                        <button
                          name="created_at"
                          className={
                            sort.column == "created_at"
                              ? "text-gray-800"
                              : "text-gray-400"
                          }
                          onClick={sortHandler}
                        >
                          {archiveSort.created_at == "desc" ? (
                            <svg
                              values="asc"
                              stroke="currentColor"
                              className="w-6 h-6"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 9-7 7-7-7"
                              />
                            </svg>
                          ) : (
                            <svg
                              values="desc"
                              className="w-6 h-6"
                              stroke="currentColor"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m5 15 7-7 7 7"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </th>
                    <th className=" px-4 py-2">
                      <div className="flex">Action</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td className=" px-4 py-2">{task.title}</td>
                      <td className=" px-4 py-2">{task.description}</td>
                      <td className=" px-4 py-2">{task.status}</td>
                      <td className="px-4 p-2">
                        {new Date(task.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-500 px-2"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                          </svg>
                        </button>
                        <button
                          className="text-red-500 px-2"
                          onClick={() => {
                            setTaskToDelete(task.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
          <PaginationControls
            defaultPage={1}
            totalTasks={totalTasks}
            defaultLimit={5}
            setPage={setPage}
            setLimit={setLimit}
          />

          {/* <td className="border p-2">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button className="text-blue-500 px-2">✏️</button>
                    <button
                      className="text-red-500 px-2"
                      onClick={() => deleteTask(task.id)}
                    ></button>
                  </td> */}
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchTasks={fetchTasks}
      />
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          fetchTasks={fetchTasks}
        />
      )}
      {taskToDelete && (
        <DeleteTaskModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          taskId={taskToDelete}
          fetchTasks={fetchTasks}
        />
      )}
    </div>
  );
};

export default Main;
