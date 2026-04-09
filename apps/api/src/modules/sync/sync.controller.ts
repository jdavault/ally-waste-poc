import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncBatchDto } from './dto/sync-batch.dto';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('mobile-actions')
  @ApiOperation({ summary: 'Process a batch of offline mobile actions' })
  processBatch(@Body() dto: SyncBatchDto) {
    return this.syncService.processBatch(dto);
  }
}
