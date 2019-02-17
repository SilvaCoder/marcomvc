$.MarcoMVC = {};

$.MarcoMVC.getParameters = function(fn){
    return fn.toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
    .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
    .split(/,/)
}

//REAL MVC
$.MarcoMVC.dependencyInjection = function(controller, prop){

    //LOAD ALL DEPENDENCIES OF ALL CONTROLLERS, MAKE IT READY TO BE CALLED IN ANOTHER PLACE HERE (WHEN URL CHANGE);
    var parameters = $.MarcoMVC.getParameters(controller[prop]);

}

$.routes = function(routes){

    if(!Array.isArray(routes)){
        throw "Routes parameter must be an Array of route objects with 2 string properties. Ex: [ {url: 'www.someurl.com/path/path', controller: 'myController' }, {url: 'www.someurl.com/path/path', controller: 'myController' } ]";
    }

    for (var i=0; i<routes.length; i++){
        if(typeof routes[i] != 'object' || typeof routes[i].url != 'string' || typeof routes[i].controller != 'string'){
            throw "Routes parameter must be an Array of route objects with 2 string properties. Ex: [ {url: 'www.someurl.com/path/path', controller: 'myController' }, {url: 'www.someurl.com/path/path', controller: 'myController' } ]";
        }

        //if(!$.controller[routes[i].controller]) console.warn('Warning: Missing controller: '+routes[i].controller+' for route: '+routes[i].url); SÓ VAI DAR CERTO SE O ARQUIVO COM AS ROTAS DO CARA FOR CARREGADO POR ÚLTIMO OU DEPOIS DOS CONTROLLERS';
        $.routes[routes[i].url] = {controller: routes[i].controller};
    }
}

//FAKE MVC
$.MarcoMVC.loadController = function(url){

   
    if($.routes[url] && $.routes[url].controller){

        //Catch parameteres of registered controller function
        var params = $.MarcoMVC.getParameters($.controller[$.routes[url].controller]);

        //Makes a dependecy injection ** All dependencies are copy of the original - so 20 controllers using the same dependency will instantiate 20 copies of the same
        var dependencies = [];

        for (var i=0; i<params.length; i++){
            dependencies.push($.service[params[i]]? new $.service[params[i]]() : $.factory[params[i]]? new $.factory[params[i]]() : null);
        }

        console.log(params);
        console.log(dependencies);

        //Execute the controller !
        $.controller[$.routes[url].controller].apply(this, dependencies);

    }else{

        if(!$.routes[url]){
            throw '[Error]: No route was found';
        }else if(!$.routes[url].controller){
            throw '[Error] No controller was found for route: '+url;
        }

    }
    


}

//REGISTER SERVICE FUNCTION
$.service = function(name, service){

    if(typeof name != 'string' ){
        throw "Service's first parameter must be a String (name)";
    }

    if(typeof service != 'function'){
        throw "Service's second parameter must be a Function (code)";
    }

    if($.service[name]){
        throw "Duplicated service's name '"+name+"'";
    }


    $.service[name] = service;

}

//REGISTER FACTORY FUNCTION
$.factory = function(name, factory){

    if(typeof name != 'string' ){
        throw "Factory's first parameter must be a String (name)";
    }

    if(typeof(factory) != 'function'){
        throw "Factory's second parameter must be a Function (code)";
    }

    if($.factory[name]){
        throw "Duplicated factory's name '"+name+"'";
    }


    $.factory[name] = factory;

}

//REGISTER FACTORY FUNCTION
$.controller = function(name, controller){

    if(typeof name != 'string' ){
        throw "Controller's first parameter must be a String (name)";
    }

    if(typeof(controller) != 'function'){
        throw "Controller's second parameter must be a Function (code)";
    }

    if($.controller[name]){
        throw "Duplicated controller's name '"+name+"'";
    }

    var parameters = $.MarcoMVC.getParameters($.controller);

    $.controller[name] = controller;

}

///////
// CARREGOU TODOS OS JS DO CARA
// JÁ CADASTROU VÁRIOS CONTROLLERS SERVICES ETC NOS JS DELE
//////

// CHAMOU A FUNCAO START NA TAG SCRIPT APÓS CARREGAR TODOS OS JS ACIMA



$.start = function(){

    /*
    // INJECT DEPENDENCIES IN CONTROLLERS
    for (var prop in $.controller){ 
        if($.controller.hasOwnProperty(prop)){
            $.MarcoMVC.dependencyInjection($.controller, prop);
        } 
    }

    $(window).on('hashchange', function(e){
        
        MarcoMVC.loadController(location.host + location.pathname)

    });
    */

    $.MarcoMVC.loadController(location.host + location.pathname);
    

}
