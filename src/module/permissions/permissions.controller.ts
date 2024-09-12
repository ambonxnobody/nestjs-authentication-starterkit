import { Controller, Get, Post, Body, Param, Delete, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { BaseResponse } from '../../helper';
import { LocalPermissionGuard } from '../auth/local-permission.guard';
import { Permissions } from '../../decorator/permissions.decorator';

@Controller('api/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:permissions'], 'all')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @Res() res: Response) {
    this.permissionsService.create(createPermissionDto).then(() => {
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
  @Permissions(['read:permissions'], 'all')
  @Get()
  findAll(@Res() res: Response) {
    this.permissionsService.findAll().then((result) => {
      if (!result || result.length === 0) {
        return res.status(404).json(BaseResponse.notFoundResponse());
      }

      return res.json(BaseResponse.encodeData(result, 200));
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['read:permissions'], 'all')
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    this.permissionsService.findOne(id).then((result) => {
      if (!result) {
        return res.status(404).json(BaseResponse.notFoundResponse());
      }

      return res.json(BaseResponse.encodeData({ ...(result) }, 200));
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }

  @UseGuards(LocalPermissionGuard)
  @Permissions(['write:permissions'], 'all')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @Res() res: Response) {
    const permission = await this.permissionsService.findOne(id);
    if (!permission) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.permissionsService.update(id, updatePermissionDto).then(() => {
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
  @Permissions(['delete:permissions'], 'all')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const permission = await this.permissionsService.findOne(id);
    if (!permission) {
      return res.status(404).json(BaseResponse.notFoundResponse());
    }

    this.permissionsService.remove(id).then(() => {
      return res.status(204).json(BaseResponse.updatedOrDeleteResponse());
    }).catch((error) => {
      return res.status(500).json(BaseResponse.internalServerErrorResponse(error));
    });
  }
}
