import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isObjectIdHexString } from '../is-object-id-string';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!isObjectIdHexString(value)) {
      throw new BadRequestException(`"${value}" is not a valid id`);
    }
    return value;
  }
}
