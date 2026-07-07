
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
    QcReason: 'QcReason'
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
      modelProps: "plating" | "fittingScan" | "qcScan" | "qcReason"
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


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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