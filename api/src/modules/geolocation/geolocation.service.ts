import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import {
  Client as ClientType,
  GeocodeRequest,
} from '@googlemaps/google-maps-services-js/dist/client';
import {
  AddressComponent,
  AddressType,
  GeocodeResult,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js/dist/common';
import { get, set } from 'lodash';
import { GeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/geocode';
import * as config from 'config';
import { LocationData } from 'modules/import-data/sourcing-records/import.service';

@Injectable()
export class GeolocationService {
  private logger: Logger = new Logger(GeolocationService.name);
  private readonly client: ClientType;
  constructor() {
    this.client = new Client({});
  }

  public async geocode(
    locationData: LocationData,
  ): Promise<GeocodeResponseData> {
    const geocodeRequest: GeocodeRequest = {
      params: {
        address:
          locationData.locationAddressInput ||
          `country ${locationData.locationCountryInput}`,
        key: config.get('geolocation.gmapsApiKey'),
      },
    };

    // Otherwise add country as separate constraint
    if (
      locationData.locationAddressInput &&
      locationData.locationCountryInput
    ) {
      set(
        geocodeRequest,
        ['params', 'components', 'country'],
        locationData.locationCountryInput,
      );
    }

    const res = await this.client.geocode(geocodeRequest);
    if (!res.data) {
      throw new UnprocessableEntityException(
        "Google maps API doesn't work. Please, make sure," +
          ' that process.env.GEOCODER_KEY is correct and added to environment variables',
      );
    }
    return res.data;
  }
}
