import { Controller, Get, Body, Patch, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from '../../helper';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RolesService } from '../roles/roles.service';
import { LocalPermissionGuard } from '../auth/local-permission.guard';
import { Permissions } from '../../decorator/permissions.decorator';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService
  ) {}

  @UseGuards(LocalPermissionGuard)
  @Permissions(['read:users'], 'any')
  @Get()
  findAll(@Res() res: Response) {
    this.usersService.findAll().then((result) => {
      if (!result || result.length === 0) {
        return res.status(404).json(BaseResponse.notFoundResponse());
      }

      return res.json(BaseResponse.encodeData(result, 200));
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:users'], 'any')
  @Patch(':id/account-activation')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.usersService.accountActivation(id, updateUserDto).then(() => {
      return res.status(204).json(BaseResponse.updatedOrDeleteResponse());
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:users'], 'any')
  @Patch(':id/assign-role')
  async assignRole(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    const roleUsers = await this.rolesService.findByIds(assignRoleDto.roles);
    if (roleUsers.length !== assignRoleDto.roles.length) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.usersService.assignRole(id, assignRoleDto).then(() => {
      return res.status(204).json(BaseResponse.updatedOrDeleteResponse());
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }
}
