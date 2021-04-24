const toggleAudio = (value) => {
    streamObj.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };
  const toggleVideo = (value) => {
    streamObj.getVideoTracks()[0].enabled = value;
    setIsVideo(value);
  };
  function localDescCreated(desc) {
    pc.setLocalDescription(
      desc,
      () => sendMessage({'sdp': pc.localDescription}),
      onError
    );
}

let isAudio = true
function muteAudio() {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enabled = isAudio
}

let isVideo = true
function muteVideo() {
    isVideo = !isVideo
    localStream.getVideoTracks()[0].enabled = isVideo
}
function screenShare () {
  navigator.mediaDevices
    .getDisplayMedia({ cursor: true })
    .then((screenStream) => {
      peer.replaceTrack(
        streamObj.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        streamObj
      );
      setScreenCastStream(screenStream);
      screenStream.getTracks()[0].onended = () => {
        peer.replaceTrack(
          screenStream.getVideoTracks()[0],
          streamObj.getVideoTracks()[0],
          streamObj
        );
      };
      setIsPresenting(true);
    });
};

function stopScreenShare () {
  screenCastStream.getVideoTracks().forEach(function (track) {
    track.stop();
  });
  peer.replaceTrack(
    screenCastStream.getVideoTracks()[0],
    streamObj.getVideoTracks()[0],
    streamObj
  );
  setIsPresenting(false);
};

function disconnectCall () {
  room.destroy();
  history.push("/index.html");
  pc.location.reload();
};