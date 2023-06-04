import freeice from "freeice";

export let peerConnection;
export let localMediaStream;
export let remoteMediaStream;
export let socket;
export let loggedUserId;
export let openedUserId;

export const setLocalMediaStream = async () => {
    localMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
    const video = document.getElementById('video');
    video.srcObject = localMediaStream;
    video.onloadedmetadata = () => {
        video.play();
    };
    localMediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMediaStream)
    })
}

export const getVideoSize = () => {
    return{
        localVideo:{
            width: localMediaStream.getVideoTracks()[0].getSettings().width,
            height: localMediaStream.getVideoTracks()[0].getSettings().height
        },
        remoteVideo:{
            width: remoteMediaStream.getVideoTracks()[0].getSettings().width,
            height: remoteMediaStream.getVideoTracks()[0].getSettings().height
        }
    }
}

export const createPeer = async (_socket, _loggedUserId, _openedUserId) => {
    socket = _socket
    loggedUserId = _loggedUserId
    openedUserId = _openedUserId

    peerConnection = new RTCPeerConnection({
        iceServers: freeice()
    })

    peerConnection.onicecandidate = event => {
        console.log('ice candidate event')
        if (event.candidate) {
            socket.emit('relay_ice', {
                to: openedUserId,
                from: loggedUserId,
                ice: event.candidate
            })
        }
    }
    peerConnection.ontrack = ({streams: [remoteStream]}) => {
        const video = document.getElementById('remoteVideo');
        remoteMediaStream = remoteStream
        video.srcObject = remoteStream;
        video.onloadedmetadata = () => {
            video.play();
        }
    }
}

export const createOffer = async () => {
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    socket.emit('relay_sdp', {
        to: openedUserId,
        from: loggedUserId,
        sdp: offer
    })
}


export const setRemoteMedia = async (remoteDescription) => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
    );
    if (remoteDescription.type === 'offer') {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('relay_sdp', {
            to: openedUserId,
            from: loggedUserId,
            sdp: answer
        })
    }
}

export const listenRtcSocket = (socket) => {
    socket.on('session_description', async (data) => {
        console.log(data)
        await setRemoteMedia(data)
        console.log(peerConnection)
    })
    socket.on('ice_candidate', async (iceCandidate) => {
        console.log(peerConnection)
        await peerConnection.addIceCandidate(
            new RTCIceCandidate(iceCandidate)
        )
        console.log(peerConnection)
    })
}