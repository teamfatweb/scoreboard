import { Request, Response } from "express";
import UserService from "./user.service";

class UserController {
  /**
   * List users based on role.
   * @param req
   * @param res
   */
  public async listUser(req: Request, res: Response) {
    const { role } = req.body.user;
    try {
      const users = await UserService.listUsers(role);
      res.status(200).json(users);
    } catch (err) {
      console.error('Error listing users:', err);
      res.status(500).json({
        status: 500,
        message: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }

  /**
   * Create a new user.
   * @param req
   * @param res
   */
  public async createUser(req: Request, res: Response) {
    const { name, email, targetAmount, password, role } = req.body;
    const avatar = "";

    // Validate input
    if (!name || !email || typeof targetAmount !== 'number' || (role === 'superAdmin' && !password) || !role) {
        res.status(400).json({
            status: 400,
            message: "Invalid input data",
        });
    } else {
        try {
            let existingUser;

            // Check if user already exists
            if (role !== "seller") {
                existingUser = await UserService.getUserByEmail(email);
            } else {
                existingUser = await UserService.getUserByName(name);
            }

            if (existingUser) {
                res.status(400).json({
                    status: 400,
                    message: "User already exists!",
                });
            } else {
                // Create new user
                const newUser = await UserService.createUser(
                    name,
                    email,
                    Number(targetAmount),
                    password,
                    role,
                    avatar,
                    Number(targetAmount)
                );

                res.status(201).json({
                    status: 201,
                    payload: newUser,
                });
            }
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({
                status: 500,
                message: err instanceof Error ? err.message : "An unknown error occurred",
            });
        }
    }
}


  

  /**
   * Update user details.
   * @param req
   * @param res
   */
  public async updateUser(req: Request, res: Response) {
    const { email, name, targetAmount, currentTarget, role } = req.body;
    try {
      const updatedUser = await UserService.updateUser(
        email,
        name,
        Number(targetAmount),
        Number(currentTarget),
        role
      );
      res.status(200).json({
        status: 200,
        payload: updatedUser,
      });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({
        status: 500,
        message: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }

  /**
   * Delete a user.
   * @param req
   * @param res
   */
  public async deleteUser(req: Request, res: Response) {
    const { email, role } = req.body;
    try {
      const deletedUser = await UserService.deleteUser(email, role);
      res.status(200).json({
        status: 200,
        message: "User deleted successfully.",
        payload: deletedUser,
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        status: 500,
        message: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }
}

export default UserController;
