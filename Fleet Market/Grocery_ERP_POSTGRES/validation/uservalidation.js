const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    fname: Joi.string().required().min(1),
    lname: Joi.string().required().min(1),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    state : Joi.string().required(),
    city : Joi.string().required(),
    gender : Joi.required(),
    usertype : Joi.required(),
    confirmpassword : Joi.required()
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
