import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';
import File from '../models/File';

class SubscriptionController {
  async index(req, res) {
    try {
      const meetups = await Subscription.findAll({
        where: {
          user_id: req.userId,
          canceled_at: null,
        },
        attributes: ['id'],
        include: [
          {
            model: Meetup,
            as: 'meetup',
            attributes: [
              'id',
              'title',
              'description',
              'location',
              'date',
              'user_id',
            ],
            where: {
              date: {
                [Op.gte]: new Date(),
              },
            },
            include: [
              {
                model: File,
                as: 'image',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
        ],
        order: [['meetup', 'date']],
      });

      return res.json(meetups);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  async store(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      const meetup = await Meetup.findByPk(req.body.meetup_id, {
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      if (meetup.user_id === req.userId) {
        return res.status(401).json({
          error: 'Você não pode se inscrever em Meetups que você criou',
        });
      }

      if (meetup.past) {
        return res.status(401).json({
          error: 'Esse meetup já aconteceu',
        });
      }

      const subscriptionData = {
        meetup_id: meetup.id,
        user_id: req.userId,
        canceled_at: null,
      };

      const userAlreadySubscribed = await Subscription.findOne({
        where: subscriptionData,
      });

      if (userAlreadySubscribed) {
        return res.status(401).json({
          error: 'Você já está incrito nesse Meetup',
        });
      }

      const hasSubscriptionOnSameDate = await Subscription.findOne({
        where: { user_id: req.userId, canceled_at: null },
        include: [
          {
            model: Meetup,
            as: 'meetup',
            where: {
              date: meetup.date,
            },
          },
        ],
      });

      if (hasSubscriptionOnSameDate) {
        return res.status(401).json({
          error: 'Você já tem um Meetup nesse horário',
        });
      }

      const subscription = await Subscription.create({
        ...subscriptionData,
      });

      Queue.add(SubscriptionMail.key, { meetup, user });

      return res.json(subscription);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const subscription = await Subscription.findByPk(id);

      const newSubscription = await subscription.update({
        ...subscription,
        canceled_at: new Date(),
      });

      return res.json(newSubscription);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao cancelar incrição' });
    }
  }
}

export default new SubscriptionController();
