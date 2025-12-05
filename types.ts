export interface GeneratedTitle {
  id: number;
  text: string;
}

export enum AppStep {
  INPUT_TOPIC = 'INPUT_TOPIC',
  SELECT_TITLE = 'SELECT_TITLE',
  CREATE_THUMBNAIL = 'CREATE_THUMBNAIL',
  RESULT = 'RESULT'
}

export interface ThumbnailRequest {
  title: string;
  userImageBase64: string;
}
