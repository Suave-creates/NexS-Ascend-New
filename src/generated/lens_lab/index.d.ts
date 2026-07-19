
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
 * Model LocationBlankCheckLog
 * 
 */
export type LocationBlankCheckLog = $Result.DefaultSelection<Prisma.$LocationBlankCheckLogPayload>
/**
 * Model LabOutCheckLogs
 * 
 */
export type LabOutCheckLogs = $Result.DefaultSelection<Prisma.$LabOutCheckLogsPayload>
/**
 * Model BlanksFqc
 * 
 */
export type BlanksFqc = $Result.DefaultSelection<Prisma.$BlanksFqcPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const BlanksFqcStatus: {
  PASS: 'PASS',
  HOLD: 'HOLD',
  FAIL: 'FAIL',
  UNHOLD: 'UNHOLD'
};

export type BlanksFqcStatus = (typeof BlanksFqcStatus)[keyof typeof BlanksFqcStatus]


export const BlanksFqcFailSide: {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  BOTH: 'BOTH'
};

export type BlanksFqcFailSide = (typeof BlanksFqcFailSide)[keyof typeof BlanksFqcFailSide]

}

export type BlanksFqcStatus = $Enums.BlanksFqcStatus

export const BlanksFqcStatus: typeof $Enums.BlanksFqcStatus

export type BlanksFqcFailSide = $Enums.BlanksFqcFailSide

export const BlanksFqcFailSide: typeof $Enums.BlanksFqcFailSide

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LocationBlankCheckLogs
 * const locationBlankCheckLogs = await prisma.locationBlankCheckLog.findMany()
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
   * // Fetch zero or more LocationBlankCheckLogs
   * const locationBlankCheckLogs = await prisma.locationBlankCheckLog.findMany()
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
   * `prisma.locationBlankCheckLog`: Exposes CRUD operations for the **LocationBlankCheckLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocationBlankCheckLogs
    * const locationBlankCheckLogs = await prisma.locationBlankCheckLog.findMany()
    * ```
    */
  get locationBlankCheckLog(): Prisma.LocationBlankCheckLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.labOutCheckLogs`: Exposes CRUD operations for the **LabOutCheckLogs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabOutCheckLogs
    * const labOutCheckLogs = await prisma.labOutCheckLogs.findMany()
    * ```
    */
  get labOutCheckLogs(): Prisma.LabOutCheckLogsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.blanksFqc`: Exposes CRUD operations for the **BlanksFqc** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BlanksFqcs
    * const blanksFqcs = await prisma.blanksFqc.findMany()
    * ```
    */
  get blanksFqc(): Prisma.BlanksFqcDelegate<ExtArgs, ClientOptions>;
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
    LocationBlankCheckLog: 'LocationBlankCheckLog',
    LabOutCheckLogs: 'LabOutCheckLogs',
    BlanksFqc: 'BlanksFqc'
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
      modelProps: "locationBlankCheckLog" | "labOutCheckLogs" | "blanksFqc"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LocationBlankCheckLog: {
        payload: Prisma.$LocationBlankCheckLogPayload<ExtArgs>
        fields: Prisma.LocationBlankCheckLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationBlankCheckLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationBlankCheckLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          findFirst: {
            args: Prisma.LocationBlankCheckLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationBlankCheckLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          findMany: {
            args: Prisma.LocationBlankCheckLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>[]
          }
          create: {
            args: Prisma.LocationBlankCheckLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          createMany: {
            args: Prisma.LocationBlankCheckLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LocationBlankCheckLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          update: {
            args: Prisma.LocationBlankCheckLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          deleteMany: {
            args: Prisma.LocationBlankCheckLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationBlankCheckLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationBlankCheckLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationBlankCheckLogPayload>
          }
          aggregate: {
            args: Prisma.LocationBlankCheckLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocationBlankCheckLog>
          }
          groupBy: {
            args: Prisma.LocationBlankCheckLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationBlankCheckLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationBlankCheckLogCountArgs<ExtArgs>
            result: $Utils.Optional<LocationBlankCheckLogCountAggregateOutputType> | number
          }
        }
      }
      LabOutCheckLogs: {
        payload: Prisma.$LabOutCheckLogsPayload<ExtArgs>
        fields: Prisma.LabOutCheckLogsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabOutCheckLogsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabOutCheckLogsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          findFirst: {
            args: Prisma.LabOutCheckLogsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabOutCheckLogsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          findMany: {
            args: Prisma.LabOutCheckLogsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>[]
          }
          create: {
            args: Prisma.LabOutCheckLogsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          createMany: {
            args: Prisma.LabOutCheckLogsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LabOutCheckLogsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          update: {
            args: Prisma.LabOutCheckLogsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          deleteMany: {
            args: Prisma.LabOutCheckLogsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LabOutCheckLogsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LabOutCheckLogsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOutCheckLogsPayload>
          }
          aggregate: {
            args: Prisma.LabOutCheckLogsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabOutCheckLogs>
          }
          groupBy: {
            args: Prisma.LabOutCheckLogsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LabOutCheckLogsGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabOutCheckLogsCountArgs<ExtArgs>
            result: $Utils.Optional<LabOutCheckLogsCountAggregateOutputType> | number
          }
        }
      }
      BlanksFqc: {
        payload: Prisma.$BlanksFqcPayload<ExtArgs>
        fields: Prisma.BlanksFqcFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlanksFqcFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlanksFqcFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          findFirst: {
            args: Prisma.BlanksFqcFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlanksFqcFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          findMany: {
            args: Prisma.BlanksFqcFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>[]
          }
          create: {
            args: Prisma.BlanksFqcCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          createMany: {
            args: Prisma.BlanksFqcCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlanksFqcDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          update: {
            args: Prisma.BlanksFqcUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          deleteMany: {
            args: Prisma.BlanksFqcDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlanksFqcUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlanksFqcUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlanksFqcPayload>
          }
          aggregate: {
            args: Prisma.BlanksFqcAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlanksFqc>
          }
          groupBy: {
            args: Prisma.BlanksFqcGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlanksFqcGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlanksFqcCountArgs<ExtArgs>
            result: $Utils.Optional<BlanksFqcCountAggregateOutputType> | number
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
    locationBlankCheckLog?: LocationBlankCheckLogOmit
    labOutCheckLogs?: LabOutCheckLogsOmit
    blanksFqc?: BlanksFqcOmit
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
   * Models
   */

  /**
   * Model LocationBlankCheckLog
   */

  export type AggregateLocationBlankCheckLog = {
    _count: LocationBlankCheckLogCountAggregateOutputType | null
    _avg: LocationBlankCheckLogAvgAggregateOutputType | null
    _sum: LocationBlankCheckLogSumAggregateOutputType | null
    _min: LocationBlankCheckLogMinAggregateOutputType | null
    _max: LocationBlankCheckLogMaxAggregateOutputType | null
  }

  export type LocationBlankCheckLogAvgAggregateOutputType = {
    id: number | null
  }

  export type LocationBlankCheckLogSumAggregateOutputType = {
    id: number | null
  }

  export type LocationBlankCheckLogMinAggregateOutputType = {
    id: number | null
    operatorId: string | null
    fittingId: string | null
    locationId: string | null
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean | null
    scannedAt: Date | null
  }

  export type LocationBlankCheckLogMaxAggregateOutputType = {
    id: number | null
    operatorId: string | null
    fittingId: string | null
    locationId: string | null
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean | null
    scannedAt: Date | null
  }

  export type LocationBlankCheckLogCountAggregateOutputType = {
    id: number
    operatorId: number
    fittingId: number
    locationId: number
    product1Id: number
    product1Barcode: number
    product1UpdatedAt: number
    product1IsValid: number
    product2Id: number
    product2Barcode: number
    product2UpdatedAt: number
    product2IsValid: number
    allGreen: number
    scannedAt: number
    _all: number
  }


  export type LocationBlankCheckLogAvgAggregateInputType = {
    id?: true
  }

  export type LocationBlankCheckLogSumAggregateInputType = {
    id?: true
  }

  export type LocationBlankCheckLogMinAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
  }

  export type LocationBlankCheckLogMaxAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
  }

  export type LocationBlankCheckLogCountAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
    _all?: true
  }

  export type LocationBlankCheckLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationBlankCheckLog to aggregate.
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationBlankCheckLogs to fetch.
     */
    orderBy?: LocationBlankCheckLogOrderByWithRelationInput | LocationBlankCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationBlankCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationBlankCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationBlankCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocationBlankCheckLogs
    **/
    _count?: true | LocationBlankCheckLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationBlankCheckLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationBlankCheckLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationBlankCheckLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationBlankCheckLogMaxAggregateInputType
  }

  export type GetLocationBlankCheckLogAggregateType<T extends LocationBlankCheckLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLocationBlankCheckLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocationBlankCheckLog[P]>
      : GetScalarType<T[P], AggregateLocationBlankCheckLog[P]>
  }




  export type LocationBlankCheckLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationBlankCheckLogWhereInput
    orderBy?: LocationBlankCheckLogOrderByWithAggregationInput | LocationBlankCheckLogOrderByWithAggregationInput[]
    by: LocationBlankCheckLogScalarFieldEnum[] | LocationBlankCheckLogScalarFieldEnum
    having?: LocationBlankCheckLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationBlankCheckLogCountAggregateInputType | true
    _avg?: LocationBlankCheckLogAvgAggregateInputType
    _sum?: LocationBlankCheckLogSumAggregateInputType
    _min?: LocationBlankCheckLogMinAggregateInputType
    _max?: LocationBlankCheckLogMaxAggregateInputType
  }

  export type LocationBlankCheckLogGroupByOutputType = {
    id: number
    operatorId: string
    fittingId: string | null
    locationId: string
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean
    scannedAt: Date
    _count: LocationBlankCheckLogCountAggregateOutputType | null
    _avg: LocationBlankCheckLogAvgAggregateOutputType | null
    _sum: LocationBlankCheckLogSumAggregateOutputType | null
    _min: LocationBlankCheckLogMinAggregateOutputType | null
    _max: LocationBlankCheckLogMaxAggregateOutputType | null
  }

  type GetLocationBlankCheckLogGroupByPayload<T extends LocationBlankCheckLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationBlankCheckLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationBlankCheckLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationBlankCheckLogGroupByOutputType[P]>
            : GetScalarType<T[P], LocationBlankCheckLogGroupByOutputType[P]>
        }
      >
    >


  export type LocationBlankCheckLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operatorId?: boolean
    fittingId?: boolean
    locationId?: boolean
    product1Id?: boolean
    product1Barcode?: boolean
    product1UpdatedAt?: boolean
    product1IsValid?: boolean
    product2Id?: boolean
    product2Barcode?: boolean
    product2UpdatedAt?: boolean
    product2IsValid?: boolean
    allGreen?: boolean
    scannedAt?: boolean
  }, ExtArgs["result"]["locationBlankCheckLog"]>



  export type LocationBlankCheckLogSelectScalar = {
    id?: boolean
    operatorId?: boolean
    fittingId?: boolean
    locationId?: boolean
    product1Id?: boolean
    product1Barcode?: boolean
    product1UpdatedAt?: boolean
    product1IsValid?: boolean
    product2Id?: boolean
    product2Barcode?: boolean
    product2UpdatedAt?: boolean
    product2IsValid?: boolean
    allGreen?: boolean
    scannedAt?: boolean
  }

  export type LocationBlankCheckLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "operatorId" | "fittingId" | "locationId" | "product1Id" | "product1Barcode" | "product1UpdatedAt" | "product1IsValid" | "product2Id" | "product2Barcode" | "product2UpdatedAt" | "product2IsValid" | "allGreen" | "scannedAt", ExtArgs["result"]["locationBlankCheckLog"]>

  export type $LocationBlankCheckLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocationBlankCheckLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      operatorId: string
      fittingId: string | null
      locationId: string
      product1Id: string | null
      product1Barcode: string | null
      product1UpdatedAt: Date | null
      product1IsValid: boolean | null
      product2Id: string | null
      product2Barcode: string | null
      product2UpdatedAt: Date | null
      product2IsValid: boolean | null
      allGreen: boolean
      scannedAt: Date
    }, ExtArgs["result"]["locationBlankCheckLog"]>
    composites: {}
  }

  type LocationBlankCheckLogGetPayload<S extends boolean | null | undefined | LocationBlankCheckLogDefaultArgs> = $Result.GetResult<Prisma.$LocationBlankCheckLogPayload, S>

  type LocationBlankCheckLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationBlankCheckLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationBlankCheckLogCountAggregateInputType | true
    }

  export interface LocationBlankCheckLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocationBlankCheckLog'], meta: { name: 'LocationBlankCheckLog' } }
    /**
     * Find zero or one LocationBlankCheckLog that matches the filter.
     * @param {LocationBlankCheckLogFindUniqueArgs} args - Arguments to find a LocationBlankCheckLog
     * @example
     * // Get one LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationBlankCheckLogFindUniqueArgs>(args: SelectSubset<T, LocationBlankCheckLogFindUniqueArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocationBlankCheckLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationBlankCheckLogFindUniqueOrThrowArgs} args - Arguments to find a LocationBlankCheckLog
     * @example
     * // Get one LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationBlankCheckLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationBlankCheckLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationBlankCheckLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogFindFirstArgs} args - Arguments to find a LocationBlankCheckLog
     * @example
     * // Get one LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationBlankCheckLogFindFirstArgs>(args?: SelectSubset<T, LocationBlankCheckLogFindFirstArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationBlankCheckLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogFindFirstOrThrowArgs} args - Arguments to find a LocationBlankCheckLog
     * @example
     * // Get one LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationBlankCheckLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationBlankCheckLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocationBlankCheckLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocationBlankCheckLogs
     * const locationBlankCheckLogs = await prisma.locationBlankCheckLog.findMany()
     * 
     * // Get first 10 LocationBlankCheckLogs
     * const locationBlankCheckLogs = await prisma.locationBlankCheckLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationBlankCheckLogWithIdOnly = await prisma.locationBlankCheckLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationBlankCheckLogFindManyArgs>(args?: SelectSubset<T, LocationBlankCheckLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocationBlankCheckLog.
     * @param {LocationBlankCheckLogCreateArgs} args - Arguments to create a LocationBlankCheckLog.
     * @example
     * // Create one LocationBlankCheckLog
     * const LocationBlankCheckLog = await prisma.locationBlankCheckLog.create({
     *   data: {
     *     // ... data to create a LocationBlankCheckLog
     *   }
     * })
     * 
     */
    create<T extends LocationBlankCheckLogCreateArgs>(args: SelectSubset<T, LocationBlankCheckLogCreateArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocationBlankCheckLogs.
     * @param {LocationBlankCheckLogCreateManyArgs} args - Arguments to create many LocationBlankCheckLogs.
     * @example
     * // Create many LocationBlankCheckLogs
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationBlankCheckLogCreateManyArgs>(args?: SelectSubset<T, LocationBlankCheckLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LocationBlankCheckLog.
     * @param {LocationBlankCheckLogDeleteArgs} args - Arguments to delete one LocationBlankCheckLog.
     * @example
     * // Delete one LocationBlankCheckLog
     * const LocationBlankCheckLog = await prisma.locationBlankCheckLog.delete({
     *   where: {
     *     // ... filter to delete one LocationBlankCheckLog
     *   }
     * })
     * 
     */
    delete<T extends LocationBlankCheckLogDeleteArgs>(args: SelectSubset<T, LocationBlankCheckLogDeleteArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocationBlankCheckLog.
     * @param {LocationBlankCheckLogUpdateArgs} args - Arguments to update one LocationBlankCheckLog.
     * @example
     * // Update one LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationBlankCheckLogUpdateArgs>(args: SelectSubset<T, LocationBlankCheckLogUpdateArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocationBlankCheckLogs.
     * @param {LocationBlankCheckLogDeleteManyArgs} args - Arguments to filter LocationBlankCheckLogs to delete.
     * @example
     * // Delete a few LocationBlankCheckLogs
     * const { count } = await prisma.locationBlankCheckLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationBlankCheckLogDeleteManyArgs>(args?: SelectSubset<T, LocationBlankCheckLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationBlankCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocationBlankCheckLogs
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationBlankCheckLogUpdateManyArgs>(args: SelectSubset<T, LocationBlankCheckLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LocationBlankCheckLog.
     * @param {LocationBlankCheckLogUpsertArgs} args - Arguments to update or create a LocationBlankCheckLog.
     * @example
     * // Update or create a LocationBlankCheckLog
     * const locationBlankCheckLog = await prisma.locationBlankCheckLog.upsert({
     *   create: {
     *     // ... data to create a LocationBlankCheckLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocationBlankCheckLog we want to update
     *   }
     * })
     */
    upsert<T extends LocationBlankCheckLogUpsertArgs>(args: SelectSubset<T, LocationBlankCheckLogUpsertArgs<ExtArgs>>): Prisma__LocationBlankCheckLogClient<$Result.GetResult<Prisma.$LocationBlankCheckLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocationBlankCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogCountArgs} args - Arguments to filter LocationBlankCheckLogs to count.
     * @example
     * // Count the number of LocationBlankCheckLogs
     * const count = await prisma.locationBlankCheckLog.count({
     *   where: {
     *     // ... the filter for the LocationBlankCheckLogs we want to count
     *   }
     * })
    **/
    count<T extends LocationBlankCheckLogCountArgs>(
      args?: Subset<T, LocationBlankCheckLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationBlankCheckLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocationBlankCheckLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LocationBlankCheckLogAggregateArgs>(args: Subset<T, LocationBlankCheckLogAggregateArgs>): Prisma.PrismaPromise<GetLocationBlankCheckLogAggregateType<T>>

    /**
     * Group by LocationBlankCheckLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationBlankCheckLogGroupByArgs} args - Group by arguments.
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
      T extends LocationBlankCheckLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationBlankCheckLogGroupByArgs['orderBy'] }
        : { orderBy?: LocationBlankCheckLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LocationBlankCheckLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationBlankCheckLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocationBlankCheckLog model
   */
  readonly fields: LocationBlankCheckLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocationBlankCheckLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationBlankCheckLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the LocationBlankCheckLog model
   */
  interface LocationBlankCheckLogFieldRefs {
    readonly id: FieldRef<"LocationBlankCheckLog", 'Int'>
    readonly operatorId: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly fittingId: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly locationId: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly product1Id: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly product1Barcode: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly product1UpdatedAt: FieldRef<"LocationBlankCheckLog", 'DateTime'>
    readonly product1IsValid: FieldRef<"LocationBlankCheckLog", 'Boolean'>
    readonly product2Id: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly product2Barcode: FieldRef<"LocationBlankCheckLog", 'String'>
    readonly product2UpdatedAt: FieldRef<"LocationBlankCheckLog", 'DateTime'>
    readonly product2IsValid: FieldRef<"LocationBlankCheckLog", 'Boolean'>
    readonly allGreen: FieldRef<"LocationBlankCheckLog", 'Boolean'>
    readonly scannedAt: FieldRef<"LocationBlankCheckLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocationBlankCheckLog findUnique
   */
  export type LocationBlankCheckLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter, which LocationBlankCheckLog to fetch.
     */
    where: LocationBlankCheckLogWhereUniqueInput
  }

  /**
   * LocationBlankCheckLog findUniqueOrThrow
   */
  export type LocationBlankCheckLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter, which LocationBlankCheckLog to fetch.
     */
    where: LocationBlankCheckLogWhereUniqueInput
  }

  /**
   * LocationBlankCheckLog findFirst
   */
  export type LocationBlankCheckLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter, which LocationBlankCheckLog to fetch.
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationBlankCheckLogs to fetch.
     */
    orderBy?: LocationBlankCheckLogOrderByWithRelationInput | LocationBlankCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationBlankCheckLogs.
     */
    cursor?: LocationBlankCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationBlankCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationBlankCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationBlankCheckLogs.
     */
    distinct?: LocationBlankCheckLogScalarFieldEnum | LocationBlankCheckLogScalarFieldEnum[]
  }

  /**
   * LocationBlankCheckLog findFirstOrThrow
   */
  export type LocationBlankCheckLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter, which LocationBlankCheckLog to fetch.
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationBlankCheckLogs to fetch.
     */
    orderBy?: LocationBlankCheckLogOrderByWithRelationInput | LocationBlankCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationBlankCheckLogs.
     */
    cursor?: LocationBlankCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationBlankCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationBlankCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationBlankCheckLogs.
     */
    distinct?: LocationBlankCheckLogScalarFieldEnum | LocationBlankCheckLogScalarFieldEnum[]
  }

  /**
   * LocationBlankCheckLog findMany
   */
  export type LocationBlankCheckLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter, which LocationBlankCheckLogs to fetch.
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationBlankCheckLogs to fetch.
     */
    orderBy?: LocationBlankCheckLogOrderByWithRelationInput | LocationBlankCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocationBlankCheckLogs.
     */
    cursor?: LocationBlankCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationBlankCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationBlankCheckLogs.
     */
    skip?: number
    distinct?: LocationBlankCheckLogScalarFieldEnum | LocationBlankCheckLogScalarFieldEnum[]
  }

  /**
   * LocationBlankCheckLog create
   */
  export type LocationBlankCheckLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * The data needed to create a LocationBlankCheckLog.
     */
    data: XOR<LocationBlankCheckLogCreateInput, LocationBlankCheckLogUncheckedCreateInput>
  }

  /**
   * LocationBlankCheckLog createMany
   */
  export type LocationBlankCheckLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocationBlankCheckLogs.
     */
    data: LocationBlankCheckLogCreateManyInput | LocationBlankCheckLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LocationBlankCheckLog update
   */
  export type LocationBlankCheckLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * The data needed to update a LocationBlankCheckLog.
     */
    data: XOR<LocationBlankCheckLogUpdateInput, LocationBlankCheckLogUncheckedUpdateInput>
    /**
     * Choose, which LocationBlankCheckLog to update.
     */
    where: LocationBlankCheckLogWhereUniqueInput
  }

  /**
   * LocationBlankCheckLog updateMany
   */
  export type LocationBlankCheckLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocationBlankCheckLogs.
     */
    data: XOR<LocationBlankCheckLogUpdateManyMutationInput, LocationBlankCheckLogUncheckedUpdateManyInput>
    /**
     * Filter which LocationBlankCheckLogs to update
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * Limit how many LocationBlankCheckLogs to update.
     */
    limit?: number
  }

  /**
   * LocationBlankCheckLog upsert
   */
  export type LocationBlankCheckLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * The filter to search for the LocationBlankCheckLog to update in case it exists.
     */
    where: LocationBlankCheckLogWhereUniqueInput
    /**
     * In case the LocationBlankCheckLog found by the `where` argument doesn't exist, create a new LocationBlankCheckLog with this data.
     */
    create: XOR<LocationBlankCheckLogCreateInput, LocationBlankCheckLogUncheckedCreateInput>
    /**
     * In case the LocationBlankCheckLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationBlankCheckLogUpdateInput, LocationBlankCheckLogUncheckedUpdateInput>
  }

  /**
   * LocationBlankCheckLog delete
   */
  export type LocationBlankCheckLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
    /**
     * Filter which LocationBlankCheckLog to delete.
     */
    where: LocationBlankCheckLogWhereUniqueInput
  }

  /**
   * LocationBlankCheckLog deleteMany
   */
  export type LocationBlankCheckLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationBlankCheckLogs to delete
     */
    where?: LocationBlankCheckLogWhereInput
    /**
     * Limit how many LocationBlankCheckLogs to delete.
     */
    limit?: number
  }

  /**
   * LocationBlankCheckLog without action
   */
  export type LocationBlankCheckLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationBlankCheckLog
     */
    select?: LocationBlankCheckLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationBlankCheckLog
     */
    omit?: LocationBlankCheckLogOmit<ExtArgs> | null
  }


  /**
   * Model LabOutCheckLogs
   */

  export type AggregateLabOutCheckLogs = {
    _count: LabOutCheckLogsCountAggregateOutputType | null
    _avg: LabOutCheckLogsAvgAggregateOutputType | null
    _sum: LabOutCheckLogsSumAggregateOutputType | null
    _min: LabOutCheckLogsMinAggregateOutputType | null
    _max: LabOutCheckLogsMaxAggregateOutputType | null
  }

  export type LabOutCheckLogsAvgAggregateOutputType = {
    id: number | null
  }

  export type LabOutCheckLogsSumAggregateOutputType = {
    id: number | null
  }

  export type LabOutCheckLogsMinAggregateOutputType = {
    id: number | null
    operatorId: string | null
    fittingId: string | null
    locationId: string | null
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean | null
    scannedAt: Date | null
  }

  export type LabOutCheckLogsMaxAggregateOutputType = {
    id: number | null
    operatorId: string | null
    fittingId: string | null
    locationId: string | null
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean | null
    scannedAt: Date | null
  }

  export type LabOutCheckLogsCountAggregateOutputType = {
    id: number
    operatorId: number
    fittingId: number
    locationId: number
    product1Id: number
    product1Barcode: number
    product1UpdatedAt: number
    product1IsValid: number
    product2Id: number
    product2Barcode: number
    product2UpdatedAt: number
    product2IsValid: number
    allGreen: number
    scannedAt: number
    _all: number
  }


  export type LabOutCheckLogsAvgAggregateInputType = {
    id?: true
  }

  export type LabOutCheckLogsSumAggregateInputType = {
    id?: true
  }

  export type LabOutCheckLogsMinAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
  }

  export type LabOutCheckLogsMaxAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
  }

  export type LabOutCheckLogsCountAggregateInputType = {
    id?: true
    operatorId?: true
    fittingId?: true
    locationId?: true
    product1Id?: true
    product1Barcode?: true
    product1UpdatedAt?: true
    product1IsValid?: true
    product2Id?: true
    product2Barcode?: true
    product2UpdatedAt?: true
    product2IsValid?: true
    allGreen?: true
    scannedAt?: true
    _all?: true
  }

  export type LabOutCheckLogsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabOutCheckLogs to aggregate.
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOutCheckLogs to fetch.
     */
    orderBy?: LabOutCheckLogsOrderByWithRelationInput | LabOutCheckLogsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabOutCheckLogsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOutCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOutCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabOutCheckLogs
    **/
    _count?: true | LabOutCheckLogsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LabOutCheckLogsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LabOutCheckLogsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabOutCheckLogsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabOutCheckLogsMaxAggregateInputType
  }

  export type GetLabOutCheckLogsAggregateType<T extends LabOutCheckLogsAggregateArgs> = {
        [P in keyof T & keyof AggregateLabOutCheckLogs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabOutCheckLogs[P]>
      : GetScalarType<T[P], AggregateLabOutCheckLogs[P]>
  }




  export type LabOutCheckLogsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabOutCheckLogsWhereInput
    orderBy?: LabOutCheckLogsOrderByWithAggregationInput | LabOutCheckLogsOrderByWithAggregationInput[]
    by: LabOutCheckLogsScalarFieldEnum[] | LabOutCheckLogsScalarFieldEnum
    having?: LabOutCheckLogsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabOutCheckLogsCountAggregateInputType | true
    _avg?: LabOutCheckLogsAvgAggregateInputType
    _sum?: LabOutCheckLogsSumAggregateInputType
    _min?: LabOutCheckLogsMinAggregateInputType
    _max?: LabOutCheckLogsMaxAggregateInputType
  }

  export type LabOutCheckLogsGroupByOutputType = {
    id: number
    operatorId: string
    fittingId: string | null
    locationId: string
    product1Id: string | null
    product1Barcode: string | null
    product1UpdatedAt: Date | null
    product1IsValid: boolean | null
    product2Id: string | null
    product2Barcode: string | null
    product2UpdatedAt: Date | null
    product2IsValid: boolean | null
    allGreen: boolean
    scannedAt: Date
    _count: LabOutCheckLogsCountAggregateOutputType | null
    _avg: LabOutCheckLogsAvgAggregateOutputType | null
    _sum: LabOutCheckLogsSumAggregateOutputType | null
    _min: LabOutCheckLogsMinAggregateOutputType | null
    _max: LabOutCheckLogsMaxAggregateOutputType | null
  }

  type GetLabOutCheckLogsGroupByPayload<T extends LabOutCheckLogsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabOutCheckLogsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabOutCheckLogsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabOutCheckLogsGroupByOutputType[P]>
            : GetScalarType<T[P], LabOutCheckLogsGroupByOutputType[P]>
        }
      >
    >


  export type LabOutCheckLogsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operatorId?: boolean
    fittingId?: boolean
    locationId?: boolean
    product1Id?: boolean
    product1Barcode?: boolean
    product1UpdatedAt?: boolean
    product1IsValid?: boolean
    product2Id?: boolean
    product2Barcode?: boolean
    product2UpdatedAt?: boolean
    product2IsValid?: boolean
    allGreen?: boolean
    scannedAt?: boolean
  }, ExtArgs["result"]["labOutCheckLogs"]>



  export type LabOutCheckLogsSelectScalar = {
    id?: boolean
    operatorId?: boolean
    fittingId?: boolean
    locationId?: boolean
    product1Id?: boolean
    product1Barcode?: boolean
    product1UpdatedAt?: boolean
    product1IsValid?: boolean
    product2Id?: boolean
    product2Barcode?: boolean
    product2UpdatedAt?: boolean
    product2IsValid?: boolean
    allGreen?: boolean
    scannedAt?: boolean
  }

  export type LabOutCheckLogsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "operatorId" | "fittingId" | "locationId" | "product1Id" | "product1Barcode" | "product1UpdatedAt" | "product1IsValid" | "product2Id" | "product2Barcode" | "product2UpdatedAt" | "product2IsValid" | "allGreen" | "scannedAt", ExtArgs["result"]["labOutCheckLogs"]>

  export type $LabOutCheckLogsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabOutCheckLogs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      operatorId: string
      fittingId: string | null
      locationId: string
      product1Id: string | null
      product1Barcode: string | null
      product1UpdatedAt: Date | null
      product1IsValid: boolean | null
      product2Id: string | null
      product2Barcode: string | null
      product2UpdatedAt: Date | null
      product2IsValid: boolean | null
      allGreen: boolean
      scannedAt: Date
    }, ExtArgs["result"]["labOutCheckLogs"]>
    composites: {}
  }

  type LabOutCheckLogsGetPayload<S extends boolean | null | undefined | LabOutCheckLogsDefaultArgs> = $Result.GetResult<Prisma.$LabOutCheckLogsPayload, S>

  type LabOutCheckLogsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LabOutCheckLogsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LabOutCheckLogsCountAggregateInputType | true
    }

  export interface LabOutCheckLogsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabOutCheckLogs'], meta: { name: 'LabOutCheckLogs' } }
    /**
     * Find zero or one LabOutCheckLogs that matches the filter.
     * @param {LabOutCheckLogsFindUniqueArgs} args - Arguments to find a LabOutCheckLogs
     * @example
     * // Get one LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LabOutCheckLogsFindUniqueArgs>(args: SelectSubset<T, LabOutCheckLogsFindUniqueArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LabOutCheckLogs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LabOutCheckLogsFindUniqueOrThrowArgs} args - Arguments to find a LabOutCheckLogs
     * @example
     * // Get one LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LabOutCheckLogsFindUniqueOrThrowArgs>(args: SelectSubset<T, LabOutCheckLogsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LabOutCheckLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsFindFirstArgs} args - Arguments to find a LabOutCheckLogs
     * @example
     * // Get one LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LabOutCheckLogsFindFirstArgs>(args?: SelectSubset<T, LabOutCheckLogsFindFirstArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LabOutCheckLogs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsFindFirstOrThrowArgs} args - Arguments to find a LabOutCheckLogs
     * @example
     * // Get one LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LabOutCheckLogsFindFirstOrThrowArgs>(args?: SelectSubset<T, LabOutCheckLogsFindFirstOrThrowArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LabOutCheckLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findMany()
     * 
     * // Get first 10 LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labOutCheckLogsWithIdOnly = await prisma.labOutCheckLogs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LabOutCheckLogsFindManyArgs>(args?: SelectSubset<T, LabOutCheckLogsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LabOutCheckLogs.
     * @param {LabOutCheckLogsCreateArgs} args - Arguments to create a LabOutCheckLogs.
     * @example
     * // Create one LabOutCheckLogs
     * const LabOutCheckLogs = await prisma.labOutCheckLogs.create({
     *   data: {
     *     // ... data to create a LabOutCheckLogs
     *   }
     * })
     * 
     */
    create<T extends LabOutCheckLogsCreateArgs>(args: SelectSubset<T, LabOutCheckLogsCreateArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LabOutCheckLogs.
     * @param {LabOutCheckLogsCreateManyArgs} args - Arguments to create many LabOutCheckLogs.
     * @example
     * // Create many LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LabOutCheckLogsCreateManyArgs>(args?: SelectSubset<T, LabOutCheckLogsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LabOutCheckLogs.
     * @param {LabOutCheckLogsDeleteArgs} args - Arguments to delete one LabOutCheckLogs.
     * @example
     * // Delete one LabOutCheckLogs
     * const LabOutCheckLogs = await prisma.labOutCheckLogs.delete({
     *   where: {
     *     // ... filter to delete one LabOutCheckLogs
     *   }
     * })
     * 
     */
    delete<T extends LabOutCheckLogsDeleteArgs>(args: SelectSubset<T, LabOutCheckLogsDeleteArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LabOutCheckLogs.
     * @param {LabOutCheckLogsUpdateArgs} args - Arguments to update one LabOutCheckLogs.
     * @example
     * // Update one LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LabOutCheckLogsUpdateArgs>(args: SelectSubset<T, LabOutCheckLogsUpdateArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LabOutCheckLogs.
     * @param {LabOutCheckLogsDeleteManyArgs} args - Arguments to filter LabOutCheckLogs to delete.
     * @example
     * // Delete a few LabOutCheckLogs
     * const { count } = await prisma.labOutCheckLogs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LabOutCheckLogsDeleteManyArgs>(args?: SelectSubset<T, LabOutCheckLogsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabOutCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LabOutCheckLogsUpdateManyArgs>(args: SelectSubset<T, LabOutCheckLogsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabOutCheckLogs.
     * @param {LabOutCheckLogsUpsertArgs} args - Arguments to update or create a LabOutCheckLogs.
     * @example
     * // Update or create a LabOutCheckLogs
     * const labOutCheckLogs = await prisma.labOutCheckLogs.upsert({
     *   create: {
     *     // ... data to create a LabOutCheckLogs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabOutCheckLogs we want to update
     *   }
     * })
     */
    upsert<T extends LabOutCheckLogsUpsertArgs>(args: SelectSubset<T, LabOutCheckLogsUpsertArgs<ExtArgs>>): Prisma__LabOutCheckLogsClient<$Result.GetResult<Prisma.$LabOutCheckLogsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LabOutCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsCountArgs} args - Arguments to filter LabOutCheckLogs to count.
     * @example
     * // Count the number of LabOutCheckLogs
     * const count = await prisma.labOutCheckLogs.count({
     *   where: {
     *     // ... the filter for the LabOutCheckLogs we want to count
     *   }
     * })
    **/
    count<T extends LabOutCheckLogsCountArgs>(
      args?: Subset<T, LabOutCheckLogsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabOutCheckLogsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabOutCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabOutCheckLogsAggregateArgs>(args: Subset<T, LabOutCheckLogsAggregateArgs>): Prisma.PrismaPromise<GetLabOutCheckLogsAggregateType<T>>

    /**
     * Group by LabOutCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOutCheckLogsGroupByArgs} args - Group by arguments.
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
      T extends LabOutCheckLogsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabOutCheckLogsGroupByArgs['orderBy'] }
        : { orderBy?: LabOutCheckLogsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabOutCheckLogsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabOutCheckLogsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabOutCheckLogs model
   */
  readonly fields: LabOutCheckLogsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabOutCheckLogs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabOutCheckLogsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the LabOutCheckLogs model
   */
  interface LabOutCheckLogsFieldRefs {
    readonly id: FieldRef<"LabOutCheckLogs", 'Int'>
    readonly operatorId: FieldRef<"LabOutCheckLogs", 'String'>
    readonly fittingId: FieldRef<"LabOutCheckLogs", 'String'>
    readonly locationId: FieldRef<"LabOutCheckLogs", 'String'>
    readonly product1Id: FieldRef<"LabOutCheckLogs", 'String'>
    readonly product1Barcode: FieldRef<"LabOutCheckLogs", 'String'>
    readonly product1UpdatedAt: FieldRef<"LabOutCheckLogs", 'DateTime'>
    readonly product1IsValid: FieldRef<"LabOutCheckLogs", 'Boolean'>
    readonly product2Id: FieldRef<"LabOutCheckLogs", 'String'>
    readonly product2Barcode: FieldRef<"LabOutCheckLogs", 'String'>
    readonly product2UpdatedAt: FieldRef<"LabOutCheckLogs", 'DateTime'>
    readonly product2IsValid: FieldRef<"LabOutCheckLogs", 'Boolean'>
    readonly allGreen: FieldRef<"LabOutCheckLogs", 'Boolean'>
    readonly scannedAt: FieldRef<"LabOutCheckLogs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabOutCheckLogs findUnique
   */
  export type LabOutCheckLogsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter, which LabOutCheckLogs to fetch.
     */
    where: LabOutCheckLogsWhereUniqueInput
  }

  /**
   * LabOutCheckLogs findUniqueOrThrow
   */
  export type LabOutCheckLogsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter, which LabOutCheckLogs to fetch.
     */
    where: LabOutCheckLogsWhereUniqueInput
  }

  /**
   * LabOutCheckLogs findFirst
   */
  export type LabOutCheckLogsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter, which LabOutCheckLogs to fetch.
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOutCheckLogs to fetch.
     */
    orderBy?: LabOutCheckLogsOrderByWithRelationInput | LabOutCheckLogsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabOutCheckLogs.
     */
    cursor?: LabOutCheckLogsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOutCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOutCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabOutCheckLogs.
     */
    distinct?: LabOutCheckLogsScalarFieldEnum | LabOutCheckLogsScalarFieldEnum[]
  }

  /**
   * LabOutCheckLogs findFirstOrThrow
   */
  export type LabOutCheckLogsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter, which LabOutCheckLogs to fetch.
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOutCheckLogs to fetch.
     */
    orderBy?: LabOutCheckLogsOrderByWithRelationInput | LabOutCheckLogsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabOutCheckLogs.
     */
    cursor?: LabOutCheckLogsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOutCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOutCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabOutCheckLogs.
     */
    distinct?: LabOutCheckLogsScalarFieldEnum | LabOutCheckLogsScalarFieldEnum[]
  }

  /**
   * LabOutCheckLogs findMany
   */
  export type LabOutCheckLogsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter, which LabOutCheckLogs to fetch.
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOutCheckLogs to fetch.
     */
    orderBy?: LabOutCheckLogsOrderByWithRelationInput | LabOutCheckLogsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabOutCheckLogs.
     */
    cursor?: LabOutCheckLogsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOutCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOutCheckLogs.
     */
    skip?: number
    distinct?: LabOutCheckLogsScalarFieldEnum | LabOutCheckLogsScalarFieldEnum[]
  }

  /**
   * LabOutCheckLogs create
   */
  export type LabOutCheckLogsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * The data needed to create a LabOutCheckLogs.
     */
    data: XOR<LabOutCheckLogsCreateInput, LabOutCheckLogsUncheckedCreateInput>
  }

  /**
   * LabOutCheckLogs createMany
   */
  export type LabOutCheckLogsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabOutCheckLogs.
     */
    data: LabOutCheckLogsCreateManyInput | LabOutCheckLogsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabOutCheckLogs update
   */
  export type LabOutCheckLogsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * The data needed to update a LabOutCheckLogs.
     */
    data: XOR<LabOutCheckLogsUpdateInput, LabOutCheckLogsUncheckedUpdateInput>
    /**
     * Choose, which LabOutCheckLogs to update.
     */
    where: LabOutCheckLogsWhereUniqueInput
  }

  /**
   * LabOutCheckLogs updateMany
   */
  export type LabOutCheckLogsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabOutCheckLogs.
     */
    data: XOR<LabOutCheckLogsUpdateManyMutationInput, LabOutCheckLogsUncheckedUpdateManyInput>
    /**
     * Filter which LabOutCheckLogs to update
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * Limit how many LabOutCheckLogs to update.
     */
    limit?: number
  }

  /**
   * LabOutCheckLogs upsert
   */
  export type LabOutCheckLogsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * The filter to search for the LabOutCheckLogs to update in case it exists.
     */
    where: LabOutCheckLogsWhereUniqueInput
    /**
     * In case the LabOutCheckLogs found by the `where` argument doesn't exist, create a new LabOutCheckLogs with this data.
     */
    create: XOR<LabOutCheckLogsCreateInput, LabOutCheckLogsUncheckedCreateInput>
    /**
     * In case the LabOutCheckLogs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabOutCheckLogsUpdateInput, LabOutCheckLogsUncheckedUpdateInput>
  }

  /**
   * LabOutCheckLogs delete
   */
  export type LabOutCheckLogsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
    /**
     * Filter which LabOutCheckLogs to delete.
     */
    where: LabOutCheckLogsWhereUniqueInput
  }

  /**
   * LabOutCheckLogs deleteMany
   */
  export type LabOutCheckLogsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabOutCheckLogs to delete
     */
    where?: LabOutCheckLogsWhereInput
    /**
     * Limit how many LabOutCheckLogs to delete.
     */
    limit?: number
  }

  /**
   * LabOutCheckLogs without action
   */
  export type LabOutCheckLogsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOutCheckLogs
     */
    select?: LabOutCheckLogsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabOutCheckLogs
     */
    omit?: LabOutCheckLogsOmit<ExtArgs> | null
  }


  /**
   * Model BlanksFqc
   */

  export type AggregateBlanksFqc = {
    _count: BlanksFqcCountAggregateOutputType | null
    _avg: BlanksFqcAvgAggregateOutputType | null
    _sum: BlanksFqcSumAggregateOutputType | null
    _min: BlanksFqcMinAggregateOutputType | null
    _max: BlanksFqcMaxAggregateOutputType | null
  }

  export type BlanksFqcAvgAggregateOutputType = {
    id: number | null
    operator_grade: number | null
    right_sph: Decimal | null
    right_cyl: Decimal | null
    right_axis: number | null
    right_ap: Decimal | null
    right_pd: Decimal | null
    right_lensometer_sph: Decimal | null
    right_lensometer_cyl: Decimal | null
    right_lensometer_axis: number | null
    right_lensometer_ap: Decimal | null
    left_sph: Decimal | null
    left_cyl: Decimal | null
    left_axis: number | null
    left_ap: Decimal | null
    left_pd: Decimal | null
    left_lensometer_sph: Decimal | null
    left_lensometer_cyl: Decimal | null
    left_lensometer_axis: number | null
    left_lensometer_ap: Decimal | null
  }

  export type BlanksFqcSumAggregateOutputType = {
    id: bigint | null
    operator_grade: number | null
    right_sph: Decimal | null
    right_cyl: Decimal | null
    right_axis: number | null
    right_ap: Decimal | null
    right_pd: Decimal | null
    right_lensometer_sph: Decimal | null
    right_lensometer_cyl: Decimal | null
    right_lensometer_axis: number | null
    right_lensometer_ap: Decimal | null
    left_sph: Decimal | null
    left_cyl: Decimal | null
    left_axis: number | null
    left_ap: Decimal | null
    left_pd: Decimal | null
    left_lensometer_sph: Decimal | null
    left_lensometer_cyl: Decimal | null
    left_lensometer_axis: number | null
    left_lensometer_ap: Decimal | null
  }

  export type BlanksFqcMinAggregateOutputType = {
    id: bigint | null
    fitting_id: string | null
    wms_order_code: string | null
    order_id: string | null
    product_id: string | null
    operator_id: string | null
    operator_grade: number | null
    right_sph: Decimal | null
    right_cyl: Decimal | null
    right_axis: number | null
    right_ap: Decimal | null
    right_pd: Decimal | null
    right_lensometer_sph: Decimal | null
    right_lensometer_cyl: Decimal | null
    right_lensometer_axis: number | null
    right_lensometer_ap: Decimal | null
    left_sph: Decimal | null
    left_cyl: Decimal | null
    left_axis: number | null
    left_ap: Decimal | null
    left_pd: Decimal | null
    left_lensometer_sph: Decimal | null
    left_lensometer_cyl: Decimal | null
    left_lensometer_axis: number | null
    left_lensometer_ap: Decimal | null
    qc_status: $Enums.BlanksFqcStatus | null
    qcf_dept: string | null
    qcf_reason: string | null
    fail_side: $Enums.BlanksFqcFailSide | null
    coating: string | null
    lens_index: string | null
    lens_name: string | null
    lens_type: string | null
    remarks: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BlanksFqcMaxAggregateOutputType = {
    id: bigint | null
    fitting_id: string | null
    wms_order_code: string | null
    order_id: string | null
    product_id: string | null
    operator_id: string | null
    operator_grade: number | null
    right_sph: Decimal | null
    right_cyl: Decimal | null
    right_axis: number | null
    right_ap: Decimal | null
    right_pd: Decimal | null
    right_lensometer_sph: Decimal | null
    right_lensometer_cyl: Decimal | null
    right_lensometer_axis: number | null
    right_lensometer_ap: Decimal | null
    left_sph: Decimal | null
    left_cyl: Decimal | null
    left_axis: number | null
    left_ap: Decimal | null
    left_pd: Decimal | null
    left_lensometer_sph: Decimal | null
    left_lensometer_cyl: Decimal | null
    left_lensometer_axis: number | null
    left_lensometer_ap: Decimal | null
    qc_status: $Enums.BlanksFqcStatus | null
    qcf_dept: string | null
    qcf_reason: string | null
    fail_side: $Enums.BlanksFqcFailSide | null
    coating: string | null
    lens_index: string | null
    lens_name: string | null
    lens_type: string | null
    remarks: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BlanksFqcCountAggregateOutputType = {
    id: number
    fitting_id: number
    wms_order_code: number
    order_id: number
    product_id: number
    operator_id: number
    operator_grade: number
    right_sph: number
    right_cyl: number
    right_axis: number
    right_ap: number
    right_pd: number
    right_lensometer_sph: number
    right_lensometer_cyl: number
    right_lensometer_axis: number
    right_lensometer_ap: number
    left_sph: number
    left_cyl: number
    left_axis: number
    left_ap: number
    left_pd: number
    left_lensometer_sph: number
    left_lensometer_cyl: number
    left_lensometer_axis: number
    left_lensometer_ap: number
    qc_status: number
    qcf_dept: number
    qcf_reason: number
    fail_side: number
    coating: number
    lens_index: number
    lens_name: number
    lens_type: number
    remarks: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type BlanksFqcAvgAggregateInputType = {
    id?: true
    operator_grade?: true
    right_sph?: true
    right_cyl?: true
    right_axis?: true
    right_ap?: true
    right_pd?: true
    right_lensometer_sph?: true
    right_lensometer_cyl?: true
    right_lensometer_axis?: true
    right_lensometer_ap?: true
    left_sph?: true
    left_cyl?: true
    left_axis?: true
    left_ap?: true
    left_pd?: true
    left_lensometer_sph?: true
    left_lensometer_cyl?: true
    left_lensometer_axis?: true
    left_lensometer_ap?: true
  }

  export type BlanksFqcSumAggregateInputType = {
    id?: true
    operator_grade?: true
    right_sph?: true
    right_cyl?: true
    right_axis?: true
    right_ap?: true
    right_pd?: true
    right_lensometer_sph?: true
    right_lensometer_cyl?: true
    right_lensometer_axis?: true
    right_lensometer_ap?: true
    left_sph?: true
    left_cyl?: true
    left_axis?: true
    left_ap?: true
    left_pd?: true
    left_lensometer_sph?: true
    left_lensometer_cyl?: true
    left_lensometer_axis?: true
    left_lensometer_ap?: true
  }

  export type BlanksFqcMinAggregateInputType = {
    id?: true
    fitting_id?: true
    wms_order_code?: true
    order_id?: true
    product_id?: true
    operator_id?: true
    operator_grade?: true
    right_sph?: true
    right_cyl?: true
    right_axis?: true
    right_ap?: true
    right_pd?: true
    right_lensometer_sph?: true
    right_lensometer_cyl?: true
    right_lensometer_axis?: true
    right_lensometer_ap?: true
    left_sph?: true
    left_cyl?: true
    left_axis?: true
    left_ap?: true
    left_pd?: true
    left_lensometer_sph?: true
    left_lensometer_cyl?: true
    left_lensometer_axis?: true
    left_lensometer_ap?: true
    qc_status?: true
    qcf_dept?: true
    qcf_reason?: true
    fail_side?: true
    coating?: true
    lens_index?: true
    lens_name?: true
    lens_type?: true
    remarks?: true
    created_at?: true
    updated_at?: true
  }

  export type BlanksFqcMaxAggregateInputType = {
    id?: true
    fitting_id?: true
    wms_order_code?: true
    order_id?: true
    product_id?: true
    operator_id?: true
    operator_grade?: true
    right_sph?: true
    right_cyl?: true
    right_axis?: true
    right_ap?: true
    right_pd?: true
    right_lensometer_sph?: true
    right_lensometer_cyl?: true
    right_lensometer_axis?: true
    right_lensometer_ap?: true
    left_sph?: true
    left_cyl?: true
    left_axis?: true
    left_ap?: true
    left_pd?: true
    left_lensometer_sph?: true
    left_lensometer_cyl?: true
    left_lensometer_axis?: true
    left_lensometer_ap?: true
    qc_status?: true
    qcf_dept?: true
    qcf_reason?: true
    fail_side?: true
    coating?: true
    lens_index?: true
    lens_name?: true
    lens_type?: true
    remarks?: true
    created_at?: true
    updated_at?: true
  }

  export type BlanksFqcCountAggregateInputType = {
    id?: true
    fitting_id?: true
    wms_order_code?: true
    order_id?: true
    product_id?: true
    operator_id?: true
    operator_grade?: true
    right_sph?: true
    right_cyl?: true
    right_axis?: true
    right_ap?: true
    right_pd?: true
    right_lensometer_sph?: true
    right_lensometer_cyl?: true
    right_lensometer_axis?: true
    right_lensometer_ap?: true
    left_sph?: true
    left_cyl?: true
    left_axis?: true
    left_ap?: true
    left_pd?: true
    left_lensometer_sph?: true
    left_lensometer_cyl?: true
    left_lensometer_axis?: true
    left_lensometer_ap?: true
    qc_status?: true
    qcf_dept?: true
    qcf_reason?: true
    fail_side?: true
    coating?: true
    lens_index?: true
    lens_name?: true
    lens_type?: true
    remarks?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type BlanksFqcAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlanksFqc to aggregate.
     */
    where?: BlanksFqcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlanksFqcs to fetch.
     */
    orderBy?: BlanksFqcOrderByWithRelationInput | BlanksFqcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BlanksFqcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlanksFqcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlanksFqcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BlanksFqcs
    **/
    _count?: true | BlanksFqcCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BlanksFqcAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BlanksFqcSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlanksFqcMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlanksFqcMaxAggregateInputType
  }

  export type GetBlanksFqcAggregateType<T extends BlanksFqcAggregateArgs> = {
        [P in keyof T & keyof AggregateBlanksFqc]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlanksFqc[P]>
      : GetScalarType<T[P], AggregateBlanksFqc[P]>
  }




  export type BlanksFqcGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlanksFqcWhereInput
    orderBy?: BlanksFqcOrderByWithAggregationInput | BlanksFqcOrderByWithAggregationInput[]
    by: BlanksFqcScalarFieldEnum[] | BlanksFqcScalarFieldEnum
    having?: BlanksFqcScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlanksFqcCountAggregateInputType | true
    _avg?: BlanksFqcAvgAggregateInputType
    _sum?: BlanksFqcSumAggregateInputType
    _min?: BlanksFqcMinAggregateInputType
    _max?: BlanksFqcMaxAggregateInputType
  }

  export type BlanksFqcGroupByOutputType = {
    id: bigint
    fitting_id: string
    wms_order_code: string
    order_id: string
    product_id: string | null
    operator_id: string
    operator_grade: number
    right_sph: Decimal | null
    right_cyl: Decimal | null
    right_axis: number | null
    right_ap: Decimal | null
    right_pd: Decimal | null
    right_lensometer_sph: Decimal | null
    right_lensometer_cyl: Decimal | null
    right_lensometer_axis: number | null
    right_lensometer_ap: Decimal | null
    left_sph: Decimal | null
    left_cyl: Decimal | null
    left_axis: number | null
    left_ap: Decimal | null
    left_pd: Decimal | null
    left_lensometer_sph: Decimal | null
    left_lensometer_cyl: Decimal | null
    left_lensometer_axis: number | null
    left_lensometer_ap: Decimal | null
    qc_status: $Enums.BlanksFqcStatus
    qcf_dept: string | null
    qcf_reason: string | null
    fail_side: $Enums.BlanksFqcFailSide | null
    coating: string | null
    lens_index: string | null
    lens_name: string | null
    lens_type: string | null
    remarks: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: BlanksFqcCountAggregateOutputType | null
    _avg: BlanksFqcAvgAggregateOutputType | null
    _sum: BlanksFqcSumAggregateOutputType | null
    _min: BlanksFqcMinAggregateOutputType | null
    _max: BlanksFqcMaxAggregateOutputType | null
  }

  type GetBlanksFqcGroupByPayload<T extends BlanksFqcGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlanksFqcGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlanksFqcGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlanksFqcGroupByOutputType[P]>
            : GetScalarType<T[P], BlanksFqcGroupByOutputType[P]>
        }
      >
    >


  export type BlanksFqcSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fitting_id?: boolean
    wms_order_code?: boolean
    order_id?: boolean
    product_id?: boolean
    operator_id?: boolean
    operator_grade?: boolean
    right_sph?: boolean
    right_cyl?: boolean
    right_axis?: boolean
    right_ap?: boolean
    right_pd?: boolean
    right_lensometer_sph?: boolean
    right_lensometer_cyl?: boolean
    right_lensometer_axis?: boolean
    right_lensometer_ap?: boolean
    left_sph?: boolean
    left_cyl?: boolean
    left_axis?: boolean
    left_ap?: boolean
    left_pd?: boolean
    left_lensometer_sph?: boolean
    left_lensometer_cyl?: boolean
    left_lensometer_axis?: boolean
    left_lensometer_ap?: boolean
    qc_status?: boolean
    qcf_dept?: boolean
    qcf_reason?: boolean
    fail_side?: boolean
    coating?: boolean
    lens_index?: boolean
    lens_name?: boolean
    lens_type?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["blanksFqc"]>



  export type BlanksFqcSelectScalar = {
    id?: boolean
    fitting_id?: boolean
    wms_order_code?: boolean
    order_id?: boolean
    product_id?: boolean
    operator_id?: boolean
    operator_grade?: boolean
    right_sph?: boolean
    right_cyl?: boolean
    right_axis?: boolean
    right_ap?: boolean
    right_pd?: boolean
    right_lensometer_sph?: boolean
    right_lensometer_cyl?: boolean
    right_lensometer_axis?: boolean
    right_lensometer_ap?: boolean
    left_sph?: boolean
    left_cyl?: boolean
    left_axis?: boolean
    left_ap?: boolean
    left_pd?: boolean
    left_lensometer_sph?: boolean
    left_lensometer_cyl?: boolean
    left_lensometer_axis?: boolean
    left_lensometer_ap?: boolean
    qc_status?: boolean
    qcf_dept?: boolean
    qcf_reason?: boolean
    fail_side?: boolean
    coating?: boolean
    lens_index?: boolean
    lens_name?: boolean
    lens_type?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type BlanksFqcOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fitting_id" | "wms_order_code" | "order_id" | "product_id" | "operator_id" | "operator_grade" | "right_sph" | "right_cyl" | "right_axis" | "right_ap" | "right_pd" | "right_lensometer_sph" | "right_lensometer_cyl" | "right_lensometer_axis" | "right_lensometer_ap" | "left_sph" | "left_cyl" | "left_axis" | "left_ap" | "left_pd" | "left_lensometer_sph" | "left_lensometer_cyl" | "left_lensometer_axis" | "left_lensometer_ap" | "qc_status" | "qcf_dept" | "qcf_reason" | "fail_side" | "coating" | "lens_index" | "lens_name" | "lens_type" | "remarks" | "created_at" | "updated_at", ExtArgs["result"]["blanksFqc"]>

  export type $BlanksFqcPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BlanksFqc"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      fitting_id: string
      wms_order_code: string
      order_id: string
      product_id: string | null
      operator_id: string
      operator_grade: number
      right_sph: Prisma.Decimal | null
      right_cyl: Prisma.Decimal | null
      right_axis: number | null
      right_ap: Prisma.Decimal | null
      right_pd: Prisma.Decimal | null
      right_lensometer_sph: Prisma.Decimal | null
      right_lensometer_cyl: Prisma.Decimal | null
      right_lensometer_axis: number | null
      right_lensometer_ap: Prisma.Decimal | null
      left_sph: Prisma.Decimal | null
      left_cyl: Prisma.Decimal | null
      left_axis: number | null
      left_ap: Prisma.Decimal | null
      left_pd: Prisma.Decimal | null
      left_lensometer_sph: Prisma.Decimal | null
      left_lensometer_cyl: Prisma.Decimal | null
      left_lensometer_axis: number | null
      left_lensometer_ap: Prisma.Decimal | null
      qc_status: $Enums.BlanksFqcStatus
      qcf_dept: string | null
      qcf_reason: string | null
      fail_side: $Enums.BlanksFqcFailSide | null
      coating: string | null
      lens_index: string | null
      lens_name: string | null
      lens_type: string | null
      remarks: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["blanksFqc"]>
    composites: {}
  }

  type BlanksFqcGetPayload<S extends boolean | null | undefined | BlanksFqcDefaultArgs> = $Result.GetResult<Prisma.$BlanksFqcPayload, S>

  type BlanksFqcCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BlanksFqcFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlanksFqcCountAggregateInputType | true
    }

  export interface BlanksFqcDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlanksFqc'], meta: { name: 'BlanksFqc' } }
    /**
     * Find zero or one BlanksFqc that matches the filter.
     * @param {BlanksFqcFindUniqueArgs} args - Arguments to find a BlanksFqc
     * @example
     * // Get one BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlanksFqcFindUniqueArgs>(args: SelectSubset<T, BlanksFqcFindUniqueArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlanksFqc that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlanksFqcFindUniqueOrThrowArgs} args - Arguments to find a BlanksFqc
     * @example
     * // Get one BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlanksFqcFindUniqueOrThrowArgs>(args: SelectSubset<T, BlanksFqcFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlanksFqc that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcFindFirstArgs} args - Arguments to find a BlanksFqc
     * @example
     * // Get one BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlanksFqcFindFirstArgs>(args?: SelectSubset<T, BlanksFqcFindFirstArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlanksFqc that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcFindFirstOrThrowArgs} args - Arguments to find a BlanksFqc
     * @example
     * // Get one BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlanksFqcFindFirstOrThrowArgs>(args?: SelectSubset<T, BlanksFqcFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlanksFqcs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlanksFqcs
     * const blanksFqcs = await prisma.blanksFqc.findMany()
     * 
     * // Get first 10 BlanksFqcs
     * const blanksFqcs = await prisma.blanksFqc.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blanksFqcWithIdOnly = await prisma.blanksFqc.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BlanksFqcFindManyArgs>(args?: SelectSubset<T, BlanksFqcFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BlanksFqc.
     * @param {BlanksFqcCreateArgs} args - Arguments to create a BlanksFqc.
     * @example
     * // Create one BlanksFqc
     * const BlanksFqc = await prisma.blanksFqc.create({
     *   data: {
     *     // ... data to create a BlanksFqc
     *   }
     * })
     * 
     */
    create<T extends BlanksFqcCreateArgs>(args: SelectSubset<T, BlanksFqcCreateArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlanksFqcs.
     * @param {BlanksFqcCreateManyArgs} args - Arguments to create many BlanksFqcs.
     * @example
     * // Create many BlanksFqcs
     * const blanksFqc = await prisma.blanksFqc.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BlanksFqcCreateManyArgs>(args?: SelectSubset<T, BlanksFqcCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlanksFqc.
     * @param {BlanksFqcDeleteArgs} args - Arguments to delete one BlanksFqc.
     * @example
     * // Delete one BlanksFqc
     * const BlanksFqc = await prisma.blanksFqc.delete({
     *   where: {
     *     // ... filter to delete one BlanksFqc
     *   }
     * })
     * 
     */
    delete<T extends BlanksFqcDeleteArgs>(args: SelectSubset<T, BlanksFqcDeleteArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlanksFqc.
     * @param {BlanksFqcUpdateArgs} args - Arguments to update one BlanksFqc.
     * @example
     * // Update one BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BlanksFqcUpdateArgs>(args: SelectSubset<T, BlanksFqcUpdateArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlanksFqcs.
     * @param {BlanksFqcDeleteManyArgs} args - Arguments to filter BlanksFqcs to delete.
     * @example
     * // Delete a few BlanksFqcs
     * const { count } = await prisma.blanksFqc.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BlanksFqcDeleteManyArgs>(args?: SelectSubset<T, BlanksFqcDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlanksFqcs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlanksFqcs
     * const blanksFqc = await prisma.blanksFqc.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BlanksFqcUpdateManyArgs>(args: SelectSubset<T, BlanksFqcUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlanksFqc.
     * @param {BlanksFqcUpsertArgs} args - Arguments to update or create a BlanksFqc.
     * @example
     * // Update or create a BlanksFqc
     * const blanksFqc = await prisma.blanksFqc.upsert({
     *   create: {
     *     // ... data to create a BlanksFqc
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlanksFqc we want to update
     *   }
     * })
     */
    upsert<T extends BlanksFqcUpsertArgs>(args: SelectSubset<T, BlanksFqcUpsertArgs<ExtArgs>>): Prisma__BlanksFqcClient<$Result.GetResult<Prisma.$BlanksFqcPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BlanksFqcs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcCountArgs} args - Arguments to filter BlanksFqcs to count.
     * @example
     * // Count the number of BlanksFqcs
     * const count = await prisma.blanksFqc.count({
     *   where: {
     *     // ... the filter for the BlanksFqcs we want to count
     *   }
     * })
    **/
    count<T extends BlanksFqcCountArgs>(
      args?: Subset<T, BlanksFqcCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlanksFqcCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlanksFqc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BlanksFqcAggregateArgs>(args: Subset<T, BlanksFqcAggregateArgs>): Prisma.PrismaPromise<GetBlanksFqcAggregateType<T>>

    /**
     * Group by BlanksFqc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlanksFqcGroupByArgs} args - Group by arguments.
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
      T extends BlanksFqcGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlanksFqcGroupByArgs['orderBy'] }
        : { orderBy?: BlanksFqcGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BlanksFqcGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlanksFqcGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BlanksFqc model
   */
  readonly fields: BlanksFqcFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlanksFqc.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlanksFqcClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the BlanksFqc model
   */
  interface BlanksFqcFieldRefs {
    readonly id: FieldRef<"BlanksFqc", 'BigInt'>
    readonly fitting_id: FieldRef<"BlanksFqc", 'String'>
    readonly wms_order_code: FieldRef<"BlanksFqc", 'String'>
    readonly order_id: FieldRef<"BlanksFqc", 'String'>
    readonly product_id: FieldRef<"BlanksFqc", 'String'>
    readonly operator_id: FieldRef<"BlanksFqc", 'String'>
    readonly operator_grade: FieldRef<"BlanksFqc", 'Int'>
    readonly right_sph: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_cyl: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_axis: FieldRef<"BlanksFqc", 'Int'>
    readonly right_ap: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_pd: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_lensometer_sph: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_lensometer_cyl: FieldRef<"BlanksFqc", 'Decimal'>
    readonly right_lensometer_axis: FieldRef<"BlanksFqc", 'Int'>
    readonly right_lensometer_ap: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_sph: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_cyl: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_axis: FieldRef<"BlanksFqc", 'Int'>
    readonly left_ap: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_pd: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_lensometer_sph: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_lensometer_cyl: FieldRef<"BlanksFqc", 'Decimal'>
    readonly left_lensometer_axis: FieldRef<"BlanksFqc", 'Int'>
    readonly left_lensometer_ap: FieldRef<"BlanksFqc", 'Decimal'>
    readonly qc_status: FieldRef<"BlanksFqc", 'BlanksFqcStatus'>
    readonly qcf_dept: FieldRef<"BlanksFqc", 'String'>
    readonly qcf_reason: FieldRef<"BlanksFqc", 'String'>
    readonly fail_side: FieldRef<"BlanksFqc", 'BlanksFqcFailSide'>
    readonly coating: FieldRef<"BlanksFqc", 'String'>
    readonly lens_index: FieldRef<"BlanksFqc", 'String'>
    readonly lens_name: FieldRef<"BlanksFqc", 'String'>
    readonly lens_type: FieldRef<"BlanksFqc", 'String'>
    readonly remarks: FieldRef<"BlanksFqc", 'String'>
    readonly created_at: FieldRef<"BlanksFqc", 'DateTime'>
    readonly updated_at: FieldRef<"BlanksFqc", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BlanksFqc findUnique
   */
  export type BlanksFqcFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter, which BlanksFqc to fetch.
     */
    where: BlanksFqcWhereUniqueInput
  }

  /**
   * BlanksFqc findUniqueOrThrow
   */
  export type BlanksFqcFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter, which BlanksFqc to fetch.
     */
    where: BlanksFqcWhereUniqueInput
  }

  /**
   * BlanksFqc findFirst
   */
  export type BlanksFqcFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter, which BlanksFqc to fetch.
     */
    where?: BlanksFqcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlanksFqcs to fetch.
     */
    orderBy?: BlanksFqcOrderByWithRelationInput | BlanksFqcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlanksFqcs.
     */
    cursor?: BlanksFqcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlanksFqcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlanksFqcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlanksFqcs.
     */
    distinct?: BlanksFqcScalarFieldEnum | BlanksFqcScalarFieldEnum[]
  }

  /**
   * BlanksFqc findFirstOrThrow
   */
  export type BlanksFqcFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter, which BlanksFqc to fetch.
     */
    where?: BlanksFqcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlanksFqcs to fetch.
     */
    orderBy?: BlanksFqcOrderByWithRelationInput | BlanksFqcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlanksFqcs.
     */
    cursor?: BlanksFqcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlanksFqcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlanksFqcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlanksFqcs.
     */
    distinct?: BlanksFqcScalarFieldEnum | BlanksFqcScalarFieldEnum[]
  }

  /**
   * BlanksFqc findMany
   */
  export type BlanksFqcFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter, which BlanksFqcs to fetch.
     */
    where?: BlanksFqcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlanksFqcs to fetch.
     */
    orderBy?: BlanksFqcOrderByWithRelationInput | BlanksFqcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BlanksFqcs.
     */
    cursor?: BlanksFqcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlanksFqcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlanksFqcs.
     */
    skip?: number
    distinct?: BlanksFqcScalarFieldEnum | BlanksFqcScalarFieldEnum[]
  }

  /**
   * BlanksFqc create
   */
  export type BlanksFqcCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * The data needed to create a BlanksFqc.
     */
    data: XOR<BlanksFqcCreateInput, BlanksFqcUncheckedCreateInput>
  }

  /**
   * BlanksFqc createMany
   */
  export type BlanksFqcCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BlanksFqcs.
     */
    data: BlanksFqcCreateManyInput | BlanksFqcCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlanksFqc update
   */
  export type BlanksFqcUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * The data needed to update a BlanksFqc.
     */
    data: XOR<BlanksFqcUpdateInput, BlanksFqcUncheckedUpdateInput>
    /**
     * Choose, which BlanksFqc to update.
     */
    where: BlanksFqcWhereUniqueInput
  }

  /**
   * BlanksFqc updateMany
   */
  export type BlanksFqcUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BlanksFqcs.
     */
    data: XOR<BlanksFqcUpdateManyMutationInput, BlanksFqcUncheckedUpdateManyInput>
    /**
     * Filter which BlanksFqcs to update
     */
    where?: BlanksFqcWhereInput
    /**
     * Limit how many BlanksFqcs to update.
     */
    limit?: number
  }

  /**
   * BlanksFqc upsert
   */
  export type BlanksFqcUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * The filter to search for the BlanksFqc to update in case it exists.
     */
    where: BlanksFqcWhereUniqueInput
    /**
     * In case the BlanksFqc found by the `where` argument doesn't exist, create a new BlanksFqc with this data.
     */
    create: XOR<BlanksFqcCreateInput, BlanksFqcUncheckedCreateInput>
    /**
     * In case the BlanksFqc was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlanksFqcUpdateInput, BlanksFqcUncheckedUpdateInput>
  }

  /**
   * BlanksFqc delete
   */
  export type BlanksFqcDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
    /**
     * Filter which BlanksFqc to delete.
     */
    where: BlanksFqcWhereUniqueInput
  }

  /**
   * BlanksFqc deleteMany
   */
  export type BlanksFqcDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlanksFqcs to delete
     */
    where?: BlanksFqcWhereInput
    /**
     * Limit how many BlanksFqcs to delete.
     */
    limit?: number
  }

  /**
   * BlanksFqc without action
   */
  export type BlanksFqcDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlanksFqc
     */
    select?: BlanksFqcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlanksFqc
     */
    omit?: BlanksFqcOmit<ExtArgs> | null
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


  export const LocationBlankCheckLogScalarFieldEnum: {
    id: 'id',
    operatorId: 'operatorId',
    fittingId: 'fittingId',
    locationId: 'locationId',
    product1Id: 'product1Id',
    product1Barcode: 'product1Barcode',
    product1UpdatedAt: 'product1UpdatedAt',
    product1IsValid: 'product1IsValid',
    product2Id: 'product2Id',
    product2Barcode: 'product2Barcode',
    product2UpdatedAt: 'product2UpdatedAt',
    product2IsValid: 'product2IsValid',
    allGreen: 'allGreen',
    scannedAt: 'scannedAt'
  };

  export type LocationBlankCheckLogScalarFieldEnum = (typeof LocationBlankCheckLogScalarFieldEnum)[keyof typeof LocationBlankCheckLogScalarFieldEnum]


  export const LabOutCheckLogsScalarFieldEnum: {
    id: 'id',
    operatorId: 'operatorId',
    fittingId: 'fittingId',
    locationId: 'locationId',
    product1Id: 'product1Id',
    product1Barcode: 'product1Barcode',
    product1UpdatedAt: 'product1UpdatedAt',
    product1IsValid: 'product1IsValid',
    product2Id: 'product2Id',
    product2Barcode: 'product2Barcode',
    product2UpdatedAt: 'product2UpdatedAt',
    product2IsValid: 'product2IsValid',
    allGreen: 'allGreen',
    scannedAt: 'scannedAt'
  };

  export type LabOutCheckLogsScalarFieldEnum = (typeof LabOutCheckLogsScalarFieldEnum)[keyof typeof LabOutCheckLogsScalarFieldEnum]


  export const BlanksFqcScalarFieldEnum: {
    id: 'id',
    fitting_id: 'fitting_id',
    wms_order_code: 'wms_order_code',
    order_id: 'order_id',
    product_id: 'product_id',
    operator_id: 'operator_id',
    operator_grade: 'operator_grade',
    right_sph: 'right_sph',
    right_cyl: 'right_cyl',
    right_axis: 'right_axis',
    right_ap: 'right_ap',
    right_pd: 'right_pd',
    right_lensometer_sph: 'right_lensometer_sph',
    right_lensometer_cyl: 'right_lensometer_cyl',
    right_lensometer_axis: 'right_lensometer_axis',
    right_lensometer_ap: 'right_lensometer_ap',
    left_sph: 'left_sph',
    left_cyl: 'left_cyl',
    left_axis: 'left_axis',
    left_ap: 'left_ap',
    left_pd: 'left_pd',
    left_lensometer_sph: 'left_lensometer_sph',
    left_lensometer_cyl: 'left_lensometer_cyl',
    left_lensometer_axis: 'left_lensometer_axis',
    left_lensometer_ap: 'left_lensometer_ap',
    qc_status: 'qc_status',
    qcf_dept: 'qcf_dept',
    qcf_reason: 'qcf_reason',
    fail_side: 'fail_side',
    coating: 'coating',
    lens_index: 'lens_index',
    lens_name: 'lens_name',
    lens_type: 'lens_type',
    remarks: 'remarks',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type BlanksFqcScalarFieldEnum = (typeof BlanksFqcScalarFieldEnum)[keyof typeof BlanksFqcScalarFieldEnum]


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


  export const LocationBlankCheckLogOrderByRelevanceFieldEnum: {
    operatorId: 'operatorId',
    fittingId: 'fittingId',
    locationId: 'locationId',
    product1Id: 'product1Id',
    product1Barcode: 'product1Barcode',
    product2Id: 'product2Id',
    product2Barcode: 'product2Barcode'
  };

  export type LocationBlankCheckLogOrderByRelevanceFieldEnum = (typeof LocationBlankCheckLogOrderByRelevanceFieldEnum)[keyof typeof LocationBlankCheckLogOrderByRelevanceFieldEnum]


  export const LabOutCheckLogsOrderByRelevanceFieldEnum: {
    operatorId: 'operatorId',
    fittingId: 'fittingId',
    locationId: 'locationId',
    product1Id: 'product1Id',
    product1Barcode: 'product1Barcode',
    product2Id: 'product2Id',
    product2Barcode: 'product2Barcode'
  };

  export type LabOutCheckLogsOrderByRelevanceFieldEnum = (typeof LabOutCheckLogsOrderByRelevanceFieldEnum)[keyof typeof LabOutCheckLogsOrderByRelevanceFieldEnum]


  export const BlanksFqcOrderByRelevanceFieldEnum: {
    fitting_id: 'fitting_id',
    wms_order_code: 'wms_order_code',
    order_id: 'order_id',
    product_id: 'product_id',
    operator_id: 'operator_id',
    qcf_dept: 'qcf_dept',
    qcf_reason: 'qcf_reason',
    coating: 'coating',
    lens_index: 'lens_index',
    lens_name: 'lens_name',
    lens_type: 'lens_type',
    remarks: 'remarks'
  };

  export type BlanksFqcOrderByRelevanceFieldEnum = (typeof BlanksFqcOrderByRelevanceFieldEnum)[keyof typeof BlanksFqcOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'BlanksFqcStatus'
   */
  export type EnumBlanksFqcStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BlanksFqcStatus'>
    


  /**
   * Reference to a field of type 'BlanksFqcFailSide'
   */
  export type EnumBlanksFqcFailSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BlanksFqcFailSide'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type LocationBlankCheckLogWhereInput = {
    AND?: LocationBlankCheckLogWhereInput | LocationBlankCheckLogWhereInput[]
    OR?: LocationBlankCheckLogWhereInput[]
    NOT?: LocationBlankCheckLogWhereInput | LocationBlankCheckLogWhereInput[]
    id?: IntFilter<"LocationBlankCheckLog"> | number
    operatorId?: StringFilter<"LocationBlankCheckLog"> | string
    fittingId?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    locationId?: StringFilter<"LocationBlankCheckLog"> | string
    product1Id?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product1Barcode?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product1UpdatedAt?: DateTimeNullableFilter<"LocationBlankCheckLog"> | Date | string | null
    product1IsValid?: BoolNullableFilter<"LocationBlankCheckLog"> | boolean | null
    product2Id?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product2Barcode?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product2UpdatedAt?: DateTimeNullableFilter<"LocationBlankCheckLog"> | Date | string | null
    product2IsValid?: BoolNullableFilter<"LocationBlankCheckLog"> | boolean | null
    allGreen?: BoolFilter<"LocationBlankCheckLog"> | boolean
    scannedAt?: DateTimeFilter<"LocationBlankCheckLog"> | Date | string
  }

  export type LocationBlankCheckLogOrderByWithRelationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    product1Id?: SortOrderInput | SortOrder
    product1Barcode?: SortOrderInput | SortOrder
    product1UpdatedAt?: SortOrderInput | SortOrder
    product1IsValid?: SortOrderInput | SortOrder
    product2Id?: SortOrderInput | SortOrder
    product2Barcode?: SortOrderInput | SortOrder
    product2UpdatedAt?: SortOrderInput | SortOrder
    product2IsValid?: SortOrderInput | SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
    _relevance?: LocationBlankCheckLogOrderByRelevanceInput
  }

  export type LocationBlankCheckLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LocationBlankCheckLogWhereInput | LocationBlankCheckLogWhereInput[]
    OR?: LocationBlankCheckLogWhereInput[]
    NOT?: LocationBlankCheckLogWhereInput | LocationBlankCheckLogWhereInput[]
    operatorId?: StringFilter<"LocationBlankCheckLog"> | string
    fittingId?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    locationId?: StringFilter<"LocationBlankCheckLog"> | string
    product1Id?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product1Barcode?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product1UpdatedAt?: DateTimeNullableFilter<"LocationBlankCheckLog"> | Date | string | null
    product1IsValid?: BoolNullableFilter<"LocationBlankCheckLog"> | boolean | null
    product2Id?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product2Barcode?: StringNullableFilter<"LocationBlankCheckLog"> | string | null
    product2UpdatedAt?: DateTimeNullableFilter<"LocationBlankCheckLog"> | Date | string | null
    product2IsValid?: BoolNullableFilter<"LocationBlankCheckLog"> | boolean | null
    allGreen?: BoolFilter<"LocationBlankCheckLog"> | boolean
    scannedAt?: DateTimeFilter<"LocationBlankCheckLog"> | Date | string
  }, "id">

  export type LocationBlankCheckLogOrderByWithAggregationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    product1Id?: SortOrderInput | SortOrder
    product1Barcode?: SortOrderInput | SortOrder
    product1UpdatedAt?: SortOrderInput | SortOrder
    product1IsValid?: SortOrderInput | SortOrder
    product2Id?: SortOrderInput | SortOrder
    product2Barcode?: SortOrderInput | SortOrder
    product2UpdatedAt?: SortOrderInput | SortOrder
    product2IsValid?: SortOrderInput | SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
    _count?: LocationBlankCheckLogCountOrderByAggregateInput
    _avg?: LocationBlankCheckLogAvgOrderByAggregateInput
    _max?: LocationBlankCheckLogMaxOrderByAggregateInput
    _min?: LocationBlankCheckLogMinOrderByAggregateInput
    _sum?: LocationBlankCheckLogSumOrderByAggregateInput
  }

  export type LocationBlankCheckLogScalarWhereWithAggregatesInput = {
    AND?: LocationBlankCheckLogScalarWhereWithAggregatesInput | LocationBlankCheckLogScalarWhereWithAggregatesInput[]
    OR?: LocationBlankCheckLogScalarWhereWithAggregatesInput[]
    NOT?: LocationBlankCheckLogScalarWhereWithAggregatesInput | LocationBlankCheckLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocationBlankCheckLog"> | number
    operatorId?: StringWithAggregatesFilter<"LocationBlankCheckLog"> | string
    fittingId?: StringNullableWithAggregatesFilter<"LocationBlankCheckLog"> | string | null
    locationId?: StringWithAggregatesFilter<"LocationBlankCheckLog"> | string
    product1Id?: StringNullableWithAggregatesFilter<"LocationBlankCheckLog"> | string | null
    product1Barcode?: StringNullableWithAggregatesFilter<"LocationBlankCheckLog"> | string | null
    product1UpdatedAt?: DateTimeNullableWithAggregatesFilter<"LocationBlankCheckLog"> | Date | string | null
    product1IsValid?: BoolNullableWithAggregatesFilter<"LocationBlankCheckLog"> | boolean | null
    product2Id?: StringNullableWithAggregatesFilter<"LocationBlankCheckLog"> | string | null
    product2Barcode?: StringNullableWithAggregatesFilter<"LocationBlankCheckLog"> | string | null
    product2UpdatedAt?: DateTimeNullableWithAggregatesFilter<"LocationBlankCheckLog"> | Date | string | null
    product2IsValid?: BoolNullableWithAggregatesFilter<"LocationBlankCheckLog"> | boolean | null
    allGreen?: BoolWithAggregatesFilter<"LocationBlankCheckLog"> | boolean
    scannedAt?: DateTimeWithAggregatesFilter<"LocationBlankCheckLog"> | Date | string
  }

  export type LabOutCheckLogsWhereInput = {
    AND?: LabOutCheckLogsWhereInput | LabOutCheckLogsWhereInput[]
    OR?: LabOutCheckLogsWhereInput[]
    NOT?: LabOutCheckLogsWhereInput | LabOutCheckLogsWhereInput[]
    id?: IntFilter<"LabOutCheckLogs"> | number
    operatorId?: StringFilter<"LabOutCheckLogs"> | string
    fittingId?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    locationId?: StringFilter<"LabOutCheckLogs"> | string
    product1Id?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product1Barcode?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product1UpdatedAt?: DateTimeNullableFilter<"LabOutCheckLogs"> | Date | string | null
    product1IsValid?: BoolNullableFilter<"LabOutCheckLogs"> | boolean | null
    product2Id?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product2Barcode?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product2UpdatedAt?: DateTimeNullableFilter<"LabOutCheckLogs"> | Date | string | null
    product2IsValid?: BoolNullableFilter<"LabOutCheckLogs"> | boolean | null
    allGreen?: BoolFilter<"LabOutCheckLogs"> | boolean
    scannedAt?: DateTimeFilter<"LabOutCheckLogs"> | Date | string
  }

  export type LabOutCheckLogsOrderByWithRelationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    product1Id?: SortOrderInput | SortOrder
    product1Barcode?: SortOrderInput | SortOrder
    product1UpdatedAt?: SortOrderInput | SortOrder
    product1IsValid?: SortOrderInput | SortOrder
    product2Id?: SortOrderInput | SortOrder
    product2Barcode?: SortOrderInput | SortOrder
    product2UpdatedAt?: SortOrderInput | SortOrder
    product2IsValid?: SortOrderInput | SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
    _relevance?: LabOutCheckLogsOrderByRelevanceInput
  }

  export type LabOutCheckLogsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LabOutCheckLogsWhereInput | LabOutCheckLogsWhereInput[]
    OR?: LabOutCheckLogsWhereInput[]
    NOT?: LabOutCheckLogsWhereInput | LabOutCheckLogsWhereInput[]
    operatorId?: StringFilter<"LabOutCheckLogs"> | string
    fittingId?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    locationId?: StringFilter<"LabOutCheckLogs"> | string
    product1Id?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product1Barcode?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product1UpdatedAt?: DateTimeNullableFilter<"LabOutCheckLogs"> | Date | string | null
    product1IsValid?: BoolNullableFilter<"LabOutCheckLogs"> | boolean | null
    product2Id?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product2Barcode?: StringNullableFilter<"LabOutCheckLogs"> | string | null
    product2UpdatedAt?: DateTimeNullableFilter<"LabOutCheckLogs"> | Date | string | null
    product2IsValid?: BoolNullableFilter<"LabOutCheckLogs"> | boolean | null
    allGreen?: BoolFilter<"LabOutCheckLogs"> | boolean
    scannedAt?: DateTimeFilter<"LabOutCheckLogs"> | Date | string
  }, "id">

  export type LabOutCheckLogsOrderByWithAggregationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    product1Id?: SortOrderInput | SortOrder
    product1Barcode?: SortOrderInput | SortOrder
    product1UpdatedAt?: SortOrderInput | SortOrder
    product1IsValid?: SortOrderInput | SortOrder
    product2Id?: SortOrderInput | SortOrder
    product2Barcode?: SortOrderInput | SortOrder
    product2UpdatedAt?: SortOrderInput | SortOrder
    product2IsValid?: SortOrderInput | SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
    _count?: LabOutCheckLogsCountOrderByAggregateInput
    _avg?: LabOutCheckLogsAvgOrderByAggregateInput
    _max?: LabOutCheckLogsMaxOrderByAggregateInput
    _min?: LabOutCheckLogsMinOrderByAggregateInput
    _sum?: LabOutCheckLogsSumOrderByAggregateInput
  }

  export type LabOutCheckLogsScalarWhereWithAggregatesInput = {
    AND?: LabOutCheckLogsScalarWhereWithAggregatesInput | LabOutCheckLogsScalarWhereWithAggregatesInput[]
    OR?: LabOutCheckLogsScalarWhereWithAggregatesInput[]
    NOT?: LabOutCheckLogsScalarWhereWithAggregatesInput | LabOutCheckLogsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LabOutCheckLogs"> | number
    operatorId?: StringWithAggregatesFilter<"LabOutCheckLogs"> | string
    fittingId?: StringNullableWithAggregatesFilter<"LabOutCheckLogs"> | string | null
    locationId?: StringWithAggregatesFilter<"LabOutCheckLogs"> | string
    product1Id?: StringNullableWithAggregatesFilter<"LabOutCheckLogs"> | string | null
    product1Barcode?: StringNullableWithAggregatesFilter<"LabOutCheckLogs"> | string | null
    product1UpdatedAt?: DateTimeNullableWithAggregatesFilter<"LabOutCheckLogs"> | Date | string | null
    product1IsValid?: BoolNullableWithAggregatesFilter<"LabOutCheckLogs"> | boolean | null
    product2Id?: StringNullableWithAggregatesFilter<"LabOutCheckLogs"> | string | null
    product2Barcode?: StringNullableWithAggregatesFilter<"LabOutCheckLogs"> | string | null
    product2UpdatedAt?: DateTimeNullableWithAggregatesFilter<"LabOutCheckLogs"> | Date | string | null
    product2IsValid?: BoolNullableWithAggregatesFilter<"LabOutCheckLogs"> | boolean | null
    allGreen?: BoolWithAggregatesFilter<"LabOutCheckLogs"> | boolean
    scannedAt?: DateTimeWithAggregatesFilter<"LabOutCheckLogs"> | Date | string
  }

  export type BlanksFqcWhereInput = {
    AND?: BlanksFqcWhereInput | BlanksFqcWhereInput[]
    OR?: BlanksFqcWhereInput[]
    NOT?: BlanksFqcWhereInput | BlanksFqcWhereInput[]
    id?: BigIntFilter<"BlanksFqc"> | bigint | number
    fitting_id?: StringFilter<"BlanksFqc"> | string
    wms_order_code?: StringFilter<"BlanksFqc"> | string
    order_id?: StringFilter<"BlanksFqc"> | string
    product_id?: StringNullableFilter<"BlanksFqc"> | string | null
    operator_id?: StringFilter<"BlanksFqc"> | string
    operator_grade?: IntFilter<"BlanksFqc"> | number
    right_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    right_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_pd?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    right_lensometer_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    left_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_pd?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    left_lensometer_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFilter<"BlanksFqc"> | $Enums.BlanksFqcStatus
    qcf_dept?: StringNullableFilter<"BlanksFqc"> | string | null
    qcf_reason?: StringNullableFilter<"BlanksFqc"> | string | null
    fail_side?: EnumBlanksFqcFailSideNullableFilter<"BlanksFqc"> | $Enums.BlanksFqcFailSide | null
    coating?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_index?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_name?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_type?: StringNullableFilter<"BlanksFqc"> | string | null
    remarks?: StringNullableFilter<"BlanksFqc"> | string | null
    created_at?: DateTimeNullableFilter<"BlanksFqc"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"BlanksFqc"> | Date | string | null
  }

  export type BlanksFqcOrderByWithRelationInput = {
    id?: SortOrder
    fitting_id?: SortOrder
    wms_order_code?: SortOrder
    order_id?: SortOrder
    product_id?: SortOrderInput | SortOrder
    operator_id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrderInput | SortOrder
    right_cyl?: SortOrderInput | SortOrder
    right_axis?: SortOrderInput | SortOrder
    right_ap?: SortOrderInput | SortOrder
    right_pd?: SortOrderInput | SortOrder
    right_lensometer_sph?: SortOrderInput | SortOrder
    right_lensometer_cyl?: SortOrderInput | SortOrder
    right_lensometer_axis?: SortOrderInput | SortOrder
    right_lensometer_ap?: SortOrderInput | SortOrder
    left_sph?: SortOrderInput | SortOrder
    left_cyl?: SortOrderInput | SortOrder
    left_axis?: SortOrderInput | SortOrder
    left_ap?: SortOrderInput | SortOrder
    left_pd?: SortOrderInput | SortOrder
    left_lensometer_sph?: SortOrderInput | SortOrder
    left_lensometer_cyl?: SortOrderInput | SortOrder
    left_lensometer_axis?: SortOrderInput | SortOrder
    left_lensometer_ap?: SortOrderInput | SortOrder
    qc_status?: SortOrder
    qcf_dept?: SortOrderInput | SortOrder
    qcf_reason?: SortOrderInput | SortOrder
    fail_side?: SortOrderInput | SortOrder
    coating?: SortOrderInput | SortOrder
    lens_index?: SortOrderInput | SortOrder
    lens_name?: SortOrderInput | SortOrder
    lens_type?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _relevance?: BlanksFqcOrderByRelevanceInput
  }

  export type BlanksFqcWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: BlanksFqcWhereInput | BlanksFqcWhereInput[]
    OR?: BlanksFqcWhereInput[]
    NOT?: BlanksFqcWhereInput | BlanksFqcWhereInput[]
    fitting_id?: StringFilter<"BlanksFqc"> | string
    wms_order_code?: StringFilter<"BlanksFqc"> | string
    order_id?: StringFilter<"BlanksFqc"> | string
    product_id?: StringNullableFilter<"BlanksFqc"> | string | null
    operator_id?: StringFilter<"BlanksFqc"> | string
    operator_grade?: IntFilter<"BlanksFqc"> | number
    right_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    right_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_pd?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    right_lensometer_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    left_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_pd?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: IntNullableFilter<"BlanksFqc"> | number | null
    left_lensometer_ap?: DecimalNullableFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFilter<"BlanksFqc"> | $Enums.BlanksFqcStatus
    qcf_dept?: StringNullableFilter<"BlanksFqc"> | string | null
    qcf_reason?: StringNullableFilter<"BlanksFqc"> | string | null
    fail_side?: EnumBlanksFqcFailSideNullableFilter<"BlanksFqc"> | $Enums.BlanksFqcFailSide | null
    coating?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_index?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_name?: StringNullableFilter<"BlanksFqc"> | string | null
    lens_type?: StringNullableFilter<"BlanksFqc"> | string | null
    remarks?: StringNullableFilter<"BlanksFqc"> | string | null
    created_at?: DateTimeNullableFilter<"BlanksFqc"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"BlanksFqc"> | Date | string | null
  }, "id">

  export type BlanksFqcOrderByWithAggregationInput = {
    id?: SortOrder
    fitting_id?: SortOrder
    wms_order_code?: SortOrder
    order_id?: SortOrder
    product_id?: SortOrderInput | SortOrder
    operator_id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrderInput | SortOrder
    right_cyl?: SortOrderInput | SortOrder
    right_axis?: SortOrderInput | SortOrder
    right_ap?: SortOrderInput | SortOrder
    right_pd?: SortOrderInput | SortOrder
    right_lensometer_sph?: SortOrderInput | SortOrder
    right_lensometer_cyl?: SortOrderInput | SortOrder
    right_lensometer_axis?: SortOrderInput | SortOrder
    right_lensometer_ap?: SortOrderInput | SortOrder
    left_sph?: SortOrderInput | SortOrder
    left_cyl?: SortOrderInput | SortOrder
    left_axis?: SortOrderInput | SortOrder
    left_ap?: SortOrderInput | SortOrder
    left_pd?: SortOrderInput | SortOrder
    left_lensometer_sph?: SortOrderInput | SortOrder
    left_lensometer_cyl?: SortOrderInput | SortOrder
    left_lensometer_axis?: SortOrderInput | SortOrder
    left_lensometer_ap?: SortOrderInput | SortOrder
    qc_status?: SortOrder
    qcf_dept?: SortOrderInput | SortOrder
    qcf_reason?: SortOrderInput | SortOrder
    fail_side?: SortOrderInput | SortOrder
    coating?: SortOrderInput | SortOrder
    lens_index?: SortOrderInput | SortOrder
    lens_name?: SortOrderInput | SortOrder
    lens_type?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: BlanksFqcCountOrderByAggregateInput
    _avg?: BlanksFqcAvgOrderByAggregateInput
    _max?: BlanksFqcMaxOrderByAggregateInput
    _min?: BlanksFqcMinOrderByAggregateInput
    _sum?: BlanksFqcSumOrderByAggregateInput
  }

  export type BlanksFqcScalarWhereWithAggregatesInput = {
    AND?: BlanksFqcScalarWhereWithAggregatesInput | BlanksFqcScalarWhereWithAggregatesInput[]
    OR?: BlanksFqcScalarWhereWithAggregatesInput[]
    NOT?: BlanksFqcScalarWhereWithAggregatesInput | BlanksFqcScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"BlanksFqc"> | bigint | number
    fitting_id?: StringWithAggregatesFilter<"BlanksFqc"> | string
    wms_order_code?: StringWithAggregatesFilter<"BlanksFqc"> | string
    order_id?: StringWithAggregatesFilter<"BlanksFqc"> | string
    product_id?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    operator_id?: StringWithAggregatesFilter<"BlanksFqc"> | string
    operator_grade?: IntWithAggregatesFilter<"BlanksFqc"> | number
    right_sph?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_cyl?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_axis?: IntNullableWithAggregatesFilter<"BlanksFqc"> | number | null
    right_ap?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_pd?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: IntNullableWithAggregatesFilter<"BlanksFqc"> | number | null
    right_lensometer_ap?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_sph?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_cyl?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_axis?: IntNullableWithAggregatesFilter<"BlanksFqc"> | number | null
    left_ap?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_pd?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: IntNullableWithAggregatesFilter<"BlanksFqc"> | number | null
    left_lensometer_ap?: DecimalNullableWithAggregatesFilter<"BlanksFqc"> | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusWithAggregatesFilter<"BlanksFqc"> | $Enums.BlanksFqcStatus
    qcf_dept?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    qcf_reason?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    fail_side?: EnumBlanksFqcFailSideNullableWithAggregatesFilter<"BlanksFqc"> | $Enums.BlanksFqcFailSide | null
    coating?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    lens_index?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    lens_name?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    lens_type?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"BlanksFqc"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"BlanksFqc"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"BlanksFqc"> | Date | string | null
  }

  export type LocationBlankCheckLogCreateInput = {
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LocationBlankCheckLogUncheckedCreateInput = {
    id?: number
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LocationBlankCheckLogUpdateInput = {
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationBlankCheckLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationBlankCheckLogCreateManyInput = {
    id?: number
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LocationBlankCheckLogUpdateManyMutationInput = {
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationBlankCheckLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOutCheckLogsCreateInput = {
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LabOutCheckLogsUncheckedCreateInput = {
    id?: number
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LabOutCheckLogsUpdateInput = {
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOutCheckLogsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOutCheckLogsCreateManyInput = {
    id?: number
    operatorId: string
    fittingId?: string | null
    locationId: string
    product1Id?: string | null
    product1Barcode?: string | null
    product1UpdatedAt?: Date | string | null
    product1IsValid?: boolean | null
    product2Id?: string | null
    product2Barcode?: string | null
    product2UpdatedAt?: Date | string | null
    product2IsValid?: boolean | null
    allGreen?: boolean
    scannedAt?: Date | string
  }

  export type LabOutCheckLogsUpdateManyMutationInput = {
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOutCheckLogsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: StringFieldUpdateOperationsInput | string
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: StringFieldUpdateOperationsInput | string
    product1Id?: NullableStringFieldUpdateOperationsInput | string | null
    product1Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product1UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product1IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    product2Id?: NullableStringFieldUpdateOperationsInput | string | null
    product2Barcode?: NullableStringFieldUpdateOperationsInput | string | null
    product2UpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product2IsValid?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allGreen?: BoolFieldUpdateOperationsInput | boolean
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlanksFqcCreateInput = {
    id?: bigint | number
    fitting_id: string
    wms_order_code: string
    order_id: string
    product_id?: string | null
    operator_id: string
    operator_grade: number
    right_sph?: Decimal | DecimalJsLike | number | string | null
    right_cyl?: Decimal | DecimalJsLike | number | string | null
    right_axis?: number | null
    right_ap?: Decimal | DecimalJsLike | number | string | null
    right_pd?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: number | null
    right_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    left_sph?: Decimal | DecimalJsLike | number | string | null
    left_cyl?: Decimal | DecimalJsLike | number | string | null
    left_axis?: number | null
    left_ap?: Decimal | DecimalJsLike | number | string | null
    left_pd?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: number | null
    left_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    qc_status: $Enums.BlanksFqcStatus
    qcf_dept?: string | null
    qcf_reason?: string | null
    fail_side?: $Enums.BlanksFqcFailSide | null
    coating?: string | null
    lens_index?: string | null
    lens_name?: string | null
    lens_type?: string | null
    remarks?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type BlanksFqcUncheckedCreateInput = {
    id?: bigint | number
    fitting_id: string
    wms_order_code: string
    order_id: string
    product_id?: string | null
    operator_id: string
    operator_grade: number
    right_sph?: Decimal | DecimalJsLike | number | string | null
    right_cyl?: Decimal | DecimalJsLike | number | string | null
    right_axis?: number | null
    right_ap?: Decimal | DecimalJsLike | number | string | null
    right_pd?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: number | null
    right_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    left_sph?: Decimal | DecimalJsLike | number | string | null
    left_cyl?: Decimal | DecimalJsLike | number | string | null
    left_axis?: number | null
    left_ap?: Decimal | DecimalJsLike | number | string | null
    left_pd?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: number | null
    left_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    qc_status: $Enums.BlanksFqcStatus
    qcf_dept?: string | null
    qcf_reason?: string | null
    fail_side?: $Enums.BlanksFqcFailSide | null
    coating?: string | null
    lens_index?: string | null
    lens_name?: string | null
    lens_type?: string | null
    remarks?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type BlanksFqcUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    fitting_id?: StringFieldUpdateOperationsInput | string
    wms_order_code?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    product_id?: NullableStringFieldUpdateOperationsInput | string | null
    operator_id?: StringFieldUpdateOperationsInput | string
    operator_grade?: IntFieldUpdateOperationsInput | number
    right_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFieldUpdateOperationsInput | $Enums.BlanksFqcStatus
    qcf_dept?: NullableStringFieldUpdateOperationsInput | string | null
    qcf_reason?: NullableStringFieldUpdateOperationsInput | string | null
    fail_side?: NullableEnumBlanksFqcFailSideFieldUpdateOperationsInput | $Enums.BlanksFqcFailSide | null
    coating?: NullableStringFieldUpdateOperationsInput | string | null
    lens_index?: NullableStringFieldUpdateOperationsInput | string | null
    lens_name?: NullableStringFieldUpdateOperationsInput | string | null
    lens_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlanksFqcUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    fitting_id?: StringFieldUpdateOperationsInput | string
    wms_order_code?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    product_id?: NullableStringFieldUpdateOperationsInput | string | null
    operator_id?: StringFieldUpdateOperationsInput | string
    operator_grade?: IntFieldUpdateOperationsInput | number
    right_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFieldUpdateOperationsInput | $Enums.BlanksFqcStatus
    qcf_dept?: NullableStringFieldUpdateOperationsInput | string | null
    qcf_reason?: NullableStringFieldUpdateOperationsInput | string | null
    fail_side?: NullableEnumBlanksFqcFailSideFieldUpdateOperationsInput | $Enums.BlanksFqcFailSide | null
    coating?: NullableStringFieldUpdateOperationsInput | string | null
    lens_index?: NullableStringFieldUpdateOperationsInput | string | null
    lens_name?: NullableStringFieldUpdateOperationsInput | string | null
    lens_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlanksFqcCreateManyInput = {
    id?: bigint | number
    fitting_id: string
    wms_order_code: string
    order_id: string
    product_id?: string | null
    operator_id: string
    operator_grade: number
    right_sph?: Decimal | DecimalJsLike | number | string | null
    right_cyl?: Decimal | DecimalJsLike | number | string | null
    right_axis?: number | null
    right_ap?: Decimal | DecimalJsLike | number | string | null
    right_pd?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: number | null
    right_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    left_sph?: Decimal | DecimalJsLike | number | string | null
    left_cyl?: Decimal | DecimalJsLike | number | string | null
    left_axis?: number | null
    left_ap?: Decimal | DecimalJsLike | number | string | null
    left_pd?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: number | null
    left_lensometer_ap?: Decimal | DecimalJsLike | number | string | null
    qc_status: $Enums.BlanksFqcStatus
    qcf_dept?: string | null
    qcf_reason?: string | null
    fail_side?: $Enums.BlanksFqcFailSide | null
    coating?: string | null
    lens_index?: string | null
    lens_name?: string | null
    lens_type?: string | null
    remarks?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type BlanksFqcUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    fitting_id?: StringFieldUpdateOperationsInput | string
    wms_order_code?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    product_id?: NullableStringFieldUpdateOperationsInput | string | null
    operator_id?: StringFieldUpdateOperationsInput | string
    operator_grade?: IntFieldUpdateOperationsInput | number
    right_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFieldUpdateOperationsInput | $Enums.BlanksFqcStatus
    qcf_dept?: NullableStringFieldUpdateOperationsInput | string | null
    qcf_reason?: NullableStringFieldUpdateOperationsInput | string | null
    fail_side?: NullableEnumBlanksFqcFailSideFieldUpdateOperationsInput | $Enums.BlanksFqcFailSide | null
    coating?: NullableStringFieldUpdateOperationsInput | string | null
    lens_index?: NullableStringFieldUpdateOperationsInput | string | null
    lens_name?: NullableStringFieldUpdateOperationsInput | string | null
    lens_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlanksFqcUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    fitting_id?: StringFieldUpdateOperationsInput | string
    wms_order_code?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    product_id?: NullableStringFieldUpdateOperationsInput | string | null
    operator_id?: StringFieldUpdateOperationsInput | string
    operator_grade?: IntFieldUpdateOperationsInput | number
    right_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    right_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    right_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_pd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_sph?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_cyl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    left_lensometer_axis?: NullableIntFieldUpdateOperationsInput | number | null
    left_lensometer_ap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qc_status?: EnumBlanksFqcStatusFieldUpdateOperationsInput | $Enums.BlanksFqcStatus
    qcf_dept?: NullableStringFieldUpdateOperationsInput | string | null
    qcf_reason?: NullableStringFieldUpdateOperationsInput | string | null
    fail_side?: NullableEnumBlanksFqcFailSideFieldUpdateOperationsInput | $Enums.BlanksFqcFailSide | null
    coating?: NullableStringFieldUpdateOperationsInput | string | null
    lens_index?: NullableStringFieldUpdateOperationsInput | string | null
    lens_name?: NullableStringFieldUpdateOperationsInput | string | null
    lens_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocationBlankCheckLogOrderByRelevanceInput = {
    fields: LocationBlankCheckLogOrderByRelevanceFieldEnum | LocationBlankCheckLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LocationBlankCheckLogCountOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LocationBlankCheckLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LocationBlankCheckLogMaxOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LocationBlankCheckLogMinOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LocationBlankCheckLogSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type LabOutCheckLogsOrderByRelevanceInput = {
    fields: LabOutCheckLogsOrderByRelevanceFieldEnum | LabOutCheckLogsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LabOutCheckLogsCountOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LabOutCheckLogsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LabOutCheckLogsMaxOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LabOutCheckLogsMinOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    fittingId?: SortOrder
    locationId?: SortOrder
    product1Id?: SortOrder
    product1Barcode?: SortOrder
    product1UpdatedAt?: SortOrder
    product1IsValid?: SortOrder
    product2Id?: SortOrder
    product2Barcode?: SortOrder
    product2UpdatedAt?: SortOrder
    product2IsValid?: SortOrder
    allGreen?: SortOrder
    scannedAt?: SortOrder
  }

  export type LabOutCheckLogsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumBlanksFqcStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcStatus | EnumBlanksFqcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlanksFqcStatus[]
    notIn?: $Enums.BlanksFqcStatus[]
    not?: NestedEnumBlanksFqcStatusFilter<$PrismaModel> | $Enums.BlanksFqcStatus
  }

  export type EnumBlanksFqcFailSideNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcFailSide | EnumBlanksFqcFailSideFieldRefInput<$PrismaModel> | null
    in?: $Enums.BlanksFqcFailSide[] | null
    notIn?: $Enums.BlanksFqcFailSide[] | null
    not?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel> | $Enums.BlanksFqcFailSide | null
  }

  export type BlanksFqcOrderByRelevanceInput = {
    fields: BlanksFqcOrderByRelevanceFieldEnum | BlanksFqcOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BlanksFqcCountOrderByAggregateInput = {
    id?: SortOrder
    fitting_id?: SortOrder
    wms_order_code?: SortOrder
    order_id?: SortOrder
    product_id?: SortOrder
    operator_id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrder
    right_cyl?: SortOrder
    right_axis?: SortOrder
    right_ap?: SortOrder
    right_pd?: SortOrder
    right_lensometer_sph?: SortOrder
    right_lensometer_cyl?: SortOrder
    right_lensometer_axis?: SortOrder
    right_lensometer_ap?: SortOrder
    left_sph?: SortOrder
    left_cyl?: SortOrder
    left_axis?: SortOrder
    left_ap?: SortOrder
    left_pd?: SortOrder
    left_lensometer_sph?: SortOrder
    left_lensometer_cyl?: SortOrder
    left_lensometer_axis?: SortOrder
    left_lensometer_ap?: SortOrder
    qc_status?: SortOrder
    qcf_dept?: SortOrder
    qcf_reason?: SortOrder
    fail_side?: SortOrder
    coating?: SortOrder
    lens_index?: SortOrder
    lens_name?: SortOrder
    lens_type?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BlanksFqcAvgOrderByAggregateInput = {
    id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrder
    right_cyl?: SortOrder
    right_axis?: SortOrder
    right_ap?: SortOrder
    right_pd?: SortOrder
    right_lensometer_sph?: SortOrder
    right_lensometer_cyl?: SortOrder
    right_lensometer_axis?: SortOrder
    right_lensometer_ap?: SortOrder
    left_sph?: SortOrder
    left_cyl?: SortOrder
    left_axis?: SortOrder
    left_ap?: SortOrder
    left_pd?: SortOrder
    left_lensometer_sph?: SortOrder
    left_lensometer_cyl?: SortOrder
    left_lensometer_axis?: SortOrder
    left_lensometer_ap?: SortOrder
  }

  export type BlanksFqcMaxOrderByAggregateInput = {
    id?: SortOrder
    fitting_id?: SortOrder
    wms_order_code?: SortOrder
    order_id?: SortOrder
    product_id?: SortOrder
    operator_id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrder
    right_cyl?: SortOrder
    right_axis?: SortOrder
    right_ap?: SortOrder
    right_pd?: SortOrder
    right_lensometer_sph?: SortOrder
    right_lensometer_cyl?: SortOrder
    right_lensometer_axis?: SortOrder
    right_lensometer_ap?: SortOrder
    left_sph?: SortOrder
    left_cyl?: SortOrder
    left_axis?: SortOrder
    left_ap?: SortOrder
    left_pd?: SortOrder
    left_lensometer_sph?: SortOrder
    left_lensometer_cyl?: SortOrder
    left_lensometer_axis?: SortOrder
    left_lensometer_ap?: SortOrder
    qc_status?: SortOrder
    qcf_dept?: SortOrder
    qcf_reason?: SortOrder
    fail_side?: SortOrder
    coating?: SortOrder
    lens_index?: SortOrder
    lens_name?: SortOrder
    lens_type?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BlanksFqcMinOrderByAggregateInput = {
    id?: SortOrder
    fitting_id?: SortOrder
    wms_order_code?: SortOrder
    order_id?: SortOrder
    product_id?: SortOrder
    operator_id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrder
    right_cyl?: SortOrder
    right_axis?: SortOrder
    right_ap?: SortOrder
    right_pd?: SortOrder
    right_lensometer_sph?: SortOrder
    right_lensometer_cyl?: SortOrder
    right_lensometer_axis?: SortOrder
    right_lensometer_ap?: SortOrder
    left_sph?: SortOrder
    left_cyl?: SortOrder
    left_axis?: SortOrder
    left_ap?: SortOrder
    left_pd?: SortOrder
    left_lensometer_sph?: SortOrder
    left_lensometer_cyl?: SortOrder
    left_lensometer_axis?: SortOrder
    left_lensometer_ap?: SortOrder
    qc_status?: SortOrder
    qcf_dept?: SortOrder
    qcf_reason?: SortOrder
    fail_side?: SortOrder
    coating?: SortOrder
    lens_index?: SortOrder
    lens_name?: SortOrder
    lens_type?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BlanksFqcSumOrderByAggregateInput = {
    id?: SortOrder
    operator_grade?: SortOrder
    right_sph?: SortOrder
    right_cyl?: SortOrder
    right_axis?: SortOrder
    right_ap?: SortOrder
    right_pd?: SortOrder
    right_lensometer_sph?: SortOrder
    right_lensometer_cyl?: SortOrder
    right_lensometer_axis?: SortOrder
    right_lensometer_ap?: SortOrder
    left_sph?: SortOrder
    left_cyl?: SortOrder
    left_axis?: SortOrder
    left_ap?: SortOrder
    left_pd?: SortOrder
    left_lensometer_sph?: SortOrder
    left_lensometer_cyl?: SortOrder
    left_lensometer_axis?: SortOrder
    left_lensometer_ap?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumBlanksFqcStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcStatus | EnumBlanksFqcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlanksFqcStatus[]
    notIn?: $Enums.BlanksFqcStatus[]
    not?: NestedEnumBlanksFqcStatusWithAggregatesFilter<$PrismaModel> | $Enums.BlanksFqcStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlanksFqcStatusFilter<$PrismaModel>
    _max?: NestedEnumBlanksFqcStatusFilter<$PrismaModel>
  }

  export type EnumBlanksFqcFailSideNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcFailSide | EnumBlanksFqcFailSideFieldRefInput<$PrismaModel> | null
    in?: $Enums.BlanksFqcFailSide[] | null
    notIn?: $Enums.BlanksFqcFailSide[] | null
    not?: NestedEnumBlanksFqcFailSideNullableWithAggregatesFilter<$PrismaModel> | $Enums.BlanksFqcFailSide | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel>
    _max?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumBlanksFqcStatusFieldUpdateOperationsInput = {
    set?: $Enums.BlanksFqcStatus
  }

  export type NullableEnumBlanksFqcFailSideFieldUpdateOperationsInput = {
    set?: $Enums.BlanksFqcFailSide | null
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumBlanksFqcStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcStatus | EnumBlanksFqcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlanksFqcStatus[]
    notIn?: $Enums.BlanksFqcStatus[]
    not?: NestedEnumBlanksFqcStatusFilter<$PrismaModel> | $Enums.BlanksFqcStatus
  }

  export type NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcFailSide | EnumBlanksFqcFailSideFieldRefInput<$PrismaModel> | null
    in?: $Enums.BlanksFqcFailSide[] | null
    notIn?: $Enums.BlanksFqcFailSide[] | null
    not?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel> | $Enums.BlanksFqcFailSide | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumBlanksFqcStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcStatus | EnumBlanksFqcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlanksFqcStatus[]
    notIn?: $Enums.BlanksFqcStatus[]
    not?: NestedEnumBlanksFqcStatusWithAggregatesFilter<$PrismaModel> | $Enums.BlanksFqcStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlanksFqcStatusFilter<$PrismaModel>
    _max?: NestedEnumBlanksFqcStatusFilter<$PrismaModel>
  }

  export type NestedEnumBlanksFqcFailSideNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlanksFqcFailSide | EnumBlanksFqcFailSideFieldRefInput<$PrismaModel> | null
    in?: $Enums.BlanksFqcFailSide[] | null
    notIn?: $Enums.BlanksFqcFailSide[] | null
    not?: NestedEnumBlanksFqcFailSideNullableWithAggregatesFilter<$PrismaModel> | $Enums.BlanksFqcFailSide | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel>
    _max?: NestedEnumBlanksFqcFailSideNullableFilter<$PrismaModel>
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