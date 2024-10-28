import { FilesEventTarget } from './filesEventTarget';

export interface UploadFileEvent extends Event {
  target: FilesEventTarget | null;
}
