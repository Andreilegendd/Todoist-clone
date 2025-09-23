import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import AuthController from "../controllers/authController.js";
import UserController from "../controllers/userController.js";
import ProjectController from "../controllers/projectController.js";
import TaskController from "../controllers/taskController.js";
import LabelController from "../controllers/labelController.js";

const router = express.Router();

// Public routes (authentication)
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Protected routes
const protectedRoutes = express.Router();
protectedRoutes.use(authMiddleware);

// User routes
protectedRoutes.get("/me", UserController.me);
protectedRoutes.post("/profile/change-name", UserController.changeName);
protectedRoutes.post("/auth/logout", UserController.logout);
protectedRoutes.post("/auth/change-password", UserController.changePassword);
protectedRoutes.delete("/auth/delete-account", UserController.deleteAccount);

// Project routes
protectedRoutes.get("/projects", ProjectController.getAllProjects);
protectedRoutes.post("/projects", ProjectController.createProject);
protectedRoutes.put("/projects/:id", ProjectController.updateProject);
protectedRoutes.delete("/projects/:id", ProjectController.deleteProject);

// Task routes
protectedRoutes.get("/tasks", TaskController.getAllTasks);
protectedRoutes.post("/tasks", TaskController.createTask);
protectedRoutes.put("/tasks/:id", TaskController.updateTask);
protectedRoutes.delete("/tasks/:id", TaskController.deleteTask);
protectedRoutes.patch("/tasks/:id/complete", TaskController.completeTask);
protectedRoutes.patch("/tasks/:id/uncomplete", TaskController.uncompleteTask);

// Label routes
protectedRoutes.get("/labels", LabelController.getAllLabels);
protectedRoutes.post("/labels", LabelController.createLabel);
protectedRoutes.put("/labels/:id", LabelController.updateLabel);
protectedRoutes.delete("/labels/:id", LabelController.deleteLabel);

router.use("/", protectedRoutes);

export default router;
