import Route from '@ioc:Adonis/Core/Route'


Route.get("/",() => {
    return "Server is runnning successfully";
})