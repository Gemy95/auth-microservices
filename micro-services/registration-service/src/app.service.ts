import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthService } from './authentication/shared/auth.service';
import { AuthUserType } from './authentication/shared/constants/auth.types.enum';
import { LoginUserDto } from './dto/login.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { ResetPasswordDto } from './dto/reset-password.user.dto';
// import { User, UserDocument } from './helpers/utils';
import { User, UserDocument } from './models/user.model';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private authService: AuthService) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hashSync(registerUserDto.password, SALT_OR_ROUNDS);
    const createdUser = new this.userModel({
      ...registerUserDto,
      password: hashedPassword,
    });
    const result = await createdUser.save();
    result.password = undefined;
    return result;
  }

  async resetPasswordUser(resetPasswordDto: ResetPasswordDto) {
    const currentUser = await (
      await this.userModel.findOne({
        activationCode: resetPasswordDto.activationCode,
        isActivated: false,
      })
    )?.toJSON();

    if (!currentUser) {
      throw new RpcException('This account not found');
    }

    const hashedPassword = await bcrypt.hashSync(resetPasswordDto.newPassword, SALT_OR_ROUNDS);

    await this.userModel.updateOne(
      {
        activationCode: resetPasswordDto.activationCode,
      },
      {
        password: hashedPassword,
        isActivated: true,
      },
    );
    return 'updated';
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const currentUser = await (
      await this.userModel.findOne({
        email: loginUserDto.email,
      })
    )?.toJSON();

    if (!currentUser) {
      throw new RpcException('This email not found');
    }

    if (!currentUser.isActivated) {
      throw new RpcException('Please Activate your account');
    }

    const isMatch = await bcrypt.compareSync(loginUserDto.password, currentUser.password);

    if (!isMatch) {
      throw new RpcException('Incorrect Password');
    }

    delete currentUser.password;

    delete currentUser.activationCode;

    const { accessToken, refreshToken } = await this.authService.generateTokens(AuthUserType.Client, currentUser);

    return {
      ...currentUser,
      accessToken,
      refreshToken,
    };
  }
}
