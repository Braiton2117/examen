import { conmysql } from '../db.js';

export const getEquipos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM equipo');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los equipos' });
    }
};

export const getEquipoxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM equipo WHERE id_eq = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el equipo' });
    }
};

export const postEquipo = async (req, res) => {
    try {
        const { nombre_eq, ciudad_eq } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO equipo (nombre_eq, ciudad_eq) VALUES (?, ?)',
            [nombre_eq, ciudad_eq]
        );
        res.status(201).json({ id: result.insertId, message: 'Equipo creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el equipo', error: error.message });
    }
};

export const putEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_eq, ciudad_eq } = req.body;
        const [result] = await conmysql.query(
            'UPDATE equipo SET nombre_eq = ?, ciudad_eq = ? WHERE id_eq = ?',
            [nombre_eq, ciudad_eq, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM equipo WHERE id_eq = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el equipo' });
    }
};

export const patchEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_eq, ciudad_eq } = req.body;
        const [result] = await conmysql.query(
            'UPDATE equipo SET nombre_eq = IFNULL(?, nombre_eq), ciudad_eq = IFNULL(?, ciudad_eq) WHERE id_eq = ?',
            [nombre_eq, ciudad_eq, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM equipo WHERE id_eq = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el equipo' });
    }
};

export const deleteEquipo = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM equipo WHERE id_eq = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Equipo no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el equipo' });
    }
};