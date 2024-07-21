import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt'
// import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly dataservice: DatabaseService,
    private readonly jwtservice: JwtService
  ){

  }

  async login(loginData: LoginDto){
    const{ email, password} = loginData;
    const user = await this.dataservice.user.findFirst({
      where:{
        email: email
      }
    })
    if(!user){
      throw new NotFoundException("No user exists with the entered email")
    }
    const validatePassword = await bcrypt.compare(password,user.password)
    if(!validatePassword){
      throw new NotFoundException("Wrong Password")
    }
    return{
      token: this.jwtservice.sign({email})
    }
  }





  async register(registerData: RegisterUserDto) {
    const user = await this.dataservice.user.findFirst({
      where:{
        email: registerData.email
      }
    })
    if(user){
      throw new BadGatewayException('User with this already exists')
    }
    registerData.password = await bcrypt.hash(registerData.password, 10)
    const res = await this.dataservice.user.create({data: registerData})
    return 'This action adds a new auth';
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
