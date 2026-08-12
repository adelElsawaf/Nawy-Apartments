/**
 * Multipart upload expects a single form field named "file".
 * The binary file is read via @UploadedFile(), not @Body().
 */
export class UploadRequestDto {
  file: Express.Multer.File;
}
