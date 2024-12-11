import { conmysql } from '../db.js';

export const getResultados = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM resultado');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los resultados' });
    }
};

export const getResultadoxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM resultado WHERE id_res = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Resultado no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el resultado' });
    }
};

export const postResultado = async (req, res) => {
    try {
        const { descripcion_res } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO resultado (descripcion_res) VALUES (?)',
            [descripcion_res]
        );
        res.status(201).json({ id: result.insertId, message: 'Resultado creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el resultado', error: error.message });
    }
};

export const putResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion_res } = req.body;
        const [result] = await conmysql.query(
            'UPDATE resultado SET descripcion_res = ? WHERE id_res = ?',
            [descripcion_res, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Resultado no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM resultado WHERE id_res = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el resultado' });
    }
};

export const patchResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion_res } = req.body;
        const [result] = await conmysql.query(
            'UPDATE resultado SET descripcion_res = IFNULL(?, descripcion_res) WHERE id_res = ?',
            [descripcion_res, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Resultado no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM resultado WHERE id_res = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el resultado' });
    }
};

export const deleteResultado = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM resultado WHERE id_res = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Resultado no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el resultado' });
    }
};
