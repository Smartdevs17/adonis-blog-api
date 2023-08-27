import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Post from 'App/Models/Post';
import CreateCommentValidator from 'App/Validators/CreateCommentValidator';

export default class CommentsController {
  public async getComments({response}: HttpContextContract) {
    try {
      const allComments = await Comment.all();
      return response.status(200).json({
        success: false,
        message: "all comments",
        data: allComments
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async addComment({auth,response,request}: HttpContextContract) {
    const user_id = await auth.user?.id;
    const payload = await request.validate(CreateCommentValidator);
    const data = {user_id,...payload};
    try {
      const newComment = await Comment.create(data);
      return response.status(200).json({
        success: false,
        message: "comment added successfully",
        data: newComment
      });
    } catch (error) {      
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }

  public async getComment({params,response}: HttpContextContract) {
    const id = await params.id;
    try {
      const result = await Comment.findOrFail(id);
      return response.status(200).json({
        success: false,
        message: "avaliable comment",
        data: result
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: "not found",
        error: error.message
      })
    }
  }

  public async updateComment({params,request,response}: HttpContextContract) {
    const id = params.id;
    const body = request.body();
    try {
      const result = await Comment.find(id);
      if(!result){
        return response.status(404).json({
          success: false,
          message: "comment not found"
        })
      }
      result!.comment_text = body.comment_text;
      await result.save();
      return response.status(200).json({
        success: true,
        message: "comment updated",
        data: result
      })
    } catch (error) {
      return response.status(500).json({
        success: true,
        message: "internal server error"
      })
    }
  }

  public async deleteComment({params,response}: HttpContextContract) {
    const id = params.id;
    if(!id){
      return response.status(400).json({
        success: false,
        message: "comment id is required"
      })
    }
    try {
      const result = await Comment.findOrFail(id);
      await result.delete();
      return response.status(200).json({
        success: false,
        message: "comment successfully deleted"
      })
    } catch (error) {
      return response.status(404).json({
        success: true,
        message: "comment does not exist",
      })
    }
  }

  public async getPostComments({params,response}: HttpContextContract){
    const post_id = params.id;
    if(!post_id){
      return response.status(400).json({
        success: false,
        message: "post id is required"
      })
    }
    try {
      const post_comments = await Post.query().where("id",post_id).withCount("comments").preload("comments");
      // const posts = await Post.query().withCount('comments')

      // posts.forEach((post) => {
      //   console.log(post.$extras.comments_count)
      // })
      
      
      return response.status(200).json({
        success: true,
        message: "post comments",
        data: post_comments
      })
    } catch (error) {
      console.log(error);
      
      return response.status(500).json({
        success: true,
        message: "internal server error"
      })
    }
  }
}
