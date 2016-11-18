angular.module('sound_overflow')
  .filter('trustUrl', function ($sce) {
    return function(audio_thumb_url) {
      return $sce.trustAsResourceUrl(audio_thumb_url);
    };
  });
