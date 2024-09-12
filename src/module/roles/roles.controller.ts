import { Controller, Get, Post, Body, Param, Delete, Res, Put, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BaseResponse } from '../../helper';
import { PermissionsService } from '../permissions/permissions.service';
import { LocalPermissionGuard } from '../auth/local-permission.guard';
import { Permissions } from '../../decorator/permissions.decorator';

@Controller('api/roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:roles'], 'any')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    this.rolesService.create(createRoleDto).then(() => {
      return res.status(201).json(BaseResponse.createdResponse());
    }).catch((error) => {
      if (error.code === '23505') {
        return res.status(409).json(BaseResponse.conflictResponse(['name already exists']));
      } else {
        return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
      }
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['read:roles'], 'any')
  @Get()
  findAll(@Res() res: Response) {
    this.rolesService.findAll().then((result) => {
      if (!result || result.length === 0) {
        return res.status(404).json(BaseResponse.notFoundResponse());
      }

      return res.json(BaseResponse.encodeData(result, 200));
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['read:roles'], 'any')
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    this.rolesService.findOne(id).then((result) => {
      if (!result) {
        return res.status(404).json(BaseResponse.notFoundResponse());
      }

      return res.json(BaseResponse.encodeData({ ...(result) }, 200));
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:roles'], 'any')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Res() res: Response) {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    const permissionRoles = await this.permissionsService.findByIds(updateRoleDto.permissions);
    if (permissionRoles.length !== updateRoleDto.permissions.length) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.rolesService.update(id, updateRoleDto).then(() => {
      return res.status(204).json(BaseResponse.updatedOrDeleteResponse());
    }).catch((error) => {
      if (error.code === '23505') {
        return res.status(409).json(BaseResponse.conflictResponse(['name already exists']));
      } else {
        return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
      }
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['delete:roles'], 'any')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.rolesService.remove(id).then(() => {
      return res.status(204).json(BaseResponse.updatedOrDeleteResponse());
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }
}
