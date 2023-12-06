import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

//Para loguear una persona
router.post("/sessions/login", async (req, res) => {
      const {
            body: { email, password },
      } = req;
      if (!email || !password) {
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Todos los campos son requeridos.",
            });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
            //Validamos el usuario segun el mail
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Email o Contraseña Invalida.",
            });
      }
      if (user.password !== password) {
            //Validamos la password
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Email o Contraseña Invalida.",
            });
      }
      if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
      } else {
            user.role = 'usuario';
      }

      // Guardar el rol asignado en la base de datos
      await user.save();

      req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role // Asignar el rol al usuario en la sesión
      }
      res.redirect("/profile");
});

//Para registrar una persona
router.post("/sessions/register", async (req, res) => {
      const {
            body: { first_name, last_name, email, password, age },
      } = req;
      if (!first_name || !last_name || !email || !password) {
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Todos los campos son requeridos.",
            });
      }
      const user = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
      });
      // Redirecciono a login
      res.redirect("/");
});

//Para ver el perfil de una persona
router.get("/sessions/profile", async (req, res) => {
      if (!req.session.user) {
            res.status(401).json({ message: "No estas autenticado" });
      }
      res.status(200).json(req.session.user);
});

//Logout de la cuenta
router.get("/session/logout", async (req, res) => {
      req.session.destroy((error) => {
            if (error) {
                  return res.render("error", {
                        title: "Error ❌",
                        messageError: error.message,
                  });
            }
            res.redirect("/");
      });
});

export default router;
