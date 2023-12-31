import { Body, Controller, Get, Post } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { AppService } from "./app.service";
import { LoginUserDto } from "./dto/login.user.dto";
import { RegisterUserDto } from "./dto/register.user.dto";

// import { ResetPasswordDto } from './dto/reset-password.user.dto';

@Controller()
export class AppController {
    mailClient: ClientProxy;
    registrationClient: ClientProxy;

    constructor(private appService: AppService) {
        this.registrationClient = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
                host: "127.0.0.1",
                port: 8866,
            },
        });
    }

  @Get()
    getHello(): string {
        return this.appService.getHello();
    }

  @Post("/user/register")
  async register(@Body() registerUserDto: RegisterUserDto) {
      const user = await firstValueFrom(
          this.registrationClient.send("/user/register", registerUserDto)
      );

      // await firstValueFrom(
      //    this.mailClient.send("/mail/send", {
      //     name: user["name"],
      //     email: user["email"],
      //     activationCode: user["activationCode"],
      //   })
      // );

      return user;
  }

  // @Patch("/user/reset-password")
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return firstValueFrom(
  //      this.registrationClient.send("/user/reset-password", resetPasswordDto)
  //   );
  // }
  
  @Post("/user/login")
  async login(@Body() loginUserDto: LoginUserDto) {
      return firstValueFrom(
          this.registrationClient.send("/user/login", loginUserDto)
      );
  }

}
