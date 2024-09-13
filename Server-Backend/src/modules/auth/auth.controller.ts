import { Request, Response } from "express";
import AuthService from "./auth.service";
import AuthUtils from "../../utils/auth";

class AuthController {
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;


    try {
      const user = await AuthService.getUser(email);

      if (
        !user ||
        !(await AuthUtils.validatePassword(password, user.password))
      ) {
             console.warn("Invalid login attempt:", { email });
        return {
          status: 400,
          message: "Invalid username or password",
        };
      }

      const token = AuthUtils.generateAccessToken(user.email, user.role);
      return {
        status: 200,
       payload: token,
      };
    } catch (err) {
      return {
        status: 500,
        message: err,
      };
    }
  }
}

export default AuthController;
