import { conmysql } from '../db.js';

export const getPartidos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM partido');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los partidos' });
    }
};

export const getPartidoxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM partido WHERE id_par = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Partido no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el partido' });
    }
};

export const getPartidosActivos = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            SELECT 
                p.id_par, 
                e1.nombre_eq AS eq_uno, 
                e2.nombre_eq AS eq_dos, 
                p.fecha_par 
            FROM 
                partido p
            JOIN 
                equipo e1 ON p.eq_uno = e1.id_eq
            JOIN 
                equipo e2 ON p.eq_dos = e2.id_eq
            WHERE 
                p.estado_par = 'Activo'  -- Solo partidos activos
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los partidos activos', error: error.message });
    }
};

export const postPartido = async (req, res) => {
    try {
        const { eq_uno, eq_dos, fecha_par, id_res, estado_par } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO partido (eq_uno, eq_dos, fecha_par, id_res, estado_par) VALUES (?, ?, ?, ?, ?)',
            [eq_uno, eq_dos, fecha_par, id_res, estado_par]
        );
        res.status(201).json({ id: result.insertId, message: 'Partido creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el partido', error: error.message });
    }
};

export const putPartido = async (req, res) => {
    try {
        const { id } = req.params;
        const { eq_uno, eq_dos, fecha_par, id_res, estado_par } = req.body;

        if (!id_res || !estado_par) { // Validar parámetros esenciales
            return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
        }

        const [result] = await conmysql.query(
            'UPDATE partido SET id_res = ?, estado_par = ? WHERE id_par = ?',
            [id_res, estado_par, id]
        );

        if (result.affectedRows <= 0) {po
            return res.status(404).json({ message: 'Partido no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM partido WHERE id_par = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar el partido:', error.message, error.stack);
        res.status(500).json({ message: 'Error al actualizar el partido', error: error.message });
    }
};

export const patchPartido = async (req, res) => {
    try {
        const { id } = req.params;
        const { eq_uno, eq_dos, fecha_par, id_res, estado_par } = req.body;
        const [result] = await conmysql.query(
            'UPDATE partido SET eq_uno = IFNULL(?, eq_uno), eq_dos = IFNULL(?, eq_dos), fecha_par = IFNULL(?, fecha_par), id_res = IFNULL(?, id_res), estado_par = IFNULL(?, estado_par) WHERE id_par = ?',
            [eq_uno, eq_dos, fecha_par, id_res, estado_par, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Partido no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM partido WHERE id_par = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el partido' });
    }
};

export const deletePartido = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM partido WHERE id_par = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Partido no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el partido' });
    }
};

export const getGanadores = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            SELECT 
                u.id_usr,
                u.nombres,
                u.cedula,
                p.id_par,
                r.descripcion_res AS resultado_acertado,
                pr.valor AS valor_pronostico,
                pr.fecha_registro AS fecha_pronostico
            FROM 
                pronostico pr
            JOIN 
                usuario u ON pr.id_usr = u.id_usr
            JOIN 
                partido p ON pr.id_par = p.id_par
            JOIN 
                resultado r ON pr.id_res = r.id_res
            WHERE 
                p.id_res = pr.id_res; -- Solo ganadores con resultados acertados
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los ganadores', error: error.message });
    }
};