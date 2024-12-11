import { conmysql } from '../db.js';

export const getPerfiles = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM perfil');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los perfiles' });
    }
};

export const getPerfilxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM perfil WHERE per_id = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};

export const postPerfil = async (req, res) => {
    try {
        const { descripcion, estado } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO perfil (descripcion, estado) VALUES (?, ?)',
            [descripcion, estado]
        );
        res.status(201).json({ id: result.insertId, message: 'Perfil creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el perfil', error: error.message });
    }
};

export const putPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, estado } = req.body;
        const [result] = await conmysql.query(
            'UPDATE perfil SET descripcion = ?, estado = ? WHERE per_id = ?',
            [descripcion, estado, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM perfil WHERE per_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

export const patchPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, estado } = req.body;
        const [result] = await conmysql.query(
            'UPDATE perfil SET descripcion = IFNULL(?, descripcion), estado = IFNULL(?, estado) WHERE per_id = ?',
            [descripcion, estado, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM perfil WHERE per_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

export const deletePerfil = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM perfil WHERE per_id = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Perfil no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el perfil' });
    }
};