var app = new Vue({
    el: '#app',
    data: {
        show: true,
        weapon: "Pistola - 500 balas",
        playerJob: "Mecánico - Empleado",
        playerMoney: [3, 2, 1, 2500],
        weapon: null,
        playerId: 1,
        hour: "19:00",
        date: "18/08/2023",
        pfa: 1,
        players: 50,
        serverStats: false,
        maxPlayers: 128,
        // mhz: 1,
        notifications: []  // Array para almacenar las notificaciones
    }, 
    filters: {
        formatNumber(value) {
            if (typeof value !== 'number') {
                return value;
            }
            
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    },
    mounted() {
        const self = this;

        const notifications = {}
        var notificationId = 0


        window.addEventListener('message', (event) => {
            const data = event.data;

            if (data.action) {
                switch (data.action) {
                    case 'show':
                        self.show = data.show;
                        break;

                    case 'serverStats':
                        self.serverStats = data.show;
                        self.pfa = data.pfa;
                        self.players = data.players;
                        self.maxPlayers = data.maxPlayers;
                        break;

                    case 'update':
                        if (data.job)
                            self.playerJob = data.job;

                        if (data.hour)
                            self.hour = data.hour;

                        if (data.date)
                            self.date = data.date;

                        if (data.playerId)
                            self.playerId = data.playerId;

                        if (data.accounts) {
                            self.playerMoney = data.accounts;
                        }

                        if (data.weapon){
                            self.weapon = data.weapon + " - " + data.ammo + " balas";
                        } else {
                            self.weapon = null;
                        }

                        if (data.vehicle) {
                            $('.needs').animate({bottom: '70px'});
                        } else {
                            $('.needs').animate({bottom: '20px'});
                        }

                        self.mhz = data.mhz;

                        case 'sendNotification':
                            if (event.data && event.data.data) {
                                showNotification(event.data.data);
                            }
                        
                    default:
                        break;
                }
            }
        });
    }
});

function showNotification(data) {
    var type = data.type != null ? data.type : 'normal';
    switch (type.toUpperCase()) {
        case 'CUSTOM-ID':
            var id = data.id != null ? data.id : null;
            if (id == null) { createNotification(data); return }

            if (notifications[id] != null || notifications[id] != undefined) { updateNotification(data); return }

            // Check if div with notification-id exists
            var exist = $(`#notification-${id}`);
            if (exist && !notifications[id]) {
                // Delete and fade out
                $.when(exist.fadeOut()).done(function () {
                    exist.remove();
                });
            }

            break
        case 'PERSISTENT':
            var persistentType = data.action.toUpperCase();
            switch (persistentType) {
                case 'START':
                    if (!data.id) { return }
                    if (notifications[data.id]) { return }
                    createNotification(data);

                    break
                case 'END':
                    if (!data.id) { return }
                    if (!notifications[data.id]) { return }

                    var $notification = $(notifications[data.id].notification);
                    $.when($notification.fadeOut()).done(function () {
                        $notification.remove();
                        delete notifications[data.id];
                    });
                    break
                default:
                    break
            }
            break
        case 'NORMAL':
            createNotification(data);
            break
        default:
            break
    }
}

const notifications = {}
var notificationId = 0
function createNotification(data) {
    var type = data.data.type != null ? data.data.type : 'info';
    var notificationContainer = $('.notifications-container');
    var isPersistent = {
        pulse: data.action ? `pulse pulse-${type}` : '',
        ring: data.action ? `<span class='pulse-ring'></span>` : '<div class="progress-bar"  data-percent="0"></div>',
        persistent: data.action ? true : false
    }

    // Check if data.id != null if not then create a new id
    var Id = data.id != null ? data.id : (!notificationId ? notificationId = 1 : notificationId = notificationId + 1);

    let alert = `
    <div class="notification" id="notification-${Id}">
        <div class="dot ${type} ${isPersistent.pulse}">
            ${isPersistent.ring}
        </div>
        <span id="text-${Id}">${data.data.message}</span>
    </div>
  `;

    // Check if persisents if its append to the top of the container if not then append to the bottom
    if (isPersistent.persistent) {
        notificationContainer.prepend(alert);
    } else {
        notificationContainer.append(alert);
    }

    if (!notifications) notifications = {};

    var notification = $(`#notification-${Id}`);
    let progressBar = document.querySelector(`#notification-${Id} .dot .progress-bar`);

    notifications[Id] = {
        notification: notification
    };

    if (!isPersistent.persistent) {
        let root = document.querySelector(':root');
        let styles = getComputedStyle(root);

        $(progressBar).easyPieChart({
            size: 20,
            barColor: `${styles.getPropertyValue(`--progress-bar-${type}`)}`,
            lineWidth: 1.5,
            animate: 2000,
            rotate: 0,
            trackColor: false,
            scaleColor: false,
        });

        // Every 1 millisecond, using data.lenght update the progress bar until hit 0%
        var lenght = data.data.lenght != null ? data.data.lenght : 2500;
        var progress = 0;
        var interval = setInterval(function () {
            progress++;
            $(progressBar).data('easyPieChart').update(progress);
            if (progress >= 100) { clearInterval(interval); removeNotification(notification, Id); }
        }, lenght / 100);
    }

    anime({
        targets: notification,
        translateY: [-10, 0],
        delay: 0,
    });

    return $(`#notification-${Id}`);
}

// Create an local function
function removeNotification(notification, Id) {
    // Remove notification from the DOM
    $.when(notification.fadeOut()).done(function () {
        notification.remove();
        delete notifications[Id];
    });
}

function updateNotification(data) {
    if (!data.id) return

    var notification = notifications[data.id].notification;
    var text = $(notification).find(`#text-${data.id}`);

    // Update text and respect formatting
    text.html(data.data.message);
}