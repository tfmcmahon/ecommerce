exports.userRegisterValidator = (req, res, next) => {
   req.check('name', 'Name field is required.')
      .notEmpty()
   req.check('email', 'Email field is required.')
      .notEmpty()
   req.check('email')
      .matches( //email validating regex 
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      )
      .withMessage('Email field must be a valid email adress.')
   req.check('password', 'Password field is required.')
      .notEmpty()
   req.check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.')
   req.check('password')
      .matches(/\d/g)
      .withMessage('Password must contain at least one number.')
   req.check('password')
      .equals(req.body.password2)
      .withMessage('Passwords must match.')

   const errors = req.validationErrors()
   if (errors) {
      const firstError = errors.map(error => error.msg)
      return res.status(400)
               .json({
                     error: firstError[0]
               })
   }
   next()
}