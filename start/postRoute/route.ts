import Route from '@ioc:Adonis/Core/Route'


Route.get("/api/posts/user","PostsController.userPosts").middleware('auth');
Route.get("/api/users_posts","PostsController.postWithUserProfile").middleware('auth');
Route.get("/api/posts/user/:id","PostsController.getUserPosts").middleware('auth');
Route.resource("/api/posts","PostsController").apiOnly().middleware({
    "*": ['auth']
});

