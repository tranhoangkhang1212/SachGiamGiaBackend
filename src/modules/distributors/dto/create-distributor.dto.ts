import { IsNotEmpty } from 'class-validator';

export class CreateDistributorDto {
  @IsNotEmpty()
  name: string;
}
