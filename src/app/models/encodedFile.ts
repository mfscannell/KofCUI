export class EncodedFile {
  fileName: string = '';
  fileType: string = '';
  encoding: string = '';
  data: string = '';

  constructor(fields: {
    fileName: string,
    fileType: string,
    encoding: string,
    data: string
  }) {
    if (fields) {
      this.fileName = fields.fileName || this.fileName;
      this.fileType = fields.fileType || this.fileType;
      this.encoding = fields.encoding || this.encoding;
      this.data = fields.data || this.data;
    }
  }
}