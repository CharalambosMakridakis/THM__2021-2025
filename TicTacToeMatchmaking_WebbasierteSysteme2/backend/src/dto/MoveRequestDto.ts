import { IsNumber, Max, Min } from 'class-validator';

export class MoveRequestDto {
    @IsNumber()
    @Min(0)
    @Max(8)
    index: number;
}