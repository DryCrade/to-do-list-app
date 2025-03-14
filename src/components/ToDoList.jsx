import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const tasksCollection = collection(db, "tasks");
            const taskSnapshot = await getDocs(tasksCollection);
            const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(taskList);
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask.trim() !== "") {
            const docRef = await addDoc(collection(db, "tasks"), {
                title: newTask,
                completed: false,
                created: new Date(),
            });
            setTasks((prevTasks) => [...prevTasks, { id: docRef.id, title: newTask, completed: false }]);
            setNewTask("");
        }
    };

    const deleteTask = async (index) => {
        const taskToDelete = tasks[index];
        const taskRef = doc(db, "tasks", taskToDelete.id);
        await deleteDoc(taskRef);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const updateTask = async (index, newTitle) => {
        const taskToUpdate = tasks[index];
        const taskRef = doc(db, "tasks", taskToUpdate.id);
        await updateDoc(taskRef, { title: newTitle });
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, title: newTitle } : task
        );
        setTasks(updatedTasks);
    };

    const toggleTaskCompletion = async (index) => {
        const taskToToggle = tasks[index];
        const taskRef = doc(db, "tasks", taskToToggle.id);
        const updatedCompletedStatus = !taskToToggle.completed;
        await updateDoc(taskRef, { completed: updatedCompletedStatus });
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, completed: updatedCompletedStatus } : task
        );
        setTasks(updatedTasks);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(task => task.id === active.id);
            const newIndex = tasks.findIndex(task => task.id === over.id);
            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            setTasks(newTasks);
        }
    };

    return (
        <div className="to-do-list">
            <button 
                className="logout-btn"
                onClick={() => navigate("/")}>
                Logout
            </button>
            <h1>To Do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter a new task"
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTask();
                        }
                    }}
                    maxLength={30} // Prevent overspilling
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <ol>
                        {tasks.map((task, index) => (
                            /* Passing the functions */
                            <SortableTask 
                                key={task.id} 
                                id={task.id} 
                                task={task.title} 
                                completed={task.completed}
                                deleteTask={() => deleteTask(index)} 
                                toggleCompletion={() => toggleTaskCompletion(index)}
                                updateTask={(newTitle) => updateTask(index, newTitle)}
                            />
                        ))}
                    </ol>
                </SortableContext>
            </DndContext>
        </div>
    );
}

export default ToDoList;