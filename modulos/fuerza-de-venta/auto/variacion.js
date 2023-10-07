/* import app from "../../../index.js";
import pool from "../../../db.js";

app.get("/variacion/:anyo", (req, res) => {
    const anyo = parseInt(req.params.anyo);
    const anyoActual = anyo + "-01-01 00:00:00";
    const anyoSiguiente = (anyo + 1) + "-01-01 00:00:00";
    const queryStr = `SELECT COUNT(*) AS 'emisiones' FROM \`app_emision\` 
    WHERE \`emision_fecha\` > ? 
    AND \`emision_fecha\` < ?`;
    pool.query(queryStr, [anyoActual, anyoSiguiente], function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
}); */