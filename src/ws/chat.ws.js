import {io} from "socket.io-client";

export const createSocket = (userId, token) => io("http://localhost:4000/", {
    transportOptions: {
        polling: {
            extraHeaders: {
                'Authorization': 'Bearer ' + token
            }
        }
    },
    query: {
        userId: userId
    }
})

export const sendMessage = (socket, from, to, uuid, messageText) => {
    socket.emit('chat', {
        data: {
            uuid: uuid,
            text: messageText,
        },
        to: to,
        from: from
    })
}

export const sendFile = (socket, from, to, uuid, file) => {
    socket.emit('file', {
        data: {
            uuid: uuid,
            file: file,
        },
        to: to,
        from: from
    })
}


export const joinSocket = (socket, userId) => {
    socket.emit('join', {
        userId: userId
    })
}

export const sendPeerInvite = (socket, data) => {
    console.log(data)
    socket.emit('peerInvite', data)
}