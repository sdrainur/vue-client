// import freeice from "freeice";
//
// export let peerConnection = null;
// export let remotePeerConnection;
// export let localMediaStream = null;
// export const myMediaElement = null;
// export const remoteMediaElement = null;
//
// export async function createNewPeer(socket, createOffer, senderId, openedUserId) {
//     if (peerConnection === null) {
//         peerConnection = new RTCPeerConnection({
//             iceServers: freeice()
//         })
//         peerConnection.onicecandidate = event => {
//             if (event.candidate) {
//                 socket.emit('relay_ice', {
//                     to: openedUserId,
//                     from: senderId,
//                     ice: event.candidate
//                 })
//             }
//         }
//
//         // let tracks = 0;
//         peerConnection.ontrack = ({streams: [remoteStream]}) => {
//             // tracks++;
//             // if (tracks === 2) {
//             // tracks = 0;
//             const video = document.getElementById('remoteVideo');
//             video.srcObject = remoteStream;
//             video.onloadedmetadata = () => {
//                 video.play();
//             };
//             // }
//         }
//         localMediaStream.getTracks().forEach(track => {
//             peerConnection.addTrack(track)
//         })
//     }
//
//     if (createOffer) {
//         const offer = await peerConnection.createOffer();
//
//         await peerConnection.setLocalDescription(offer);
//
//         socket.emit('relay_sdp', {
//             to: openedUserId,
//             from: senderId,
//             sdp: offer
//         })
//     }
// }
//
// export async function createCall() {
//     localMediaStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true
//     })
//     const video = document.getElementById('video');
//     video.srcObject = localMediaStream;
//     video.onloadedmetadata = () => {
//         video.play();
//     };
// }
//
// export async function setRemoteMedia(socket, remoteDescription, senderId, openedUserId) {
//
//     await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(remoteDescription)
//     );
//
//     if (remoteDescription.type === 'offer') {
//         const answer = await peerConnection.createAnswer();
//
//         await peerConnection.setLocalDescription(answer);
//
//         socket.emit('relay_sdp', {
//             to: openedUserId,
//             from: senderId,
//             sdp: answer
//         })
//     }
// }
//
// // export function listenRtcSocket(socket, senderId, openedUserId) {
// //     socket.on('session_description', ({data}) => {
// //         createCall().then(() =>
// //             createOffer(socket, false, senderId, openedUserId).then(() =>
// //
// //                 setRemoteMedia(socket, data, senderId, openedUserId)
// //             )
// //         )
// //     })
// //     socket.on('ice_candidate', ({iceCandidate}) => {
// //         peerConnection.addIceCandidate(
// //             new RTCIceCandidate(iceCandidate)
// //         )
// //     })
// //     // socket.on('session_description', (data)=>{
// //     //     console.log(data)
// //     // })
// //     // socket.on('ice_candidate', (data)=>{
// //     //     console.log(data)
// //     // })
// // }


import freeice from "freeice";

export let peerConnection;
export let localMediaStream;
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
        // await setLocalMediaStream()
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