fx_version   'cerulean'
use_fxv2_oal 'yes'
lua54        'yes'
game         'gta5'

author 'nicooo12'

client_scripts {
    'client/cl_main.lua'
}

ui_page 'client/ui/index.html'

files {
    'client/ui/index.html',
    'client/ui/leandro.css',
    'client/ui/random.css',
    'client/ui/style.css',
    'client/ui/jquery.easypiechart.js',
    'client/ui/script.js',
    'client/vendor/fonts/*.*'
}

exports {
	'sendNotification'
}

-- Diferents ( exports )
-- exports.alyf_notify:SendAlert('error/succes/inform', 'Has desactivado el noclip', 3500)
-- Todos ( error/succes/inform )
-- -- exports.alyf_notify:SendAlert('error', 'Has desactivado el noclip', 3500)
-- -- exports.alyf_notify:SendAlert('succes', 'Has desactivado el noclip', 3500)
-- -- exports.alyf_notify:SendAlert('inform', 'Has desactivado el noclip', 3500)