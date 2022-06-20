import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";

import {
  User,
  UserModel,
  UserInput,
  LoginToken,
  RefreshToken,
} from "./models/User";

import {
  PostModel
} from './models/Post'

import { fromPairs, get } from "lodash";

@Resolver()
export class UserResolver {
  // @Query(() => String)
  // cookieTest(
  //   @Ctx() { req, res }
  // ){
  //   const cookie = req.cookies.jid
  //   console.log(req.headers)
  //   console.log(cookie)
  //   return cookie
  // }

  @Mutation(() => LoginToken)
  checkAuth(@Ctx() { req, res }, @Arg("cookie") cookie: string): LoginToken {
    console.log(req.cookies.jid);

    if (cookie && cookie !== "no refresh") {
      try {
        const payload = verify(cookie, process.env.JWT_REFRESH);

        let userID = JSON.stringify(payload).split(",")[0].slice(11, -1);
        res.cookie(
          "jid",
          sign({ userID }, process.env.JWT_REFRESH, {
            expiresIn: "5d",
          }),
          {
            httpOnly: true,
          }
        );
        console.log(payload);
        const user = JSON.stringify(payload).split(",")[1].slice(8, -1);
        const avatar = JSON.stringify(payload).split(",")[2].slice(10, -1)
        console.log(user);
        return {
          token: sign({ userID, user, avatar }, process.env.JWT_SECRET, {
            expiresIn: "60m",
          }),
        };
      } catch (err) {
        console.log(err);
        return { token: "yes but invalid" };
      }
    } else return { token: "no" };
  }

  @Mutation(() => User)
  async createUser(
    @Arg("input") { username, password }: UserInput
  ): Promise<User> {
    //console.log(input)
    password = await hash(password, 12);
    const user = await UserModel.create({
      username,
      password,
      avatar:
        "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif",
    });
    user.save();
    // user.password = null
    return user;
  }
  @Query(() => LoginToken)
  async cookie(@Ctx() { res, req }): Promise<LoginToken> {
    res.cookie(
      "yum",
      sign({ payload: "this is a coookie" }, process.env.JWT_REFRESH, {
        expiresIn: "5d",
      }),
      {
        httpOnly: true,
      }
    );
    return { token: JSON.stringify(get(req, "cookies.jid") || "no") };
  }

  @Mutation(() => LoginToken)
  async login(
    @Arg("input") { username, password }: UserInput,
    @Ctx() { res }
  ): Promise<LoginToken> {
    //console.log(con)
    const user = await UserModel.find({ username: username });
    console.log(user);
    //console.log(username, user[0].password, password, user.password)
    const passwordCorrect = await compare(password, user[0].password);

    if (user && passwordCorrect) {
      const payload = res.cookie(
        "jid",
        sign(
          { userID: user[0]._id, user: user[0].username, avatar: user[0].avatar },
          process.env.JWT_REFRESH,
          {
            expiresIn: "5d",
          }
        ),
        {
          httpOnly: true,
        }
      );
      return {
        token: sign(
          { userID: user[0]._id, user: user[0].username, avatar: user[0].avatar },
          process.env.JWT_SECRET,
          { expiresIn: "60m" }
        ),
      };
    } else {
      return { token: "no token" };
    }
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { res }): boolean {
    console.log(res.cookie.jid);
    res.cookie("jid", "bad token", { maxAge: 0 });
    //res.cookie.jid.expiresIn = "Thu, 01 Jan 1970 00:00:00 GMT"

    return true;
  }
  @Query(() => [User])
  async users() {
    const users = await UserModel.find();
    console.log(users);
    return users;
  }

  @Query(() => User)
  async findUser(@Arg("username") username: string) {
    let noUser = { username: "no user found", posts: [] };
    noUser.posts = [
      { username: "no user found", content: "1", createdAt: new Date() },
    ];
    try {
      let user = await UserModel.find({ username: username }).populate("posts");
      if (user[0].username !== "") {
        return user[0];
      } else return user;
    } catch (err) {
      console.error(err);
    }
    return noUser;
  }

  @Mutation(() => User)
  async changeAvatar(
    @Arg("avatar") avatar: string,
    @Arg("username") username: string
  ) {
    try{
    let user = await UserModel.findOneAndUpdate({ username }, { avatar })
    let posts = await PostModel.updateMany({ username }, { avatar })
    return user
  }
  catch(err){
    console.error(err)
  }
  }
}
