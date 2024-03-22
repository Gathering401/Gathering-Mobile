export const loggedInHome = {
    upcoming: [
        {
            "__typename": "Event",
            "description": "We eatin gooooooood tonight!",
            "eventDate": "2024-03-23T20:00:00.000Z",
            "eventId": 45,
            "eventName": "Pizza Night!!!",
            "groupId": 1,
            "groupName": "Jon and Tanya Struves",
            "price": 20
        },
        {
            "__typename": "Event",
            "description": "We eatin gooooooood tonight!",
            "eventDate": "2024-03-30T20:00:00.000Z",
            "eventId": 46,
            "eventName": "Pizza Night!!!",
            "groupId": 1,
            "groupName": "Jon and Tanya Struves",
            "price": 20
        },
        {
            "__typename": "Event",
            "description": "Please",
            "eventDate": "2024-03-25T19:15:30.907Z",
            "eventId": 5270,
            "eventName": "Does It Work",
            "groupId": 1,
            "groupName": "Jon and Tanya Struves",
            "price": 0
        }
    ],
    groups: [
        {
            "__typename": "Group",
            "description": "The family of Jon, Tanya and Lukas Struve, along with their animals Nim, Ash and Honey.",
            "groupId": 1,
            "groupName": "Jon and Tanya Struves"
        }
    ]
}

export const group = {
    group: {
        "__typename": "Group",
        "currentUser": {
            "__typename": "GroupUser",
            "role": "owner"
        },
        "description": "The family of Jon, Tanya and Lukas Struve, along with their animals Nim, Ash and Honey.",
        "groupName": "Jon and Tanya Struves",
        "groupUsers": [
            {
                "__typename": "GroupUser",
                "firstName": "Jon",
                "lastName": "Struve",
                "username": "jstruve"
            }
        ],
        "inviteOnly": true,
        "joinRequests": [],
        "location": "ChIJewcs00725IcRbJR2L1vMmkA",
        "owner": {
            "__typename": "GroupUser",
            "firstName": "Jon",
            "lastName": "Struve",
            "username": "jstruve"
        },
        "upcoming": [
            {
                "__typename": "Event",
                "description": "Please",
                "eventDate": "1711394130907",
                "eventId": null,
                "eventName": "Does It Work",
                "groupName": null,
                "price": 0
            },
            {
                "__typename": "Event",
                "description": "We eatin gooooooood tonight!",
                "eventDate": "1711224000000",
                "eventId": null,
                "eventName": "Pizza Night!!!",
                "groupName": null,
                "price": 20
            }
        ]
    }
}