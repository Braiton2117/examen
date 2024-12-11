import { conmysql } from '../db.js';

export const getPronosticos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pronostico');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los pronósticos' });
    }
};

export const getPronosticoxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pronostico WHERE id_pron = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Pronóstico no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el pronóstico' });
    }
};

export const postPronostico = async (req, res) => {
  const { id_usr, id_par, id_res, valor } = req.body;  // Recuperamos los valores del cuerpo de la solicitud
  
  // Obtener la fecha de registro actual y formatearla correctamente (sin la hora)
  const fecha_registro = new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"; // Fecha en formato YYYY-MM-DDT00:00:00.000Z

  try {
    const result = await conmysql.query(`
      INSERT INTO pronostico (id_usr, id_par, id_res, valor, fecha_registro)
      VALUES (?, ?, ?, ?, ?)
    `, [id_usr, id_par, id_res, valor, fecha_registro]);

    res.status(200).json({ message: 'Pronóstico registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el pronóstico', error: error.message });
  }
};

export const putPronostico = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usr, id_par, id_res, valor, fecha_registro } = req.body;
        const [result] = await conmysql.query(
            'UPDATE pronostico SET id_usr = ?, id_par = ?, id_res = ?, valor = ?, fecha_registro = ? WHERE id_pron = ?',
            [id_usr, id_par, id_res, valor, fecha_registro, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Pronóstico no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM pronostico WHERE id_pron = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el pronóstico' });
    }
};

export const patchPronostico = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usr, id_par, id_res, valor, fecha_registro } = req.body;
        const [result] = await conmysql.query(
            'UPDATE pronostico SET id_usr = IFNULL(?, id_usr), id_par = IFNULL(?, id_par), id_res = IFNULL(?, id_res), valor = IFNULL(?, valor), fecha_registro = IFNULL(?, fecha_registro) WHERE id_pron = ?',
            [id_usr, id_par, id_res, valor, fecha_registro, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Pronóstico no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM pronostico WHERE id_pron = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el pronóstico' });
    }
};

export const deletePronostico = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM pronostico WHERE id_pron = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Pronóstico no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el pronóstico' });
    }
};

export const getAcertantes = async (req, res) => {
    try {
        const { id } = req.params; // ID del partido
        const [rows] = await conmysql.query(
            `SELECT u.nombres, pr.id_pron, pr.id_res AS pronostico, pa.id_res AS resultado
             FROM pronostico pr
             INNER JOIN usuario u ON pr.id_usr = u.id_usr
             INNER JOIN partido pa ON pr.id_par = pa.id_par
             WHERE pr.id_par = 9 AND pr.id_res = pa.id_res`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No hay acertantes para este partido' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de acertantes:', error.message, error.stack);
        res.status(500).json({ message: 'Error al obtener la lista de acertantes' });
    }
};

