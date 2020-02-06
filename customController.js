'user strict';

import Messages from '../messages';
createController(App, name, params);
params = {requestSchema, responseValidator}
httpRequests = ['get', 'post', 'delete', 'update'];
class CustomController {
    constructor(App, fatherController, rootPath, name, params) {
        this.App = App;
        this.rootPath = rootPath;
        this.params = params;
        this.name = name;
        this.endpoints = {};
        this.fatherController = fatherController
        httpRequests.forEach(httpRequest => {
            this.endpoints[httpRequest] = [];
        })
        this.beforeMiddlewares = [];
        this.afterMiddlewares = [];
    }
    addBeforeMiddleware = (middleware) =>{
        this.beforeMiddlewares.push(middleware);
    }
    getBeforeMiddlewares = () => {
        if(this.fatherController) {
            return  this.fatherController.getBeforeMiddlewares() + this.beforeMiddlewares;
        }
        else {
            return this.beforeMiddlewares;
        }
    }
    addAfterMiddleware = (middleware) =>{
        this.afterMiddlewares.push(middleware);
    }
    getAfterMiddlewares = () => {
        if(this.fatherController) {
            return this.afterMiddlewares + this.fatherController.getAfterMiddlewares();
        }
        else {
            return this.afterMiddlewares;
        }
    }
    getRoute = () => {
        if(this.fatherController) {
            return this.fatherController.getRoute() + '/' + this.rootPath;
        }
        else {
            return this.rootPath;
        }
    }
    getApp = () => {
        if(this.fatherController) {
            return this.fatherController.getApp();
        }
        else {
            return this.App;
        }
    }
    newEndpoint = (type, route, callback, params) => {
        
        if(type in httpRequests)
            this.getApp()[type](this.getRoute()+'/'+route, [...this.getBeforeMiddlewares(this, params), callback, ...this.getAfterMiddlewares()])
        else
            throw new Error('Invalid type')
            this.endpoints[type].push({type, route, callback, params})
    }
    addSubController(rootPath, name, params) {
        this.children.push(new CustomController(App, this, rootPath, name, params))
    }
}

module.export = {
    createRootController: function(App, rootPath, params) {
        return new CustomController(App, null, rootPath, 'root', params)
    },
    createSubController: function(rootController, rootPath, name, params) {
        return new CustomController(null, rootController, rootPath, name, params)
    }
}
