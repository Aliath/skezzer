const IMAGE_FORMATS = ['jpg', 'png'];
const VIDEO_FORMATS = ['mp4', 'webm'];

const _loadedMedia: { [source: string]: { media: CanvasImageSource, loaded: boolean } } = {};
const _loadListeners: { [source: string]: ((media: CanvasImageSource) => void)[] } = {};

const _loadImage = (source: string) => {
  const image = new Image();
  image.src = source;

  _loadListeners[source] = [];

  image.addEventListener('load', () => {
    _loadedMedia[source].loaded = true;

    _loadListeners[source].forEach(handler => {
      handler(image);
    });

    delete _loadListeners[source];
  }, false);
}

const _loadVideo = (source: string) => {
  const video = document.createElement('video');
  video.src = source;
  video.muted = true;
  video.autoplay = true;

  _loadListeners[source] = [];

  video.addEventListener('load', () => {
    _loadedMedia[source].loaded = true;

    _loadListeners[source].forEach(handler => {
      handler(video);
    });

    delete _loadListeners[source];
  }, false);
}

const _loadFromCache = (source: string) => {
  return new Promise(resolve => {
    resolve(_loadedMedia[source].media);
  });
}

const _loadBySource = (source: string) => {
  if (_loadedMedia.hasOwnProperty(source)) {
    if (_loadedMedia[source].loaded) return _loadFromCache(source);
    return new Promise(resolve => {
      _loadListeners[source].push((media: CanvasImageSource) => resolve(media));
    });
  }

  const isImage = IMAGE_FORMATS.some((imageFormat: string) => source.endsWith(`.${imageFormat}`));
  if (isImage) {
    _loadImage(source);
    return new Promise(resolve => {
      _loadListeners[source].push((media: CanvasImageSource) => {
        resolve(media);
      });
    });
  }

  const isVideo = VIDEO_FORMATS.some((videoFormat: string) => source.endsWith(`.${videoFormat}`));
  if (isVideo) return _loadVideo(source);

  throw new Error('MediaLoader._loadBySource(): Unknown media type!');
}

export class MediaLoader {
  static load = (source: string) => {
    return _loadBySource(source);
  }
}