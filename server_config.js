'use strict'

const server_variables = {
    width: 0
}

exports.server_events = {
    width_changed: {
        emitter: 'width_value',
        callback: {
            args: ['width'],
            _: (val) => {
                server_variables.width += val;
                if(server_variables.width > 100)
                    server_variables.width = 0;

                return server_variables.width;
            }
        }
    }

    /*disconnected: {
        emitter: 'width_value',
        callback: {
            args: ['width'],
            _: (val) => {
                server_variables.width += val;
                if(server_variables.width > 100)
                    server_variables.width = 0;

                return server_variables.width;
            }
        }
    }*/
}