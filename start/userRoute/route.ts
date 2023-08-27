import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
    Route.group(() => {
        Route.post("/register","UsersController.register");
        Route.post("/login","UsersController.login");
        Route.get("/:id","UsersController.show");
        Route.get("/","UsersController.index");
        Route.put("/:id","UsersController.update").middleware('auth');
        Route.delete("/:id","UsersController.destroy").middleware('auth');
    }).prefix("/users")
}).prefix("/api");

