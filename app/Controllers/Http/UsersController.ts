import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async index({response}: HttpContextContract) {
    try {
      const users = await User.all();
      return response.status(200).json({
        success: true,
        message: "all users",
        data: users
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        messsage: "internal server error",
        error
      });
    }
  }

  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    try {
      const result = await User.create(payload);
      const newUser = result.toJSON()
     return response.status(201).json({
        success: true,
        message: 'new user added successfully',
        data: newUser,
      })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(LoginUserValidator)
    const { email, password: user_password } = payload
    try {
      const user = await User.findBy('email', email)
      if (!user) {
        response.status(404)
        return {
          success: false,
          message: 'no user found with that email address',
        }
      }
      // try {
      //   const token = await auth.use('api').attempt(email,password);
      //   response.status(200)
      //   return {
      //     success: true,
      //     messsage: "user login successfully",
      //     data: {access_token: token,user}
      //   }
      // } catch (error) {
      //   return response.unauthorized('Invalid credentials')
      // }
      // Verify password
      if (!(await Hash.verify(user.password, user_password))) {
        return response.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Generate token
      const userToken = await auth.use('api').generate(user,{
        // expiresIn: '30 mins'
        expiresIn: '7 days'

      });
      user.remember_me_token = userToken.token;
      await user.save();
      const userData = user.toJSON()
      return response.status(200).json({
        success: true,
        messsage: 'user login successfully',
        data: userData,
      })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id
    const user = await User.find(id)
    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'user not found',
      })
    }
    const userJson = user.toJSON();
    return response.status(200).json({
      success: true,
      message: 'user found',
      data: userJson,
    })
  }

  public async update({params,request,response,auth}: HttpContextContract) {
    const id = params.id;
    const body = request.body();
    try {
      const user = await User.find(id);
      if(!user){
        return response.status(404).json({
          success: true,
          message: "user not found"
        })
      }
      const userId = auth.user;
      if (userId?.id !== Number(id)) {
        return response.status(403).json({
          success: false,
          message: "You are not authorized to update this user's data.",
        });
      }

      user.name = body.name??user.name;
      user.avatar = body.avatar??user.avatar;
      user.status = body.status??user.status;
      await user.save();
      return response.status(200).json({
        success: true,
        message: "user update successfully",
        data: user
      })
    } catch (error) {
      return response.status(500).json({success: true,message: "internal server error",error});
    }
  }

  public async destroy({params,response,auth}: HttpContextContract) {
    const id = params.id;
    try {
      const user = await User.find(id);
      if(!user){
        return response.status(404).json({success: false,message: "user not found"});
      }
      const userId = auth.user;
      if(userId?.id !== Number(id)){
        return response.status(403).json({
          success: false,
          message: "You are not authorized to update this user's data.",
        })
      }
      await user.delete()
      return response.status(200).json({
        success: true,
        message: "user successfully deleted",
        data: user
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
  }
}
