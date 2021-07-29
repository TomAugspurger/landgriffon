import { Module } from '@nestjs/common';
import { GeolocationService } from 'modules/geolocation/geolocation.service';

@Module({
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
