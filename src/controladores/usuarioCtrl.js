import { conmysql } from '../db.js';

export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuario');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

export const getUsuarioxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuario WHERE id_usr = ?', [req.params.id]);
        if (result.length <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const postUsuario = async (req, res) => {
    try {
        const { cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO usuario (cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id]
        );
        res.status(201).json({ id: result.insertId, message: 'Usuario creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

export const putUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id } = req.body;
        const [result] = await conmysql.query(
            'UPDATE usuario SET cedula = ?, nombres = ?, direccion = ?, telefono = ?, fecha_registro = ?, usuario = ?, clave = ?, per_id = ? WHERE id_usr = ?',
            [cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM usuario WHERE id_usr = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const patchUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id } = req.body;
        const [result] = await conmysql.query(
            'UPDATE usuario SET cedula = IFNULL(?, cedula), nombres = IFNULL(?, nombres), direccion = IFNULL(?, direccion), telefono = IFNULL(?, telefono), fecha_registro = IFNULL(?, fecha_registro), usuario = IFNULL(?, usuario), clave = IFNULL(?, clave), per_id = IFNULL(?, per_id) WHERE id_usr = ?',
            [cedula, nombres, direccion, telefono, fecha_registro, usuario, clave, per_id, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const [rows] = await conmysql.query('SELECT * FROM usuario WHERE id_usr = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM usuario WHERE id_usr = ?', [req.params.id]);
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }
        res.sendStatus(202);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
      const { user, password } = req.body;
  
      if (!user) {
        return res.status(400).json({
          Mensaje: "Error: El usuario es requerido",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
  
      if (!password) {
        return res.status(400).json({
          Mensaje: "Error: La contraseña es requerida",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
  
      // Consulta para obtener los datos del usuario y su perfil
      const [result] = await conmysql.query(
        `SELECT u.*, p.descripcion AS perfil
         FROM usuario u
         JOIN perfil p ON u.per_id = p.per_id
         WHERE u.usuario = ? AND u.clave = ?`,
        [user, password]
      );
  
      if (result.length > 0) {
        // Responder con los datos del usuario y su perfil
        res.json({
          Mensaje: "Inicio de sesión exitoso",
          cantidad: 1,
          data: result,
          color: "success",
        });
      } else {
        res.json({
          Mensaje: "Credenciales incorrectas",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getGanador = async (req, res) => {
    try {
        const { cedula } = req.params; // Cédula del usuario
        const [usuario] = await conmysql.query(
            `SELECT id_usr, nombres 
             FROM usuario 
             WHERE cedula = ?`,
            [cedula]
        );

        // Verificar si el usuario existe
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const id_usr = usuario[0].id_usr;
        const nombres = usuario[0].nombres;

        // Buscar monto ganado
        const [ganancias] = await conmysql.query(
            `SELECT SUM(valor) AS monto_ganado
             FROM pronostico
             WHERE id_usr = ? AND id_res IN (
                SELECT id_res FROM partido WHERE id_res IS NOT NULL
             )`,
            [id_usr]
        );

        // Verificar si tiene premios
        const montoGanado = ganancias[0].monto_ganado;
        if (!montoGanado) {
            return res.status(200).json({ message: 'No tiene premios ganados' });
        }

        // Respuesta con el ganador y el monto ganado
        res.json({
            ganador: nombres,
            monto_ganado: montoGanado,
        });
    } catch (error) {
        console.error('Error al obtener el ganador y monto ganado:', error.message, error.stack);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};