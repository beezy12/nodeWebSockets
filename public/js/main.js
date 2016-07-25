;(function () {
    'use strict'

    const ws = io.connect()

    ws.on('connect', () => {
        console.log('socket connected')
    })


    ws.on('receiveChat', msgs => {
        msgs.forEach(displayChat)
    })
    ws.on('receiveChat', msg => {
        console.log('this is the msg object called "sendChat" that is submitted by the form inputs' , msg)
        displayChat(msg.name, msg.text)

    })

    // document.query selector - Returns the first element within the document that matches the specified group of selectors.
    const form = document.querySelector('form')
    const name = document.querySelector('input[name="name"]')
    const text = document.querySelector('input[name="text"]')
    const ul = document.querySelector('ul')

    form.addEventListener('submit', () => {
        const chat = {
            name: name.value,
            text: text.value
        }
        // now send this text over the socket on submit to the server or db
        // so we'll set up something in the server to listen
        // notice 'sendChat' matches the name in server.js listener
        ws.emit('sendChat', chat)
        displayChat(chat)
        text.value = ''
        event.preventDefault()
        })

        function displayChat (chat) {
            if (!document.querySelector(`[data-id="${chat._id}"]`)) {
                const li = generateLI(chat)

                ul.appendChild(li)
            }
        }

        function generateLI (chat) {
            const li = document.createElement('li')
            const textNode = document.createTextNode(`${chat.name}: ${chat.text}`)
            const dataId = document.createAttribute('data-id')

            dataId.value = chat._id

            li.setAttributeNode(dataId)
            li.appendChild(textNode)

            return li
        }

        // function getJSON(url, cb) {
        //     const request = new XMLHttpRequest()
        //     request.open('GET', url)

        //     request.onload = () => {
        //         cb(JSON.parse(request.responseText))
        //     }

        //     request.send()
        // }


        // document.addEventListener('DOMContentLoaded', () => {
        //     getJSON('/chats', chats => {
        //         chats.forEach(displayChat)
        //     })
        // })

}());



