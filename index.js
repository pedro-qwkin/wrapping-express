const {createRootController, createSubController} = require('./customController');

import Express from 'express';


const middlewareJoi = (schema) => { 
    return (req, res, next) => { 
    const { error } = Joi.validate(req.body, schema); 
    const valid = error == null; 
  
    if (valid) { 
      next(); 
    } else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',');
  
      console.log("error", message); 
     res.status(422).json({ error: message }) } 
    }
}

const joiPlugin = (controller, endpoint) => { 
    middlewareJoi(endpoint.params.requestSchema);
}   

const App = Express();
App.disable('x-powered-by');

App.use(Express.json({limit: 3e6}));

const rootController = createRootController(App,'/', {
  title: 'Primeiro exemplo',
  description: 'Descrição do primeiro exemplo'
});
rootController.addBeforeMiddleware(joiPlugin);
  
const userController = createSubController(rootController,'users', 'users')
userController.newEndpoint('post', '', (req, res, next) => console.log(req)), {
    requestSchema: {},
    responseSchema: {},
    desription: 'criei o endPoint e sai correndo, ... de quem ata lendo.',
    summary: 'Batata'
}
const PORT =  8800;

App.listen(PORT,  function() {
    console.log('HTTPS Server %s listening on port: %s', HOST, PORT);
  });

generateSwagger(rootController);