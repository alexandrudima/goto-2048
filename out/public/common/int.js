(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    // -- Events sent by the client
    (function (ClientEventType) {
        ClientEventType[ClientEventType["Init"] = 0] = "Init";
        ClientEventType[ClientEventType["Reset"] = 1] = "Reset";
        ClientEventType[ClientEventType["Up"] = 2] = "Up";
        ClientEventType[ClientEventType["Down"] = 3] = "Down";
        ClientEventType[ClientEventType["Left"] = 4] = "Left";
        ClientEventType[ClientEventType["Right"] = 5] = "Right";
    })(exports.ClientEventType || (exports.ClientEventType = {}));
    var ClientEventType = exports.ClientEventType;
    // -- Events sent by the server
    (function (ServerEventType) {
        ServerEventType[ServerEventType["ModelChanged"] = 0] = "ModelChanged";
    })(exports.ServerEventType || (exports.ServerEventType = {}));
    var ServerEventType = exports.ServerEventType;
});
