import { FileValidator } from '@nestjs/common';
import { IFileTypesValidatorOptions } from '../interfaces/validators.interface';

export class FileTypesValidator extends FileValidator<IFileTypesValidatorOptions> {
  constructor(
    protected readonly validationOptions: IFileTypesValidatorOptions,
  ) {
    super(validationOptions);
  }
  isValid(file?: Express.Multer.File): boolean {
    return this.validationOptions.acceptedTypes.includes(file.mimetype);
  }
  buildErrorMessage(file: any): string {
    return this.validationOptions.errorMessage;
  }
}
