'use strict'

// Server-side variables

const _ = {
    width: 0,
    //connections: []
}

// ----------- //

exports.server_events = {
    width_changed: {
        emitter: 'width_value',
        _: (val) => {
            _.width += val;
            if(_.width > 100)
                _.width = 0;
           
            return _.width;
        }
    },

    width_value: {
        emitOnInit: true,
        _: (val) => {
            return _.width;
        }
    }
}