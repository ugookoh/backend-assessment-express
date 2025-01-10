import express from "express";
import authRoute from "./AuthRoutes";
import noteRoute from "./NoteRoutes";

const router = express.Router();
const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/notes",
    route: noteRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
