import moment from 'moment';
import db from '../db/index';
import Helper from '../middleware/helper';


class records {
  // To create an incident
  static async createIncident(req, res) {
    const createQuery = `INSERT INTO
      incidents (createdOn, createdBy, type, location, status, title, comment)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;

    const values = [
      moment(new Date()),
      req.body.createdBy,
      req.body.type,
      req.body.location,
      req.body.status,
      req.body.title,
      req.body.comment,
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).json(rows[0]);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  // To get an incident
  static async getOneIncident(req, res) {
    const text = 'SELECT * FROM incidents WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404)
          .json({
            'message': 'Incident not found',
          });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(400).json(error);
    }
  }


  // To get all incidents
  static async getAllIncidents(req, res) {
    const findAllQuery = 'SELECT * FROM incidents';
    const { rows, rowCount } = await db.query(findAllQuery);
    return res.status(200).json({ rows, rowCount });
  }


  // To update an incident
  static async updateAnIncident(req, res) {
    const findOneQuery = 'SELECT * FROM incidents WHERE id=$1';
    const updateOneQuery = `UPDATE incidents
      SET location=$1, title=$2, comment=$3
      WHERE id=$4 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404)
          .json({ "message": "Incident not found! " });
      }
      const values = [
        req.body.location || rows[0].location,
        req.body.title || rows[0].title,
        req.body.comment || rows[0].comment,
        req.params.id,
      ];
      // const response = await db.query(updateOneQuery, values);
      // return res.status(200).send(response.rows[0]);
      return res.status(200)
        .json(
          {
            status: 200,
            message: 'Your incident has been updated successfully.',
          },
        );
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  // To delete an incident
  static async deleteAnIncident(req, res) {
    const deleteQuery = 'DELETE FROM incidents WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404)
          .json({
            'message': 'Incident not found',
          });
      } if (rows[0]) {
        return res.status(204)
          .json({
            error: 204,
            message: 'Your incident has been deleted',
          });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default records;