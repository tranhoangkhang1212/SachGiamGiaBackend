export class BannerModel {
  constructor(url: string, fileName: string, show: boolean) {
    this.url = url;
    this.fileName = fileName;
    this.show = show;
  }
  url: string;
  fileName: string;
  show: boolean;
}
