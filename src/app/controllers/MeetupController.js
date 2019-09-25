import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import * as Yup from 'yup';

import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

const PAGE_SIZE = 10;

class MeetupController {
  async index(req, res) {
    const { page, date } = req.query;

    const searchDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async show(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id, {
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!meetup || meetup.user_id !== req.userId) {
      return res.status(204).json({ error: 'Not content' });
    }

    return res.json(meetup);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(401).json({ error: 'The informed date is past' });
    }

    const user_id = req.userId;

    try {
      const obj = {
        user_id,
        ...req.body,
      };
      const result = await Meetup.create(obj);

      const { id, title, description, location, date, file_id } = result;

      return res.json({ id, title, description, location, date, file_id });
    } catch (err) {
      return res.status(500).json({ erro: err });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You are not allowed to update a Meetup from another organizer',
      });
    }

    if (meetup.past) {
      return res.status(401).json({
        error: 'You are not allowed to update an already past Meetup',
      });
    }

    const {
      id,
      title,
      description,
      location,
      date,
      file_id,
    } = await meetup.update(req.body);

    return res.json({
      id,
      title,
      description,
      location,
      date,
      file_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You are not allowed to cancel a Meetup from another organizer',
      });
    }

    if (meetup.past) {
      return res.status(401).json({
        error: 'You are not allowed to cancel an already past Meetup',
      });
    }

    await meetup.destroy();

    return res.json();
  }
}

export default new MeetupController();
