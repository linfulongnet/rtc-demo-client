/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Login = $root.Login = (() => {

    /**
     * Namespace Login.
     * @exports Login
     * @namespace
     */
    const Login = {};

    /**
     * LoginWay enum.
     * @name Login.LoginWay
     * @enum {string}
     * @property {number} None=0 None value
     * @property {number} Session=16 Session value
     * @property {number} Password=32 Password value
     */
    Login.LoginWay = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[16] = "Session"] = 16;
        values[valuesById[32] = "Password"] = 32;
        return values;
    })();

    Login.Request = (function() {

        /**
         * Properties of a Request.
         * @memberof Login
         * @interface IRequest
         * @property {string|null} [userName] Request userName
         * @property {string|null} [password] Request password
         * @property {Login.LoginWay|null} [loginWay] Request loginWay
         */

        /**
         * Constructs a new Request.
         * @memberof Login
         * @classdesc Represents a Request.
         * @implements IRequest
         * @constructor
         * @param {Login.IRequest=} [properties] Properties to set
         */
        function Request(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Request userName.
         * @member {string} userName
         * @memberof Login.Request
         * @instance
         */
        Request.prototype.userName = "";

        /**
         * Request password.
         * @member {string} password
         * @memberof Login.Request
         * @instance
         */
        Request.prototype.password = "";

        /**
         * Request loginWay.
         * @member {Login.LoginWay} loginWay
         * @memberof Login.Request
         * @instance
         */
        Request.prototype.loginWay = 0;

        /**
         * Creates a new Request instance using the specified properties.
         * @function create
         * @memberof Login.Request
         * @static
         * @param {Login.IRequest=} [properties] Properties to set
         * @returns {Login.Request} Request instance
         */
        Request.create = function create(properties) {
            return new Request(properties);
        };

        /**
         * Encodes the specified Request message. Does not implicitly {@link Login.Request.verify|verify} messages.
         * @function encode
         * @memberof Login.Request
         * @static
         * @param {Login.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userName != null && message.hasOwnProperty("userName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.userName);
            if (message.password != null && message.hasOwnProperty("password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            if (message.loginWay != null && message.hasOwnProperty("loginWay"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.loginWay);
            return writer;
        };

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link Login.Request.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Login.Request
         * @static
         * @param {Login.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @function decode
         * @memberof Login.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Login.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Login.Request();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userName = reader.string();
                    break;
                case 2:
                    message.password = reader.string();
                    break;
                case 3:
                    message.loginWay = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Login.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Login.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Request message.
         * @function verify
         * @memberof Login.Request
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Request.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userName != null && message.hasOwnProperty("userName"))
                if (!$util.isString(message.userName))
                    return "userName: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            if (message.loginWay != null && message.hasOwnProperty("loginWay"))
                switch (message.loginWay) {
                default:
                    return "loginWay: enum value expected";
                case 0:
                case 16:
                case 32:
                    break;
                }
            return null;
        };

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Login.Request
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Login.Request} Request
         */
        Request.fromObject = function fromObject(object) {
            if (object instanceof $root.Login.Request)
                return object;
            let message = new $root.Login.Request();
            if (object.userName != null)
                message.userName = String(object.userName);
            if (object.password != null)
                message.password = String(object.password);
            switch (object.loginWay) {
            case "None":
            case 0:
                message.loginWay = 0;
                break;
            case "Session":
            case 16:
                message.loginWay = 16;
                break;
            case "Password":
            case 32:
                message.loginWay = 32;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Login.Request
         * @static
         * @param {Login.Request} message Request
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Request.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.userName = "";
                object.password = "";
                object.loginWay = options.enums === String ? "None" : 0;
            }
            if (message.userName != null && message.hasOwnProperty("userName"))
                object.userName = message.userName;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            if (message.loginWay != null && message.hasOwnProperty("loginWay"))
                object.loginWay = options.enums === String ? $root.Login.LoginWay[message.loginWay] : message.loginWay;
            return object;
        };

        /**
         * Converts this Request to JSON.
         * @function toJSON
         * @memberof Login.Request
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Request.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Request;
    })();

    /**
     * ResCodes enum.
     * @name Login.ResCodes
     * @enum {string}
     * @property {number} None=0 None value
     * @property {number} Success=16 Success value
     * @property {number} NotUser=32 NotUser value
     * @property {number} SessionExpiration=48 SessionExpiration value
     * @property {number} DataError=64 DataError value
     * @property {number} DbError=80 DbError value
     * @property {number} Unknown=96 Unknown value
     */
    Login.ResCodes = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[16] = "Success"] = 16;
        values[valuesById[32] = "NotUser"] = 32;
        values[valuesById[48] = "SessionExpiration"] = 48;
        values[valuesById[64] = "DataError"] = 64;
        values[valuesById[80] = "DbError"] = 80;
        values[valuesById[96] = "Unknown"] = 96;
        return values;
    })();

    Login.Response = (function() {

        /**
         * Properties of a Response.
         * @memberof Login
         * @interface IResponse
         * @property {string|null} [sid] Response sid
         * @property {Login.ResCodes|null} [code] Response code
         * @property {string|null} [info] Response info
         */

        /**
         * Constructs a new Response.
         * @memberof Login
         * @classdesc Represents a Response.
         * @implements IResponse
         * @constructor
         * @param {Login.IResponse=} [properties] Properties to set
         */
        function Response(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Response sid.
         * @member {string} sid
         * @memberof Login.Response
         * @instance
         */
        Response.prototype.sid = "";

        /**
         * Response code.
         * @member {Login.ResCodes} code
         * @memberof Login.Response
         * @instance
         */
        Response.prototype.code = 0;

        /**
         * Response info.
         * @member {string} info
         * @memberof Login.Response
         * @instance
         */
        Response.prototype.info = "";

        /**
         * Creates a new Response instance using the specified properties.
         * @function create
         * @memberof Login.Response
         * @static
         * @param {Login.IResponse=} [properties] Properties to set
         * @returns {Login.Response} Response instance
         */
        Response.create = function create(properties) {
            return new Response(properties);
        };

        /**
         * Encodes the specified Response message. Does not implicitly {@link Login.Response.verify|verify} messages.
         * @function encode
         * @memberof Login.Response
         * @static
         * @param {Login.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sid != null && message.hasOwnProperty("sid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sid);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.code);
            if (message.info != null && message.hasOwnProperty("info"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.info);
            return writer;
        };

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link Login.Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Login.Response
         * @static
         * @param {Login.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @function decode
         * @memberof Login.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Login.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Login.Response();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.code = reader.int32();
                    break;
                case 3:
                    message.info = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Login.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Login.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Response message.
         * @function verify
         * @memberof Login.Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sid != null && message.hasOwnProperty("sid"))
                if (!$util.isString(message.sid))
                    return "sid: string expected";
            if (message.code != null && message.hasOwnProperty("code"))
                switch (message.code) {
                default:
                    return "code: enum value expected";
                case 0:
                case 16:
                case 32:
                case 48:
                case 64:
                case 80:
                case 96:
                    break;
                }
            if (message.info != null && message.hasOwnProperty("info"))
                if (!$util.isString(message.info))
                    return "info: string expected";
            return null;
        };

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Login.Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Login.Response} Response
         */
        Response.fromObject = function fromObject(object) {
            if (object instanceof $root.Login.Response)
                return object;
            let message = new $root.Login.Response();
            if (object.sid != null)
                message.sid = String(object.sid);
            switch (object.code) {
            case "None":
            case 0:
                message.code = 0;
                break;
            case "Success":
            case 16:
                message.code = 16;
                break;
            case "NotUser":
            case 32:
                message.code = 32;
                break;
            case "SessionExpiration":
            case 48:
                message.code = 48;
                break;
            case "DataError":
            case 64:
                message.code = 64;
                break;
            case "DbError":
            case 80:
                message.code = 80;
                break;
            case "Unknown":
            case 96:
                message.code = 96;
                break;
            }
            if (object.info != null)
                message.info = String(object.info);
            return message;
        };

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Login.Response
         * @static
         * @param {Login.Response} message Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sid = "";
                object.code = options.enums === String ? "None" : 0;
                object.info = "";
            }
            if (message.sid != null && message.hasOwnProperty("sid"))
                object.sid = message.sid;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = options.enums === String ? $root.Login.ResCodes[message.code] : message.code;
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = message.info;
            return object;
        };

        /**
         * Converts this Response to JSON.
         * @function toJSON
         * @memberof Login.Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Response;
    })();

    return Login;
})();

export const Transfer = $root.Transfer = (() => {

    /**
     * Namespace Transfer.
     * @exports Transfer
     * @namespace
     */
    const Transfer = {};

    /**
     * Query enum.
     * @name Transfer.Query
     * @enum {string}
     * @property {number} None=0 None value
     * @property {number} Login=1 Login value
     */
    Transfer.Query = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[1] = "Login"] = 1;
        return values;
    })();

    /**
     * RpcCodes enum.
     * @name Transfer.RpcCodes
     * @enum {string}
     * @property {number} None=0 None value
     */
    Transfer.RpcCodes = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        return values;
    })();

    Transfer.Rpc = (function() {

        /**
         * Properties of a Rpc.
         * @memberof Transfer
         * @interface IRpc
         * @property {string|null} [sid] Rpc sid
         * @property {number|null} [qid] Rpc qid
         * @property {number|null} [num] Rpc num
         * @property {Transfer.Query|null} [cmd] Rpc cmd
         * @property {Uint8Array|null} [data] Rpc data
         * @property {Transfer.RpcCodes|null} [code] Rpc code
         * @property {string|null} [info] Rpc info
         */

        /**
         * Constructs a new Rpc.
         * @memberof Transfer
         * @classdesc Represents a Rpc.
         * @implements IRpc
         * @constructor
         * @param {Transfer.IRpc=} [properties] Properties to set
         */
        function Rpc(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Rpc sid.
         * @member {string} sid
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.sid = "";

        /**
         * Rpc qid.
         * @member {number} qid
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.qid = 0;

        /**
         * Rpc num.
         * @member {number} num
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.num = 0;

        /**
         * Rpc cmd.
         * @member {Transfer.Query} cmd
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.cmd = 0;

        /**
         * Rpc data.
         * @member {Uint8Array} data
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.data = $util.newBuffer([]);

        /**
         * Rpc code.
         * @member {Transfer.RpcCodes} code
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.code = 0;

        /**
         * Rpc info.
         * @member {string} info
         * @memberof Transfer.Rpc
         * @instance
         */
        Rpc.prototype.info = "";

        /**
         * Creates a new Rpc instance using the specified properties.
         * @function create
         * @memberof Transfer.Rpc
         * @static
         * @param {Transfer.IRpc=} [properties] Properties to set
         * @returns {Transfer.Rpc} Rpc instance
         */
        Rpc.create = function create(properties) {
            return new Rpc(properties);
        };

        /**
         * Encodes the specified Rpc message. Does not implicitly {@link Transfer.Rpc.verify|verify} messages.
         * @function encode
         * @memberof Transfer.Rpc
         * @static
         * @param {Transfer.IRpc} message Rpc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Rpc.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sid != null && message.hasOwnProperty("sid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sid);
            if (message.qid != null && message.hasOwnProperty("qid"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.qid);
            if (message.num != null && message.hasOwnProperty("num"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.num);
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.cmd);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.data);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.code);
            if (message.info != null && message.hasOwnProperty("info"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.info);
            return writer;
        };

        /**
         * Encodes the specified Rpc message, length delimited. Does not implicitly {@link Transfer.Rpc.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Transfer.Rpc
         * @static
         * @param {Transfer.IRpc} message Rpc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Rpc.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Rpc message from the specified reader or buffer.
         * @function decode
         * @memberof Transfer.Rpc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Transfer.Rpc} Rpc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Rpc.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Transfer.Rpc();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.qid = reader.int32();
                    break;
                case 3:
                    message.num = reader.int32();
                    break;
                case 4:
                    message.cmd = reader.int32();
                    break;
                case 5:
                    message.data = reader.bytes();
                    break;
                case 6:
                    message.code = reader.int32();
                    break;
                case 7:
                    message.info = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Rpc message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Transfer.Rpc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Transfer.Rpc} Rpc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Rpc.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Rpc message.
         * @function verify
         * @memberof Transfer.Rpc
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Rpc.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sid != null && message.hasOwnProperty("sid"))
                if (!$util.isString(message.sid))
                    return "sid: string expected";
            if (message.qid != null && message.hasOwnProperty("qid"))
                if (!$util.isInteger(message.qid))
                    return "qid: integer expected";
            if (message.num != null && message.hasOwnProperty("num"))
                if (!$util.isInteger(message.num))
                    return "num: integer expected";
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                switch (message.cmd) {
                default:
                    return "cmd: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            if (message.code != null && message.hasOwnProperty("code"))
                switch (message.code) {
                default:
                    return "code: enum value expected";
                case 0:
                    break;
                }
            if (message.info != null && message.hasOwnProperty("info"))
                if (!$util.isString(message.info))
                    return "info: string expected";
            return null;
        };

        /**
         * Creates a Rpc message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Transfer.Rpc
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Transfer.Rpc} Rpc
         */
        Rpc.fromObject = function fromObject(object) {
            if (object instanceof $root.Transfer.Rpc)
                return object;
            let message = new $root.Transfer.Rpc();
            if (object.sid != null)
                message.sid = String(object.sid);
            if (object.qid != null)
                message.qid = object.qid | 0;
            if (object.num != null)
                message.num = object.num | 0;
            switch (object.cmd) {
            case "None":
            case 0:
                message.cmd = 0;
                break;
            case "Login":
            case 1:
                message.cmd = 1;
                break;
            }
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            switch (object.code) {
            case "None":
            case 0:
                message.code = 0;
                break;
            }
            if (object.info != null)
                message.info = String(object.info);
            return message;
        };

        /**
         * Creates a plain object from a Rpc message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Transfer.Rpc
         * @static
         * @param {Transfer.Rpc} message Rpc
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Rpc.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sid = "";
                object.qid = 0;
                object.num = 0;
                object.cmd = options.enums === String ? "None" : 0;
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
                object.code = options.enums === String ? "None" : 0;
                object.info = "";
            }
            if (message.sid != null && message.hasOwnProperty("sid"))
                object.sid = message.sid;
            if (message.qid != null && message.hasOwnProperty("qid"))
                object.qid = message.qid;
            if (message.num != null && message.hasOwnProperty("num"))
                object.num = message.num;
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                object.cmd = options.enums === String ? $root.Transfer.Query[message.cmd] : message.cmd;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = options.enums === String ? $root.Transfer.RpcCodes[message.code] : message.code;
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = message.info;
            return object;
        };

        /**
         * Converts this Rpc to JSON.
         * @function toJSON
         * @memberof Transfer.Rpc
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Rpc.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Rpc;
    })();

    return Transfer;
})();

export { $root as default };
