
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
 * Model Plating
 * 
 */
export type Plating = $Result.DefaultSelection<Prisma.$PlatingPayload>
/**
 * Model FittingScan
 * 
 */
export type FittingScan = $Result.DefaultSelection<Prisma.$FittingScanPayload>
/**
 * Model QcScan
 * 
 */
export type QcScan = $Result.DefaultSelection<Prisma.$QcScanPayload>
/**
 * Model QcReason
 * 
 */
export type QcReason = $Result.DefaultSelection<Prisma.$QcReasonPayload>
/**
 * Model TumblingContainer
 * 
 */
export type TumblingContainer = $Result.DefaultSelection<Prisma.$TumblingContainerPayload>
/**
 * Model TumblingProcess
 * 
 */
export type TumblingProcess = $Result.DefaultSelection<Prisma.$TumblingProcessPayload>
/**
 * Model TumblingConfiguration
 * 
 */
export type TumblingConfiguration = $Result.DefaultSelection<Prisma.$TumblingConfigurationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TumblingContainerSide: {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

export type TumblingContainerSide = (typeof TumblingContainerSide)[keyof typeof TumblingContainerSide]


export const TumblingProcessStatus: {
  DRAFT: 'DRAFT',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  COMPLETED_EARLY: 'COMPLETED_EARLY',
  STOPPED: 'STOPPED',
  CANCELLED: 'CANCELLED'
};

export type TumblingProcessStatus = (typeof TumblingProcessStatus)[keyof typeof TumblingProcessStatus]


export const TumblingCompletionType: {
  AUTOMATIC: 'AUTOMATIC',
  EARLY: 'EARLY',
  STOPPED: 'STOPPED'
};

export type TumblingCompletionType = (typeof TumblingCompletionType)[keyof typeof TumblingCompletionType]

}

export type TumblingContainerSide = $Enums.TumblingContainerSide

export const TumblingContainerSide: typeof $Enums.TumblingContainerSide

export type TumblingProcessStatus = $Enums.TumblingProcessStatus

export const TumblingProcessStatus: typeof $Enums.TumblingProcessStatus

export type TumblingCompletionType = $Enums.TumblingCompletionType

export const TumblingCompletionType: typeof $Enums.TumblingCompletionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Platings
 * const platings = await prisma.plating.findMany()
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
   * // Fetch zero or more Platings
   * const platings = await prisma.plating.findMany()
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
   * `prisma.plating`: Exposes CRUD operations for the **Plating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Platings
    * const platings = await prisma.plating.findMany()
    * ```
    */
  get plating(): Prisma.PlatingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fittingScan`: Exposes CRUD operations for the **FittingScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FittingScans
    * const fittingScans = await prisma.fittingScan.findMany()
    * ```
    */
  get fittingScan(): Prisma.FittingScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.qcScan`: Exposes CRUD operations for the **QcScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QcScans
    * const qcScans = await prisma.qcScan.findMany()
    * ```
    */
  get qcScan(): Prisma.QcScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.qcReason`: Exposes CRUD operations for the **QcReason** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QcReasons
    * const qcReasons = await prisma.qcReason.findMany()
    * ```
    */
  get qcReason(): Prisma.QcReasonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tumblingContainer`: Exposes CRUD operations for the **TumblingContainer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumblingContainers
    * const tumblingContainers = await prisma.tumblingContainer.findMany()
    * ```
    */
  get tumblingContainer(): Prisma.TumblingContainerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tumblingProcess`: Exposes CRUD operations for the **TumblingProcess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumblingProcesses
    * const tumblingProcesses = await prisma.tumblingProcess.findMany()
    * ```
    */
  get tumblingProcess(): Prisma.TumblingProcessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tumblingConfiguration`: Exposes CRUD operations for the **TumblingConfiguration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumblingConfigurations
    * const tumblingConfigurations = await prisma.tumblingConfiguration.findMany()
    * ```
    */
  get tumblingConfiguration(): Prisma.TumblingConfigurationDelegate<ExtArgs, ClientOptions>;
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
    Plating: 'Plating',
    FittingScan: 'FittingScan',
    QcScan: 'QcScan',
    QcReason: 'QcReason',
    TumblingContainer: 'TumblingContainer',
    TumblingProcess: 'TumblingProcess',
    TumblingConfiguration: 'TumblingConfiguration'
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
      modelProps: "plating" | "fittingScan" | "qcScan" | "qcReason" | "tumblingContainer" | "tumblingProcess" | "tumblingConfiguration"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Plating: {
        payload: Prisma.$PlatingPayload<ExtArgs>
        fields: Prisma.PlatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          findFirst: {
            args: Prisma.PlatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          findMany: {
            args: Prisma.PlatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>[]
          }
          create: {
            args: Prisma.PlatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          createMany: {
            args: Prisma.PlatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          update: {
            args: Prisma.PlatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          deleteMany: {
            args: Prisma.PlatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatingPayload>
          }
          aggregate: {
            args: Prisma.PlatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlating>
          }
          groupBy: {
            args: Prisma.PlatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlatingCountArgs<ExtArgs>
            result: $Utils.Optional<PlatingCountAggregateOutputType> | number
          }
        }
      }
      FittingScan: {
        payload: Prisma.$FittingScanPayload<ExtArgs>
        fields: Prisma.FittingScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FittingScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FittingScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          findFirst: {
            args: Prisma.FittingScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FittingScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          findMany: {
            args: Prisma.FittingScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>[]
          }
          create: {
            args: Prisma.FittingScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          createMany: {
            args: Prisma.FittingScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FittingScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          update: {
            args: Prisma.FittingScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          deleteMany: {
            args: Prisma.FittingScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FittingScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FittingScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FittingScanPayload>
          }
          aggregate: {
            args: Prisma.FittingScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFittingScan>
          }
          groupBy: {
            args: Prisma.FittingScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FittingScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FittingScanCountArgs<ExtArgs>
            result: $Utils.Optional<FittingScanCountAggregateOutputType> | number
          }
        }
      }
      QcScan: {
        payload: Prisma.$QcScanPayload<ExtArgs>
        fields: Prisma.QcScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QcScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QcScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          findFirst: {
            args: Prisma.QcScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QcScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          findMany: {
            args: Prisma.QcScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>[]
          }
          create: {
            args: Prisma.QcScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          createMany: {
            args: Prisma.QcScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QcScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          update: {
            args: Prisma.QcScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          deleteMany: {
            args: Prisma.QcScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QcScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QcScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcScanPayload>
          }
          aggregate: {
            args: Prisma.QcScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQcScan>
          }
          groupBy: {
            args: Prisma.QcScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<QcScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.QcScanCountArgs<ExtArgs>
            result: $Utils.Optional<QcScanCountAggregateOutputType> | number
          }
        }
      }
      QcReason: {
        payload: Prisma.$QcReasonPayload<ExtArgs>
        fields: Prisma.QcReasonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QcReasonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QcReasonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          findFirst: {
            args: Prisma.QcReasonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QcReasonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          findMany: {
            args: Prisma.QcReasonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>[]
          }
          create: {
            args: Prisma.QcReasonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          createMany: {
            args: Prisma.QcReasonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QcReasonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          update: {
            args: Prisma.QcReasonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          deleteMany: {
            args: Prisma.QcReasonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QcReasonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QcReasonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QcReasonPayload>
          }
          aggregate: {
            args: Prisma.QcReasonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQcReason>
          }
          groupBy: {
            args: Prisma.QcReasonGroupByArgs<ExtArgs>
            result: $Utils.Optional<QcReasonGroupByOutputType>[]
          }
          count: {
            args: Prisma.QcReasonCountArgs<ExtArgs>
            result: $Utils.Optional<QcReasonCountAggregateOutputType> | number
          }
        }
      }
      TumblingContainer: {
        payload: Prisma.$TumblingContainerPayload<ExtArgs>
        fields: Prisma.TumblingContainerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TumblingContainerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TumblingContainerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          findFirst: {
            args: Prisma.TumblingContainerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TumblingContainerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          findMany: {
            args: Prisma.TumblingContainerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>[]
          }
          create: {
            args: Prisma.TumblingContainerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          createMany: {
            args: Prisma.TumblingContainerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TumblingContainerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          update: {
            args: Prisma.TumblingContainerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          deleteMany: {
            args: Prisma.TumblingContainerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TumblingContainerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TumblingContainerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingContainerPayload>
          }
          aggregate: {
            args: Prisma.TumblingContainerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTumblingContainer>
          }
          groupBy: {
            args: Prisma.TumblingContainerGroupByArgs<ExtArgs>
            result: $Utils.Optional<TumblingContainerGroupByOutputType>[]
          }
          count: {
            args: Prisma.TumblingContainerCountArgs<ExtArgs>
            result: $Utils.Optional<TumblingContainerCountAggregateOutputType> | number
          }
        }
      }
      TumblingProcess: {
        payload: Prisma.$TumblingProcessPayload<ExtArgs>
        fields: Prisma.TumblingProcessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TumblingProcessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TumblingProcessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          findFirst: {
            args: Prisma.TumblingProcessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TumblingProcessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          findMany: {
            args: Prisma.TumblingProcessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>[]
          }
          create: {
            args: Prisma.TumblingProcessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          createMany: {
            args: Prisma.TumblingProcessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TumblingProcessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          update: {
            args: Prisma.TumblingProcessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          deleteMany: {
            args: Prisma.TumblingProcessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TumblingProcessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TumblingProcessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingProcessPayload>
          }
          aggregate: {
            args: Prisma.TumblingProcessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTumblingProcess>
          }
          groupBy: {
            args: Prisma.TumblingProcessGroupByArgs<ExtArgs>
            result: $Utils.Optional<TumblingProcessGroupByOutputType>[]
          }
          count: {
            args: Prisma.TumblingProcessCountArgs<ExtArgs>
            result: $Utils.Optional<TumblingProcessCountAggregateOutputType> | number
          }
        }
      }
      TumblingConfiguration: {
        payload: Prisma.$TumblingConfigurationPayload<ExtArgs>
        fields: Prisma.TumblingConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TumblingConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TumblingConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          findFirst: {
            args: Prisma.TumblingConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TumblingConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          findMany: {
            args: Prisma.TumblingConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>[]
          }
          create: {
            args: Prisma.TumblingConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          createMany: {
            args: Prisma.TumblingConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TumblingConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          update: {
            args: Prisma.TumblingConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.TumblingConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TumblingConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TumblingConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumblingConfigurationPayload>
          }
          aggregate: {
            args: Prisma.TumblingConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTumblingConfiguration>
          }
          groupBy: {
            args: Prisma.TumblingConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TumblingConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.TumblingConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<TumblingConfigurationCountAggregateOutputType> | number
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
    plating?: PlatingOmit
    fittingScan?: FittingScanOmit
    qcScan?: QcScanOmit
    qcReason?: QcReasonOmit
    tumblingContainer?: TumblingContainerOmit
    tumblingProcess?: TumblingProcessOmit
    tumblingConfiguration?: TumblingConfigurationOmit
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
   * Count Type TumblingContainerCountOutputType
   */

  export type TumblingContainerCountOutputType = {
    processes: number
  }

  export type TumblingContainerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    processes?: boolean | TumblingContainerCountOutputTypeCountProcessesArgs
  }

  // Custom InputTypes
  /**
   * TumblingContainerCountOutputType without action
   */
  export type TumblingContainerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainerCountOutputType
     */
    select?: TumblingContainerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TumblingContainerCountOutputType without action
   */
  export type TumblingContainerCountOutputTypeCountProcessesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumblingProcessWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Plating
   */

  export type AggregatePlating = {
    _count: PlatingCountAggregateOutputType | null
    _avg: PlatingAvgAggregateOutputType | null
    _sum: PlatingSumAggregateOutputType | null
    _min: PlatingMinAggregateOutputType | null
    _max: PlatingMaxAggregateOutputType | null
  }

  export type PlatingAvgAggregateOutputType = {
    id: number | null
    totalQuantity: number | null
    qcQuantity: number | null
    ngQuantity: number | null
    copperRejection: number | null
    nickelRejection: number | null
    lineRejection: number | null
    fqcRejection: number | null
  }

  export type PlatingSumAggregateOutputType = {
    id: number | null
    totalQuantity: number | null
    qcQuantity: number | null
    ngQuantity: number | null
    copperRejection: number | null
    nickelRejection: number | null
    lineRejection: number | null
    fqcRejection: number | null
  }

  export type PlatingMinAggregateOutputType = {
    id: number | null
    modelId: string | null
    size: string | null
    finish: string | null
    categoryOfWork: string | null
    totalQuantity: number | null
    qcQuantity: number | null
    ngQuantity: number | null
    copperRejection: number | null
    nickelRejection: number | null
    lineRejection: number | null
    fqcRejection: number | null
    updatedAt: Date | null
  }

  export type PlatingMaxAggregateOutputType = {
    id: number | null
    modelId: string | null
    size: string | null
    finish: string | null
    categoryOfWork: string | null
    totalQuantity: number | null
    qcQuantity: number | null
    ngQuantity: number | null
    copperRejection: number | null
    nickelRejection: number | null
    lineRejection: number | null
    fqcRejection: number | null
    updatedAt: Date | null
  }

  export type PlatingCountAggregateOutputType = {
    id: number
    modelId: number
    size: number
    finish: number
    categoryOfWork: number
    totalQuantity: number
    qcQuantity: number
    ngQuantity: number
    copperRejection: number
    nickelRejection: number
    lineRejection: number
    fqcRejection: number
    updatedAt: number
    _all: number
  }


  export type PlatingAvgAggregateInputType = {
    id?: true
    totalQuantity?: true
    qcQuantity?: true
    ngQuantity?: true
    copperRejection?: true
    nickelRejection?: true
    lineRejection?: true
    fqcRejection?: true
  }

  export type PlatingSumAggregateInputType = {
    id?: true
    totalQuantity?: true
    qcQuantity?: true
    ngQuantity?: true
    copperRejection?: true
    nickelRejection?: true
    lineRejection?: true
    fqcRejection?: true
  }

  export type PlatingMinAggregateInputType = {
    id?: true
    modelId?: true
    size?: true
    finish?: true
    categoryOfWork?: true
    totalQuantity?: true
    qcQuantity?: true
    ngQuantity?: true
    copperRejection?: true
    nickelRejection?: true
    lineRejection?: true
    fqcRejection?: true
    updatedAt?: true
  }

  export type PlatingMaxAggregateInputType = {
    id?: true
    modelId?: true
    size?: true
    finish?: true
    categoryOfWork?: true
    totalQuantity?: true
    qcQuantity?: true
    ngQuantity?: true
    copperRejection?: true
    nickelRejection?: true
    lineRejection?: true
    fqcRejection?: true
    updatedAt?: true
  }

  export type PlatingCountAggregateInputType = {
    id?: true
    modelId?: true
    size?: true
    finish?: true
    categoryOfWork?: true
    totalQuantity?: true
    qcQuantity?: true
    ngQuantity?: true
    copperRejection?: true
    nickelRejection?: true
    lineRejection?: true
    fqcRejection?: true
    updatedAt?: true
    _all?: true
  }

  export type PlatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plating to aggregate.
     */
    where?: PlatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Platings to fetch.
     */
    orderBy?: PlatingOrderByWithRelationInput | PlatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Platings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Platings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Platings
    **/
    _count?: true | PlatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlatingMaxAggregateInputType
  }

  export type GetPlatingAggregateType<T extends PlatingAggregateArgs> = {
        [P in keyof T & keyof AggregatePlating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlating[P]>
      : GetScalarType<T[P], AggregatePlating[P]>
  }




  export type PlatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlatingWhereInput
    orderBy?: PlatingOrderByWithAggregationInput | PlatingOrderByWithAggregationInput[]
    by: PlatingScalarFieldEnum[] | PlatingScalarFieldEnum
    having?: PlatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlatingCountAggregateInputType | true
    _avg?: PlatingAvgAggregateInputType
    _sum?: PlatingSumAggregateInputType
    _min?: PlatingMinAggregateInputType
    _max?: PlatingMaxAggregateInputType
  }

  export type PlatingGroupByOutputType = {
    id: number
    modelId: string
    size: string
    finish: string
    categoryOfWork: string
    totalQuantity: number
    qcQuantity: number
    ngQuantity: number
    copperRejection: number
    nickelRejection: number
    lineRejection: number
    fqcRejection: number
    updatedAt: Date
    _count: PlatingCountAggregateOutputType | null
    _avg: PlatingAvgAggregateOutputType | null
    _sum: PlatingSumAggregateOutputType | null
    _min: PlatingMinAggregateOutputType | null
    _max: PlatingMaxAggregateOutputType | null
  }

  type GetPlatingGroupByPayload<T extends PlatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlatingGroupByOutputType[P]>
            : GetScalarType<T[P], PlatingGroupByOutputType[P]>
        }
      >
    >


  export type PlatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelId?: boolean
    size?: boolean
    finish?: boolean
    categoryOfWork?: boolean
    totalQuantity?: boolean
    qcQuantity?: boolean
    ngQuantity?: boolean
    copperRejection?: boolean
    nickelRejection?: boolean
    lineRejection?: boolean
    fqcRejection?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["plating"]>



  export type PlatingSelectScalar = {
    id?: boolean
    modelId?: boolean
    size?: boolean
    finish?: boolean
    categoryOfWork?: boolean
    totalQuantity?: boolean
    qcQuantity?: boolean
    ngQuantity?: boolean
    copperRejection?: boolean
    nickelRejection?: boolean
    lineRejection?: boolean
    fqcRejection?: boolean
    updatedAt?: boolean
  }

  export type PlatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "modelId" | "size" | "finish" | "categoryOfWork" | "totalQuantity" | "qcQuantity" | "ngQuantity" | "copperRejection" | "nickelRejection" | "lineRejection" | "fqcRejection" | "updatedAt", ExtArgs["result"]["plating"]>

  export type $PlatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plating"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      modelId: string
      size: string
      finish: string
      categoryOfWork: string
      totalQuantity: number
      qcQuantity: number
      ngQuantity: number
      copperRejection: number
      nickelRejection: number
      lineRejection: number
      fqcRejection: number
      updatedAt: Date
    }, ExtArgs["result"]["plating"]>
    composites: {}
  }

  type PlatingGetPayload<S extends boolean | null | undefined | PlatingDefaultArgs> = $Result.GetResult<Prisma.$PlatingPayload, S>

  type PlatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlatingCountAggregateInputType | true
    }

  export interface PlatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plating'], meta: { name: 'Plating' } }
    /**
     * Find zero or one Plating that matches the filter.
     * @param {PlatingFindUniqueArgs} args - Arguments to find a Plating
     * @example
     * // Get one Plating
     * const plating = await prisma.plating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlatingFindUniqueArgs>(args: SelectSubset<T, PlatingFindUniqueArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Plating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlatingFindUniqueOrThrowArgs} args - Arguments to find a Plating
     * @example
     * // Get one Plating
     * const plating = await prisma.plating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlatingFindUniqueOrThrowArgs>(args: SelectSubset<T, PlatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingFindFirstArgs} args - Arguments to find a Plating
     * @example
     * // Get one Plating
     * const plating = await prisma.plating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlatingFindFirstArgs>(args?: SelectSubset<T, PlatingFindFirstArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingFindFirstOrThrowArgs} args - Arguments to find a Plating
     * @example
     * // Get one Plating
     * const plating = await prisma.plating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlatingFindFirstOrThrowArgs>(args?: SelectSubset<T, PlatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Platings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Platings
     * const platings = await prisma.plating.findMany()
     * 
     * // Get first 10 Platings
     * const platings = await prisma.plating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const platingWithIdOnly = await prisma.plating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlatingFindManyArgs>(args?: SelectSubset<T, PlatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Plating.
     * @param {PlatingCreateArgs} args - Arguments to create a Plating.
     * @example
     * // Create one Plating
     * const Plating = await prisma.plating.create({
     *   data: {
     *     // ... data to create a Plating
     *   }
     * })
     * 
     */
    create<T extends PlatingCreateArgs>(args: SelectSubset<T, PlatingCreateArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Platings.
     * @param {PlatingCreateManyArgs} args - Arguments to create many Platings.
     * @example
     * // Create many Platings
     * const plating = await prisma.plating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlatingCreateManyArgs>(args?: SelectSubset<T, PlatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Plating.
     * @param {PlatingDeleteArgs} args - Arguments to delete one Plating.
     * @example
     * // Delete one Plating
     * const Plating = await prisma.plating.delete({
     *   where: {
     *     // ... filter to delete one Plating
     *   }
     * })
     * 
     */
    delete<T extends PlatingDeleteArgs>(args: SelectSubset<T, PlatingDeleteArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Plating.
     * @param {PlatingUpdateArgs} args - Arguments to update one Plating.
     * @example
     * // Update one Plating
     * const plating = await prisma.plating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlatingUpdateArgs>(args: SelectSubset<T, PlatingUpdateArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Platings.
     * @param {PlatingDeleteManyArgs} args - Arguments to filter Platings to delete.
     * @example
     * // Delete a few Platings
     * const { count } = await prisma.plating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlatingDeleteManyArgs>(args?: SelectSubset<T, PlatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Platings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Platings
     * const plating = await prisma.plating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlatingUpdateManyArgs>(args: SelectSubset<T, PlatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plating.
     * @param {PlatingUpsertArgs} args - Arguments to update or create a Plating.
     * @example
     * // Update or create a Plating
     * const plating = await prisma.plating.upsert({
     *   create: {
     *     // ... data to create a Plating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plating we want to update
     *   }
     * })
     */
    upsert<T extends PlatingUpsertArgs>(args: SelectSubset<T, PlatingUpsertArgs<ExtArgs>>): Prisma__PlatingClient<$Result.GetResult<Prisma.$PlatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Platings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingCountArgs} args - Arguments to filter Platings to count.
     * @example
     * // Count the number of Platings
     * const count = await prisma.plating.count({
     *   where: {
     *     // ... the filter for the Platings we want to count
     *   }
     * })
    **/
    count<T extends PlatingCountArgs>(
      args?: Subset<T, PlatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlatingAggregateArgs>(args: Subset<T, PlatingAggregateArgs>): Prisma.PrismaPromise<GetPlatingAggregateType<T>>

    /**
     * Group by Plating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatingGroupByArgs} args - Group by arguments.
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
      T extends PlatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlatingGroupByArgs['orderBy'] }
        : { orderBy?: PlatingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PlatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plating model
   */
  readonly fields: PlatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Plating model
   */
  interface PlatingFieldRefs {
    readonly id: FieldRef<"Plating", 'Int'>
    readonly modelId: FieldRef<"Plating", 'String'>
    readonly size: FieldRef<"Plating", 'String'>
    readonly finish: FieldRef<"Plating", 'String'>
    readonly categoryOfWork: FieldRef<"Plating", 'String'>
    readonly totalQuantity: FieldRef<"Plating", 'Int'>
    readonly qcQuantity: FieldRef<"Plating", 'Int'>
    readonly ngQuantity: FieldRef<"Plating", 'Int'>
    readonly copperRejection: FieldRef<"Plating", 'Int'>
    readonly nickelRejection: FieldRef<"Plating", 'Int'>
    readonly lineRejection: FieldRef<"Plating", 'Int'>
    readonly fqcRejection: FieldRef<"Plating", 'Int'>
    readonly updatedAt: FieldRef<"Plating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Plating findUnique
   */
  export type PlatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter, which Plating to fetch.
     */
    where: PlatingWhereUniqueInput
  }

  /**
   * Plating findUniqueOrThrow
   */
  export type PlatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter, which Plating to fetch.
     */
    where: PlatingWhereUniqueInput
  }

  /**
   * Plating findFirst
   */
  export type PlatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter, which Plating to fetch.
     */
    where?: PlatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Platings to fetch.
     */
    orderBy?: PlatingOrderByWithRelationInput | PlatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Platings.
     */
    cursor?: PlatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Platings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Platings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Platings.
     */
    distinct?: PlatingScalarFieldEnum | PlatingScalarFieldEnum[]
  }

  /**
   * Plating findFirstOrThrow
   */
  export type PlatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter, which Plating to fetch.
     */
    where?: PlatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Platings to fetch.
     */
    orderBy?: PlatingOrderByWithRelationInput | PlatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Platings.
     */
    cursor?: PlatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Platings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Platings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Platings.
     */
    distinct?: PlatingScalarFieldEnum | PlatingScalarFieldEnum[]
  }

  /**
   * Plating findMany
   */
  export type PlatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter, which Platings to fetch.
     */
    where?: PlatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Platings to fetch.
     */
    orderBy?: PlatingOrderByWithRelationInput | PlatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Platings.
     */
    cursor?: PlatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Platings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Platings.
     */
    skip?: number
    distinct?: PlatingScalarFieldEnum | PlatingScalarFieldEnum[]
  }

  /**
   * Plating create
   */
  export type PlatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * The data needed to create a Plating.
     */
    data: XOR<PlatingCreateInput, PlatingUncheckedCreateInput>
  }

  /**
   * Plating createMany
   */
  export type PlatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Platings.
     */
    data: PlatingCreateManyInput | PlatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plating update
   */
  export type PlatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * The data needed to update a Plating.
     */
    data: XOR<PlatingUpdateInput, PlatingUncheckedUpdateInput>
    /**
     * Choose, which Plating to update.
     */
    where: PlatingWhereUniqueInput
  }

  /**
   * Plating updateMany
   */
  export type PlatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Platings.
     */
    data: XOR<PlatingUpdateManyMutationInput, PlatingUncheckedUpdateManyInput>
    /**
     * Filter which Platings to update
     */
    where?: PlatingWhereInput
    /**
     * Limit how many Platings to update.
     */
    limit?: number
  }

  /**
   * Plating upsert
   */
  export type PlatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * The filter to search for the Plating to update in case it exists.
     */
    where: PlatingWhereUniqueInput
    /**
     * In case the Plating found by the `where` argument doesn't exist, create a new Plating with this data.
     */
    create: XOR<PlatingCreateInput, PlatingUncheckedCreateInput>
    /**
     * In case the Plating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlatingUpdateInput, PlatingUncheckedUpdateInput>
  }

  /**
   * Plating delete
   */
  export type PlatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
    /**
     * Filter which Plating to delete.
     */
    where: PlatingWhereUniqueInput
  }

  /**
   * Plating deleteMany
   */
  export type PlatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Platings to delete
     */
    where?: PlatingWhereInput
    /**
     * Limit how many Platings to delete.
     */
    limit?: number
  }

  /**
   * Plating without action
   */
  export type PlatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plating
     */
    select?: PlatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plating
     */
    omit?: PlatingOmit<ExtArgs> | null
  }


  /**
   * Model FittingScan
   */

  export type AggregateFittingScan = {
    _count: FittingScanCountAggregateOutputType | null
    _avg: FittingScanAvgAggregateOutputType | null
    _sum: FittingScanSumAggregateOutputType | null
    _min: FittingScanMinAggregateOutputType | null
    _max: FittingScanMaxAggregateOutputType | null
  }

  export type FittingScanAvgAggregateOutputType = {
    id: number | null
  }

  export type FittingScanSumAggregateOutputType = {
    id: number | null
  }

  export type FittingScanMinAggregateOutputType = {
    id: number | null
    barcode: string | null
    lineNumber: string | null
    nosePadPid: string | null
    tipFittingPid: string | null
    lensFittingPid: string | null
    tipBendingPid: string | null
    frontAlignPid: string | null
    frameAlignPid: string | null
    isRework: boolean | null
    timestamp: Date | null
  }

  export type FittingScanMaxAggregateOutputType = {
    id: number | null
    barcode: string | null
    lineNumber: string | null
    nosePadPid: string | null
    tipFittingPid: string | null
    lensFittingPid: string | null
    tipBendingPid: string | null
    frontAlignPid: string | null
    frameAlignPid: string | null
    isRework: boolean | null
    timestamp: Date | null
  }

  export type FittingScanCountAggregateOutputType = {
    id: number
    barcode: number
    lineNumber: number
    nosePadPid: number
    tipFittingPid: number
    lensFittingPid: number
    tipBendingPid: number
    frontAlignPid: number
    frameAlignPid: number
    isRework: number
    timestamp: number
    _all: number
  }


  export type FittingScanAvgAggregateInputType = {
    id?: true
  }

  export type FittingScanSumAggregateInputType = {
    id?: true
  }

  export type FittingScanMinAggregateInputType = {
    id?: true
    barcode?: true
    lineNumber?: true
    nosePadPid?: true
    tipFittingPid?: true
    lensFittingPid?: true
    tipBendingPid?: true
    frontAlignPid?: true
    frameAlignPid?: true
    isRework?: true
    timestamp?: true
  }

  export type FittingScanMaxAggregateInputType = {
    id?: true
    barcode?: true
    lineNumber?: true
    nosePadPid?: true
    tipFittingPid?: true
    lensFittingPid?: true
    tipBendingPid?: true
    frontAlignPid?: true
    frameAlignPid?: true
    isRework?: true
    timestamp?: true
  }

  export type FittingScanCountAggregateInputType = {
    id?: true
    barcode?: true
    lineNumber?: true
    nosePadPid?: true
    tipFittingPid?: true
    lensFittingPid?: true
    tipBendingPid?: true
    frontAlignPid?: true
    frameAlignPid?: true
    isRework?: true
    timestamp?: true
    _all?: true
  }

  export type FittingScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FittingScan to aggregate.
     */
    where?: FittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FittingScans to fetch.
     */
    orderBy?: FittingScanOrderByWithRelationInput | FittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FittingScans
    **/
    _count?: true | FittingScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FittingScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FittingScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FittingScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FittingScanMaxAggregateInputType
  }

  export type GetFittingScanAggregateType<T extends FittingScanAggregateArgs> = {
        [P in keyof T & keyof AggregateFittingScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFittingScan[P]>
      : GetScalarType<T[P], AggregateFittingScan[P]>
  }




  export type FittingScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FittingScanWhereInput
    orderBy?: FittingScanOrderByWithAggregationInput | FittingScanOrderByWithAggregationInput[]
    by: FittingScanScalarFieldEnum[] | FittingScanScalarFieldEnum
    having?: FittingScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FittingScanCountAggregateInputType | true
    _avg?: FittingScanAvgAggregateInputType
    _sum?: FittingScanSumAggregateInputType
    _min?: FittingScanMinAggregateInputType
    _max?: FittingScanMaxAggregateInputType
  }

  export type FittingScanGroupByOutputType = {
    id: number
    barcode: string
    lineNumber: string
    nosePadPid: string
    tipFittingPid: string
    lensFittingPid: string
    tipBendingPid: string
    frontAlignPid: string
    frameAlignPid: string
    isRework: boolean
    timestamp: Date
    _count: FittingScanCountAggregateOutputType | null
    _avg: FittingScanAvgAggregateOutputType | null
    _sum: FittingScanSumAggregateOutputType | null
    _min: FittingScanMinAggregateOutputType | null
    _max: FittingScanMaxAggregateOutputType | null
  }

  type GetFittingScanGroupByPayload<T extends FittingScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FittingScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FittingScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FittingScanGroupByOutputType[P]>
            : GetScalarType<T[P], FittingScanGroupByOutputType[P]>
        }
      >
    >


  export type FittingScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    barcode?: boolean
    lineNumber?: boolean
    nosePadPid?: boolean
    tipFittingPid?: boolean
    lensFittingPid?: boolean
    tipBendingPid?: boolean
    frontAlignPid?: boolean
    frameAlignPid?: boolean
    isRework?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["fittingScan"]>



  export type FittingScanSelectScalar = {
    id?: boolean
    barcode?: boolean
    lineNumber?: boolean
    nosePadPid?: boolean
    tipFittingPid?: boolean
    lensFittingPid?: boolean
    tipBendingPid?: boolean
    frontAlignPid?: boolean
    frameAlignPid?: boolean
    isRework?: boolean
    timestamp?: boolean
  }

  export type FittingScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "barcode" | "lineNumber" | "nosePadPid" | "tipFittingPid" | "lensFittingPid" | "tipBendingPid" | "frontAlignPid" | "frameAlignPid" | "isRework" | "timestamp", ExtArgs["result"]["fittingScan"]>

  export type $FittingScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FittingScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      barcode: string
      lineNumber: string
      nosePadPid: string
      tipFittingPid: string
      lensFittingPid: string
      tipBendingPid: string
      frontAlignPid: string
      frameAlignPid: string
      isRework: boolean
      timestamp: Date
    }, ExtArgs["result"]["fittingScan"]>
    composites: {}
  }

  type FittingScanGetPayload<S extends boolean | null | undefined | FittingScanDefaultArgs> = $Result.GetResult<Prisma.$FittingScanPayload, S>

  type FittingScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FittingScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FittingScanCountAggregateInputType | true
    }

  export interface FittingScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FittingScan'], meta: { name: 'FittingScan' } }
    /**
     * Find zero or one FittingScan that matches the filter.
     * @param {FittingScanFindUniqueArgs} args - Arguments to find a FittingScan
     * @example
     * // Get one FittingScan
     * const fittingScan = await prisma.fittingScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FittingScanFindUniqueArgs>(args: SelectSubset<T, FittingScanFindUniqueArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FittingScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FittingScanFindUniqueOrThrowArgs} args - Arguments to find a FittingScan
     * @example
     * // Get one FittingScan
     * const fittingScan = await prisma.fittingScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FittingScanFindUniqueOrThrowArgs>(args: SelectSubset<T, FittingScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FittingScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanFindFirstArgs} args - Arguments to find a FittingScan
     * @example
     * // Get one FittingScan
     * const fittingScan = await prisma.fittingScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FittingScanFindFirstArgs>(args?: SelectSubset<T, FittingScanFindFirstArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FittingScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanFindFirstOrThrowArgs} args - Arguments to find a FittingScan
     * @example
     * // Get one FittingScan
     * const fittingScan = await prisma.fittingScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FittingScanFindFirstOrThrowArgs>(args?: SelectSubset<T, FittingScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FittingScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FittingScans
     * const fittingScans = await prisma.fittingScan.findMany()
     * 
     * // Get first 10 FittingScans
     * const fittingScans = await prisma.fittingScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fittingScanWithIdOnly = await prisma.fittingScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FittingScanFindManyArgs>(args?: SelectSubset<T, FittingScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FittingScan.
     * @param {FittingScanCreateArgs} args - Arguments to create a FittingScan.
     * @example
     * // Create one FittingScan
     * const FittingScan = await prisma.fittingScan.create({
     *   data: {
     *     // ... data to create a FittingScan
     *   }
     * })
     * 
     */
    create<T extends FittingScanCreateArgs>(args: SelectSubset<T, FittingScanCreateArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FittingScans.
     * @param {FittingScanCreateManyArgs} args - Arguments to create many FittingScans.
     * @example
     * // Create many FittingScans
     * const fittingScan = await prisma.fittingScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FittingScanCreateManyArgs>(args?: SelectSubset<T, FittingScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FittingScan.
     * @param {FittingScanDeleteArgs} args - Arguments to delete one FittingScan.
     * @example
     * // Delete one FittingScan
     * const FittingScan = await prisma.fittingScan.delete({
     *   where: {
     *     // ... filter to delete one FittingScan
     *   }
     * })
     * 
     */
    delete<T extends FittingScanDeleteArgs>(args: SelectSubset<T, FittingScanDeleteArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FittingScan.
     * @param {FittingScanUpdateArgs} args - Arguments to update one FittingScan.
     * @example
     * // Update one FittingScan
     * const fittingScan = await prisma.fittingScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FittingScanUpdateArgs>(args: SelectSubset<T, FittingScanUpdateArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FittingScans.
     * @param {FittingScanDeleteManyArgs} args - Arguments to filter FittingScans to delete.
     * @example
     * // Delete a few FittingScans
     * const { count } = await prisma.fittingScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FittingScanDeleteManyArgs>(args?: SelectSubset<T, FittingScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FittingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FittingScans
     * const fittingScan = await prisma.fittingScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FittingScanUpdateManyArgs>(args: SelectSubset<T, FittingScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FittingScan.
     * @param {FittingScanUpsertArgs} args - Arguments to update or create a FittingScan.
     * @example
     * // Update or create a FittingScan
     * const fittingScan = await prisma.fittingScan.upsert({
     *   create: {
     *     // ... data to create a FittingScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FittingScan we want to update
     *   }
     * })
     */
    upsert<T extends FittingScanUpsertArgs>(args: SelectSubset<T, FittingScanUpsertArgs<ExtArgs>>): Prisma__FittingScanClient<$Result.GetResult<Prisma.$FittingScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FittingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanCountArgs} args - Arguments to filter FittingScans to count.
     * @example
     * // Count the number of FittingScans
     * const count = await prisma.fittingScan.count({
     *   where: {
     *     // ... the filter for the FittingScans we want to count
     *   }
     * })
    **/
    count<T extends FittingScanCountArgs>(
      args?: Subset<T, FittingScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FittingScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FittingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FittingScanAggregateArgs>(args: Subset<T, FittingScanAggregateArgs>): Prisma.PrismaPromise<GetFittingScanAggregateType<T>>

    /**
     * Group by FittingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FittingScanGroupByArgs} args - Group by arguments.
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
      T extends FittingScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FittingScanGroupByArgs['orderBy'] }
        : { orderBy?: FittingScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FittingScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFittingScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FittingScan model
   */
  readonly fields: FittingScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FittingScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FittingScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the FittingScan model
   */
  interface FittingScanFieldRefs {
    readonly id: FieldRef<"FittingScan", 'Int'>
    readonly barcode: FieldRef<"FittingScan", 'String'>
    readonly lineNumber: FieldRef<"FittingScan", 'String'>
    readonly nosePadPid: FieldRef<"FittingScan", 'String'>
    readonly tipFittingPid: FieldRef<"FittingScan", 'String'>
    readonly lensFittingPid: FieldRef<"FittingScan", 'String'>
    readonly tipBendingPid: FieldRef<"FittingScan", 'String'>
    readonly frontAlignPid: FieldRef<"FittingScan", 'String'>
    readonly frameAlignPid: FieldRef<"FittingScan", 'String'>
    readonly isRework: FieldRef<"FittingScan", 'Boolean'>
    readonly timestamp: FieldRef<"FittingScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FittingScan findUnique
   */
  export type FittingScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter, which FittingScan to fetch.
     */
    where: FittingScanWhereUniqueInput
  }

  /**
   * FittingScan findUniqueOrThrow
   */
  export type FittingScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter, which FittingScan to fetch.
     */
    where: FittingScanWhereUniqueInput
  }

  /**
   * FittingScan findFirst
   */
  export type FittingScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter, which FittingScan to fetch.
     */
    where?: FittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FittingScans to fetch.
     */
    orderBy?: FittingScanOrderByWithRelationInput | FittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FittingScans.
     */
    cursor?: FittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FittingScans.
     */
    distinct?: FittingScanScalarFieldEnum | FittingScanScalarFieldEnum[]
  }

  /**
   * FittingScan findFirstOrThrow
   */
  export type FittingScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter, which FittingScan to fetch.
     */
    where?: FittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FittingScans to fetch.
     */
    orderBy?: FittingScanOrderByWithRelationInput | FittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FittingScans.
     */
    cursor?: FittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FittingScans.
     */
    distinct?: FittingScanScalarFieldEnum | FittingScanScalarFieldEnum[]
  }

  /**
   * FittingScan findMany
   */
  export type FittingScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter, which FittingScans to fetch.
     */
    where?: FittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FittingScans to fetch.
     */
    orderBy?: FittingScanOrderByWithRelationInput | FittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FittingScans.
     */
    cursor?: FittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FittingScans.
     */
    skip?: number
    distinct?: FittingScanScalarFieldEnum | FittingScanScalarFieldEnum[]
  }

  /**
   * FittingScan create
   */
  export type FittingScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * The data needed to create a FittingScan.
     */
    data: XOR<FittingScanCreateInput, FittingScanUncheckedCreateInput>
  }

  /**
   * FittingScan createMany
   */
  export type FittingScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FittingScans.
     */
    data: FittingScanCreateManyInput | FittingScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FittingScan update
   */
  export type FittingScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * The data needed to update a FittingScan.
     */
    data: XOR<FittingScanUpdateInput, FittingScanUncheckedUpdateInput>
    /**
     * Choose, which FittingScan to update.
     */
    where: FittingScanWhereUniqueInput
  }

  /**
   * FittingScan updateMany
   */
  export type FittingScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FittingScans.
     */
    data: XOR<FittingScanUpdateManyMutationInput, FittingScanUncheckedUpdateManyInput>
    /**
     * Filter which FittingScans to update
     */
    where?: FittingScanWhereInput
    /**
     * Limit how many FittingScans to update.
     */
    limit?: number
  }

  /**
   * FittingScan upsert
   */
  export type FittingScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * The filter to search for the FittingScan to update in case it exists.
     */
    where: FittingScanWhereUniqueInput
    /**
     * In case the FittingScan found by the `where` argument doesn't exist, create a new FittingScan with this data.
     */
    create: XOR<FittingScanCreateInput, FittingScanUncheckedCreateInput>
    /**
     * In case the FittingScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FittingScanUpdateInput, FittingScanUncheckedUpdateInput>
  }

  /**
   * FittingScan delete
   */
  export type FittingScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
    /**
     * Filter which FittingScan to delete.
     */
    where: FittingScanWhereUniqueInput
  }

  /**
   * FittingScan deleteMany
   */
  export type FittingScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FittingScans to delete
     */
    where?: FittingScanWhereInput
    /**
     * Limit how many FittingScans to delete.
     */
    limit?: number
  }

  /**
   * FittingScan without action
   */
  export type FittingScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FittingScan
     */
    select?: FittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FittingScan
     */
    omit?: FittingScanOmit<ExtArgs> | null
  }


  /**
   * Model QcScan
   */

  export type AggregateQcScan = {
    _count: QcScanCountAggregateOutputType | null
    _avg: QcScanAvgAggregateOutputType | null
    _sum: QcScanSumAggregateOutputType | null
    _min: QcScanMinAggregateOutputType | null
    _max: QcScanMaxAggregateOutputType | null
  }

  export type QcScanAvgAggregateOutputType = {
    id: number | null
  }

  export type QcScanSumAggregateOutputType = {
    id: number | null
  }

  export type QcScanMinAggregateOutputType = {
    id: number | null
    barcode: string | null
    qcPerson: string | null
    qcStation: string | null
    status: string | null
    reason: string | null
    timestamp: Date | null
  }

  export type QcScanMaxAggregateOutputType = {
    id: number | null
    barcode: string | null
    qcPerson: string | null
    qcStation: string | null
    status: string | null
    reason: string | null
    timestamp: Date | null
  }

  export type QcScanCountAggregateOutputType = {
    id: number
    barcode: number
    qcPerson: number
    qcStation: number
    status: number
    reason: number
    timestamp: number
    _all: number
  }


  export type QcScanAvgAggregateInputType = {
    id?: true
  }

  export type QcScanSumAggregateInputType = {
    id?: true
  }

  export type QcScanMinAggregateInputType = {
    id?: true
    barcode?: true
    qcPerson?: true
    qcStation?: true
    status?: true
    reason?: true
    timestamp?: true
  }

  export type QcScanMaxAggregateInputType = {
    id?: true
    barcode?: true
    qcPerson?: true
    qcStation?: true
    status?: true
    reason?: true
    timestamp?: true
  }

  export type QcScanCountAggregateInputType = {
    id?: true
    barcode?: true
    qcPerson?: true
    qcStation?: true
    status?: true
    reason?: true
    timestamp?: true
    _all?: true
  }

  export type QcScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QcScan to aggregate.
     */
    where?: QcScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcScans to fetch.
     */
    orderBy?: QcScanOrderByWithRelationInput | QcScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QcScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QcScans
    **/
    _count?: true | QcScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QcScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QcScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QcScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QcScanMaxAggregateInputType
  }

  export type GetQcScanAggregateType<T extends QcScanAggregateArgs> = {
        [P in keyof T & keyof AggregateQcScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQcScan[P]>
      : GetScalarType<T[P], AggregateQcScan[P]>
  }




  export type QcScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QcScanWhereInput
    orderBy?: QcScanOrderByWithAggregationInput | QcScanOrderByWithAggregationInput[]
    by: QcScanScalarFieldEnum[] | QcScanScalarFieldEnum
    having?: QcScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QcScanCountAggregateInputType | true
    _avg?: QcScanAvgAggregateInputType
    _sum?: QcScanSumAggregateInputType
    _min?: QcScanMinAggregateInputType
    _max?: QcScanMaxAggregateInputType
  }

  export type QcScanGroupByOutputType = {
    id: number
    barcode: string
    qcPerson: string
    qcStation: string
    status: string
    reason: string | null
    timestamp: Date
    _count: QcScanCountAggregateOutputType | null
    _avg: QcScanAvgAggregateOutputType | null
    _sum: QcScanSumAggregateOutputType | null
    _min: QcScanMinAggregateOutputType | null
    _max: QcScanMaxAggregateOutputType | null
  }

  type GetQcScanGroupByPayload<T extends QcScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QcScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QcScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QcScanGroupByOutputType[P]>
            : GetScalarType<T[P], QcScanGroupByOutputType[P]>
        }
      >
    >


  export type QcScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    barcode?: boolean
    qcPerson?: boolean
    qcStation?: boolean
    status?: boolean
    reason?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["qcScan"]>



  export type QcScanSelectScalar = {
    id?: boolean
    barcode?: boolean
    qcPerson?: boolean
    qcStation?: boolean
    status?: boolean
    reason?: boolean
    timestamp?: boolean
  }

  export type QcScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "barcode" | "qcPerson" | "qcStation" | "status" | "reason" | "timestamp", ExtArgs["result"]["qcScan"]>

  export type $QcScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QcScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      barcode: string
      qcPerson: string
      qcStation: string
      status: string
      reason: string | null
      timestamp: Date
    }, ExtArgs["result"]["qcScan"]>
    composites: {}
  }

  type QcScanGetPayload<S extends boolean | null | undefined | QcScanDefaultArgs> = $Result.GetResult<Prisma.$QcScanPayload, S>

  type QcScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QcScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QcScanCountAggregateInputType | true
    }

  export interface QcScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QcScan'], meta: { name: 'QcScan' } }
    /**
     * Find zero or one QcScan that matches the filter.
     * @param {QcScanFindUniqueArgs} args - Arguments to find a QcScan
     * @example
     * // Get one QcScan
     * const qcScan = await prisma.qcScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QcScanFindUniqueArgs>(args: SelectSubset<T, QcScanFindUniqueArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QcScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QcScanFindUniqueOrThrowArgs} args - Arguments to find a QcScan
     * @example
     * // Get one QcScan
     * const qcScan = await prisma.qcScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QcScanFindUniqueOrThrowArgs>(args: SelectSubset<T, QcScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QcScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanFindFirstArgs} args - Arguments to find a QcScan
     * @example
     * // Get one QcScan
     * const qcScan = await prisma.qcScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QcScanFindFirstArgs>(args?: SelectSubset<T, QcScanFindFirstArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QcScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanFindFirstOrThrowArgs} args - Arguments to find a QcScan
     * @example
     * // Get one QcScan
     * const qcScan = await prisma.qcScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QcScanFindFirstOrThrowArgs>(args?: SelectSubset<T, QcScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QcScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QcScans
     * const qcScans = await prisma.qcScan.findMany()
     * 
     * // Get first 10 QcScans
     * const qcScans = await prisma.qcScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qcScanWithIdOnly = await prisma.qcScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QcScanFindManyArgs>(args?: SelectSubset<T, QcScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QcScan.
     * @param {QcScanCreateArgs} args - Arguments to create a QcScan.
     * @example
     * // Create one QcScan
     * const QcScan = await prisma.qcScan.create({
     *   data: {
     *     // ... data to create a QcScan
     *   }
     * })
     * 
     */
    create<T extends QcScanCreateArgs>(args: SelectSubset<T, QcScanCreateArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QcScans.
     * @param {QcScanCreateManyArgs} args - Arguments to create many QcScans.
     * @example
     * // Create many QcScans
     * const qcScan = await prisma.qcScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QcScanCreateManyArgs>(args?: SelectSubset<T, QcScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a QcScan.
     * @param {QcScanDeleteArgs} args - Arguments to delete one QcScan.
     * @example
     * // Delete one QcScan
     * const QcScan = await prisma.qcScan.delete({
     *   where: {
     *     // ... filter to delete one QcScan
     *   }
     * })
     * 
     */
    delete<T extends QcScanDeleteArgs>(args: SelectSubset<T, QcScanDeleteArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QcScan.
     * @param {QcScanUpdateArgs} args - Arguments to update one QcScan.
     * @example
     * // Update one QcScan
     * const qcScan = await prisma.qcScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QcScanUpdateArgs>(args: SelectSubset<T, QcScanUpdateArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QcScans.
     * @param {QcScanDeleteManyArgs} args - Arguments to filter QcScans to delete.
     * @example
     * // Delete a few QcScans
     * const { count } = await prisma.qcScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QcScanDeleteManyArgs>(args?: SelectSubset<T, QcScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QcScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QcScans
     * const qcScan = await prisma.qcScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QcScanUpdateManyArgs>(args: SelectSubset<T, QcScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QcScan.
     * @param {QcScanUpsertArgs} args - Arguments to update or create a QcScan.
     * @example
     * // Update or create a QcScan
     * const qcScan = await prisma.qcScan.upsert({
     *   create: {
     *     // ... data to create a QcScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QcScan we want to update
     *   }
     * })
     */
    upsert<T extends QcScanUpsertArgs>(args: SelectSubset<T, QcScanUpsertArgs<ExtArgs>>): Prisma__QcScanClient<$Result.GetResult<Prisma.$QcScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QcScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanCountArgs} args - Arguments to filter QcScans to count.
     * @example
     * // Count the number of QcScans
     * const count = await prisma.qcScan.count({
     *   where: {
     *     // ... the filter for the QcScans we want to count
     *   }
     * })
    **/
    count<T extends QcScanCountArgs>(
      args?: Subset<T, QcScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QcScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QcScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QcScanAggregateArgs>(args: Subset<T, QcScanAggregateArgs>): Prisma.PrismaPromise<GetQcScanAggregateType<T>>

    /**
     * Group by QcScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcScanGroupByArgs} args - Group by arguments.
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
      T extends QcScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QcScanGroupByArgs['orderBy'] }
        : { orderBy?: QcScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QcScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQcScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QcScan model
   */
  readonly fields: QcScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QcScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QcScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the QcScan model
   */
  interface QcScanFieldRefs {
    readonly id: FieldRef<"QcScan", 'Int'>
    readonly barcode: FieldRef<"QcScan", 'String'>
    readonly qcPerson: FieldRef<"QcScan", 'String'>
    readonly qcStation: FieldRef<"QcScan", 'String'>
    readonly status: FieldRef<"QcScan", 'String'>
    readonly reason: FieldRef<"QcScan", 'String'>
    readonly timestamp: FieldRef<"QcScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QcScan findUnique
   */
  export type QcScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter, which QcScan to fetch.
     */
    where: QcScanWhereUniqueInput
  }

  /**
   * QcScan findUniqueOrThrow
   */
  export type QcScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter, which QcScan to fetch.
     */
    where: QcScanWhereUniqueInput
  }

  /**
   * QcScan findFirst
   */
  export type QcScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter, which QcScan to fetch.
     */
    where?: QcScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcScans to fetch.
     */
    orderBy?: QcScanOrderByWithRelationInput | QcScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QcScans.
     */
    cursor?: QcScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QcScans.
     */
    distinct?: QcScanScalarFieldEnum | QcScanScalarFieldEnum[]
  }

  /**
   * QcScan findFirstOrThrow
   */
  export type QcScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter, which QcScan to fetch.
     */
    where?: QcScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcScans to fetch.
     */
    orderBy?: QcScanOrderByWithRelationInput | QcScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QcScans.
     */
    cursor?: QcScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QcScans.
     */
    distinct?: QcScanScalarFieldEnum | QcScanScalarFieldEnum[]
  }

  /**
   * QcScan findMany
   */
  export type QcScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter, which QcScans to fetch.
     */
    where?: QcScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcScans to fetch.
     */
    orderBy?: QcScanOrderByWithRelationInput | QcScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QcScans.
     */
    cursor?: QcScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcScans.
     */
    skip?: number
    distinct?: QcScanScalarFieldEnum | QcScanScalarFieldEnum[]
  }

  /**
   * QcScan create
   */
  export type QcScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * The data needed to create a QcScan.
     */
    data: XOR<QcScanCreateInput, QcScanUncheckedCreateInput>
  }

  /**
   * QcScan createMany
   */
  export type QcScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QcScans.
     */
    data: QcScanCreateManyInput | QcScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QcScan update
   */
  export type QcScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * The data needed to update a QcScan.
     */
    data: XOR<QcScanUpdateInput, QcScanUncheckedUpdateInput>
    /**
     * Choose, which QcScan to update.
     */
    where: QcScanWhereUniqueInput
  }

  /**
   * QcScan updateMany
   */
  export type QcScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QcScans.
     */
    data: XOR<QcScanUpdateManyMutationInput, QcScanUncheckedUpdateManyInput>
    /**
     * Filter which QcScans to update
     */
    where?: QcScanWhereInput
    /**
     * Limit how many QcScans to update.
     */
    limit?: number
  }

  /**
   * QcScan upsert
   */
  export type QcScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * The filter to search for the QcScan to update in case it exists.
     */
    where: QcScanWhereUniqueInput
    /**
     * In case the QcScan found by the `where` argument doesn't exist, create a new QcScan with this data.
     */
    create: XOR<QcScanCreateInput, QcScanUncheckedCreateInput>
    /**
     * In case the QcScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QcScanUpdateInput, QcScanUncheckedUpdateInput>
  }

  /**
   * QcScan delete
   */
  export type QcScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
    /**
     * Filter which QcScan to delete.
     */
    where: QcScanWhereUniqueInput
  }

  /**
   * QcScan deleteMany
   */
  export type QcScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QcScans to delete
     */
    where?: QcScanWhereInput
    /**
     * Limit how many QcScans to delete.
     */
    limit?: number
  }

  /**
   * QcScan without action
   */
  export type QcScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcScan
     */
    select?: QcScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcScan
     */
    omit?: QcScanOmit<ExtArgs> | null
  }


  /**
   * Model QcReason
   */

  export type AggregateQcReason = {
    _count: QcReasonCountAggregateOutputType | null
    _avg: QcReasonAvgAggregateOutputType | null
    _sum: QcReasonSumAggregateOutputType | null
    _min: QcReasonMinAggregateOutputType | null
    _max: QcReasonMaxAggregateOutputType | null
  }

  export type QcReasonAvgAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type QcReasonSumAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type QcReasonMinAggregateOutputType = {
    id: number | null
    label: string | null
    hotkey: string | null
    featured: boolean | null
    sortOrder: number | null
    active: boolean | null
    updatedAt: Date | null
  }

  export type QcReasonMaxAggregateOutputType = {
    id: number | null
    label: string | null
    hotkey: string | null
    featured: boolean | null
    sortOrder: number | null
    active: boolean | null
    updatedAt: Date | null
  }

  export type QcReasonCountAggregateOutputType = {
    id: number
    label: number
    hotkey: number
    featured: number
    sortOrder: number
    active: number
    updatedAt: number
    _all: number
  }


  export type QcReasonAvgAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type QcReasonSumAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type QcReasonMinAggregateInputType = {
    id?: true
    label?: true
    hotkey?: true
    featured?: true
    sortOrder?: true
    active?: true
    updatedAt?: true
  }

  export type QcReasonMaxAggregateInputType = {
    id?: true
    label?: true
    hotkey?: true
    featured?: true
    sortOrder?: true
    active?: true
    updatedAt?: true
  }

  export type QcReasonCountAggregateInputType = {
    id?: true
    label?: true
    hotkey?: true
    featured?: true
    sortOrder?: true
    active?: true
    updatedAt?: true
    _all?: true
  }

  export type QcReasonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QcReason to aggregate.
     */
    where?: QcReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcReasons to fetch.
     */
    orderBy?: QcReasonOrderByWithRelationInput | QcReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QcReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QcReasons
    **/
    _count?: true | QcReasonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QcReasonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QcReasonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QcReasonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QcReasonMaxAggregateInputType
  }

  export type GetQcReasonAggregateType<T extends QcReasonAggregateArgs> = {
        [P in keyof T & keyof AggregateQcReason]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQcReason[P]>
      : GetScalarType<T[P], AggregateQcReason[P]>
  }




  export type QcReasonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QcReasonWhereInput
    orderBy?: QcReasonOrderByWithAggregationInput | QcReasonOrderByWithAggregationInput[]
    by: QcReasonScalarFieldEnum[] | QcReasonScalarFieldEnum
    having?: QcReasonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QcReasonCountAggregateInputType | true
    _avg?: QcReasonAvgAggregateInputType
    _sum?: QcReasonSumAggregateInputType
    _min?: QcReasonMinAggregateInputType
    _max?: QcReasonMaxAggregateInputType
  }

  export type QcReasonGroupByOutputType = {
    id: number
    label: string
    hotkey: string
    featured: boolean
    sortOrder: number
    active: boolean
    updatedAt: Date
    _count: QcReasonCountAggregateOutputType | null
    _avg: QcReasonAvgAggregateOutputType | null
    _sum: QcReasonSumAggregateOutputType | null
    _min: QcReasonMinAggregateOutputType | null
    _max: QcReasonMaxAggregateOutputType | null
  }

  type GetQcReasonGroupByPayload<T extends QcReasonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QcReasonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QcReasonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QcReasonGroupByOutputType[P]>
            : GetScalarType<T[P], QcReasonGroupByOutputType[P]>
        }
      >
    >


  export type QcReasonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    hotkey?: boolean
    featured?: boolean
    sortOrder?: boolean
    active?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["qcReason"]>



  export type QcReasonSelectScalar = {
    id?: boolean
    label?: boolean
    hotkey?: boolean
    featured?: boolean
    sortOrder?: boolean
    active?: boolean
    updatedAt?: boolean
  }

  export type QcReasonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "hotkey" | "featured" | "sortOrder" | "active" | "updatedAt", ExtArgs["result"]["qcReason"]>

  export type $QcReasonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QcReason"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      label: string
      hotkey: string
      featured: boolean
      sortOrder: number
      active: boolean
      updatedAt: Date
    }, ExtArgs["result"]["qcReason"]>
    composites: {}
  }

  type QcReasonGetPayload<S extends boolean | null | undefined | QcReasonDefaultArgs> = $Result.GetResult<Prisma.$QcReasonPayload, S>

  type QcReasonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QcReasonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QcReasonCountAggregateInputType | true
    }

  export interface QcReasonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QcReason'], meta: { name: 'QcReason' } }
    /**
     * Find zero or one QcReason that matches the filter.
     * @param {QcReasonFindUniqueArgs} args - Arguments to find a QcReason
     * @example
     * // Get one QcReason
     * const qcReason = await prisma.qcReason.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QcReasonFindUniqueArgs>(args: SelectSubset<T, QcReasonFindUniqueArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QcReason that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QcReasonFindUniqueOrThrowArgs} args - Arguments to find a QcReason
     * @example
     * // Get one QcReason
     * const qcReason = await prisma.qcReason.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QcReasonFindUniqueOrThrowArgs>(args: SelectSubset<T, QcReasonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QcReason that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonFindFirstArgs} args - Arguments to find a QcReason
     * @example
     * // Get one QcReason
     * const qcReason = await prisma.qcReason.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QcReasonFindFirstArgs>(args?: SelectSubset<T, QcReasonFindFirstArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QcReason that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonFindFirstOrThrowArgs} args - Arguments to find a QcReason
     * @example
     * // Get one QcReason
     * const qcReason = await prisma.qcReason.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QcReasonFindFirstOrThrowArgs>(args?: SelectSubset<T, QcReasonFindFirstOrThrowArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QcReasons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QcReasons
     * const qcReasons = await prisma.qcReason.findMany()
     * 
     * // Get first 10 QcReasons
     * const qcReasons = await prisma.qcReason.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qcReasonWithIdOnly = await prisma.qcReason.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QcReasonFindManyArgs>(args?: SelectSubset<T, QcReasonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QcReason.
     * @param {QcReasonCreateArgs} args - Arguments to create a QcReason.
     * @example
     * // Create one QcReason
     * const QcReason = await prisma.qcReason.create({
     *   data: {
     *     // ... data to create a QcReason
     *   }
     * })
     * 
     */
    create<T extends QcReasonCreateArgs>(args: SelectSubset<T, QcReasonCreateArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QcReasons.
     * @param {QcReasonCreateManyArgs} args - Arguments to create many QcReasons.
     * @example
     * // Create many QcReasons
     * const qcReason = await prisma.qcReason.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QcReasonCreateManyArgs>(args?: SelectSubset<T, QcReasonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a QcReason.
     * @param {QcReasonDeleteArgs} args - Arguments to delete one QcReason.
     * @example
     * // Delete one QcReason
     * const QcReason = await prisma.qcReason.delete({
     *   where: {
     *     // ... filter to delete one QcReason
     *   }
     * })
     * 
     */
    delete<T extends QcReasonDeleteArgs>(args: SelectSubset<T, QcReasonDeleteArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QcReason.
     * @param {QcReasonUpdateArgs} args - Arguments to update one QcReason.
     * @example
     * // Update one QcReason
     * const qcReason = await prisma.qcReason.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QcReasonUpdateArgs>(args: SelectSubset<T, QcReasonUpdateArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QcReasons.
     * @param {QcReasonDeleteManyArgs} args - Arguments to filter QcReasons to delete.
     * @example
     * // Delete a few QcReasons
     * const { count } = await prisma.qcReason.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QcReasonDeleteManyArgs>(args?: SelectSubset<T, QcReasonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QcReasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QcReasons
     * const qcReason = await prisma.qcReason.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QcReasonUpdateManyArgs>(args: SelectSubset<T, QcReasonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QcReason.
     * @param {QcReasonUpsertArgs} args - Arguments to update or create a QcReason.
     * @example
     * // Update or create a QcReason
     * const qcReason = await prisma.qcReason.upsert({
     *   create: {
     *     // ... data to create a QcReason
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QcReason we want to update
     *   }
     * })
     */
    upsert<T extends QcReasonUpsertArgs>(args: SelectSubset<T, QcReasonUpsertArgs<ExtArgs>>): Prisma__QcReasonClient<$Result.GetResult<Prisma.$QcReasonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QcReasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonCountArgs} args - Arguments to filter QcReasons to count.
     * @example
     * // Count the number of QcReasons
     * const count = await prisma.qcReason.count({
     *   where: {
     *     // ... the filter for the QcReasons we want to count
     *   }
     * })
    **/
    count<T extends QcReasonCountArgs>(
      args?: Subset<T, QcReasonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QcReasonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QcReason.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QcReasonAggregateArgs>(args: Subset<T, QcReasonAggregateArgs>): Prisma.PrismaPromise<GetQcReasonAggregateType<T>>

    /**
     * Group by QcReason.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QcReasonGroupByArgs} args - Group by arguments.
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
      T extends QcReasonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QcReasonGroupByArgs['orderBy'] }
        : { orderBy?: QcReasonGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QcReasonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQcReasonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QcReason model
   */
  readonly fields: QcReasonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QcReason.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QcReasonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the QcReason model
   */
  interface QcReasonFieldRefs {
    readonly id: FieldRef<"QcReason", 'Int'>
    readonly label: FieldRef<"QcReason", 'String'>
    readonly hotkey: FieldRef<"QcReason", 'String'>
    readonly featured: FieldRef<"QcReason", 'Boolean'>
    readonly sortOrder: FieldRef<"QcReason", 'Int'>
    readonly active: FieldRef<"QcReason", 'Boolean'>
    readonly updatedAt: FieldRef<"QcReason", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QcReason findUnique
   */
  export type QcReasonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter, which QcReason to fetch.
     */
    where: QcReasonWhereUniqueInput
  }

  /**
   * QcReason findUniqueOrThrow
   */
  export type QcReasonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter, which QcReason to fetch.
     */
    where: QcReasonWhereUniqueInput
  }

  /**
   * QcReason findFirst
   */
  export type QcReasonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter, which QcReason to fetch.
     */
    where?: QcReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcReasons to fetch.
     */
    orderBy?: QcReasonOrderByWithRelationInput | QcReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QcReasons.
     */
    cursor?: QcReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QcReasons.
     */
    distinct?: QcReasonScalarFieldEnum | QcReasonScalarFieldEnum[]
  }

  /**
   * QcReason findFirstOrThrow
   */
  export type QcReasonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter, which QcReason to fetch.
     */
    where?: QcReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcReasons to fetch.
     */
    orderBy?: QcReasonOrderByWithRelationInput | QcReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QcReasons.
     */
    cursor?: QcReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QcReasons.
     */
    distinct?: QcReasonScalarFieldEnum | QcReasonScalarFieldEnum[]
  }

  /**
   * QcReason findMany
   */
  export type QcReasonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter, which QcReasons to fetch.
     */
    where?: QcReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QcReasons to fetch.
     */
    orderBy?: QcReasonOrderByWithRelationInput | QcReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QcReasons.
     */
    cursor?: QcReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QcReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QcReasons.
     */
    skip?: number
    distinct?: QcReasonScalarFieldEnum | QcReasonScalarFieldEnum[]
  }

  /**
   * QcReason create
   */
  export type QcReasonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * The data needed to create a QcReason.
     */
    data: XOR<QcReasonCreateInput, QcReasonUncheckedCreateInput>
  }

  /**
   * QcReason createMany
   */
  export type QcReasonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QcReasons.
     */
    data: QcReasonCreateManyInput | QcReasonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QcReason update
   */
  export type QcReasonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * The data needed to update a QcReason.
     */
    data: XOR<QcReasonUpdateInput, QcReasonUncheckedUpdateInput>
    /**
     * Choose, which QcReason to update.
     */
    where: QcReasonWhereUniqueInput
  }

  /**
   * QcReason updateMany
   */
  export type QcReasonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QcReasons.
     */
    data: XOR<QcReasonUpdateManyMutationInput, QcReasonUncheckedUpdateManyInput>
    /**
     * Filter which QcReasons to update
     */
    where?: QcReasonWhereInput
    /**
     * Limit how many QcReasons to update.
     */
    limit?: number
  }

  /**
   * QcReason upsert
   */
  export type QcReasonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * The filter to search for the QcReason to update in case it exists.
     */
    where: QcReasonWhereUniqueInput
    /**
     * In case the QcReason found by the `where` argument doesn't exist, create a new QcReason with this data.
     */
    create: XOR<QcReasonCreateInput, QcReasonUncheckedCreateInput>
    /**
     * In case the QcReason was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QcReasonUpdateInput, QcReasonUncheckedUpdateInput>
  }

  /**
   * QcReason delete
   */
  export type QcReasonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
    /**
     * Filter which QcReason to delete.
     */
    where: QcReasonWhereUniqueInput
  }

  /**
   * QcReason deleteMany
   */
  export type QcReasonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QcReasons to delete
     */
    where?: QcReasonWhereInput
    /**
     * Limit how many QcReasons to delete.
     */
    limit?: number
  }

  /**
   * QcReason without action
   */
  export type QcReasonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QcReason
     */
    select?: QcReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QcReason
     */
    omit?: QcReasonOmit<ExtArgs> | null
  }


  /**
   * Model TumblingContainer
   */

  export type AggregateTumblingContainer = {
    _count: TumblingContainerCountAggregateOutputType | null
    _avg: TumblingContainerAvgAggregateOutputType | null
    _sum: TumblingContainerSumAggregateOutputType | null
    _min: TumblingContainerMinAggregateOutputType | null
    _max: TumblingContainerMaxAggregateOutputType | null
  }

  export type TumblingContainerAvgAggregateOutputType = {
    id: number | null
    stationNumber: number | null
  }

  export type TumblingContainerSumAggregateOutputType = {
    id: number | null
    stationNumber: number | null
  }

  export type TumblingContainerMinAggregateOutputType = {
    id: number | null
    stationNumber: number | null
    side: $Enums.TumblingContainerSide | null
    displayName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumblingContainerMaxAggregateOutputType = {
    id: number | null
    stationNumber: number | null
    side: $Enums.TumblingContainerSide | null
    displayName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumblingContainerCountAggregateOutputType = {
    id: number
    stationNumber: number
    side: number
    displayName: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TumblingContainerAvgAggregateInputType = {
    id?: true
    stationNumber?: true
  }

  export type TumblingContainerSumAggregateInputType = {
    id?: true
    stationNumber?: true
  }

  export type TumblingContainerMinAggregateInputType = {
    id?: true
    stationNumber?: true
    side?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumblingContainerMaxAggregateInputType = {
    id?: true
    stationNumber?: true
    side?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumblingContainerCountAggregateInputType = {
    id?: true
    stationNumber?: true
    side?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TumblingContainerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingContainer to aggregate.
     */
    where?: TumblingContainerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingContainers to fetch.
     */
    orderBy?: TumblingContainerOrderByWithRelationInput | TumblingContainerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TumblingContainerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingContainers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingContainers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TumblingContainers
    **/
    _count?: true | TumblingContainerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TumblingContainerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TumblingContainerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TumblingContainerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TumblingContainerMaxAggregateInputType
  }

  export type GetTumblingContainerAggregateType<T extends TumblingContainerAggregateArgs> = {
        [P in keyof T & keyof AggregateTumblingContainer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumblingContainer[P]>
      : GetScalarType<T[P], AggregateTumblingContainer[P]>
  }




  export type TumblingContainerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumblingContainerWhereInput
    orderBy?: TumblingContainerOrderByWithAggregationInput | TumblingContainerOrderByWithAggregationInput[]
    by: TumblingContainerScalarFieldEnum[] | TumblingContainerScalarFieldEnum
    having?: TumblingContainerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TumblingContainerCountAggregateInputType | true
    _avg?: TumblingContainerAvgAggregateInputType
    _sum?: TumblingContainerSumAggregateInputType
    _min?: TumblingContainerMinAggregateInputType
    _max?: TumblingContainerMaxAggregateInputType
  }

  export type TumblingContainerGroupByOutputType = {
    id: number
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TumblingContainerCountAggregateOutputType | null
    _avg: TumblingContainerAvgAggregateOutputType | null
    _sum: TumblingContainerSumAggregateOutputType | null
    _min: TumblingContainerMinAggregateOutputType | null
    _max: TumblingContainerMaxAggregateOutputType | null
  }

  type GetTumblingContainerGroupByPayload<T extends TumblingContainerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TumblingContainerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TumblingContainerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumblingContainerGroupByOutputType[P]>
            : GetScalarType<T[P], TumblingContainerGroupByOutputType[P]>
        }
      >
    >


  export type TumblingContainerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stationNumber?: boolean
    side?: boolean
    displayName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    processes?: boolean | TumblingContainer$processesArgs<ExtArgs>
    _count?: boolean | TumblingContainerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumblingContainer"]>



  export type TumblingContainerSelectScalar = {
    id?: boolean
    stationNumber?: boolean
    side?: boolean
    displayName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TumblingContainerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "stationNumber" | "side" | "displayName" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["tumblingContainer"]>
  export type TumblingContainerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    processes?: boolean | TumblingContainer$processesArgs<ExtArgs>
    _count?: boolean | TumblingContainerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TumblingContainerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TumblingContainer"
    objects: {
      processes: Prisma.$TumblingProcessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      stationNumber: number
      side: $Enums.TumblingContainerSide
      displayName: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tumblingContainer"]>
    composites: {}
  }

  type TumblingContainerGetPayload<S extends boolean | null | undefined | TumblingContainerDefaultArgs> = $Result.GetResult<Prisma.$TumblingContainerPayload, S>

  type TumblingContainerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TumblingContainerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TumblingContainerCountAggregateInputType | true
    }

  export interface TumblingContainerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TumblingContainer'], meta: { name: 'TumblingContainer' } }
    /**
     * Find zero or one TumblingContainer that matches the filter.
     * @param {TumblingContainerFindUniqueArgs} args - Arguments to find a TumblingContainer
     * @example
     * // Get one TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TumblingContainerFindUniqueArgs>(args: SelectSubset<T, TumblingContainerFindUniqueArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TumblingContainer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TumblingContainerFindUniqueOrThrowArgs} args - Arguments to find a TumblingContainer
     * @example
     * // Get one TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TumblingContainerFindUniqueOrThrowArgs>(args: SelectSubset<T, TumblingContainerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingContainer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerFindFirstArgs} args - Arguments to find a TumblingContainer
     * @example
     * // Get one TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TumblingContainerFindFirstArgs>(args?: SelectSubset<T, TumblingContainerFindFirstArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingContainer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerFindFirstOrThrowArgs} args - Arguments to find a TumblingContainer
     * @example
     * // Get one TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TumblingContainerFindFirstOrThrowArgs>(args?: SelectSubset<T, TumblingContainerFindFirstOrThrowArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TumblingContainers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumblingContainers
     * const tumblingContainers = await prisma.tumblingContainer.findMany()
     * 
     * // Get first 10 TumblingContainers
     * const tumblingContainers = await prisma.tumblingContainer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tumblingContainerWithIdOnly = await prisma.tumblingContainer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TumblingContainerFindManyArgs>(args?: SelectSubset<T, TumblingContainerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TumblingContainer.
     * @param {TumblingContainerCreateArgs} args - Arguments to create a TumblingContainer.
     * @example
     * // Create one TumblingContainer
     * const TumblingContainer = await prisma.tumblingContainer.create({
     *   data: {
     *     // ... data to create a TumblingContainer
     *   }
     * })
     * 
     */
    create<T extends TumblingContainerCreateArgs>(args: SelectSubset<T, TumblingContainerCreateArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TumblingContainers.
     * @param {TumblingContainerCreateManyArgs} args - Arguments to create many TumblingContainers.
     * @example
     * // Create many TumblingContainers
     * const tumblingContainer = await prisma.tumblingContainer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TumblingContainerCreateManyArgs>(args?: SelectSubset<T, TumblingContainerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TumblingContainer.
     * @param {TumblingContainerDeleteArgs} args - Arguments to delete one TumblingContainer.
     * @example
     * // Delete one TumblingContainer
     * const TumblingContainer = await prisma.tumblingContainer.delete({
     *   where: {
     *     // ... filter to delete one TumblingContainer
     *   }
     * })
     * 
     */
    delete<T extends TumblingContainerDeleteArgs>(args: SelectSubset<T, TumblingContainerDeleteArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TumblingContainer.
     * @param {TumblingContainerUpdateArgs} args - Arguments to update one TumblingContainer.
     * @example
     * // Update one TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TumblingContainerUpdateArgs>(args: SelectSubset<T, TumblingContainerUpdateArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TumblingContainers.
     * @param {TumblingContainerDeleteManyArgs} args - Arguments to filter TumblingContainers to delete.
     * @example
     * // Delete a few TumblingContainers
     * const { count } = await prisma.tumblingContainer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TumblingContainerDeleteManyArgs>(args?: SelectSubset<T, TumblingContainerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumblingContainers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumblingContainers
     * const tumblingContainer = await prisma.tumblingContainer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TumblingContainerUpdateManyArgs>(args: SelectSubset<T, TumblingContainerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TumblingContainer.
     * @param {TumblingContainerUpsertArgs} args - Arguments to update or create a TumblingContainer.
     * @example
     * // Update or create a TumblingContainer
     * const tumblingContainer = await prisma.tumblingContainer.upsert({
     *   create: {
     *     // ... data to create a TumblingContainer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumblingContainer we want to update
     *   }
     * })
     */
    upsert<T extends TumblingContainerUpsertArgs>(args: SelectSubset<T, TumblingContainerUpsertArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TumblingContainers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerCountArgs} args - Arguments to filter TumblingContainers to count.
     * @example
     * // Count the number of TumblingContainers
     * const count = await prisma.tumblingContainer.count({
     *   where: {
     *     // ... the filter for the TumblingContainers we want to count
     *   }
     * })
    **/
    count<T extends TumblingContainerCountArgs>(
      args?: Subset<T, TumblingContainerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumblingContainerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TumblingContainer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TumblingContainerAggregateArgs>(args: Subset<T, TumblingContainerAggregateArgs>): Prisma.PrismaPromise<GetTumblingContainerAggregateType<T>>

    /**
     * Group by TumblingContainer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingContainerGroupByArgs} args - Group by arguments.
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
      T extends TumblingContainerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumblingContainerGroupByArgs['orderBy'] }
        : { orderBy?: TumblingContainerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TumblingContainerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTumblingContainerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TumblingContainer model
   */
  readonly fields: TumblingContainerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumblingContainer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TumblingContainerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    processes<T extends TumblingContainer$processesArgs<ExtArgs> = {}>(args?: Subset<T, TumblingContainer$processesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TumblingContainer model
   */
  interface TumblingContainerFieldRefs {
    readonly id: FieldRef<"TumblingContainer", 'Int'>
    readonly stationNumber: FieldRef<"TumblingContainer", 'Int'>
    readonly side: FieldRef<"TumblingContainer", 'TumblingContainerSide'>
    readonly displayName: FieldRef<"TumblingContainer", 'String'>
    readonly isActive: FieldRef<"TumblingContainer", 'Boolean'>
    readonly createdAt: FieldRef<"TumblingContainer", 'DateTime'>
    readonly updatedAt: FieldRef<"TumblingContainer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TumblingContainer findUnique
   */
  export type TumblingContainerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter, which TumblingContainer to fetch.
     */
    where: TumblingContainerWhereUniqueInput
  }

  /**
   * TumblingContainer findUniqueOrThrow
   */
  export type TumblingContainerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter, which TumblingContainer to fetch.
     */
    where: TumblingContainerWhereUniqueInput
  }

  /**
   * TumblingContainer findFirst
   */
  export type TumblingContainerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter, which TumblingContainer to fetch.
     */
    where?: TumblingContainerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingContainers to fetch.
     */
    orderBy?: TumblingContainerOrderByWithRelationInput | TumblingContainerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingContainers.
     */
    cursor?: TumblingContainerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingContainers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingContainers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingContainers.
     */
    distinct?: TumblingContainerScalarFieldEnum | TumblingContainerScalarFieldEnum[]
  }

  /**
   * TumblingContainer findFirstOrThrow
   */
  export type TumblingContainerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter, which TumblingContainer to fetch.
     */
    where?: TumblingContainerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingContainers to fetch.
     */
    orderBy?: TumblingContainerOrderByWithRelationInput | TumblingContainerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingContainers.
     */
    cursor?: TumblingContainerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingContainers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingContainers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingContainers.
     */
    distinct?: TumblingContainerScalarFieldEnum | TumblingContainerScalarFieldEnum[]
  }

  /**
   * TumblingContainer findMany
   */
  export type TumblingContainerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter, which TumblingContainers to fetch.
     */
    where?: TumblingContainerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingContainers to fetch.
     */
    orderBy?: TumblingContainerOrderByWithRelationInput | TumblingContainerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TumblingContainers.
     */
    cursor?: TumblingContainerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingContainers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingContainers.
     */
    skip?: number
    distinct?: TumblingContainerScalarFieldEnum | TumblingContainerScalarFieldEnum[]
  }

  /**
   * TumblingContainer create
   */
  export type TumblingContainerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * The data needed to create a TumblingContainer.
     */
    data: XOR<TumblingContainerCreateInput, TumblingContainerUncheckedCreateInput>
  }

  /**
   * TumblingContainer createMany
   */
  export type TumblingContainerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TumblingContainers.
     */
    data: TumblingContainerCreateManyInput | TumblingContainerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TumblingContainer update
   */
  export type TumblingContainerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * The data needed to update a TumblingContainer.
     */
    data: XOR<TumblingContainerUpdateInput, TumblingContainerUncheckedUpdateInput>
    /**
     * Choose, which TumblingContainer to update.
     */
    where: TumblingContainerWhereUniqueInput
  }

  /**
   * TumblingContainer updateMany
   */
  export type TumblingContainerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TumblingContainers.
     */
    data: XOR<TumblingContainerUpdateManyMutationInput, TumblingContainerUncheckedUpdateManyInput>
    /**
     * Filter which TumblingContainers to update
     */
    where?: TumblingContainerWhereInput
    /**
     * Limit how many TumblingContainers to update.
     */
    limit?: number
  }

  /**
   * TumblingContainer upsert
   */
  export type TumblingContainerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * The filter to search for the TumblingContainer to update in case it exists.
     */
    where: TumblingContainerWhereUniqueInput
    /**
     * In case the TumblingContainer found by the `where` argument doesn't exist, create a new TumblingContainer with this data.
     */
    create: XOR<TumblingContainerCreateInput, TumblingContainerUncheckedCreateInput>
    /**
     * In case the TumblingContainer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TumblingContainerUpdateInput, TumblingContainerUncheckedUpdateInput>
  }

  /**
   * TumblingContainer delete
   */
  export type TumblingContainerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
    /**
     * Filter which TumblingContainer to delete.
     */
    where: TumblingContainerWhereUniqueInput
  }

  /**
   * TumblingContainer deleteMany
   */
  export type TumblingContainerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingContainers to delete
     */
    where?: TumblingContainerWhereInput
    /**
     * Limit how many TumblingContainers to delete.
     */
    limit?: number
  }

  /**
   * TumblingContainer.processes
   */
  export type TumblingContainer$processesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    where?: TumblingProcessWhereInput
    orderBy?: TumblingProcessOrderByWithRelationInput | TumblingProcessOrderByWithRelationInput[]
    cursor?: TumblingProcessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TumblingProcessScalarFieldEnum | TumblingProcessScalarFieldEnum[]
  }

  /**
   * TumblingContainer without action
   */
  export type TumblingContainerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingContainer
     */
    select?: TumblingContainerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingContainer
     */
    omit?: TumblingContainerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingContainerInclude<ExtArgs> | null
  }


  /**
   * Model TumblingProcess
   */

  export type AggregateTumblingProcess = {
    _count: TumblingProcessCountAggregateOutputType | null
    _avg: TumblingProcessAvgAggregateOutputType | null
    _sum: TumblingProcessSumAggregateOutputType | null
    _min: TumblingProcessMinAggregateOutputType | null
    _max: TumblingProcessMaxAggregateOutputType | null
  }

  export type TumblingProcessAvgAggregateOutputType = {
    id: number | null
    containerId: number | null
    durationMinutes: number | null
    activeSlotContainerId: number | null
  }

  export type TumblingProcessSumAggregateOutputType = {
    id: number | null
    containerId: number | null
    durationMinutes: number | null
    activeSlotContainerId: number | null
  }

  export type TumblingProcessMinAggregateOutputType = {
    id: number | null
    processCode: string | null
    containerId: number | null
    status: $Enums.TumblingProcessStatus | null
    durationMinutes: number | null
    startedAt: Date | null
    expectedCompletionAt: Date | null
    completedAt: Date | null
    stoppedAt: Date | null
    completionType: $Enums.TumblingCompletionType | null
    reason: string | null
    remarks: string | null
    startedByName: string | null
    authorizedByCode: string | null
    authorizedByName: string | null
    activeSlotContainerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumblingProcessMaxAggregateOutputType = {
    id: number | null
    processCode: string | null
    containerId: number | null
    status: $Enums.TumblingProcessStatus | null
    durationMinutes: number | null
    startedAt: Date | null
    expectedCompletionAt: Date | null
    completedAt: Date | null
    stoppedAt: Date | null
    completionType: $Enums.TumblingCompletionType | null
    reason: string | null
    remarks: string | null
    startedByName: string | null
    authorizedByCode: string | null
    authorizedByName: string | null
    activeSlotContainerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumblingProcessCountAggregateOutputType = {
    id: number
    processCode: number
    containerId: number
    status: number
    durationMinutes: number
    startedAt: number
    expectedCompletionAt: number
    completedAt: number
    stoppedAt: number
    completionType: number
    reason: number
    remarks: number
    startedByName: number
    authorizedByCode: number
    authorizedByName: number
    products: number
    events: number
    activeSlotContainerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TumblingProcessAvgAggregateInputType = {
    id?: true
    containerId?: true
    durationMinutes?: true
    activeSlotContainerId?: true
  }

  export type TumblingProcessSumAggregateInputType = {
    id?: true
    containerId?: true
    durationMinutes?: true
    activeSlotContainerId?: true
  }

  export type TumblingProcessMinAggregateInputType = {
    id?: true
    processCode?: true
    containerId?: true
    status?: true
    durationMinutes?: true
    startedAt?: true
    expectedCompletionAt?: true
    completedAt?: true
    stoppedAt?: true
    completionType?: true
    reason?: true
    remarks?: true
    startedByName?: true
    authorizedByCode?: true
    authorizedByName?: true
    activeSlotContainerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumblingProcessMaxAggregateInputType = {
    id?: true
    processCode?: true
    containerId?: true
    status?: true
    durationMinutes?: true
    startedAt?: true
    expectedCompletionAt?: true
    completedAt?: true
    stoppedAt?: true
    completionType?: true
    reason?: true
    remarks?: true
    startedByName?: true
    authorizedByCode?: true
    authorizedByName?: true
    activeSlotContainerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumblingProcessCountAggregateInputType = {
    id?: true
    processCode?: true
    containerId?: true
    status?: true
    durationMinutes?: true
    startedAt?: true
    expectedCompletionAt?: true
    completedAt?: true
    stoppedAt?: true
    completionType?: true
    reason?: true
    remarks?: true
    startedByName?: true
    authorizedByCode?: true
    authorizedByName?: true
    products?: true
    events?: true
    activeSlotContainerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TumblingProcessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingProcess to aggregate.
     */
    where?: TumblingProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingProcesses to fetch.
     */
    orderBy?: TumblingProcessOrderByWithRelationInput | TumblingProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TumblingProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingProcesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingProcesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TumblingProcesses
    **/
    _count?: true | TumblingProcessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TumblingProcessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TumblingProcessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TumblingProcessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TumblingProcessMaxAggregateInputType
  }

  export type GetTumblingProcessAggregateType<T extends TumblingProcessAggregateArgs> = {
        [P in keyof T & keyof AggregateTumblingProcess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumblingProcess[P]>
      : GetScalarType<T[P], AggregateTumblingProcess[P]>
  }




  export type TumblingProcessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumblingProcessWhereInput
    orderBy?: TumblingProcessOrderByWithAggregationInput | TumblingProcessOrderByWithAggregationInput[]
    by: TumblingProcessScalarFieldEnum[] | TumblingProcessScalarFieldEnum
    having?: TumblingProcessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TumblingProcessCountAggregateInputType | true
    _avg?: TumblingProcessAvgAggregateInputType
    _sum?: TumblingProcessSumAggregateInputType
    _min?: TumblingProcessMinAggregateInputType
    _max?: TumblingProcessMaxAggregateInputType
  }

  export type TumblingProcessGroupByOutputType = {
    id: number
    processCode: string
    containerId: number
    status: $Enums.TumblingProcessStatus
    durationMinutes: number
    startedAt: Date | null
    expectedCompletionAt: Date | null
    completedAt: Date | null
    stoppedAt: Date | null
    completionType: $Enums.TumblingCompletionType | null
    reason: string | null
    remarks: string | null
    startedByName: string | null
    authorizedByCode: string | null
    authorizedByName: string | null
    products: JsonValue
    events: JsonValue
    activeSlotContainerId: number | null
    createdAt: Date
    updatedAt: Date
    _count: TumblingProcessCountAggregateOutputType | null
    _avg: TumblingProcessAvgAggregateOutputType | null
    _sum: TumblingProcessSumAggregateOutputType | null
    _min: TumblingProcessMinAggregateOutputType | null
    _max: TumblingProcessMaxAggregateOutputType | null
  }

  type GetTumblingProcessGroupByPayload<T extends TumblingProcessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TumblingProcessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TumblingProcessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumblingProcessGroupByOutputType[P]>
            : GetScalarType<T[P], TumblingProcessGroupByOutputType[P]>
        }
      >
    >


  export type TumblingProcessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    processCode?: boolean
    containerId?: boolean
    status?: boolean
    durationMinutes?: boolean
    startedAt?: boolean
    expectedCompletionAt?: boolean
    completedAt?: boolean
    stoppedAt?: boolean
    completionType?: boolean
    reason?: boolean
    remarks?: boolean
    startedByName?: boolean
    authorizedByCode?: boolean
    authorizedByName?: boolean
    products?: boolean
    events?: boolean
    activeSlotContainerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    container?: boolean | TumblingContainerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumblingProcess"]>



  export type TumblingProcessSelectScalar = {
    id?: boolean
    processCode?: boolean
    containerId?: boolean
    status?: boolean
    durationMinutes?: boolean
    startedAt?: boolean
    expectedCompletionAt?: boolean
    completedAt?: boolean
    stoppedAt?: boolean
    completionType?: boolean
    reason?: boolean
    remarks?: boolean
    startedByName?: boolean
    authorizedByCode?: boolean
    authorizedByName?: boolean
    products?: boolean
    events?: boolean
    activeSlotContainerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TumblingProcessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "processCode" | "containerId" | "status" | "durationMinutes" | "startedAt" | "expectedCompletionAt" | "completedAt" | "stoppedAt" | "completionType" | "reason" | "remarks" | "startedByName" | "authorizedByCode" | "authorizedByName" | "products" | "events" | "activeSlotContainerId" | "createdAt" | "updatedAt", ExtArgs["result"]["tumblingProcess"]>
  export type TumblingProcessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    container?: boolean | TumblingContainerDefaultArgs<ExtArgs>
  }

  export type $TumblingProcessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TumblingProcess"
    objects: {
      container: Prisma.$TumblingContainerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      processCode: string
      containerId: number
      status: $Enums.TumblingProcessStatus
      durationMinutes: number
      startedAt: Date | null
      expectedCompletionAt: Date | null
      completedAt: Date | null
      stoppedAt: Date | null
      completionType: $Enums.TumblingCompletionType | null
      reason: string | null
      remarks: string | null
      startedByName: string | null
      authorizedByCode: string | null
      authorizedByName: string | null
      products: Prisma.JsonValue
      events: Prisma.JsonValue
      activeSlotContainerId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tumblingProcess"]>
    composites: {}
  }

  type TumblingProcessGetPayload<S extends boolean | null | undefined | TumblingProcessDefaultArgs> = $Result.GetResult<Prisma.$TumblingProcessPayload, S>

  type TumblingProcessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TumblingProcessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TumblingProcessCountAggregateInputType | true
    }

  export interface TumblingProcessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TumblingProcess'], meta: { name: 'TumblingProcess' } }
    /**
     * Find zero or one TumblingProcess that matches the filter.
     * @param {TumblingProcessFindUniqueArgs} args - Arguments to find a TumblingProcess
     * @example
     * // Get one TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TumblingProcessFindUniqueArgs>(args: SelectSubset<T, TumblingProcessFindUniqueArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TumblingProcess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TumblingProcessFindUniqueOrThrowArgs} args - Arguments to find a TumblingProcess
     * @example
     * // Get one TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TumblingProcessFindUniqueOrThrowArgs>(args: SelectSubset<T, TumblingProcessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingProcess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessFindFirstArgs} args - Arguments to find a TumblingProcess
     * @example
     * // Get one TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TumblingProcessFindFirstArgs>(args?: SelectSubset<T, TumblingProcessFindFirstArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingProcess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessFindFirstOrThrowArgs} args - Arguments to find a TumblingProcess
     * @example
     * // Get one TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TumblingProcessFindFirstOrThrowArgs>(args?: SelectSubset<T, TumblingProcessFindFirstOrThrowArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TumblingProcesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumblingProcesses
     * const tumblingProcesses = await prisma.tumblingProcess.findMany()
     * 
     * // Get first 10 TumblingProcesses
     * const tumblingProcesses = await prisma.tumblingProcess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tumblingProcessWithIdOnly = await prisma.tumblingProcess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TumblingProcessFindManyArgs>(args?: SelectSubset<T, TumblingProcessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TumblingProcess.
     * @param {TumblingProcessCreateArgs} args - Arguments to create a TumblingProcess.
     * @example
     * // Create one TumblingProcess
     * const TumblingProcess = await prisma.tumblingProcess.create({
     *   data: {
     *     // ... data to create a TumblingProcess
     *   }
     * })
     * 
     */
    create<T extends TumblingProcessCreateArgs>(args: SelectSubset<T, TumblingProcessCreateArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TumblingProcesses.
     * @param {TumblingProcessCreateManyArgs} args - Arguments to create many TumblingProcesses.
     * @example
     * // Create many TumblingProcesses
     * const tumblingProcess = await prisma.tumblingProcess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TumblingProcessCreateManyArgs>(args?: SelectSubset<T, TumblingProcessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TumblingProcess.
     * @param {TumblingProcessDeleteArgs} args - Arguments to delete one TumblingProcess.
     * @example
     * // Delete one TumblingProcess
     * const TumblingProcess = await prisma.tumblingProcess.delete({
     *   where: {
     *     // ... filter to delete one TumblingProcess
     *   }
     * })
     * 
     */
    delete<T extends TumblingProcessDeleteArgs>(args: SelectSubset<T, TumblingProcessDeleteArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TumblingProcess.
     * @param {TumblingProcessUpdateArgs} args - Arguments to update one TumblingProcess.
     * @example
     * // Update one TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TumblingProcessUpdateArgs>(args: SelectSubset<T, TumblingProcessUpdateArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TumblingProcesses.
     * @param {TumblingProcessDeleteManyArgs} args - Arguments to filter TumblingProcesses to delete.
     * @example
     * // Delete a few TumblingProcesses
     * const { count } = await prisma.tumblingProcess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TumblingProcessDeleteManyArgs>(args?: SelectSubset<T, TumblingProcessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumblingProcesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumblingProcesses
     * const tumblingProcess = await prisma.tumblingProcess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TumblingProcessUpdateManyArgs>(args: SelectSubset<T, TumblingProcessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TumblingProcess.
     * @param {TumblingProcessUpsertArgs} args - Arguments to update or create a TumblingProcess.
     * @example
     * // Update or create a TumblingProcess
     * const tumblingProcess = await prisma.tumblingProcess.upsert({
     *   create: {
     *     // ... data to create a TumblingProcess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumblingProcess we want to update
     *   }
     * })
     */
    upsert<T extends TumblingProcessUpsertArgs>(args: SelectSubset<T, TumblingProcessUpsertArgs<ExtArgs>>): Prisma__TumblingProcessClient<$Result.GetResult<Prisma.$TumblingProcessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TumblingProcesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessCountArgs} args - Arguments to filter TumblingProcesses to count.
     * @example
     * // Count the number of TumblingProcesses
     * const count = await prisma.tumblingProcess.count({
     *   where: {
     *     // ... the filter for the TumblingProcesses we want to count
     *   }
     * })
    **/
    count<T extends TumblingProcessCountArgs>(
      args?: Subset<T, TumblingProcessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumblingProcessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TumblingProcess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TumblingProcessAggregateArgs>(args: Subset<T, TumblingProcessAggregateArgs>): Prisma.PrismaPromise<GetTumblingProcessAggregateType<T>>

    /**
     * Group by TumblingProcess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingProcessGroupByArgs} args - Group by arguments.
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
      T extends TumblingProcessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumblingProcessGroupByArgs['orderBy'] }
        : { orderBy?: TumblingProcessGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TumblingProcessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTumblingProcessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TumblingProcess model
   */
  readonly fields: TumblingProcessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumblingProcess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TumblingProcessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    container<T extends TumblingContainerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TumblingContainerDefaultArgs<ExtArgs>>): Prisma__TumblingContainerClient<$Result.GetResult<Prisma.$TumblingContainerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TumblingProcess model
   */
  interface TumblingProcessFieldRefs {
    readonly id: FieldRef<"TumblingProcess", 'Int'>
    readonly processCode: FieldRef<"TumblingProcess", 'String'>
    readonly containerId: FieldRef<"TumblingProcess", 'Int'>
    readonly status: FieldRef<"TumblingProcess", 'TumblingProcessStatus'>
    readonly durationMinutes: FieldRef<"TumblingProcess", 'Int'>
    readonly startedAt: FieldRef<"TumblingProcess", 'DateTime'>
    readonly expectedCompletionAt: FieldRef<"TumblingProcess", 'DateTime'>
    readonly completedAt: FieldRef<"TumblingProcess", 'DateTime'>
    readonly stoppedAt: FieldRef<"TumblingProcess", 'DateTime'>
    readonly completionType: FieldRef<"TumblingProcess", 'TumblingCompletionType'>
    readonly reason: FieldRef<"TumblingProcess", 'String'>
    readonly remarks: FieldRef<"TumblingProcess", 'String'>
    readonly startedByName: FieldRef<"TumblingProcess", 'String'>
    readonly authorizedByCode: FieldRef<"TumblingProcess", 'String'>
    readonly authorizedByName: FieldRef<"TumblingProcess", 'String'>
    readonly products: FieldRef<"TumblingProcess", 'Json'>
    readonly events: FieldRef<"TumblingProcess", 'Json'>
    readonly activeSlotContainerId: FieldRef<"TumblingProcess", 'Int'>
    readonly createdAt: FieldRef<"TumblingProcess", 'DateTime'>
    readonly updatedAt: FieldRef<"TumblingProcess", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TumblingProcess findUnique
   */
  export type TumblingProcessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter, which TumblingProcess to fetch.
     */
    where: TumblingProcessWhereUniqueInput
  }

  /**
   * TumblingProcess findUniqueOrThrow
   */
  export type TumblingProcessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter, which TumblingProcess to fetch.
     */
    where: TumblingProcessWhereUniqueInput
  }

  /**
   * TumblingProcess findFirst
   */
  export type TumblingProcessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter, which TumblingProcess to fetch.
     */
    where?: TumblingProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingProcesses to fetch.
     */
    orderBy?: TumblingProcessOrderByWithRelationInput | TumblingProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingProcesses.
     */
    cursor?: TumblingProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingProcesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingProcesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingProcesses.
     */
    distinct?: TumblingProcessScalarFieldEnum | TumblingProcessScalarFieldEnum[]
  }

  /**
   * TumblingProcess findFirstOrThrow
   */
  export type TumblingProcessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter, which TumblingProcess to fetch.
     */
    where?: TumblingProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingProcesses to fetch.
     */
    orderBy?: TumblingProcessOrderByWithRelationInput | TumblingProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingProcesses.
     */
    cursor?: TumblingProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingProcesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingProcesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingProcesses.
     */
    distinct?: TumblingProcessScalarFieldEnum | TumblingProcessScalarFieldEnum[]
  }

  /**
   * TumblingProcess findMany
   */
  export type TumblingProcessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter, which TumblingProcesses to fetch.
     */
    where?: TumblingProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingProcesses to fetch.
     */
    orderBy?: TumblingProcessOrderByWithRelationInput | TumblingProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TumblingProcesses.
     */
    cursor?: TumblingProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingProcesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingProcesses.
     */
    skip?: number
    distinct?: TumblingProcessScalarFieldEnum | TumblingProcessScalarFieldEnum[]
  }

  /**
   * TumblingProcess create
   */
  export type TumblingProcessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * The data needed to create a TumblingProcess.
     */
    data: XOR<TumblingProcessCreateInput, TumblingProcessUncheckedCreateInput>
  }

  /**
   * TumblingProcess createMany
   */
  export type TumblingProcessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TumblingProcesses.
     */
    data: TumblingProcessCreateManyInput | TumblingProcessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TumblingProcess update
   */
  export type TumblingProcessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * The data needed to update a TumblingProcess.
     */
    data: XOR<TumblingProcessUpdateInput, TumblingProcessUncheckedUpdateInput>
    /**
     * Choose, which TumblingProcess to update.
     */
    where: TumblingProcessWhereUniqueInput
  }

  /**
   * TumblingProcess updateMany
   */
  export type TumblingProcessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TumblingProcesses.
     */
    data: XOR<TumblingProcessUpdateManyMutationInput, TumblingProcessUncheckedUpdateManyInput>
    /**
     * Filter which TumblingProcesses to update
     */
    where?: TumblingProcessWhereInput
    /**
     * Limit how many TumblingProcesses to update.
     */
    limit?: number
  }

  /**
   * TumblingProcess upsert
   */
  export type TumblingProcessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * The filter to search for the TumblingProcess to update in case it exists.
     */
    where: TumblingProcessWhereUniqueInput
    /**
     * In case the TumblingProcess found by the `where` argument doesn't exist, create a new TumblingProcess with this data.
     */
    create: XOR<TumblingProcessCreateInput, TumblingProcessUncheckedCreateInput>
    /**
     * In case the TumblingProcess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TumblingProcessUpdateInput, TumblingProcessUncheckedUpdateInput>
  }

  /**
   * TumblingProcess delete
   */
  export type TumblingProcessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
    /**
     * Filter which TumblingProcess to delete.
     */
    where: TumblingProcessWhereUniqueInput
  }

  /**
   * TumblingProcess deleteMany
   */
  export type TumblingProcessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingProcesses to delete
     */
    where?: TumblingProcessWhereInput
    /**
     * Limit how many TumblingProcesses to delete.
     */
    limit?: number
  }

  /**
   * TumblingProcess without action
   */
  export type TumblingProcessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingProcess
     */
    select?: TumblingProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingProcess
     */
    omit?: TumblingProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumblingProcessInclude<ExtArgs> | null
  }


  /**
   * Model TumblingConfiguration
   */

  export type AggregateTumblingConfiguration = {
    _count: TumblingConfigurationCountAggregateOutputType | null
    _avg: TumblingConfigurationAvgAggregateOutputType | null
    _sum: TumblingConfigurationSumAggregateOutputType | null
    _min: TumblingConfigurationMinAggregateOutputType | null
    _max: TumblingConfigurationMaxAggregateOutputType | null
  }

  export type TumblingConfigurationAvgAggregateOutputType = {
    id: number | null
    defaultDurationMinutes: number | null
    nearCompletionThresholdMinutes: number | null
  }

  export type TumblingConfigurationSumAggregateOutputType = {
    id: number | null
    defaultDurationMinutes: number | null
    nearCompletionThresholdMinutes: number | null
  }

  export type TumblingConfigurationMinAggregateOutputType = {
    id: number | null
    defaultDurationMinutes: number | null
    additionalFieldLabel: string | null
    nearCompletionThresholdMinutes: number | null
    updatedAt: Date | null
  }

  export type TumblingConfigurationMaxAggregateOutputType = {
    id: number | null
    defaultDurationMinutes: number | null
    additionalFieldLabel: string | null
    nearCompletionThresholdMinutes: number | null
    updatedAt: Date | null
  }

  export type TumblingConfigurationCountAggregateOutputType = {
    id: number
    defaultDurationMinutes: number
    additionalFieldLabel: number
    nearCompletionThresholdMinutes: number
    updatedAt: number
    _all: number
  }


  export type TumblingConfigurationAvgAggregateInputType = {
    id?: true
    defaultDurationMinutes?: true
    nearCompletionThresholdMinutes?: true
  }

  export type TumblingConfigurationSumAggregateInputType = {
    id?: true
    defaultDurationMinutes?: true
    nearCompletionThresholdMinutes?: true
  }

  export type TumblingConfigurationMinAggregateInputType = {
    id?: true
    defaultDurationMinutes?: true
    additionalFieldLabel?: true
    nearCompletionThresholdMinutes?: true
    updatedAt?: true
  }

  export type TumblingConfigurationMaxAggregateInputType = {
    id?: true
    defaultDurationMinutes?: true
    additionalFieldLabel?: true
    nearCompletionThresholdMinutes?: true
    updatedAt?: true
  }

  export type TumblingConfigurationCountAggregateInputType = {
    id?: true
    defaultDurationMinutes?: true
    additionalFieldLabel?: true
    nearCompletionThresholdMinutes?: true
    updatedAt?: true
    _all?: true
  }

  export type TumblingConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingConfiguration to aggregate.
     */
    where?: TumblingConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingConfigurations to fetch.
     */
    orderBy?: TumblingConfigurationOrderByWithRelationInput | TumblingConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TumblingConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TumblingConfigurations
    **/
    _count?: true | TumblingConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TumblingConfigurationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TumblingConfigurationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TumblingConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TumblingConfigurationMaxAggregateInputType
  }

  export type GetTumblingConfigurationAggregateType<T extends TumblingConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateTumblingConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumblingConfiguration[P]>
      : GetScalarType<T[P], AggregateTumblingConfiguration[P]>
  }




  export type TumblingConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumblingConfigurationWhereInput
    orderBy?: TumblingConfigurationOrderByWithAggregationInput | TumblingConfigurationOrderByWithAggregationInput[]
    by: TumblingConfigurationScalarFieldEnum[] | TumblingConfigurationScalarFieldEnum
    having?: TumblingConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TumblingConfigurationCountAggregateInputType | true
    _avg?: TumblingConfigurationAvgAggregateInputType
    _sum?: TumblingConfigurationSumAggregateInputType
    _min?: TumblingConfigurationMinAggregateInputType
    _max?: TumblingConfigurationMaxAggregateInputType
  }

  export type TumblingConfigurationGroupByOutputType = {
    id: number
    defaultDurationMinutes: number
    additionalFieldLabel: string
    nearCompletionThresholdMinutes: number
    updatedAt: Date
    _count: TumblingConfigurationCountAggregateOutputType | null
    _avg: TumblingConfigurationAvgAggregateOutputType | null
    _sum: TumblingConfigurationSumAggregateOutputType | null
    _min: TumblingConfigurationMinAggregateOutputType | null
    _max: TumblingConfigurationMaxAggregateOutputType | null
  }

  type GetTumblingConfigurationGroupByPayload<T extends TumblingConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TumblingConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TumblingConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumblingConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], TumblingConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type TumblingConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    defaultDurationMinutes?: boolean
    additionalFieldLabel?: boolean
    nearCompletionThresholdMinutes?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tumblingConfiguration"]>



  export type TumblingConfigurationSelectScalar = {
    id?: boolean
    defaultDurationMinutes?: boolean
    additionalFieldLabel?: boolean
    nearCompletionThresholdMinutes?: boolean
    updatedAt?: boolean
  }

  export type TumblingConfigurationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "defaultDurationMinutes" | "additionalFieldLabel" | "nearCompletionThresholdMinutes" | "updatedAt", ExtArgs["result"]["tumblingConfiguration"]>

  export type $TumblingConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TumblingConfiguration"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      defaultDurationMinutes: number
      additionalFieldLabel: string
      nearCompletionThresholdMinutes: number
      updatedAt: Date
    }, ExtArgs["result"]["tumblingConfiguration"]>
    composites: {}
  }

  type TumblingConfigurationGetPayload<S extends boolean | null | undefined | TumblingConfigurationDefaultArgs> = $Result.GetResult<Prisma.$TumblingConfigurationPayload, S>

  type TumblingConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TumblingConfigurationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TumblingConfigurationCountAggregateInputType | true
    }

  export interface TumblingConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TumblingConfiguration'], meta: { name: 'TumblingConfiguration' } }
    /**
     * Find zero or one TumblingConfiguration that matches the filter.
     * @param {TumblingConfigurationFindUniqueArgs} args - Arguments to find a TumblingConfiguration
     * @example
     * // Get one TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TumblingConfigurationFindUniqueArgs>(args: SelectSubset<T, TumblingConfigurationFindUniqueArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TumblingConfiguration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TumblingConfigurationFindUniqueOrThrowArgs} args - Arguments to find a TumblingConfiguration
     * @example
     * // Get one TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TumblingConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, TumblingConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingConfiguration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationFindFirstArgs} args - Arguments to find a TumblingConfiguration
     * @example
     * // Get one TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TumblingConfigurationFindFirstArgs>(args?: SelectSubset<T, TumblingConfigurationFindFirstArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumblingConfiguration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationFindFirstOrThrowArgs} args - Arguments to find a TumblingConfiguration
     * @example
     * // Get one TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TumblingConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, TumblingConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TumblingConfigurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumblingConfigurations
     * const tumblingConfigurations = await prisma.tumblingConfiguration.findMany()
     * 
     * // Get first 10 TumblingConfigurations
     * const tumblingConfigurations = await prisma.tumblingConfiguration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tumblingConfigurationWithIdOnly = await prisma.tumblingConfiguration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TumblingConfigurationFindManyArgs>(args?: SelectSubset<T, TumblingConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TumblingConfiguration.
     * @param {TumblingConfigurationCreateArgs} args - Arguments to create a TumblingConfiguration.
     * @example
     * // Create one TumblingConfiguration
     * const TumblingConfiguration = await prisma.tumblingConfiguration.create({
     *   data: {
     *     // ... data to create a TumblingConfiguration
     *   }
     * })
     * 
     */
    create<T extends TumblingConfigurationCreateArgs>(args: SelectSubset<T, TumblingConfigurationCreateArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TumblingConfigurations.
     * @param {TumblingConfigurationCreateManyArgs} args - Arguments to create many TumblingConfigurations.
     * @example
     * // Create many TumblingConfigurations
     * const tumblingConfiguration = await prisma.tumblingConfiguration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TumblingConfigurationCreateManyArgs>(args?: SelectSubset<T, TumblingConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TumblingConfiguration.
     * @param {TumblingConfigurationDeleteArgs} args - Arguments to delete one TumblingConfiguration.
     * @example
     * // Delete one TumblingConfiguration
     * const TumblingConfiguration = await prisma.tumblingConfiguration.delete({
     *   where: {
     *     // ... filter to delete one TumblingConfiguration
     *   }
     * })
     * 
     */
    delete<T extends TumblingConfigurationDeleteArgs>(args: SelectSubset<T, TumblingConfigurationDeleteArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TumblingConfiguration.
     * @param {TumblingConfigurationUpdateArgs} args - Arguments to update one TumblingConfiguration.
     * @example
     * // Update one TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TumblingConfigurationUpdateArgs>(args: SelectSubset<T, TumblingConfigurationUpdateArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TumblingConfigurations.
     * @param {TumblingConfigurationDeleteManyArgs} args - Arguments to filter TumblingConfigurations to delete.
     * @example
     * // Delete a few TumblingConfigurations
     * const { count } = await prisma.tumblingConfiguration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TumblingConfigurationDeleteManyArgs>(args?: SelectSubset<T, TumblingConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumblingConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumblingConfigurations
     * const tumblingConfiguration = await prisma.tumblingConfiguration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TumblingConfigurationUpdateManyArgs>(args: SelectSubset<T, TumblingConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TumblingConfiguration.
     * @param {TumblingConfigurationUpsertArgs} args - Arguments to update or create a TumblingConfiguration.
     * @example
     * // Update or create a TumblingConfiguration
     * const tumblingConfiguration = await prisma.tumblingConfiguration.upsert({
     *   create: {
     *     // ... data to create a TumblingConfiguration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumblingConfiguration we want to update
     *   }
     * })
     */
    upsert<T extends TumblingConfigurationUpsertArgs>(args: SelectSubset<T, TumblingConfigurationUpsertArgs<ExtArgs>>): Prisma__TumblingConfigurationClient<$Result.GetResult<Prisma.$TumblingConfigurationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TumblingConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationCountArgs} args - Arguments to filter TumblingConfigurations to count.
     * @example
     * // Count the number of TumblingConfigurations
     * const count = await prisma.tumblingConfiguration.count({
     *   where: {
     *     // ... the filter for the TumblingConfigurations we want to count
     *   }
     * })
    **/
    count<T extends TumblingConfigurationCountArgs>(
      args?: Subset<T, TumblingConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumblingConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TumblingConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TumblingConfigurationAggregateArgs>(args: Subset<T, TumblingConfigurationAggregateArgs>): Prisma.PrismaPromise<GetTumblingConfigurationAggregateType<T>>

    /**
     * Group by TumblingConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumblingConfigurationGroupByArgs} args - Group by arguments.
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
      T extends TumblingConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumblingConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: TumblingConfigurationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TumblingConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTumblingConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TumblingConfiguration model
   */
  readonly fields: TumblingConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumblingConfiguration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TumblingConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TumblingConfiguration model
   */
  interface TumblingConfigurationFieldRefs {
    readonly id: FieldRef<"TumblingConfiguration", 'Int'>
    readonly defaultDurationMinutes: FieldRef<"TumblingConfiguration", 'Int'>
    readonly additionalFieldLabel: FieldRef<"TumblingConfiguration", 'String'>
    readonly nearCompletionThresholdMinutes: FieldRef<"TumblingConfiguration", 'Int'>
    readonly updatedAt: FieldRef<"TumblingConfiguration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TumblingConfiguration findUnique
   */
  export type TumblingConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which TumblingConfiguration to fetch.
     */
    where: TumblingConfigurationWhereUniqueInput
  }

  /**
   * TumblingConfiguration findUniqueOrThrow
   */
  export type TumblingConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which TumblingConfiguration to fetch.
     */
    where: TumblingConfigurationWhereUniqueInput
  }

  /**
   * TumblingConfiguration findFirst
   */
  export type TumblingConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which TumblingConfiguration to fetch.
     */
    where?: TumblingConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingConfigurations to fetch.
     */
    orderBy?: TumblingConfigurationOrderByWithRelationInput | TumblingConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingConfigurations.
     */
    cursor?: TumblingConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingConfigurations.
     */
    distinct?: TumblingConfigurationScalarFieldEnum | TumblingConfigurationScalarFieldEnum[]
  }

  /**
   * TumblingConfiguration findFirstOrThrow
   */
  export type TumblingConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which TumblingConfiguration to fetch.
     */
    where?: TumblingConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingConfigurations to fetch.
     */
    orderBy?: TumblingConfigurationOrderByWithRelationInput | TumblingConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumblingConfigurations.
     */
    cursor?: TumblingConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumblingConfigurations.
     */
    distinct?: TumblingConfigurationScalarFieldEnum | TumblingConfigurationScalarFieldEnum[]
  }

  /**
   * TumblingConfiguration findMany
   */
  export type TumblingConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which TumblingConfigurations to fetch.
     */
    where?: TumblingConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumblingConfigurations to fetch.
     */
    orderBy?: TumblingConfigurationOrderByWithRelationInput | TumblingConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TumblingConfigurations.
     */
    cursor?: TumblingConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumblingConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumblingConfigurations.
     */
    skip?: number
    distinct?: TumblingConfigurationScalarFieldEnum | TumblingConfigurationScalarFieldEnum[]
  }

  /**
   * TumblingConfiguration create
   */
  export type TumblingConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * The data needed to create a TumblingConfiguration.
     */
    data: XOR<TumblingConfigurationCreateInput, TumblingConfigurationUncheckedCreateInput>
  }

  /**
   * TumblingConfiguration createMany
   */
  export type TumblingConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TumblingConfigurations.
     */
    data: TumblingConfigurationCreateManyInput | TumblingConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TumblingConfiguration update
   */
  export type TumblingConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * The data needed to update a TumblingConfiguration.
     */
    data: XOR<TumblingConfigurationUpdateInput, TumblingConfigurationUncheckedUpdateInput>
    /**
     * Choose, which TumblingConfiguration to update.
     */
    where: TumblingConfigurationWhereUniqueInput
  }

  /**
   * TumblingConfiguration updateMany
   */
  export type TumblingConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TumblingConfigurations.
     */
    data: XOR<TumblingConfigurationUpdateManyMutationInput, TumblingConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which TumblingConfigurations to update
     */
    where?: TumblingConfigurationWhereInput
    /**
     * Limit how many TumblingConfigurations to update.
     */
    limit?: number
  }

  /**
   * TumblingConfiguration upsert
   */
  export type TumblingConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * The filter to search for the TumblingConfiguration to update in case it exists.
     */
    where: TumblingConfigurationWhereUniqueInput
    /**
     * In case the TumblingConfiguration found by the `where` argument doesn't exist, create a new TumblingConfiguration with this data.
     */
    create: XOR<TumblingConfigurationCreateInput, TumblingConfigurationUncheckedCreateInput>
    /**
     * In case the TumblingConfiguration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TumblingConfigurationUpdateInput, TumblingConfigurationUncheckedUpdateInput>
  }

  /**
   * TumblingConfiguration delete
   */
  export type TumblingConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
    /**
     * Filter which TumblingConfiguration to delete.
     */
    where: TumblingConfigurationWhereUniqueInput
  }

  /**
   * TumblingConfiguration deleteMany
   */
  export type TumblingConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumblingConfigurations to delete
     */
    where?: TumblingConfigurationWhereInput
    /**
     * Limit how many TumblingConfigurations to delete.
     */
    limit?: number
  }

  /**
   * TumblingConfiguration without action
   */
  export type TumblingConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumblingConfiguration
     */
    select?: TumblingConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumblingConfiguration
     */
    omit?: TumblingConfigurationOmit<ExtArgs> | null
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


  export const PlatingScalarFieldEnum: {
    id: 'id',
    modelId: 'modelId',
    size: 'size',
    finish: 'finish',
    categoryOfWork: 'categoryOfWork',
    totalQuantity: 'totalQuantity',
    qcQuantity: 'qcQuantity',
    ngQuantity: 'ngQuantity',
    copperRejection: 'copperRejection',
    nickelRejection: 'nickelRejection',
    lineRejection: 'lineRejection',
    fqcRejection: 'fqcRejection',
    updatedAt: 'updatedAt'
  };

  export type PlatingScalarFieldEnum = (typeof PlatingScalarFieldEnum)[keyof typeof PlatingScalarFieldEnum]


  export const FittingScanScalarFieldEnum: {
    id: 'id',
    barcode: 'barcode',
    lineNumber: 'lineNumber',
    nosePadPid: 'nosePadPid',
    tipFittingPid: 'tipFittingPid',
    lensFittingPid: 'lensFittingPid',
    tipBendingPid: 'tipBendingPid',
    frontAlignPid: 'frontAlignPid',
    frameAlignPid: 'frameAlignPid',
    isRework: 'isRework',
    timestamp: 'timestamp'
  };

  export type FittingScanScalarFieldEnum = (typeof FittingScanScalarFieldEnum)[keyof typeof FittingScanScalarFieldEnum]


  export const QcScanScalarFieldEnum: {
    id: 'id',
    barcode: 'barcode',
    qcPerson: 'qcPerson',
    qcStation: 'qcStation',
    status: 'status',
    reason: 'reason',
    timestamp: 'timestamp'
  };

  export type QcScanScalarFieldEnum = (typeof QcScanScalarFieldEnum)[keyof typeof QcScanScalarFieldEnum]


  export const QcReasonScalarFieldEnum: {
    id: 'id',
    label: 'label',
    hotkey: 'hotkey',
    featured: 'featured',
    sortOrder: 'sortOrder',
    active: 'active',
    updatedAt: 'updatedAt'
  };

  export type QcReasonScalarFieldEnum = (typeof QcReasonScalarFieldEnum)[keyof typeof QcReasonScalarFieldEnum]


  export const TumblingContainerScalarFieldEnum: {
    id: 'id',
    stationNumber: 'stationNumber',
    side: 'side',
    displayName: 'displayName',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TumblingContainerScalarFieldEnum = (typeof TumblingContainerScalarFieldEnum)[keyof typeof TumblingContainerScalarFieldEnum]


  export const TumblingProcessScalarFieldEnum: {
    id: 'id',
    processCode: 'processCode',
    containerId: 'containerId',
    status: 'status',
    durationMinutes: 'durationMinutes',
    startedAt: 'startedAt',
    expectedCompletionAt: 'expectedCompletionAt',
    completedAt: 'completedAt',
    stoppedAt: 'stoppedAt',
    completionType: 'completionType',
    reason: 'reason',
    remarks: 'remarks',
    startedByName: 'startedByName',
    authorizedByCode: 'authorizedByCode',
    authorizedByName: 'authorizedByName',
    products: 'products',
    events: 'events',
    activeSlotContainerId: 'activeSlotContainerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TumblingProcessScalarFieldEnum = (typeof TumblingProcessScalarFieldEnum)[keyof typeof TumblingProcessScalarFieldEnum]


  export const TumblingConfigurationScalarFieldEnum: {
    id: 'id',
    defaultDurationMinutes: 'defaultDurationMinutes',
    additionalFieldLabel: 'additionalFieldLabel',
    nearCompletionThresholdMinutes: 'nearCompletionThresholdMinutes',
    updatedAt: 'updatedAt'
  };

  export type TumblingConfigurationScalarFieldEnum = (typeof TumblingConfigurationScalarFieldEnum)[keyof typeof TumblingConfigurationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const PlatingOrderByRelevanceFieldEnum: {
    modelId: 'modelId',
    size: 'size',
    finish: 'finish',
    categoryOfWork: 'categoryOfWork'
  };

  export type PlatingOrderByRelevanceFieldEnum = (typeof PlatingOrderByRelevanceFieldEnum)[keyof typeof PlatingOrderByRelevanceFieldEnum]


  export const FittingScanOrderByRelevanceFieldEnum: {
    barcode: 'barcode',
    lineNumber: 'lineNumber',
    nosePadPid: 'nosePadPid',
    tipFittingPid: 'tipFittingPid',
    lensFittingPid: 'lensFittingPid',
    tipBendingPid: 'tipBendingPid',
    frontAlignPid: 'frontAlignPid',
    frameAlignPid: 'frameAlignPid'
  };

  export type FittingScanOrderByRelevanceFieldEnum = (typeof FittingScanOrderByRelevanceFieldEnum)[keyof typeof FittingScanOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const QcScanOrderByRelevanceFieldEnum: {
    barcode: 'barcode',
    qcPerson: 'qcPerson',
    qcStation: 'qcStation',
    status: 'status',
    reason: 'reason'
  };

  export type QcScanOrderByRelevanceFieldEnum = (typeof QcScanOrderByRelevanceFieldEnum)[keyof typeof QcScanOrderByRelevanceFieldEnum]


  export const QcReasonOrderByRelevanceFieldEnum: {
    label: 'label',
    hotkey: 'hotkey'
  };

  export type QcReasonOrderByRelevanceFieldEnum = (typeof QcReasonOrderByRelevanceFieldEnum)[keyof typeof QcReasonOrderByRelevanceFieldEnum]


  export const TumblingContainerOrderByRelevanceFieldEnum: {
    displayName: 'displayName'
  };

  export type TumblingContainerOrderByRelevanceFieldEnum = (typeof TumblingContainerOrderByRelevanceFieldEnum)[keyof typeof TumblingContainerOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const TumblingProcessOrderByRelevanceFieldEnum: {
    processCode: 'processCode',
    reason: 'reason',
    remarks: 'remarks',
    startedByName: 'startedByName',
    authorizedByCode: 'authorizedByCode',
    authorizedByName: 'authorizedByName'
  };

  export type TumblingProcessOrderByRelevanceFieldEnum = (typeof TumblingProcessOrderByRelevanceFieldEnum)[keyof typeof TumblingProcessOrderByRelevanceFieldEnum]


  export const TumblingConfigurationOrderByRelevanceFieldEnum: {
    additionalFieldLabel: 'additionalFieldLabel'
  };

  export type TumblingConfigurationOrderByRelevanceFieldEnum = (typeof TumblingConfigurationOrderByRelevanceFieldEnum)[keyof typeof TumblingConfigurationOrderByRelevanceFieldEnum]


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
   * Reference to a field of type 'TumblingContainerSide'
   */
  export type EnumTumblingContainerSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TumblingContainerSide'>
    


  /**
   * Reference to a field of type 'TumblingProcessStatus'
   */
  export type EnumTumblingProcessStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TumblingProcessStatus'>
    


  /**
   * Reference to a field of type 'TumblingCompletionType'
   */
  export type EnumTumblingCompletionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TumblingCompletionType'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type PlatingWhereInput = {
    AND?: PlatingWhereInput | PlatingWhereInput[]
    OR?: PlatingWhereInput[]
    NOT?: PlatingWhereInput | PlatingWhereInput[]
    id?: IntFilter<"Plating"> | number
    modelId?: StringFilter<"Plating"> | string
    size?: StringFilter<"Plating"> | string
    finish?: StringFilter<"Plating"> | string
    categoryOfWork?: StringFilter<"Plating"> | string
    totalQuantity?: IntFilter<"Plating"> | number
    qcQuantity?: IntFilter<"Plating"> | number
    ngQuantity?: IntFilter<"Plating"> | number
    copperRejection?: IntFilter<"Plating"> | number
    nickelRejection?: IntFilter<"Plating"> | number
    lineRejection?: IntFilter<"Plating"> | number
    fqcRejection?: IntFilter<"Plating"> | number
    updatedAt?: DateTimeFilter<"Plating"> | Date | string
  }

  export type PlatingOrderByWithRelationInput = {
    id?: SortOrder
    modelId?: SortOrder
    size?: SortOrder
    finish?: SortOrder
    categoryOfWork?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
    updatedAt?: SortOrder
    _relevance?: PlatingOrderByRelevanceInput
  }

  export type PlatingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PlatingWhereInput | PlatingWhereInput[]
    OR?: PlatingWhereInput[]
    NOT?: PlatingWhereInput | PlatingWhereInput[]
    modelId?: StringFilter<"Plating"> | string
    size?: StringFilter<"Plating"> | string
    finish?: StringFilter<"Plating"> | string
    categoryOfWork?: StringFilter<"Plating"> | string
    totalQuantity?: IntFilter<"Plating"> | number
    qcQuantity?: IntFilter<"Plating"> | number
    ngQuantity?: IntFilter<"Plating"> | number
    copperRejection?: IntFilter<"Plating"> | number
    nickelRejection?: IntFilter<"Plating"> | number
    lineRejection?: IntFilter<"Plating"> | number
    fqcRejection?: IntFilter<"Plating"> | number
    updatedAt?: DateTimeFilter<"Plating"> | Date | string
  }, "id">

  export type PlatingOrderByWithAggregationInput = {
    id?: SortOrder
    modelId?: SortOrder
    size?: SortOrder
    finish?: SortOrder
    categoryOfWork?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
    updatedAt?: SortOrder
    _count?: PlatingCountOrderByAggregateInput
    _avg?: PlatingAvgOrderByAggregateInput
    _max?: PlatingMaxOrderByAggregateInput
    _min?: PlatingMinOrderByAggregateInput
    _sum?: PlatingSumOrderByAggregateInput
  }

  export type PlatingScalarWhereWithAggregatesInput = {
    AND?: PlatingScalarWhereWithAggregatesInput | PlatingScalarWhereWithAggregatesInput[]
    OR?: PlatingScalarWhereWithAggregatesInput[]
    NOT?: PlatingScalarWhereWithAggregatesInput | PlatingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Plating"> | number
    modelId?: StringWithAggregatesFilter<"Plating"> | string
    size?: StringWithAggregatesFilter<"Plating"> | string
    finish?: StringWithAggregatesFilter<"Plating"> | string
    categoryOfWork?: StringWithAggregatesFilter<"Plating"> | string
    totalQuantity?: IntWithAggregatesFilter<"Plating"> | number
    qcQuantity?: IntWithAggregatesFilter<"Plating"> | number
    ngQuantity?: IntWithAggregatesFilter<"Plating"> | number
    copperRejection?: IntWithAggregatesFilter<"Plating"> | number
    nickelRejection?: IntWithAggregatesFilter<"Plating"> | number
    lineRejection?: IntWithAggregatesFilter<"Plating"> | number
    fqcRejection?: IntWithAggregatesFilter<"Plating"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"Plating"> | Date | string
  }

  export type FittingScanWhereInput = {
    AND?: FittingScanWhereInput | FittingScanWhereInput[]
    OR?: FittingScanWhereInput[]
    NOT?: FittingScanWhereInput | FittingScanWhereInput[]
    id?: IntFilter<"FittingScan"> | number
    barcode?: StringFilter<"FittingScan"> | string
    lineNumber?: StringFilter<"FittingScan"> | string
    nosePadPid?: StringFilter<"FittingScan"> | string
    tipFittingPid?: StringFilter<"FittingScan"> | string
    lensFittingPid?: StringFilter<"FittingScan"> | string
    tipBendingPid?: StringFilter<"FittingScan"> | string
    frontAlignPid?: StringFilter<"FittingScan"> | string
    frameAlignPid?: StringFilter<"FittingScan"> | string
    isRework?: BoolFilter<"FittingScan"> | boolean
    timestamp?: DateTimeFilter<"FittingScan"> | Date | string
  }

  export type FittingScanOrderByWithRelationInput = {
    id?: SortOrder
    barcode?: SortOrder
    lineNumber?: SortOrder
    nosePadPid?: SortOrder
    tipFittingPid?: SortOrder
    lensFittingPid?: SortOrder
    tipBendingPid?: SortOrder
    frontAlignPid?: SortOrder
    frameAlignPid?: SortOrder
    isRework?: SortOrder
    timestamp?: SortOrder
    _relevance?: FittingScanOrderByRelevanceInput
  }

  export type FittingScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FittingScanWhereInput | FittingScanWhereInput[]
    OR?: FittingScanWhereInput[]
    NOT?: FittingScanWhereInput | FittingScanWhereInput[]
    barcode?: StringFilter<"FittingScan"> | string
    lineNumber?: StringFilter<"FittingScan"> | string
    nosePadPid?: StringFilter<"FittingScan"> | string
    tipFittingPid?: StringFilter<"FittingScan"> | string
    lensFittingPid?: StringFilter<"FittingScan"> | string
    tipBendingPid?: StringFilter<"FittingScan"> | string
    frontAlignPid?: StringFilter<"FittingScan"> | string
    frameAlignPid?: StringFilter<"FittingScan"> | string
    isRework?: BoolFilter<"FittingScan"> | boolean
    timestamp?: DateTimeFilter<"FittingScan"> | Date | string
  }, "id">

  export type FittingScanOrderByWithAggregationInput = {
    id?: SortOrder
    barcode?: SortOrder
    lineNumber?: SortOrder
    nosePadPid?: SortOrder
    tipFittingPid?: SortOrder
    lensFittingPid?: SortOrder
    tipBendingPid?: SortOrder
    frontAlignPid?: SortOrder
    frameAlignPid?: SortOrder
    isRework?: SortOrder
    timestamp?: SortOrder
    _count?: FittingScanCountOrderByAggregateInput
    _avg?: FittingScanAvgOrderByAggregateInput
    _max?: FittingScanMaxOrderByAggregateInput
    _min?: FittingScanMinOrderByAggregateInput
    _sum?: FittingScanSumOrderByAggregateInput
  }

  export type FittingScanScalarWhereWithAggregatesInput = {
    AND?: FittingScanScalarWhereWithAggregatesInput | FittingScanScalarWhereWithAggregatesInput[]
    OR?: FittingScanScalarWhereWithAggregatesInput[]
    NOT?: FittingScanScalarWhereWithAggregatesInput | FittingScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FittingScan"> | number
    barcode?: StringWithAggregatesFilter<"FittingScan"> | string
    lineNumber?: StringWithAggregatesFilter<"FittingScan"> | string
    nosePadPid?: StringWithAggregatesFilter<"FittingScan"> | string
    tipFittingPid?: StringWithAggregatesFilter<"FittingScan"> | string
    lensFittingPid?: StringWithAggregatesFilter<"FittingScan"> | string
    tipBendingPid?: StringWithAggregatesFilter<"FittingScan"> | string
    frontAlignPid?: StringWithAggregatesFilter<"FittingScan"> | string
    frameAlignPid?: StringWithAggregatesFilter<"FittingScan"> | string
    isRework?: BoolWithAggregatesFilter<"FittingScan"> | boolean
    timestamp?: DateTimeWithAggregatesFilter<"FittingScan"> | Date | string
  }

  export type QcScanWhereInput = {
    AND?: QcScanWhereInput | QcScanWhereInput[]
    OR?: QcScanWhereInput[]
    NOT?: QcScanWhereInput | QcScanWhereInput[]
    id?: IntFilter<"QcScan"> | number
    barcode?: StringFilter<"QcScan"> | string
    qcPerson?: StringFilter<"QcScan"> | string
    qcStation?: StringFilter<"QcScan"> | string
    status?: StringFilter<"QcScan"> | string
    reason?: StringNullableFilter<"QcScan"> | string | null
    timestamp?: DateTimeFilter<"QcScan"> | Date | string
  }

  export type QcScanOrderByWithRelationInput = {
    id?: SortOrder
    barcode?: SortOrder
    qcPerson?: SortOrder
    qcStation?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _relevance?: QcScanOrderByRelevanceInput
  }

  export type QcScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QcScanWhereInput | QcScanWhereInput[]
    OR?: QcScanWhereInput[]
    NOT?: QcScanWhereInput | QcScanWhereInput[]
    barcode?: StringFilter<"QcScan"> | string
    qcPerson?: StringFilter<"QcScan"> | string
    qcStation?: StringFilter<"QcScan"> | string
    status?: StringFilter<"QcScan"> | string
    reason?: StringNullableFilter<"QcScan"> | string | null
    timestamp?: DateTimeFilter<"QcScan"> | Date | string
  }, "id">

  export type QcScanOrderByWithAggregationInput = {
    id?: SortOrder
    barcode?: SortOrder
    qcPerson?: SortOrder
    qcStation?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: QcScanCountOrderByAggregateInput
    _avg?: QcScanAvgOrderByAggregateInput
    _max?: QcScanMaxOrderByAggregateInput
    _min?: QcScanMinOrderByAggregateInput
    _sum?: QcScanSumOrderByAggregateInput
  }

  export type QcScanScalarWhereWithAggregatesInput = {
    AND?: QcScanScalarWhereWithAggregatesInput | QcScanScalarWhereWithAggregatesInput[]
    OR?: QcScanScalarWhereWithAggregatesInput[]
    NOT?: QcScanScalarWhereWithAggregatesInput | QcScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"QcScan"> | number
    barcode?: StringWithAggregatesFilter<"QcScan"> | string
    qcPerson?: StringWithAggregatesFilter<"QcScan"> | string
    qcStation?: StringWithAggregatesFilter<"QcScan"> | string
    status?: StringWithAggregatesFilter<"QcScan"> | string
    reason?: StringNullableWithAggregatesFilter<"QcScan"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"QcScan"> | Date | string
  }

  export type QcReasonWhereInput = {
    AND?: QcReasonWhereInput | QcReasonWhereInput[]
    OR?: QcReasonWhereInput[]
    NOT?: QcReasonWhereInput | QcReasonWhereInput[]
    id?: IntFilter<"QcReason"> | number
    label?: StringFilter<"QcReason"> | string
    hotkey?: StringFilter<"QcReason"> | string
    featured?: BoolFilter<"QcReason"> | boolean
    sortOrder?: IntFilter<"QcReason"> | number
    active?: BoolFilter<"QcReason"> | boolean
    updatedAt?: DateTimeFilter<"QcReason"> | Date | string
  }

  export type QcReasonOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    hotkey?: SortOrder
    featured?: SortOrder
    sortOrder?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
    _relevance?: QcReasonOrderByRelevanceInput
  }

  export type QcReasonWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QcReasonWhereInput | QcReasonWhereInput[]
    OR?: QcReasonWhereInput[]
    NOT?: QcReasonWhereInput | QcReasonWhereInput[]
    label?: StringFilter<"QcReason"> | string
    hotkey?: StringFilter<"QcReason"> | string
    featured?: BoolFilter<"QcReason"> | boolean
    sortOrder?: IntFilter<"QcReason"> | number
    active?: BoolFilter<"QcReason"> | boolean
    updatedAt?: DateTimeFilter<"QcReason"> | Date | string
  }, "id">

  export type QcReasonOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    hotkey?: SortOrder
    featured?: SortOrder
    sortOrder?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
    _count?: QcReasonCountOrderByAggregateInput
    _avg?: QcReasonAvgOrderByAggregateInput
    _max?: QcReasonMaxOrderByAggregateInput
    _min?: QcReasonMinOrderByAggregateInput
    _sum?: QcReasonSumOrderByAggregateInput
  }

  export type QcReasonScalarWhereWithAggregatesInput = {
    AND?: QcReasonScalarWhereWithAggregatesInput | QcReasonScalarWhereWithAggregatesInput[]
    OR?: QcReasonScalarWhereWithAggregatesInput[]
    NOT?: QcReasonScalarWhereWithAggregatesInput | QcReasonScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"QcReason"> | number
    label?: StringWithAggregatesFilter<"QcReason"> | string
    hotkey?: StringWithAggregatesFilter<"QcReason"> | string
    featured?: BoolWithAggregatesFilter<"QcReason"> | boolean
    sortOrder?: IntWithAggregatesFilter<"QcReason"> | number
    active?: BoolWithAggregatesFilter<"QcReason"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"QcReason"> | Date | string
  }

  export type TumblingContainerWhereInput = {
    AND?: TumblingContainerWhereInput | TumblingContainerWhereInput[]
    OR?: TumblingContainerWhereInput[]
    NOT?: TumblingContainerWhereInput | TumblingContainerWhereInput[]
    id?: IntFilter<"TumblingContainer"> | number
    stationNumber?: IntFilter<"TumblingContainer"> | number
    side?: EnumTumblingContainerSideFilter<"TumblingContainer"> | $Enums.TumblingContainerSide
    displayName?: StringFilter<"TumblingContainer"> | string
    isActive?: BoolFilter<"TumblingContainer"> | boolean
    createdAt?: DateTimeFilter<"TumblingContainer"> | Date | string
    updatedAt?: DateTimeFilter<"TumblingContainer"> | Date | string
    processes?: TumblingProcessListRelationFilter
  }

  export type TumblingContainerOrderByWithRelationInput = {
    id?: SortOrder
    stationNumber?: SortOrder
    side?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    processes?: TumblingProcessOrderByRelationAggregateInput
    _relevance?: TumblingContainerOrderByRelevanceInput
  }

  export type TumblingContainerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    stationNumber_side?: TumblingContainerStationNumberSideCompoundUniqueInput
    AND?: TumblingContainerWhereInput | TumblingContainerWhereInput[]
    OR?: TumblingContainerWhereInput[]
    NOT?: TumblingContainerWhereInput | TumblingContainerWhereInput[]
    stationNumber?: IntFilter<"TumblingContainer"> | number
    side?: EnumTumblingContainerSideFilter<"TumblingContainer"> | $Enums.TumblingContainerSide
    displayName?: StringFilter<"TumblingContainer"> | string
    isActive?: BoolFilter<"TumblingContainer"> | boolean
    createdAt?: DateTimeFilter<"TumblingContainer"> | Date | string
    updatedAt?: DateTimeFilter<"TumblingContainer"> | Date | string
    processes?: TumblingProcessListRelationFilter
  }, "id" | "stationNumber_side">

  export type TumblingContainerOrderByWithAggregationInput = {
    id?: SortOrder
    stationNumber?: SortOrder
    side?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TumblingContainerCountOrderByAggregateInput
    _avg?: TumblingContainerAvgOrderByAggregateInput
    _max?: TumblingContainerMaxOrderByAggregateInput
    _min?: TumblingContainerMinOrderByAggregateInput
    _sum?: TumblingContainerSumOrderByAggregateInput
  }

  export type TumblingContainerScalarWhereWithAggregatesInput = {
    AND?: TumblingContainerScalarWhereWithAggregatesInput | TumblingContainerScalarWhereWithAggregatesInput[]
    OR?: TumblingContainerScalarWhereWithAggregatesInput[]
    NOT?: TumblingContainerScalarWhereWithAggregatesInput | TumblingContainerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TumblingContainer"> | number
    stationNumber?: IntWithAggregatesFilter<"TumblingContainer"> | number
    side?: EnumTumblingContainerSideWithAggregatesFilter<"TumblingContainer"> | $Enums.TumblingContainerSide
    displayName?: StringWithAggregatesFilter<"TumblingContainer"> | string
    isActive?: BoolWithAggregatesFilter<"TumblingContainer"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TumblingContainer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TumblingContainer"> | Date | string
  }

  export type TumblingProcessWhereInput = {
    AND?: TumblingProcessWhereInput | TumblingProcessWhereInput[]
    OR?: TumblingProcessWhereInput[]
    NOT?: TumblingProcessWhereInput | TumblingProcessWhereInput[]
    id?: IntFilter<"TumblingProcess"> | number
    processCode?: StringFilter<"TumblingProcess"> | string
    containerId?: IntFilter<"TumblingProcess"> | number
    status?: EnumTumblingProcessStatusFilter<"TumblingProcess"> | $Enums.TumblingProcessStatus
    durationMinutes?: IntFilter<"TumblingProcess"> | number
    startedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    expectedCompletionAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    stoppedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completionType?: EnumTumblingCompletionTypeNullableFilter<"TumblingProcess"> | $Enums.TumblingCompletionType | null
    reason?: StringNullableFilter<"TumblingProcess"> | string | null
    remarks?: StringNullableFilter<"TumblingProcess"> | string | null
    startedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByCode?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    products?: JsonFilter<"TumblingProcess">
    events?: JsonFilter<"TumblingProcess">
    activeSlotContainerId?: IntNullableFilter<"TumblingProcess"> | number | null
    createdAt?: DateTimeFilter<"TumblingProcess"> | Date | string
    updatedAt?: DateTimeFilter<"TumblingProcess"> | Date | string
    container?: XOR<TumblingContainerScalarRelationFilter, TumblingContainerWhereInput>
  }

  export type TumblingProcessOrderByWithRelationInput = {
    id?: SortOrder
    processCode?: SortOrder
    containerId?: SortOrder
    status?: SortOrder
    durationMinutes?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    expectedCompletionAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    stoppedAt?: SortOrderInput | SortOrder
    completionType?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    startedByName?: SortOrderInput | SortOrder
    authorizedByCode?: SortOrderInput | SortOrder
    authorizedByName?: SortOrderInput | SortOrder
    products?: SortOrder
    events?: SortOrder
    activeSlotContainerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    container?: TumblingContainerOrderByWithRelationInput
    _relevance?: TumblingProcessOrderByRelevanceInput
  }

  export type TumblingProcessWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    processCode?: string
    activeSlotContainerId?: number
    AND?: TumblingProcessWhereInput | TumblingProcessWhereInput[]
    OR?: TumblingProcessWhereInput[]
    NOT?: TumblingProcessWhereInput | TumblingProcessWhereInput[]
    containerId?: IntFilter<"TumblingProcess"> | number
    status?: EnumTumblingProcessStatusFilter<"TumblingProcess"> | $Enums.TumblingProcessStatus
    durationMinutes?: IntFilter<"TumblingProcess"> | number
    startedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    expectedCompletionAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    stoppedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completionType?: EnumTumblingCompletionTypeNullableFilter<"TumblingProcess"> | $Enums.TumblingCompletionType | null
    reason?: StringNullableFilter<"TumblingProcess"> | string | null
    remarks?: StringNullableFilter<"TumblingProcess"> | string | null
    startedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByCode?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    products?: JsonFilter<"TumblingProcess">
    events?: JsonFilter<"TumblingProcess">
    createdAt?: DateTimeFilter<"TumblingProcess"> | Date | string
    updatedAt?: DateTimeFilter<"TumblingProcess"> | Date | string
    container?: XOR<TumblingContainerScalarRelationFilter, TumblingContainerWhereInput>
  }, "id" | "processCode" | "activeSlotContainerId">

  export type TumblingProcessOrderByWithAggregationInput = {
    id?: SortOrder
    processCode?: SortOrder
    containerId?: SortOrder
    status?: SortOrder
    durationMinutes?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    expectedCompletionAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    stoppedAt?: SortOrderInput | SortOrder
    completionType?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    startedByName?: SortOrderInput | SortOrder
    authorizedByCode?: SortOrderInput | SortOrder
    authorizedByName?: SortOrderInput | SortOrder
    products?: SortOrder
    events?: SortOrder
    activeSlotContainerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TumblingProcessCountOrderByAggregateInput
    _avg?: TumblingProcessAvgOrderByAggregateInput
    _max?: TumblingProcessMaxOrderByAggregateInput
    _min?: TumblingProcessMinOrderByAggregateInput
    _sum?: TumblingProcessSumOrderByAggregateInput
  }

  export type TumblingProcessScalarWhereWithAggregatesInput = {
    AND?: TumblingProcessScalarWhereWithAggregatesInput | TumblingProcessScalarWhereWithAggregatesInput[]
    OR?: TumblingProcessScalarWhereWithAggregatesInput[]
    NOT?: TumblingProcessScalarWhereWithAggregatesInput | TumblingProcessScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TumblingProcess"> | number
    processCode?: StringWithAggregatesFilter<"TumblingProcess"> | string
    containerId?: IntWithAggregatesFilter<"TumblingProcess"> | number
    status?: EnumTumblingProcessStatusWithAggregatesFilter<"TumblingProcess"> | $Enums.TumblingProcessStatus
    durationMinutes?: IntWithAggregatesFilter<"TumblingProcess"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"TumblingProcess"> | Date | string | null
    expectedCompletionAt?: DateTimeNullableWithAggregatesFilter<"TumblingProcess"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"TumblingProcess"> | Date | string | null
    stoppedAt?: DateTimeNullableWithAggregatesFilter<"TumblingProcess"> | Date | string | null
    completionType?: EnumTumblingCompletionTypeNullableWithAggregatesFilter<"TumblingProcess"> | $Enums.TumblingCompletionType | null
    reason?: StringNullableWithAggregatesFilter<"TumblingProcess"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"TumblingProcess"> | string | null
    startedByName?: StringNullableWithAggregatesFilter<"TumblingProcess"> | string | null
    authorizedByCode?: StringNullableWithAggregatesFilter<"TumblingProcess"> | string | null
    authorizedByName?: StringNullableWithAggregatesFilter<"TumblingProcess"> | string | null
    products?: JsonWithAggregatesFilter<"TumblingProcess">
    events?: JsonWithAggregatesFilter<"TumblingProcess">
    activeSlotContainerId?: IntNullableWithAggregatesFilter<"TumblingProcess"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"TumblingProcess"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TumblingProcess"> | Date | string
  }

  export type TumblingConfigurationWhereInput = {
    AND?: TumblingConfigurationWhereInput | TumblingConfigurationWhereInput[]
    OR?: TumblingConfigurationWhereInput[]
    NOT?: TumblingConfigurationWhereInput | TumblingConfigurationWhereInput[]
    id?: IntFilter<"TumblingConfiguration"> | number
    defaultDurationMinutes?: IntFilter<"TumblingConfiguration"> | number
    additionalFieldLabel?: StringFilter<"TumblingConfiguration"> | string
    nearCompletionThresholdMinutes?: IntFilter<"TumblingConfiguration"> | number
    updatedAt?: DateTimeFilter<"TumblingConfiguration"> | Date | string
  }

  export type TumblingConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    additionalFieldLabel?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
    updatedAt?: SortOrder
    _relevance?: TumblingConfigurationOrderByRelevanceInput
  }

  export type TumblingConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TumblingConfigurationWhereInput | TumblingConfigurationWhereInput[]
    OR?: TumblingConfigurationWhereInput[]
    NOT?: TumblingConfigurationWhereInput | TumblingConfigurationWhereInput[]
    defaultDurationMinutes?: IntFilter<"TumblingConfiguration"> | number
    additionalFieldLabel?: StringFilter<"TumblingConfiguration"> | string
    nearCompletionThresholdMinutes?: IntFilter<"TumblingConfiguration"> | number
    updatedAt?: DateTimeFilter<"TumblingConfiguration"> | Date | string
  }, "id">

  export type TumblingConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    additionalFieldLabel?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
    updatedAt?: SortOrder
    _count?: TumblingConfigurationCountOrderByAggregateInput
    _avg?: TumblingConfigurationAvgOrderByAggregateInput
    _max?: TumblingConfigurationMaxOrderByAggregateInput
    _min?: TumblingConfigurationMinOrderByAggregateInput
    _sum?: TumblingConfigurationSumOrderByAggregateInput
  }

  export type TumblingConfigurationScalarWhereWithAggregatesInput = {
    AND?: TumblingConfigurationScalarWhereWithAggregatesInput | TumblingConfigurationScalarWhereWithAggregatesInput[]
    OR?: TumblingConfigurationScalarWhereWithAggregatesInput[]
    NOT?: TumblingConfigurationScalarWhereWithAggregatesInput | TumblingConfigurationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TumblingConfiguration"> | number
    defaultDurationMinutes?: IntWithAggregatesFilter<"TumblingConfiguration"> | number
    additionalFieldLabel?: StringWithAggregatesFilter<"TumblingConfiguration"> | string
    nearCompletionThresholdMinutes?: IntWithAggregatesFilter<"TumblingConfiguration"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"TumblingConfiguration"> | Date | string
  }

  export type PlatingCreateInput = {
    modelId: string
    size: string
    finish: string
    categoryOfWork: string
    totalQuantity?: number
    qcQuantity?: number
    ngQuantity?: number
    copperRejection?: number
    nickelRejection?: number
    lineRejection?: number
    fqcRejection?: number
    updatedAt?: Date | string
  }

  export type PlatingUncheckedCreateInput = {
    id?: number
    modelId: string
    size: string
    finish: string
    categoryOfWork: string
    totalQuantity?: number
    qcQuantity?: number
    ngQuantity?: number
    copperRejection?: number
    nickelRejection?: number
    lineRejection?: number
    fqcRejection?: number
    updatedAt?: Date | string
  }

  export type PlatingUpdateInput = {
    modelId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    finish?: StringFieldUpdateOperationsInput | string
    categoryOfWork?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    qcQuantity?: IntFieldUpdateOperationsInput | number
    ngQuantity?: IntFieldUpdateOperationsInput | number
    copperRejection?: IntFieldUpdateOperationsInput | number
    nickelRejection?: IntFieldUpdateOperationsInput | number
    lineRejection?: IntFieldUpdateOperationsInput | number
    fqcRejection?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    modelId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    finish?: StringFieldUpdateOperationsInput | string
    categoryOfWork?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    qcQuantity?: IntFieldUpdateOperationsInput | number
    ngQuantity?: IntFieldUpdateOperationsInput | number
    copperRejection?: IntFieldUpdateOperationsInput | number
    nickelRejection?: IntFieldUpdateOperationsInput | number
    lineRejection?: IntFieldUpdateOperationsInput | number
    fqcRejection?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatingCreateManyInput = {
    id?: number
    modelId: string
    size: string
    finish: string
    categoryOfWork: string
    totalQuantity?: number
    qcQuantity?: number
    ngQuantity?: number
    copperRejection?: number
    nickelRejection?: number
    lineRejection?: number
    fqcRejection?: number
    updatedAt?: Date | string
  }

  export type PlatingUpdateManyMutationInput = {
    modelId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    finish?: StringFieldUpdateOperationsInput | string
    categoryOfWork?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    qcQuantity?: IntFieldUpdateOperationsInput | number
    ngQuantity?: IntFieldUpdateOperationsInput | number
    copperRejection?: IntFieldUpdateOperationsInput | number
    nickelRejection?: IntFieldUpdateOperationsInput | number
    lineRejection?: IntFieldUpdateOperationsInput | number
    fqcRejection?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    modelId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    finish?: StringFieldUpdateOperationsInput | string
    categoryOfWork?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    qcQuantity?: IntFieldUpdateOperationsInput | number
    ngQuantity?: IntFieldUpdateOperationsInput | number
    copperRejection?: IntFieldUpdateOperationsInput | number
    nickelRejection?: IntFieldUpdateOperationsInput | number
    lineRejection?: IntFieldUpdateOperationsInput | number
    fqcRejection?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FittingScanCreateInput = {
    barcode: string
    lineNumber: string
    nosePadPid: string
    tipFittingPid: string
    lensFittingPid: string
    tipBendingPid: string
    frontAlignPid: string
    frameAlignPid: string
    isRework?: boolean
    timestamp?: Date | string
  }

  export type FittingScanUncheckedCreateInput = {
    id?: number
    barcode: string
    lineNumber: string
    nosePadPid: string
    tipFittingPid: string
    lensFittingPid: string
    tipBendingPid: string
    frontAlignPid: string
    frameAlignPid: string
    isRework?: boolean
    timestamp?: Date | string
  }

  export type FittingScanUpdateInput = {
    barcode?: StringFieldUpdateOperationsInput | string
    lineNumber?: StringFieldUpdateOperationsInput | string
    nosePadPid?: StringFieldUpdateOperationsInput | string
    tipFittingPid?: StringFieldUpdateOperationsInput | string
    lensFittingPid?: StringFieldUpdateOperationsInput | string
    tipBendingPid?: StringFieldUpdateOperationsInput | string
    frontAlignPid?: StringFieldUpdateOperationsInput | string
    frameAlignPid?: StringFieldUpdateOperationsInput | string
    isRework?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FittingScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lineNumber?: StringFieldUpdateOperationsInput | string
    nosePadPid?: StringFieldUpdateOperationsInput | string
    tipFittingPid?: StringFieldUpdateOperationsInput | string
    lensFittingPid?: StringFieldUpdateOperationsInput | string
    tipBendingPid?: StringFieldUpdateOperationsInput | string
    frontAlignPid?: StringFieldUpdateOperationsInput | string
    frameAlignPid?: StringFieldUpdateOperationsInput | string
    isRework?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FittingScanCreateManyInput = {
    id?: number
    barcode: string
    lineNumber: string
    nosePadPid: string
    tipFittingPid: string
    lensFittingPid: string
    tipBendingPid: string
    frontAlignPid: string
    frameAlignPid: string
    isRework?: boolean
    timestamp?: Date | string
  }

  export type FittingScanUpdateManyMutationInput = {
    barcode?: StringFieldUpdateOperationsInput | string
    lineNumber?: StringFieldUpdateOperationsInput | string
    nosePadPid?: StringFieldUpdateOperationsInput | string
    tipFittingPid?: StringFieldUpdateOperationsInput | string
    lensFittingPid?: StringFieldUpdateOperationsInput | string
    tipBendingPid?: StringFieldUpdateOperationsInput | string
    frontAlignPid?: StringFieldUpdateOperationsInput | string
    frameAlignPid?: StringFieldUpdateOperationsInput | string
    isRework?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FittingScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    lineNumber?: StringFieldUpdateOperationsInput | string
    nosePadPid?: StringFieldUpdateOperationsInput | string
    tipFittingPid?: StringFieldUpdateOperationsInput | string
    lensFittingPid?: StringFieldUpdateOperationsInput | string
    tipBendingPid?: StringFieldUpdateOperationsInput | string
    frontAlignPid?: StringFieldUpdateOperationsInput | string
    frameAlignPid?: StringFieldUpdateOperationsInput | string
    isRework?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcScanCreateInput = {
    barcode: string
    qcPerson: string
    qcStation: string
    status: string
    reason?: string | null
    timestamp?: Date | string
  }

  export type QcScanUncheckedCreateInput = {
    id?: number
    barcode: string
    qcPerson: string
    qcStation: string
    status: string
    reason?: string | null
    timestamp?: Date | string
  }

  export type QcScanUpdateInput = {
    barcode?: StringFieldUpdateOperationsInput | string
    qcPerson?: StringFieldUpdateOperationsInput | string
    qcStation?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    qcPerson?: StringFieldUpdateOperationsInput | string
    qcStation?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcScanCreateManyInput = {
    id?: number
    barcode: string
    qcPerson: string
    qcStation: string
    status: string
    reason?: string | null
    timestamp?: Date | string
  }

  export type QcScanUpdateManyMutationInput = {
    barcode?: StringFieldUpdateOperationsInput | string
    qcPerson?: StringFieldUpdateOperationsInput | string
    qcStation?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: StringFieldUpdateOperationsInput | string
    qcPerson?: StringFieldUpdateOperationsInput | string
    qcStation?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcReasonCreateInput = {
    label: string
    hotkey?: string
    featured?: boolean
    sortOrder?: number
    active?: boolean
    updatedAt?: Date | string
  }

  export type QcReasonUncheckedCreateInput = {
    id?: number
    label: string
    hotkey?: string
    featured?: boolean
    sortOrder?: number
    active?: boolean
    updatedAt?: Date | string
  }

  export type QcReasonUpdateInput = {
    label?: StringFieldUpdateOperationsInput | string
    hotkey?: StringFieldUpdateOperationsInput | string
    featured?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcReasonUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    hotkey?: StringFieldUpdateOperationsInput | string
    featured?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcReasonCreateManyInput = {
    id?: number
    label: string
    hotkey?: string
    featured?: boolean
    sortOrder?: number
    active?: boolean
    updatedAt?: Date | string
  }

  export type QcReasonUpdateManyMutationInput = {
    label?: StringFieldUpdateOperationsInput | string
    hotkey?: StringFieldUpdateOperationsInput | string
    featured?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QcReasonUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    hotkey?: StringFieldUpdateOperationsInput | string
    featured?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingContainerCreateInput = {
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    processes?: TumblingProcessCreateNestedManyWithoutContainerInput
  }

  export type TumblingContainerUncheckedCreateInput = {
    id?: number
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    processes?: TumblingProcessUncheckedCreateNestedManyWithoutContainerInput
  }

  export type TumblingContainerUpdateInput = {
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processes?: TumblingProcessUpdateManyWithoutContainerNestedInput
  }

  export type TumblingContainerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processes?: TumblingProcessUncheckedUpdateManyWithoutContainerNestedInput
  }

  export type TumblingContainerCreateManyInput = {
    id?: number
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingContainerUpdateManyMutationInput = {
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingContainerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessCreateInput = {
    processCode: string
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    container: TumblingContainerCreateNestedOneWithoutProcessesInput
  }

  export type TumblingProcessUncheckedCreateInput = {
    id?: number
    processCode: string
    containerId: number
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingProcessUpdateInput = {
    processCode?: StringFieldUpdateOperationsInput | string
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    container?: TumblingContainerUpdateOneRequiredWithoutProcessesNestedInput
  }

  export type TumblingProcessUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    processCode?: StringFieldUpdateOperationsInput | string
    containerId?: IntFieldUpdateOperationsInput | number
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessCreateManyInput = {
    id?: number
    processCode: string
    containerId: number
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingProcessUpdateManyMutationInput = {
    processCode?: StringFieldUpdateOperationsInput | string
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    processCode?: StringFieldUpdateOperationsInput | string
    containerId?: IntFieldUpdateOperationsInput | number
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingConfigurationCreateInput = {
    defaultDurationMinutes?: number
    additionalFieldLabel?: string
    nearCompletionThresholdMinutes?: number
    updatedAt?: Date | string
  }

  export type TumblingConfigurationUncheckedCreateInput = {
    id?: number
    defaultDurationMinutes?: number
    additionalFieldLabel?: string
    nearCompletionThresholdMinutes?: number
    updatedAt?: Date | string
  }

  export type TumblingConfigurationUpdateInput = {
    defaultDurationMinutes?: IntFieldUpdateOperationsInput | number
    additionalFieldLabel?: StringFieldUpdateOperationsInput | string
    nearCompletionThresholdMinutes?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingConfigurationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultDurationMinutes?: IntFieldUpdateOperationsInput | number
    additionalFieldLabel?: StringFieldUpdateOperationsInput | string
    nearCompletionThresholdMinutes?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingConfigurationCreateManyInput = {
    id?: number
    defaultDurationMinutes?: number
    additionalFieldLabel?: string
    nearCompletionThresholdMinutes?: number
    updatedAt?: Date | string
  }

  export type TumblingConfigurationUpdateManyMutationInput = {
    defaultDurationMinutes?: IntFieldUpdateOperationsInput | number
    additionalFieldLabel?: StringFieldUpdateOperationsInput | string
    nearCompletionThresholdMinutes?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingConfigurationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultDurationMinutes?: IntFieldUpdateOperationsInput | number
    additionalFieldLabel?: StringFieldUpdateOperationsInput | string
    nearCompletionThresholdMinutes?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type PlatingOrderByRelevanceInput = {
    fields: PlatingOrderByRelevanceFieldEnum | PlatingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlatingCountOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    size?: SortOrder
    finish?: SortOrder
    categoryOfWork?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlatingAvgOrderByAggregateInput = {
    id?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
  }

  export type PlatingMaxOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    size?: SortOrder
    finish?: SortOrder
    categoryOfWork?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlatingMinOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    size?: SortOrder
    finish?: SortOrder
    categoryOfWork?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlatingSumOrderByAggregateInput = {
    id?: SortOrder
    totalQuantity?: SortOrder
    qcQuantity?: SortOrder
    ngQuantity?: SortOrder
    copperRejection?: SortOrder
    nickelRejection?: SortOrder
    lineRejection?: SortOrder
    fqcRejection?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FittingScanOrderByRelevanceInput = {
    fields: FittingScanOrderByRelevanceFieldEnum | FittingScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FittingScanCountOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    lineNumber?: SortOrder
    nosePadPid?: SortOrder
    tipFittingPid?: SortOrder
    lensFittingPid?: SortOrder
    tipBendingPid?: SortOrder
    frontAlignPid?: SortOrder
    frameAlignPid?: SortOrder
    isRework?: SortOrder
    timestamp?: SortOrder
  }

  export type FittingScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FittingScanMaxOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    lineNumber?: SortOrder
    nosePadPid?: SortOrder
    tipFittingPid?: SortOrder
    lensFittingPid?: SortOrder
    tipBendingPid?: SortOrder
    frontAlignPid?: SortOrder
    frameAlignPid?: SortOrder
    isRework?: SortOrder
    timestamp?: SortOrder
  }

  export type FittingScanMinOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    lineNumber?: SortOrder
    nosePadPid?: SortOrder
    tipFittingPid?: SortOrder
    lensFittingPid?: SortOrder
    tipBendingPid?: SortOrder
    frontAlignPid?: SortOrder
    frameAlignPid?: SortOrder
    isRework?: SortOrder
    timestamp?: SortOrder
  }

  export type FittingScanSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QcScanOrderByRelevanceInput = {
    fields: QcScanOrderByRelevanceFieldEnum | QcScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QcScanCountOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    qcPerson?: SortOrder
    qcStation?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    timestamp?: SortOrder
  }

  export type QcScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type QcScanMaxOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    qcPerson?: SortOrder
    qcStation?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    timestamp?: SortOrder
  }

  export type QcScanMinOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    qcPerson?: SortOrder
    qcStation?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    timestamp?: SortOrder
  }

  export type QcScanSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type QcReasonOrderByRelevanceInput = {
    fields: QcReasonOrderByRelevanceFieldEnum | QcReasonOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QcReasonCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    hotkey?: SortOrder
    featured?: SortOrder
    sortOrder?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type QcReasonAvgOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type QcReasonMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    hotkey?: SortOrder
    featured?: SortOrder
    sortOrder?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type QcReasonMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    hotkey?: SortOrder
    featured?: SortOrder
    sortOrder?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type QcReasonSumOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type EnumTumblingContainerSideFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingContainerSide | EnumTumblingContainerSideFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingContainerSide[]
    notIn?: $Enums.TumblingContainerSide[]
    not?: NestedEnumTumblingContainerSideFilter<$PrismaModel> | $Enums.TumblingContainerSide
  }

  export type TumblingProcessListRelationFilter = {
    every?: TumblingProcessWhereInput
    some?: TumblingProcessWhereInput
    none?: TumblingProcessWhereInput
  }

  export type TumblingProcessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TumblingContainerOrderByRelevanceInput = {
    fields: TumblingContainerOrderByRelevanceFieldEnum | TumblingContainerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TumblingContainerStationNumberSideCompoundUniqueInput = {
    stationNumber: number
    side: $Enums.TumblingContainerSide
  }

  export type TumblingContainerCountOrderByAggregateInput = {
    id?: SortOrder
    stationNumber?: SortOrder
    side?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingContainerAvgOrderByAggregateInput = {
    id?: SortOrder
    stationNumber?: SortOrder
  }

  export type TumblingContainerMaxOrderByAggregateInput = {
    id?: SortOrder
    stationNumber?: SortOrder
    side?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingContainerMinOrderByAggregateInput = {
    id?: SortOrder
    stationNumber?: SortOrder
    side?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingContainerSumOrderByAggregateInput = {
    id?: SortOrder
    stationNumber?: SortOrder
  }

  export type EnumTumblingContainerSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingContainerSide | EnumTumblingContainerSideFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingContainerSide[]
    notIn?: $Enums.TumblingContainerSide[]
    not?: NestedEnumTumblingContainerSideWithAggregatesFilter<$PrismaModel> | $Enums.TumblingContainerSide
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTumblingContainerSideFilter<$PrismaModel>
    _max?: NestedEnumTumblingContainerSideFilter<$PrismaModel>
  }

  export type EnumTumblingProcessStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingProcessStatus | EnumTumblingProcessStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingProcessStatus[]
    notIn?: $Enums.TumblingProcessStatus[]
    not?: NestedEnumTumblingProcessStatusFilter<$PrismaModel> | $Enums.TumblingProcessStatus
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

  export type EnumTumblingCompletionTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingCompletionType | EnumTumblingCompletionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TumblingCompletionType[] | null
    notIn?: $Enums.TumblingCompletionType[] | null
    not?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel> | $Enums.TumblingCompletionType | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type TumblingContainerScalarRelationFilter = {
    is?: TumblingContainerWhereInput
    isNot?: TumblingContainerWhereInput
  }

  export type TumblingProcessOrderByRelevanceInput = {
    fields: TumblingProcessOrderByRelevanceFieldEnum | TumblingProcessOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TumblingProcessCountOrderByAggregateInput = {
    id?: SortOrder
    processCode?: SortOrder
    containerId?: SortOrder
    status?: SortOrder
    durationMinutes?: SortOrder
    startedAt?: SortOrder
    expectedCompletionAt?: SortOrder
    completedAt?: SortOrder
    stoppedAt?: SortOrder
    completionType?: SortOrder
    reason?: SortOrder
    remarks?: SortOrder
    startedByName?: SortOrder
    authorizedByCode?: SortOrder
    authorizedByName?: SortOrder
    products?: SortOrder
    events?: SortOrder
    activeSlotContainerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingProcessAvgOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    durationMinutes?: SortOrder
    activeSlotContainerId?: SortOrder
  }

  export type TumblingProcessMaxOrderByAggregateInput = {
    id?: SortOrder
    processCode?: SortOrder
    containerId?: SortOrder
    status?: SortOrder
    durationMinutes?: SortOrder
    startedAt?: SortOrder
    expectedCompletionAt?: SortOrder
    completedAt?: SortOrder
    stoppedAt?: SortOrder
    completionType?: SortOrder
    reason?: SortOrder
    remarks?: SortOrder
    startedByName?: SortOrder
    authorizedByCode?: SortOrder
    authorizedByName?: SortOrder
    activeSlotContainerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingProcessMinOrderByAggregateInput = {
    id?: SortOrder
    processCode?: SortOrder
    containerId?: SortOrder
    status?: SortOrder
    durationMinutes?: SortOrder
    startedAt?: SortOrder
    expectedCompletionAt?: SortOrder
    completedAt?: SortOrder
    stoppedAt?: SortOrder
    completionType?: SortOrder
    reason?: SortOrder
    remarks?: SortOrder
    startedByName?: SortOrder
    authorizedByCode?: SortOrder
    authorizedByName?: SortOrder
    activeSlotContainerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingProcessSumOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    durationMinutes?: SortOrder
    activeSlotContainerId?: SortOrder
  }

  export type EnumTumblingProcessStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingProcessStatus | EnumTumblingProcessStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingProcessStatus[]
    notIn?: $Enums.TumblingProcessStatus[]
    not?: NestedEnumTumblingProcessStatusWithAggregatesFilter<$PrismaModel> | $Enums.TumblingProcessStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTumblingProcessStatusFilter<$PrismaModel>
    _max?: NestedEnumTumblingProcessStatusFilter<$PrismaModel>
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

  export type EnumTumblingCompletionTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingCompletionType | EnumTumblingCompletionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TumblingCompletionType[] | null
    notIn?: $Enums.TumblingCompletionType[] | null
    not?: NestedEnumTumblingCompletionTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TumblingCompletionType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
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

  export type TumblingConfigurationOrderByRelevanceInput = {
    fields: TumblingConfigurationOrderByRelevanceFieldEnum | TumblingConfigurationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TumblingConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    additionalFieldLabel?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingConfigurationAvgOrderByAggregateInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
  }

  export type TumblingConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    additionalFieldLabel?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    additionalFieldLabel?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumblingConfigurationSumOrderByAggregateInput = {
    id?: SortOrder
    defaultDurationMinutes?: SortOrder
    nearCompletionThresholdMinutes?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TumblingProcessCreateNestedManyWithoutContainerInput = {
    create?: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput> | TumblingProcessCreateWithoutContainerInput[] | TumblingProcessUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: TumblingProcessCreateOrConnectWithoutContainerInput | TumblingProcessCreateOrConnectWithoutContainerInput[]
    createMany?: TumblingProcessCreateManyContainerInputEnvelope
    connect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
  }

  export type TumblingProcessUncheckedCreateNestedManyWithoutContainerInput = {
    create?: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput> | TumblingProcessCreateWithoutContainerInput[] | TumblingProcessUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: TumblingProcessCreateOrConnectWithoutContainerInput | TumblingProcessCreateOrConnectWithoutContainerInput[]
    createMany?: TumblingProcessCreateManyContainerInputEnvelope
    connect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
  }

  export type EnumTumblingContainerSideFieldUpdateOperationsInput = {
    set?: $Enums.TumblingContainerSide
  }

  export type TumblingProcessUpdateManyWithoutContainerNestedInput = {
    create?: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput> | TumblingProcessCreateWithoutContainerInput[] | TumblingProcessUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: TumblingProcessCreateOrConnectWithoutContainerInput | TumblingProcessCreateOrConnectWithoutContainerInput[]
    upsert?: TumblingProcessUpsertWithWhereUniqueWithoutContainerInput | TumblingProcessUpsertWithWhereUniqueWithoutContainerInput[]
    createMany?: TumblingProcessCreateManyContainerInputEnvelope
    set?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    disconnect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    delete?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    connect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    update?: TumblingProcessUpdateWithWhereUniqueWithoutContainerInput | TumblingProcessUpdateWithWhereUniqueWithoutContainerInput[]
    updateMany?: TumblingProcessUpdateManyWithWhereWithoutContainerInput | TumblingProcessUpdateManyWithWhereWithoutContainerInput[]
    deleteMany?: TumblingProcessScalarWhereInput | TumblingProcessScalarWhereInput[]
  }

  export type TumblingProcessUncheckedUpdateManyWithoutContainerNestedInput = {
    create?: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput> | TumblingProcessCreateWithoutContainerInput[] | TumblingProcessUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: TumblingProcessCreateOrConnectWithoutContainerInput | TumblingProcessCreateOrConnectWithoutContainerInput[]
    upsert?: TumblingProcessUpsertWithWhereUniqueWithoutContainerInput | TumblingProcessUpsertWithWhereUniqueWithoutContainerInput[]
    createMany?: TumblingProcessCreateManyContainerInputEnvelope
    set?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    disconnect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    delete?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    connect?: TumblingProcessWhereUniqueInput | TumblingProcessWhereUniqueInput[]
    update?: TumblingProcessUpdateWithWhereUniqueWithoutContainerInput | TumblingProcessUpdateWithWhereUniqueWithoutContainerInput[]
    updateMany?: TumblingProcessUpdateManyWithWhereWithoutContainerInput | TumblingProcessUpdateManyWithWhereWithoutContainerInput[]
    deleteMany?: TumblingProcessScalarWhereInput | TumblingProcessScalarWhereInput[]
  }

  export type TumblingContainerCreateNestedOneWithoutProcessesInput = {
    create?: XOR<TumblingContainerCreateWithoutProcessesInput, TumblingContainerUncheckedCreateWithoutProcessesInput>
    connectOrCreate?: TumblingContainerCreateOrConnectWithoutProcessesInput
    connect?: TumblingContainerWhereUniqueInput
  }

  export type EnumTumblingProcessStatusFieldUpdateOperationsInput = {
    set?: $Enums.TumblingProcessStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TumblingCompletionType | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TumblingContainerUpdateOneRequiredWithoutProcessesNestedInput = {
    create?: XOR<TumblingContainerCreateWithoutProcessesInput, TumblingContainerUncheckedCreateWithoutProcessesInput>
    connectOrCreate?: TumblingContainerCreateOrConnectWithoutProcessesInput
    upsert?: TumblingContainerUpsertWithoutProcessesInput
    connect?: TumblingContainerWhereUniqueInput
    update?: XOR<XOR<TumblingContainerUpdateToOneWithWhereWithoutProcessesInput, TumblingContainerUpdateWithoutProcessesInput>, TumblingContainerUncheckedUpdateWithoutProcessesInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumTumblingContainerSideFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingContainerSide | EnumTumblingContainerSideFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingContainerSide[]
    notIn?: $Enums.TumblingContainerSide[]
    not?: NestedEnumTumblingContainerSideFilter<$PrismaModel> | $Enums.TumblingContainerSide
  }

  export type NestedEnumTumblingContainerSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingContainerSide | EnumTumblingContainerSideFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingContainerSide[]
    notIn?: $Enums.TumblingContainerSide[]
    not?: NestedEnumTumblingContainerSideWithAggregatesFilter<$PrismaModel> | $Enums.TumblingContainerSide
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTumblingContainerSideFilter<$PrismaModel>
    _max?: NestedEnumTumblingContainerSideFilter<$PrismaModel>
  }

  export type NestedEnumTumblingProcessStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingProcessStatus | EnumTumblingProcessStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingProcessStatus[]
    notIn?: $Enums.TumblingProcessStatus[]
    not?: NestedEnumTumblingProcessStatusFilter<$PrismaModel> | $Enums.TumblingProcessStatus
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

  export type NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingCompletionType | EnumTumblingCompletionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TumblingCompletionType[] | null
    notIn?: $Enums.TumblingCompletionType[] | null
    not?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel> | $Enums.TumblingCompletionType | null
  }

  export type NestedEnumTumblingProcessStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingProcessStatus | EnumTumblingProcessStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TumblingProcessStatus[]
    notIn?: $Enums.TumblingProcessStatus[]
    not?: NestedEnumTumblingProcessStatusWithAggregatesFilter<$PrismaModel> | $Enums.TumblingProcessStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTumblingProcessStatusFilter<$PrismaModel>
    _max?: NestedEnumTumblingProcessStatusFilter<$PrismaModel>
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

  export type NestedEnumTumblingCompletionTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TumblingCompletionType | EnumTumblingCompletionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TumblingCompletionType[] | null
    notIn?: $Enums.TumblingCompletionType[] | null
    not?: NestedEnumTumblingCompletionTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TumblingCompletionType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTumblingCompletionTypeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type TumblingProcessCreateWithoutContainerInput = {
    processCode: string
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingProcessUncheckedCreateWithoutContainerInput = {
    id?: number
    processCode: string
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingProcessCreateOrConnectWithoutContainerInput = {
    where: TumblingProcessWhereUniqueInput
    create: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput>
  }

  export type TumblingProcessCreateManyContainerInputEnvelope = {
    data: TumblingProcessCreateManyContainerInput | TumblingProcessCreateManyContainerInput[]
    skipDuplicates?: boolean
  }

  export type TumblingProcessUpsertWithWhereUniqueWithoutContainerInput = {
    where: TumblingProcessWhereUniqueInput
    update: XOR<TumblingProcessUpdateWithoutContainerInput, TumblingProcessUncheckedUpdateWithoutContainerInput>
    create: XOR<TumblingProcessCreateWithoutContainerInput, TumblingProcessUncheckedCreateWithoutContainerInput>
  }

  export type TumblingProcessUpdateWithWhereUniqueWithoutContainerInput = {
    where: TumblingProcessWhereUniqueInput
    data: XOR<TumblingProcessUpdateWithoutContainerInput, TumblingProcessUncheckedUpdateWithoutContainerInput>
  }

  export type TumblingProcessUpdateManyWithWhereWithoutContainerInput = {
    where: TumblingProcessScalarWhereInput
    data: XOR<TumblingProcessUpdateManyMutationInput, TumblingProcessUncheckedUpdateManyWithoutContainerInput>
  }

  export type TumblingProcessScalarWhereInput = {
    AND?: TumblingProcessScalarWhereInput | TumblingProcessScalarWhereInput[]
    OR?: TumblingProcessScalarWhereInput[]
    NOT?: TumblingProcessScalarWhereInput | TumblingProcessScalarWhereInput[]
    id?: IntFilter<"TumblingProcess"> | number
    processCode?: StringFilter<"TumblingProcess"> | string
    containerId?: IntFilter<"TumblingProcess"> | number
    status?: EnumTumblingProcessStatusFilter<"TumblingProcess"> | $Enums.TumblingProcessStatus
    durationMinutes?: IntFilter<"TumblingProcess"> | number
    startedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    expectedCompletionAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    stoppedAt?: DateTimeNullableFilter<"TumblingProcess"> | Date | string | null
    completionType?: EnumTumblingCompletionTypeNullableFilter<"TumblingProcess"> | $Enums.TumblingCompletionType | null
    reason?: StringNullableFilter<"TumblingProcess"> | string | null
    remarks?: StringNullableFilter<"TumblingProcess"> | string | null
    startedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByCode?: StringNullableFilter<"TumblingProcess"> | string | null
    authorizedByName?: StringNullableFilter<"TumblingProcess"> | string | null
    products?: JsonFilter<"TumblingProcess">
    events?: JsonFilter<"TumblingProcess">
    activeSlotContainerId?: IntNullableFilter<"TumblingProcess"> | number | null
    createdAt?: DateTimeFilter<"TumblingProcess"> | Date | string
    updatedAt?: DateTimeFilter<"TumblingProcess"> | Date | string
  }

  export type TumblingContainerCreateWithoutProcessesInput = {
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingContainerUncheckedCreateWithoutProcessesInput = {
    id?: number
    stationNumber: number
    side: $Enums.TumblingContainerSide
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingContainerCreateOrConnectWithoutProcessesInput = {
    where: TumblingContainerWhereUniqueInput
    create: XOR<TumblingContainerCreateWithoutProcessesInput, TumblingContainerUncheckedCreateWithoutProcessesInput>
  }

  export type TumblingContainerUpsertWithoutProcessesInput = {
    update: XOR<TumblingContainerUpdateWithoutProcessesInput, TumblingContainerUncheckedUpdateWithoutProcessesInput>
    create: XOR<TumblingContainerCreateWithoutProcessesInput, TumblingContainerUncheckedCreateWithoutProcessesInput>
    where?: TumblingContainerWhereInput
  }

  export type TumblingContainerUpdateToOneWithWhereWithoutProcessesInput = {
    where?: TumblingContainerWhereInput
    data: XOR<TumblingContainerUpdateWithoutProcessesInput, TumblingContainerUncheckedUpdateWithoutProcessesInput>
  }

  export type TumblingContainerUpdateWithoutProcessesInput = {
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingContainerUncheckedUpdateWithoutProcessesInput = {
    id?: IntFieldUpdateOperationsInput | number
    stationNumber?: IntFieldUpdateOperationsInput | number
    side?: EnumTumblingContainerSideFieldUpdateOperationsInput | $Enums.TumblingContainerSide
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessCreateManyContainerInput = {
    id?: number
    processCode: string
    status?: $Enums.TumblingProcessStatus
    durationMinutes?: number
    startedAt?: Date | string | null
    expectedCompletionAt?: Date | string | null
    completedAt?: Date | string | null
    stoppedAt?: Date | string | null
    completionType?: $Enums.TumblingCompletionType | null
    reason?: string | null
    remarks?: string | null
    startedByName?: string | null
    authorizedByCode?: string | null
    authorizedByName?: string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumblingProcessUpdateWithoutContainerInput = {
    processCode?: StringFieldUpdateOperationsInput | string
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessUncheckedUpdateWithoutContainerInput = {
    id?: IntFieldUpdateOperationsInput | number
    processCode?: StringFieldUpdateOperationsInput | string
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumblingProcessUncheckedUpdateManyWithoutContainerInput = {
    id?: IntFieldUpdateOperationsInput | number
    processCode?: StringFieldUpdateOperationsInput | string
    status?: EnumTumblingProcessStatusFieldUpdateOperationsInput | $Enums.TumblingProcessStatus
    durationMinutes?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expectedCompletionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stoppedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionType?: NullableEnumTumblingCompletionTypeFieldUpdateOperationsInput | $Enums.TumblingCompletionType | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    startedByName?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByCode?: NullableStringFieldUpdateOperationsInput | string | null
    authorizedByName?: NullableStringFieldUpdateOperationsInput | string | null
    products?: JsonNullValueInput | InputJsonValue
    events?: JsonNullValueInput | InputJsonValue
    activeSlotContainerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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