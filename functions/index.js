const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ncolectivaapp@gmail.com',
        pass: 'uwpmxmfshddzyynn'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;
        const titulo = req.query.titulo;
        const horaInicio = req.query.horaInicio;
        const horaTermino = req.query.horaTermino;
        const fecha = req.query.fecha;
        const nombreSindicato = req.query.nombreSindicato;

        const mailOptions = {
            from: 'NColectivaApp <ncolectivaapp@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Reunión de sindicato agendada:'+titulo, // email subject
            html: "Tu sindicato "+"<b>"+nombreSindicato+"</b>"+ " ha agendado una reunión para el día "+fecha+ "<br/>"+
            " <b>Hora inicio:</b> "+ horaInicio+"<br/>"+
            " <b>Hora término: </b>"+horaTermino
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});
