'use strict';


//--- checking if the user is authorized for this request---//
module.exports = (ability) => {
    return (req, res, next) => {
      try {
        if (req.user.abilities.includes(ability)) {
          next();
        } else {
          next('Not Authorised');
        }
      } catch (error) {
        next(error.message);
      }
    };
  };