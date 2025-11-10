export class LocationEntryDto {
  cityName: string;
  countryName: string;
  count: number;
}

export class GetLocationListResponseDto {
  locations: LocationEntryDto[];
}
