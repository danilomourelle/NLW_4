import { Request, Response } from "express";
import path from "path";
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import UserRepository from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(req: Request, res: Response): Promise<Response> {
    const { email, surveyId } = req.body;

    const usersRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return res.status(400).send({
        error: "User does not exists",
      });
    }

    const survey = await surveysRepository.findOne({ id: surveyId });
    if (!survey) {
      return res.status(400).send({
        error: "Survey does not exists",
      });
    }

    const npsPath = path.resolve(__dirname, "../views/emails/npsMail.hbs");
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      userId: user.id,
      link: process.env.URL_MAIL,
    };

    const surveyUser = await surveysUsersRepository.findOne({
      where: { userId: user.id, value: null, surveyId },
      relations: ["user", "survey"],
    });

    if (surveyUser) {
      // Enviar e-mail para p usuário
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return res.send(surveyUser);
    }

    // Salvar as informações na tabela surveys_users
    const newSurveyUser = surveysUsersRepository.create({
      userId: user.id,
      surveyId,
    });
    await surveysUsersRepository.save(newSurveyUser);

    // Enviar e-mail para p usuário
    await SendMailService.execute(email, survey.title, variables, npsPath);
    return res.send(newSurveyUser);
  }
}

export default SendMailController;
