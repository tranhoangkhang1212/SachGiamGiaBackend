import { IsNotEmpty } from 'class-validator';

export class DeleteResourceDto {
  @IsNotEmpty()
  id: string;
}
