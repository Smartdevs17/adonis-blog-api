import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post';
import User from 'App/Models/User';
import CreatePostValidator from 'App/Validators/CreatePostValidator'

export default class PostsController {
  public async index({response}: HttpContextContract) {
    try {
      const allPosts = await Post.all();
      return response.status(200).json({
        success: false,
        message: "all user posts",
        data: allPosts
      })
    } catch (error) {
      return response.status(500).json({success: false,message: "internal server error"});
    }
  }

  public async store({request,response,auth}: HttpContextContract) {
    const payload = await request.validate(CreatePostValidator);
    try {
      const user_id = auth.user?.id;
      const data = {user_id,...payload};
      const newPost = await Post.create(data);
      return response.status(201).json({
        success: true,
        message: "post successfully added",
        data: newPost
      })
    } catch (error) {
      console.log(error.message);
      
      return response.badRequest(error.message);
    }
  }

  public async show({params,response}: HttpContextContract) {
    const id = params.id;
    try {
      const result = await Post.find(id);
      if(!result){
        return response.status(404).json({
          success: false,
          message: "post not found"
        })
      }

      return response.status(200).json({
        success: false,
        message: "post found",
        data: result
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        messsage: "internal server error"
      })
    }
  }

  public async update({params,request,response}: HttpContextContract) {
    const id = params.id;
    const body = request.body();
    try {
      const result = await Post.find(id);
      if(!result){
        return response.status(404).json({
          success: false,
          message: "post not found"
        })
      }
      result.title = body.title?? result.title;
      result.desc  = body.desc?? result.desc;
      result.photo = body.photo?? result.photo;
      result.status = body.status?? result.status;
      await result.save()
      return response.status(204).json({
        success: false,
        message: "post updated successfully",
        data: result
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async destroy({params,response}: HttpContextContract) {
    const id = params.id;
    try {
      const result = await Post.find(id);
      if(!result){
        return response.status(404).json({
          success: false,
          message: "post not found"
        })
      }
      return response.status(200).json({
        success: false,
        message: "post deleted successfully",
        data: result
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async getUserPosts({params,response}: HttpContextContract){
    const user_id = params.id
    try {
      const user = await User.find(user_id);
      if(!user){
        return response.status(400).json({
          success: false,
          message: "no user found with that id"
        })
      }
      // const user_posts = await user.related("posts").query();
      const posts = await User.query().where('id',user_id).preload('posts');
      return response.status(200).json({
        success: false,
        message: "user posts",
        data: posts
      })
    } catch (error) {
      console.log(error.message);
      
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async userPosts({auth,response}: HttpContextContract){
    const user_id = auth.user
    try {
      const user = await User.find(user_id!.id);
      if(!user || (user.id) !== Number(user_id!.id)){
        return response.status(400).json({
          success: false,
          message: "no user found with that id"
        })
      }
      const posts = await user.related("posts").query();
      return response.status(200).json({
        success: false,
        message: "all user posts",
        data: posts
      })
    } catch (error) {
      console.log(error.message);
      
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async postWithUserProfile({response}: HttpContextContract){
    try {
      const allPosts = await Post.query().preload("user");
      return response.status(200).json({
        success: true,
        message: "all posts with user profile",
        data: allPosts
      })
    } catch (error) {
      console.log(error);
      
      return response.status(500).json({success: false,message: "internal server error"});
    }
  }
}
