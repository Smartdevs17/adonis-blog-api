import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
    Route.group(() => {
        Route.post("/","CommentsController.addComment");
        Route.get("/","CommentsController.getComments");
        Route.get("/post_comments/:id","CommentsController.getPostComments");
        Route.get("/:id","CommentsController.getComment");
        Route.put("/:id","CommentsController.updateComment");
        Route.delete("/:id","CommentsController.deleteComment");
    }).prefix("/comments").middleware(['auth']);

}).prefix("/api");