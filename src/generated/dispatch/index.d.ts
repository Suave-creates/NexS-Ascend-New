
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Rack
 * 
 */
export type Rack = $Result.DefaultSelection<Prisma.$RackPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model RoutingAssignment
 * 
 */
export type RoutingAssignment = $Result.DefaultSelection<Prisma.$RoutingAssignmentPayload>
/**
 * Model Awb
 * 
 */
export type Awb = $Result.DefaultSelection<Prisma.$AwbPayload>
/**
 * Model Placement
 * 
 */
export type Placement = $Result.DefaultSelection<Prisma.$PlacementPayload>
/**
 * Model LocationEvent
 * 
 */
export type LocationEvent = $Result.DefaultSelection<Prisma.$LocationEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OperatorColor: {
  YELLOW: 'YELLOW',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  PINK: 'PINK',
  RED: 'RED'
};

export type OperatorColor = (typeof OperatorColor)[keyof typeof OperatorColor]


export const LightState: {
  OFF: 'OFF',
  ON: 'ON'
};

export type LightState = (typeof LightState)[keyof typeof LightState]


export const AwbStatus: {
  ASSIGNED: 'ASSIGNED',
  PLACED: 'PLACED'
};

export type AwbStatus = (typeof AwbStatus)[keyof typeof AwbStatus]


export const LocationEventType: {
  LIGHT_ON: 'LIGHT_ON',
  LIGHT_OFF: 'LIGHT_OFF',
  ROUTING_ASSIGNED: 'ROUTING_ASSIGNED',
  ROUTING_RELEASED: 'ROUTING_RELEASED'
};

export type LocationEventType = (typeof LocationEventType)[keyof typeof LocationEventType]

}

export type OperatorColor = $Enums.OperatorColor

export const OperatorColor: typeof $Enums.OperatorColor

export type LightState = $Enums.LightState

export const LightState: typeof $Enums.LightState

export type AwbStatus = $Enums.AwbStatus

export const AwbStatus: typeof $Enums.AwbStatus

export type LocationEventType = $Enums.LocationEventType

export const LocationEventType: typeof $Enums.LocationEventType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Racks
 * const racks = await prisma.rack.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Racks
   * const racks = await prisma.rack.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.rack`: Exposes CRUD operations for the **Rack** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Racks
    * const racks = await prisma.rack.findMany()
    * ```
    */
  get rack(): Prisma.RackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.routingAssignment`: Exposes CRUD operations for the **RoutingAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoutingAssignments
    * const routingAssignments = await prisma.routingAssignment.findMany()
    * ```
    */
  get routingAssignment(): Prisma.RoutingAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.awb`: Exposes CRUD operations for the **Awb** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Awbs
    * const awbs = await prisma.awb.findMany()
    * ```
    */
  get awb(): Prisma.AwbDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.placement`: Exposes CRUD operations for the **Placement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Placements
    * const placements = await prisma.placement.findMany()
    * ```
    */
  get placement(): Prisma.PlacementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.locationEvent`: Exposes CRUD operations for the **LocationEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocationEvents
    * const locationEvents = await prisma.locationEvent.findMany()
    * ```
    */
  get locationEvent(): Prisma.LocationEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Rack: 'Rack',
    Location: 'Location',
    RoutingAssignment: 'RoutingAssignment',
    Awb: 'Awb',
    Placement: 'Placement',
    LocationEvent: 'LocationEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "rack" | "location" | "routingAssignment" | "awb" | "placement" | "locationEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Rack: {
        payload: Prisma.$RackPayload<ExtArgs>
        fields: Prisma.RackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          findFirst: {
            args: Prisma.RackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          findMany: {
            args: Prisma.RackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>[]
          }
          create: {
            args: Prisma.RackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          createMany: {
            args: Prisma.RackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          update: {
            args: Prisma.RackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          deleteMany: {
            args: Prisma.RackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          aggregate: {
            args: Prisma.RackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRack>
          }
          groupBy: {
            args: Prisma.RackGroupByArgs<ExtArgs>
            result: $Utils.Optional<RackGroupByOutputType>[]
          }
          count: {
            args: Prisma.RackCountArgs<ExtArgs>
            result: $Utils.Optional<RackCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      RoutingAssignment: {
        payload: Prisma.$RoutingAssignmentPayload<ExtArgs>
        fields: Prisma.RoutingAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoutingAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoutingAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          findFirst: {
            args: Prisma.RoutingAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoutingAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          findMany: {
            args: Prisma.RoutingAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>[]
          }
          create: {
            args: Prisma.RoutingAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          createMany: {
            args: Prisma.RoutingAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RoutingAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          update: {
            args: Prisma.RoutingAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.RoutingAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoutingAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoutingAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutingAssignmentPayload>
          }
          aggregate: {
            args: Prisma.RoutingAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoutingAssignment>
          }
          groupBy: {
            args: Prisma.RoutingAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoutingAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoutingAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<RoutingAssignmentCountAggregateOutputType> | number
          }
        }
      }
      Awb: {
        payload: Prisma.$AwbPayload<ExtArgs>
        fields: Prisma.AwbFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AwbFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AwbFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          findFirst: {
            args: Prisma.AwbFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AwbFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          findMany: {
            args: Prisma.AwbFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>[]
          }
          create: {
            args: Prisma.AwbCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          createMany: {
            args: Prisma.AwbCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AwbDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          update: {
            args: Prisma.AwbUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          deleteMany: {
            args: Prisma.AwbDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AwbUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AwbUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwbPayload>
          }
          aggregate: {
            args: Prisma.AwbAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAwb>
          }
          groupBy: {
            args: Prisma.AwbGroupByArgs<ExtArgs>
            result: $Utils.Optional<AwbGroupByOutputType>[]
          }
          count: {
            args: Prisma.AwbCountArgs<ExtArgs>
            result: $Utils.Optional<AwbCountAggregateOutputType> | number
          }
        }
      }
      Placement: {
        payload: Prisma.$PlacementPayload<ExtArgs>
        fields: Prisma.PlacementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlacementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlacementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          findFirst: {
            args: Prisma.PlacementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlacementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          findMany: {
            args: Prisma.PlacementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>[]
          }
          create: {
            args: Prisma.PlacementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          createMany: {
            args: Prisma.PlacementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlacementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          update: {
            args: Prisma.PlacementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          deleteMany: {
            args: Prisma.PlacementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlacementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlacementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacementPayload>
          }
          aggregate: {
            args: Prisma.PlacementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlacement>
          }
          groupBy: {
            args: Prisma.PlacementGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlacementGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlacementCountArgs<ExtArgs>
            result: $Utils.Optional<PlacementCountAggregateOutputType> | number
          }
        }
      }
      LocationEvent: {
        payload: Prisma.$LocationEventPayload<ExtArgs>
        fields: Prisma.LocationEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          findFirst: {
            args: Prisma.LocationEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          findMany: {
            args: Prisma.LocationEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>[]
          }
          create: {
            args: Prisma.LocationEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          createMany: {
            args: Prisma.LocationEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LocationEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          update: {
            args: Prisma.LocationEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          deleteMany: {
            args: Prisma.LocationEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationEventPayload>
          }
          aggregate: {
            args: Prisma.LocationEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocationEvent>
          }
          groupBy: {
            args: Prisma.LocationEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationEventCountArgs<ExtArgs>
            result: $Utils.Optional<LocationEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    rack?: RackOmit
    location?: LocationOmit
    routingAssignment?: RoutingAssignmentOmit
    awb?: AwbOmit
    placement?: PlacementOmit
    locationEvent?: LocationEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RackCountOutputType
   */

  export type RackCountOutputType = {
    locations: number
  }

  export type RackCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | RackCountOutputTypeCountLocationsArgs
  }

  // Custom InputTypes
  /**
   * RackCountOutputType without action
   */
  export type RackCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RackCountOutputType
     */
    select?: RackCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RackCountOutputType without action
   */
  export type RackCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    routingAssignments: number
    awbs: number
    placements: number
    events: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    routingAssignments?: boolean | LocationCountOutputTypeCountRoutingAssignmentsArgs
    awbs?: boolean | LocationCountOutputTypeCountAwbsArgs
    placements?: boolean | LocationCountOutputTypeCountPlacementsArgs
    events?: boolean | LocationCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountRoutingAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoutingAssignmentWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountAwbsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwbWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountPlacementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlacementWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Rack
   */

  export type AggregateRack = {
    _count: RackCountAggregateOutputType | null
    _avg: RackAvgAggregateOutputType | null
    _sum: RackSumAggregateOutputType | null
    _min: RackMinAggregateOutputType | null
    _max: RackMaxAggregateOutputType | null
  }

  export type RackAvgAggregateOutputType = {
    id: number | null
    rackNumber: number | null
    totalLevels: number | null
    totalPositions: number | null
  }

  export type RackSumAggregateOutputType = {
    id: number | null
    rackNumber: number | null
    totalLevels: number | null
    totalPositions: number | null
  }

  export type RackMinAggregateOutputType = {
    id: number | null
    rackNumber: number | null
    totalLevels: number | null
    totalPositions: number | null
    createdAt: Date | null
  }

  export type RackMaxAggregateOutputType = {
    id: number | null
    rackNumber: number | null
    totalLevels: number | null
    totalPositions: number | null
    createdAt: Date | null
  }

  export type RackCountAggregateOutputType = {
    id: number
    rackNumber: number
    totalLevels: number
    totalPositions: number
    createdAt: number
    _all: number
  }


  export type RackAvgAggregateInputType = {
    id?: true
    rackNumber?: true
    totalLevels?: true
    totalPositions?: true
  }

  export type RackSumAggregateInputType = {
    id?: true
    rackNumber?: true
    totalLevels?: true
    totalPositions?: true
  }

  export type RackMinAggregateInputType = {
    id?: true
    rackNumber?: true
    totalLevels?: true
    totalPositions?: true
    createdAt?: true
  }

  export type RackMaxAggregateInputType = {
    id?: true
    rackNumber?: true
    totalLevels?: true
    totalPositions?: true
    createdAt?: true
  }

  export type RackCountAggregateInputType = {
    id?: true
    rackNumber?: true
    totalLevels?: true
    totalPositions?: true
    createdAt?: true
    _all?: true
  }

  export type RackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rack to aggregate.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Racks
    **/
    _count?: true | RackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RackMaxAggregateInputType
  }

  export type GetRackAggregateType<T extends RackAggregateArgs> = {
        [P in keyof T & keyof AggregateRack]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRack[P]>
      : GetScalarType<T[P], AggregateRack[P]>
  }




  export type RackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RackWhereInput
    orderBy?: RackOrderByWithAggregationInput | RackOrderByWithAggregationInput[]
    by: RackScalarFieldEnum[] | RackScalarFieldEnum
    having?: RackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RackCountAggregateInputType | true
    _avg?: RackAvgAggregateInputType
    _sum?: RackSumAggregateInputType
    _min?: RackMinAggregateInputType
    _max?: RackMaxAggregateInputType
  }

  export type RackGroupByOutputType = {
    id: number
    rackNumber: number
    totalLevels: number
    totalPositions: number
    createdAt: Date | null
    _count: RackCountAggregateOutputType | null
    _avg: RackAvgAggregateOutputType | null
    _sum: RackSumAggregateOutputType | null
    _min: RackMinAggregateOutputType | null
    _max: RackMaxAggregateOutputType | null
  }

  type GetRackGroupByPayload<T extends RackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RackGroupByOutputType[P]>
            : GetScalarType<T[P], RackGroupByOutputType[P]>
        }
      >
    >


  export type RackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rackNumber?: boolean
    totalLevels?: boolean
    totalPositions?: boolean
    createdAt?: boolean
    locations?: boolean | Rack$locationsArgs<ExtArgs>
    _count?: boolean | RackCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rack"]>



  export type RackSelectScalar = {
    id?: boolean
    rackNumber?: boolean
    totalLevels?: boolean
    totalPositions?: boolean
    createdAt?: boolean
  }

  export type RackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rackNumber" | "totalLevels" | "totalPositions" | "createdAt", ExtArgs["result"]["rack"]>
  export type RackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | Rack$locationsArgs<ExtArgs>
    _count?: boolean | RackCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rack"
    objects: {
      locations: Prisma.$LocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      rackNumber: number
      totalLevels: number
      totalPositions: number
      createdAt: Date | null
    }, ExtArgs["result"]["rack"]>
    composites: {}
  }

  type RackGetPayload<S extends boolean | null | undefined | RackDefaultArgs> = $Result.GetResult<Prisma.$RackPayload, S>

  type RackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RackCountAggregateInputType | true
    }

  export interface RackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rack'], meta: { name: 'Rack' } }
    /**
     * Find zero or one Rack that matches the filter.
     * @param {RackFindUniqueArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RackFindUniqueArgs>(args: SelectSubset<T, RackFindUniqueArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rack that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RackFindUniqueOrThrowArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RackFindUniqueOrThrowArgs>(args: SelectSubset<T, RackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rack that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindFirstArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RackFindFirstArgs>(args?: SelectSubset<T, RackFindFirstArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rack that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindFirstOrThrowArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RackFindFirstOrThrowArgs>(args?: SelectSubset<T, RackFindFirstOrThrowArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Racks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Racks
     * const racks = await prisma.rack.findMany()
     * 
     * // Get first 10 Racks
     * const racks = await prisma.rack.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rackWithIdOnly = await prisma.rack.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RackFindManyArgs>(args?: SelectSubset<T, RackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rack.
     * @param {RackCreateArgs} args - Arguments to create a Rack.
     * @example
     * // Create one Rack
     * const Rack = await prisma.rack.create({
     *   data: {
     *     // ... data to create a Rack
     *   }
     * })
     * 
     */
    create<T extends RackCreateArgs>(args: SelectSubset<T, RackCreateArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Racks.
     * @param {RackCreateManyArgs} args - Arguments to create many Racks.
     * @example
     * // Create many Racks
     * const rack = await prisma.rack.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RackCreateManyArgs>(args?: SelectSubset<T, RackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Rack.
     * @param {RackDeleteArgs} args - Arguments to delete one Rack.
     * @example
     * // Delete one Rack
     * const Rack = await prisma.rack.delete({
     *   where: {
     *     // ... filter to delete one Rack
     *   }
     * })
     * 
     */
    delete<T extends RackDeleteArgs>(args: SelectSubset<T, RackDeleteArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rack.
     * @param {RackUpdateArgs} args - Arguments to update one Rack.
     * @example
     * // Update one Rack
     * const rack = await prisma.rack.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RackUpdateArgs>(args: SelectSubset<T, RackUpdateArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Racks.
     * @param {RackDeleteManyArgs} args - Arguments to filter Racks to delete.
     * @example
     * // Delete a few Racks
     * const { count } = await prisma.rack.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RackDeleteManyArgs>(args?: SelectSubset<T, RackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Racks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Racks
     * const rack = await prisma.rack.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RackUpdateManyArgs>(args: SelectSubset<T, RackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rack.
     * @param {RackUpsertArgs} args - Arguments to update or create a Rack.
     * @example
     * // Update or create a Rack
     * const rack = await prisma.rack.upsert({
     *   create: {
     *     // ... data to create a Rack
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rack we want to update
     *   }
     * })
     */
    upsert<T extends RackUpsertArgs>(args: SelectSubset<T, RackUpsertArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Racks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackCountArgs} args - Arguments to filter Racks to count.
     * @example
     * // Count the number of Racks
     * const count = await prisma.rack.count({
     *   where: {
     *     // ... the filter for the Racks we want to count
     *   }
     * })
    **/
    count<T extends RackCountArgs>(
      args?: Subset<T, RackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RackAggregateArgs>(args: Subset<T, RackAggregateArgs>): Prisma.PrismaPromise<GetRackAggregateType<T>>

    /**
     * Group by Rack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RackGroupByArgs['orderBy'] }
        : { orderBy?: RackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rack model
   */
  readonly fields: RackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rack.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    locations<T extends Rack$locationsArgs<ExtArgs> = {}>(args?: Subset<T, Rack$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rack model
   */
  interface RackFieldRefs {
    readonly id: FieldRef<"Rack", 'Int'>
    readonly rackNumber: FieldRef<"Rack", 'Int'>
    readonly totalLevels: FieldRef<"Rack", 'Int'>
    readonly totalPositions: FieldRef<"Rack", 'Int'>
    readonly createdAt: FieldRef<"Rack", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rack findUnique
   */
  export type RackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack findUniqueOrThrow
   */
  export type RackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack findFirst
   */
  export type RackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Racks.
     */
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack findFirstOrThrow
   */
  export type RackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Racks.
     */
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack findMany
   */
  export type RackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Racks to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack create
   */
  export type RackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The data needed to create a Rack.
     */
    data: XOR<RackCreateInput, RackUncheckedCreateInput>
  }

  /**
   * Rack createMany
   */
  export type RackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Racks.
     */
    data: RackCreateManyInput | RackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rack update
   */
  export type RackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The data needed to update a Rack.
     */
    data: XOR<RackUpdateInput, RackUncheckedUpdateInput>
    /**
     * Choose, which Rack to update.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack updateMany
   */
  export type RackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Racks.
     */
    data: XOR<RackUpdateManyMutationInput, RackUncheckedUpdateManyInput>
    /**
     * Filter which Racks to update
     */
    where?: RackWhereInput
    /**
     * Limit how many Racks to update.
     */
    limit?: number
  }

  /**
   * Rack upsert
   */
  export type RackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The filter to search for the Rack to update in case it exists.
     */
    where: RackWhereUniqueInput
    /**
     * In case the Rack found by the `where` argument doesn't exist, create a new Rack with this data.
     */
    create: XOR<RackCreateInput, RackUncheckedCreateInput>
    /**
     * In case the Rack was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RackUpdateInput, RackUncheckedUpdateInput>
  }

  /**
   * Rack delete
   */
  export type RackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter which Rack to delete.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack deleteMany
   */
  export type RackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Racks to delete
     */
    where?: RackWhereInput
    /**
     * Limit how many Racks to delete.
     */
    limit?: number
  }

  /**
   * Rack.locations
   */
  export type Rack$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    cursor?: LocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Rack without action
   */
  export type RackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rack
     */
    omit?: RackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationAvgAggregateOutputType = {
    id: number | null
    rackId: number | null
    level: number | null
    position: number | null
    locationNumber: number | null
  }

  export type LocationSumAggregateOutputType = {
    id: number | null
    rackId: number | null
    level: number | null
    position: number | null
    locationNumber: number | null
  }

  export type LocationMinAggregateOutputType = {
    id: number | null
    rackId: number | null
    level: number | null
    position: number | null
    locationNumber: number | null
    barcode: string | null
    lightState: $Enums.LightState | null
    currentRoutingCode: string | null
    assignmentTimestamp: Date | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: number | null
    rackId: number | null
    level: number | null
    position: number | null
    locationNumber: number | null
    barcode: string | null
    lightState: $Enums.LightState | null
    currentRoutingCode: string | null
    assignmentTimestamp: Date | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: number
    lightState: number
    currentRoutingCode: number
    assignmentTimestamp: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type LocationAvgAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    position?: true
    locationNumber?: true
  }

  export type LocationSumAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    position?: true
    locationNumber?: true
  }

  export type LocationMinAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    position?: true
    locationNumber?: true
    barcode?: true
    lightState?: true
    currentRoutingCode?: true
    assignmentTimestamp?: true
    isActive?: true
    createdAt?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    position?: true
    locationNumber?: true
    barcode?: true
    lightState?: true
    currentRoutingCode?: true
    assignmentTimestamp?: true
    isActive?: true
    createdAt?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    position?: true
    locationNumber?: true
    barcode?: true
    lightState?: true
    currentRoutingCode?: true
    assignmentTimestamp?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _avg?: LocationAvgAggregateInputType
    _sum?: LocationSumAggregateInputType
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState: $Enums.LightState
    currentRoutingCode: string | null
    assignmentTimestamp: Date | null
    isActive: boolean | null
    createdAt: Date | null
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rackId?: boolean
    level?: boolean
    position?: boolean
    locationNumber?: boolean
    barcode?: boolean
    lightState?: boolean
    currentRoutingCode?: boolean
    assignmentTimestamp?: boolean
    isActive?: boolean
    createdAt?: boolean
    rack?: boolean | RackDefaultArgs<ExtArgs>
    routingAssignments?: boolean | Location$routingAssignmentsArgs<ExtArgs>
    awbs?: boolean | Location$awbsArgs<ExtArgs>
    placements?: boolean | Location$placementsArgs<ExtArgs>
    events?: boolean | Location$eventsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>



  export type LocationSelectScalar = {
    id?: boolean
    rackId?: boolean
    level?: boolean
    position?: boolean
    locationNumber?: boolean
    barcode?: boolean
    lightState?: boolean
    currentRoutingCode?: boolean
    assignmentTimestamp?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rackId" | "level" | "position" | "locationNumber" | "barcode" | "lightState" | "currentRoutingCode" | "assignmentTimestamp" | "isActive" | "createdAt", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rack?: boolean | RackDefaultArgs<ExtArgs>
    routingAssignments?: boolean | Location$routingAssignmentsArgs<ExtArgs>
    awbs?: boolean | Location$awbsArgs<ExtArgs>
    placements?: boolean | Location$placementsArgs<ExtArgs>
    events?: boolean | Location$eventsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      rack: Prisma.$RackPayload<ExtArgs>
      routingAssignments: Prisma.$RoutingAssignmentPayload<ExtArgs>[]
      awbs: Prisma.$AwbPayload<ExtArgs>[]
      placements: Prisma.$PlacementPayload<ExtArgs>[]
      events: Prisma.$LocationEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      rackId: number
      level: number
      position: number
      locationNumber: number
      barcode: string
      lightState: $Enums.LightState
      currentRoutingCode: string | null
      assignmentTimestamp: Date | null
      isActive: boolean | null
      createdAt: Date | null
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rack<T extends RackDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RackDefaultArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    routingAssignments<T extends Location$routingAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Location$routingAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    awbs<T extends Location$awbsArgs<ExtArgs> = {}>(args?: Subset<T, Location$awbsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    placements<T extends Location$placementsArgs<ExtArgs> = {}>(args?: Subset<T, Location$placementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Location$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Location$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'Int'>
    readonly rackId: FieldRef<"Location", 'Int'>
    readonly level: FieldRef<"Location", 'Int'>
    readonly position: FieldRef<"Location", 'Int'>
    readonly locationNumber: FieldRef<"Location", 'Int'>
    readonly barcode: FieldRef<"Location", 'String'>
    readonly lightState: FieldRef<"Location", 'LightState'>
    readonly currentRoutingCode: FieldRef<"Location", 'String'>
    readonly assignmentTimestamp: FieldRef<"Location", 'DateTime'>
    readonly isActive: FieldRef<"Location", 'Boolean'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location.routingAssignments
   */
  export type Location$routingAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    where?: RoutingAssignmentWhereInput
    orderBy?: RoutingAssignmentOrderByWithRelationInput | RoutingAssignmentOrderByWithRelationInput[]
    cursor?: RoutingAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoutingAssignmentScalarFieldEnum | RoutingAssignmentScalarFieldEnum[]
  }

  /**
   * Location.awbs
   */
  export type Location$awbsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    where?: AwbWhereInput
    orderBy?: AwbOrderByWithRelationInput | AwbOrderByWithRelationInput[]
    cursor?: AwbWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AwbScalarFieldEnum | AwbScalarFieldEnum[]
  }

  /**
   * Location.placements
   */
  export type Location$placementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    where?: PlacementWhereInput
    orderBy?: PlacementOrderByWithRelationInput | PlacementOrderByWithRelationInput[]
    cursor?: PlacementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlacementScalarFieldEnum | PlacementScalarFieldEnum[]
  }

  /**
   * Location.events
   */
  export type Location$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    where?: LocationEventWhereInput
    orderBy?: LocationEventOrderByWithRelationInput | LocationEventOrderByWithRelationInput[]
    cursor?: LocationEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationEventScalarFieldEnum | LocationEventScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model RoutingAssignment
   */

  export type AggregateRoutingAssignment = {
    _count: RoutingAssignmentCountAggregateOutputType | null
    _avg: RoutingAssignmentAvgAggregateOutputType | null
    _sum: RoutingAssignmentSumAggregateOutputType | null
    _min: RoutingAssignmentMinAggregateOutputType | null
    _max: RoutingAssignmentMaxAggregateOutputType | null
  }

  export type RoutingAssignmentAvgAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type RoutingAssignmentSumAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type RoutingAssignmentMinAggregateOutputType = {
    id: number | null
    routingCode: string | null
    locationId: number | null
    assignedAt: Date | null
    releasedAt: Date | null
    isActive: boolean | null
  }

  export type RoutingAssignmentMaxAggregateOutputType = {
    id: number | null
    routingCode: string | null
    locationId: number | null
    assignedAt: Date | null
    releasedAt: Date | null
    isActive: boolean | null
  }

  export type RoutingAssignmentCountAggregateOutputType = {
    id: number
    routingCode: number
    locationId: number
    assignedAt: number
    releasedAt: number
    isActive: number
    _all: number
  }


  export type RoutingAssignmentAvgAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type RoutingAssignmentSumAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type RoutingAssignmentMinAggregateInputType = {
    id?: true
    routingCode?: true
    locationId?: true
    assignedAt?: true
    releasedAt?: true
    isActive?: true
  }

  export type RoutingAssignmentMaxAggregateInputType = {
    id?: true
    routingCode?: true
    locationId?: true
    assignedAt?: true
    releasedAt?: true
    isActive?: true
  }

  export type RoutingAssignmentCountAggregateInputType = {
    id?: true
    routingCode?: true
    locationId?: true
    assignedAt?: true
    releasedAt?: true
    isActive?: true
    _all?: true
  }

  export type RoutingAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoutingAssignment to aggregate.
     */
    where?: RoutingAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutingAssignments to fetch.
     */
    orderBy?: RoutingAssignmentOrderByWithRelationInput | RoutingAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoutingAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutingAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutingAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoutingAssignments
    **/
    _count?: true | RoutingAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoutingAssignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoutingAssignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoutingAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoutingAssignmentMaxAggregateInputType
  }

  export type GetRoutingAssignmentAggregateType<T extends RoutingAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateRoutingAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoutingAssignment[P]>
      : GetScalarType<T[P], AggregateRoutingAssignment[P]>
  }




  export type RoutingAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoutingAssignmentWhereInput
    orderBy?: RoutingAssignmentOrderByWithAggregationInput | RoutingAssignmentOrderByWithAggregationInput[]
    by: RoutingAssignmentScalarFieldEnum[] | RoutingAssignmentScalarFieldEnum
    having?: RoutingAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoutingAssignmentCountAggregateInputType | true
    _avg?: RoutingAssignmentAvgAggregateInputType
    _sum?: RoutingAssignmentSumAggregateInputType
    _min?: RoutingAssignmentMinAggregateInputType
    _max?: RoutingAssignmentMaxAggregateInputType
  }

  export type RoutingAssignmentGroupByOutputType = {
    id: number
    routingCode: string
    locationId: number
    assignedAt: Date | null
    releasedAt: Date | null
    isActive: boolean | null
    _count: RoutingAssignmentCountAggregateOutputType | null
    _avg: RoutingAssignmentAvgAggregateOutputType | null
    _sum: RoutingAssignmentSumAggregateOutputType | null
    _min: RoutingAssignmentMinAggregateOutputType | null
    _max: RoutingAssignmentMaxAggregateOutputType | null
  }

  type GetRoutingAssignmentGroupByPayload<T extends RoutingAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoutingAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoutingAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoutingAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], RoutingAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type RoutingAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    routingCode?: boolean
    locationId?: boolean
    assignedAt?: boolean
    releasedAt?: boolean
    isActive?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["routingAssignment"]>



  export type RoutingAssignmentSelectScalar = {
    id?: boolean
    routingCode?: boolean
    locationId?: boolean
    assignedAt?: boolean
    releasedAt?: boolean
    isActive?: boolean
  }

  export type RoutingAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "routingCode" | "locationId" | "assignedAt" | "releasedAt" | "isActive", ExtArgs["result"]["routingAssignment"]>
  export type RoutingAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $RoutingAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoutingAssignment"
    objects: {
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      routingCode: string
      locationId: number
      assignedAt: Date | null
      releasedAt: Date | null
      isActive: boolean | null
    }, ExtArgs["result"]["routingAssignment"]>
    composites: {}
  }

  type RoutingAssignmentGetPayload<S extends boolean | null | undefined | RoutingAssignmentDefaultArgs> = $Result.GetResult<Prisma.$RoutingAssignmentPayload, S>

  type RoutingAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoutingAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoutingAssignmentCountAggregateInputType | true
    }

  export interface RoutingAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoutingAssignment'], meta: { name: 'RoutingAssignment' } }
    /**
     * Find zero or one RoutingAssignment that matches the filter.
     * @param {RoutingAssignmentFindUniqueArgs} args - Arguments to find a RoutingAssignment
     * @example
     * // Get one RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoutingAssignmentFindUniqueArgs>(args: SelectSubset<T, RoutingAssignmentFindUniqueArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoutingAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoutingAssignmentFindUniqueOrThrowArgs} args - Arguments to find a RoutingAssignment
     * @example
     * // Get one RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoutingAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, RoutingAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoutingAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentFindFirstArgs} args - Arguments to find a RoutingAssignment
     * @example
     * // Get one RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoutingAssignmentFindFirstArgs>(args?: SelectSubset<T, RoutingAssignmentFindFirstArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoutingAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentFindFirstOrThrowArgs} args - Arguments to find a RoutingAssignment
     * @example
     * // Get one RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoutingAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, RoutingAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoutingAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoutingAssignments
     * const routingAssignments = await prisma.routingAssignment.findMany()
     * 
     * // Get first 10 RoutingAssignments
     * const routingAssignments = await prisma.routingAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const routingAssignmentWithIdOnly = await prisma.routingAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoutingAssignmentFindManyArgs>(args?: SelectSubset<T, RoutingAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoutingAssignment.
     * @param {RoutingAssignmentCreateArgs} args - Arguments to create a RoutingAssignment.
     * @example
     * // Create one RoutingAssignment
     * const RoutingAssignment = await prisma.routingAssignment.create({
     *   data: {
     *     // ... data to create a RoutingAssignment
     *   }
     * })
     * 
     */
    create<T extends RoutingAssignmentCreateArgs>(args: SelectSubset<T, RoutingAssignmentCreateArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoutingAssignments.
     * @param {RoutingAssignmentCreateManyArgs} args - Arguments to create many RoutingAssignments.
     * @example
     * // Create many RoutingAssignments
     * const routingAssignment = await prisma.routingAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoutingAssignmentCreateManyArgs>(args?: SelectSubset<T, RoutingAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RoutingAssignment.
     * @param {RoutingAssignmentDeleteArgs} args - Arguments to delete one RoutingAssignment.
     * @example
     * // Delete one RoutingAssignment
     * const RoutingAssignment = await prisma.routingAssignment.delete({
     *   where: {
     *     // ... filter to delete one RoutingAssignment
     *   }
     * })
     * 
     */
    delete<T extends RoutingAssignmentDeleteArgs>(args: SelectSubset<T, RoutingAssignmentDeleteArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoutingAssignment.
     * @param {RoutingAssignmentUpdateArgs} args - Arguments to update one RoutingAssignment.
     * @example
     * // Update one RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoutingAssignmentUpdateArgs>(args: SelectSubset<T, RoutingAssignmentUpdateArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoutingAssignments.
     * @param {RoutingAssignmentDeleteManyArgs} args - Arguments to filter RoutingAssignments to delete.
     * @example
     * // Delete a few RoutingAssignments
     * const { count } = await prisma.routingAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoutingAssignmentDeleteManyArgs>(args?: SelectSubset<T, RoutingAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoutingAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoutingAssignments
     * const routingAssignment = await prisma.routingAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoutingAssignmentUpdateManyArgs>(args: SelectSubset<T, RoutingAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RoutingAssignment.
     * @param {RoutingAssignmentUpsertArgs} args - Arguments to update or create a RoutingAssignment.
     * @example
     * // Update or create a RoutingAssignment
     * const routingAssignment = await prisma.routingAssignment.upsert({
     *   create: {
     *     // ... data to create a RoutingAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoutingAssignment we want to update
     *   }
     * })
     */
    upsert<T extends RoutingAssignmentUpsertArgs>(args: SelectSubset<T, RoutingAssignmentUpsertArgs<ExtArgs>>): Prisma__RoutingAssignmentClient<$Result.GetResult<Prisma.$RoutingAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoutingAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentCountArgs} args - Arguments to filter RoutingAssignments to count.
     * @example
     * // Count the number of RoutingAssignments
     * const count = await prisma.routingAssignment.count({
     *   where: {
     *     // ... the filter for the RoutingAssignments we want to count
     *   }
     * })
    **/
    count<T extends RoutingAssignmentCountArgs>(
      args?: Subset<T, RoutingAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoutingAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoutingAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoutingAssignmentAggregateArgs>(args: Subset<T, RoutingAssignmentAggregateArgs>): Prisma.PrismaPromise<GetRoutingAssignmentAggregateType<T>>

    /**
     * Group by RoutingAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutingAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoutingAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoutingAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: RoutingAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoutingAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoutingAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoutingAssignment model
   */
  readonly fields: RoutingAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoutingAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoutingAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoutingAssignment model
   */
  interface RoutingAssignmentFieldRefs {
    readonly id: FieldRef<"RoutingAssignment", 'Int'>
    readonly routingCode: FieldRef<"RoutingAssignment", 'String'>
    readonly locationId: FieldRef<"RoutingAssignment", 'Int'>
    readonly assignedAt: FieldRef<"RoutingAssignment", 'DateTime'>
    readonly releasedAt: FieldRef<"RoutingAssignment", 'DateTime'>
    readonly isActive: FieldRef<"RoutingAssignment", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * RoutingAssignment findUnique
   */
  export type RoutingAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which RoutingAssignment to fetch.
     */
    where: RoutingAssignmentWhereUniqueInput
  }

  /**
   * RoutingAssignment findUniqueOrThrow
   */
  export type RoutingAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which RoutingAssignment to fetch.
     */
    where: RoutingAssignmentWhereUniqueInput
  }

  /**
   * RoutingAssignment findFirst
   */
  export type RoutingAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which RoutingAssignment to fetch.
     */
    where?: RoutingAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutingAssignments to fetch.
     */
    orderBy?: RoutingAssignmentOrderByWithRelationInput | RoutingAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoutingAssignments.
     */
    cursor?: RoutingAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutingAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutingAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoutingAssignments.
     */
    distinct?: RoutingAssignmentScalarFieldEnum | RoutingAssignmentScalarFieldEnum[]
  }

  /**
   * RoutingAssignment findFirstOrThrow
   */
  export type RoutingAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which RoutingAssignment to fetch.
     */
    where?: RoutingAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutingAssignments to fetch.
     */
    orderBy?: RoutingAssignmentOrderByWithRelationInput | RoutingAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoutingAssignments.
     */
    cursor?: RoutingAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutingAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutingAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoutingAssignments.
     */
    distinct?: RoutingAssignmentScalarFieldEnum | RoutingAssignmentScalarFieldEnum[]
  }

  /**
   * RoutingAssignment findMany
   */
  export type RoutingAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which RoutingAssignments to fetch.
     */
    where?: RoutingAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutingAssignments to fetch.
     */
    orderBy?: RoutingAssignmentOrderByWithRelationInput | RoutingAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoutingAssignments.
     */
    cursor?: RoutingAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutingAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutingAssignments.
     */
    skip?: number
    distinct?: RoutingAssignmentScalarFieldEnum | RoutingAssignmentScalarFieldEnum[]
  }

  /**
   * RoutingAssignment create
   */
  export type RoutingAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a RoutingAssignment.
     */
    data: XOR<RoutingAssignmentCreateInput, RoutingAssignmentUncheckedCreateInput>
  }

  /**
   * RoutingAssignment createMany
   */
  export type RoutingAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoutingAssignments.
     */
    data: RoutingAssignmentCreateManyInput | RoutingAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoutingAssignment update
   */
  export type RoutingAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a RoutingAssignment.
     */
    data: XOR<RoutingAssignmentUpdateInput, RoutingAssignmentUncheckedUpdateInput>
    /**
     * Choose, which RoutingAssignment to update.
     */
    where: RoutingAssignmentWhereUniqueInput
  }

  /**
   * RoutingAssignment updateMany
   */
  export type RoutingAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoutingAssignments.
     */
    data: XOR<RoutingAssignmentUpdateManyMutationInput, RoutingAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which RoutingAssignments to update
     */
    where?: RoutingAssignmentWhereInput
    /**
     * Limit how many RoutingAssignments to update.
     */
    limit?: number
  }

  /**
   * RoutingAssignment upsert
   */
  export type RoutingAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the RoutingAssignment to update in case it exists.
     */
    where: RoutingAssignmentWhereUniqueInput
    /**
     * In case the RoutingAssignment found by the `where` argument doesn't exist, create a new RoutingAssignment with this data.
     */
    create: XOR<RoutingAssignmentCreateInput, RoutingAssignmentUncheckedCreateInput>
    /**
     * In case the RoutingAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoutingAssignmentUpdateInput, RoutingAssignmentUncheckedUpdateInput>
  }

  /**
   * RoutingAssignment delete
   */
  export type RoutingAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
    /**
     * Filter which RoutingAssignment to delete.
     */
    where: RoutingAssignmentWhereUniqueInput
  }

  /**
   * RoutingAssignment deleteMany
   */
  export type RoutingAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoutingAssignments to delete
     */
    where?: RoutingAssignmentWhereInput
    /**
     * Limit how many RoutingAssignments to delete.
     */
    limit?: number
  }

  /**
   * RoutingAssignment without action
   */
  export type RoutingAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutingAssignment
     */
    select?: RoutingAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoutingAssignment
     */
    omit?: RoutingAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoutingAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model Awb
   */

  export type AggregateAwb = {
    _count: AwbCountAggregateOutputType | null
    _avg: AwbAvgAggregateOutputType | null
    _sum: AwbSumAggregateOutputType | null
    _min: AwbMinAggregateOutputType | null
    _max: AwbMaxAggregateOutputType | null
  }

  export type AwbAvgAggregateOutputType = {
    id: number | null
    assignedLocationId: number | null
  }

  export type AwbSumAggregateOutputType = {
    id: number | null
    assignedLocationId: number | null
  }

  export type AwbMinAggregateOutputType = {
    id: number | null
    awbNumber: string | null
    routingCode: string | null
    assignedLocationId: number | null
    operatorColor: $Enums.OperatorColor | null
    scanTimestamp: Date | null
    placedTimestamp: Date | null
    status: $Enums.AwbStatus | null
  }

  export type AwbMaxAggregateOutputType = {
    id: number | null
    awbNumber: string | null
    routingCode: string | null
    assignedLocationId: number | null
    operatorColor: $Enums.OperatorColor | null
    scanTimestamp: Date | null
    placedTimestamp: Date | null
    status: $Enums.AwbStatus | null
  }

  export type AwbCountAggregateOutputType = {
    id: number
    awbNumber: number
    routingCode: number
    assignedLocationId: number
    operatorColor: number
    scanTimestamp: number
    placedTimestamp: number
    status: number
    _all: number
  }


  export type AwbAvgAggregateInputType = {
    id?: true
    assignedLocationId?: true
  }

  export type AwbSumAggregateInputType = {
    id?: true
    assignedLocationId?: true
  }

  export type AwbMinAggregateInputType = {
    id?: true
    awbNumber?: true
    routingCode?: true
    assignedLocationId?: true
    operatorColor?: true
    scanTimestamp?: true
    placedTimestamp?: true
    status?: true
  }

  export type AwbMaxAggregateInputType = {
    id?: true
    awbNumber?: true
    routingCode?: true
    assignedLocationId?: true
    operatorColor?: true
    scanTimestamp?: true
    placedTimestamp?: true
    status?: true
  }

  export type AwbCountAggregateInputType = {
    id?: true
    awbNumber?: true
    routingCode?: true
    assignedLocationId?: true
    operatorColor?: true
    scanTimestamp?: true
    placedTimestamp?: true
    status?: true
    _all?: true
  }

  export type AwbAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Awb to aggregate.
     */
    where?: AwbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awbs to fetch.
     */
    orderBy?: AwbOrderByWithRelationInput | AwbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AwbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Awbs
    **/
    _count?: true | AwbCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AwbAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AwbSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AwbMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AwbMaxAggregateInputType
  }

  export type GetAwbAggregateType<T extends AwbAggregateArgs> = {
        [P in keyof T & keyof AggregateAwb]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAwb[P]>
      : GetScalarType<T[P], AggregateAwb[P]>
  }




  export type AwbGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwbWhereInput
    orderBy?: AwbOrderByWithAggregationInput | AwbOrderByWithAggregationInput[]
    by: AwbScalarFieldEnum[] | AwbScalarFieldEnum
    having?: AwbScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AwbCountAggregateInputType | true
    _avg?: AwbAvgAggregateInputType
    _sum?: AwbSumAggregateInputType
    _min?: AwbMinAggregateInputType
    _max?: AwbMaxAggregateInputType
  }

  export type AwbGroupByOutputType = {
    id: number
    awbNumber: string
    routingCode: string
    assignedLocationId: number
    operatorColor: $Enums.OperatorColor
    scanTimestamp: Date
    placedTimestamp: Date | null
    status: $Enums.AwbStatus
    _count: AwbCountAggregateOutputType | null
    _avg: AwbAvgAggregateOutputType | null
    _sum: AwbSumAggregateOutputType | null
    _min: AwbMinAggregateOutputType | null
    _max: AwbMaxAggregateOutputType | null
  }

  type GetAwbGroupByPayload<T extends AwbGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AwbGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AwbGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AwbGroupByOutputType[P]>
            : GetScalarType<T[P], AwbGroupByOutputType[P]>
        }
      >
    >


  export type AwbSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    awbNumber?: boolean
    routingCode?: boolean
    assignedLocationId?: boolean
    operatorColor?: boolean
    scanTimestamp?: boolean
    placedTimestamp?: boolean
    status?: boolean
    assignedLocation?: boolean | LocationDefaultArgs<ExtArgs>
    placement?: boolean | Awb$placementArgs<ExtArgs>
  }, ExtArgs["result"]["awb"]>



  export type AwbSelectScalar = {
    id?: boolean
    awbNumber?: boolean
    routingCode?: boolean
    assignedLocationId?: boolean
    operatorColor?: boolean
    scanTimestamp?: boolean
    placedTimestamp?: boolean
    status?: boolean
  }

  export type AwbOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "awbNumber" | "routingCode" | "assignedLocationId" | "operatorColor" | "scanTimestamp" | "placedTimestamp" | "status", ExtArgs["result"]["awb"]>
  export type AwbInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedLocation?: boolean | LocationDefaultArgs<ExtArgs>
    placement?: boolean | Awb$placementArgs<ExtArgs>
  }

  export type $AwbPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Awb"
    objects: {
      assignedLocation: Prisma.$LocationPayload<ExtArgs>
      placement: Prisma.$PlacementPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      awbNumber: string
      routingCode: string
      assignedLocationId: number
      operatorColor: $Enums.OperatorColor
      scanTimestamp: Date
      placedTimestamp: Date | null
      status: $Enums.AwbStatus
    }, ExtArgs["result"]["awb"]>
    composites: {}
  }

  type AwbGetPayload<S extends boolean | null | undefined | AwbDefaultArgs> = $Result.GetResult<Prisma.$AwbPayload, S>

  type AwbCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AwbFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AwbCountAggregateInputType | true
    }

  export interface AwbDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Awb'], meta: { name: 'Awb' } }
    /**
     * Find zero or one Awb that matches the filter.
     * @param {AwbFindUniqueArgs} args - Arguments to find a Awb
     * @example
     * // Get one Awb
     * const awb = await prisma.awb.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AwbFindUniqueArgs>(args: SelectSubset<T, AwbFindUniqueArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Awb that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AwbFindUniqueOrThrowArgs} args - Arguments to find a Awb
     * @example
     * // Get one Awb
     * const awb = await prisma.awb.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AwbFindUniqueOrThrowArgs>(args: SelectSubset<T, AwbFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Awb that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbFindFirstArgs} args - Arguments to find a Awb
     * @example
     * // Get one Awb
     * const awb = await prisma.awb.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AwbFindFirstArgs>(args?: SelectSubset<T, AwbFindFirstArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Awb that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbFindFirstOrThrowArgs} args - Arguments to find a Awb
     * @example
     * // Get one Awb
     * const awb = await prisma.awb.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AwbFindFirstOrThrowArgs>(args?: SelectSubset<T, AwbFindFirstOrThrowArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Awbs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Awbs
     * const awbs = await prisma.awb.findMany()
     * 
     * // Get first 10 Awbs
     * const awbs = await prisma.awb.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const awbWithIdOnly = await prisma.awb.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AwbFindManyArgs>(args?: SelectSubset<T, AwbFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Awb.
     * @param {AwbCreateArgs} args - Arguments to create a Awb.
     * @example
     * // Create one Awb
     * const Awb = await prisma.awb.create({
     *   data: {
     *     // ... data to create a Awb
     *   }
     * })
     * 
     */
    create<T extends AwbCreateArgs>(args: SelectSubset<T, AwbCreateArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Awbs.
     * @param {AwbCreateManyArgs} args - Arguments to create many Awbs.
     * @example
     * // Create many Awbs
     * const awb = await prisma.awb.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AwbCreateManyArgs>(args?: SelectSubset<T, AwbCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Awb.
     * @param {AwbDeleteArgs} args - Arguments to delete one Awb.
     * @example
     * // Delete one Awb
     * const Awb = await prisma.awb.delete({
     *   where: {
     *     // ... filter to delete one Awb
     *   }
     * })
     * 
     */
    delete<T extends AwbDeleteArgs>(args: SelectSubset<T, AwbDeleteArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Awb.
     * @param {AwbUpdateArgs} args - Arguments to update one Awb.
     * @example
     * // Update one Awb
     * const awb = await prisma.awb.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AwbUpdateArgs>(args: SelectSubset<T, AwbUpdateArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Awbs.
     * @param {AwbDeleteManyArgs} args - Arguments to filter Awbs to delete.
     * @example
     * // Delete a few Awbs
     * const { count } = await prisma.awb.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AwbDeleteManyArgs>(args?: SelectSubset<T, AwbDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Awbs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Awbs
     * const awb = await prisma.awb.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AwbUpdateManyArgs>(args: SelectSubset<T, AwbUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Awb.
     * @param {AwbUpsertArgs} args - Arguments to update or create a Awb.
     * @example
     * // Update or create a Awb
     * const awb = await prisma.awb.upsert({
     *   create: {
     *     // ... data to create a Awb
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Awb we want to update
     *   }
     * })
     */
    upsert<T extends AwbUpsertArgs>(args: SelectSubset<T, AwbUpsertArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Awbs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbCountArgs} args - Arguments to filter Awbs to count.
     * @example
     * // Count the number of Awbs
     * const count = await prisma.awb.count({
     *   where: {
     *     // ... the filter for the Awbs we want to count
     *   }
     * })
    **/
    count<T extends AwbCountArgs>(
      args?: Subset<T, AwbCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AwbCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Awb.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AwbAggregateArgs>(args: Subset<T, AwbAggregateArgs>): Prisma.PrismaPromise<GetAwbAggregateType<T>>

    /**
     * Group by Awb.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwbGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AwbGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AwbGroupByArgs['orderBy'] }
        : { orderBy?: AwbGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AwbGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAwbGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Awb model
   */
  readonly fields: AwbFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Awb.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AwbClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignedLocation<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    placement<T extends Awb$placementArgs<ExtArgs> = {}>(args?: Subset<T, Awb$placementArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Awb model
   */
  interface AwbFieldRefs {
    readonly id: FieldRef<"Awb", 'Int'>
    readonly awbNumber: FieldRef<"Awb", 'String'>
    readonly routingCode: FieldRef<"Awb", 'String'>
    readonly assignedLocationId: FieldRef<"Awb", 'Int'>
    readonly operatorColor: FieldRef<"Awb", 'OperatorColor'>
    readonly scanTimestamp: FieldRef<"Awb", 'DateTime'>
    readonly placedTimestamp: FieldRef<"Awb", 'DateTime'>
    readonly status: FieldRef<"Awb", 'AwbStatus'>
  }
    

  // Custom InputTypes
  /**
   * Awb findUnique
   */
  export type AwbFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter, which Awb to fetch.
     */
    where: AwbWhereUniqueInput
  }

  /**
   * Awb findUniqueOrThrow
   */
  export type AwbFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter, which Awb to fetch.
     */
    where: AwbWhereUniqueInput
  }

  /**
   * Awb findFirst
   */
  export type AwbFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter, which Awb to fetch.
     */
    where?: AwbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awbs to fetch.
     */
    orderBy?: AwbOrderByWithRelationInput | AwbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Awbs.
     */
    cursor?: AwbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Awbs.
     */
    distinct?: AwbScalarFieldEnum | AwbScalarFieldEnum[]
  }

  /**
   * Awb findFirstOrThrow
   */
  export type AwbFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter, which Awb to fetch.
     */
    where?: AwbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awbs to fetch.
     */
    orderBy?: AwbOrderByWithRelationInput | AwbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Awbs.
     */
    cursor?: AwbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Awbs.
     */
    distinct?: AwbScalarFieldEnum | AwbScalarFieldEnum[]
  }

  /**
   * Awb findMany
   */
  export type AwbFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter, which Awbs to fetch.
     */
    where?: AwbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awbs to fetch.
     */
    orderBy?: AwbOrderByWithRelationInput | AwbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Awbs.
     */
    cursor?: AwbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awbs.
     */
    skip?: number
    distinct?: AwbScalarFieldEnum | AwbScalarFieldEnum[]
  }

  /**
   * Awb create
   */
  export type AwbCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * The data needed to create a Awb.
     */
    data: XOR<AwbCreateInput, AwbUncheckedCreateInput>
  }

  /**
   * Awb createMany
   */
  export type AwbCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Awbs.
     */
    data: AwbCreateManyInput | AwbCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Awb update
   */
  export type AwbUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * The data needed to update a Awb.
     */
    data: XOR<AwbUpdateInput, AwbUncheckedUpdateInput>
    /**
     * Choose, which Awb to update.
     */
    where: AwbWhereUniqueInput
  }

  /**
   * Awb updateMany
   */
  export type AwbUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Awbs.
     */
    data: XOR<AwbUpdateManyMutationInput, AwbUncheckedUpdateManyInput>
    /**
     * Filter which Awbs to update
     */
    where?: AwbWhereInput
    /**
     * Limit how many Awbs to update.
     */
    limit?: number
  }

  /**
   * Awb upsert
   */
  export type AwbUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * The filter to search for the Awb to update in case it exists.
     */
    where: AwbWhereUniqueInput
    /**
     * In case the Awb found by the `where` argument doesn't exist, create a new Awb with this data.
     */
    create: XOR<AwbCreateInput, AwbUncheckedCreateInput>
    /**
     * In case the Awb was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AwbUpdateInput, AwbUncheckedUpdateInput>
  }

  /**
   * Awb delete
   */
  export type AwbDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
    /**
     * Filter which Awb to delete.
     */
    where: AwbWhereUniqueInput
  }

  /**
   * Awb deleteMany
   */
  export type AwbDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Awbs to delete
     */
    where?: AwbWhereInput
    /**
     * Limit how many Awbs to delete.
     */
    limit?: number
  }

  /**
   * Awb.placement
   */
  export type Awb$placementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    where?: PlacementWhereInput
  }

  /**
   * Awb without action
   */
  export type AwbDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Awb
     */
    select?: AwbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Awb
     */
    omit?: AwbOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwbInclude<ExtArgs> | null
  }


  /**
   * Model Placement
   */

  export type AggregatePlacement = {
    _count: PlacementCountAggregateOutputType | null
    _avg: PlacementAvgAggregateOutputType | null
    _sum: PlacementSumAggregateOutputType | null
    _min: PlacementMinAggregateOutputType | null
    _max: PlacementMaxAggregateOutputType | null
  }

  export type PlacementAvgAggregateOutputType = {
    id: number | null
    awbId: number | null
    locationId: number | null
  }

  export type PlacementSumAggregateOutputType = {
    id: number | null
    awbId: number | null
    locationId: number | null
  }

  export type PlacementMinAggregateOutputType = {
    id: number | null
    awbId: number | null
    locationId: number | null
    verified: boolean | null
    verifiedAt: Date | null
    operatorId: string | null
  }

  export type PlacementMaxAggregateOutputType = {
    id: number | null
    awbId: number | null
    locationId: number | null
    verified: boolean | null
    verifiedAt: Date | null
    operatorId: string | null
  }

  export type PlacementCountAggregateOutputType = {
    id: number
    awbId: number
    locationId: number
    verified: number
    verifiedAt: number
    operatorId: number
    _all: number
  }


  export type PlacementAvgAggregateInputType = {
    id?: true
    awbId?: true
    locationId?: true
  }

  export type PlacementSumAggregateInputType = {
    id?: true
    awbId?: true
    locationId?: true
  }

  export type PlacementMinAggregateInputType = {
    id?: true
    awbId?: true
    locationId?: true
    verified?: true
    verifiedAt?: true
    operatorId?: true
  }

  export type PlacementMaxAggregateInputType = {
    id?: true
    awbId?: true
    locationId?: true
    verified?: true
    verifiedAt?: true
    operatorId?: true
  }

  export type PlacementCountAggregateInputType = {
    id?: true
    awbId?: true
    locationId?: true
    verified?: true
    verifiedAt?: true
    operatorId?: true
    _all?: true
  }

  export type PlacementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Placement to aggregate.
     */
    where?: PlacementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Placements to fetch.
     */
    orderBy?: PlacementOrderByWithRelationInput | PlacementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlacementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Placements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Placements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Placements
    **/
    _count?: true | PlacementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlacementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlacementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlacementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlacementMaxAggregateInputType
  }

  export type GetPlacementAggregateType<T extends PlacementAggregateArgs> = {
        [P in keyof T & keyof AggregatePlacement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlacement[P]>
      : GetScalarType<T[P], AggregatePlacement[P]>
  }




  export type PlacementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlacementWhereInput
    orderBy?: PlacementOrderByWithAggregationInput | PlacementOrderByWithAggregationInput[]
    by: PlacementScalarFieldEnum[] | PlacementScalarFieldEnum
    having?: PlacementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlacementCountAggregateInputType | true
    _avg?: PlacementAvgAggregateInputType
    _sum?: PlacementSumAggregateInputType
    _min?: PlacementMinAggregateInputType
    _max?: PlacementMaxAggregateInputType
  }

  export type PlacementGroupByOutputType = {
    id: number
    awbId: number
    locationId: number
    verified: boolean | null
    verifiedAt: Date | null
    operatorId: string | null
    _count: PlacementCountAggregateOutputType | null
    _avg: PlacementAvgAggregateOutputType | null
    _sum: PlacementSumAggregateOutputType | null
    _min: PlacementMinAggregateOutputType | null
    _max: PlacementMaxAggregateOutputType | null
  }

  type GetPlacementGroupByPayload<T extends PlacementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlacementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlacementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlacementGroupByOutputType[P]>
            : GetScalarType<T[P], PlacementGroupByOutputType[P]>
        }
      >
    >


  export type PlacementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    awbId?: boolean
    locationId?: boolean
    verified?: boolean
    verifiedAt?: boolean
    operatorId?: boolean
    awb?: boolean | AwbDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["placement"]>



  export type PlacementSelectScalar = {
    id?: boolean
    awbId?: boolean
    locationId?: boolean
    verified?: boolean
    verifiedAt?: boolean
    operatorId?: boolean
  }

  export type PlacementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "awbId" | "locationId" | "verified" | "verifiedAt" | "operatorId", ExtArgs["result"]["placement"]>
  export type PlacementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    awb?: boolean | AwbDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $PlacementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Placement"
    objects: {
      awb: Prisma.$AwbPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      awbId: number
      locationId: number
      verified: boolean | null
      verifiedAt: Date | null
      operatorId: string | null
    }, ExtArgs["result"]["placement"]>
    composites: {}
  }

  type PlacementGetPayload<S extends boolean | null | undefined | PlacementDefaultArgs> = $Result.GetResult<Prisma.$PlacementPayload, S>

  type PlacementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlacementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlacementCountAggregateInputType | true
    }

  export interface PlacementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Placement'], meta: { name: 'Placement' } }
    /**
     * Find zero or one Placement that matches the filter.
     * @param {PlacementFindUniqueArgs} args - Arguments to find a Placement
     * @example
     * // Get one Placement
     * const placement = await prisma.placement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlacementFindUniqueArgs>(args: SelectSubset<T, PlacementFindUniqueArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Placement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlacementFindUniqueOrThrowArgs} args - Arguments to find a Placement
     * @example
     * // Get one Placement
     * const placement = await prisma.placement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlacementFindUniqueOrThrowArgs>(args: SelectSubset<T, PlacementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Placement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementFindFirstArgs} args - Arguments to find a Placement
     * @example
     * // Get one Placement
     * const placement = await prisma.placement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlacementFindFirstArgs>(args?: SelectSubset<T, PlacementFindFirstArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Placement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementFindFirstOrThrowArgs} args - Arguments to find a Placement
     * @example
     * // Get one Placement
     * const placement = await prisma.placement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlacementFindFirstOrThrowArgs>(args?: SelectSubset<T, PlacementFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Placements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Placements
     * const placements = await prisma.placement.findMany()
     * 
     * // Get first 10 Placements
     * const placements = await prisma.placement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const placementWithIdOnly = await prisma.placement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlacementFindManyArgs>(args?: SelectSubset<T, PlacementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Placement.
     * @param {PlacementCreateArgs} args - Arguments to create a Placement.
     * @example
     * // Create one Placement
     * const Placement = await prisma.placement.create({
     *   data: {
     *     // ... data to create a Placement
     *   }
     * })
     * 
     */
    create<T extends PlacementCreateArgs>(args: SelectSubset<T, PlacementCreateArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Placements.
     * @param {PlacementCreateManyArgs} args - Arguments to create many Placements.
     * @example
     * // Create many Placements
     * const placement = await prisma.placement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlacementCreateManyArgs>(args?: SelectSubset<T, PlacementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Placement.
     * @param {PlacementDeleteArgs} args - Arguments to delete one Placement.
     * @example
     * // Delete one Placement
     * const Placement = await prisma.placement.delete({
     *   where: {
     *     // ... filter to delete one Placement
     *   }
     * })
     * 
     */
    delete<T extends PlacementDeleteArgs>(args: SelectSubset<T, PlacementDeleteArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Placement.
     * @param {PlacementUpdateArgs} args - Arguments to update one Placement.
     * @example
     * // Update one Placement
     * const placement = await prisma.placement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlacementUpdateArgs>(args: SelectSubset<T, PlacementUpdateArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Placements.
     * @param {PlacementDeleteManyArgs} args - Arguments to filter Placements to delete.
     * @example
     * // Delete a few Placements
     * const { count } = await prisma.placement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlacementDeleteManyArgs>(args?: SelectSubset<T, PlacementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Placements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Placements
     * const placement = await prisma.placement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlacementUpdateManyArgs>(args: SelectSubset<T, PlacementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Placement.
     * @param {PlacementUpsertArgs} args - Arguments to update or create a Placement.
     * @example
     * // Update or create a Placement
     * const placement = await prisma.placement.upsert({
     *   create: {
     *     // ... data to create a Placement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Placement we want to update
     *   }
     * })
     */
    upsert<T extends PlacementUpsertArgs>(args: SelectSubset<T, PlacementUpsertArgs<ExtArgs>>): Prisma__PlacementClient<$Result.GetResult<Prisma.$PlacementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Placements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementCountArgs} args - Arguments to filter Placements to count.
     * @example
     * // Count the number of Placements
     * const count = await prisma.placement.count({
     *   where: {
     *     // ... the filter for the Placements we want to count
     *   }
     * })
    **/
    count<T extends PlacementCountArgs>(
      args?: Subset<T, PlacementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlacementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Placement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlacementAggregateArgs>(args: Subset<T, PlacementAggregateArgs>): Prisma.PrismaPromise<GetPlacementAggregateType<T>>

    /**
     * Group by Placement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlacementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlacementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlacementGroupByArgs['orderBy'] }
        : { orderBy?: PlacementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlacementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlacementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Placement model
   */
  readonly fields: PlacementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Placement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlacementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    awb<T extends AwbDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AwbDefaultArgs<ExtArgs>>): Prisma__AwbClient<$Result.GetResult<Prisma.$AwbPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Placement model
   */
  interface PlacementFieldRefs {
    readonly id: FieldRef<"Placement", 'Int'>
    readonly awbId: FieldRef<"Placement", 'Int'>
    readonly locationId: FieldRef<"Placement", 'Int'>
    readonly verified: FieldRef<"Placement", 'Boolean'>
    readonly verifiedAt: FieldRef<"Placement", 'DateTime'>
    readonly operatorId: FieldRef<"Placement", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Placement findUnique
   */
  export type PlacementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter, which Placement to fetch.
     */
    where: PlacementWhereUniqueInput
  }

  /**
   * Placement findUniqueOrThrow
   */
  export type PlacementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter, which Placement to fetch.
     */
    where: PlacementWhereUniqueInput
  }

  /**
   * Placement findFirst
   */
  export type PlacementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter, which Placement to fetch.
     */
    where?: PlacementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Placements to fetch.
     */
    orderBy?: PlacementOrderByWithRelationInput | PlacementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Placements.
     */
    cursor?: PlacementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Placements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Placements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Placements.
     */
    distinct?: PlacementScalarFieldEnum | PlacementScalarFieldEnum[]
  }

  /**
   * Placement findFirstOrThrow
   */
  export type PlacementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter, which Placement to fetch.
     */
    where?: PlacementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Placements to fetch.
     */
    orderBy?: PlacementOrderByWithRelationInput | PlacementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Placements.
     */
    cursor?: PlacementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Placements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Placements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Placements.
     */
    distinct?: PlacementScalarFieldEnum | PlacementScalarFieldEnum[]
  }

  /**
   * Placement findMany
   */
  export type PlacementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter, which Placements to fetch.
     */
    where?: PlacementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Placements to fetch.
     */
    orderBy?: PlacementOrderByWithRelationInput | PlacementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Placements.
     */
    cursor?: PlacementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Placements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Placements.
     */
    skip?: number
    distinct?: PlacementScalarFieldEnum | PlacementScalarFieldEnum[]
  }

  /**
   * Placement create
   */
  export type PlacementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * The data needed to create a Placement.
     */
    data: XOR<PlacementCreateInput, PlacementUncheckedCreateInput>
  }

  /**
   * Placement createMany
   */
  export type PlacementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Placements.
     */
    data: PlacementCreateManyInput | PlacementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Placement update
   */
  export type PlacementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * The data needed to update a Placement.
     */
    data: XOR<PlacementUpdateInput, PlacementUncheckedUpdateInput>
    /**
     * Choose, which Placement to update.
     */
    where: PlacementWhereUniqueInput
  }

  /**
   * Placement updateMany
   */
  export type PlacementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Placements.
     */
    data: XOR<PlacementUpdateManyMutationInput, PlacementUncheckedUpdateManyInput>
    /**
     * Filter which Placements to update
     */
    where?: PlacementWhereInput
    /**
     * Limit how many Placements to update.
     */
    limit?: number
  }

  /**
   * Placement upsert
   */
  export type PlacementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * The filter to search for the Placement to update in case it exists.
     */
    where: PlacementWhereUniqueInput
    /**
     * In case the Placement found by the `where` argument doesn't exist, create a new Placement with this data.
     */
    create: XOR<PlacementCreateInput, PlacementUncheckedCreateInput>
    /**
     * In case the Placement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlacementUpdateInput, PlacementUncheckedUpdateInput>
  }

  /**
   * Placement delete
   */
  export type PlacementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
    /**
     * Filter which Placement to delete.
     */
    where: PlacementWhereUniqueInput
  }

  /**
   * Placement deleteMany
   */
  export type PlacementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Placements to delete
     */
    where?: PlacementWhereInput
    /**
     * Limit how many Placements to delete.
     */
    limit?: number
  }

  /**
   * Placement without action
   */
  export type PlacementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Placement
     */
    select?: PlacementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Placement
     */
    omit?: PlacementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlacementInclude<ExtArgs> | null
  }


  /**
   * Model LocationEvent
   */

  export type AggregateLocationEvent = {
    _count: LocationEventCountAggregateOutputType | null
    _avg: LocationEventAvgAggregateOutputType | null
    _sum: LocationEventSumAggregateOutputType | null
    _min: LocationEventMinAggregateOutputType | null
    _max: LocationEventMaxAggregateOutputType | null
  }

  export type LocationEventAvgAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type LocationEventSumAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type LocationEventMinAggregateOutputType = {
    id: number | null
    locationId: number | null
    eventType: $Enums.LocationEventType | null
    routingCode: string | null
    awbNumber: string | null
    createdAt: Date | null
  }

  export type LocationEventMaxAggregateOutputType = {
    id: number | null
    locationId: number | null
    eventType: $Enums.LocationEventType | null
    routingCode: string | null
    awbNumber: string | null
    createdAt: Date | null
  }

  export type LocationEventCountAggregateOutputType = {
    id: number
    locationId: number
    eventType: number
    routingCode: number
    awbNumber: number
    createdAt: number
    _all: number
  }


  export type LocationEventAvgAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type LocationEventSumAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type LocationEventMinAggregateInputType = {
    id?: true
    locationId?: true
    eventType?: true
    routingCode?: true
    awbNumber?: true
    createdAt?: true
  }

  export type LocationEventMaxAggregateInputType = {
    id?: true
    locationId?: true
    eventType?: true
    routingCode?: true
    awbNumber?: true
    createdAt?: true
  }

  export type LocationEventCountAggregateInputType = {
    id?: true
    locationId?: true
    eventType?: true
    routingCode?: true
    awbNumber?: true
    createdAt?: true
    _all?: true
  }

  export type LocationEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationEvent to aggregate.
     */
    where?: LocationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationEvents to fetch.
     */
    orderBy?: LocationEventOrderByWithRelationInput | LocationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocationEvents
    **/
    _count?: true | LocationEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationEventMaxAggregateInputType
  }

  export type GetLocationEventAggregateType<T extends LocationEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLocationEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocationEvent[P]>
      : GetScalarType<T[P], AggregateLocationEvent[P]>
  }




  export type LocationEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationEventWhereInput
    orderBy?: LocationEventOrderByWithAggregationInput | LocationEventOrderByWithAggregationInput[]
    by: LocationEventScalarFieldEnum[] | LocationEventScalarFieldEnum
    having?: LocationEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationEventCountAggregateInputType | true
    _avg?: LocationEventAvgAggregateInputType
    _sum?: LocationEventSumAggregateInputType
    _min?: LocationEventMinAggregateInputType
    _max?: LocationEventMaxAggregateInputType
  }

  export type LocationEventGroupByOutputType = {
    id: number
    locationId: number
    eventType: $Enums.LocationEventType
    routingCode: string | null
    awbNumber: string | null
    createdAt: Date | null
    _count: LocationEventCountAggregateOutputType | null
    _avg: LocationEventAvgAggregateOutputType | null
    _sum: LocationEventSumAggregateOutputType | null
    _min: LocationEventMinAggregateOutputType | null
    _max: LocationEventMaxAggregateOutputType | null
  }

  type GetLocationEventGroupByPayload<T extends LocationEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationEventGroupByOutputType[P]>
            : GetScalarType<T[P], LocationEventGroupByOutputType[P]>
        }
      >
    >


  export type LocationEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationId?: boolean
    eventType?: boolean
    routingCode?: boolean
    awbNumber?: boolean
    createdAt?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationEvent"]>



  export type LocationEventSelectScalar = {
    id?: boolean
    locationId?: boolean
    eventType?: boolean
    routingCode?: boolean
    awbNumber?: boolean
    createdAt?: boolean
  }

  export type LocationEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "locationId" | "eventType" | "routingCode" | "awbNumber" | "createdAt", ExtArgs["result"]["locationEvent"]>
  export type LocationEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $LocationEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocationEvent"
    objects: {
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      locationId: number
      eventType: $Enums.LocationEventType
      routingCode: string | null
      awbNumber: string | null
      createdAt: Date | null
    }, ExtArgs["result"]["locationEvent"]>
    composites: {}
  }

  type LocationEventGetPayload<S extends boolean | null | undefined | LocationEventDefaultArgs> = $Result.GetResult<Prisma.$LocationEventPayload, S>

  type LocationEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationEventCountAggregateInputType | true
    }

  export interface LocationEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocationEvent'], meta: { name: 'LocationEvent' } }
    /**
     * Find zero or one LocationEvent that matches the filter.
     * @param {LocationEventFindUniqueArgs} args - Arguments to find a LocationEvent
     * @example
     * // Get one LocationEvent
     * const locationEvent = await prisma.locationEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationEventFindUniqueArgs>(args: SelectSubset<T, LocationEventFindUniqueArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocationEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationEventFindUniqueOrThrowArgs} args - Arguments to find a LocationEvent
     * @example
     * // Get one LocationEvent
     * const locationEvent = await prisma.locationEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventFindFirstArgs} args - Arguments to find a LocationEvent
     * @example
     * // Get one LocationEvent
     * const locationEvent = await prisma.locationEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationEventFindFirstArgs>(args?: SelectSubset<T, LocationEventFindFirstArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventFindFirstOrThrowArgs} args - Arguments to find a LocationEvent
     * @example
     * // Get one LocationEvent
     * const locationEvent = await prisma.locationEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocationEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocationEvents
     * const locationEvents = await prisma.locationEvent.findMany()
     * 
     * // Get first 10 LocationEvents
     * const locationEvents = await prisma.locationEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationEventWithIdOnly = await prisma.locationEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationEventFindManyArgs>(args?: SelectSubset<T, LocationEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocationEvent.
     * @param {LocationEventCreateArgs} args - Arguments to create a LocationEvent.
     * @example
     * // Create one LocationEvent
     * const LocationEvent = await prisma.locationEvent.create({
     *   data: {
     *     // ... data to create a LocationEvent
     *   }
     * })
     * 
     */
    create<T extends LocationEventCreateArgs>(args: SelectSubset<T, LocationEventCreateArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocationEvents.
     * @param {LocationEventCreateManyArgs} args - Arguments to create many LocationEvents.
     * @example
     * // Create many LocationEvents
     * const locationEvent = await prisma.locationEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationEventCreateManyArgs>(args?: SelectSubset<T, LocationEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LocationEvent.
     * @param {LocationEventDeleteArgs} args - Arguments to delete one LocationEvent.
     * @example
     * // Delete one LocationEvent
     * const LocationEvent = await prisma.locationEvent.delete({
     *   where: {
     *     // ... filter to delete one LocationEvent
     *   }
     * })
     * 
     */
    delete<T extends LocationEventDeleteArgs>(args: SelectSubset<T, LocationEventDeleteArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocationEvent.
     * @param {LocationEventUpdateArgs} args - Arguments to update one LocationEvent.
     * @example
     * // Update one LocationEvent
     * const locationEvent = await prisma.locationEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationEventUpdateArgs>(args: SelectSubset<T, LocationEventUpdateArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocationEvents.
     * @param {LocationEventDeleteManyArgs} args - Arguments to filter LocationEvents to delete.
     * @example
     * // Delete a few LocationEvents
     * const { count } = await prisma.locationEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationEventDeleteManyArgs>(args?: SelectSubset<T, LocationEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocationEvents
     * const locationEvent = await prisma.locationEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationEventUpdateManyArgs>(args: SelectSubset<T, LocationEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LocationEvent.
     * @param {LocationEventUpsertArgs} args - Arguments to update or create a LocationEvent.
     * @example
     * // Update or create a LocationEvent
     * const locationEvent = await prisma.locationEvent.upsert({
     *   create: {
     *     // ... data to create a LocationEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocationEvent we want to update
     *   }
     * })
     */
    upsert<T extends LocationEventUpsertArgs>(args: SelectSubset<T, LocationEventUpsertArgs<ExtArgs>>): Prisma__LocationEventClient<$Result.GetResult<Prisma.$LocationEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventCountArgs} args - Arguments to filter LocationEvents to count.
     * @example
     * // Count the number of LocationEvents
     * const count = await prisma.locationEvent.count({
     *   where: {
     *     // ... the filter for the LocationEvents we want to count
     *   }
     * })
    **/
    count<T extends LocationEventCountArgs>(
      args?: Subset<T, LocationEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationEventAggregateArgs>(args: Subset<T, LocationEventAggregateArgs>): Prisma.PrismaPromise<GetLocationEventAggregateType<T>>

    /**
     * Group by LocationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationEventGroupByArgs['orderBy'] }
        : { orderBy?: LocationEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocationEvent model
   */
  readonly fields: LocationEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocationEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocationEvent model
   */
  interface LocationEventFieldRefs {
    readonly id: FieldRef<"LocationEvent", 'Int'>
    readonly locationId: FieldRef<"LocationEvent", 'Int'>
    readonly eventType: FieldRef<"LocationEvent", 'LocationEventType'>
    readonly routingCode: FieldRef<"LocationEvent", 'String'>
    readonly awbNumber: FieldRef<"LocationEvent", 'String'>
    readonly createdAt: FieldRef<"LocationEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocationEvent findUnique
   */
  export type LocationEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter, which LocationEvent to fetch.
     */
    where: LocationEventWhereUniqueInput
  }

  /**
   * LocationEvent findUniqueOrThrow
   */
  export type LocationEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter, which LocationEvent to fetch.
     */
    where: LocationEventWhereUniqueInput
  }

  /**
   * LocationEvent findFirst
   */
  export type LocationEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter, which LocationEvent to fetch.
     */
    where?: LocationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationEvents to fetch.
     */
    orderBy?: LocationEventOrderByWithRelationInput | LocationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationEvents.
     */
    cursor?: LocationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationEvents.
     */
    distinct?: LocationEventScalarFieldEnum | LocationEventScalarFieldEnum[]
  }

  /**
   * LocationEvent findFirstOrThrow
   */
  export type LocationEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter, which LocationEvent to fetch.
     */
    where?: LocationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationEvents to fetch.
     */
    orderBy?: LocationEventOrderByWithRelationInput | LocationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationEvents.
     */
    cursor?: LocationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationEvents.
     */
    distinct?: LocationEventScalarFieldEnum | LocationEventScalarFieldEnum[]
  }

  /**
   * LocationEvent findMany
   */
  export type LocationEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter, which LocationEvents to fetch.
     */
    where?: LocationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationEvents to fetch.
     */
    orderBy?: LocationEventOrderByWithRelationInput | LocationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocationEvents.
     */
    cursor?: LocationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationEvents.
     */
    skip?: number
    distinct?: LocationEventScalarFieldEnum | LocationEventScalarFieldEnum[]
  }

  /**
   * LocationEvent create
   */
  export type LocationEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LocationEvent.
     */
    data: XOR<LocationEventCreateInput, LocationEventUncheckedCreateInput>
  }

  /**
   * LocationEvent createMany
   */
  export type LocationEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocationEvents.
     */
    data: LocationEventCreateManyInput | LocationEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LocationEvent update
   */
  export type LocationEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LocationEvent.
     */
    data: XOR<LocationEventUpdateInput, LocationEventUncheckedUpdateInput>
    /**
     * Choose, which LocationEvent to update.
     */
    where: LocationEventWhereUniqueInput
  }

  /**
   * LocationEvent updateMany
   */
  export type LocationEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocationEvents.
     */
    data: XOR<LocationEventUpdateManyMutationInput, LocationEventUncheckedUpdateManyInput>
    /**
     * Filter which LocationEvents to update
     */
    where?: LocationEventWhereInput
    /**
     * Limit how many LocationEvents to update.
     */
    limit?: number
  }

  /**
   * LocationEvent upsert
   */
  export type LocationEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LocationEvent to update in case it exists.
     */
    where: LocationEventWhereUniqueInput
    /**
     * In case the LocationEvent found by the `where` argument doesn't exist, create a new LocationEvent with this data.
     */
    create: XOR<LocationEventCreateInput, LocationEventUncheckedCreateInput>
    /**
     * In case the LocationEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationEventUpdateInput, LocationEventUncheckedUpdateInput>
  }

  /**
   * LocationEvent delete
   */
  export type LocationEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
    /**
     * Filter which LocationEvent to delete.
     */
    where: LocationEventWhereUniqueInput
  }

  /**
   * LocationEvent deleteMany
   */
  export type LocationEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationEvents to delete
     */
    where?: LocationEventWhereInput
    /**
     * Limit how many LocationEvents to delete.
     */
    limit?: number
  }

  /**
   * LocationEvent without action
   */
  export type LocationEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationEvent
     */
    select?: LocationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationEvent
     */
    omit?: LocationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RackScalarFieldEnum: {
    id: 'id',
    rackNumber: 'rackNumber',
    totalLevels: 'totalLevels',
    totalPositions: 'totalPositions',
    createdAt: 'createdAt'
  };

  export type RackScalarFieldEnum = (typeof RackScalarFieldEnum)[keyof typeof RackScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    rackId: 'rackId',
    level: 'level',
    position: 'position',
    locationNumber: 'locationNumber',
    barcode: 'barcode',
    lightState: 'lightState',
    currentRoutingCode: 'currentRoutingCode',
    assignmentTimestamp: 'assignmentTimestamp',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const RoutingAssignmentScalarFieldEnum: {
    id: 'id',
    routingCode: 'routingCode',
    locationId: 'locationId',
    assignedAt: 'assignedAt',
    releasedAt: 'releasedAt',
    isActive: 'isActive'
  };

  export type RoutingAssignmentScalarFieldEnum = (typeof RoutingAssignmentScalarFieldEnum)[keyof typeof RoutingAssignmentScalarFieldEnum]


  export const AwbScalarFieldEnum: {
    id: 'id',
    awbNumber: 'awbNumber',
    routingCode: 'routingCode',
    assignedLocationId: 'assignedLocationId',
    operatorColor: 'operatorColor',
    scanTimestamp: 'scanTimestamp',
    placedTimestamp: 'placedTimestamp',
    status: 'status'
  };

  export type AwbScalarFieldEnum = (typeof AwbScalarFieldEnum)[keyof typeof AwbScalarFieldEnum]


  export const PlacementScalarFieldEnum: {
    id: 'id',
    awbId: 'awbId',
    locationId: 'locationId',
    verified: 'verified',
    verifiedAt: 'verifiedAt',
    operatorId: 'operatorId'
  };

  export type PlacementScalarFieldEnum = (typeof PlacementScalarFieldEnum)[keyof typeof PlacementScalarFieldEnum]


  export const LocationEventScalarFieldEnum: {
    id: 'id',
    locationId: 'locationId',
    eventType: 'eventType',
    routingCode: 'routingCode',
    awbNumber: 'awbNumber',
    createdAt: 'createdAt'
  };

  export type LocationEventScalarFieldEnum = (typeof LocationEventScalarFieldEnum)[keyof typeof LocationEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const LocationOrderByRelevanceFieldEnum: {
    barcode: 'barcode',
    currentRoutingCode: 'currentRoutingCode'
  };

  export type LocationOrderByRelevanceFieldEnum = (typeof LocationOrderByRelevanceFieldEnum)[keyof typeof LocationOrderByRelevanceFieldEnum]


  export const RoutingAssignmentOrderByRelevanceFieldEnum: {
    routingCode: 'routingCode'
  };

  export type RoutingAssignmentOrderByRelevanceFieldEnum = (typeof RoutingAssignmentOrderByRelevanceFieldEnum)[keyof typeof RoutingAssignmentOrderByRelevanceFieldEnum]


  export const AwbOrderByRelevanceFieldEnum: {
    awbNumber: 'awbNumber',
    routingCode: 'routingCode'
  };

  export type AwbOrderByRelevanceFieldEnum = (typeof AwbOrderByRelevanceFieldEnum)[keyof typeof AwbOrderByRelevanceFieldEnum]


  export const PlacementOrderByRelevanceFieldEnum: {
    operatorId: 'operatorId'
  };

  export type PlacementOrderByRelevanceFieldEnum = (typeof PlacementOrderByRelevanceFieldEnum)[keyof typeof PlacementOrderByRelevanceFieldEnum]


  export const LocationEventOrderByRelevanceFieldEnum: {
    routingCode: 'routingCode',
    awbNumber: 'awbNumber'
  };

  export type LocationEventOrderByRelevanceFieldEnum = (typeof LocationEventOrderByRelevanceFieldEnum)[keyof typeof LocationEventOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'LightState'
   */
  export type EnumLightStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LightState'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'OperatorColor'
   */
  export type EnumOperatorColorFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OperatorColor'>
    


  /**
   * Reference to a field of type 'AwbStatus'
   */
  export type EnumAwbStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AwbStatus'>
    


  /**
   * Reference to a field of type 'LocationEventType'
   */
  export type EnumLocationEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationEventType'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type RackWhereInput = {
    AND?: RackWhereInput | RackWhereInput[]
    OR?: RackWhereInput[]
    NOT?: RackWhereInput | RackWhereInput[]
    id?: IntFilter<"Rack"> | number
    rackNumber?: IntFilter<"Rack"> | number
    totalLevels?: IntFilter<"Rack"> | number
    totalPositions?: IntFilter<"Rack"> | number
    createdAt?: DateTimeNullableFilter<"Rack"> | Date | string | null
    locations?: LocationListRelationFilter
  }

  export type RackOrderByWithRelationInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    locations?: LocationOrderByRelationAggregateInput
  }

  export type RackWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    rackNumber?: number
    AND?: RackWhereInput | RackWhereInput[]
    OR?: RackWhereInput[]
    NOT?: RackWhereInput | RackWhereInput[]
    totalLevels?: IntFilter<"Rack"> | number
    totalPositions?: IntFilter<"Rack"> | number
    createdAt?: DateTimeNullableFilter<"Rack"> | Date | string | null
    locations?: LocationListRelationFilter
  }, "id" | "rackNumber">

  export type RackOrderByWithAggregationInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: RackCountOrderByAggregateInput
    _avg?: RackAvgOrderByAggregateInput
    _max?: RackMaxOrderByAggregateInput
    _min?: RackMinOrderByAggregateInput
    _sum?: RackSumOrderByAggregateInput
  }

  export type RackScalarWhereWithAggregatesInput = {
    AND?: RackScalarWhereWithAggregatesInput | RackScalarWhereWithAggregatesInput[]
    OR?: RackScalarWhereWithAggregatesInput[]
    NOT?: RackScalarWhereWithAggregatesInput | RackScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rack"> | number
    rackNumber?: IntWithAggregatesFilter<"Rack"> | number
    totalLevels?: IntWithAggregatesFilter<"Rack"> | number
    totalPositions?: IntWithAggregatesFilter<"Rack"> | number
    createdAt?: DateTimeNullableWithAggregatesFilter<"Rack"> | Date | string | null
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: IntFilter<"Location"> | number
    rackId?: IntFilter<"Location"> | number
    level?: IntFilter<"Location"> | number
    position?: IntFilter<"Location"> | number
    locationNumber?: IntFilter<"Location"> | number
    barcode?: StringFilter<"Location"> | string
    lightState?: EnumLightStateFilter<"Location"> | $Enums.LightState
    currentRoutingCode?: StringNullableFilter<"Location"> | string | null
    assignmentTimestamp?: DateTimeNullableFilter<"Location"> | Date | string | null
    isActive?: BoolNullableFilter<"Location"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Location"> | Date | string | null
    rack?: XOR<RackScalarRelationFilter, RackWhereInput>
    routingAssignments?: RoutingAssignmentListRelationFilter
    awbs?: AwbListRelationFilter
    placements?: PlacementListRelationFilter
    events?: LocationEventListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
    barcode?: SortOrder
    lightState?: SortOrder
    currentRoutingCode?: SortOrderInput | SortOrder
    assignmentTimestamp?: SortOrderInput | SortOrder
    isActive?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    rack?: RackOrderByWithRelationInput
    routingAssignments?: RoutingAssignmentOrderByRelationAggregateInput
    awbs?: AwbOrderByRelationAggregateInput
    placements?: PlacementOrderByRelationAggregateInput
    events?: LocationEventOrderByRelationAggregateInput
    _relevance?: LocationOrderByRelevanceInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    locationNumber?: number
    barcode?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    rackId?: IntFilter<"Location"> | number
    level?: IntFilter<"Location"> | number
    position?: IntFilter<"Location"> | number
    lightState?: EnumLightStateFilter<"Location"> | $Enums.LightState
    currentRoutingCode?: StringNullableFilter<"Location"> | string | null
    assignmentTimestamp?: DateTimeNullableFilter<"Location"> | Date | string | null
    isActive?: BoolNullableFilter<"Location"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Location"> | Date | string | null
    rack?: XOR<RackScalarRelationFilter, RackWhereInput>
    routingAssignments?: RoutingAssignmentListRelationFilter
    awbs?: AwbListRelationFilter
    placements?: PlacementListRelationFilter
    events?: LocationEventListRelationFilter
  }, "id" | "locationNumber" | "barcode">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
    barcode?: SortOrder
    lightState?: SortOrder
    currentRoutingCode?: SortOrderInput | SortOrder
    assignmentTimestamp?: SortOrderInput | SortOrder
    isActive?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: LocationCountOrderByAggregateInput
    _avg?: LocationAvgOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
    _sum?: LocationSumOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Location"> | number
    rackId?: IntWithAggregatesFilter<"Location"> | number
    level?: IntWithAggregatesFilter<"Location"> | number
    position?: IntWithAggregatesFilter<"Location"> | number
    locationNumber?: IntWithAggregatesFilter<"Location"> | number
    barcode?: StringWithAggregatesFilter<"Location"> | string
    lightState?: EnumLightStateWithAggregatesFilter<"Location"> | $Enums.LightState
    currentRoutingCode?: StringNullableWithAggregatesFilter<"Location"> | string | null
    assignmentTimestamp?: DateTimeNullableWithAggregatesFilter<"Location"> | Date | string | null
    isActive?: BoolNullableWithAggregatesFilter<"Location"> | boolean | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Location"> | Date | string | null
  }

  export type RoutingAssignmentWhereInput = {
    AND?: RoutingAssignmentWhereInput | RoutingAssignmentWhereInput[]
    OR?: RoutingAssignmentWhereInput[]
    NOT?: RoutingAssignmentWhereInput | RoutingAssignmentWhereInput[]
    id?: IntFilter<"RoutingAssignment"> | number
    routingCode?: StringFilter<"RoutingAssignment"> | string
    locationId?: IntFilter<"RoutingAssignment"> | number
    assignedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    isActive?: BoolNullableFilter<"RoutingAssignment"> | boolean | null
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }

  export type RoutingAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    routingCode?: SortOrder
    locationId?: SortOrder
    assignedAt?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    isActive?: SortOrderInput | SortOrder
    location?: LocationOrderByWithRelationInput
    _relevance?: RoutingAssignmentOrderByRelevanceInput
  }

  export type RoutingAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    routingCode?: string
    AND?: RoutingAssignmentWhereInput | RoutingAssignmentWhereInput[]
    OR?: RoutingAssignmentWhereInput[]
    NOT?: RoutingAssignmentWhereInput | RoutingAssignmentWhereInput[]
    locationId?: IntFilter<"RoutingAssignment"> | number
    assignedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    isActive?: BoolNullableFilter<"RoutingAssignment"> | boolean | null
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }, "id" | "routingCode">

  export type RoutingAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    routingCode?: SortOrder
    locationId?: SortOrder
    assignedAt?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    isActive?: SortOrderInput | SortOrder
    _count?: RoutingAssignmentCountOrderByAggregateInput
    _avg?: RoutingAssignmentAvgOrderByAggregateInput
    _max?: RoutingAssignmentMaxOrderByAggregateInput
    _min?: RoutingAssignmentMinOrderByAggregateInput
    _sum?: RoutingAssignmentSumOrderByAggregateInput
  }

  export type RoutingAssignmentScalarWhereWithAggregatesInput = {
    AND?: RoutingAssignmentScalarWhereWithAggregatesInput | RoutingAssignmentScalarWhereWithAggregatesInput[]
    OR?: RoutingAssignmentScalarWhereWithAggregatesInput[]
    NOT?: RoutingAssignmentScalarWhereWithAggregatesInput | RoutingAssignmentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RoutingAssignment"> | number
    routingCode?: StringWithAggregatesFilter<"RoutingAssignment"> | string
    locationId?: IntWithAggregatesFilter<"RoutingAssignment"> | number
    assignedAt?: DateTimeNullableWithAggregatesFilter<"RoutingAssignment"> | Date | string | null
    releasedAt?: DateTimeNullableWithAggregatesFilter<"RoutingAssignment"> | Date | string | null
    isActive?: BoolNullableWithAggregatesFilter<"RoutingAssignment"> | boolean | null
  }

  export type AwbWhereInput = {
    AND?: AwbWhereInput | AwbWhereInput[]
    OR?: AwbWhereInput[]
    NOT?: AwbWhereInput | AwbWhereInput[]
    id?: IntFilter<"Awb"> | number
    awbNumber?: StringFilter<"Awb"> | string
    routingCode?: StringFilter<"Awb"> | string
    assignedLocationId?: IntFilter<"Awb"> | number
    operatorColor?: EnumOperatorColorFilter<"Awb"> | $Enums.OperatorColor
    scanTimestamp?: DateTimeFilter<"Awb"> | Date | string
    placedTimestamp?: DateTimeNullableFilter<"Awb"> | Date | string | null
    status?: EnumAwbStatusFilter<"Awb"> | $Enums.AwbStatus
    assignedLocation?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    placement?: XOR<PlacementNullableScalarRelationFilter, PlacementWhereInput> | null
  }

  export type AwbOrderByWithRelationInput = {
    id?: SortOrder
    awbNumber?: SortOrder
    routingCode?: SortOrder
    assignedLocationId?: SortOrder
    operatorColor?: SortOrder
    scanTimestamp?: SortOrder
    placedTimestamp?: SortOrderInput | SortOrder
    status?: SortOrder
    assignedLocation?: LocationOrderByWithRelationInput
    placement?: PlacementOrderByWithRelationInput
    _relevance?: AwbOrderByRelevanceInput
  }

  export type AwbWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    awbNumber?: string
    AND?: AwbWhereInput | AwbWhereInput[]
    OR?: AwbWhereInput[]
    NOT?: AwbWhereInput | AwbWhereInput[]
    routingCode?: StringFilter<"Awb"> | string
    assignedLocationId?: IntFilter<"Awb"> | number
    operatorColor?: EnumOperatorColorFilter<"Awb"> | $Enums.OperatorColor
    scanTimestamp?: DateTimeFilter<"Awb"> | Date | string
    placedTimestamp?: DateTimeNullableFilter<"Awb"> | Date | string | null
    status?: EnumAwbStatusFilter<"Awb"> | $Enums.AwbStatus
    assignedLocation?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    placement?: XOR<PlacementNullableScalarRelationFilter, PlacementWhereInput> | null
  }, "id" | "awbNumber">

  export type AwbOrderByWithAggregationInput = {
    id?: SortOrder
    awbNumber?: SortOrder
    routingCode?: SortOrder
    assignedLocationId?: SortOrder
    operatorColor?: SortOrder
    scanTimestamp?: SortOrder
    placedTimestamp?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: AwbCountOrderByAggregateInput
    _avg?: AwbAvgOrderByAggregateInput
    _max?: AwbMaxOrderByAggregateInput
    _min?: AwbMinOrderByAggregateInput
    _sum?: AwbSumOrderByAggregateInput
  }

  export type AwbScalarWhereWithAggregatesInput = {
    AND?: AwbScalarWhereWithAggregatesInput | AwbScalarWhereWithAggregatesInput[]
    OR?: AwbScalarWhereWithAggregatesInput[]
    NOT?: AwbScalarWhereWithAggregatesInput | AwbScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Awb"> | number
    awbNumber?: StringWithAggregatesFilter<"Awb"> | string
    routingCode?: StringWithAggregatesFilter<"Awb"> | string
    assignedLocationId?: IntWithAggregatesFilter<"Awb"> | number
    operatorColor?: EnumOperatorColorWithAggregatesFilter<"Awb"> | $Enums.OperatorColor
    scanTimestamp?: DateTimeWithAggregatesFilter<"Awb"> | Date | string
    placedTimestamp?: DateTimeNullableWithAggregatesFilter<"Awb"> | Date | string | null
    status?: EnumAwbStatusWithAggregatesFilter<"Awb"> | $Enums.AwbStatus
  }

  export type PlacementWhereInput = {
    AND?: PlacementWhereInput | PlacementWhereInput[]
    OR?: PlacementWhereInput[]
    NOT?: PlacementWhereInput | PlacementWhereInput[]
    id?: IntFilter<"Placement"> | number
    awbId?: IntFilter<"Placement"> | number
    locationId?: IntFilter<"Placement"> | number
    verified?: BoolNullableFilter<"Placement"> | boolean | null
    verifiedAt?: DateTimeNullableFilter<"Placement"> | Date | string | null
    operatorId?: StringNullableFilter<"Placement"> | string | null
    awb?: XOR<AwbScalarRelationFilter, AwbWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }

  export type PlacementOrderByWithRelationInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
    verified?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    operatorId?: SortOrderInput | SortOrder
    awb?: AwbOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
    _relevance?: PlacementOrderByRelevanceInput
  }

  export type PlacementWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    awbId?: number
    AND?: PlacementWhereInput | PlacementWhereInput[]
    OR?: PlacementWhereInput[]
    NOT?: PlacementWhereInput | PlacementWhereInput[]
    locationId?: IntFilter<"Placement"> | number
    verified?: BoolNullableFilter<"Placement"> | boolean | null
    verifiedAt?: DateTimeNullableFilter<"Placement"> | Date | string | null
    operatorId?: StringNullableFilter<"Placement"> | string | null
    awb?: XOR<AwbScalarRelationFilter, AwbWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }, "id" | "awbId">

  export type PlacementOrderByWithAggregationInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
    verified?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    operatorId?: SortOrderInput | SortOrder
    _count?: PlacementCountOrderByAggregateInput
    _avg?: PlacementAvgOrderByAggregateInput
    _max?: PlacementMaxOrderByAggregateInput
    _min?: PlacementMinOrderByAggregateInput
    _sum?: PlacementSumOrderByAggregateInput
  }

  export type PlacementScalarWhereWithAggregatesInput = {
    AND?: PlacementScalarWhereWithAggregatesInput | PlacementScalarWhereWithAggregatesInput[]
    OR?: PlacementScalarWhereWithAggregatesInput[]
    NOT?: PlacementScalarWhereWithAggregatesInput | PlacementScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Placement"> | number
    awbId?: IntWithAggregatesFilter<"Placement"> | number
    locationId?: IntWithAggregatesFilter<"Placement"> | number
    verified?: BoolNullableWithAggregatesFilter<"Placement"> | boolean | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"Placement"> | Date | string | null
    operatorId?: StringNullableWithAggregatesFilter<"Placement"> | string | null
  }

  export type LocationEventWhereInput = {
    AND?: LocationEventWhereInput | LocationEventWhereInput[]
    OR?: LocationEventWhereInput[]
    NOT?: LocationEventWhereInput | LocationEventWhereInput[]
    id?: IntFilter<"LocationEvent"> | number
    locationId?: IntFilter<"LocationEvent"> | number
    eventType?: EnumLocationEventTypeFilter<"LocationEvent"> | $Enums.LocationEventType
    routingCode?: StringNullableFilter<"LocationEvent"> | string | null
    awbNumber?: StringNullableFilter<"LocationEvent"> | string | null
    createdAt?: DateTimeNullableFilter<"LocationEvent"> | Date | string | null
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }

  export type LocationEventOrderByWithRelationInput = {
    id?: SortOrder
    locationId?: SortOrder
    eventType?: SortOrder
    routingCode?: SortOrderInput | SortOrder
    awbNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    location?: LocationOrderByWithRelationInput
    _relevance?: LocationEventOrderByRelevanceInput
  }

  export type LocationEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LocationEventWhereInput | LocationEventWhereInput[]
    OR?: LocationEventWhereInput[]
    NOT?: LocationEventWhereInput | LocationEventWhereInput[]
    locationId?: IntFilter<"LocationEvent"> | number
    eventType?: EnumLocationEventTypeFilter<"LocationEvent"> | $Enums.LocationEventType
    routingCode?: StringNullableFilter<"LocationEvent"> | string | null
    awbNumber?: StringNullableFilter<"LocationEvent"> | string | null
    createdAt?: DateTimeNullableFilter<"LocationEvent"> | Date | string | null
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }, "id">

  export type LocationEventOrderByWithAggregationInput = {
    id?: SortOrder
    locationId?: SortOrder
    eventType?: SortOrder
    routingCode?: SortOrderInput | SortOrder
    awbNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: LocationEventCountOrderByAggregateInput
    _avg?: LocationEventAvgOrderByAggregateInput
    _max?: LocationEventMaxOrderByAggregateInput
    _min?: LocationEventMinOrderByAggregateInput
    _sum?: LocationEventSumOrderByAggregateInput
  }

  export type LocationEventScalarWhereWithAggregatesInput = {
    AND?: LocationEventScalarWhereWithAggregatesInput | LocationEventScalarWhereWithAggregatesInput[]
    OR?: LocationEventScalarWhereWithAggregatesInput[]
    NOT?: LocationEventScalarWhereWithAggregatesInput | LocationEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocationEvent"> | number
    locationId?: IntWithAggregatesFilter<"LocationEvent"> | number
    eventType?: EnumLocationEventTypeWithAggregatesFilter<"LocationEvent"> | $Enums.LocationEventType
    routingCode?: StringNullableWithAggregatesFilter<"LocationEvent"> | string | null
    awbNumber?: StringNullableWithAggregatesFilter<"LocationEvent"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"LocationEvent"> | Date | string | null
  }

  export type RackCreateInput = {
    rackNumber: number
    totalLevels?: number
    totalPositions?: number
    createdAt?: Date | string | null
    locations?: LocationCreateNestedManyWithoutRackInput
  }

  export type RackUncheckedCreateInput = {
    id?: number
    rackNumber: number
    totalLevels?: number
    totalPositions?: number
    createdAt?: Date | string | null
    locations?: LocationUncheckedCreateNestedManyWithoutRackInput
  }

  export type RackUpdateInput = {
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locations?: LocationUpdateManyWithoutRackNestedInput
  }

  export type RackUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locations?: LocationUncheckedUpdateManyWithoutRackNestedInput
  }

  export type RackCreateManyInput = {
    id?: number
    rackNumber: number
    totalLevels?: number
    totalPositions?: number
    createdAt?: Date | string | null
  }

  export type RackUpdateManyMutationInput = {
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RackUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationCreateInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    rack: RackCreateNestedOneWithoutLocationsInput
    routingAssignments?: RoutingAssignmentCreateNestedManyWithoutLocationInput
    awbs?: AwbCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementCreateNestedManyWithoutLocationInput
    events?: LocationEventCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput
    awbs?: AwbUncheckedCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementUncheckedCreateNestedManyWithoutLocationInput
    events?: LocationEventUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationUpdateInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rack?: RackUpdateOneRequiredWithoutLocationsNestedInput
    routingAssignments?: RoutingAssignmentUpdateManyWithoutLocationNestedInput
    awbs?: AwbUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUpdateManyWithoutLocationNestedInput
    events?: LocationEventUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput
    awbs?: AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUncheckedUpdateManyWithoutLocationNestedInput
    events?: LocationEventUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
  }

  export type LocationUpdateManyMutationInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoutingAssignmentCreateInput = {
    routingCode: string
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
    location: LocationCreateNestedOneWithoutRoutingAssignmentsInput
  }

  export type RoutingAssignmentUncheckedCreateInput = {
    id?: number
    routingCode: string
    locationId: number
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
  }

  export type RoutingAssignmentUpdateInput = {
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    location?: LocationUpdateOneRequiredWithoutRoutingAssignmentsNestedInput
  }

  export type RoutingAssignmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    routingCode?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoutingAssignmentCreateManyInput = {
    id?: number
    routingCode: string
    locationId: number
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
  }

  export type RoutingAssignmentUpdateManyMutationInput = {
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoutingAssignmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    routingCode?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type AwbCreateInput = {
    awbNumber: string
    routingCode: string
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
    assignedLocation: LocationCreateNestedOneWithoutAwbsInput
    placement?: PlacementCreateNestedOneWithoutAwbInput
  }

  export type AwbUncheckedCreateInput = {
    id?: number
    awbNumber: string
    routingCode: string
    assignedLocationId: number
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
    placement?: PlacementUncheckedCreateNestedOneWithoutAwbInput
  }

  export type AwbUpdateInput = {
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
    assignedLocation?: LocationUpdateOneRequiredWithoutAwbsNestedInput
    placement?: PlacementUpdateOneWithoutAwbNestedInput
  }

  export type AwbUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedLocationId?: IntFieldUpdateOperationsInput | number
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
    placement?: PlacementUncheckedUpdateOneWithoutAwbNestedInput
  }

  export type AwbCreateManyInput = {
    id?: number
    awbNumber: string
    routingCode: string
    assignedLocationId: number
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
  }

  export type AwbUpdateManyMutationInput = {
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
  }

  export type AwbUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedLocationId?: IntFieldUpdateOperationsInput | number
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
  }

  export type PlacementCreateInput = {
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
    awb: AwbCreateNestedOneWithoutPlacementInput
    location: LocationCreateNestedOneWithoutPlacementsInput
  }

  export type PlacementUncheckedCreateInput = {
    id?: number
    awbId: number
    locationId: number
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
  }

  export type PlacementUpdateInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: AwbUpdateOneRequiredWithoutPlacementNestedInput
    location?: LocationUpdateOneRequiredWithoutPlacementsNestedInput
  }

  export type PlacementUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbId?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlacementCreateManyInput = {
    id?: number
    awbId: number
    locationId: number
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
  }

  export type PlacementUpdateManyMutationInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlacementUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbId?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationEventCreateInput = {
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
    location: LocationCreateNestedOneWithoutEventsInput
  }

  export type LocationEventUncheckedCreateInput = {
    id?: number
    locationId: number
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
  }

  export type LocationEventUpdateInput = {
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: LocationUpdateOneRequiredWithoutEventsNestedInput
  }

  export type LocationEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationEventCreateManyInput = {
    id?: number
    locationId: number
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
  }

  export type LocationEventUpdateManyMutationInput = {
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type LocationListRelationFilter = {
    every?: LocationWhereInput
    some?: LocationWhereInput
    none?: LocationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RackCountOrderByAggregateInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
    createdAt?: SortOrder
  }

  export type RackAvgOrderByAggregateInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
  }

  export type RackMaxOrderByAggregateInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
    createdAt?: SortOrder
  }

  export type RackMinOrderByAggregateInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
    createdAt?: SortOrder
  }

  export type RackSumOrderByAggregateInput = {
    id?: SortOrder
    rackNumber?: SortOrder
    totalLevels?: SortOrder
    totalPositions?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumLightStateFilter<$PrismaModel = never> = {
    equals?: $Enums.LightState | EnumLightStateFieldRefInput<$PrismaModel>
    in?: $Enums.LightState[]
    notIn?: $Enums.LightState[]
    not?: NestedEnumLightStateFilter<$PrismaModel> | $Enums.LightState
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type RackScalarRelationFilter = {
    is?: RackWhereInput
    isNot?: RackWhereInput
  }

  export type RoutingAssignmentListRelationFilter = {
    every?: RoutingAssignmentWhereInput
    some?: RoutingAssignmentWhereInput
    none?: RoutingAssignmentWhereInput
  }

  export type AwbListRelationFilter = {
    every?: AwbWhereInput
    some?: AwbWhereInput
    none?: AwbWhereInput
  }

  export type PlacementListRelationFilter = {
    every?: PlacementWhereInput
    some?: PlacementWhereInput
    none?: PlacementWhereInput
  }

  export type LocationEventListRelationFilter = {
    every?: LocationEventWhereInput
    some?: LocationEventWhereInput
    none?: LocationEventWhereInput
  }

  export type RoutingAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AwbOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlacementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationOrderByRelevanceInput = {
    fields: LocationOrderByRelevanceFieldEnum | LocationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
    barcode?: SortOrder
    lightState?: SortOrder
    currentRoutingCode?: SortOrder
    assignmentTimestamp?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationAvgOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
    barcode?: SortOrder
    lightState?: SortOrder
    currentRoutingCode?: SortOrder
    assignmentTimestamp?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
    barcode?: SortOrder
    lightState?: SortOrder
    currentRoutingCode?: SortOrder
    assignmentTimestamp?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationSumOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    position?: SortOrder
    locationNumber?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumLightStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LightState | EnumLightStateFieldRefInput<$PrismaModel>
    in?: $Enums.LightState[]
    notIn?: $Enums.LightState[]
    not?: NestedEnumLightStateWithAggregatesFilter<$PrismaModel> | $Enums.LightState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLightStateFilter<$PrismaModel>
    _max?: NestedEnumLightStateFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type LocationScalarRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type RoutingAssignmentOrderByRelevanceInput = {
    fields: RoutingAssignmentOrderByRelevanceFieldEnum | RoutingAssignmentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RoutingAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    routingCode?: SortOrder
    locationId?: SortOrder
    assignedAt?: SortOrder
    releasedAt?: SortOrder
    isActive?: SortOrder
  }

  export type RoutingAssignmentAvgOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type RoutingAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    routingCode?: SortOrder
    locationId?: SortOrder
    assignedAt?: SortOrder
    releasedAt?: SortOrder
    isActive?: SortOrder
  }

  export type RoutingAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    routingCode?: SortOrder
    locationId?: SortOrder
    assignedAt?: SortOrder
    releasedAt?: SortOrder
    isActive?: SortOrder
  }

  export type RoutingAssignmentSumOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type EnumOperatorColorFilter<$PrismaModel = never> = {
    equals?: $Enums.OperatorColor | EnumOperatorColorFieldRefInput<$PrismaModel>
    in?: $Enums.OperatorColor[]
    notIn?: $Enums.OperatorColor[]
    not?: NestedEnumOperatorColorFilter<$PrismaModel> | $Enums.OperatorColor
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumAwbStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AwbStatus | EnumAwbStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AwbStatus[]
    notIn?: $Enums.AwbStatus[]
    not?: NestedEnumAwbStatusFilter<$PrismaModel> | $Enums.AwbStatus
  }

  export type PlacementNullableScalarRelationFilter = {
    is?: PlacementWhereInput | null
    isNot?: PlacementWhereInput | null
  }

  export type AwbOrderByRelevanceInput = {
    fields: AwbOrderByRelevanceFieldEnum | AwbOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AwbCountOrderByAggregateInput = {
    id?: SortOrder
    awbNumber?: SortOrder
    routingCode?: SortOrder
    assignedLocationId?: SortOrder
    operatorColor?: SortOrder
    scanTimestamp?: SortOrder
    placedTimestamp?: SortOrder
    status?: SortOrder
  }

  export type AwbAvgOrderByAggregateInput = {
    id?: SortOrder
    assignedLocationId?: SortOrder
  }

  export type AwbMaxOrderByAggregateInput = {
    id?: SortOrder
    awbNumber?: SortOrder
    routingCode?: SortOrder
    assignedLocationId?: SortOrder
    operatorColor?: SortOrder
    scanTimestamp?: SortOrder
    placedTimestamp?: SortOrder
    status?: SortOrder
  }

  export type AwbMinOrderByAggregateInput = {
    id?: SortOrder
    awbNumber?: SortOrder
    routingCode?: SortOrder
    assignedLocationId?: SortOrder
    operatorColor?: SortOrder
    scanTimestamp?: SortOrder
    placedTimestamp?: SortOrder
    status?: SortOrder
  }

  export type AwbSumOrderByAggregateInput = {
    id?: SortOrder
    assignedLocationId?: SortOrder
  }

  export type EnumOperatorColorWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OperatorColor | EnumOperatorColorFieldRefInput<$PrismaModel>
    in?: $Enums.OperatorColor[]
    notIn?: $Enums.OperatorColor[]
    not?: NestedEnumOperatorColorWithAggregatesFilter<$PrismaModel> | $Enums.OperatorColor
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOperatorColorFilter<$PrismaModel>
    _max?: NestedEnumOperatorColorFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumAwbStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AwbStatus | EnumAwbStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AwbStatus[]
    notIn?: $Enums.AwbStatus[]
    not?: NestedEnumAwbStatusWithAggregatesFilter<$PrismaModel> | $Enums.AwbStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAwbStatusFilter<$PrismaModel>
    _max?: NestedEnumAwbStatusFilter<$PrismaModel>
  }

  export type AwbScalarRelationFilter = {
    is?: AwbWhereInput
    isNot?: AwbWhereInput
  }

  export type PlacementOrderByRelevanceInput = {
    fields: PlacementOrderByRelevanceFieldEnum | PlacementOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlacementCountOrderByAggregateInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
    verified?: SortOrder
    verifiedAt?: SortOrder
    operatorId?: SortOrder
  }

  export type PlacementAvgOrderByAggregateInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
  }

  export type PlacementMaxOrderByAggregateInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
    verified?: SortOrder
    verifiedAt?: SortOrder
    operatorId?: SortOrder
  }

  export type PlacementMinOrderByAggregateInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
    verified?: SortOrder
    verifiedAt?: SortOrder
    operatorId?: SortOrder
  }

  export type PlacementSumOrderByAggregateInput = {
    id?: SortOrder
    awbId?: SortOrder
    locationId?: SortOrder
  }

  export type EnumLocationEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationEventType | EnumLocationEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationEventType[]
    notIn?: $Enums.LocationEventType[]
    not?: NestedEnumLocationEventTypeFilter<$PrismaModel> | $Enums.LocationEventType
  }

  export type LocationEventOrderByRelevanceInput = {
    fields: LocationEventOrderByRelevanceFieldEnum | LocationEventOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LocationEventCountOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    eventType?: SortOrder
    routingCode?: SortOrder
    awbNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationEventAvgOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type LocationEventMaxOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    eventType?: SortOrder
    routingCode?: SortOrder
    awbNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationEventMinOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    eventType?: SortOrder
    routingCode?: SortOrder
    awbNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationEventSumOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type EnumLocationEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationEventType | EnumLocationEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationEventType[]
    notIn?: $Enums.LocationEventType[]
    not?: NestedEnumLocationEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.LocationEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationEventTypeFilter<$PrismaModel>
    _max?: NestedEnumLocationEventTypeFilter<$PrismaModel>
  }

  export type LocationCreateNestedManyWithoutRackInput = {
    create?: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput> | LocationCreateWithoutRackInput[] | LocationUncheckedCreateWithoutRackInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRackInput | LocationCreateOrConnectWithoutRackInput[]
    createMany?: LocationCreateManyRackInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type LocationUncheckedCreateNestedManyWithoutRackInput = {
    create?: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput> | LocationCreateWithoutRackInput[] | LocationUncheckedCreateWithoutRackInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRackInput | LocationCreateOrConnectWithoutRackInput[]
    createMany?: LocationCreateManyRackInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LocationUpdateManyWithoutRackNestedInput = {
    create?: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput> | LocationCreateWithoutRackInput[] | LocationUncheckedCreateWithoutRackInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRackInput | LocationCreateOrConnectWithoutRackInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutRackInput | LocationUpsertWithWhereUniqueWithoutRackInput[]
    createMany?: LocationCreateManyRackInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutRackInput | LocationUpdateWithWhereUniqueWithoutRackInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutRackInput | LocationUpdateManyWithWhereWithoutRackInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type LocationUncheckedUpdateManyWithoutRackNestedInput = {
    create?: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput> | LocationCreateWithoutRackInput[] | LocationUncheckedCreateWithoutRackInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRackInput | LocationCreateOrConnectWithoutRackInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutRackInput | LocationUpsertWithWhereUniqueWithoutRackInput[]
    createMany?: LocationCreateManyRackInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutRackInput | LocationUpdateWithWhereUniqueWithoutRackInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutRackInput | LocationUpdateManyWithWhereWithoutRackInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type RackCreateNestedOneWithoutLocationsInput = {
    create?: XOR<RackCreateWithoutLocationsInput, RackUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: RackCreateOrConnectWithoutLocationsInput
    connect?: RackWhereUniqueInput
  }

  export type RoutingAssignmentCreateNestedManyWithoutLocationInput = {
    create?: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput> | RoutingAssignmentCreateWithoutLocationInput[] | RoutingAssignmentUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RoutingAssignmentCreateOrConnectWithoutLocationInput | RoutingAssignmentCreateOrConnectWithoutLocationInput[]
    createMany?: RoutingAssignmentCreateManyLocationInputEnvelope
    connect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
  }

  export type AwbCreateNestedManyWithoutAssignedLocationInput = {
    create?: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput> | AwbCreateWithoutAssignedLocationInput[] | AwbUncheckedCreateWithoutAssignedLocationInput[]
    connectOrCreate?: AwbCreateOrConnectWithoutAssignedLocationInput | AwbCreateOrConnectWithoutAssignedLocationInput[]
    createMany?: AwbCreateManyAssignedLocationInputEnvelope
    connect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
  }

  export type PlacementCreateNestedManyWithoutLocationInput = {
    create?: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput> | PlacementCreateWithoutLocationInput[] | PlacementUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PlacementCreateOrConnectWithoutLocationInput | PlacementCreateOrConnectWithoutLocationInput[]
    createMany?: PlacementCreateManyLocationInputEnvelope
    connect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
  }

  export type LocationEventCreateNestedManyWithoutLocationInput = {
    create?: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput> | LocationEventCreateWithoutLocationInput[] | LocationEventUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: LocationEventCreateOrConnectWithoutLocationInput | LocationEventCreateOrConnectWithoutLocationInput[]
    createMany?: LocationEventCreateManyLocationInputEnvelope
    connect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
  }

  export type RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput> | RoutingAssignmentCreateWithoutLocationInput[] | RoutingAssignmentUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RoutingAssignmentCreateOrConnectWithoutLocationInput | RoutingAssignmentCreateOrConnectWithoutLocationInput[]
    createMany?: RoutingAssignmentCreateManyLocationInputEnvelope
    connect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
  }

  export type AwbUncheckedCreateNestedManyWithoutAssignedLocationInput = {
    create?: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput> | AwbCreateWithoutAssignedLocationInput[] | AwbUncheckedCreateWithoutAssignedLocationInput[]
    connectOrCreate?: AwbCreateOrConnectWithoutAssignedLocationInput | AwbCreateOrConnectWithoutAssignedLocationInput[]
    createMany?: AwbCreateManyAssignedLocationInputEnvelope
    connect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
  }

  export type PlacementUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput> | PlacementCreateWithoutLocationInput[] | PlacementUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PlacementCreateOrConnectWithoutLocationInput | PlacementCreateOrConnectWithoutLocationInput[]
    createMany?: PlacementCreateManyLocationInputEnvelope
    connect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
  }

  export type LocationEventUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput> | LocationEventCreateWithoutLocationInput[] | LocationEventUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: LocationEventCreateOrConnectWithoutLocationInput | LocationEventCreateOrConnectWithoutLocationInput[]
    createMany?: LocationEventCreateManyLocationInputEnvelope
    connect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumLightStateFieldUpdateOperationsInput = {
    set?: $Enums.LightState
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type RackUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<RackCreateWithoutLocationsInput, RackUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: RackCreateOrConnectWithoutLocationsInput
    upsert?: RackUpsertWithoutLocationsInput
    connect?: RackWhereUniqueInput
    update?: XOR<XOR<RackUpdateToOneWithWhereWithoutLocationsInput, RackUpdateWithoutLocationsInput>, RackUncheckedUpdateWithoutLocationsInput>
  }

  export type RoutingAssignmentUpdateManyWithoutLocationNestedInput = {
    create?: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput> | RoutingAssignmentCreateWithoutLocationInput[] | RoutingAssignmentUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RoutingAssignmentCreateOrConnectWithoutLocationInput | RoutingAssignmentCreateOrConnectWithoutLocationInput[]
    upsert?: RoutingAssignmentUpsertWithWhereUniqueWithoutLocationInput | RoutingAssignmentUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: RoutingAssignmentCreateManyLocationInputEnvelope
    set?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    disconnect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    delete?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    connect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    update?: RoutingAssignmentUpdateWithWhereUniqueWithoutLocationInput | RoutingAssignmentUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: RoutingAssignmentUpdateManyWithWhereWithoutLocationInput | RoutingAssignmentUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: RoutingAssignmentScalarWhereInput | RoutingAssignmentScalarWhereInput[]
  }

  export type AwbUpdateManyWithoutAssignedLocationNestedInput = {
    create?: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput> | AwbCreateWithoutAssignedLocationInput[] | AwbUncheckedCreateWithoutAssignedLocationInput[]
    connectOrCreate?: AwbCreateOrConnectWithoutAssignedLocationInput | AwbCreateOrConnectWithoutAssignedLocationInput[]
    upsert?: AwbUpsertWithWhereUniqueWithoutAssignedLocationInput | AwbUpsertWithWhereUniqueWithoutAssignedLocationInput[]
    createMany?: AwbCreateManyAssignedLocationInputEnvelope
    set?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    disconnect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    delete?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    connect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    update?: AwbUpdateWithWhereUniqueWithoutAssignedLocationInput | AwbUpdateWithWhereUniqueWithoutAssignedLocationInput[]
    updateMany?: AwbUpdateManyWithWhereWithoutAssignedLocationInput | AwbUpdateManyWithWhereWithoutAssignedLocationInput[]
    deleteMany?: AwbScalarWhereInput | AwbScalarWhereInput[]
  }

  export type PlacementUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput> | PlacementCreateWithoutLocationInput[] | PlacementUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PlacementCreateOrConnectWithoutLocationInput | PlacementCreateOrConnectWithoutLocationInput[]
    upsert?: PlacementUpsertWithWhereUniqueWithoutLocationInput | PlacementUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PlacementCreateManyLocationInputEnvelope
    set?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    disconnect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    delete?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    connect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    update?: PlacementUpdateWithWhereUniqueWithoutLocationInput | PlacementUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PlacementUpdateManyWithWhereWithoutLocationInput | PlacementUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PlacementScalarWhereInput | PlacementScalarWhereInput[]
  }

  export type LocationEventUpdateManyWithoutLocationNestedInput = {
    create?: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput> | LocationEventCreateWithoutLocationInput[] | LocationEventUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: LocationEventCreateOrConnectWithoutLocationInput | LocationEventCreateOrConnectWithoutLocationInput[]
    upsert?: LocationEventUpsertWithWhereUniqueWithoutLocationInput | LocationEventUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: LocationEventCreateManyLocationInputEnvelope
    set?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    disconnect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    delete?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    connect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    update?: LocationEventUpdateWithWhereUniqueWithoutLocationInput | LocationEventUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: LocationEventUpdateManyWithWhereWithoutLocationInput | LocationEventUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: LocationEventScalarWhereInput | LocationEventScalarWhereInput[]
  }

  export type RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput> | RoutingAssignmentCreateWithoutLocationInput[] | RoutingAssignmentUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RoutingAssignmentCreateOrConnectWithoutLocationInput | RoutingAssignmentCreateOrConnectWithoutLocationInput[]
    upsert?: RoutingAssignmentUpsertWithWhereUniqueWithoutLocationInput | RoutingAssignmentUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: RoutingAssignmentCreateManyLocationInputEnvelope
    set?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    disconnect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    delete?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    connect?: RoutingAssignmentWhereUniqueInput | RoutingAssignmentWhereUniqueInput[]
    update?: RoutingAssignmentUpdateWithWhereUniqueWithoutLocationInput | RoutingAssignmentUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: RoutingAssignmentUpdateManyWithWhereWithoutLocationInput | RoutingAssignmentUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: RoutingAssignmentScalarWhereInput | RoutingAssignmentScalarWhereInput[]
  }

  export type AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput = {
    create?: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput> | AwbCreateWithoutAssignedLocationInput[] | AwbUncheckedCreateWithoutAssignedLocationInput[]
    connectOrCreate?: AwbCreateOrConnectWithoutAssignedLocationInput | AwbCreateOrConnectWithoutAssignedLocationInput[]
    upsert?: AwbUpsertWithWhereUniqueWithoutAssignedLocationInput | AwbUpsertWithWhereUniqueWithoutAssignedLocationInput[]
    createMany?: AwbCreateManyAssignedLocationInputEnvelope
    set?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    disconnect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    delete?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    connect?: AwbWhereUniqueInput | AwbWhereUniqueInput[]
    update?: AwbUpdateWithWhereUniqueWithoutAssignedLocationInput | AwbUpdateWithWhereUniqueWithoutAssignedLocationInput[]
    updateMany?: AwbUpdateManyWithWhereWithoutAssignedLocationInput | AwbUpdateManyWithWhereWithoutAssignedLocationInput[]
    deleteMany?: AwbScalarWhereInput | AwbScalarWhereInput[]
  }

  export type PlacementUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput> | PlacementCreateWithoutLocationInput[] | PlacementUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PlacementCreateOrConnectWithoutLocationInput | PlacementCreateOrConnectWithoutLocationInput[]
    upsert?: PlacementUpsertWithWhereUniqueWithoutLocationInput | PlacementUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PlacementCreateManyLocationInputEnvelope
    set?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    disconnect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    delete?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    connect?: PlacementWhereUniqueInput | PlacementWhereUniqueInput[]
    update?: PlacementUpdateWithWhereUniqueWithoutLocationInput | PlacementUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PlacementUpdateManyWithWhereWithoutLocationInput | PlacementUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PlacementScalarWhereInput | PlacementScalarWhereInput[]
  }

  export type LocationEventUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput> | LocationEventCreateWithoutLocationInput[] | LocationEventUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: LocationEventCreateOrConnectWithoutLocationInput | LocationEventCreateOrConnectWithoutLocationInput[]
    upsert?: LocationEventUpsertWithWhereUniqueWithoutLocationInput | LocationEventUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: LocationEventCreateManyLocationInputEnvelope
    set?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    disconnect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    delete?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    connect?: LocationEventWhereUniqueInput | LocationEventWhereUniqueInput[]
    update?: LocationEventUpdateWithWhereUniqueWithoutLocationInput | LocationEventUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: LocationEventUpdateManyWithWhereWithoutLocationInput | LocationEventUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: LocationEventScalarWhereInput | LocationEventScalarWhereInput[]
  }

  export type LocationCreateNestedOneWithoutRoutingAssignmentsInput = {
    create?: XOR<LocationCreateWithoutRoutingAssignmentsInput, LocationUncheckedCreateWithoutRoutingAssignmentsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutRoutingAssignmentsInput
    connect?: LocationWhereUniqueInput
  }

  export type LocationUpdateOneRequiredWithoutRoutingAssignmentsNestedInput = {
    create?: XOR<LocationCreateWithoutRoutingAssignmentsInput, LocationUncheckedCreateWithoutRoutingAssignmentsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutRoutingAssignmentsInput
    upsert?: LocationUpsertWithoutRoutingAssignmentsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutRoutingAssignmentsInput, LocationUpdateWithoutRoutingAssignmentsInput>, LocationUncheckedUpdateWithoutRoutingAssignmentsInput>
  }

  export type LocationCreateNestedOneWithoutAwbsInput = {
    create?: XOR<LocationCreateWithoutAwbsInput, LocationUncheckedCreateWithoutAwbsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutAwbsInput
    connect?: LocationWhereUniqueInput
  }

  export type PlacementCreateNestedOneWithoutAwbInput = {
    create?: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
    connectOrCreate?: PlacementCreateOrConnectWithoutAwbInput
    connect?: PlacementWhereUniqueInput
  }

  export type PlacementUncheckedCreateNestedOneWithoutAwbInput = {
    create?: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
    connectOrCreate?: PlacementCreateOrConnectWithoutAwbInput
    connect?: PlacementWhereUniqueInput
  }

  export type EnumOperatorColorFieldUpdateOperationsInput = {
    set?: $Enums.OperatorColor
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumAwbStatusFieldUpdateOperationsInput = {
    set?: $Enums.AwbStatus
  }

  export type LocationUpdateOneRequiredWithoutAwbsNestedInput = {
    create?: XOR<LocationCreateWithoutAwbsInput, LocationUncheckedCreateWithoutAwbsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutAwbsInput
    upsert?: LocationUpsertWithoutAwbsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutAwbsInput, LocationUpdateWithoutAwbsInput>, LocationUncheckedUpdateWithoutAwbsInput>
  }

  export type PlacementUpdateOneWithoutAwbNestedInput = {
    create?: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
    connectOrCreate?: PlacementCreateOrConnectWithoutAwbInput
    upsert?: PlacementUpsertWithoutAwbInput
    disconnect?: PlacementWhereInput | boolean
    delete?: PlacementWhereInput | boolean
    connect?: PlacementWhereUniqueInput
    update?: XOR<XOR<PlacementUpdateToOneWithWhereWithoutAwbInput, PlacementUpdateWithoutAwbInput>, PlacementUncheckedUpdateWithoutAwbInput>
  }

  export type PlacementUncheckedUpdateOneWithoutAwbNestedInput = {
    create?: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
    connectOrCreate?: PlacementCreateOrConnectWithoutAwbInput
    upsert?: PlacementUpsertWithoutAwbInput
    disconnect?: PlacementWhereInput | boolean
    delete?: PlacementWhereInput | boolean
    connect?: PlacementWhereUniqueInput
    update?: XOR<XOR<PlacementUpdateToOneWithWhereWithoutAwbInput, PlacementUpdateWithoutAwbInput>, PlacementUncheckedUpdateWithoutAwbInput>
  }

  export type AwbCreateNestedOneWithoutPlacementInput = {
    create?: XOR<AwbCreateWithoutPlacementInput, AwbUncheckedCreateWithoutPlacementInput>
    connectOrCreate?: AwbCreateOrConnectWithoutPlacementInput
    connect?: AwbWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutPlacementsInput = {
    create?: XOR<LocationCreateWithoutPlacementsInput, LocationUncheckedCreateWithoutPlacementsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPlacementsInput
    connect?: LocationWhereUniqueInput
  }

  export type AwbUpdateOneRequiredWithoutPlacementNestedInput = {
    create?: XOR<AwbCreateWithoutPlacementInput, AwbUncheckedCreateWithoutPlacementInput>
    connectOrCreate?: AwbCreateOrConnectWithoutPlacementInput
    upsert?: AwbUpsertWithoutPlacementInput
    connect?: AwbWhereUniqueInput
    update?: XOR<XOR<AwbUpdateToOneWithWhereWithoutPlacementInput, AwbUpdateWithoutPlacementInput>, AwbUncheckedUpdateWithoutPlacementInput>
  }

  export type LocationUpdateOneRequiredWithoutPlacementsNestedInput = {
    create?: XOR<LocationCreateWithoutPlacementsInput, LocationUncheckedCreateWithoutPlacementsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPlacementsInput
    upsert?: LocationUpsertWithoutPlacementsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutPlacementsInput, LocationUpdateWithoutPlacementsInput>, LocationUncheckedUpdateWithoutPlacementsInput>
  }

  export type LocationCreateNestedOneWithoutEventsInput = {
    create?: XOR<LocationCreateWithoutEventsInput, LocationUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutEventsInput
    connect?: LocationWhereUniqueInput
  }

  export type EnumLocationEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.LocationEventType
  }

  export type LocationUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<LocationCreateWithoutEventsInput, LocationUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutEventsInput
    upsert?: LocationUpsertWithoutEventsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutEventsInput, LocationUpdateWithoutEventsInput>, LocationUncheckedUpdateWithoutEventsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumLightStateFilter<$PrismaModel = never> = {
    equals?: $Enums.LightState | EnumLightStateFieldRefInput<$PrismaModel>
    in?: $Enums.LightState[]
    notIn?: $Enums.LightState[]
    not?: NestedEnumLightStateFilter<$PrismaModel> | $Enums.LightState
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumLightStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LightState | EnumLightStateFieldRefInput<$PrismaModel>
    in?: $Enums.LightState[]
    notIn?: $Enums.LightState[]
    not?: NestedEnumLightStateWithAggregatesFilter<$PrismaModel> | $Enums.LightState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLightStateFilter<$PrismaModel>
    _max?: NestedEnumLightStateFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumOperatorColorFilter<$PrismaModel = never> = {
    equals?: $Enums.OperatorColor | EnumOperatorColorFieldRefInput<$PrismaModel>
    in?: $Enums.OperatorColor[]
    notIn?: $Enums.OperatorColor[]
    not?: NestedEnumOperatorColorFilter<$PrismaModel> | $Enums.OperatorColor
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumAwbStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AwbStatus | EnumAwbStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AwbStatus[]
    notIn?: $Enums.AwbStatus[]
    not?: NestedEnumAwbStatusFilter<$PrismaModel> | $Enums.AwbStatus
  }

  export type NestedEnumOperatorColorWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OperatorColor | EnumOperatorColorFieldRefInput<$PrismaModel>
    in?: $Enums.OperatorColor[]
    notIn?: $Enums.OperatorColor[]
    not?: NestedEnumOperatorColorWithAggregatesFilter<$PrismaModel> | $Enums.OperatorColor
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOperatorColorFilter<$PrismaModel>
    _max?: NestedEnumOperatorColorFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumAwbStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AwbStatus | EnumAwbStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AwbStatus[]
    notIn?: $Enums.AwbStatus[]
    not?: NestedEnumAwbStatusWithAggregatesFilter<$PrismaModel> | $Enums.AwbStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAwbStatusFilter<$PrismaModel>
    _max?: NestedEnumAwbStatusFilter<$PrismaModel>
  }

  export type NestedEnumLocationEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationEventType | EnumLocationEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationEventType[]
    notIn?: $Enums.LocationEventType[]
    not?: NestedEnumLocationEventTypeFilter<$PrismaModel> | $Enums.LocationEventType
  }

  export type NestedEnumLocationEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationEventType | EnumLocationEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationEventType[]
    notIn?: $Enums.LocationEventType[]
    not?: NestedEnumLocationEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.LocationEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationEventTypeFilter<$PrismaModel>
    _max?: NestedEnumLocationEventTypeFilter<$PrismaModel>
  }

  export type LocationCreateWithoutRackInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentCreateNestedManyWithoutLocationInput
    awbs?: AwbCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementCreateNestedManyWithoutLocationInput
    events?: LocationEventCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutRackInput = {
    id?: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput
    awbs?: AwbUncheckedCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementUncheckedCreateNestedManyWithoutLocationInput
    events?: LocationEventUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutRackInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput>
  }

  export type LocationCreateManyRackInputEnvelope = {
    data: LocationCreateManyRackInput | LocationCreateManyRackInput[]
    skipDuplicates?: boolean
  }

  export type LocationUpsertWithWhereUniqueWithoutRackInput = {
    where: LocationWhereUniqueInput
    update: XOR<LocationUpdateWithoutRackInput, LocationUncheckedUpdateWithoutRackInput>
    create: XOR<LocationCreateWithoutRackInput, LocationUncheckedCreateWithoutRackInput>
  }

  export type LocationUpdateWithWhereUniqueWithoutRackInput = {
    where: LocationWhereUniqueInput
    data: XOR<LocationUpdateWithoutRackInput, LocationUncheckedUpdateWithoutRackInput>
  }

  export type LocationUpdateManyWithWhereWithoutRackInput = {
    where: LocationScalarWhereInput
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyWithoutRackInput>
  }

  export type LocationScalarWhereInput = {
    AND?: LocationScalarWhereInput | LocationScalarWhereInput[]
    OR?: LocationScalarWhereInput[]
    NOT?: LocationScalarWhereInput | LocationScalarWhereInput[]
    id?: IntFilter<"Location"> | number
    rackId?: IntFilter<"Location"> | number
    level?: IntFilter<"Location"> | number
    position?: IntFilter<"Location"> | number
    locationNumber?: IntFilter<"Location"> | number
    barcode?: StringFilter<"Location"> | string
    lightState?: EnumLightStateFilter<"Location"> | $Enums.LightState
    currentRoutingCode?: StringNullableFilter<"Location"> | string | null
    assignmentTimestamp?: DateTimeNullableFilter<"Location"> | Date | string | null
    isActive?: BoolNullableFilter<"Location"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Location"> | Date | string | null
  }

  export type RackCreateWithoutLocationsInput = {
    rackNumber: number
    totalLevels?: number
    totalPositions?: number
    createdAt?: Date | string | null
  }

  export type RackUncheckedCreateWithoutLocationsInput = {
    id?: number
    rackNumber: number
    totalLevels?: number
    totalPositions?: number
    createdAt?: Date | string | null
  }

  export type RackCreateOrConnectWithoutLocationsInput = {
    where: RackWhereUniqueInput
    create: XOR<RackCreateWithoutLocationsInput, RackUncheckedCreateWithoutLocationsInput>
  }

  export type RoutingAssignmentCreateWithoutLocationInput = {
    routingCode: string
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
  }

  export type RoutingAssignmentUncheckedCreateWithoutLocationInput = {
    id?: number
    routingCode: string
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
  }

  export type RoutingAssignmentCreateOrConnectWithoutLocationInput = {
    where: RoutingAssignmentWhereUniqueInput
    create: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput>
  }

  export type RoutingAssignmentCreateManyLocationInputEnvelope = {
    data: RoutingAssignmentCreateManyLocationInput | RoutingAssignmentCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type AwbCreateWithoutAssignedLocationInput = {
    awbNumber: string
    routingCode: string
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
    placement?: PlacementCreateNestedOneWithoutAwbInput
  }

  export type AwbUncheckedCreateWithoutAssignedLocationInput = {
    id?: number
    awbNumber: string
    routingCode: string
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
    placement?: PlacementUncheckedCreateNestedOneWithoutAwbInput
  }

  export type AwbCreateOrConnectWithoutAssignedLocationInput = {
    where: AwbWhereUniqueInput
    create: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput>
  }

  export type AwbCreateManyAssignedLocationInputEnvelope = {
    data: AwbCreateManyAssignedLocationInput | AwbCreateManyAssignedLocationInput[]
    skipDuplicates?: boolean
  }

  export type PlacementCreateWithoutLocationInput = {
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
    awb: AwbCreateNestedOneWithoutPlacementInput
  }

  export type PlacementUncheckedCreateWithoutLocationInput = {
    id?: number
    awbId: number
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
  }

  export type PlacementCreateOrConnectWithoutLocationInput = {
    where: PlacementWhereUniqueInput
    create: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput>
  }

  export type PlacementCreateManyLocationInputEnvelope = {
    data: PlacementCreateManyLocationInput | PlacementCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type LocationEventCreateWithoutLocationInput = {
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
  }

  export type LocationEventUncheckedCreateWithoutLocationInput = {
    id?: number
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
  }

  export type LocationEventCreateOrConnectWithoutLocationInput = {
    where: LocationEventWhereUniqueInput
    create: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput>
  }

  export type LocationEventCreateManyLocationInputEnvelope = {
    data: LocationEventCreateManyLocationInput | LocationEventCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type RackUpsertWithoutLocationsInput = {
    update: XOR<RackUpdateWithoutLocationsInput, RackUncheckedUpdateWithoutLocationsInput>
    create: XOR<RackCreateWithoutLocationsInput, RackUncheckedCreateWithoutLocationsInput>
    where?: RackWhereInput
  }

  export type RackUpdateToOneWithWhereWithoutLocationsInput = {
    where?: RackWhereInput
    data: XOR<RackUpdateWithoutLocationsInput, RackUncheckedUpdateWithoutLocationsInput>
  }

  export type RackUpdateWithoutLocationsInput = {
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RackUncheckedUpdateWithoutLocationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackNumber?: IntFieldUpdateOperationsInput | number
    totalLevels?: IntFieldUpdateOperationsInput | number
    totalPositions?: IntFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoutingAssignmentUpsertWithWhereUniqueWithoutLocationInput = {
    where: RoutingAssignmentWhereUniqueInput
    update: XOR<RoutingAssignmentUpdateWithoutLocationInput, RoutingAssignmentUncheckedUpdateWithoutLocationInput>
    create: XOR<RoutingAssignmentCreateWithoutLocationInput, RoutingAssignmentUncheckedCreateWithoutLocationInput>
  }

  export type RoutingAssignmentUpdateWithWhereUniqueWithoutLocationInput = {
    where: RoutingAssignmentWhereUniqueInput
    data: XOR<RoutingAssignmentUpdateWithoutLocationInput, RoutingAssignmentUncheckedUpdateWithoutLocationInput>
  }

  export type RoutingAssignmentUpdateManyWithWhereWithoutLocationInput = {
    where: RoutingAssignmentScalarWhereInput
    data: XOR<RoutingAssignmentUpdateManyMutationInput, RoutingAssignmentUncheckedUpdateManyWithoutLocationInput>
  }

  export type RoutingAssignmentScalarWhereInput = {
    AND?: RoutingAssignmentScalarWhereInput | RoutingAssignmentScalarWhereInput[]
    OR?: RoutingAssignmentScalarWhereInput[]
    NOT?: RoutingAssignmentScalarWhereInput | RoutingAssignmentScalarWhereInput[]
    id?: IntFilter<"RoutingAssignment"> | number
    routingCode?: StringFilter<"RoutingAssignment"> | string
    locationId?: IntFilter<"RoutingAssignment"> | number
    assignedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"RoutingAssignment"> | Date | string | null
    isActive?: BoolNullableFilter<"RoutingAssignment"> | boolean | null
  }

  export type AwbUpsertWithWhereUniqueWithoutAssignedLocationInput = {
    where: AwbWhereUniqueInput
    update: XOR<AwbUpdateWithoutAssignedLocationInput, AwbUncheckedUpdateWithoutAssignedLocationInput>
    create: XOR<AwbCreateWithoutAssignedLocationInput, AwbUncheckedCreateWithoutAssignedLocationInput>
  }

  export type AwbUpdateWithWhereUniqueWithoutAssignedLocationInput = {
    where: AwbWhereUniqueInput
    data: XOR<AwbUpdateWithoutAssignedLocationInput, AwbUncheckedUpdateWithoutAssignedLocationInput>
  }

  export type AwbUpdateManyWithWhereWithoutAssignedLocationInput = {
    where: AwbScalarWhereInput
    data: XOR<AwbUpdateManyMutationInput, AwbUncheckedUpdateManyWithoutAssignedLocationInput>
  }

  export type AwbScalarWhereInput = {
    AND?: AwbScalarWhereInput | AwbScalarWhereInput[]
    OR?: AwbScalarWhereInput[]
    NOT?: AwbScalarWhereInput | AwbScalarWhereInput[]
    id?: IntFilter<"Awb"> | number
    awbNumber?: StringFilter<"Awb"> | string
    routingCode?: StringFilter<"Awb"> | string
    assignedLocationId?: IntFilter<"Awb"> | number
    operatorColor?: EnumOperatorColorFilter<"Awb"> | $Enums.OperatorColor
    scanTimestamp?: DateTimeFilter<"Awb"> | Date | string
    placedTimestamp?: DateTimeNullableFilter<"Awb"> | Date | string | null
    status?: EnumAwbStatusFilter<"Awb"> | $Enums.AwbStatus
  }

  export type PlacementUpsertWithWhereUniqueWithoutLocationInput = {
    where: PlacementWhereUniqueInput
    update: XOR<PlacementUpdateWithoutLocationInput, PlacementUncheckedUpdateWithoutLocationInput>
    create: XOR<PlacementCreateWithoutLocationInput, PlacementUncheckedCreateWithoutLocationInput>
  }

  export type PlacementUpdateWithWhereUniqueWithoutLocationInput = {
    where: PlacementWhereUniqueInput
    data: XOR<PlacementUpdateWithoutLocationInput, PlacementUncheckedUpdateWithoutLocationInput>
  }

  export type PlacementUpdateManyWithWhereWithoutLocationInput = {
    where: PlacementScalarWhereInput
    data: XOR<PlacementUpdateManyMutationInput, PlacementUncheckedUpdateManyWithoutLocationInput>
  }

  export type PlacementScalarWhereInput = {
    AND?: PlacementScalarWhereInput | PlacementScalarWhereInput[]
    OR?: PlacementScalarWhereInput[]
    NOT?: PlacementScalarWhereInput | PlacementScalarWhereInput[]
    id?: IntFilter<"Placement"> | number
    awbId?: IntFilter<"Placement"> | number
    locationId?: IntFilter<"Placement"> | number
    verified?: BoolNullableFilter<"Placement"> | boolean | null
    verifiedAt?: DateTimeNullableFilter<"Placement"> | Date | string | null
    operatorId?: StringNullableFilter<"Placement"> | string | null
  }

  export type LocationEventUpsertWithWhereUniqueWithoutLocationInput = {
    where: LocationEventWhereUniqueInput
    update: XOR<LocationEventUpdateWithoutLocationInput, LocationEventUncheckedUpdateWithoutLocationInput>
    create: XOR<LocationEventCreateWithoutLocationInput, LocationEventUncheckedCreateWithoutLocationInput>
  }

  export type LocationEventUpdateWithWhereUniqueWithoutLocationInput = {
    where: LocationEventWhereUniqueInput
    data: XOR<LocationEventUpdateWithoutLocationInput, LocationEventUncheckedUpdateWithoutLocationInput>
  }

  export type LocationEventUpdateManyWithWhereWithoutLocationInput = {
    where: LocationEventScalarWhereInput
    data: XOR<LocationEventUpdateManyMutationInput, LocationEventUncheckedUpdateManyWithoutLocationInput>
  }

  export type LocationEventScalarWhereInput = {
    AND?: LocationEventScalarWhereInput | LocationEventScalarWhereInput[]
    OR?: LocationEventScalarWhereInput[]
    NOT?: LocationEventScalarWhereInput | LocationEventScalarWhereInput[]
    id?: IntFilter<"LocationEvent"> | number
    locationId?: IntFilter<"LocationEvent"> | number
    eventType?: EnumLocationEventTypeFilter<"LocationEvent"> | $Enums.LocationEventType
    routingCode?: StringNullableFilter<"LocationEvent"> | string | null
    awbNumber?: StringNullableFilter<"LocationEvent"> | string | null
    createdAt?: DateTimeNullableFilter<"LocationEvent"> | Date | string | null
  }

  export type LocationCreateWithoutRoutingAssignmentsInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    rack: RackCreateNestedOneWithoutLocationsInput
    awbs?: AwbCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementCreateNestedManyWithoutLocationInput
    events?: LocationEventCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutRoutingAssignmentsInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    awbs?: AwbUncheckedCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementUncheckedCreateNestedManyWithoutLocationInput
    events?: LocationEventUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutRoutingAssignmentsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutRoutingAssignmentsInput, LocationUncheckedCreateWithoutRoutingAssignmentsInput>
  }

  export type LocationUpsertWithoutRoutingAssignmentsInput = {
    update: XOR<LocationUpdateWithoutRoutingAssignmentsInput, LocationUncheckedUpdateWithoutRoutingAssignmentsInput>
    create: XOR<LocationCreateWithoutRoutingAssignmentsInput, LocationUncheckedCreateWithoutRoutingAssignmentsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutRoutingAssignmentsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutRoutingAssignmentsInput, LocationUncheckedUpdateWithoutRoutingAssignmentsInput>
  }

  export type LocationUpdateWithoutRoutingAssignmentsInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rack?: RackUpdateOneRequiredWithoutLocationsNestedInput
    awbs?: AwbUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUpdateManyWithoutLocationNestedInput
    events?: LocationEventUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutRoutingAssignmentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    awbs?: AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUncheckedUpdateManyWithoutLocationNestedInput
    events?: LocationEventUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateWithoutAwbsInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    rack: RackCreateNestedOneWithoutLocationsInput
    routingAssignments?: RoutingAssignmentCreateNestedManyWithoutLocationInput
    placements?: PlacementCreateNestedManyWithoutLocationInput
    events?: LocationEventCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutAwbsInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput
    placements?: PlacementUncheckedCreateNestedManyWithoutLocationInput
    events?: LocationEventUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutAwbsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutAwbsInput, LocationUncheckedCreateWithoutAwbsInput>
  }

  export type PlacementCreateWithoutAwbInput = {
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
    location: LocationCreateNestedOneWithoutPlacementsInput
  }

  export type PlacementUncheckedCreateWithoutAwbInput = {
    id?: number
    locationId: number
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
  }

  export type PlacementCreateOrConnectWithoutAwbInput = {
    where: PlacementWhereUniqueInput
    create: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
  }

  export type LocationUpsertWithoutAwbsInput = {
    update: XOR<LocationUpdateWithoutAwbsInput, LocationUncheckedUpdateWithoutAwbsInput>
    create: XOR<LocationCreateWithoutAwbsInput, LocationUncheckedCreateWithoutAwbsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutAwbsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutAwbsInput, LocationUncheckedUpdateWithoutAwbsInput>
  }

  export type LocationUpdateWithoutAwbsInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rack?: RackUpdateOneRequiredWithoutLocationsNestedInput
    routingAssignments?: RoutingAssignmentUpdateManyWithoutLocationNestedInput
    placements?: PlacementUpdateManyWithoutLocationNestedInput
    events?: LocationEventUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutAwbsInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput
    placements?: PlacementUncheckedUpdateManyWithoutLocationNestedInput
    events?: LocationEventUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type PlacementUpsertWithoutAwbInput = {
    update: XOR<PlacementUpdateWithoutAwbInput, PlacementUncheckedUpdateWithoutAwbInput>
    create: XOR<PlacementCreateWithoutAwbInput, PlacementUncheckedCreateWithoutAwbInput>
    where?: PlacementWhereInput
  }

  export type PlacementUpdateToOneWithWhereWithoutAwbInput = {
    where?: PlacementWhereInput
    data: XOR<PlacementUpdateWithoutAwbInput, PlacementUncheckedUpdateWithoutAwbInput>
  }

  export type PlacementUpdateWithoutAwbInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: LocationUpdateOneRequiredWithoutPlacementsNestedInput
  }

  export type PlacementUncheckedUpdateWithoutAwbInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AwbCreateWithoutPlacementInput = {
    awbNumber: string
    routingCode: string
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
    assignedLocation: LocationCreateNestedOneWithoutAwbsInput
  }

  export type AwbUncheckedCreateWithoutPlacementInput = {
    id?: number
    awbNumber: string
    routingCode: string
    assignedLocationId: number
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
  }

  export type AwbCreateOrConnectWithoutPlacementInput = {
    where: AwbWhereUniqueInput
    create: XOR<AwbCreateWithoutPlacementInput, AwbUncheckedCreateWithoutPlacementInput>
  }

  export type LocationCreateWithoutPlacementsInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    rack: RackCreateNestedOneWithoutLocationsInput
    routingAssignments?: RoutingAssignmentCreateNestedManyWithoutLocationInput
    awbs?: AwbCreateNestedManyWithoutAssignedLocationInput
    events?: LocationEventCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutPlacementsInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput
    awbs?: AwbUncheckedCreateNestedManyWithoutAssignedLocationInput
    events?: LocationEventUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutPlacementsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutPlacementsInput, LocationUncheckedCreateWithoutPlacementsInput>
  }

  export type AwbUpsertWithoutPlacementInput = {
    update: XOR<AwbUpdateWithoutPlacementInput, AwbUncheckedUpdateWithoutPlacementInput>
    create: XOR<AwbCreateWithoutPlacementInput, AwbUncheckedCreateWithoutPlacementInput>
    where?: AwbWhereInput
  }

  export type AwbUpdateToOneWithWhereWithoutPlacementInput = {
    where?: AwbWhereInput
    data: XOR<AwbUpdateWithoutPlacementInput, AwbUncheckedUpdateWithoutPlacementInput>
  }

  export type AwbUpdateWithoutPlacementInput = {
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
    assignedLocation?: LocationUpdateOneRequiredWithoutAwbsNestedInput
  }

  export type AwbUncheckedUpdateWithoutPlacementInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedLocationId?: IntFieldUpdateOperationsInput | number
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
  }

  export type LocationUpsertWithoutPlacementsInput = {
    update: XOR<LocationUpdateWithoutPlacementsInput, LocationUncheckedUpdateWithoutPlacementsInput>
    create: XOR<LocationCreateWithoutPlacementsInput, LocationUncheckedCreateWithoutPlacementsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutPlacementsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutPlacementsInput, LocationUncheckedUpdateWithoutPlacementsInput>
  }

  export type LocationUpdateWithoutPlacementsInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rack?: RackUpdateOneRequiredWithoutLocationsNestedInput
    routingAssignments?: RoutingAssignmentUpdateManyWithoutLocationNestedInput
    awbs?: AwbUpdateManyWithoutAssignedLocationNestedInput
    events?: LocationEventUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutPlacementsInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput
    awbs?: AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput
    events?: LocationEventUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateWithoutEventsInput = {
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    rack: RackCreateNestedOneWithoutLocationsInput
    routingAssignments?: RoutingAssignmentCreateNestedManyWithoutLocationInput
    awbs?: AwbCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutEventsInput = {
    id?: number
    rackId: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedCreateNestedManyWithoutLocationInput
    awbs?: AwbUncheckedCreateNestedManyWithoutAssignedLocationInput
    placements?: PlacementUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutEventsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutEventsInput, LocationUncheckedCreateWithoutEventsInput>
  }

  export type LocationUpsertWithoutEventsInput = {
    update: XOR<LocationUpdateWithoutEventsInput, LocationUncheckedUpdateWithoutEventsInput>
    create: XOR<LocationCreateWithoutEventsInput, LocationUncheckedCreateWithoutEventsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutEventsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutEventsInput, LocationUncheckedUpdateWithoutEventsInput>
  }

  export type LocationUpdateWithoutEventsInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rack?: RackUpdateOneRequiredWithoutLocationsNestedInput
    routingAssignments?: RoutingAssignmentUpdateManyWithoutLocationNestedInput
    awbs?: AwbUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutEventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    rackId?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput
    awbs?: AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateManyRackInput = {
    id?: number
    level: number
    position: number
    locationNumber: number
    barcode: string
    lightState?: $Enums.LightState
    currentRoutingCode?: string | null
    assignmentTimestamp?: Date | string | null
    isActive?: boolean | null
    createdAt?: Date | string | null
  }

  export type LocationUpdateWithoutRackInput = {
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUpdateManyWithoutLocationNestedInput
    awbs?: AwbUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUpdateManyWithoutLocationNestedInput
    events?: LocationEventUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutRackInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routingAssignments?: RoutingAssignmentUncheckedUpdateManyWithoutLocationNestedInput
    awbs?: AwbUncheckedUpdateManyWithoutAssignedLocationNestedInput
    placements?: PlacementUncheckedUpdateManyWithoutLocationNestedInput
    events?: LocationEventUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateManyWithoutRackInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    position?: IntFieldUpdateOperationsInput | number
    locationNumber?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lightState?: EnumLightStateFieldUpdateOperationsInput | $Enums.LightState
    currentRoutingCode?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoutingAssignmentCreateManyLocationInput = {
    id?: number
    routingCode: string
    assignedAt?: Date | string | null
    releasedAt?: Date | string | null
    isActive?: boolean | null
  }

  export type AwbCreateManyAssignedLocationInput = {
    id?: number
    awbNumber: string
    routingCode: string
    operatorColor: $Enums.OperatorColor
    scanTimestamp?: Date | string
    placedTimestamp?: Date | string | null
    status?: $Enums.AwbStatus
  }

  export type PlacementCreateManyLocationInput = {
    id?: number
    awbId: number
    verified?: boolean | null
    verifiedAt?: Date | string | null
    operatorId?: string | null
  }

  export type LocationEventCreateManyLocationInput = {
    id?: number
    eventType: $Enums.LocationEventType
    routingCode?: string | null
    awbNumber?: string | null
    createdAt?: Date | string | null
  }

  export type RoutingAssignmentUpdateWithoutLocationInput = {
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoutingAssignmentUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoutingAssignmentUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    routingCode?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type AwbUpdateWithoutAssignedLocationInput = {
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
    placement?: PlacementUpdateOneWithoutAwbNestedInput
  }

  export type AwbUncheckedUpdateWithoutAssignedLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
    placement?: PlacementUncheckedUpdateOneWithoutAwbNestedInput
  }

  export type AwbUncheckedUpdateManyWithoutAssignedLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbNumber?: StringFieldUpdateOperationsInput | string
    routingCode?: StringFieldUpdateOperationsInput | string
    operatorColor?: EnumOperatorColorFieldUpdateOperationsInput | $Enums.OperatorColor
    scanTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    placedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAwbStatusFieldUpdateOperationsInput | $Enums.AwbStatus
  }

  export type PlacementUpdateWithoutLocationInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: AwbUpdateOneRequiredWithoutPlacementNestedInput
  }

  export type PlacementUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlacementUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    awbId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    operatorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationEventUpdateWithoutLocationInput = {
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationEventUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LocationEventUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventType?: EnumLocationEventTypeFieldUpdateOperationsInput | $Enums.LocationEventType
    routingCode?: NullableStringFieldUpdateOperationsInput | string | null
    awbNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}