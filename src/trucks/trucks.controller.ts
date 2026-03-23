import { Controller, Get } from '@nestjs/common';

@Controller('trucks')
export class TrucksController {
  @Get()
  getTrucks(): string {
    return 'Trucks';
  }
}
