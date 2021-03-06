type handler = (media: CanvasImageSource) => void;
type mediaData = { media: CanvasImageSource, loaded: boolean };

const IMAGE_FORMATS = ['jpg', 'png'];
const VIDEO_FORMATS = ['mp4', 'webm'];

const _loadedMedia: { [source: string]: mediaData } = {};
const _loadListeners: { [source: string]: handler[] } = {};

const _loadImage = (source: string) => {
  const image = new Image();
  image.src = source;

  _loadListeners[source] = [];

  image.addEventListener('load', () => {
    _loadedMedia[source] = { loaded: true, media: image };

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
    _loadedMedia[source] = { loaded: true, media: video };

    _loadListeners[source].forEach(handler => {
      handler(video);
    });

    delete _loadListeners[source];
  }, false);
}

const _loadFromCache = (source: string): Promise<CanvasImageSource> => {
  return new Promise(resolve => {
    resolve(_loadedMedia[source].media);
  });
}

const _loadBySource = (source: string): Promise<CanvasImageSource> => {
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
  if (isVideo) {
    _loadVideo(source);
    return new Promise(resolve => {
      _loadListeners[source].push((media: CanvasImageSource) => {
        resolve(media);
      });
    });
  }

  throw new Error('MediaLoader._loadBySource(): Unknown media type!');
}

export class MediaLoader {
  static load = (source: string): Promise<CanvasImageSource> => {
    return _loadBySource(source);
  }
}