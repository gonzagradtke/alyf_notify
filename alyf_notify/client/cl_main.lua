-- @vars
ESX = exports['es_extended']:getSharedObject()

function SendNotification(data)
    SendNUIMessage({
        action = 'sendNotification',
        data = {
            type = 'NORMAL',
            data = {
                message = data.message,
                lenght = data.lenght,
                type = data.type,
            },
        },
    })
end
exports('SendNotification', SendNotification)
exports('SendAlert', function (type, text, length)
    SendNotification({
        message = text,
        lenght = length,
        type = type,
    })
end)

function SendPersistentNotification(data)
    SendNUIMessage({
        action = 'sendNotification',
        data = {
            type = 'PERSISTENT',
            action = data.action,
            id = data.id,
            data = {
                message = data.message,
                lenght = data.lenght,
                type = data.type,
            },
        },
    })
end
exports('SendPersistentNotification', SendPersistentNotification)

function EditPersistentNotification(data)
    SendNUIMessage({
        action = 'sendNotification',
        data = {
            id = data.id,
            type = 'CUSTOM-ID',
            data = {
                message = data.message,
                lenght = data.lenght,
                type = data.type,
            },
        },
    })
end
exports('EditPersistentNotification', EditPersistentNotification)