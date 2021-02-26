import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveyRepository from "../repositories/SurveysRepository";

class SurveysController {
  /*  private repository: SurveyRepository;

  constructor() {
    this.repository = getCustomRepository(SurveyRepository);
  } */

  async create(req: Request, res: Response): Promise<Response> {
    const { title, description } = req.body;

    const repository = getCustomRepository(SurveyRepository);

    const survey = repository.create({
      title,
      description,
    });

    await repository.save(survey);

    return res.status(201).send(survey);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const repository = getCustomRepository(SurveyRepository);

    const allSurveys = await repository.find();

    return res.status(200).send(allSurveys);
  }
}

export default SurveysController;
