const { body } = require('express-validator');

exports.validarCriacaoHistorico = [
   body('datahoraenvio')
    .exists({ checkFalsy: true }).withMessage('O campo datahoraenvio é obrigatório.')
    .notEmpty().withMessage('O campo datahoraenvio não pode ser vazio.'),

  body('mensagemenviada')
    .exists({ checkFalsy: true }).withMessage('O campo mensagemenviada é obrigatório.')
    .notEmpty().withMessage('O campo mensagemenviada não pode ser vazio.'),

  body('destinatario')
    .exists({ checkFalsy: true }).withMessage('O campo destinatario é obrigatório.')
    .notEmpty().withMessage('O campo destinatario não pode ser vazio.'),
];