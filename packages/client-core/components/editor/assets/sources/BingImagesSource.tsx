import ImageMediaSource from "../ImageMediaSource";
export default class BingImagesSource extends ImageMediaSource {
  id: string;
  name: string;
  searchLegalCopy: string;
  privacyPolicyUrl: string;
  constructor(api) {
    super(api);
    this.id = "bing_images";
    this.name = "Bing Images";
    this.searchLegalCopy = "Search by Bing";
    this.privacyPolicyUrl =
      "https://privacy.microsoft.com/en-us/privacystatement";
  }
}
