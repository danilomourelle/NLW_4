import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const usersRepository = getRepository(User);

    const exitingUser = await usersRepository.findOne({
      email,
    });

    if (exitingUser) {
      return res.status(400).send({
        message: "Usuário já cadastrado",
      });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return res.status(201).send(user);
  }
}

export default UserController;
