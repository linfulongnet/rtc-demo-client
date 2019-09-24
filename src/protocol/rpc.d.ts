import * as $protobuf from "protobufjs";
/** Namespace Login. */
export namespace Login {

    /** LoginWay enum. */
    enum LoginWay {
        None = 0,
        Session = 16,
        Password = 32
    }

    /** Properties of a Request. */
    interface IRequest {

        /** Request userName */
        userName?: (string|null);

        /** Request password */
        password?: (string|null);

        /** Request loginWay */
        loginWay?: (Login.LoginWay|null);
    }

    /** Represents a Request. */
    class Request implements IRequest {

        /**
         * Constructs a new Request.
         * @param [properties] Properties to set
         */
        constructor(properties?: Login.IRequest);

        /** Request userName. */
        public userName: string;

        /** Request password. */
        public password: string;

        /** Request loginWay. */
        public loginWay: Login.LoginWay;

        /**
         * Creates a new Request instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Request instance
         */
        public static create(properties?: Login.IRequest): Login.Request;

        /**
         * Encodes the specified Request message. Does not implicitly {@link Login.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Login.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link Login.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Login.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Login.Request;

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Login.Request;

        /**
         * Verifies a Request message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Request
         */
        public static fromObject(object: { [k: string]: any }): Login.Request;

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @param message Request
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Login.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Request to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** ResCodes enum. */
    enum ResCodes {
        None = 0,
        Success = 16,
        NotUser = 32,
        SessionExpiration = 48,
        DataError = 64,
        DbError = 80,
        Unknown = 96
    }

    /** Properties of a Response. */
    interface IResponse {

        /** Response sid */
        sid?: (string|null);

        /** Response code */
        code?: (Login.ResCodes|null);

        /** Response info */
        info?: (string|null);
    }

    /** Represents a Response. */
    class Response implements IResponse {

        /**
         * Constructs a new Response.
         * @param [properties] Properties to set
         */
        constructor(properties?: Login.IResponse);

        /** Response sid. */
        public sid: string;

        /** Response code. */
        public code: Login.ResCodes;

        /** Response info. */
        public info: string;

        /**
         * Creates a new Response instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Response instance
         */
        public static create(properties?: Login.IResponse): Login.Response;

        /**
         * Encodes the specified Response message. Does not implicitly {@link Login.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Login.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link Login.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Login.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Login.Response;

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Login.Response;

        /**
         * Verifies a Response message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Response
         */
        public static fromObject(object: { [k: string]: any }): Login.Response;

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @param message Response
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Login.Response, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Response to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace Transfer. */
export namespace Transfer {

    /** Query enum. */
    enum Query {
        None = 0,
        Login = 1
    }

    /** RpcCodes enum. */
    enum RpcCodes {
        None = 0
    }

    /** Properties of a Rpc. */
    interface IRpc {

        /** Rpc sid */
        sid?: (string|null);

        /** Rpc qid */
        qid?: (number|null);

        /** Rpc num */
        num?: (number|null);

        /** Rpc cmd */
        cmd?: (Transfer.Query|null);

        /** Rpc data */
        data?: (Uint8Array|null);

        /** Rpc code */
        code?: (Transfer.RpcCodes|null);

        /** Rpc info */
        info?: (string|null);
    }

    /** Represents a Rpc. */
    class Rpc implements IRpc {

        /**
         * Constructs a new Rpc.
         * @param [properties] Properties to set
         */
        constructor(properties?: Transfer.IRpc);

        /** Rpc sid. */
        public sid: string;

        /** Rpc qid. */
        public qid: number;

        /** Rpc num. */
        public num: number;

        /** Rpc cmd. */
        public cmd: Transfer.Query;

        /** Rpc data. */
        public data: Uint8Array;

        /** Rpc code. */
        public code: Transfer.RpcCodes;

        /** Rpc info. */
        public info: string;

        /**
         * Creates a new Rpc instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Rpc instance
         */
        public static create(properties?: Transfer.IRpc): Transfer.Rpc;

        /**
         * Encodes the specified Rpc message. Does not implicitly {@link Transfer.Rpc.verify|verify} messages.
         * @param message Rpc message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Transfer.IRpc, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Rpc message, length delimited. Does not implicitly {@link Transfer.Rpc.verify|verify} messages.
         * @param message Rpc message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Transfer.IRpc, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Rpc message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Rpc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Transfer.Rpc;

        /**
         * Decodes a Rpc message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Rpc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Transfer.Rpc;

        /**
         * Verifies a Rpc message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Rpc message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Rpc
         */
        public static fromObject(object: { [k: string]: any }): Transfer.Rpc;

        /**
         * Creates a plain object from a Rpc message. Also converts values to other types if specified.
         * @param message Rpc
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Transfer.Rpc, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Rpc to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
