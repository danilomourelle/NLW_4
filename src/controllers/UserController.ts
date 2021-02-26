import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const usersRepository = getCustomRepository(UserRepository);

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
