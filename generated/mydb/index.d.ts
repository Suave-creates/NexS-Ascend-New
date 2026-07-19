
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ShippingMetadata
 * 
 */
export type ShippingMetadata = $Result.DefaultSelection<Prisma.$ShippingMetadataPayload>
/**
 * Model PackingScan
 * 
 */
export type PackingScan = $Result.DefaultSelection<Prisma.$PackingScanPayload>
/**
 * Model DispatchScan
 * 
 */
export type DispatchScan = $Result.DefaultSelection<Prisma.$DispatchScanPayload>
/**
 * Model OperationsMetadata
 * 
 */
export type OperationsMetadata = $Result.DefaultSelection<Prisma.$OperationsMetadataPayload>
/**
 * Model MaintenanceShopIssue
 * 
 */
export type MaintenanceShopIssue = $Result.DefaultSelection<Prisma.$MaintenanceShopIssuePayload>
/**
 * Model FastTrackScan
 * 
 */
export type FastTrackScan = $Result.DefaultSelection<Prisma.$FastTrackScanPayload>
/**
 * Model FR0Scan
 * 
 */
export type FR0Scan = $Result.DefaultSelection<Prisma.$FR0ScanPayload>
/**
 * Model BulkScan
 * 
 */
export type BulkScan = $Result.DefaultSelection<Prisma.$BulkScanPayload>
/**
 * Model ManualWarehouse
 * 
 */
export type ManualWarehouse = $Result.DefaultSelection<Prisma.$ManualWarehousePayload>
/**
 * Model EHSDeviation
 * 
 */
export type EHSDeviation = $Result.DefaultSelection<Prisma.$EHSDeviationPayload>
/**
 * Model CourierHandover
 * 
 */
export type CourierHandover = $Result.DefaultSelection<Prisma.$CourierHandoverPayload>
/**
 * Model MetalFrameFittingScan
 * 
 */
export type MetalFrameFittingScan = $Result.DefaultSelection<Prisma.$MetalFrameFittingScanPayload>
/**
 * Model OrderUpdateDashboardStudy
 * 
 */
export type OrderUpdateDashboardStudy = $Result.DefaultSelection<Prisma.$OrderUpdateDashboardStudyPayload>
/**
 * Model InventoryPID
 * 
 */
export type InventoryPID = $Result.DefaultSelection<Prisma.$InventoryPIDPayload>
/**
 * Model FR0BulkHOTO
 * 
 */
export type FR0BulkHOTO = $Result.DefaultSelection<Prisma.$FR0BulkHOTOPayload>
/**
 * Model ManualWarehouseSetUp
 * 
 */
export type ManualWarehouseSetUp = $Result.DefaultSelection<Prisma.$ManualWarehouseSetUpPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shippingMetadata`: Exposes CRUD operations for the **ShippingMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShippingMetadata
    * const shippingMetadata = await prisma.shippingMetadata.findMany()
    * ```
    */
  get shippingMetadata(): Prisma.ShippingMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.packingScan`: Exposes CRUD operations for the **PackingScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PackingScans
    * const packingScans = await prisma.packingScan.findMany()
    * ```
    */
  get packingScan(): Prisma.PackingScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dispatchScan`: Exposes CRUD operations for the **DispatchScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DispatchScans
    * const dispatchScans = await prisma.dispatchScan.findMany()
    * ```
    */
  get dispatchScan(): Prisma.DispatchScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.operationsMetadata`: Exposes CRUD operations for the **OperationsMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OperationsMetadata
    * const operationsMetadata = await prisma.operationsMetadata.findMany()
    * ```
    */
  get operationsMetadata(): Prisma.OperationsMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceShopIssue`: Exposes CRUD operations for the **MaintenanceShopIssue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceShopIssues
    * const maintenanceShopIssues = await prisma.maintenanceShopIssue.findMany()
    * ```
    */
  get maintenanceShopIssue(): Prisma.MaintenanceShopIssueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fastTrackScan`: Exposes CRUD operations for the **FastTrackScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FastTrackScans
    * const fastTrackScans = await prisma.fastTrackScan.findMany()
    * ```
    */
  get fastTrackScan(): Prisma.FastTrackScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fR0Scan`: Exposes CRUD operations for the **FR0Scan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FR0Scans
    * const fR0Scans = await prisma.fR0Scan.findMany()
    * ```
    */
  get fR0Scan(): Prisma.FR0ScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bulkScan`: Exposes CRUD operations for the **BulkScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BulkScans
    * const bulkScans = await prisma.bulkScan.findMany()
    * ```
    */
  get bulkScan(): Prisma.BulkScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manualWarehouse`: Exposes CRUD operations for the **ManualWarehouse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ManualWarehouses
    * const manualWarehouses = await prisma.manualWarehouse.findMany()
    * ```
    */
  get manualWarehouse(): Prisma.ManualWarehouseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eHSDeviation`: Exposes CRUD operations for the **EHSDeviation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EHSDeviations
    * const eHSDeviations = await prisma.eHSDeviation.findMany()
    * ```
    */
  get eHSDeviation(): Prisma.EHSDeviationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courierHandover`: Exposes CRUD operations for the **CourierHandover** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CourierHandovers
    * const courierHandovers = await prisma.courierHandover.findMany()
    * ```
    */
  get courierHandover(): Prisma.CourierHandoverDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metalFrameFittingScan`: Exposes CRUD operations for the **MetalFrameFittingScan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MetalFrameFittingScans
    * const metalFrameFittingScans = await prisma.metalFrameFittingScan.findMany()
    * ```
    */
  get metalFrameFittingScan(): Prisma.MetalFrameFittingScanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderUpdateDashboardStudy`: Exposes CRUD operations for the **OrderUpdateDashboardStudy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderUpdateDashboardStudies
    * const orderUpdateDashboardStudies = await prisma.orderUpdateDashboardStudy.findMany()
    * ```
    */
  get orderUpdateDashboardStudy(): Prisma.OrderUpdateDashboardStudyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryPID`: Exposes CRUD operations for the **InventoryPID** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryPIDS
    * const inventoryPIDS = await prisma.inventoryPID.findMany()
    * ```
    */
  get inventoryPID(): Prisma.InventoryPIDDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fR0BulkHOTO`: Exposes CRUD operations for the **FR0BulkHOTO** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FR0BulkHOTOS
    * const fR0BulkHOTOS = await prisma.fR0BulkHOTO.findMany()
    * ```
    */
  get fR0BulkHOTO(): Prisma.FR0BulkHOTODelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manualWarehouseSetUp`: Exposes CRUD operations for the **ManualWarehouseSetUp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ManualWarehouseSetUps
    * const manualWarehouseSetUps = await prisma.manualWarehouseSetUp.findMany()
    * ```
    */
  get manualWarehouseSetUp(): Prisma.ManualWarehouseSetUpDelegate<ExtArgs, ClientOptions>;
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
    User: 'User',
    ShippingMetadata: 'ShippingMetadata',
    PackingScan: 'PackingScan',
    DispatchScan: 'DispatchScan',
    OperationsMetadata: 'OperationsMetadata',
    MaintenanceShopIssue: 'MaintenanceShopIssue',
    FastTrackScan: 'FastTrackScan',
    FR0Scan: 'FR0Scan',
    BulkScan: 'BulkScan',
    ManualWarehouse: 'ManualWarehouse',
    EHSDeviation: 'EHSDeviation',
    CourierHandover: 'CourierHandover',
    MetalFrameFittingScan: 'MetalFrameFittingScan',
    OrderUpdateDashboardStudy: 'OrderUpdateDashboardStudy',
    InventoryPID: 'InventoryPID',
    FR0BulkHOTO: 'FR0BulkHOTO',
    ManualWarehouseSetUp: 'ManualWarehouseSetUp'
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
      modelProps: "user" | "shippingMetadata" | "packingScan" | "dispatchScan" | "operationsMetadata" | "maintenanceShopIssue" | "fastTrackScan" | "fR0Scan" | "bulkScan" | "manualWarehouse" | "eHSDeviation" | "courierHandover" | "metalFrameFittingScan" | "orderUpdateDashboardStudy" | "inventoryPID" | "fR0BulkHOTO" | "manualWarehouseSetUp"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ShippingMetadata: {
        payload: Prisma.$ShippingMetadataPayload<ExtArgs>
        fields: Prisma.ShippingMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShippingMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShippingMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          findFirst: {
            args: Prisma.ShippingMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShippingMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          findMany: {
            args: Prisma.ShippingMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>[]
          }
          create: {
            args: Prisma.ShippingMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          createMany: {
            args: Prisma.ShippingMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ShippingMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          update: {
            args: Prisma.ShippingMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          deleteMany: {
            args: Prisma.ShippingMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShippingMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShippingMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingMetadataPayload>
          }
          aggregate: {
            args: Prisma.ShippingMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShippingMetadata>
          }
          groupBy: {
            args: Prisma.ShippingMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShippingMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShippingMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<ShippingMetadataCountAggregateOutputType> | number
          }
        }
      }
      PackingScan: {
        payload: Prisma.$PackingScanPayload<ExtArgs>
        fields: Prisma.PackingScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PackingScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PackingScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          findFirst: {
            args: Prisma.PackingScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PackingScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          findMany: {
            args: Prisma.PackingScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>[]
          }
          create: {
            args: Prisma.PackingScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          createMany: {
            args: Prisma.PackingScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PackingScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          update: {
            args: Prisma.PackingScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          deleteMany: {
            args: Prisma.PackingScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PackingScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PackingScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackingScanPayload>
          }
          aggregate: {
            args: Prisma.PackingScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePackingScan>
          }
          groupBy: {
            args: Prisma.PackingScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PackingScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PackingScanCountArgs<ExtArgs>
            result: $Utils.Optional<PackingScanCountAggregateOutputType> | number
          }
        }
      }
      DispatchScan: {
        payload: Prisma.$DispatchScanPayload<ExtArgs>
        fields: Prisma.DispatchScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DispatchScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DispatchScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          findFirst: {
            args: Prisma.DispatchScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DispatchScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          findMany: {
            args: Prisma.DispatchScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>[]
          }
          create: {
            args: Prisma.DispatchScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          createMany: {
            args: Prisma.DispatchScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DispatchScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          update: {
            args: Prisma.DispatchScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          deleteMany: {
            args: Prisma.DispatchScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DispatchScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DispatchScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispatchScanPayload>
          }
          aggregate: {
            args: Prisma.DispatchScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDispatchScan>
          }
          groupBy: {
            args: Prisma.DispatchScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<DispatchScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.DispatchScanCountArgs<ExtArgs>
            result: $Utils.Optional<DispatchScanCountAggregateOutputType> | number
          }
        }
      }
      OperationsMetadata: {
        payload: Prisma.$OperationsMetadataPayload<ExtArgs>
        fields: Prisma.OperationsMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OperationsMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OperationsMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          findFirst: {
            args: Prisma.OperationsMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OperationsMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          findMany: {
            args: Prisma.OperationsMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>[]
          }
          create: {
            args: Prisma.OperationsMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          createMany: {
            args: Prisma.OperationsMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OperationsMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          update: {
            args: Prisma.OperationsMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          deleteMany: {
            args: Prisma.OperationsMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OperationsMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OperationsMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationsMetadataPayload>
          }
          aggregate: {
            args: Prisma.OperationsMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOperationsMetadata>
          }
          groupBy: {
            args: Prisma.OperationsMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<OperationsMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.OperationsMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<OperationsMetadataCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceShopIssue: {
        payload: Prisma.$MaintenanceShopIssuePayload<ExtArgs>
        fields: Prisma.MaintenanceShopIssueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceShopIssueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceShopIssueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          findFirst: {
            args: Prisma.MaintenanceShopIssueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceShopIssueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          findMany: {
            args: Prisma.MaintenanceShopIssueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>[]
          }
          create: {
            args: Prisma.MaintenanceShopIssueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          createMany: {
            args: Prisma.MaintenanceShopIssueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MaintenanceShopIssueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          update: {
            args: Prisma.MaintenanceShopIssueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceShopIssueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceShopIssueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MaintenanceShopIssueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceShopIssuePayload>
          }
          aggregate: {
            args: Prisma.MaintenanceShopIssueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceShopIssue>
          }
          groupBy: {
            args: Prisma.MaintenanceShopIssueGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceShopIssueGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceShopIssueCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceShopIssueCountAggregateOutputType> | number
          }
        }
      }
      FastTrackScan: {
        payload: Prisma.$FastTrackScanPayload<ExtArgs>
        fields: Prisma.FastTrackScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FastTrackScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FastTrackScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          findFirst: {
            args: Prisma.FastTrackScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FastTrackScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          findMany: {
            args: Prisma.FastTrackScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>[]
          }
          create: {
            args: Prisma.FastTrackScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          createMany: {
            args: Prisma.FastTrackScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FastTrackScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          update: {
            args: Prisma.FastTrackScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          deleteMany: {
            args: Prisma.FastTrackScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FastTrackScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FastTrackScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FastTrackScanPayload>
          }
          aggregate: {
            args: Prisma.FastTrackScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFastTrackScan>
          }
          groupBy: {
            args: Prisma.FastTrackScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FastTrackScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FastTrackScanCountArgs<ExtArgs>
            result: $Utils.Optional<FastTrackScanCountAggregateOutputType> | number
          }
        }
      }
      FR0Scan: {
        payload: Prisma.$FR0ScanPayload<ExtArgs>
        fields: Prisma.FR0ScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FR0ScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FR0ScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          findFirst: {
            args: Prisma.FR0ScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FR0ScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          findMany: {
            args: Prisma.FR0ScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>[]
          }
          create: {
            args: Prisma.FR0ScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          createMany: {
            args: Prisma.FR0ScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FR0ScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          update: {
            args: Prisma.FR0ScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          deleteMany: {
            args: Prisma.FR0ScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FR0ScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FR0ScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0ScanPayload>
          }
          aggregate: {
            args: Prisma.FR0ScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFR0Scan>
          }
          groupBy: {
            args: Prisma.FR0ScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FR0ScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FR0ScanCountArgs<ExtArgs>
            result: $Utils.Optional<FR0ScanCountAggregateOutputType> | number
          }
        }
      }
      BulkScan: {
        payload: Prisma.$BulkScanPayload<ExtArgs>
        fields: Prisma.BulkScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BulkScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BulkScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          findFirst: {
            args: Prisma.BulkScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BulkScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          findMany: {
            args: Prisma.BulkScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>[]
          }
          create: {
            args: Prisma.BulkScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          createMany: {
            args: Prisma.BulkScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BulkScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          update: {
            args: Prisma.BulkScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          deleteMany: {
            args: Prisma.BulkScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BulkScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BulkScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkScanPayload>
          }
          aggregate: {
            args: Prisma.BulkScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBulkScan>
          }
          groupBy: {
            args: Prisma.BulkScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<BulkScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.BulkScanCountArgs<ExtArgs>
            result: $Utils.Optional<BulkScanCountAggregateOutputType> | number
          }
        }
      }
      ManualWarehouse: {
        payload: Prisma.$ManualWarehousePayload<ExtArgs>
        fields: Prisma.ManualWarehouseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManualWarehouseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManualWarehouseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          findFirst: {
            args: Prisma.ManualWarehouseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManualWarehouseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          findMany: {
            args: Prisma.ManualWarehouseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>[]
          }
          create: {
            args: Prisma.ManualWarehouseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          createMany: {
            args: Prisma.ManualWarehouseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ManualWarehouseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          update: {
            args: Prisma.ManualWarehouseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          deleteMany: {
            args: Prisma.ManualWarehouseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManualWarehouseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ManualWarehouseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehousePayload>
          }
          aggregate: {
            args: Prisma.ManualWarehouseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManualWarehouse>
          }
          groupBy: {
            args: Prisma.ManualWarehouseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManualWarehouseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManualWarehouseCountArgs<ExtArgs>
            result: $Utils.Optional<ManualWarehouseCountAggregateOutputType> | number
          }
        }
      }
      EHSDeviation: {
        payload: Prisma.$EHSDeviationPayload<ExtArgs>
        fields: Prisma.EHSDeviationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EHSDeviationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EHSDeviationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          findFirst: {
            args: Prisma.EHSDeviationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EHSDeviationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          findMany: {
            args: Prisma.EHSDeviationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>[]
          }
          create: {
            args: Prisma.EHSDeviationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          createMany: {
            args: Prisma.EHSDeviationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EHSDeviationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          update: {
            args: Prisma.EHSDeviationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          deleteMany: {
            args: Prisma.EHSDeviationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EHSDeviationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EHSDeviationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EHSDeviationPayload>
          }
          aggregate: {
            args: Prisma.EHSDeviationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEHSDeviation>
          }
          groupBy: {
            args: Prisma.EHSDeviationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EHSDeviationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EHSDeviationCountArgs<ExtArgs>
            result: $Utils.Optional<EHSDeviationCountAggregateOutputType> | number
          }
        }
      }
      CourierHandover: {
        payload: Prisma.$CourierHandoverPayload<ExtArgs>
        fields: Prisma.CourierHandoverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourierHandoverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourierHandoverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          findFirst: {
            args: Prisma.CourierHandoverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourierHandoverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          findMany: {
            args: Prisma.CourierHandoverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>[]
          }
          create: {
            args: Prisma.CourierHandoverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          createMany: {
            args: Prisma.CourierHandoverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CourierHandoverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          update: {
            args: Prisma.CourierHandoverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          deleteMany: {
            args: Prisma.CourierHandoverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourierHandoverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CourierHandoverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourierHandoverPayload>
          }
          aggregate: {
            args: Prisma.CourierHandoverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourierHandover>
          }
          groupBy: {
            args: Prisma.CourierHandoverGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourierHandoverGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourierHandoverCountArgs<ExtArgs>
            result: $Utils.Optional<CourierHandoverCountAggregateOutputType> | number
          }
        }
      }
      MetalFrameFittingScan: {
        payload: Prisma.$MetalFrameFittingScanPayload<ExtArgs>
        fields: Prisma.MetalFrameFittingScanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetalFrameFittingScanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetalFrameFittingScanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          findFirst: {
            args: Prisma.MetalFrameFittingScanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetalFrameFittingScanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          findMany: {
            args: Prisma.MetalFrameFittingScanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>[]
          }
          create: {
            args: Prisma.MetalFrameFittingScanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          createMany: {
            args: Prisma.MetalFrameFittingScanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MetalFrameFittingScanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          update: {
            args: Prisma.MetalFrameFittingScanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          deleteMany: {
            args: Prisma.MetalFrameFittingScanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetalFrameFittingScanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MetalFrameFittingScanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetalFrameFittingScanPayload>
          }
          aggregate: {
            args: Prisma.MetalFrameFittingScanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetalFrameFittingScan>
          }
          groupBy: {
            args: Prisma.MetalFrameFittingScanGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetalFrameFittingScanGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetalFrameFittingScanCountArgs<ExtArgs>
            result: $Utils.Optional<MetalFrameFittingScanCountAggregateOutputType> | number
          }
        }
      }
      OrderUpdateDashboardStudy: {
        payload: Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>
        fields: Prisma.OrderUpdateDashboardStudyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderUpdateDashboardStudyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderUpdateDashboardStudyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          findFirst: {
            args: Prisma.OrderUpdateDashboardStudyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderUpdateDashboardStudyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          findMany: {
            args: Prisma.OrderUpdateDashboardStudyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>[]
          }
          create: {
            args: Prisma.OrderUpdateDashboardStudyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          createMany: {
            args: Prisma.OrderUpdateDashboardStudyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OrderUpdateDashboardStudyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          update: {
            args: Prisma.OrderUpdateDashboardStudyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          deleteMany: {
            args: Prisma.OrderUpdateDashboardStudyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateDashboardStudyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpdateDashboardStudyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderUpdateDashboardStudyPayload>
          }
          aggregate: {
            args: Prisma.OrderUpdateDashboardStudyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderUpdateDashboardStudy>
          }
          groupBy: {
            args: Prisma.OrderUpdateDashboardStudyGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderUpdateDashboardStudyGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderUpdateDashboardStudyCountArgs<ExtArgs>
            result: $Utils.Optional<OrderUpdateDashboardStudyCountAggregateOutputType> | number
          }
        }
      }
      InventoryPID: {
        payload: Prisma.$InventoryPIDPayload<ExtArgs>
        fields: Prisma.InventoryPIDFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryPIDFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryPIDFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          findFirst: {
            args: Prisma.InventoryPIDFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryPIDFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          findMany: {
            args: Prisma.InventoryPIDFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>[]
          }
          create: {
            args: Prisma.InventoryPIDCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          createMany: {
            args: Prisma.InventoryPIDCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InventoryPIDDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          update: {
            args: Prisma.InventoryPIDUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          deleteMany: {
            args: Prisma.InventoryPIDDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryPIDUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryPIDUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPIDPayload>
          }
          aggregate: {
            args: Prisma.InventoryPIDAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryPID>
          }
          groupBy: {
            args: Prisma.InventoryPIDGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryPIDGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryPIDCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryPIDCountAggregateOutputType> | number
          }
        }
      }
      FR0BulkHOTO: {
        payload: Prisma.$FR0BulkHOTOPayload<ExtArgs>
        fields: Prisma.FR0BulkHOTOFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FR0BulkHOTOFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FR0BulkHOTOFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          findFirst: {
            args: Prisma.FR0BulkHOTOFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FR0BulkHOTOFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          findMany: {
            args: Prisma.FR0BulkHOTOFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>[]
          }
          create: {
            args: Prisma.FR0BulkHOTOCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          createMany: {
            args: Prisma.FR0BulkHOTOCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FR0BulkHOTODeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          update: {
            args: Prisma.FR0BulkHOTOUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          deleteMany: {
            args: Prisma.FR0BulkHOTODeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FR0BulkHOTOUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FR0BulkHOTOUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FR0BulkHOTOPayload>
          }
          aggregate: {
            args: Prisma.FR0BulkHOTOAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFR0BulkHOTO>
          }
          groupBy: {
            args: Prisma.FR0BulkHOTOGroupByArgs<ExtArgs>
            result: $Utils.Optional<FR0BulkHOTOGroupByOutputType>[]
          }
          count: {
            args: Prisma.FR0BulkHOTOCountArgs<ExtArgs>
            result: $Utils.Optional<FR0BulkHOTOCountAggregateOutputType> | number
          }
        }
      }
      ManualWarehouseSetUp: {
        payload: Prisma.$ManualWarehouseSetUpPayload<ExtArgs>
        fields: Prisma.ManualWarehouseSetUpFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManualWarehouseSetUpFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManualWarehouseSetUpFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          findFirst: {
            args: Prisma.ManualWarehouseSetUpFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManualWarehouseSetUpFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          findMany: {
            args: Prisma.ManualWarehouseSetUpFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>[]
          }
          create: {
            args: Prisma.ManualWarehouseSetUpCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          createMany: {
            args: Prisma.ManualWarehouseSetUpCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ManualWarehouseSetUpDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          update: {
            args: Prisma.ManualWarehouseSetUpUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          deleteMany: {
            args: Prisma.ManualWarehouseSetUpDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManualWarehouseSetUpUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ManualWarehouseSetUpUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManualWarehouseSetUpPayload>
          }
          aggregate: {
            args: Prisma.ManualWarehouseSetUpAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManualWarehouseSetUp>
          }
          groupBy: {
            args: Prisma.ManualWarehouseSetUpGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManualWarehouseSetUpGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManualWarehouseSetUpCountArgs<ExtArgs>
            result: $Utils.Optional<ManualWarehouseSetUpCountAggregateOutputType> | number
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
    user?: UserOmit
    shippingMetadata?: ShippingMetadataOmit
    packingScan?: PackingScanOmit
    dispatchScan?: DispatchScanOmit
    operationsMetadata?: OperationsMetadataOmit
    maintenanceShopIssue?: MaintenanceShopIssueOmit
    fastTrackScan?: FastTrackScanOmit
    fR0Scan?: FR0ScanOmit
    bulkScan?: BulkScanOmit
    manualWarehouse?: ManualWarehouseOmit
    eHSDeviation?: EHSDeviationOmit
    courierHandover?: CourierHandoverOmit
    metalFrameFittingScan?: MetalFrameFittingScanOmit
    orderUpdateDashboardStudy?: OrderUpdateDashboardStudyOmit
    inventoryPID?: InventoryPIDOmit
    fR0BulkHOTO?: FR0BulkHOTOOmit
    manualWarehouseSetUp?: ManualWarehouseSetUpOmit
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
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    employeeCode: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    employeeCode: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    employeeCode: number
    passwordHash: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    employeeCode?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    employeeCode?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    employeeCode?: true
    passwordHash?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    employeeCode: string
    passwordHash: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeCode?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    employeeCode?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employeeCode" | "passwordHash" | "createdAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employeeCode: string
      passwordHash: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly employeeCode: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model ShippingMetadata
   */

  export type AggregateShippingMetadata = {
    _count: ShippingMetadataCountAggregateOutputType | null
    _avg: ShippingMetadataAvgAggregateOutputType | null
    _sum: ShippingMetadataSumAggregateOutputType | null
    _min: ShippingMetadataMinAggregateOutputType | null
    _max: ShippingMetadataMaxAggregateOutputType | null
  }

  export type ShippingMetadataAvgAggregateOutputType = {
    id: number | null
  }

  export type ShippingMetadataSumAggregateOutputType = {
    id: number | null
  }

  export type ShippingMetadataMinAggregateOutputType = {
    id: number | null
    shippingID: string | null
    city: string | null
  }

  export type ShippingMetadataMaxAggregateOutputType = {
    id: number | null
    shippingID: string | null
    city: string | null
  }

  export type ShippingMetadataCountAggregateOutputType = {
    id: number
    shippingID: number
    city: number
    _all: number
  }


  export type ShippingMetadataAvgAggregateInputType = {
    id?: true
  }

  export type ShippingMetadataSumAggregateInputType = {
    id?: true
  }

  export type ShippingMetadataMinAggregateInputType = {
    id?: true
    shippingID?: true
    city?: true
  }

  export type ShippingMetadataMaxAggregateInputType = {
    id?: true
    shippingID?: true
    city?: true
  }

  export type ShippingMetadataCountAggregateInputType = {
    id?: true
    shippingID?: true
    city?: true
    _all?: true
  }

  export type ShippingMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingMetadata to aggregate.
     */
    where?: ShippingMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingMetadata to fetch.
     */
    orderBy?: ShippingMetadataOrderByWithRelationInput | ShippingMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShippingMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShippingMetadata
    **/
    _count?: true | ShippingMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShippingMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShippingMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShippingMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShippingMetadataMaxAggregateInputType
  }

  export type GetShippingMetadataAggregateType<T extends ShippingMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateShippingMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShippingMetadata[P]>
      : GetScalarType<T[P], AggregateShippingMetadata[P]>
  }




  export type ShippingMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingMetadataWhereInput
    orderBy?: ShippingMetadataOrderByWithAggregationInput | ShippingMetadataOrderByWithAggregationInput[]
    by: ShippingMetadataScalarFieldEnum[] | ShippingMetadataScalarFieldEnum
    having?: ShippingMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShippingMetadataCountAggregateInputType | true
    _avg?: ShippingMetadataAvgAggregateInputType
    _sum?: ShippingMetadataSumAggregateInputType
    _min?: ShippingMetadataMinAggregateInputType
    _max?: ShippingMetadataMaxAggregateInputType
  }

  export type ShippingMetadataGroupByOutputType = {
    id: number
    shippingID: string
    city: string
    _count: ShippingMetadataCountAggregateOutputType | null
    _avg: ShippingMetadataAvgAggregateOutputType | null
    _sum: ShippingMetadataSumAggregateOutputType | null
    _min: ShippingMetadataMinAggregateOutputType | null
    _max: ShippingMetadataMaxAggregateOutputType | null
  }

  type GetShippingMetadataGroupByPayload<T extends ShippingMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShippingMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShippingMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShippingMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], ShippingMetadataGroupByOutputType[P]>
        }
      >
    >


  export type ShippingMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shippingID?: boolean
    city?: boolean
  }, ExtArgs["result"]["shippingMetadata"]>



  export type ShippingMetadataSelectScalar = {
    id?: boolean
    shippingID?: boolean
    city?: boolean
  }

  export type ShippingMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shippingID" | "city", ExtArgs["result"]["shippingMetadata"]>

  export type $ShippingMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShippingMetadata"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      shippingID: string
      city: string
    }, ExtArgs["result"]["shippingMetadata"]>
    composites: {}
  }

  type ShippingMetadataGetPayload<S extends boolean | null | undefined | ShippingMetadataDefaultArgs> = $Result.GetResult<Prisma.$ShippingMetadataPayload, S>

  type ShippingMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShippingMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShippingMetadataCountAggregateInputType | true
    }

  export interface ShippingMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShippingMetadata'], meta: { name: 'ShippingMetadata' } }
    /**
     * Find zero or one ShippingMetadata that matches the filter.
     * @param {ShippingMetadataFindUniqueArgs} args - Arguments to find a ShippingMetadata
     * @example
     * // Get one ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShippingMetadataFindUniqueArgs>(args: SelectSubset<T, ShippingMetadataFindUniqueArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShippingMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShippingMetadataFindUniqueOrThrowArgs} args - Arguments to find a ShippingMetadata
     * @example
     * // Get one ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShippingMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, ShippingMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataFindFirstArgs} args - Arguments to find a ShippingMetadata
     * @example
     * // Get one ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShippingMetadataFindFirstArgs>(args?: SelectSubset<T, ShippingMetadataFindFirstArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataFindFirstOrThrowArgs} args - Arguments to find a ShippingMetadata
     * @example
     * // Get one ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShippingMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, ShippingMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShippingMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findMany()
     * 
     * // Get first 10 ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shippingMetadataWithIdOnly = await prisma.shippingMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShippingMetadataFindManyArgs>(args?: SelectSubset<T, ShippingMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShippingMetadata.
     * @param {ShippingMetadataCreateArgs} args - Arguments to create a ShippingMetadata.
     * @example
     * // Create one ShippingMetadata
     * const ShippingMetadata = await prisma.shippingMetadata.create({
     *   data: {
     *     // ... data to create a ShippingMetadata
     *   }
     * })
     * 
     */
    create<T extends ShippingMetadataCreateArgs>(args: SelectSubset<T, ShippingMetadataCreateArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShippingMetadata.
     * @param {ShippingMetadataCreateManyArgs} args - Arguments to create many ShippingMetadata.
     * @example
     * // Create many ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShippingMetadataCreateManyArgs>(args?: SelectSubset<T, ShippingMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ShippingMetadata.
     * @param {ShippingMetadataDeleteArgs} args - Arguments to delete one ShippingMetadata.
     * @example
     * // Delete one ShippingMetadata
     * const ShippingMetadata = await prisma.shippingMetadata.delete({
     *   where: {
     *     // ... filter to delete one ShippingMetadata
     *   }
     * })
     * 
     */
    delete<T extends ShippingMetadataDeleteArgs>(args: SelectSubset<T, ShippingMetadataDeleteArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShippingMetadata.
     * @param {ShippingMetadataUpdateArgs} args - Arguments to update one ShippingMetadata.
     * @example
     * // Update one ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShippingMetadataUpdateArgs>(args: SelectSubset<T, ShippingMetadataUpdateArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShippingMetadata.
     * @param {ShippingMetadataDeleteManyArgs} args - Arguments to filter ShippingMetadata to delete.
     * @example
     * // Delete a few ShippingMetadata
     * const { count } = await prisma.shippingMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShippingMetadataDeleteManyArgs>(args?: SelectSubset<T, ShippingMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShippingMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShippingMetadataUpdateManyArgs>(args: SelectSubset<T, ShippingMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ShippingMetadata.
     * @param {ShippingMetadataUpsertArgs} args - Arguments to update or create a ShippingMetadata.
     * @example
     * // Update or create a ShippingMetadata
     * const shippingMetadata = await prisma.shippingMetadata.upsert({
     *   create: {
     *     // ... data to create a ShippingMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShippingMetadata we want to update
     *   }
     * })
     */
    upsert<T extends ShippingMetadataUpsertArgs>(args: SelectSubset<T, ShippingMetadataUpsertArgs<ExtArgs>>): Prisma__ShippingMetadataClient<$Result.GetResult<Prisma.$ShippingMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShippingMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataCountArgs} args - Arguments to filter ShippingMetadata to count.
     * @example
     * // Count the number of ShippingMetadata
     * const count = await prisma.shippingMetadata.count({
     *   where: {
     *     // ... the filter for the ShippingMetadata we want to count
     *   }
     * })
    **/
    count<T extends ShippingMetadataCountArgs>(
      args?: Subset<T, ShippingMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShippingMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShippingMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ShippingMetadataAggregateArgs>(args: Subset<T, ShippingMetadataAggregateArgs>): Prisma.PrismaPromise<GetShippingMetadataAggregateType<T>>

    /**
     * Group by ShippingMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingMetadataGroupByArgs} args - Group by arguments.
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
      T extends ShippingMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShippingMetadataGroupByArgs['orderBy'] }
        : { orderBy?: ShippingMetadataGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ShippingMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShippingMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShippingMetadata model
   */
  readonly fields: ShippingMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShippingMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShippingMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ShippingMetadata model
   */
  interface ShippingMetadataFieldRefs {
    readonly id: FieldRef<"ShippingMetadata", 'Int'>
    readonly shippingID: FieldRef<"ShippingMetadata", 'String'>
    readonly city: FieldRef<"ShippingMetadata", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ShippingMetadata findUnique
   */
  export type ShippingMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter, which ShippingMetadata to fetch.
     */
    where: ShippingMetadataWhereUniqueInput
  }

  /**
   * ShippingMetadata findUniqueOrThrow
   */
  export type ShippingMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter, which ShippingMetadata to fetch.
     */
    where: ShippingMetadataWhereUniqueInput
  }

  /**
   * ShippingMetadata findFirst
   */
  export type ShippingMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter, which ShippingMetadata to fetch.
     */
    where?: ShippingMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingMetadata to fetch.
     */
    orderBy?: ShippingMetadataOrderByWithRelationInput | ShippingMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingMetadata.
     */
    cursor?: ShippingMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingMetadata.
     */
    distinct?: ShippingMetadataScalarFieldEnum | ShippingMetadataScalarFieldEnum[]
  }

  /**
   * ShippingMetadata findFirstOrThrow
   */
  export type ShippingMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter, which ShippingMetadata to fetch.
     */
    where?: ShippingMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingMetadata to fetch.
     */
    orderBy?: ShippingMetadataOrderByWithRelationInput | ShippingMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingMetadata.
     */
    cursor?: ShippingMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingMetadata.
     */
    distinct?: ShippingMetadataScalarFieldEnum | ShippingMetadataScalarFieldEnum[]
  }

  /**
   * ShippingMetadata findMany
   */
  export type ShippingMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter, which ShippingMetadata to fetch.
     */
    where?: ShippingMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingMetadata to fetch.
     */
    orderBy?: ShippingMetadataOrderByWithRelationInput | ShippingMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShippingMetadata.
     */
    cursor?: ShippingMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingMetadata.
     */
    skip?: number
    distinct?: ShippingMetadataScalarFieldEnum | ShippingMetadataScalarFieldEnum[]
  }

  /**
   * ShippingMetadata create
   */
  export type ShippingMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * The data needed to create a ShippingMetadata.
     */
    data: XOR<ShippingMetadataCreateInput, ShippingMetadataUncheckedCreateInput>
  }

  /**
   * ShippingMetadata createMany
   */
  export type ShippingMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShippingMetadata.
     */
    data: ShippingMetadataCreateManyInput | ShippingMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShippingMetadata update
   */
  export type ShippingMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * The data needed to update a ShippingMetadata.
     */
    data: XOR<ShippingMetadataUpdateInput, ShippingMetadataUncheckedUpdateInput>
    /**
     * Choose, which ShippingMetadata to update.
     */
    where: ShippingMetadataWhereUniqueInput
  }

  /**
   * ShippingMetadata updateMany
   */
  export type ShippingMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShippingMetadata.
     */
    data: XOR<ShippingMetadataUpdateManyMutationInput, ShippingMetadataUncheckedUpdateManyInput>
    /**
     * Filter which ShippingMetadata to update
     */
    where?: ShippingMetadataWhereInput
    /**
     * Limit how many ShippingMetadata to update.
     */
    limit?: number
  }

  /**
   * ShippingMetadata upsert
   */
  export type ShippingMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * The filter to search for the ShippingMetadata to update in case it exists.
     */
    where: ShippingMetadataWhereUniqueInput
    /**
     * In case the ShippingMetadata found by the `where` argument doesn't exist, create a new ShippingMetadata with this data.
     */
    create: XOR<ShippingMetadataCreateInput, ShippingMetadataUncheckedCreateInput>
    /**
     * In case the ShippingMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShippingMetadataUpdateInput, ShippingMetadataUncheckedUpdateInput>
  }

  /**
   * ShippingMetadata delete
   */
  export type ShippingMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
    /**
     * Filter which ShippingMetadata to delete.
     */
    where: ShippingMetadataWhereUniqueInput
  }

  /**
   * ShippingMetadata deleteMany
   */
  export type ShippingMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingMetadata to delete
     */
    where?: ShippingMetadataWhereInput
    /**
     * Limit how many ShippingMetadata to delete.
     */
    limit?: number
  }

  /**
   * ShippingMetadata without action
   */
  export type ShippingMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingMetadata
     */
    select?: ShippingMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingMetadata
     */
    omit?: ShippingMetadataOmit<ExtArgs> | null
  }


  /**
   * Model PackingScan
   */

  export type AggregatePackingScan = {
    _count: PackingScanCountAggregateOutputType | null
    _avg: PackingScanAvgAggregateOutputType | null
    _sum: PackingScanSumAggregateOutputType | null
    _min: PackingScanMinAggregateOutputType | null
    _max: PackingScanMaxAggregateOutputType | null
  }

  export type PackingScanAvgAggregateOutputType = {
    id: number | null
  }

  export type PackingScanSumAggregateOutputType = {
    id: number | null
  }

  export type PackingScanMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type PackingScanMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type PackingScanCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    timestamp: number
    _all: number
  }


  export type PackingScanAvgAggregateInputType = {
    id?: true
  }

  export type PackingScanSumAggregateInputType = {
    id?: true
  }

  export type PackingScanMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type PackingScanMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type PackingScanCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
    _all?: true
  }

  export type PackingScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PackingScan to aggregate.
     */
    where?: PackingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackingScans to fetch.
     */
    orderBy?: PackingScanOrderByWithRelationInput | PackingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PackingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PackingScans
    **/
    _count?: true | PackingScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PackingScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PackingScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PackingScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PackingScanMaxAggregateInputType
  }

  export type GetPackingScanAggregateType<T extends PackingScanAggregateArgs> = {
        [P in keyof T & keyof AggregatePackingScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePackingScan[P]>
      : GetScalarType<T[P], AggregatePackingScan[P]>
  }




  export type PackingScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackingScanWhereInput
    orderBy?: PackingScanOrderByWithAggregationInput | PackingScanOrderByWithAggregationInput[]
    by: PackingScanScalarFieldEnum[] | PackingScanScalarFieldEnum
    having?: PackingScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PackingScanCountAggregateInputType | true
    _avg?: PackingScanAvgAggregateInputType
    _sum?: PackingScanSumAggregateInputType
    _min?: PackingScanMinAggregateInputType
    _max?: PackingScanMaxAggregateInputType
  }

  export type PackingScanGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp: Date
    _count: PackingScanCountAggregateOutputType | null
    _avg: PackingScanAvgAggregateOutputType | null
    _sum: PackingScanSumAggregateOutputType | null
    _min: PackingScanMinAggregateOutputType | null
    _max: PackingScanMaxAggregateOutputType | null
  }

  type GetPackingScanGroupByPayload<T extends PackingScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PackingScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PackingScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PackingScanGroupByOutputType[P]>
            : GetScalarType<T[P], PackingScanGroupByOutputType[P]>
        }
      >
    >


  export type PackingScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["packingScan"]>



  export type PackingScanSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }

  export type PackingScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "timestamp", ExtArgs["result"]["packingScan"]>

  export type $PackingScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PackingScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      timestamp: Date
    }, ExtArgs["result"]["packingScan"]>
    composites: {}
  }

  type PackingScanGetPayload<S extends boolean | null | undefined | PackingScanDefaultArgs> = $Result.GetResult<Prisma.$PackingScanPayload, S>

  type PackingScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PackingScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PackingScanCountAggregateInputType | true
    }

  export interface PackingScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PackingScan'], meta: { name: 'PackingScan' } }
    /**
     * Find zero or one PackingScan that matches the filter.
     * @param {PackingScanFindUniqueArgs} args - Arguments to find a PackingScan
     * @example
     * // Get one PackingScan
     * const packingScan = await prisma.packingScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PackingScanFindUniqueArgs>(args: SelectSubset<T, PackingScanFindUniqueArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PackingScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PackingScanFindUniqueOrThrowArgs} args - Arguments to find a PackingScan
     * @example
     * // Get one PackingScan
     * const packingScan = await prisma.packingScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PackingScanFindUniqueOrThrowArgs>(args: SelectSubset<T, PackingScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PackingScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanFindFirstArgs} args - Arguments to find a PackingScan
     * @example
     * // Get one PackingScan
     * const packingScan = await prisma.packingScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PackingScanFindFirstArgs>(args?: SelectSubset<T, PackingScanFindFirstArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PackingScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanFindFirstOrThrowArgs} args - Arguments to find a PackingScan
     * @example
     * // Get one PackingScan
     * const packingScan = await prisma.packingScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PackingScanFindFirstOrThrowArgs>(args?: SelectSubset<T, PackingScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PackingScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PackingScans
     * const packingScans = await prisma.packingScan.findMany()
     * 
     * // Get first 10 PackingScans
     * const packingScans = await prisma.packingScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const packingScanWithIdOnly = await prisma.packingScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PackingScanFindManyArgs>(args?: SelectSubset<T, PackingScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PackingScan.
     * @param {PackingScanCreateArgs} args - Arguments to create a PackingScan.
     * @example
     * // Create one PackingScan
     * const PackingScan = await prisma.packingScan.create({
     *   data: {
     *     // ... data to create a PackingScan
     *   }
     * })
     * 
     */
    create<T extends PackingScanCreateArgs>(args: SelectSubset<T, PackingScanCreateArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PackingScans.
     * @param {PackingScanCreateManyArgs} args - Arguments to create many PackingScans.
     * @example
     * // Create many PackingScans
     * const packingScan = await prisma.packingScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PackingScanCreateManyArgs>(args?: SelectSubset<T, PackingScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PackingScan.
     * @param {PackingScanDeleteArgs} args - Arguments to delete one PackingScan.
     * @example
     * // Delete one PackingScan
     * const PackingScan = await prisma.packingScan.delete({
     *   where: {
     *     // ... filter to delete one PackingScan
     *   }
     * })
     * 
     */
    delete<T extends PackingScanDeleteArgs>(args: SelectSubset<T, PackingScanDeleteArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PackingScan.
     * @param {PackingScanUpdateArgs} args - Arguments to update one PackingScan.
     * @example
     * // Update one PackingScan
     * const packingScan = await prisma.packingScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PackingScanUpdateArgs>(args: SelectSubset<T, PackingScanUpdateArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PackingScans.
     * @param {PackingScanDeleteManyArgs} args - Arguments to filter PackingScans to delete.
     * @example
     * // Delete a few PackingScans
     * const { count } = await prisma.packingScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PackingScanDeleteManyArgs>(args?: SelectSubset<T, PackingScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PackingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PackingScans
     * const packingScan = await prisma.packingScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PackingScanUpdateManyArgs>(args: SelectSubset<T, PackingScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PackingScan.
     * @param {PackingScanUpsertArgs} args - Arguments to update or create a PackingScan.
     * @example
     * // Update or create a PackingScan
     * const packingScan = await prisma.packingScan.upsert({
     *   create: {
     *     // ... data to create a PackingScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PackingScan we want to update
     *   }
     * })
     */
    upsert<T extends PackingScanUpsertArgs>(args: SelectSubset<T, PackingScanUpsertArgs<ExtArgs>>): Prisma__PackingScanClient<$Result.GetResult<Prisma.$PackingScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PackingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanCountArgs} args - Arguments to filter PackingScans to count.
     * @example
     * // Count the number of PackingScans
     * const count = await prisma.packingScan.count({
     *   where: {
     *     // ... the filter for the PackingScans we want to count
     *   }
     * })
    **/
    count<T extends PackingScanCountArgs>(
      args?: Subset<T, PackingScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PackingScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PackingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PackingScanAggregateArgs>(args: Subset<T, PackingScanAggregateArgs>): Prisma.PrismaPromise<GetPackingScanAggregateType<T>>

    /**
     * Group by PackingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackingScanGroupByArgs} args - Group by arguments.
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
      T extends PackingScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PackingScanGroupByArgs['orderBy'] }
        : { orderBy?: PackingScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PackingScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackingScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PackingScan model
   */
  readonly fields: PackingScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PackingScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PackingScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PackingScan model
   */
  interface PackingScanFieldRefs {
    readonly id: FieldRef<"PackingScan", 'Int'>
    readonly scanId: FieldRef<"PackingScan", 'String'>
    readonly stationId: FieldRef<"PackingScan", 'String'>
    readonly nexsId: FieldRef<"PackingScan", 'String'>
    readonly timestamp: FieldRef<"PackingScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PackingScan findUnique
   */
  export type PackingScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter, which PackingScan to fetch.
     */
    where: PackingScanWhereUniqueInput
  }

  /**
   * PackingScan findUniqueOrThrow
   */
  export type PackingScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter, which PackingScan to fetch.
     */
    where: PackingScanWhereUniqueInput
  }

  /**
   * PackingScan findFirst
   */
  export type PackingScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter, which PackingScan to fetch.
     */
    where?: PackingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackingScans to fetch.
     */
    orderBy?: PackingScanOrderByWithRelationInput | PackingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PackingScans.
     */
    cursor?: PackingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PackingScans.
     */
    distinct?: PackingScanScalarFieldEnum | PackingScanScalarFieldEnum[]
  }

  /**
   * PackingScan findFirstOrThrow
   */
  export type PackingScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter, which PackingScan to fetch.
     */
    where?: PackingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackingScans to fetch.
     */
    orderBy?: PackingScanOrderByWithRelationInput | PackingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PackingScans.
     */
    cursor?: PackingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PackingScans.
     */
    distinct?: PackingScanScalarFieldEnum | PackingScanScalarFieldEnum[]
  }

  /**
   * PackingScan findMany
   */
  export type PackingScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter, which PackingScans to fetch.
     */
    where?: PackingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackingScans to fetch.
     */
    orderBy?: PackingScanOrderByWithRelationInput | PackingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PackingScans.
     */
    cursor?: PackingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackingScans.
     */
    skip?: number
    distinct?: PackingScanScalarFieldEnum | PackingScanScalarFieldEnum[]
  }

  /**
   * PackingScan create
   */
  export type PackingScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * The data needed to create a PackingScan.
     */
    data: XOR<PackingScanCreateInput, PackingScanUncheckedCreateInput>
  }

  /**
   * PackingScan createMany
   */
  export type PackingScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PackingScans.
     */
    data: PackingScanCreateManyInput | PackingScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PackingScan update
   */
  export type PackingScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * The data needed to update a PackingScan.
     */
    data: XOR<PackingScanUpdateInput, PackingScanUncheckedUpdateInput>
    /**
     * Choose, which PackingScan to update.
     */
    where: PackingScanWhereUniqueInput
  }

  /**
   * PackingScan updateMany
   */
  export type PackingScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PackingScans.
     */
    data: XOR<PackingScanUpdateManyMutationInput, PackingScanUncheckedUpdateManyInput>
    /**
     * Filter which PackingScans to update
     */
    where?: PackingScanWhereInput
    /**
     * Limit how many PackingScans to update.
     */
    limit?: number
  }

  /**
   * PackingScan upsert
   */
  export type PackingScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * The filter to search for the PackingScan to update in case it exists.
     */
    where: PackingScanWhereUniqueInput
    /**
     * In case the PackingScan found by the `where` argument doesn't exist, create a new PackingScan with this data.
     */
    create: XOR<PackingScanCreateInput, PackingScanUncheckedCreateInput>
    /**
     * In case the PackingScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PackingScanUpdateInput, PackingScanUncheckedUpdateInput>
  }

  /**
   * PackingScan delete
   */
  export type PackingScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
    /**
     * Filter which PackingScan to delete.
     */
    where: PackingScanWhereUniqueInput
  }

  /**
   * PackingScan deleteMany
   */
  export type PackingScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PackingScans to delete
     */
    where?: PackingScanWhereInput
    /**
     * Limit how many PackingScans to delete.
     */
    limit?: number
  }

  /**
   * PackingScan without action
   */
  export type PackingScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackingScan
     */
    select?: PackingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackingScan
     */
    omit?: PackingScanOmit<ExtArgs> | null
  }


  /**
   * Model DispatchScan
   */

  export type AggregateDispatchScan = {
    _count: DispatchScanCountAggregateOutputType | null
    _avg: DispatchScanAvgAggregateOutputType | null
    _sum: DispatchScanSumAggregateOutputType | null
    _min: DispatchScanMinAggregateOutputType | null
    _max: DispatchScanMaxAggregateOutputType | null
  }

  export type DispatchScanAvgAggregateOutputType = {
    id: number | null
  }

  export type DispatchScanSumAggregateOutputType = {
    id: number | null
  }

  export type DispatchScanMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type DispatchScanMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type DispatchScanCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    timestamp: number
    _all: number
  }


  export type DispatchScanAvgAggregateInputType = {
    id?: true
  }

  export type DispatchScanSumAggregateInputType = {
    id?: true
  }

  export type DispatchScanMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type DispatchScanMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type DispatchScanCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
    _all?: true
  }

  export type DispatchScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DispatchScan to aggregate.
     */
    where?: DispatchScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DispatchScans to fetch.
     */
    orderBy?: DispatchScanOrderByWithRelationInput | DispatchScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DispatchScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DispatchScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DispatchScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DispatchScans
    **/
    _count?: true | DispatchScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DispatchScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DispatchScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DispatchScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DispatchScanMaxAggregateInputType
  }

  export type GetDispatchScanAggregateType<T extends DispatchScanAggregateArgs> = {
        [P in keyof T & keyof AggregateDispatchScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDispatchScan[P]>
      : GetScalarType<T[P], AggregateDispatchScan[P]>
  }




  export type DispatchScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DispatchScanWhereInput
    orderBy?: DispatchScanOrderByWithAggregationInput | DispatchScanOrderByWithAggregationInput[]
    by: DispatchScanScalarFieldEnum[] | DispatchScanScalarFieldEnum
    having?: DispatchScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DispatchScanCountAggregateInputType | true
    _avg?: DispatchScanAvgAggregateInputType
    _sum?: DispatchScanSumAggregateInputType
    _min?: DispatchScanMinAggregateInputType
    _max?: DispatchScanMaxAggregateInputType
  }

  export type DispatchScanGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp: Date
    _count: DispatchScanCountAggregateOutputType | null
    _avg: DispatchScanAvgAggregateOutputType | null
    _sum: DispatchScanSumAggregateOutputType | null
    _min: DispatchScanMinAggregateOutputType | null
    _max: DispatchScanMaxAggregateOutputType | null
  }

  type GetDispatchScanGroupByPayload<T extends DispatchScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DispatchScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DispatchScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DispatchScanGroupByOutputType[P]>
            : GetScalarType<T[P], DispatchScanGroupByOutputType[P]>
        }
      >
    >


  export type DispatchScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["dispatchScan"]>



  export type DispatchScanSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }

  export type DispatchScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "timestamp", ExtArgs["result"]["dispatchScan"]>

  export type $DispatchScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DispatchScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      timestamp: Date
    }, ExtArgs["result"]["dispatchScan"]>
    composites: {}
  }

  type DispatchScanGetPayload<S extends boolean | null | undefined | DispatchScanDefaultArgs> = $Result.GetResult<Prisma.$DispatchScanPayload, S>

  type DispatchScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DispatchScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DispatchScanCountAggregateInputType | true
    }

  export interface DispatchScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DispatchScan'], meta: { name: 'DispatchScan' } }
    /**
     * Find zero or one DispatchScan that matches the filter.
     * @param {DispatchScanFindUniqueArgs} args - Arguments to find a DispatchScan
     * @example
     * // Get one DispatchScan
     * const dispatchScan = await prisma.dispatchScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DispatchScanFindUniqueArgs>(args: SelectSubset<T, DispatchScanFindUniqueArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DispatchScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DispatchScanFindUniqueOrThrowArgs} args - Arguments to find a DispatchScan
     * @example
     * // Get one DispatchScan
     * const dispatchScan = await prisma.dispatchScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DispatchScanFindUniqueOrThrowArgs>(args: SelectSubset<T, DispatchScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DispatchScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanFindFirstArgs} args - Arguments to find a DispatchScan
     * @example
     * // Get one DispatchScan
     * const dispatchScan = await prisma.dispatchScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DispatchScanFindFirstArgs>(args?: SelectSubset<T, DispatchScanFindFirstArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DispatchScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanFindFirstOrThrowArgs} args - Arguments to find a DispatchScan
     * @example
     * // Get one DispatchScan
     * const dispatchScan = await prisma.dispatchScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DispatchScanFindFirstOrThrowArgs>(args?: SelectSubset<T, DispatchScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DispatchScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DispatchScans
     * const dispatchScans = await prisma.dispatchScan.findMany()
     * 
     * // Get first 10 DispatchScans
     * const dispatchScans = await prisma.dispatchScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dispatchScanWithIdOnly = await prisma.dispatchScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DispatchScanFindManyArgs>(args?: SelectSubset<T, DispatchScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DispatchScan.
     * @param {DispatchScanCreateArgs} args - Arguments to create a DispatchScan.
     * @example
     * // Create one DispatchScan
     * const DispatchScan = await prisma.dispatchScan.create({
     *   data: {
     *     // ... data to create a DispatchScan
     *   }
     * })
     * 
     */
    create<T extends DispatchScanCreateArgs>(args: SelectSubset<T, DispatchScanCreateArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DispatchScans.
     * @param {DispatchScanCreateManyArgs} args - Arguments to create many DispatchScans.
     * @example
     * // Create many DispatchScans
     * const dispatchScan = await prisma.dispatchScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DispatchScanCreateManyArgs>(args?: SelectSubset<T, DispatchScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DispatchScan.
     * @param {DispatchScanDeleteArgs} args - Arguments to delete one DispatchScan.
     * @example
     * // Delete one DispatchScan
     * const DispatchScan = await prisma.dispatchScan.delete({
     *   where: {
     *     // ... filter to delete one DispatchScan
     *   }
     * })
     * 
     */
    delete<T extends DispatchScanDeleteArgs>(args: SelectSubset<T, DispatchScanDeleteArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DispatchScan.
     * @param {DispatchScanUpdateArgs} args - Arguments to update one DispatchScan.
     * @example
     * // Update one DispatchScan
     * const dispatchScan = await prisma.dispatchScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DispatchScanUpdateArgs>(args: SelectSubset<T, DispatchScanUpdateArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DispatchScans.
     * @param {DispatchScanDeleteManyArgs} args - Arguments to filter DispatchScans to delete.
     * @example
     * // Delete a few DispatchScans
     * const { count } = await prisma.dispatchScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DispatchScanDeleteManyArgs>(args?: SelectSubset<T, DispatchScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DispatchScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DispatchScans
     * const dispatchScan = await prisma.dispatchScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DispatchScanUpdateManyArgs>(args: SelectSubset<T, DispatchScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DispatchScan.
     * @param {DispatchScanUpsertArgs} args - Arguments to update or create a DispatchScan.
     * @example
     * // Update or create a DispatchScan
     * const dispatchScan = await prisma.dispatchScan.upsert({
     *   create: {
     *     // ... data to create a DispatchScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DispatchScan we want to update
     *   }
     * })
     */
    upsert<T extends DispatchScanUpsertArgs>(args: SelectSubset<T, DispatchScanUpsertArgs<ExtArgs>>): Prisma__DispatchScanClient<$Result.GetResult<Prisma.$DispatchScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DispatchScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanCountArgs} args - Arguments to filter DispatchScans to count.
     * @example
     * // Count the number of DispatchScans
     * const count = await prisma.dispatchScan.count({
     *   where: {
     *     // ... the filter for the DispatchScans we want to count
     *   }
     * })
    **/
    count<T extends DispatchScanCountArgs>(
      args?: Subset<T, DispatchScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DispatchScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DispatchScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DispatchScanAggregateArgs>(args: Subset<T, DispatchScanAggregateArgs>): Prisma.PrismaPromise<GetDispatchScanAggregateType<T>>

    /**
     * Group by DispatchScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispatchScanGroupByArgs} args - Group by arguments.
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
      T extends DispatchScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DispatchScanGroupByArgs['orderBy'] }
        : { orderBy?: DispatchScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DispatchScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispatchScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DispatchScan model
   */
  readonly fields: DispatchScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DispatchScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DispatchScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DispatchScan model
   */
  interface DispatchScanFieldRefs {
    readonly id: FieldRef<"DispatchScan", 'Int'>
    readonly scanId: FieldRef<"DispatchScan", 'String'>
    readonly stationId: FieldRef<"DispatchScan", 'String'>
    readonly nexsId: FieldRef<"DispatchScan", 'String'>
    readonly timestamp: FieldRef<"DispatchScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DispatchScan findUnique
   */
  export type DispatchScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter, which DispatchScan to fetch.
     */
    where: DispatchScanWhereUniqueInput
  }

  /**
   * DispatchScan findUniqueOrThrow
   */
  export type DispatchScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter, which DispatchScan to fetch.
     */
    where: DispatchScanWhereUniqueInput
  }

  /**
   * DispatchScan findFirst
   */
  export type DispatchScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter, which DispatchScan to fetch.
     */
    where?: DispatchScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DispatchScans to fetch.
     */
    orderBy?: DispatchScanOrderByWithRelationInput | DispatchScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DispatchScans.
     */
    cursor?: DispatchScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DispatchScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DispatchScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DispatchScans.
     */
    distinct?: DispatchScanScalarFieldEnum | DispatchScanScalarFieldEnum[]
  }

  /**
   * DispatchScan findFirstOrThrow
   */
  export type DispatchScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter, which DispatchScan to fetch.
     */
    where?: DispatchScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DispatchScans to fetch.
     */
    orderBy?: DispatchScanOrderByWithRelationInput | DispatchScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DispatchScans.
     */
    cursor?: DispatchScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DispatchScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DispatchScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DispatchScans.
     */
    distinct?: DispatchScanScalarFieldEnum | DispatchScanScalarFieldEnum[]
  }

  /**
   * DispatchScan findMany
   */
  export type DispatchScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter, which DispatchScans to fetch.
     */
    where?: DispatchScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DispatchScans to fetch.
     */
    orderBy?: DispatchScanOrderByWithRelationInput | DispatchScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DispatchScans.
     */
    cursor?: DispatchScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DispatchScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DispatchScans.
     */
    skip?: number
    distinct?: DispatchScanScalarFieldEnum | DispatchScanScalarFieldEnum[]
  }

  /**
   * DispatchScan create
   */
  export type DispatchScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * The data needed to create a DispatchScan.
     */
    data: XOR<DispatchScanCreateInput, DispatchScanUncheckedCreateInput>
  }

  /**
   * DispatchScan createMany
   */
  export type DispatchScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DispatchScans.
     */
    data: DispatchScanCreateManyInput | DispatchScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DispatchScan update
   */
  export type DispatchScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * The data needed to update a DispatchScan.
     */
    data: XOR<DispatchScanUpdateInput, DispatchScanUncheckedUpdateInput>
    /**
     * Choose, which DispatchScan to update.
     */
    where: DispatchScanWhereUniqueInput
  }

  /**
   * DispatchScan updateMany
   */
  export type DispatchScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DispatchScans.
     */
    data: XOR<DispatchScanUpdateManyMutationInput, DispatchScanUncheckedUpdateManyInput>
    /**
     * Filter which DispatchScans to update
     */
    where?: DispatchScanWhereInput
    /**
     * Limit how many DispatchScans to update.
     */
    limit?: number
  }

  /**
   * DispatchScan upsert
   */
  export type DispatchScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * The filter to search for the DispatchScan to update in case it exists.
     */
    where: DispatchScanWhereUniqueInput
    /**
     * In case the DispatchScan found by the `where` argument doesn't exist, create a new DispatchScan with this data.
     */
    create: XOR<DispatchScanCreateInput, DispatchScanUncheckedCreateInput>
    /**
     * In case the DispatchScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DispatchScanUpdateInput, DispatchScanUncheckedUpdateInput>
  }

  /**
   * DispatchScan delete
   */
  export type DispatchScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
    /**
     * Filter which DispatchScan to delete.
     */
    where: DispatchScanWhereUniqueInput
  }

  /**
   * DispatchScan deleteMany
   */
  export type DispatchScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DispatchScans to delete
     */
    where?: DispatchScanWhereInput
    /**
     * Limit how many DispatchScans to delete.
     */
    limit?: number
  }

  /**
   * DispatchScan without action
   */
  export type DispatchScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DispatchScan
     */
    select?: DispatchScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DispatchScan
     */
    omit?: DispatchScanOmit<ExtArgs> | null
  }


  /**
   * Model OperationsMetadata
   */

  export type AggregateOperationsMetadata = {
    _count: OperationsMetadataCountAggregateOutputType | null
    _avg: OperationsMetadataAvgAggregateOutputType | null
    _sum: OperationsMetadataSumAggregateOutputType | null
    _min: OperationsMetadataMinAggregateOutputType | null
    _max: OperationsMetadataMaxAggregateOutputType | null
  }

  export type OperationsMetadataAvgAggregateOutputType = {
    id: number | null
  }

  export type OperationsMetadataSumAggregateOutputType = {
    id: number | null
  }

  export type OperationsMetadataMinAggregateOutputType = {
    id: number | null
    locationId: string | null
    cityOdd: string | null
    shipToCust: string | null
  }

  export type OperationsMetadataMaxAggregateOutputType = {
    id: number | null
    locationId: string | null
    cityOdd: string | null
    shipToCust: string | null
  }

  export type OperationsMetadataCountAggregateOutputType = {
    id: number
    locationId: number
    cityOdd: number
    shipToCust: number
    _all: number
  }


  export type OperationsMetadataAvgAggregateInputType = {
    id?: true
  }

  export type OperationsMetadataSumAggregateInputType = {
    id?: true
  }

  export type OperationsMetadataMinAggregateInputType = {
    id?: true
    locationId?: true
    cityOdd?: true
    shipToCust?: true
  }

  export type OperationsMetadataMaxAggregateInputType = {
    id?: true
    locationId?: true
    cityOdd?: true
    shipToCust?: true
  }

  export type OperationsMetadataCountAggregateInputType = {
    id?: true
    locationId?: true
    cityOdd?: true
    shipToCust?: true
    _all?: true
  }

  export type OperationsMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperationsMetadata to aggregate.
     */
    where?: OperationsMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationsMetadata to fetch.
     */
    orderBy?: OperationsMetadataOrderByWithRelationInput | OperationsMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OperationsMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationsMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationsMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OperationsMetadata
    **/
    _count?: true | OperationsMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OperationsMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OperationsMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OperationsMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OperationsMetadataMaxAggregateInputType
  }

  export type GetOperationsMetadataAggregateType<T extends OperationsMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateOperationsMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOperationsMetadata[P]>
      : GetScalarType<T[P], AggregateOperationsMetadata[P]>
  }




  export type OperationsMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OperationsMetadataWhereInput
    orderBy?: OperationsMetadataOrderByWithAggregationInput | OperationsMetadataOrderByWithAggregationInput[]
    by: OperationsMetadataScalarFieldEnum[] | OperationsMetadataScalarFieldEnum
    having?: OperationsMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OperationsMetadataCountAggregateInputType | true
    _avg?: OperationsMetadataAvgAggregateInputType
    _sum?: OperationsMetadataSumAggregateInputType
    _min?: OperationsMetadataMinAggregateInputType
    _max?: OperationsMetadataMaxAggregateInputType
  }

  export type OperationsMetadataGroupByOutputType = {
    id: number
    locationId: string
    cityOdd: string
    shipToCust: string | null
    _count: OperationsMetadataCountAggregateOutputType | null
    _avg: OperationsMetadataAvgAggregateOutputType | null
    _sum: OperationsMetadataSumAggregateOutputType | null
    _min: OperationsMetadataMinAggregateOutputType | null
    _max: OperationsMetadataMaxAggregateOutputType | null
  }

  type GetOperationsMetadataGroupByPayload<T extends OperationsMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OperationsMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OperationsMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OperationsMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], OperationsMetadataGroupByOutputType[P]>
        }
      >
    >


  export type OperationsMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationId?: boolean
    cityOdd?: boolean
    shipToCust?: boolean
  }, ExtArgs["result"]["operationsMetadata"]>



  export type OperationsMetadataSelectScalar = {
    id?: boolean
    locationId?: boolean
    cityOdd?: boolean
    shipToCust?: boolean
  }

  export type OperationsMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "locationId" | "cityOdd" | "shipToCust", ExtArgs["result"]["operationsMetadata"]>

  export type $OperationsMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OperationsMetadata"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      locationId: string
      cityOdd: string
      shipToCust: string | null
    }, ExtArgs["result"]["operationsMetadata"]>
    composites: {}
  }

  type OperationsMetadataGetPayload<S extends boolean | null | undefined | OperationsMetadataDefaultArgs> = $Result.GetResult<Prisma.$OperationsMetadataPayload, S>

  type OperationsMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OperationsMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OperationsMetadataCountAggregateInputType | true
    }

  export interface OperationsMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OperationsMetadata'], meta: { name: 'OperationsMetadata' } }
    /**
     * Find zero or one OperationsMetadata that matches the filter.
     * @param {OperationsMetadataFindUniqueArgs} args - Arguments to find a OperationsMetadata
     * @example
     * // Get one OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperationsMetadataFindUniqueArgs>(args: SelectSubset<T, OperationsMetadataFindUniqueArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OperationsMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperationsMetadataFindUniqueOrThrowArgs} args - Arguments to find a OperationsMetadata
     * @example
     * // Get one OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperationsMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, OperationsMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OperationsMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataFindFirstArgs} args - Arguments to find a OperationsMetadata
     * @example
     * // Get one OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperationsMetadataFindFirstArgs>(args?: SelectSubset<T, OperationsMetadataFindFirstArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OperationsMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataFindFirstOrThrowArgs} args - Arguments to find a OperationsMetadata
     * @example
     * // Get one OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperationsMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, OperationsMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OperationsMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findMany()
     * 
     * // Get first 10 OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const operationsMetadataWithIdOnly = await prisma.operationsMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OperationsMetadataFindManyArgs>(args?: SelectSubset<T, OperationsMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OperationsMetadata.
     * @param {OperationsMetadataCreateArgs} args - Arguments to create a OperationsMetadata.
     * @example
     * // Create one OperationsMetadata
     * const OperationsMetadata = await prisma.operationsMetadata.create({
     *   data: {
     *     // ... data to create a OperationsMetadata
     *   }
     * })
     * 
     */
    create<T extends OperationsMetadataCreateArgs>(args: SelectSubset<T, OperationsMetadataCreateArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OperationsMetadata.
     * @param {OperationsMetadataCreateManyArgs} args - Arguments to create many OperationsMetadata.
     * @example
     * // Create many OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OperationsMetadataCreateManyArgs>(args?: SelectSubset<T, OperationsMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OperationsMetadata.
     * @param {OperationsMetadataDeleteArgs} args - Arguments to delete one OperationsMetadata.
     * @example
     * // Delete one OperationsMetadata
     * const OperationsMetadata = await prisma.operationsMetadata.delete({
     *   where: {
     *     // ... filter to delete one OperationsMetadata
     *   }
     * })
     * 
     */
    delete<T extends OperationsMetadataDeleteArgs>(args: SelectSubset<T, OperationsMetadataDeleteArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OperationsMetadata.
     * @param {OperationsMetadataUpdateArgs} args - Arguments to update one OperationsMetadata.
     * @example
     * // Update one OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OperationsMetadataUpdateArgs>(args: SelectSubset<T, OperationsMetadataUpdateArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OperationsMetadata.
     * @param {OperationsMetadataDeleteManyArgs} args - Arguments to filter OperationsMetadata to delete.
     * @example
     * // Delete a few OperationsMetadata
     * const { count } = await prisma.operationsMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OperationsMetadataDeleteManyArgs>(args?: SelectSubset<T, OperationsMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OperationsMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OperationsMetadataUpdateManyArgs>(args: SelectSubset<T, OperationsMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OperationsMetadata.
     * @param {OperationsMetadataUpsertArgs} args - Arguments to update or create a OperationsMetadata.
     * @example
     * // Update or create a OperationsMetadata
     * const operationsMetadata = await prisma.operationsMetadata.upsert({
     *   create: {
     *     // ... data to create a OperationsMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperationsMetadata we want to update
     *   }
     * })
     */
    upsert<T extends OperationsMetadataUpsertArgs>(args: SelectSubset<T, OperationsMetadataUpsertArgs<ExtArgs>>): Prisma__OperationsMetadataClient<$Result.GetResult<Prisma.$OperationsMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OperationsMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataCountArgs} args - Arguments to filter OperationsMetadata to count.
     * @example
     * // Count the number of OperationsMetadata
     * const count = await prisma.operationsMetadata.count({
     *   where: {
     *     // ... the filter for the OperationsMetadata we want to count
     *   }
     * })
    **/
    count<T extends OperationsMetadataCountArgs>(
      args?: Subset<T, OperationsMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OperationsMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OperationsMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OperationsMetadataAggregateArgs>(args: Subset<T, OperationsMetadataAggregateArgs>): Prisma.PrismaPromise<GetOperationsMetadataAggregateType<T>>

    /**
     * Group by OperationsMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationsMetadataGroupByArgs} args - Group by arguments.
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
      T extends OperationsMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OperationsMetadataGroupByArgs['orderBy'] }
        : { orderBy?: OperationsMetadataGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OperationsMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationsMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OperationsMetadata model
   */
  readonly fields: OperationsMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OperationsMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OperationsMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the OperationsMetadata model
   */
  interface OperationsMetadataFieldRefs {
    readonly id: FieldRef<"OperationsMetadata", 'Int'>
    readonly locationId: FieldRef<"OperationsMetadata", 'String'>
    readonly cityOdd: FieldRef<"OperationsMetadata", 'String'>
    readonly shipToCust: FieldRef<"OperationsMetadata", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OperationsMetadata findUnique
   */
  export type OperationsMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter, which OperationsMetadata to fetch.
     */
    where: OperationsMetadataWhereUniqueInput
  }

  /**
   * OperationsMetadata findUniqueOrThrow
   */
  export type OperationsMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter, which OperationsMetadata to fetch.
     */
    where: OperationsMetadataWhereUniqueInput
  }

  /**
   * OperationsMetadata findFirst
   */
  export type OperationsMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter, which OperationsMetadata to fetch.
     */
    where?: OperationsMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationsMetadata to fetch.
     */
    orderBy?: OperationsMetadataOrderByWithRelationInput | OperationsMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperationsMetadata.
     */
    cursor?: OperationsMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationsMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationsMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperationsMetadata.
     */
    distinct?: OperationsMetadataScalarFieldEnum | OperationsMetadataScalarFieldEnum[]
  }

  /**
   * OperationsMetadata findFirstOrThrow
   */
  export type OperationsMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter, which OperationsMetadata to fetch.
     */
    where?: OperationsMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationsMetadata to fetch.
     */
    orderBy?: OperationsMetadataOrderByWithRelationInput | OperationsMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperationsMetadata.
     */
    cursor?: OperationsMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationsMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationsMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperationsMetadata.
     */
    distinct?: OperationsMetadataScalarFieldEnum | OperationsMetadataScalarFieldEnum[]
  }

  /**
   * OperationsMetadata findMany
   */
  export type OperationsMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter, which OperationsMetadata to fetch.
     */
    where?: OperationsMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationsMetadata to fetch.
     */
    orderBy?: OperationsMetadataOrderByWithRelationInput | OperationsMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OperationsMetadata.
     */
    cursor?: OperationsMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationsMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationsMetadata.
     */
    skip?: number
    distinct?: OperationsMetadataScalarFieldEnum | OperationsMetadataScalarFieldEnum[]
  }

  /**
   * OperationsMetadata create
   */
  export type OperationsMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * The data needed to create a OperationsMetadata.
     */
    data: XOR<OperationsMetadataCreateInput, OperationsMetadataUncheckedCreateInput>
  }

  /**
   * OperationsMetadata createMany
   */
  export type OperationsMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperationsMetadata.
     */
    data: OperationsMetadataCreateManyInput | OperationsMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OperationsMetadata update
   */
  export type OperationsMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * The data needed to update a OperationsMetadata.
     */
    data: XOR<OperationsMetadataUpdateInput, OperationsMetadataUncheckedUpdateInput>
    /**
     * Choose, which OperationsMetadata to update.
     */
    where: OperationsMetadataWhereUniqueInput
  }

  /**
   * OperationsMetadata updateMany
   */
  export type OperationsMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OperationsMetadata.
     */
    data: XOR<OperationsMetadataUpdateManyMutationInput, OperationsMetadataUncheckedUpdateManyInput>
    /**
     * Filter which OperationsMetadata to update
     */
    where?: OperationsMetadataWhereInput
    /**
     * Limit how many OperationsMetadata to update.
     */
    limit?: number
  }

  /**
   * OperationsMetadata upsert
   */
  export type OperationsMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * The filter to search for the OperationsMetadata to update in case it exists.
     */
    where: OperationsMetadataWhereUniqueInput
    /**
     * In case the OperationsMetadata found by the `where` argument doesn't exist, create a new OperationsMetadata with this data.
     */
    create: XOR<OperationsMetadataCreateInput, OperationsMetadataUncheckedCreateInput>
    /**
     * In case the OperationsMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OperationsMetadataUpdateInput, OperationsMetadataUncheckedUpdateInput>
  }

  /**
   * OperationsMetadata delete
   */
  export type OperationsMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
    /**
     * Filter which OperationsMetadata to delete.
     */
    where: OperationsMetadataWhereUniqueInput
  }

  /**
   * OperationsMetadata deleteMany
   */
  export type OperationsMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperationsMetadata to delete
     */
    where?: OperationsMetadataWhereInput
    /**
     * Limit how many OperationsMetadata to delete.
     */
    limit?: number
  }

  /**
   * OperationsMetadata without action
   */
  export type OperationsMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationsMetadata
     */
    select?: OperationsMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationsMetadata
     */
    omit?: OperationsMetadataOmit<ExtArgs> | null
  }


  /**
   * Model MaintenanceShopIssue
   */

  export type AggregateMaintenanceShopIssue = {
    _count: MaintenanceShopIssueCountAggregateOutputType | null
    _avg: MaintenanceShopIssueAvgAggregateOutputType | null
    _sum: MaintenanceShopIssueSumAggregateOutputType | null
    _min: MaintenanceShopIssueMinAggregateOutputType | null
    _max: MaintenanceShopIssueMaxAggregateOutputType | null
  }

  export type MaintenanceShopIssueAvgAggregateOutputType = {
    id: number | null
    quantity: number | null
    rate: number | null
    total: number | null
  }

  export type MaintenanceShopIssueSumAggregateOutputType = {
    id: number | null
    quantity: number | null
    rate: number | null
    total: number | null
  }

  export type MaintenanceShopIssueMinAggregateOutputType = {
    id: number | null
    pid: string | null
    partName: string | null
    quantity: number | null
    unit: string | null
    rate: number | null
    category: string | null
    total: number | null
    currency: string | null
    destination: string | null
    department: string | null
    issuedAt: Date | null
  }

  export type MaintenanceShopIssueMaxAggregateOutputType = {
    id: number | null
    pid: string | null
    partName: string | null
    quantity: number | null
    unit: string | null
    rate: number | null
    category: string | null
    total: number | null
    currency: string | null
    destination: string | null
    department: string | null
    issuedAt: Date | null
  }

  export type MaintenanceShopIssueCountAggregateOutputType = {
    id: number
    pid: number
    partName: number
    quantity: number
    unit: number
    rate: number
    category: number
    total: number
    currency: number
    destination: number
    department: number
    issuedAt: number
    _all: number
  }


  export type MaintenanceShopIssueAvgAggregateInputType = {
    id?: true
    quantity?: true
    rate?: true
    total?: true
  }

  export type MaintenanceShopIssueSumAggregateInputType = {
    id?: true
    quantity?: true
    rate?: true
    total?: true
  }

  export type MaintenanceShopIssueMinAggregateInputType = {
    id?: true
    pid?: true
    partName?: true
    quantity?: true
    unit?: true
    rate?: true
    category?: true
    total?: true
    currency?: true
    destination?: true
    department?: true
    issuedAt?: true
  }

  export type MaintenanceShopIssueMaxAggregateInputType = {
    id?: true
    pid?: true
    partName?: true
    quantity?: true
    unit?: true
    rate?: true
    category?: true
    total?: true
    currency?: true
    destination?: true
    department?: true
    issuedAt?: true
  }

  export type MaintenanceShopIssueCountAggregateInputType = {
    id?: true
    pid?: true
    partName?: true
    quantity?: true
    unit?: true
    rate?: true
    category?: true
    total?: true
    currency?: true
    destination?: true
    department?: true
    issuedAt?: true
    _all?: true
  }

  export type MaintenanceShopIssueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceShopIssue to aggregate.
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceShopIssues to fetch.
     */
    orderBy?: MaintenanceShopIssueOrderByWithRelationInput | MaintenanceShopIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceShopIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceShopIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceShopIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceShopIssues
    **/
    _count?: true | MaintenanceShopIssueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceShopIssueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceShopIssueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceShopIssueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceShopIssueMaxAggregateInputType
  }

  export type GetMaintenanceShopIssueAggregateType<T extends MaintenanceShopIssueAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceShopIssue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceShopIssue[P]>
      : GetScalarType<T[P], AggregateMaintenanceShopIssue[P]>
  }




  export type MaintenanceShopIssueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceShopIssueWhereInput
    orderBy?: MaintenanceShopIssueOrderByWithAggregationInput | MaintenanceShopIssueOrderByWithAggregationInput[]
    by: MaintenanceShopIssueScalarFieldEnum[] | MaintenanceShopIssueScalarFieldEnum
    having?: MaintenanceShopIssueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceShopIssueCountAggregateInputType | true
    _avg?: MaintenanceShopIssueAvgAggregateInputType
    _sum?: MaintenanceShopIssueSumAggregateInputType
    _min?: MaintenanceShopIssueMinAggregateInputType
    _max?: MaintenanceShopIssueMaxAggregateInputType
  }

  export type MaintenanceShopIssueGroupByOutputType = {
    id: number
    pid: string
    partName: string
    quantity: number
    unit: string
    rate: number
    category: string
    total: number
    currency: string | null
    destination: string
    department: string
    issuedAt: Date
    _count: MaintenanceShopIssueCountAggregateOutputType | null
    _avg: MaintenanceShopIssueAvgAggregateOutputType | null
    _sum: MaintenanceShopIssueSumAggregateOutputType | null
    _min: MaintenanceShopIssueMinAggregateOutputType | null
    _max: MaintenanceShopIssueMaxAggregateOutputType | null
  }

  type GetMaintenanceShopIssueGroupByPayload<T extends MaintenanceShopIssueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceShopIssueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceShopIssueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceShopIssueGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceShopIssueGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceShopIssueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pid?: boolean
    partName?: boolean
    quantity?: boolean
    unit?: boolean
    rate?: boolean
    category?: boolean
    total?: boolean
    currency?: boolean
    destination?: boolean
    department?: boolean
    issuedAt?: boolean
  }, ExtArgs["result"]["maintenanceShopIssue"]>



  export type MaintenanceShopIssueSelectScalar = {
    id?: boolean
    pid?: boolean
    partName?: boolean
    quantity?: boolean
    unit?: boolean
    rate?: boolean
    category?: boolean
    total?: boolean
    currency?: boolean
    destination?: boolean
    department?: boolean
    issuedAt?: boolean
  }

  export type MaintenanceShopIssueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pid" | "partName" | "quantity" | "unit" | "rate" | "category" | "total" | "currency" | "destination" | "department" | "issuedAt", ExtArgs["result"]["maintenanceShopIssue"]>

  export type $MaintenanceShopIssuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceShopIssue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      pid: string
      partName: string
      quantity: number
      unit: string
      rate: number
      category: string
      total: number
      currency: string | null
      destination: string
      department: string
      issuedAt: Date
    }, ExtArgs["result"]["maintenanceShopIssue"]>
    composites: {}
  }

  type MaintenanceShopIssueGetPayload<S extends boolean | null | undefined | MaintenanceShopIssueDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceShopIssuePayload, S>

  type MaintenanceShopIssueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceShopIssueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceShopIssueCountAggregateInputType | true
    }

  export interface MaintenanceShopIssueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceShopIssue'], meta: { name: 'MaintenanceShopIssue' } }
    /**
     * Find zero or one MaintenanceShopIssue that matches the filter.
     * @param {MaintenanceShopIssueFindUniqueArgs} args - Arguments to find a MaintenanceShopIssue
     * @example
     * // Get one MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceShopIssueFindUniqueArgs>(args: SelectSubset<T, MaintenanceShopIssueFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceShopIssue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceShopIssueFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceShopIssue
     * @example
     * // Get one MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceShopIssueFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceShopIssueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceShopIssue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueFindFirstArgs} args - Arguments to find a MaintenanceShopIssue
     * @example
     * // Get one MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceShopIssueFindFirstArgs>(args?: SelectSubset<T, MaintenanceShopIssueFindFirstArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceShopIssue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueFindFirstOrThrowArgs} args - Arguments to find a MaintenanceShopIssue
     * @example
     * // Get one MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceShopIssueFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceShopIssueFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceShopIssues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceShopIssues
     * const maintenanceShopIssues = await prisma.maintenanceShopIssue.findMany()
     * 
     * // Get first 10 MaintenanceShopIssues
     * const maintenanceShopIssues = await prisma.maintenanceShopIssue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceShopIssueWithIdOnly = await prisma.maintenanceShopIssue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceShopIssueFindManyArgs>(args?: SelectSubset<T, MaintenanceShopIssueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceShopIssue.
     * @param {MaintenanceShopIssueCreateArgs} args - Arguments to create a MaintenanceShopIssue.
     * @example
     * // Create one MaintenanceShopIssue
     * const MaintenanceShopIssue = await prisma.maintenanceShopIssue.create({
     *   data: {
     *     // ... data to create a MaintenanceShopIssue
     *   }
     * })
     * 
     */
    create<T extends MaintenanceShopIssueCreateArgs>(args: SelectSubset<T, MaintenanceShopIssueCreateArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceShopIssues.
     * @param {MaintenanceShopIssueCreateManyArgs} args - Arguments to create many MaintenanceShopIssues.
     * @example
     * // Create many MaintenanceShopIssues
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceShopIssueCreateManyArgs>(args?: SelectSubset<T, MaintenanceShopIssueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MaintenanceShopIssue.
     * @param {MaintenanceShopIssueDeleteArgs} args - Arguments to delete one MaintenanceShopIssue.
     * @example
     * // Delete one MaintenanceShopIssue
     * const MaintenanceShopIssue = await prisma.maintenanceShopIssue.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceShopIssue
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceShopIssueDeleteArgs>(args: SelectSubset<T, MaintenanceShopIssueDeleteArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceShopIssue.
     * @param {MaintenanceShopIssueUpdateArgs} args - Arguments to update one MaintenanceShopIssue.
     * @example
     * // Update one MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceShopIssueUpdateArgs>(args: SelectSubset<T, MaintenanceShopIssueUpdateArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceShopIssues.
     * @param {MaintenanceShopIssueDeleteManyArgs} args - Arguments to filter MaintenanceShopIssues to delete.
     * @example
     * // Delete a few MaintenanceShopIssues
     * const { count } = await prisma.maintenanceShopIssue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceShopIssueDeleteManyArgs>(args?: SelectSubset<T, MaintenanceShopIssueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceShopIssues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceShopIssues
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceShopIssueUpdateManyArgs>(args: SelectSubset<T, MaintenanceShopIssueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MaintenanceShopIssue.
     * @param {MaintenanceShopIssueUpsertArgs} args - Arguments to update or create a MaintenanceShopIssue.
     * @example
     * // Update or create a MaintenanceShopIssue
     * const maintenanceShopIssue = await prisma.maintenanceShopIssue.upsert({
     *   create: {
     *     // ... data to create a MaintenanceShopIssue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceShopIssue we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceShopIssueUpsertArgs>(args: SelectSubset<T, MaintenanceShopIssueUpsertArgs<ExtArgs>>): Prisma__MaintenanceShopIssueClient<$Result.GetResult<Prisma.$MaintenanceShopIssuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceShopIssues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueCountArgs} args - Arguments to filter MaintenanceShopIssues to count.
     * @example
     * // Count the number of MaintenanceShopIssues
     * const count = await prisma.maintenanceShopIssue.count({
     *   where: {
     *     // ... the filter for the MaintenanceShopIssues we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceShopIssueCountArgs>(
      args?: Subset<T, MaintenanceShopIssueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceShopIssueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceShopIssue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MaintenanceShopIssueAggregateArgs>(args: Subset<T, MaintenanceShopIssueAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceShopIssueAggregateType<T>>

    /**
     * Group by MaintenanceShopIssue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceShopIssueGroupByArgs} args - Group by arguments.
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
      T extends MaintenanceShopIssueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceShopIssueGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceShopIssueGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MaintenanceShopIssueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceShopIssueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceShopIssue model
   */
  readonly fields: MaintenanceShopIssueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceShopIssue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceShopIssueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MaintenanceShopIssue model
   */
  interface MaintenanceShopIssueFieldRefs {
    readonly id: FieldRef<"MaintenanceShopIssue", 'Int'>
    readonly pid: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly partName: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly quantity: FieldRef<"MaintenanceShopIssue", 'Int'>
    readonly unit: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly rate: FieldRef<"MaintenanceShopIssue", 'Float'>
    readonly category: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly total: FieldRef<"MaintenanceShopIssue", 'Float'>
    readonly currency: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly destination: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly department: FieldRef<"MaintenanceShopIssue", 'String'>
    readonly issuedAt: FieldRef<"MaintenanceShopIssue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceShopIssue findUnique
   */
  export type MaintenanceShopIssueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceShopIssue to fetch.
     */
    where: MaintenanceShopIssueWhereUniqueInput
  }

  /**
   * MaintenanceShopIssue findUniqueOrThrow
   */
  export type MaintenanceShopIssueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceShopIssue to fetch.
     */
    where: MaintenanceShopIssueWhereUniqueInput
  }

  /**
   * MaintenanceShopIssue findFirst
   */
  export type MaintenanceShopIssueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceShopIssue to fetch.
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceShopIssues to fetch.
     */
    orderBy?: MaintenanceShopIssueOrderByWithRelationInput | MaintenanceShopIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceShopIssues.
     */
    cursor?: MaintenanceShopIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceShopIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceShopIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceShopIssues.
     */
    distinct?: MaintenanceShopIssueScalarFieldEnum | MaintenanceShopIssueScalarFieldEnum[]
  }

  /**
   * MaintenanceShopIssue findFirstOrThrow
   */
  export type MaintenanceShopIssueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceShopIssue to fetch.
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceShopIssues to fetch.
     */
    orderBy?: MaintenanceShopIssueOrderByWithRelationInput | MaintenanceShopIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceShopIssues.
     */
    cursor?: MaintenanceShopIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceShopIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceShopIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceShopIssues.
     */
    distinct?: MaintenanceShopIssueScalarFieldEnum | MaintenanceShopIssueScalarFieldEnum[]
  }

  /**
   * MaintenanceShopIssue findMany
   */
  export type MaintenanceShopIssueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceShopIssues to fetch.
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceShopIssues to fetch.
     */
    orderBy?: MaintenanceShopIssueOrderByWithRelationInput | MaintenanceShopIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceShopIssues.
     */
    cursor?: MaintenanceShopIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceShopIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceShopIssues.
     */
    skip?: number
    distinct?: MaintenanceShopIssueScalarFieldEnum | MaintenanceShopIssueScalarFieldEnum[]
  }

  /**
   * MaintenanceShopIssue create
   */
  export type MaintenanceShopIssueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceShopIssue.
     */
    data: XOR<MaintenanceShopIssueCreateInput, MaintenanceShopIssueUncheckedCreateInput>
  }

  /**
   * MaintenanceShopIssue createMany
   */
  export type MaintenanceShopIssueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceShopIssues.
     */
    data: MaintenanceShopIssueCreateManyInput | MaintenanceShopIssueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceShopIssue update
   */
  export type MaintenanceShopIssueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceShopIssue.
     */
    data: XOR<MaintenanceShopIssueUpdateInput, MaintenanceShopIssueUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceShopIssue to update.
     */
    where: MaintenanceShopIssueWhereUniqueInput
  }

  /**
   * MaintenanceShopIssue updateMany
   */
  export type MaintenanceShopIssueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceShopIssues.
     */
    data: XOR<MaintenanceShopIssueUpdateManyMutationInput, MaintenanceShopIssueUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceShopIssues to update
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * Limit how many MaintenanceShopIssues to update.
     */
    limit?: number
  }

  /**
   * MaintenanceShopIssue upsert
   */
  export type MaintenanceShopIssueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceShopIssue to update in case it exists.
     */
    where: MaintenanceShopIssueWhereUniqueInput
    /**
     * In case the MaintenanceShopIssue found by the `where` argument doesn't exist, create a new MaintenanceShopIssue with this data.
     */
    create: XOR<MaintenanceShopIssueCreateInput, MaintenanceShopIssueUncheckedCreateInput>
    /**
     * In case the MaintenanceShopIssue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceShopIssueUpdateInput, MaintenanceShopIssueUncheckedUpdateInput>
  }

  /**
   * MaintenanceShopIssue delete
   */
  export type MaintenanceShopIssueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
    /**
     * Filter which MaintenanceShopIssue to delete.
     */
    where: MaintenanceShopIssueWhereUniqueInput
  }

  /**
   * MaintenanceShopIssue deleteMany
   */
  export type MaintenanceShopIssueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceShopIssues to delete
     */
    where?: MaintenanceShopIssueWhereInput
    /**
     * Limit how many MaintenanceShopIssues to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceShopIssue without action
   */
  export type MaintenanceShopIssueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceShopIssue
     */
    select?: MaintenanceShopIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceShopIssue
     */
    omit?: MaintenanceShopIssueOmit<ExtArgs> | null
  }


  /**
   * Model FastTrackScan
   */

  export type AggregateFastTrackScan = {
    _count: FastTrackScanCountAggregateOutputType | null
    _avg: FastTrackScanAvgAggregateOutputType | null
    _sum: FastTrackScanSumAggregateOutputType | null
    _min: FastTrackScanMinAggregateOutputType | null
    _max: FastTrackScanMaxAggregateOutputType | null
  }

  export type FastTrackScanAvgAggregateOutputType = {
    id: number | null
  }

  export type FastTrackScanSumAggregateOutputType = {
    id: number | null
  }

  export type FastTrackScanMinAggregateOutputType = {
    id: number | null
    locationID: string | null
    cityOdd: string | null
    time: Date | null
  }

  export type FastTrackScanMaxAggregateOutputType = {
    id: number | null
    locationID: string | null
    cityOdd: string | null
    time: Date | null
  }

  export type FastTrackScanCountAggregateOutputType = {
    id: number
    locationID: number
    cityOdd: number
    time: number
    _all: number
  }


  export type FastTrackScanAvgAggregateInputType = {
    id?: true
  }

  export type FastTrackScanSumAggregateInputType = {
    id?: true
  }

  export type FastTrackScanMinAggregateInputType = {
    id?: true
    locationID?: true
    cityOdd?: true
    time?: true
  }

  export type FastTrackScanMaxAggregateInputType = {
    id?: true
    locationID?: true
    cityOdd?: true
    time?: true
  }

  export type FastTrackScanCountAggregateInputType = {
    id?: true
    locationID?: true
    cityOdd?: true
    time?: true
    _all?: true
  }

  export type FastTrackScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FastTrackScan to aggregate.
     */
    where?: FastTrackScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FastTrackScans to fetch.
     */
    orderBy?: FastTrackScanOrderByWithRelationInput | FastTrackScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FastTrackScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FastTrackScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FastTrackScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FastTrackScans
    **/
    _count?: true | FastTrackScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FastTrackScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FastTrackScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FastTrackScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FastTrackScanMaxAggregateInputType
  }

  export type GetFastTrackScanAggregateType<T extends FastTrackScanAggregateArgs> = {
        [P in keyof T & keyof AggregateFastTrackScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFastTrackScan[P]>
      : GetScalarType<T[P], AggregateFastTrackScan[P]>
  }




  export type FastTrackScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FastTrackScanWhereInput
    orderBy?: FastTrackScanOrderByWithAggregationInput | FastTrackScanOrderByWithAggregationInput[]
    by: FastTrackScanScalarFieldEnum[] | FastTrackScanScalarFieldEnum
    having?: FastTrackScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FastTrackScanCountAggregateInputType | true
    _avg?: FastTrackScanAvgAggregateInputType
    _sum?: FastTrackScanSumAggregateInputType
    _min?: FastTrackScanMinAggregateInputType
    _max?: FastTrackScanMaxAggregateInputType
  }

  export type FastTrackScanGroupByOutputType = {
    id: number
    locationID: string
    cityOdd: string
    time: Date
    _count: FastTrackScanCountAggregateOutputType | null
    _avg: FastTrackScanAvgAggregateOutputType | null
    _sum: FastTrackScanSumAggregateOutputType | null
    _min: FastTrackScanMinAggregateOutputType | null
    _max: FastTrackScanMaxAggregateOutputType | null
  }

  type GetFastTrackScanGroupByPayload<T extends FastTrackScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FastTrackScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FastTrackScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FastTrackScanGroupByOutputType[P]>
            : GetScalarType<T[P], FastTrackScanGroupByOutputType[P]>
        }
      >
    >


  export type FastTrackScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationID?: boolean
    cityOdd?: boolean
    time?: boolean
  }, ExtArgs["result"]["fastTrackScan"]>



  export type FastTrackScanSelectScalar = {
    id?: boolean
    locationID?: boolean
    cityOdd?: boolean
    time?: boolean
  }

  export type FastTrackScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "locationID" | "cityOdd" | "time", ExtArgs["result"]["fastTrackScan"]>

  export type $FastTrackScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FastTrackScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      locationID: string
      cityOdd: string
      time: Date
    }, ExtArgs["result"]["fastTrackScan"]>
    composites: {}
  }

  type FastTrackScanGetPayload<S extends boolean | null | undefined | FastTrackScanDefaultArgs> = $Result.GetResult<Prisma.$FastTrackScanPayload, S>

  type FastTrackScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FastTrackScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FastTrackScanCountAggregateInputType | true
    }

  export interface FastTrackScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FastTrackScan'], meta: { name: 'FastTrackScan' } }
    /**
     * Find zero or one FastTrackScan that matches the filter.
     * @param {FastTrackScanFindUniqueArgs} args - Arguments to find a FastTrackScan
     * @example
     * // Get one FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FastTrackScanFindUniqueArgs>(args: SelectSubset<T, FastTrackScanFindUniqueArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FastTrackScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FastTrackScanFindUniqueOrThrowArgs} args - Arguments to find a FastTrackScan
     * @example
     * // Get one FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FastTrackScanFindUniqueOrThrowArgs>(args: SelectSubset<T, FastTrackScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FastTrackScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanFindFirstArgs} args - Arguments to find a FastTrackScan
     * @example
     * // Get one FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FastTrackScanFindFirstArgs>(args?: SelectSubset<T, FastTrackScanFindFirstArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FastTrackScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanFindFirstOrThrowArgs} args - Arguments to find a FastTrackScan
     * @example
     * // Get one FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FastTrackScanFindFirstOrThrowArgs>(args?: SelectSubset<T, FastTrackScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FastTrackScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FastTrackScans
     * const fastTrackScans = await prisma.fastTrackScan.findMany()
     * 
     * // Get first 10 FastTrackScans
     * const fastTrackScans = await prisma.fastTrackScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fastTrackScanWithIdOnly = await prisma.fastTrackScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FastTrackScanFindManyArgs>(args?: SelectSubset<T, FastTrackScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FastTrackScan.
     * @param {FastTrackScanCreateArgs} args - Arguments to create a FastTrackScan.
     * @example
     * // Create one FastTrackScan
     * const FastTrackScan = await prisma.fastTrackScan.create({
     *   data: {
     *     // ... data to create a FastTrackScan
     *   }
     * })
     * 
     */
    create<T extends FastTrackScanCreateArgs>(args: SelectSubset<T, FastTrackScanCreateArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FastTrackScans.
     * @param {FastTrackScanCreateManyArgs} args - Arguments to create many FastTrackScans.
     * @example
     * // Create many FastTrackScans
     * const fastTrackScan = await prisma.fastTrackScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FastTrackScanCreateManyArgs>(args?: SelectSubset<T, FastTrackScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FastTrackScan.
     * @param {FastTrackScanDeleteArgs} args - Arguments to delete one FastTrackScan.
     * @example
     * // Delete one FastTrackScan
     * const FastTrackScan = await prisma.fastTrackScan.delete({
     *   where: {
     *     // ... filter to delete one FastTrackScan
     *   }
     * })
     * 
     */
    delete<T extends FastTrackScanDeleteArgs>(args: SelectSubset<T, FastTrackScanDeleteArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FastTrackScan.
     * @param {FastTrackScanUpdateArgs} args - Arguments to update one FastTrackScan.
     * @example
     * // Update one FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FastTrackScanUpdateArgs>(args: SelectSubset<T, FastTrackScanUpdateArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FastTrackScans.
     * @param {FastTrackScanDeleteManyArgs} args - Arguments to filter FastTrackScans to delete.
     * @example
     * // Delete a few FastTrackScans
     * const { count } = await prisma.fastTrackScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FastTrackScanDeleteManyArgs>(args?: SelectSubset<T, FastTrackScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FastTrackScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FastTrackScans
     * const fastTrackScan = await prisma.fastTrackScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FastTrackScanUpdateManyArgs>(args: SelectSubset<T, FastTrackScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FastTrackScan.
     * @param {FastTrackScanUpsertArgs} args - Arguments to update or create a FastTrackScan.
     * @example
     * // Update or create a FastTrackScan
     * const fastTrackScan = await prisma.fastTrackScan.upsert({
     *   create: {
     *     // ... data to create a FastTrackScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FastTrackScan we want to update
     *   }
     * })
     */
    upsert<T extends FastTrackScanUpsertArgs>(args: SelectSubset<T, FastTrackScanUpsertArgs<ExtArgs>>): Prisma__FastTrackScanClient<$Result.GetResult<Prisma.$FastTrackScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FastTrackScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanCountArgs} args - Arguments to filter FastTrackScans to count.
     * @example
     * // Count the number of FastTrackScans
     * const count = await prisma.fastTrackScan.count({
     *   where: {
     *     // ... the filter for the FastTrackScans we want to count
     *   }
     * })
    **/
    count<T extends FastTrackScanCountArgs>(
      args?: Subset<T, FastTrackScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FastTrackScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FastTrackScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FastTrackScanAggregateArgs>(args: Subset<T, FastTrackScanAggregateArgs>): Prisma.PrismaPromise<GetFastTrackScanAggregateType<T>>

    /**
     * Group by FastTrackScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FastTrackScanGroupByArgs} args - Group by arguments.
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
      T extends FastTrackScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FastTrackScanGroupByArgs['orderBy'] }
        : { orderBy?: FastTrackScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FastTrackScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFastTrackScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FastTrackScan model
   */
  readonly fields: FastTrackScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FastTrackScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FastTrackScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the FastTrackScan model
   */
  interface FastTrackScanFieldRefs {
    readonly id: FieldRef<"FastTrackScan", 'Int'>
    readonly locationID: FieldRef<"FastTrackScan", 'String'>
    readonly cityOdd: FieldRef<"FastTrackScan", 'String'>
    readonly time: FieldRef<"FastTrackScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FastTrackScan findUnique
   */
  export type FastTrackScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter, which FastTrackScan to fetch.
     */
    where: FastTrackScanWhereUniqueInput
  }

  /**
   * FastTrackScan findUniqueOrThrow
   */
  export type FastTrackScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter, which FastTrackScan to fetch.
     */
    where: FastTrackScanWhereUniqueInput
  }

  /**
   * FastTrackScan findFirst
   */
  export type FastTrackScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter, which FastTrackScan to fetch.
     */
    where?: FastTrackScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FastTrackScans to fetch.
     */
    orderBy?: FastTrackScanOrderByWithRelationInput | FastTrackScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FastTrackScans.
     */
    cursor?: FastTrackScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FastTrackScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FastTrackScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FastTrackScans.
     */
    distinct?: FastTrackScanScalarFieldEnum | FastTrackScanScalarFieldEnum[]
  }

  /**
   * FastTrackScan findFirstOrThrow
   */
  export type FastTrackScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter, which FastTrackScan to fetch.
     */
    where?: FastTrackScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FastTrackScans to fetch.
     */
    orderBy?: FastTrackScanOrderByWithRelationInput | FastTrackScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FastTrackScans.
     */
    cursor?: FastTrackScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FastTrackScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FastTrackScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FastTrackScans.
     */
    distinct?: FastTrackScanScalarFieldEnum | FastTrackScanScalarFieldEnum[]
  }

  /**
   * FastTrackScan findMany
   */
  export type FastTrackScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter, which FastTrackScans to fetch.
     */
    where?: FastTrackScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FastTrackScans to fetch.
     */
    orderBy?: FastTrackScanOrderByWithRelationInput | FastTrackScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FastTrackScans.
     */
    cursor?: FastTrackScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FastTrackScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FastTrackScans.
     */
    skip?: number
    distinct?: FastTrackScanScalarFieldEnum | FastTrackScanScalarFieldEnum[]
  }

  /**
   * FastTrackScan create
   */
  export type FastTrackScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * The data needed to create a FastTrackScan.
     */
    data: XOR<FastTrackScanCreateInput, FastTrackScanUncheckedCreateInput>
  }

  /**
   * FastTrackScan createMany
   */
  export type FastTrackScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FastTrackScans.
     */
    data: FastTrackScanCreateManyInput | FastTrackScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FastTrackScan update
   */
  export type FastTrackScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * The data needed to update a FastTrackScan.
     */
    data: XOR<FastTrackScanUpdateInput, FastTrackScanUncheckedUpdateInput>
    /**
     * Choose, which FastTrackScan to update.
     */
    where: FastTrackScanWhereUniqueInput
  }

  /**
   * FastTrackScan updateMany
   */
  export type FastTrackScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FastTrackScans.
     */
    data: XOR<FastTrackScanUpdateManyMutationInput, FastTrackScanUncheckedUpdateManyInput>
    /**
     * Filter which FastTrackScans to update
     */
    where?: FastTrackScanWhereInput
    /**
     * Limit how many FastTrackScans to update.
     */
    limit?: number
  }

  /**
   * FastTrackScan upsert
   */
  export type FastTrackScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * The filter to search for the FastTrackScan to update in case it exists.
     */
    where: FastTrackScanWhereUniqueInput
    /**
     * In case the FastTrackScan found by the `where` argument doesn't exist, create a new FastTrackScan with this data.
     */
    create: XOR<FastTrackScanCreateInput, FastTrackScanUncheckedCreateInput>
    /**
     * In case the FastTrackScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FastTrackScanUpdateInput, FastTrackScanUncheckedUpdateInput>
  }

  /**
   * FastTrackScan delete
   */
  export type FastTrackScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
    /**
     * Filter which FastTrackScan to delete.
     */
    where: FastTrackScanWhereUniqueInput
  }

  /**
   * FastTrackScan deleteMany
   */
  export type FastTrackScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FastTrackScans to delete
     */
    where?: FastTrackScanWhereInput
    /**
     * Limit how many FastTrackScans to delete.
     */
    limit?: number
  }

  /**
   * FastTrackScan without action
   */
  export type FastTrackScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FastTrackScan
     */
    select?: FastTrackScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FastTrackScan
     */
    omit?: FastTrackScanOmit<ExtArgs> | null
  }


  /**
   * Model FR0Scan
   */

  export type AggregateFR0Scan = {
    _count: FR0ScanCountAggregateOutputType | null
    _avg: FR0ScanAvgAggregateOutputType | null
    _sum: FR0ScanSumAggregateOutputType | null
    _min: FR0ScanMinAggregateOutputType | null
    _max: FR0ScanMaxAggregateOutputType | null
  }

  export type FR0ScanAvgAggregateOutputType = {
    id: number | null
  }

  export type FR0ScanSumAggregateOutputType = {
    id: number | null
  }

  export type FR0ScanMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    createdAt: Date | null
  }

  export type FR0ScanMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    createdAt: Date | null
  }

  export type FR0ScanCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    createdAt: number
    _all: number
  }


  export type FR0ScanAvgAggregateInputType = {
    id?: true
  }

  export type FR0ScanSumAggregateInputType = {
    id?: true
  }

  export type FR0ScanMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    createdAt?: true
  }

  export type FR0ScanMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    createdAt?: true
  }

  export type FR0ScanCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    createdAt?: true
    _all?: true
  }

  export type FR0ScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FR0Scan to aggregate.
     */
    where?: FR0ScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0Scans to fetch.
     */
    orderBy?: FR0ScanOrderByWithRelationInput | FR0ScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FR0ScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0Scans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0Scans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FR0Scans
    **/
    _count?: true | FR0ScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FR0ScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FR0ScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FR0ScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FR0ScanMaxAggregateInputType
  }

  export type GetFR0ScanAggregateType<T extends FR0ScanAggregateArgs> = {
        [P in keyof T & keyof AggregateFR0Scan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFR0Scan[P]>
      : GetScalarType<T[P], AggregateFR0Scan[P]>
  }




  export type FR0ScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FR0ScanWhereInput
    orderBy?: FR0ScanOrderByWithAggregationInput | FR0ScanOrderByWithAggregationInput[]
    by: FR0ScanScalarFieldEnum[] | FR0ScanScalarFieldEnum
    having?: FR0ScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FR0ScanCountAggregateInputType | true
    _avg?: FR0ScanAvgAggregateInputType
    _sum?: FR0ScanSumAggregateInputType
    _min?: FR0ScanMinAggregateInputType
    _max?: FR0ScanMaxAggregateInputType
  }

  export type FR0ScanGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    createdAt: Date
    _count: FR0ScanCountAggregateOutputType | null
    _avg: FR0ScanAvgAggregateOutputType | null
    _sum: FR0ScanSumAggregateOutputType | null
    _min: FR0ScanMinAggregateOutputType | null
    _max: FR0ScanMaxAggregateOutputType | null
  }

  type GetFR0ScanGroupByPayload<T extends FR0ScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FR0ScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FR0ScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FR0ScanGroupByOutputType[P]>
            : GetScalarType<T[P], FR0ScanGroupByOutputType[P]>
        }
      >
    >


  export type FR0ScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fR0Scan"]>



  export type FR0ScanSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    createdAt?: boolean
  }

  export type FR0ScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "createdAt", ExtArgs["result"]["fR0Scan"]>

  export type $FR0ScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FR0Scan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      createdAt: Date
    }, ExtArgs["result"]["fR0Scan"]>
    composites: {}
  }

  type FR0ScanGetPayload<S extends boolean | null | undefined | FR0ScanDefaultArgs> = $Result.GetResult<Prisma.$FR0ScanPayload, S>

  type FR0ScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FR0ScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FR0ScanCountAggregateInputType | true
    }

  export interface FR0ScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FR0Scan'], meta: { name: 'FR0Scan' } }
    /**
     * Find zero or one FR0Scan that matches the filter.
     * @param {FR0ScanFindUniqueArgs} args - Arguments to find a FR0Scan
     * @example
     * // Get one FR0Scan
     * const fR0Scan = await prisma.fR0Scan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FR0ScanFindUniqueArgs>(args: SelectSubset<T, FR0ScanFindUniqueArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FR0Scan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FR0ScanFindUniqueOrThrowArgs} args - Arguments to find a FR0Scan
     * @example
     * // Get one FR0Scan
     * const fR0Scan = await prisma.fR0Scan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FR0ScanFindUniqueOrThrowArgs>(args: SelectSubset<T, FR0ScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FR0Scan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanFindFirstArgs} args - Arguments to find a FR0Scan
     * @example
     * // Get one FR0Scan
     * const fR0Scan = await prisma.fR0Scan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FR0ScanFindFirstArgs>(args?: SelectSubset<T, FR0ScanFindFirstArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FR0Scan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanFindFirstOrThrowArgs} args - Arguments to find a FR0Scan
     * @example
     * // Get one FR0Scan
     * const fR0Scan = await prisma.fR0Scan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FR0ScanFindFirstOrThrowArgs>(args?: SelectSubset<T, FR0ScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FR0Scans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FR0Scans
     * const fR0Scans = await prisma.fR0Scan.findMany()
     * 
     * // Get first 10 FR0Scans
     * const fR0Scans = await prisma.fR0Scan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fR0ScanWithIdOnly = await prisma.fR0Scan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FR0ScanFindManyArgs>(args?: SelectSubset<T, FR0ScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FR0Scan.
     * @param {FR0ScanCreateArgs} args - Arguments to create a FR0Scan.
     * @example
     * // Create one FR0Scan
     * const FR0Scan = await prisma.fR0Scan.create({
     *   data: {
     *     // ... data to create a FR0Scan
     *   }
     * })
     * 
     */
    create<T extends FR0ScanCreateArgs>(args: SelectSubset<T, FR0ScanCreateArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FR0Scans.
     * @param {FR0ScanCreateManyArgs} args - Arguments to create many FR0Scans.
     * @example
     * // Create many FR0Scans
     * const fR0Scan = await prisma.fR0Scan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FR0ScanCreateManyArgs>(args?: SelectSubset<T, FR0ScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FR0Scan.
     * @param {FR0ScanDeleteArgs} args - Arguments to delete one FR0Scan.
     * @example
     * // Delete one FR0Scan
     * const FR0Scan = await prisma.fR0Scan.delete({
     *   where: {
     *     // ... filter to delete one FR0Scan
     *   }
     * })
     * 
     */
    delete<T extends FR0ScanDeleteArgs>(args: SelectSubset<T, FR0ScanDeleteArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FR0Scan.
     * @param {FR0ScanUpdateArgs} args - Arguments to update one FR0Scan.
     * @example
     * // Update one FR0Scan
     * const fR0Scan = await prisma.fR0Scan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FR0ScanUpdateArgs>(args: SelectSubset<T, FR0ScanUpdateArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FR0Scans.
     * @param {FR0ScanDeleteManyArgs} args - Arguments to filter FR0Scans to delete.
     * @example
     * // Delete a few FR0Scans
     * const { count } = await prisma.fR0Scan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FR0ScanDeleteManyArgs>(args?: SelectSubset<T, FR0ScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FR0Scans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FR0Scans
     * const fR0Scan = await prisma.fR0Scan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FR0ScanUpdateManyArgs>(args: SelectSubset<T, FR0ScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FR0Scan.
     * @param {FR0ScanUpsertArgs} args - Arguments to update or create a FR0Scan.
     * @example
     * // Update or create a FR0Scan
     * const fR0Scan = await prisma.fR0Scan.upsert({
     *   create: {
     *     // ... data to create a FR0Scan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FR0Scan we want to update
     *   }
     * })
     */
    upsert<T extends FR0ScanUpsertArgs>(args: SelectSubset<T, FR0ScanUpsertArgs<ExtArgs>>): Prisma__FR0ScanClient<$Result.GetResult<Prisma.$FR0ScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FR0Scans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanCountArgs} args - Arguments to filter FR0Scans to count.
     * @example
     * // Count the number of FR0Scans
     * const count = await prisma.fR0Scan.count({
     *   where: {
     *     // ... the filter for the FR0Scans we want to count
     *   }
     * })
    **/
    count<T extends FR0ScanCountArgs>(
      args?: Subset<T, FR0ScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FR0ScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FR0Scan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FR0ScanAggregateArgs>(args: Subset<T, FR0ScanAggregateArgs>): Prisma.PrismaPromise<GetFR0ScanAggregateType<T>>

    /**
     * Group by FR0Scan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0ScanGroupByArgs} args - Group by arguments.
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
      T extends FR0ScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FR0ScanGroupByArgs['orderBy'] }
        : { orderBy?: FR0ScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FR0ScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFR0ScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FR0Scan model
   */
  readonly fields: FR0ScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FR0Scan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FR0ScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the FR0Scan model
   */
  interface FR0ScanFieldRefs {
    readonly id: FieldRef<"FR0Scan", 'Int'>
    readonly scanId: FieldRef<"FR0Scan", 'String'>
    readonly stationId: FieldRef<"FR0Scan", 'String'>
    readonly nexsId: FieldRef<"FR0Scan", 'String'>
    readonly createdAt: FieldRef<"FR0Scan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FR0Scan findUnique
   */
  export type FR0ScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter, which FR0Scan to fetch.
     */
    where: FR0ScanWhereUniqueInput
  }

  /**
   * FR0Scan findUniqueOrThrow
   */
  export type FR0ScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter, which FR0Scan to fetch.
     */
    where: FR0ScanWhereUniqueInput
  }

  /**
   * FR0Scan findFirst
   */
  export type FR0ScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter, which FR0Scan to fetch.
     */
    where?: FR0ScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0Scans to fetch.
     */
    orderBy?: FR0ScanOrderByWithRelationInput | FR0ScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FR0Scans.
     */
    cursor?: FR0ScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0Scans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0Scans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FR0Scans.
     */
    distinct?: FR0ScanScalarFieldEnum | FR0ScanScalarFieldEnum[]
  }

  /**
   * FR0Scan findFirstOrThrow
   */
  export type FR0ScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter, which FR0Scan to fetch.
     */
    where?: FR0ScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0Scans to fetch.
     */
    orderBy?: FR0ScanOrderByWithRelationInput | FR0ScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FR0Scans.
     */
    cursor?: FR0ScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0Scans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0Scans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FR0Scans.
     */
    distinct?: FR0ScanScalarFieldEnum | FR0ScanScalarFieldEnum[]
  }

  /**
   * FR0Scan findMany
   */
  export type FR0ScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter, which FR0Scans to fetch.
     */
    where?: FR0ScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0Scans to fetch.
     */
    orderBy?: FR0ScanOrderByWithRelationInput | FR0ScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FR0Scans.
     */
    cursor?: FR0ScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0Scans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0Scans.
     */
    skip?: number
    distinct?: FR0ScanScalarFieldEnum | FR0ScanScalarFieldEnum[]
  }

  /**
   * FR0Scan create
   */
  export type FR0ScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * The data needed to create a FR0Scan.
     */
    data: XOR<FR0ScanCreateInput, FR0ScanUncheckedCreateInput>
  }

  /**
   * FR0Scan createMany
   */
  export type FR0ScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FR0Scans.
     */
    data: FR0ScanCreateManyInput | FR0ScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FR0Scan update
   */
  export type FR0ScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * The data needed to update a FR0Scan.
     */
    data: XOR<FR0ScanUpdateInput, FR0ScanUncheckedUpdateInput>
    /**
     * Choose, which FR0Scan to update.
     */
    where: FR0ScanWhereUniqueInput
  }

  /**
   * FR0Scan updateMany
   */
  export type FR0ScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FR0Scans.
     */
    data: XOR<FR0ScanUpdateManyMutationInput, FR0ScanUncheckedUpdateManyInput>
    /**
     * Filter which FR0Scans to update
     */
    where?: FR0ScanWhereInput
    /**
     * Limit how many FR0Scans to update.
     */
    limit?: number
  }

  /**
   * FR0Scan upsert
   */
  export type FR0ScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * The filter to search for the FR0Scan to update in case it exists.
     */
    where: FR0ScanWhereUniqueInput
    /**
     * In case the FR0Scan found by the `where` argument doesn't exist, create a new FR0Scan with this data.
     */
    create: XOR<FR0ScanCreateInput, FR0ScanUncheckedCreateInput>
    /**
     * In case the FR0Scan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FR0ScanUpdateInput, FR0ScanUncheckedUpdateInput>
  }

  /**
   * FR0Scan delete
   */
  export type FR0ScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
    /**
     * Filter which FR0Scan to delete.
     */
    where: FR0ScanWhereUniqueInput
  }

  /**
   * FR0Scan deleteMany
   */
  export type FR0ScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FR0Scans to delete
     */
    where?: FR0ScanWhereInput
    /**
     * Limit how many FR0Scans to delete.
     */
    limit?: number
  }

  /**
   * FR0Scan without action
   */
  export type FR0ScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0Scan
     */
    select?: FR0ScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0Scan
     */
    omit?: FR0ScanOmit<ExtArgs> | null
  }


  /**
   * Model BulkScan
   */

  export type AggregateBulkScan = {
    _count: BulkScanCountAggregateOutputType | null
    _avg: BulkScanAvgAggregateOutputType | null
    _sum: BulkScanSumAggregateOutputType | null
    _min: BulkScanMinAggregateOutputType | null
    _max: BulkScanMaxAggregateOutputType | null
  }

  export type BulkScanAvgAggregateOutputType = {
    id: number | null
  }

  export type BulkScanSumAggregateOutputType = {
    id: number | null
  }

  export type BulkScanMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type BulkScanMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type BulkScanCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    timestamp: number
    _all: number
  }


  export type BulkScanAvgAggregateInputType = {
    id?: true
  }

  export type BulkScanSumAggregateInputType = {
    id?: true
  }

  export type BulkScanMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type BulkScanMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type BulkScanCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
    _all?: true
  }

  export type BulkScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkScan to aggregate.
     */
    where?: BulkScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkScans to fetch.
     */
    orderBy?: BulkScanOrderByWithRelationInput | BulkScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BulkScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BulkScans
    **/
    _count?: true | BulkScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BulkScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BulkScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BulkScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BulkScanMaxAggregateInputType
  }

  export type GetBulkScanAggregateType<T extends BulkScanAggregateArgs> = {
        [P in keyof T & keyof AggregateBulkScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBulkScan[P]>
      : GetScalarType<T[P], AggregateBulkScan[P]>
  }




  export type BulkScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BulkScanWhereInput
    orderBy?: BulkScanOrderByWithAggregationInput | BulkScanOrderByWithAggregationInput[]
    by: BulkScanScalarFieldEnum[] | BulkScanScalarFieldEnum
    having?: BulkScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BulkScanCountAggregateInputType | true
    _avg?: BulkScanAvgAggregateInputType
    _sum?: BulkScanSumAggregateInputType
    _min?: BulkScanMinAggregateInputType
    _max?: BulkScanMaxAggregateInputType
  }

  export type BulkScanGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp: Date
    _count: BulkScanCountAggregateOutputType | null
    _avg: BulkScanAvgAggregateOutputType | null
    _sum: BulkScanSumAggregateOutputType | null
    _min: BulkScanMinAggregateOutputType | null
    _max: BulkScanMaxAggregateOutputType | null
  }

  type GetBulkScanGroupByPayload<T extends BulkScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BulkScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BulkScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BulkScanGroupByOutputType[P]>
            : GetScalarType<T[P], BulkScanGroupByOutputType[P]>
        }
      >
    >


  export type BulkScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["bulkScan"]>



  export type BulkScanSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }

  export type BulkScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "timestamp", ExtArgs["result"]["bulkScan"]>

  export type $BulkScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BulkScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      timestamp: Date
    }, ExtArgs["result"]["bulkScan"]>
    composites: {}
  }

  type BulkScanGetPayload<S extends boolean | null | undefined | BulkScanDefaultArgs> = $Result.GetResult<Prisma.$BulkScanPayload, S>

  type BulkScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BulkScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BulkScanCountAggregateInputType | true
    }

  export interface BulkScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BulkScan'], meta: { name: 'BulkScan' } }
    /**
     * Find zero or one BulkScan that matches the filter.
     * @param {BulkScanFindUniqueArgs} args - Arguments to find a BulkScan
     * @example
     * // Get one BulkScan
     * const bulkScan = await prisma.bulkScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BulkScanFindUniqueArgs>(args: SelectSubset<T, BulkScanFindUniqueArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BulkScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BulkScanFindUniqueOrThrowArgs} args - Arguments to find a BulkScan
     * @example
     * // Get one BulkScan
     * const bulkScan = await prisma.bulkScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BulkScanFindUniqueOrThrowArgs>(args: SelectSubset<T, BulkScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BulkScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanFindFirstArgs} args - Arguments to find a BulkScan
     * @example
     * // Get one BulkScan
     * const bulkScan = await prisma.bulkScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BulkScanFindFirstArgs>(args?: SelectSubset<T, BulkScanFindFirstArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BulkScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanFindFirstOrThrowArgs} args - Arguments to find a BulkScan
     * @example
     * // Get one BulkScan
     * const bulkScan = await prisma.bulkScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BulkScanFindFirstOrThrowArgs>(args?: SelectSubset<T, BulkScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BulkScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BulkScans
     * const bulkScans = await prisma.bulkScan.findMany()
     * 
     * // Get first 10 BulkScans
     * const bulkScans = await prisma.bulkScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bulkScanWithIdOnly = await prisma.bulkScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BulkScanFindManyArgs>(args?: SelectSubset<T, BulkScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BulkScan.
     * @param {BulkScanCreateArgs} args - Arguments to create a BulkScan.
     * @example
     * // Create one BulkScan
     * const BulkScan = await prisma.bulkScan.create({
     *   data: {
     *     // ... data to create a BulkScan
     *   }
     * })
     * 
     */
    create<T extends BulkScanCreateArgs>(args: SelectSubset<T, BulkScanCreateArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BulkScans.
     * @param {BulkScanCreateManyArgs} args - Arguments to create many BulkScans.
     * @example
     * // Create many BulkScans
     * const bulkScan = await prisma.bulkScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BulkScanCreateManyArgs>(args?: SelectSubset<T, BulkScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BulkScan.
     * @param {BulkScanDeleteArgs} args - Arguments to delete one BulkScan.
     * @example
     * // Delete one BulkScan
     * const BulkScan = await prisma.bulkScan.delete({
     *   where: {
     *     // ... filter to delete one BulkScan
     *   }
     * })
     * 
     */
    delete<T extends BulkScanDeleteArgs>(args: SelectSubset<T, BulkScanDeleteArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BulkScan.
     * @param {BulkScanUpdateArgs} args - Arguments to update one BulkScan.
     * @example
     * // Update one BulkScan
     * const bulkScan = await prisma.bulkScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BulkScanUpdateArgs>(args: SelectSubset<T, BulkScanUpdateArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BulkScans.
     * @param {BulkScanDeleteManyArgs} args - Arguments to filter BulkScans to delete.
     * @example
     * // Delete a few BulkScans
     * const { count } = await prisma.bulkScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BulkScanDeleteManyArgs>(args?: SelectSubset<T, BulkScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BulkScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BulkScans
     * const bulkScan = await prisma.bulkScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BulkScanUpdateManyArgs>(args: SelectSubset<T, BulkScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BulkScan.
     * @param {BulkScanUpsertArgs} args - Arguments to update or create a BulkScan.
     * @example
     * // Update or create a BulkScan
     * const bulkScan = await prisma.bulkScan.upsert({
     *   create: {
     *     // ... data to create a BulkScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BulkScan we want to update
     *   }
     * })
     */
    upsert<T extends BulkScanUpsertArgs>(args: SelectSubset<T, BulkScanUpsertArgs<ExtArgs>>): Prisma__BulkScanClient<$Result.GetResult<Prisma.$BulkScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BulkScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanCountArgs} args - Arguments to filter BulkScans to count.
     * @example
     * // Count the number of BulkScans
     * const count = await prisma.bulkScan.count({
     *   where: {
     *     // ... the filter for the BulkScans we want to count
     *   }
     * })
    **/
    count<T extends BulkScanCountArgs>(
      args?: Subset<T, BulkScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BulkScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BulkScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BulkScanAggregateArgs>(args: Subset<T, BulkScanAggregateArgs>): Prisma.PrismaPromise<GetBulkScanAggregateType<T>>

    /**
     * Group by BulkScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkScanGroupByArgs} args - Group by arguments.
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
      T extends BulkScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BulkScanGroupByArgs['orderBy'] }
        : { orderBy?: BulkScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BulkScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBulkScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BulkScan model
   */
  readonly fields: BulkScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BulkScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BulkScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the BulkScan model
   */
  interface BulkScanFieldRefs {
    readonly id: FieldRef<"BulkScan", 'Int'>
    readonly scanId: FieldRef<"BulkScan", 'String'>
    readonly stationId: FieldRef<"BulkScan", 'String'>
    readonly nexsId: FieldRef<"BulkScan", 'String'>
    readonly timestamp: FieldRef<"BulkScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BulkScan findUnique
   */
  export type BulkScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter, which BulkScan to fetch.
     */
    where: BulkScanWhereUniqueInput
  }

  /**
   * BulkScan findUniqueOrThrow
   */
  export type BulkScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter, which BulkScan to fetch.
     */
    where: BulkScanWhereUniqueInput
  }

  /**
   * BulkScan findFirst
   */
  export type BulkScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter, which BulkScan to fetch.
     */
    where?: BulkScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkScans to fetch.
     */
    orderBy?: BulkScanOrderByWithRelationInput | BulkScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkScans.
     */
    cursor?: BulkScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkScans.
     */
    distinct?: BulkScanScalarFieldEnum | BulkScanScalarFieldEnum[]
  }

  /**
   * BulkScan findFirstOrThrow
   */
  export type BulkScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter, which BulkScan to fetch.
     */
    where?: BulkScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkScans to fetch.
     */
    orderBy?: BulkScanOrderByWithRelationInput | BulkScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkScans.
     */
    cursor?: BulkScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkScans.
     */
    distinct?: BulkScanScalarFieldEnum | BulkScanScalarFieldEnum[]
  }

  /**
   * BulkScan findMany
   */
  export type BulkScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter, which BulkScans to fetch.
     */
    where?: BulkScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkScans to fetch.
     */
    orderBy?: BulkScanOrderByWithRelationInput | BulkScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BulkScans.
     */
    cursor?: BulkScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkScans.
     */
    skip?: number
    distinct?: BulkScanScalarFieldEnum | BulkScanScalarFieldEnum[]
  }

  /**
   * BulkScan create
   */
  export type BulkScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * The data needed to create a BulkScan.
     */
    data: XOR<BulkScanCreateInput, BulkScanUncheckedCreateInput>
  }

  /**
   * BulkScan createMany
   */
  export type BulkScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BulkScans.
     */
    data: BulkScanCreateManyInput | BulkScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BulkScan update
   */
  export type BulkScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * The data needed to update a BulkScan.
     */
    data: XOR<BulkScanUpdateInput, BulkScanUncheckedUpdateInput>
    /**
     * Choose, which BulkScan to update.
     */
    where: BulkScanWhereUniqueInput
  }

  /**
   * BulkScan updateMany
   */
  export type BulkScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BulkScans.
     */
    data: XOR<BulkScanUpdateManyMutationInput, BulkScanUncheckedUpdateManyInput>
    /**
     * Filter which BulkScans to update
     */
    where?: BulkScanWhereInput
    /**
     * Limit how many BulkScans to update.
     */
    limit?: number
  }

  /**
   * BulkScan upsert
   */
  export type BulkScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * The filter to search for the BulkScan to update in case it exists.
     */
    where: BulkScanWhereUniqueInput
    /**
     * In case the BulkScan found by the `where` argument doesn't exist, create a new BulkScan with this data.
     */
    create: XOR<BulkScanCreateInput, BulkScanUncheckedCreateInput>
    /**
     * In case the BulkScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BulkScanUpdateInput, BulkScanUncheckedUpdateInput>
  }

  /**
   * BulkScan delete
   */
  export type BulkScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
    /**
     * Filter which BulkScan to delete.
     */
    where: BulkScanWhereUniqueInput
  }

  /**
   * BulkScan deleteMany
   */
  export type BulkScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkScans to delete
     */
    where?: BulkScanWhereInput
    /**
     * Limit how many BulkScans to delete.
     */
    limit?: number
  }

  /**
   * BulkScan without action
   */
  export type BulkScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkScan
     */
    select?: BulkScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BulkScan
     */
    omit?: BulkScanOmit<ExtArgs> | null
  }


  /**
   * Model ManualWarehouse
   */

  export type AggregateManualWarehouse = {
    _count: ManualWarehouseCountAggregateOutputType | null
    _avg: ManualWarehouseAvgAggregateOutputType | null
    _sum: ManualWarehouseSumAggregateOutputType | null
    _min: ManualWarehouseMinAggregateOutputType | null
    _max: ManualWarehouseMaxAggregateOutputType | null
  }

  export type ManualWarehouseAvgAggregateOutputType = {
    id: number | null
  }

  export type ManualWarehouseSumAggregateOutputType = {
    id: number | null
  }

  export type ManualWarehouseMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type ManualWarehouseMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type ManualWarehouseCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    timestamp: number
    _all: number
  }


  export type ManualWarehouseAvgAggregateInputType = {
    id?: true
  }

  export type ManualWarehouseSumAggregateInputType = {
    id?: true
  }

  export type ManualWarehouseMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type ManualWarehouseMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type ManualWarehouseCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
    _all?: true
  }

  export type ManualWarehouseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManualWarehouse to aggregate.
     */
    where?: ManualWarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouses to fetch.
     */
    orderBy?: ManualWarehouseOrderByWithRelationInput | ManualWarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManualWarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ManualWarehouses
    **/
    _count?: true | ManualWarehouseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManualWarehouseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManualWarehouseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManualWarehouseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManualWarehouseMaxAggregateInputType
  }

  export type GetManualWarehouseAggregateType<T extends ManualWarehouseAggregateArgs> = {
        [P in keyof T & keyof AggregateManualWarehouse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManualWarehouse[P]>
      : GetScalarType<T[P], AggregateManualWarehouse[P]>
  }




  export type ManualWarehouseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManualWarehouseWhereInput
    orderBy?: ManualWarehouseOrderByWithAggregationInput | ManualWarehouseOrderByWithAggregationInput[]
    by: ManualWarehouseScalarFieldEnum[] | ManualWarehouseScalarFieldEnum
    having?: ManualWarehouseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManualWarehouseCountAggregateInputType | true
    _avg?: ManualWarehouseAvgAggregateInputType
    _sum?: ManualWarehouseSumAggregateInputType
    _min?: ManualWarehouseMinAggregateInputType
    _max?: ManualWarehouseMaxAggregateInputType
  }

  export type ManualWarehouseGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp: Date
    _count: ManualWarehouseCountAggregateOutputType | null
    _avg: ManualWarehouseAvgAggregateOutputType | null
    _sum: ManualWarehouseSumAggregateOutputType | null
    _min: ManualWarehouseMinAggregateOutputType | null
    _max: ManualWarehouseMaxAggregateOutputType | null
  }

  type GetManualWarehouseGroupByPayload<T extends ManualWarehouseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManualWarehouseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManualWarehouseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManualWarehouseGroupByOutputType[P]>
            : GetScalarType<T[P], ManualWarehouseGroupByOutputType[P]>
        }
      >
    >


  export type ManualWarehouseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["manualWarehouse"]>



  export type ManualWarehouseSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }

  export type ManualWarehouseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "timestamp", ExtArgs["result"]["manualWarehouse"]>

  export type $ManualWarehousePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ManualWarehouse"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      timestamp: Date
    }, ExtArgs["result"]["manualWarehouse"]>
    composites: {}
  }

  type ManualWarehouseGetPayload<S extends boolean | null | undefined | ManualWarehouseDefaultArgs> = $Result.GetResult<Prisma.$ManualWarehousePayload, S>

  type ManualWarehouseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManualWarehouseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManualWarehouseCountAggregateInputType | true
    }

  export interface ManualWarehouseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ManualWarehouse'], meta: { name: 'ManualWarehouse' } }
    /**
     * Find zero or one ManualWarehouse that matches the filter.
     * @param {ManualWarehouseFindUniqueArgs} args - Arguments to find a ManualWarehouse
     * @example
     * // Get one ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManualWarehouseFindUniqueArgs>(args: SelectSubset<T, ManualWarehouseFindUniqueArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ManualWarehouse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManualWarehouseFindUniqueOrThrowArgs} args - Arguments to find a ManualWarehouse
     * @example
     * // Get one ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManualWarehouseFindUniqueOrThrowArgs>(args: SelectSubset<T, ManualWarehouseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManualWarehouse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseFindFirstArgs} args - Arguments to find a ManualWarehouse
     * @example
     * // Get one ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManualWarehouseFindFirstArgs>(args?: SelectSubset<T, ManualWarehouseFindFirstArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManualWarehouse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseFindFirstOrThrowArgs} args - Arguments to find a ManualWarehouse
     * @example
     * // Get one ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManualWarehouseFindFirstOrThrowArgs>(args?: SelectSubset<T, ManualWarehouseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ManualWarehouses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ManualWarehouses
     * const manualWarehouses = await prisma.manualWarehouse.findMany()
     * 
     * // Get first 10 ManualWarehouses
     * const manualWarehouses = await prisma.manualWarehouse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const manualWarehouseWithIdOnly = await prisma.manualWarehouse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManualWarehouseFindManyArgs>(args?: SelectSubset<T, ManualWarehouseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ManualWarehouse.
     * @param {ManualWarehouseCreateArgs} args - Arguments to create a ManualWarehouse.
     * @example
     * // Create one ManualWarehouse
     * const ManualWarehouse = await prisma.manualWarehouse.create({
     *   data: {
     *     // ... data to create a ManualWarehouse
     *   }
     * })
     * 
     */
    create<T extends ManualWarehouseCreateArgs>(args: SelectSubset<T, ManualWarehouseCreateArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ManualWarehouses.
     * @param {ManualWarehouseCreateManyArgs} args - Arguments to create many ManualWarehouses.
     * @example
     * // Create many ManualWarehouses
     * const manualWarehouse = await prisma.manualWarehouse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManualWarehouseCreateManyArgs>(args?: SelectSubset<T, ManualWarehouseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ManualWarehouse.
     * @param {ManualWarehouseDeleteArgs} args - Arguments to delete one ManualWarehouse.
     * @example
     * // Delete one ManualWarehouse
     * const ManualWarehouse = await prisma.manualWarehouse.delete({
     *   where: {
     *     // ... filter to delete one ManualWarehouse
     *   }
     * })
     * 
     */
    delete<T extends ManualWarehouseDeleteArgs>(args: SelectSubset<T, ManualWarehouseDeleteArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ManualWarehouse.
     * @param {ManualWarehouseUpdateArgs} args - Arguments to update one ManualWarehouse.
     * @example
     * // Update one ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManualWarehouseUpdateArgs>(args: SelectSubset<T, ManualWarehouseUpdateArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ManualWarehouses.
     * @param {ManualWarehouseDeleteManyArgs} args - Arguments to filter ManualWarehouses to delete.
     * @example
     * // Delete a few ManualWarehouses
     * const { count } = await prisma.manualWarehouse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManualWarehouseDeleteManyArgs>(args?: SelectSubset<T, ManualWarehouseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManualWarehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ManualWarehouses
     * const manualWarehouse = await prisma.manualWarehouse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManualWarehouseUpdateManyArgs>(args: SelectSubset<T, ManualWarehouseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ManualWarehouse.
     * @param {ManualWarehouseUpsertArgs} args - Arguments to update or create a ManualWarehouse.
     * @example
     * // Update or create a ManualWarehouse
     * const manualWarehouse = await prisma.manualWarehouse.upsert({
     *   create: {
     *     // ... data to create a ManualWarehouse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ManualWarehouse we want to update
     *   }
     * })
     */
    upsert<T extends ManualWarehouseUpsertArgs>(args: SelectSubset<T, ManualWarehouseUpsertArgs<ExtArgs>>): Prisma__ManualWarehouseClient<$Result.GetResult<Prisma.$ManualWarehousePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ManualWarehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseCountArgs} args - Arguments to filter ManualWarehouses to count.
     * @example
     * // Count the number of ManualWarehouses
     * const count = await prisma.manualWarehouse.count({
     *   where: {
     *     // ... the filter for the ManualWarehouses we want to count
     *   }
     * })
    **/
    count<T extends ManualWarehouseCountArgs>(
      args?: Subset<T, ManualWarehouseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManualWarehouseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ManualWarehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ManualWarehouseAggregateArgs>(args: Subset<T, ManualWarehouseAggregateArgs>): Prisma.PrismaPromise<GetManualWarehouseAggregateType<T>>

    /**
     * Group by ManualWarehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseGroupByArgs} args - Group by arguments.
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
      T extends ManualWarehouseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManualWarehouseGroupByArgs['orderBy'] }
        : { orderBy?: ManualWarehouseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ManualWarehouseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManualWarehouseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ManualWarehouse model
   */
  readonly fields: ManualWarehouseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ManualWarehouse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManualWarehouseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ManualWarehouse model
   */
  interface ManualWarehouseFieldRefs {
    readonly id: FieldRef<"ManualWarehouse", 'Int'>
    readonly scanId: FieldRef<"ManualWarehouse", 'String'>
    readonly stationId: FieldRef<"ManualWarehouse", 'String'>
    readonly nexsId: FieldRef<"ManualWarehouse", 'String'>
    readonly timestamp: FieldRef<"ManualWarehouse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ManualWarehouse findUnique
   */
  export type ManualWarehouseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouse to fetch.
     */
    where: ManualWarehouseWhereUniqueInput
  }

  /**
   * ManualWarehouse findUniqueOrThrow
   */
  export type ManualWarehouseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouse to fetch.
     */
    where: ManualWarehouseWhereUniqueInput
  }

  /**
   * ManualWarehouse findFirst
   */
  export type ManualWarehouseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouse to fetch.
     */
    where?: ManualWarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouses to fetch.
     */
    orderBy?: ManualWarehouseOrderByWithRelationInput | ManualWarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManualWarehouses.
     */
    cursor?: ManualWarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManualWarehouses.
     */
    distinct?: ManualWarehouseScalarFieldEnum | ManualWarehouseScalarFieldEnum[]
  }

  /**
   * ManualWarehouse findFirstOrThrow
   */
  export type ManualWarehouseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouse to fetch.
     */
    where?: ManualWarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouses to fetch.
     */
    orderBy?: ManualWarehouseOrderByWithRelationInput | ManualWarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManualWarehouses.
     */
    cursor?: ManualWarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManualWarehouses.
     */
    distinct?: ManualWarehouseScalarFieldEnum | ManualWarehouseScalarFieldEnum[]
  }

  /**
   * ManualWarehouse findMany
   */
  export type ManualWarehouseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouses to fetch.
     */
    where?: ManualWarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouses to fetch.
     */
    orderBy?: ManualWarehouseOrderByWithRelationInput | ManualWarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ManualWarehouses.
     */
    cursor?: ManualWarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouses.
     */
    skip?: number
    distinct?: ManualWarehouseScalarFieldEnum | ManualWarehouseScalarFieldEnum[]
  }

  /**
   * ManualWarehouse create
   */
  export type ManualWarehouseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * The data needed to create a ManualWarehouse.
     */
    data: XOR<ManualWarehouseCreateInput, ManualWarehouseUncheckedCreateInput>
  }

  /**
   * ManualWarehouse createMany
   */
  export type ManualWarehouseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ManualWarehouses.
     */
    data: ManualWarehouseCreateManyInput | ManualWarehouseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ManualWarehouse update
   */
  export type ManualWarehouseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * The data needed to update a ManualWarehouse.
     */
    data: XOR<ManualWarehouseUpdateInput, ManualWarehouseUncheckedUpdateInput>
    /**
     * Choose, which ManualWarehouse to update.
     */
    where: ManualWarehouseWhereUniqueInput
  }

  /**
   * ManualWarehouse updateMany
   */
  export type ManualWarehouseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ManualWarehouses.
     */
    data: XOR<ManualWarehouseUpdateManyMutationInput, ManualWarehouseUncheckedUpdateManyInput>
    /**
     * Filter which ManualWarehouses to update
     */
    where?: ManualWarehouseWhereInput
    /**
     * Limit how many ManualWarehouses to update.
     */
    limit?: number
  }

  /**
   * ManualWarehouse upsert
   */
  export type ManualWarehouseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * The filter to search for the ManualWarehouse to update in case it exists.
     */
    where: ManualWarehouseWhereUniqueInput
    /**
     * In case the ManualWarehouse found by the `where` argument doesn't exist, create a new ManualWarehouse with this data.
     */
    create: XOR<ManualWarehouseCreateInput, ManualWarehouseUncheckedCreateInput>
    /**
     * In case the ManualWarehouse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManualWarehouseUpdateInput, ManualWarehouseUncheckedUpdateInput>
  }

  /**
   * ManualWarehouse delete
   */
  export type ManualWarehouseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
    /**
     * Filter which ManualWarehouse to delete.
     */
    where: ManualWarehouseWhereUniqueInput
  }

  /**
   * ManualWarehouse deleteMany
   */
  export type ManualWarehouseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManualWarehouses to delete
     */
    where?: ManualWarehouseWhereInput
    /**
     * Limit how many ManualWarehouses to delete.
     */
    limit?: number
  }

  /**
   * ManualWarehouse without action
   */
  export type ManualWarehouseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouse
     */
    select?: ManualWarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouse
     */
    omit?: ManualWarehouseOmit<ExtArgs> | null
  }


  /**
   * Model EHSDeviation
   */

  export type AggregateEHSDeviation = {
    _count: EHSDeviationCountAggregateOutputType | null
    _avg: EHSDeviationAvgAggregateOutputType | null
    _sum: EHSDeviationSumAggregateOutputType | null
    _min: EHSDeviationMinAggregateOutputType | null
    _max: EHSDeviationMaxAggregateOutputType | null
  }

  export type EHSDeviationAvgAggregateOutputType = {
    id: number | null
  }

  export type EHSDeviationSumAggregateOutputType = {
    id: number | null
  }

  export type EHSDeviationMinAggregateOutputType = {
    id: number | null
    month: string | null
    date: Date | null
    timeOfRound: string | null
    location: string | null
    responsibleDepartment: string | null
    remarks: string | null
    observations: string | null
    photographBefore: string | null
    controlMeasures: string | null
    photographAfter: string | null
    categorization: string | null
    remarksByDepartment: string | null
    complianceStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    complianceDate: Date | null
  }

  export type EHSDeviationMaxAggregateOutputType = {
    id: number | null
    month: string | null
    date: Date | null
    timeOfRound: string | null
    location: string | null
    responsibleDepartment: string | null
    remarks: string | null
    observations: string | null
    photographBefore: string | null
    controlMeasures: string | null
    photographAfter: string | null
    categorization: string | null
    remarksByDepartment: string | null
    complianceStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    complianceDate: Date | null
  }

  export type EHSDeviationCountAggregateOutputType = {
    id: number
    month: number
    date: number
    timeOfRound: number
    location: number
    responsibleDepartment: number
    remarks: number
    observations: number
    photographBefore: number
    controlMeasures: number
    photographAfter: number
    categorization: number
    remarksByDepartment: number
    complianceStatus: number
    createdAt: number
    updatedAt: number
    complianceDate: number
    _all: number
  }


  export type EHSDeviationAvgAggregateInputType = {
    id?: true
  }

  export type EHSDeviationSumAggregateInputType = {
    id?: true
  }

  export type EHSDeviationMinAggregateInputType = {
    id?: true
    month?: true
    date?: true
    timeOfRound?: true
    location?: true
    responsibleDepartment?: true
    remarks?: true
    observations?: true
    photographBefore?: true
    controlMeasures?: true
    photographAfter?: true
    categorization?: true
    remarksByDepartment?: true
    complianceStatus?: true
    createdAt?: true
    updatedAt?: true
    complianceDate?: true
  }

  export type EHSDeviationMaxAggregateInputType = {
    id?: true
    month?: true
    date?: true
    timeOfRound?: true
    location?: true
    responsibleDepartment?: true
    remarks?: true
    observations?: true
    photographBefore?: true
    controlMeasures?: true
    photographAfter?: true
    categorization?: true
    remarksByDepartment?: true
    complianceStatus?: true
    createdAt?: true
    updatedAt?: true
    complianceDate?: true
  }

  export type EHSDeviationCountAggregateInputType = {
    id?: true
    month?: true
    date?: true
    timeOfRound?: true
    location?: true
    responsibleDepartment?: true
    remarks?: true
    observations?: true
    photographBefore?: true
    controlMeasures?: true
    photographAfter?: true
    categorization?: true
    remarksByDepartment?: true
    complianceStatus?: true
    createdAt?: true
    updatedAt?: true
    complianceDate?: true
    _all?: true
  }

  export type EHSDeviationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EHSDeviation to aggregate.
     */
    where?: EHSDeviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EHSDeviations to fetch.
     */
    orderBy?: EHSDeviationOrderByWithRelationInput | EHSDeviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EHSDeviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EHSDeviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EHSDeviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EHSDeviations
    **/
    _count?: true | EHSDeviationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EHSDeviationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EHSDeviationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EHSDeviationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EHSDeviationMaxAggregateInputType
  }

  export type GetEHSDeviationAggregateType<T extends EHSDeviationAggregateArgs> = {
        [P in keyof T & keyof AggregateEHSDeviation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEHSDeviation[P]>
      : GetScalarType<T[P], AggregateEHSDeviation[P]>
  }




  export type EHSDeviationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EHSDeviationWhereInput
    orderBy?: EHSDeviationOrderByWithAggregationInput | EHSDeviationOrderByWithAggregationInput[]
    by: EHSDeviationScalarFieldEnum[] | EHSDeviationScalarFieldEnum
    having?: EHSDeviationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EHSDeviationCountAggregateInputType | true
    _avg?: EHSDeviationAvgAggregateInputType
    _sum?: EHSDeviationSumAggregateInputType
    _min?: EHSDeviationMinAggregateInputType
    _max?: EHSDeviationMaxAggregateInputType
  }

  export type EHSDeviationGroupByOutputType = {
    id: number
    month: string
    date: Date
    timeOfRound: string
    location: string
    responsibleDepartment: string
    remarks: string
    observations: string
    photographBefore: string | null
    controlMeasures: string
    photographAfter: string | null
    categorization: string
    remarksByDepartment: string | null
    complianceStatus: string
    createdAt: Date
    updatedAt: Date
    complianceDate: Date | null
    _count: EHSDeviationCountAggregateOutputType | null
    _avg: EHSDeviationAvgAggregateOutputType | null
    _sum: EHSDeviationSumAggregateOutputType | null
    _min: EHSDeviationMinAggregateOutputType | null
    _max: EHSDeviationMaxAggregateOutputType | null
  }

  type GetEHSDeviationGroupByPayload<T extends EHSDeviationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EHSDeviationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EHSDeviationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EHSDeviationGroupByOutputType[P]>
            : GetScalarType<T[P], EHSDeviationGroupByOutputType[P]>
        }
      >
    >


  export type EHSDeviationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    month?: boolean
    date?: boolean
    timeOfRound?: boolean
    location?: boolean
    responsibleDepartment?: boolean
    remarks?: boolean
    observations?: boolean
    photographBefore?: boolean
    controlMeasures?: boolean
    photographAfter?: boolean
    categorization?: boolean
    remarksByDepartment?: boolean
    complianceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    complianceDate?: boolean
  }, ExtArgs["result"]["eHSDeviation"]>



  export type EHSDeviationSelectScalar = {
    id?: boolean
    month?: boolean
    date?: boolean
    timeOfRound?: boolean
    location?: boolean
    responsibleDepartment?: boolean
    remarks?: boolean
    observations?: boolean
    photographBefore?: boolean
    controlMeasures?: boolean
    photographAfter?: boolean
    categorization?: boolean
    remarksByDepartment?: boolean
    complianceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    complianceDate?: boolean
  }

  export type EHSDeviationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "month" | "date" | "timeOfRound" | "location" | "responsibleDepartment" | "remarks" | "observations" | "photographBefore" | "controlMeasures" | "photographAfter" | "categorization" | "remarksByDepartment" | "complianceStatus" | "createdAt" | "updatedAt" | "complianceDate", ExtArgs["result"]["eHSDeviation"]>

  export type $EHSDeviationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EHSDeviation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      month: string
      date: Date
      timeOfRound: string
      location: string
      responsibleDepartment: string
      remarks: string
      observations: string
      photographBefore: string | null
      controlMeasures: string
      photographAfter: string | null
      categorization: string
      remarksByDepartment: string | null
      complianceStatus: string
      createdAt: Date
      updatedAt: Date
      complianceDate: Date | null
    }, ExtArgs["result"]["eHSDeviation"]>
    composites: {}
  }

  type EHSDeviationGetPayload<S extends boolean | null | undefined | EHSDeviationDefaultArgs> = $Result.GetResult<Prisma.$EHSDeviationPayload, S>

  type EHSDeviationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EHSDeviationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EHSDeviationCountAggregateInputType | true
    }

  export interface EHSDeviationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EHSDeviation'], meta: { name: 'EHSDeviation' } }
    /**
     * Find zero or one EHSDeviation that matches the filter.
     * @param {EHSDeviationFindUniqueArgs} args - Arguments to find a EHSDeviation
     * @example
     * // Get one EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EHSDeviationFindUniqueArgs>(args: SelectSubset<T, EHSDeviationFindUniqueArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EHSDeviation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EHSDeviationFindUniqueOrThrowArgs} args - Arguments to find a EHSDeviation
     * @example
     * // Get one EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EHSDeviationFindUniqueOrThrowArgs>(args: SelectSubset<T, EHSDeviationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EHSDeviation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationFindFirstArgs} args - Arguments to find a EHSDeviation
     * @example
     * // Get one EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EHSDeviationFindFirstArgs>(args?: SelectSubset<T, EHSDeviationFindFirstArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EHSDeviation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationFindFirstOrThrowArgs} args - Arguments to find a EHSDeviation
     * @example
     * // Get one EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EHSDeviationFindFirstOrThrowArgs>(args?: SelectSubset<T, EHSDeviationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EHSDeviations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EHSDeviations
     * const eHSDeviations = await prisma.eHSDeviation.findMany()
     * 
     * // Get first 10 EHSDeviations
     * const eHSDeviations = await prisma.eHSDeviation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eHSDeviationWithIdOnly = await prisma.eHSDeviation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EHSDeviationFindManyArgs>(args?: SelectSubset<T, EHSDeviationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EHSDeviation.
     * @param {EHSDeviationCreateArgs} args - Arguments to create a EHSDeviation.
     * @example
     * // Create one EHSDeviation
     * const EHSDeviation = await prisma.eHSDeviation.create({
     *   data: {
     *     // ... data to create a EHSDeviation
     *   }
     * })
     * 
     */
    create<T extends EHSDeviationCreateArgs>(args: SelectSubset<T, EHSDeviationCreateArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EHSDeviations.
     * @param {EHSDeviationCreateManyArgs} args - Arguments to create many EHSDeviations.
     * @example
     * // Create many EHSDeviations
     * const eHSDeviation = await prisma.eHSDeviation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EHSDeviationCreateManyArgs>(args?: SelectSubset<T, EHSDeviationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EHSDeviation.
     * @param {EHSDeviationDeleteArgs} args - Arguments to delete one EHSDeviation.
     * @example
     * // Delete one EHSDeviation
     * const EHSDeviation = await prisma.eHSDeviation.delete({
     *   where: {
     *     // ... filter to delete one EHSDeviation
     *   }
     * })
     * 
     */
    delete<T extends EHSDeviationDeleteArgs>(args: SelectSubset<T, EHSDeviationDeleteArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EHSDeviation.
     * @param {EHSDeviationUpdateArgs} args - Arguments to update one EHSDeviation.
     * @example
     * // Update one EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EHSDeviationUpdateArgs>(args: SelectSubset<T, EHSDeviationUpdateArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EHSDeviations.
     * @param {EHSDeviationDeleteManyArgs} args - Arguments to filter EHSDeviations to delete.
     * @example
     * // Delete a few EHSDeviations
     * const { count } = await prisma.eHSDeviation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EHSDeviationDeleteManyArgs>(args?: SelectSubset<T, EHSDeviationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EHSDeviations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EHSDeviations
     * const eHSDeviation = await prisma.eHSDeviation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EHSDeviationUpdateManyArgs>(args: SelectSubset<T, EHSDeviationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EHSDeviation.
     * @param {EHSDeviationUpsertArgs} args - Arguments to update or create a EHSDeviation.
     * @example
     * // Update or create a EHSDeviation
     * const eHSDeviation = await prisma.eHSDeviation.upsert({
     *   create: {
     *     // ... data to create a EHSDeviation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EHSDeviation we want to update
     *   }
     * })
     */
    upsert<T extends EHSDeviationUpsertArgs>(args: SelectSubset<T, EHSDeviationUpsertArgs<ExtArgs>>): Prisma__EHSDeviationClient<$Result.GetResult<Prisma.$EHSDeviationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EHSDeviations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationCountArgs} args - Arguments to filter EHSDeviations to count.
     * @example
     * // Count the number of EHSDeviations
     * const count = await prisma.eHSDeviation.count({
     *   where: {
     *     // ... the filter for the EHSDeviations we want to count
     *   }
     * })
    **/
    count<T extends EHSDeviationCountArgs>(
      args?: Subset<T, EHSDeviationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EHSDeviationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EHSDeviation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EHSDeviationAggregateArgs>(args: Subset<T, EHSDeviationAggregateArgs>): Prisma.PrismaPromise<GetEHSDeviationAggregateType<T>>

    /**
     * Group by EHSDeviation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EHSDeviationGroupByArgs} args - Group by arguments.
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
      T extends EHSDeviationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EHSDeviationGroupByArgs['orderBy'] }
        : { orderBy?: EHSDeviationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EHSDeviationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEHSDeviationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EHSDeviation model
   */
  readonly fields: EHSDeviationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EHSDeviation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EHSDeviationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the EHSDeviation model
   */
  interface EHSDeviationFieldRefs {
    readonly id: FieldRef<"EHSDeviation", 'Int'>
    readonly month: FieldRef<"EHSDeviation", 'String'>
    readonly date: FieldRef<"EHSDeviation", 'DateTime'>
    readonly timeOfRound: FieldRef<"EHSDeviation", 'String'>
    readonly location: FieldRef<"EHSDeviation", 'String'>
    readonly responsibleDepartment: FieldRef<"EHSDeviation", 'String'>
    readonly remarks: FieldRef<"EHSDeviation", 'String'>
    readonly observations: FieldRef<"EHSDeviation", 'String'>
    readonly photographBefore: FieldRef<"EHSDeviation", 'String'>
    readonly controlMeasures: FieldRef<"EHSDeviation", 'String'>
    readonly photographAfter: FieldRef<"EHSDeviation", 'String'>
    readonly categorization: FieldRef<"EHSDeviation", 'String'>
    readonly remarksByDepartment: FieldRef<"EHSDeviation", 'String'>
    readonly complianceStatus: FieldRef<"EHSDeviation", 'String'>
    readonly createdAt: FieldRef<"EHSDeviation", 'DateTime'>
    readonly updatedAt: FieldRef<"EHSDeviation", 'DateTime'>
    readonly complianceDate: FieldRef<"EHSDeviation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EHSDeviation findUnique
   */
  export type EHSDeviationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter, which EHSDeviation to fetch.
     */
    where: EHSDeviationWhereUniqueInput
  }

  /**
   * EHSDeviation findUniqueOrThrow
   */
  export type EHSDeviationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter, which EHSDeviation to fetch.
     */
    where: EHSDeviationWhereUniqueInput
  }

  /**
   * EHSDeviation findFirst
   */
  export type EHSDeviationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter, which EHSDeviation to fetch.
     */
    where?: EHSDeviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EHSDeviations to fetch.
     */
    orderBy?: EHSDeviationOrderByWithRelationInput | EHSDeviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EHSDeviations.
     */
    cursor?: EHSDeviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EHSDeviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EHSDeviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EHSDeviations.
     */
    distinct?: EHSDeviationScalarFieldEnum | EHSDeviationScalarFieldEnum[]
  }

  /**
   * EHSDeviation findFirstOrThrow
   */
  export type EHSDeviationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter, which EHSDeviation to fetch.
     */
    where?: EHSDeviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EHSDeviations to fetch.
     */
    orderBy?: EHSDeviationOrderByWithRelationInput | EHSDeviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EHSDeviations.
     */
    cursor?: EHSDeviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EHSDeviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EHSDeviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EHSDeviations.
     */
    distinct?: EHSDeviationScalarFieldEnum | EHSDeviationScalarFieldEnum[]
  }

  /**
   * EHSDeviation findMany
   */
  export type EHSDeviationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter, which EHSDeviations to fetch.
     */
    where?: EHSDeviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EHSDeviations to fetch.
     */
    orderBy?: EHSDeviationOrderByWithRelationInput | EHSDeviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EHSDeviations.
     */
    cursor?: EHSDeviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EHSDeviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EHSDeviations.
     */
    skip?: number
    distinct?: EHSDeviationScalarFieldEnum | EHSDeviationScalarFieldEnum[]
  }

  /**
   * EHSDeviation create
   */
  export type EHSDeviationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * The data needed to create a EHSDeviation.
     */
    data: XOR<EHSDeviationCreateInput, EHSDeviationUncheckedCreateInput>
  }

  /**
   * EHSDeviation createMany
   */
  export type EHSDeviationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EHSDeviations.
     */
    data: EHSDeviationCreateManyInput | EHSDeviationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EHSDeviation update
   */
  export type EHSDeviationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * The data needed to update a EHSDeviation.
     */
    data: XOR<EHSDeviationUpdateInput, EHSDeviationUncheckedUpdateInput>
    /**
     * Choose, which EHSDeviation to update.
     */
    where: EHSDeviationWhereUniqueInput
  }

  /**
   * EHSDeviation updateMany
   */
  export type EHSDeviationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EHSDeviations.
     */
    data: XOR<EHSDeviationUpdateManyMutationInput, EHSDeviationUncheckedUpdateManyInput>
    /**
     * Filter which EHSDeviations to update
     */
    where?: EHSDeviationWhereInput
    /**
     * Limit how many EHSDeviations to update.
     */
    limit?: number
  }

  /**
   * EHSDeviation upsert
   */
  export type EHSDeviationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * The filter to search for the EHSDeviation to update in case it exists.
     */
    where: EHSDeviationWhereUniqueInput
    /**
     * In case the EHSDeviation found by the `where` argument doesn't exist, create a new EHSDeviation with this data.
     */
    create: XOR<EHSDeviationCreateInput, EHSDeviationUncheckedCreateInput>
    /**
     * In case the EHSDeviation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EHSDeviationUpdateInput, EHSDeviationUncheckedUpdateInput>
  }

  /**
   * EHSDeviation delete
   */
  export type EHSDeviationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
    /**
     * Filter which EHSDeviation to delete.
     */
    where: EHSDeviationWhereUniqueInput
  }

  /**
   * EHSDeviation deleteMany
   */
  export type EHSDeviationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EHSDeviations to delete
     */
    where?: EHSDeviationWhereInput
    /**
     * Limit how many EHSDeviations to delete.
     */
    limit?: number
  }

  /**
   * EHSDeviation without action
   */
  export type EHSDeviationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EHSDeviation
     */
    select?: EHSDeviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EHSDeviation
     */
    omit?: EHSDeviationOmit<ExtArgs> | null
  }


  /**
   * Model CourierHandover
   */

  export type AggregateCourierHandover = {
    _count: CourierHandoverCountAggregateOutputType | null
    _avg: CourierHandoverAvgAggregateOutputType | null
    _sum: CourierHandoverSumAggregateOutputType | null
    _min: CourierHandoverMinAggregateOutputType | null
    _max: CourierHandoverMaxAggregateOutputType | null
  }

  export type CourierHandoverAvgAggregateOutputType = {
    id: number | null
  }

  export type CourierHandoverSumAggregateOutputType = {
    id: number | null
  }

  export type CourierHandoverMinAggregateOutputType = {
    id: number | null
    partner: string | null
    awb: string | null
    personId: string | null
    lastScan: Date | null
    duplicate: boolean | null
    mismatch: boolean | null
    detectedPartner: string | null
  }

  export type CourierHandoverMaxAggregateOutputType = {
    id: number | null
    partner: string | null
    awb: string | null
    personId: string | null
    lastScan: Date | null
    duplicate: boolean | null
    mismatch: boolean | null
    detectedPartner: string | null
  }

  export type CourierHandoverCountAggregateOutputType = {
    id: number
    partner: number
    awb: number
    personId: number
    lastScan: number
    duplicate: number
    mismatch: number
    detectedPartner: number
    _all: number
  }


  export type CourierHandoverAvgAggregateInputType = {
    id?: true
  }

  export type CourierHandoverSumAggregateInputType = {
    id?: true
  }

  export type CourierHandoverMinAggregateInputType = {
    id?: true
    partner?: true
    awb?: true
    personId?: true
    lastScan?: true
    duplicate?: true
    mismatch?: true
    detectedPartner?: true
  }

  export type CourierHandoverMaxAggregateInputType = {
    id?: true
    partner?: true
    awb?: true
    personId?: true
    lastScan?: true
    duplicate?: true
    mismatch?: true
    detectedPartner?: true
  }

  export type CourierHandoverCountAggregateInputType = {
    id?: true
    partner?: true
    awb?: true
    personId?: true
    lastScan?: true
    duplicate?: true
    mismatch?: true
    detectedPartner?: true
    _all?: true
  }

  export type CourierHandoverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourierHandover to aggregate.
     */
    where?: CourierHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourierHandovers to fetch.
     */
    orderBy?: CourierHandoverOrderByWithRelationInput | CourierHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourierHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourierHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourierHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CourierHandovers
    **/
    _count?: true | CourierHandoverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CourierHandoverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CourierHandoverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourierHandoverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourierHandoverMaxAggregateInputType
  }

  export type GetCourierHandoverAggregateType<T extends CourierHandoverAggregateArgs> = {
        [P in keyof T & keyof AggregateCourierHandover]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourierHandover[P]>
      : GetScalarType<T[P], AggregateCourierHandover[P]>
  }




  export type CourierHandoverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourierHandoverWhereInput
    orderBy?: CourierHandoverOrderByWithAggregationInput | CourierHandoverOrderByWithAggregationInput[]
    by: CourierHandoverScalarFieldEnum[] | CourierHandoverScalarFieldEnum
    having?: CourierHandoverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourierHandoverCountAggregateInputType | true
    _avg?: CourierHandoverAvgAggregateInputType
    _sum?: CourierHandoverSumAggregateInputType
    _min?: CourierHandoverMinAggregateInputType
    _max?: CourierHandoverMaxAggregateInputType
  }

  export type CourierHandoverGroupByOutputType = {
    id: number
    partner: string
    awb: string
    personId: string
    lastScan: Date
    duplicate: boolean
    mismatch: boolean
    detectedPartner: string | null
    _count: CourierHandoverCountAggregateOutputType | null
    _avg: CourierHandoverAvgAggregateOutputType | null
    _sum: CourierHandoverSumAggregateOutputType | null
    _min: CourierHandoverMinAggregateOutputType | null
    _max: CourierHandoverMaxAggregateOutputType | null
  }

  type GetCourierHandoverGroupByPayload<T extends CourierHandoverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourierHandoverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourierHandoverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourierHandoverGroupByOutputType[P]>
            : GetScalarType<T[P], CourierHandoverGroupByOutputType[P]>
        }
      >
    >


  export type CourierHandoverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    partner?: boolean
    awb?: boolean
    personId?: boolean
    lastScan?: boolean
    duplicate?: boolean
    mismatch?: boolean
    detectedPartner?: boolean
  }, ExtArgs["result"]["courierHandover"]>



  export type CourierHandoverSelectScalar = {
    id?: boolean
    partner?: boolean
    awb?: boolean
    personId?: boolean
    lastScan?: boolean
    duplicate?: boolean
    mismatch?: boolean
    detectedPartner?: boolean
  }

  export type CourierHandoverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "partner" | "awb" | "personId" | "lastScan" | "duplicate" | "mismatch" | "detectedPartner", ExtArgs["result"]["courierHandover"]>

  export type $CourierHandoverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CourierHandover"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      partner: string
      awb: string
      personId: string
      lastScan: Date
      duplicate: boolean
      mismatch: boolean
      detectedPartner: string | null
    }, ExtArgs["result"]["courierHandover"]>
    composites: {}
  }

  type CourierHandoverGetPayload<S extends boolean | null | undefined | CourierHandoverDefaultArgs> = $Result.GetResult<Prisma.$CourierHandoverPayload, S>

  type CourierHandoverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourierHandoverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourierHandoverCountAggregateInputType | true
    }

  export interface CourierHandoverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CourierHandover'], meta: { name: 'CourierHandover' } }
    /**
     * Find zero or one CourierHandover that matches the filter.
     * @param {CourierHandoverFindUniqueArgs} args - Arguments to find a CourierHandover
     * @example
     * // Get one CourierHandover
     * const courierHandover = await prisma.courierHandover.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourierHandoverFindUniqueArgs>(args: SelectSubset<T, CourierHandoverFindUniqueArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CourierHandover that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourierHandoverFindUniqueOrThrowArgs} args - Arguments to find a CourierHandover
     * @example
     * // Get one CourierHandover
     * const courierHandover = await prisma.courierHandover.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourierHandoverFindUniqueOrThrowArgs>(args: SelectSubset<T, CourierHandoverFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourierHandover that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverFindFirstArgs} args - Arguments to find a CourierHandover
     * @example
     * // Get one CourierHandover
     * const courierHandover = await prisma.courierHandover.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourierHandoverFindFirstArgs>(args?: SelectSubset<T, CourierHandoverFindFirstArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourierHandover that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverFindFirstOrThrowArgs} args - Arguments to find a CourierHandover
     * @example
     * // Get one CourierHandover
     * const courierHandover = await prisma.courierHandover.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourierHandoverFindFirstOrThrowArgs>(args?: SelectSubset<T, CourierHandoverFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CourierHandovers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourierHandovers
     * const courierHandovers = await prisma.courierHandover.findMany()
     * 
     * // Get first 10 CourierHandovers
     * const courierHandovers = await prisma.courierHandover.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courierHandoverWithIdOnly = await prisma.courierHandover.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourierHandoverFindManyArgs>(args?: SelectSubset<T, CourierHandoverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CourierHandover.
     * @param {CourierHandoverCreateArgs} args - Arguments to create a CourierHandover.
     * @example
     * // Create one CourierHandover
     * const CourierHandover = await prisma.courierHandover.create({
     *   data: {
     *     // ... data to create a CourierHandover
     *   }
     * })
     * 
     */
    create<T extends CourierHandoverCreateArgs>(args: SelectSubset<T, CourierHandoverCreateArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CourierHandovers.
     * @param {CourierHandoverCreateManyArgs} args - Arguments to create many CourierHandovers.
     * @example
     * // Create many CourierHandovers
     * const courierHandover = await prisma.courierHandover.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourierHandoverCreateManyArgs>(args?: SelectSubset<T, CourierHandoverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CourierHandover.
     * @param {CourierHandoverDeleteArgs} args - Arguments to delete one CourierHandover.
     * @example
     * // Delete one CourierHandover
     * const CourierHandover = await prisma.courierHandover.delete({
     *   where: {
     *     // ... filter to delete one CourierHandover
     *   }
     * })
     * 
     */
    delete<T extends CourierHandoverDeleteArgs>(args: SelectSubset<T, CourierHandoverDeleteArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CourierHandover.
     * @param {CourierHandoverUpdateArgs} args - Arguments to update one CourierHandover.
     * @example
     * // Update one CourierHandover
     * const courierHandover = await prisma.courierHandover.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourierHandoverUpdateArgs>(args: SelectSubset<T, CourierHandoverUpdateArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CourierHandovers.
     * @param {CourierHandoverDeleteManyArgs} args - Arguments to filter CourierHandovers to delete.
     * @example
     * // Delete a few CourierHandovers
     * const { count } = await prisma.courierHandover.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourierHandoverDeleteManyArgs>(args?: SelectSubset<T, CourierHandoverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourierHandovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourierHandovers
     * const courierHandover = await prisma.courierHandover.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourierHandoverUpdateManyArgs>(args: SelectSubset<T, CourierHandoverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CourierHandover.
     * @param {CourierHandoverUpsertArgs} args - Arguments to update or create a CourierHandover.
     * @example
     * // Update or create a CourierHandover
     * const courierHandover = await prisma.courierHandover.upsert({
     *   create: {
     *     // ... data to create a CourierHandover
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourierHandover we want to update
     *   }
     * })
     */
    upsert<T extends CourierHandoverUpsertArgs>(args: SelectSubset<T, CourierHandoverUpsertArgs<ExtArgs>>): Prisma__CourierHandoverClient<$Result.GetResult<Prisma.$CourierHandoverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CourierHandovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverCountArgs} args - Arguments to filter CourierHandovers to count.
     * @example
     * // Count the number of CourierHandovers
     * const count = await prisma.courierHandover.count({
     *   where: {
     *     // ... the filter for the CourierHandovers we want to count
     *   }
     * })
    **/
    count<T extends CourierHandoverCountArgs>(
      args?: Subset<T, CourierHandoverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourierHandoverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CourierHandover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourierHandoverAggregateArgs>(args: Subset<T, CourierHandoverAggregateArgs>): Prisma.PrismaPromise<GetCourierHandoverAggregateType<T>>

    /**
     * Group by CourierHandover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierHandoverGroupByArgs} args - Group by arguments.
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
      T extends CourierHandoverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourierHandoverGroupByArgs['orderBy'] }
        : { orderBy?: CourierHandoverGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourierHandoverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourierHandoverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CourierHandover model
   */
  readonly fields: CourierHandoverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CourierHandover.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourierHandoverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CourierHandover model
   */
  interface CourierHandoverFieldRefs {
    readonly id: FieldRef<"CourierHandover", 'Int'>
    readonly partner: FieldRef<"CourierHandover", 'String'>
    readonly awb: FieldRef<"CourierHandover", 'String'>
    readonly personId: FieldRef<"CourierHandover", 'String'>
    readonly lastScan: FieldRef<"CourierHandover", 'DateTime'>
    readonly duplicate: FieldRef<"CourierHandover", 'Boolean'>
    readonly mismatch: FieldRef<"CourierHandover", 'Boolean'>
    readonly detectedPartner: FieldRef<"CourierHandover", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CourierHandover findUnique
   */
  export type CourierHandoverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter, which CourierHandover to fetch.
     */
    where: CourierHandoverWhereUniqueInput
  }

  /**
   * CourierHandover findUniqueOrThrow
   */
  export type CourierHandoverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter, which CourierHandover to fetch.
     */
    where: CourierHandoverWhereUniqueInput
  }

  /**
   * CourierHandover findFirst
   */
  export type CourierHandoverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter, which CourierHandover to fetch.
     */
    where?: CourierHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourierHandovers to fetch.
     */
    orderBy?: CourierHandoverOrderByWithRelationInput | CourierHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourierHandovers.
     */
    cursor?: CourierHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourierHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourierHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourierHandovers.
     */
    distinct?: CourierHandoverScalarFieldEnum | CourierHandoverScalarFieldEnum[]
  }

  /**
   * CourierHandover findFirstOrThrow
   */
  export type CourierHandoverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter, which CourierHandover to fetch.
     */
    where?: CourierHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourierHandovers to fetch.
     */
    orderBy?: CourierHandoverOrderByWithRelationInput | CourierHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourierHandovers.
     */
    cursor?: CourierHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourierHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourierHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourierHandovers.
     */
    distinct?: CourierHandoverScalarFieldEnum | CourierHandoverScalarFieldEnum[]
  }

  /**
   * CourierHandover findMany
   */
  export type CourierHandoverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter, which CourierHandovers to fetch.
     */
    where?: CourierHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourierHandovers to fetch.
     */
    orderBy?: CourierHandoverOrderByWithRelationInput | CourierHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CourierHandovers.
     */
    cursor?: CourierHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourierHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourierHandovers.
     */
    skip?: number
    distinct?: CourierHandoverScalarFieldEnum | CourierHandoverScalarFieldEnum[]
  }

  /**
   * CourierHandover create
   */
  export type CourierHandoverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * The data needed to create a CourierHandover.
     */
    data: XOR<CourierHandoverCreateInput, CourierHandoverUncheckedCreateInput>
  }

  /**
   * CourierHandover createMany
   */
  export type CourierHandoverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourierHandovers.
     */
    data: CourierHandoverCreateManyInput | CourierHandoverCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CourierHandover update
   */
  export type CourierHandoverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * The data needed to update a CourierHandover.
     */
    data: XOR<CourierHandoverUpdateInput, CourierHandoverUncheckedUpdateInput>
    /**
     * Choose, which CourierHandover to update.
     */
    where: CourierHandoverWhereUniqueInput
  }

  /**
   * CourierHandover updateMany
   */
  export type CourierHandoverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CourierHandovers.
     */
    data: XOR<CourierHandoverUpdateManyMutationInput, CourierHandoverUncheckedUpdateManyInput>
    /**
     * Filter which CourierHandovers to update
     */
    where?: CourierHandoverWhereInput
    /**
     * Limit how many CourierHandovers to update.
     */
    limit?: number
  }

  /**
   * CourierHandover upsert
   */
  export type CourierHandoverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * The filter to search for the CourierHandover to update in case it exists.
     */
    where: CourierHandoverWhereUniqueInput
    /**
     * In case the CourierHandover found by the `where` argument doesn't exist, create a new CourierHandover with this data.
     */
    create: XOR<CourierHandoverCreateInput, CourierHandoverUncheckedCreateInput>
    /**
     * In case the CourierHandover was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourierHandoverUpdateInput, CourierHandoverUncheckedUpdateInput>
  }

  /**
   * CourierHandover delete
   */
  export type CourierHandoverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
    /**
     * Filter which CourierHandover to delete.
     */
    where: CourierHandoverWhereUniqueInput
  }

  /**
   * CourierHandover deleteMany
   */
  export type CourierHandoverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourierHandovers to delete
     */
    where?: CourierHandoverWhereInput
    /**
     * Limit how many CourierHandovers to delete.
     */
    limit?: number
  }

  /**
   * CourierHandover without action
   */
  export type CourierHandoverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierHandover
     */
    select?: CourierHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourierHandover
     */
    omit?: CourierHandoverOmit<ExtArgs> | null
  }


  /**
   * Model MetalFrameFittingScan
   */

  export type AggregateMetalFrameFittingScan = {
    _count: MetalFrameFittingScanCountAggregateOutputType | null
    _avg: MetalFrameFittingScanAvgAggregateOutputType | null
    _sum: MetalFrameFittingScanSumAggregateOutputType | null
    _min: MetalFrameFittingScanMinAggregateOutputType | null
    _max: MetalFrameFittingScanMaxAggregateOutputType | null
  }

  export type MetalFrameFittingScanAvgAggregateOutputType = {
    id: number | null
  }

  export type MetalFrameFittingScanSumAggregateOutputType = {
    id: number | null
  }

  export type MetalFrameFittingScanMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    pid: string | null
    timestamp: Date | null
  }

  export type MetalFrameFittingScanMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    pid: string | null
    timestamp: Date | null
  }

  export type MetalFrameFittingScanCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    pid: number
    timestamp: number
    _all: number
  }


  export type MetalFrameFittingScanAvgAggregateInputType = {
    id?: true
  }

  export type MetalFrameFittingScanSumAggregateInputType = {
    id?: true
  }

  export type MetalFrameFittingScanMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    pid?: true
    timestamp?: true
  }

  export type MetalFrameFittingScanMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    pid?: true
    timestamp?: true
  }

  export type MetalFrameFittingScanCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    pid?: true
    timestamp?: true
    _all?: true
  }

  export type MetalFrameFittingScanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetalFrameFittingScan to aggregate.
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetalFrameFittingScans to fetch.
     */
    orderBy?: MetalFrameFittingScanOrderByWithRelationInput | MetalFrameFittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetalFrameFittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetalFrameFittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetalFrameFittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MetalFrameFittingScans
    **/
    _count?: true | MetalFrameFittingScanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MetalFrameFittingScanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MetalFrameFittingScanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetalFrameFittingScanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetalFrameFittingScanMaxAggregateInputType
  }

  export type GetMetalFrameFittingScanAggregateType<T extends MetalFrameFittingScanAggregateArgs> = {
        [P in keyof T & keyof AggregateMetalFrameFittingScan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetalFrameFittingScan[P]>
      : GetScalarType<T[P], AggregateMetalFrameFittingScan[P]>
  }




  export type MetalFrameFittingScanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetalFrameFittingScanWhereInput
    orderBy?: MetalFrameFittingScanOrderByWithAggregationInput | MetalFrameFittingScanOrderByWithAggregationInput[]
    by: MetalFrameFittingScanScalarFieldEnum[] | MetalFrameFittingScanScalarFieldEnum
    having?: MetalFrameFittingScanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetalFrameFittingScanCountAggregateInputType | true
    _avg?: MetalFrameFittingScanAvgAggregateInputType
    _sum?: MetalFrameFittingScanSumAggregateInputType
    _min?: MetalFrameFittingScanMinAggregateInputType
    _max?: MetalFrameFittingScanMaxAggregateInputType
  }

  export type MetalFrameFittingScanGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    pid: string | null
    timestamp: Date
    _count: MetalFrameFittingScanCountAggregateOutputType | null
    _avg: MetalFrameFittingScanAvgAggregateOutputType | null
    _sum: MetalFrameFittingScanSumAggregateOutputType | null
    _min: MetalFrameFittingScanMinAggregateOutputType | null
    _max: MetalFrameFittingScanMaxAggregateOutputType | null
  }

  type GetMetalFrameFittingScanGroupByPayload<T extends MetalFrameFittingScanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetalFrameFittingScanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetalFrameFittingScanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetalFrameFittingScanGroupByOutputType[P]>
            : GetScalarType<T[P], MetalFrameFittingScanGroupByOutputType[P]>
        }
      >
    >


  export type MetalFrameFittingScanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    pid?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["metalFrameFittingScan"]>



  export type MetalFrameFittingScanSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    pid?: boolean
    timestamp?: boolean
  }

  export type MetalFrameFittingScanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "pid" | "timestamp", ExtArgs["result"]["metalFrameFittingScan"]>

  export type $MetalFrameFittingScanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MetalFrameFittingScan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      pid: string | null
      timestamp: Date
    }, ExtArgs["result"]["metalFrameFittingScan"]>
    composites: {}
  }

  type MetalFrameFittingScanGetPayload<S extends boolean | null | undefined | MetalFrameFittingScanDefaultArgs> = $Result.GetResult<Prisma.$MetalFrameFittingScanPayload, S>

  type MetalFrameFittingScanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetalFrameFittingScanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetalFrameFittingScanCountAggregateInputType | true
    }

  export interface MetalFrameFittingScanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MetalFrameFittingScan'], meta: { name: 'MetalFrameFittingScan' } }
    /**
     * Find zero or one MetalFrameFittingScan that matches the filter.
     * @param {MetalFrameFittingScanFindUniqueArgs} args - Arguments to find a MetalFrameFittingScan
     * @example
     * // Get one MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetalFrameFittingScanFindUniqueArgs>(args: SelectSubset<T, MetalFrameFittingScanFindUniqueArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MetalFrameFittingScan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetalFrameFittingScanFindUniqueOrThrowArgs} args - Arguments to find a MetalFrameFittingScan
     * @example
     * // Get one MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetalFrameFittingScanFindUniqueOrThrowArgs>(args: SelectSubset<T, MetalFrameFittingScanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetalFrameFittingScan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanFindFirstArgs} args - Arguments to find a MetalFrameFittingScan
     * @example
     * // Get one MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetalFrameFittingScanFindFirstArgs>(args?: SelectSubset<T, MetalFrameFittingScanFindFirstArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetalFrameFittingScan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanFindFirstOrThrowArgs} args - Arguments to find a MetalFrameFittingScan
     * @example
     * // Get one MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetalFrameFittingScanFindFirstOrThrowArgs>(args?: SelectSubset<T, MetalFrameFittingScanFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MetalFrameFittingScans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MetalFrameFittingScans
     * const metalFrameFittingScans = await prisma.metalFrameFittingScan.findMany()
     * 
     * // Get first 10 MetalFrameFittingScans
     * const metalFrameFittingScans = await prisma.metalFrameFittingScan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metalFrameFittingScanWithIdOnly = await prisma.metalFrameFittingScan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetalFrameFittingScanFindManyArgs>(args?: SelectSubset<T, MetalFrameFittingScanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MetalFrameFittingScan.
     * @param {MetalFrameFittingScanCreateArgs} args - Arguments to create a MetalFrameFittingScan.
     * @example
     * // Create one MetalFrameFittingScan
     * const MetalFrameFittingScan = await prisma.metalFrameFittingScan.create({
     *   data: {
     *     // ... data to create a MetalFrameFittingScan
     *   }
     * })
     * 
     */
    create<T extends MetalFrameFittingScanCreateArgs>(args: SelectSubset<T, MetalFrameFittingScanCreateArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MetalFrameFittingScans.
     * @param {MetalFrameFittingScanCreateManyArgs} args - Arguments to create many MetalFrameFittingScans.
     * @example
     * // Create many MetalFrameFittingScans
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetalFrameFittingScanCreateManyArgs>(args?: SelectSubset<T, MetalFrameFittingScanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MetalFrameFittingScan.
     * @param {MetalFrameFittingScanDeleteArgs} args - Arguments to delete one MetalFrameFittingScan.
     * @example
     * // Delete one MetalFrameFittingScan
     * const MetalFrameFittingScan = await prisma.metalFrameFittingScan.delete({
     *   where: {
     *     // ... filter to delete one MetalFrameFittingScan
     *   }
     * })
     * 
     */
    delete<T extends MetalFrameFittingScanDeleteArgs>(args: SelectSubset<T, MetalFrameFittingScanDeleteArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MetalFrameFittingScan.
     * @param {MetalFrameFittingScanUpdateArgs} args - Arguments to update one MetalFrameFittingScan.
     * @example
     * // Update one MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetalFrameFittingScanUpdateArgs>(args: SelectSubset<T, MetalFrameFittingScanUpdateArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MetalFrameFittingScans.
     * @param {MetalFrameFittingScanDeleteManyArgs} args - Arguments to filter MetalFrameFittingScans to delete.
     * @example
     * // Delete a few MetalFrameFittingScans
     * const { count } = await prisma.metalFrameFittingScan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetalFrameFittingScanDeleteManyArgs>(args?: SelectSubset<T, MetalFrameFittingScanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetalFrameFittingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MetalFrameFittingScans
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetalFrameFittingScanUpdateManyArgs>(args: SelectSubset<T, MetalFrameFittingScanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MetalFrameFittingScan.
     * @param {MetalFrameFittingScanUpsertArgs} args - Arguments to update or create a MetalFrameFittingScan.
     * @example
     * // Update or create a MetalFrameFittingScan
     * const metalFrameFittingScan = await prisma.metalFrameFittingScan.upsert({
     *   create: {
     *     // ... data to create a MetalFrameFittingScan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MetalFrameFittingScan we want to update
     *   }
     * })
     */
    upsert<T extends MetalFrameFittingScanUpsertArgs>(args: SelectSubset<T, MetalFrameFittingScanUpsertArgs<ExtArgs>>): Prisma__MetalFrameFittingScanClient<$Result.GetResult<Prisma.$MetalFrameFittingScanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MetalFrameFittingScans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanCountArgs} args - Arguments to filter MetalFrameFittingScans to count.
     * @example
     * // Count the number of MetalFrameFittingScans
     * const count = await prisma.metalFrameFittingScan.count({
     *   where: {
     *     // ... the filter for the MetalFrameFittingScans we want to count
     *   }
     * })
    **/
    count<T extends MetalFrameFittingScanCountArgs>(
      args?: Subset<T, MetalFrameFittingScanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetalFrameFittingScanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MetalFrameFittingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MetalFrameFittingScanAggregateArgs>(args: Subset<T, MetalFrameFittingScanAggregateArgs>): Prisma.PrismaPromise<GetMetalFrameFittingScanAggregateType<T>>

    /**
     * Group by MetalFrameFittingScan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetalFrameFittingScanGroupByArgs} args - Group by arguments.
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
      T extends MetalFrameFittingScanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetalFrameFittingScanGroupByArgs['orderBy'] }
        : { orderBy?: MetalFrameFittingScanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MetalFrameFittingScanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetalFrameFittingScanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MetalFrameFittingScan model
   */
  readonly fields: MetalFrameFittingScanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MetalFrameFittingScan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetalFrameFittingScanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MetalFrameFittingScan model
   */
  interface MetalFrameFittingScanFieldRefs {
    readonly id: FieldRef<"MetalFrameFittingScan", 'Int'>
    readonly scanId: FieldRef<"MetalFrameFittingScan", 'String'>
    readonly stationId: FieldRef<"MetalFrameFittingScan", 'String'>
    readonly nexsId: FieldRef<"MetalFrameFittingScan", 'String'>
    readonly pid: FieldRef<"MetalFrameFittingScan", 'String'>
    readonly timestamp: FieldRef<"MetalFrameFittingScan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MetalFrameFittingScan findUnique
   */
  export type MetalFrameFittingScanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter, which MetalFrameFittingScan to fetch.
     */
    where: MetalFrameFittingScanWhereUniqueInput
  }

  /**
   * MetalFrameFittingScan findUniqueOrThrow
   */
  export type MetalFrameFittingScanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter, which MetalFrameFittingScan to fetch.
     */
    where: MetalFrameFittingScanWhereUniqueInput
  }

  /**
   * MetalFrameFittingScan findFirst
   */
  export type MetalFrameFittingScanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter, which MetalFrameFittingScan to fetch.
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetalFrameFittingScans to fetch.
     */
    orderBy?: MetalFrameFittingScanOrderByWithRelationInput | MetalFrameFittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetalFrameFittingScans.
     */
    cursor?: MetalFrameFittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetalFrameFittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetalFrameFittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetalFrameFittingScans.
     */
    distinct?: MetalFrameFittingScanScalarFieldEnum | MetalFrameFittingScanScalarFieldEnum[]
  }

  /**
   * MetalFrameFittingScan findFirstOrThrow
   */
  export type MetalFrameFittingScanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter, which MetalFrameFittingScan to fetch.
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetalFrameFittingScans to fetch.
     */
    orderBy?: MetalFrameFittingScanOrderByWithRelationInput | MetalFrameFittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetalFrameFittingScans.
     */
    cursor?: MetalFrameFittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetalFrameFittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetalFrameFittingScans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetalFrameFittingScans.
     */
    distinct?: MetalFrameFittingScanScalarFieldEnum | MetalFrameFittingScanScalarFieldEnum[]
  }

  /**
   * MetalFrameFittingScan findMany
   */
  export type MetalFrameFittingScanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter, which MetalFrameFittingScans to fetch.
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetalFrameFittingScans to fetch.
     */
    orderBy?: MetalFrameFittingScanOrderByWithRelationInput | MetalFrameFittingScanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MetalFrameFittingScans.
     */
    cursor?: MetalFrameFittingScanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetalFrameFittingScans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetalFrameFittingScans.
     */
    skip?: number
    distinct?: MetalFrameFittingScanScalarFieldEnum | MetalFrameFittingScanScalarFieldEnum[]
  }

  /**
   * MetalFrameFittingScan create
   */
  export type MetalFrameFittingScanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * The data needed to create a MetalFrameFittingScan.
     */
    data: XOR<MetalFrameFittingScanCreateInput, MetalFrameFittingScanUncheckedCreateInput>
  }

  /**
   * MetalFrameFittingScan createMany
   */
  export type MetalFrameFittingScanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MetalFrameFittingScans.
     */
    data: MetalFrameFittingScanCreateManyInput | MetalFrameFittingScanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetalFrameFittingScan update
   */
  export type MetalFrameFittingScanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * The data needed to update a MetalFrameFittingScan.
     */
    data: XOR<MetalFrameFittingScanUpdateInput, MetalFrameFittingScanUncheckedUpdateInput>
    /**
     * Choose, which MetalFrameFittingScan to update.
     */
    where: MetalFrameFittingScanWhereUniqueInput
  }

  /**
   * MetalFrameFittingScan updateMany
   */
  export type MetalFrameFittingScanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MetalFrameFittingScans.
     */
    data: XOR<MetalFrameFittingScanUpdateManyMutationInput, MetalFrameFittingScanUncheckedUpdateManyInput>
    /**
     * Filter which MetalFrameFittingScans to update
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * Limit how many MetalFrameFittingScans to update.
     */
    limit?: number
  }

  /**
   * MetalFrameFittingScan upsert
   */
  export type MetalFrameFittingScanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * The filter to search for the MetalFrameFittingScan to update in case it exists.
     */
    where: MetalFrameFittingScanWhereUniqueInput
    /**
     * In case the MetalFrameFittingScan found by the `where` argument doesn't exist, create a new MetalFrameFittingScan with this data.
     */
    create: XOR<MetalFrameFittingScanCreateInput, MetalFrameFittingScanUncheckedCreateInput>
    /**
     * In case the MetalFrameFittingScan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetalFrameFittingScanUpdateInput, MetalFrameFittingScanUncheckedUpdateInput>
  }

  /**
   * MetalFrameFittingScan delete
   */
  export type MetalFrameFittingScanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
    /**
     * Filter which MetalFrameFittingScan to delete.
     */
    where: MetalFrameFittingScanWhereUniqueInput
  }

  /**
   * MetalFrameFittingScan deleteMany
   */
  export type MetalFrameFittingScanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetalFrameFittingScans to delete
     */
    where?: MetalFrameFittingScanWhereInput
    /**
     * Limit how many MetalFrameFittingScans to delete.
     */
    limit?: number
  }

  /**
   * MetalFrameFittingScan without action
   */
  export type MetalFrameFittingScanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetalFrameFittingScan
     */
    select?: MetalFrameFittingScanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetalFrameFittingScan
     */
    omit?: MetalFrameFittingScanOmit<ExtArgs> | null
  }


  /**
   * Model OrderUpdateDashboardStudy
   */

  export type AggregateOrderUpdateDashboardStudy = {
    _count: OrderUpdateDashboardStudyCountAggregateOutputType | null
    _avg: OrderUpdateDashboardStudyAvgAggregateOutputType | null
    _sum: OrderUpdateDashboardStudySumAggregateOutputType | null
    _min: OrderUpdateDashboardStudyMinAggregateOutputType | null
    _max: OrderUpdateDashboardStudyMaxAggregateOutputType | null
  }

  export type OrderUpdateDashboardStudyAvgAggregateOutputType = {
    id: number | null
    quantity: number | null
  }

  export type OrderUpdateDashboardStudySumAggregateOutputType = {
    id: number | null
    quantity: number | null
  }

  export type OrderUpdateDashboardStudyMinAggregateOutputType = {
    id: number | null
    wave: string | null
    orderId: string | null
    orderStatus: string | null
    stationId: string | null
    fittingId: string | null
    updatedFittingId: string | null
    orderSyncTime: Date | null
    orderItemId: string | null
    sku: string | null
    unallocatedReason: string | null
    itemType: string | null
    quantity: number | null
    priority: string | null
    orderItemStatus: string | null
    waveState: string | null
    category: string | null
    trayId: string | null
    jitFlag: boolean | null
    serialNo: string | null
    responseMessage: string | null
    pickingCutoffTime: Date | null
    orderAllocationTime: Date | null
    itemPickedTimestamp: Date | null
    uploadedAt: Date | null
  }

  export type OrderUpdateDashboardStudyMaxAggregateOutputType = {
    id: number | null
    wave: string | null
    orderId: string | null
    orderStatus: string | null
    stationId: string | null
    fittingId: string | null
    updatedFittingId: string | null
    orderSyncTime: Date | null
    orderItemId: string | null
    sku: string | null
    unallocatedReason: string | null
    itemType: string | null
    quantity: number | null
    priority: string | null
    orderItemStatus: string | null
    waveState: string | null
    category: string | null
    trayId: string | null
    jitFlag: boolean | null
    serialNo: string | null
    responseMessage: string | null
    pickingCutoffTime: Date | null
    orderAllocationTime: Date | null
    itemPickedTimestamp: Date | null
    uploadedAt: Date | null
  }

  export type OrderUpdateDashboardStudyCountAggregateOutputType = {
    id: number
    wave: number
    orderId: number
    orderStatus: number
    stationId: number
    fittingId: number
    updatedFittingId: number
    orderSyncTime: number
    orderItemId: number
    sku: number
    unallocatedReason: number
    itemType: number
    quantity: number
    priority: number
    orderItemStatus: number
    waveState: number
    category: number
    trayId: number
    jitFlag: number
    serialNo: number
    responseMessage: number
    pickingCutoffTime: number
    orderAllocationTime: number
    itemPickedTimestamp: number
    uploadedAt: number
    _all: number
  }


  export type OrderUpdateDashboardStudyAvgAggregateInputType = {
    id?: true
    quantity?: true
  }

  export type OrderUpdateDashboardStudySumAggregateInputType = {
    id?: true
    quantity?: true
  }

  export type OrderUpdateDashboardStudyMinAggregateInputType = {
    id?: true
    wave?: true
    orderId?: true
    orderStatus?: true
    stationId?: true
    fittingId?: true
    updatedFittingId?: true
    orderSyncTime?: true
    orderItemId?: true
    sku?: true
    unallocatedReason?: true
    itemType?: true
    quantity?: true
    priority?: true
    orderItemStatus?: true
    waveState?: true
    category?: true
    trayId?: true
    jitFlag?: true
    serialNo?: true
    responseMessage?: true
    pickingCutoffTime?: true
    orderAllocationTime?: true
    itemPickedTimestamp?: true
    uploadedAt?: true
  }

  export type OrderUpdateDashboardStudyMaxAggregateInputType = {
    id?: true
    wave?: true
    orderId?: true
    orderStatus?: true
    stationId?: true
    fittingId?: true
    updatedFittingId?: true
    orderSyncTime?: true
    orderItemId?: true
    sku?: true
    unallocatedReason?: true
    itemType?: true
    quantity?: true
    priority?: true
    orderItemStatus?: true
    waveState?: true
    category?: true
    trayId?: true
    jitFlag?: true
    serialNo?: true
    responseMessage?: true
    pickingCutoffTime?: true
    orderAllocationTime?: true
    itemPickedTimestamp?: true
    uploadedAt?: true
  }

  export type OrderUpdateDashboardStudyCountAggregateInputType = {
    id?: true
    wave?: true
    orderId?: true
    orderStatus?: true
    stationId?: true
    fittingId?: true
    updatedFittingId?: true
    orderSyncTime?: true
    orderItemId?: true
    sku?: true
    unallocatedReason?: true
    itemType?: true
    quantity?: true
    priority?: true
    orderItemStatus?: true
    waveState?: true
    category?: true
    trayId?: true
    jitFlag?: true
    serialNo?: true
    responseMessage?: true
    pickingCutoffTime?: true
    orderAllocationTime?: true
    itemPickedTimestamp?: true
    uploadedAt?: true
    _all?: true
  }

  export type OrderUpdateDashboardStudyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderUpdateDashboardStudy to aggregate.
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderUpdateDashboardStudies to fetch.
     */
    orderBy?: OrderUpdateDashboardStudyOrderByWithRelationInput | OrderUpdateDashboardStudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderUpdateDashboardStudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderUpdateDashboardStudies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderUpdateDashboardStudies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderUpdateDashboardStudies
    **/
    _count?: true | OrderUpdateDashboardStudyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderUpdateDashboardStudyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderUpdateDashboardStudySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderUpdateDashboardStudyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderUpdateDashboardStudyMaxAggregateInputType
  }

  export type GetOrderUpdateDashboardStudyAggregateType<T extends OrderUpdateDashboardStudyAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderUpdateDashboardStudy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderUpdateDashboardStudy[P]>
      : GetScalarType<T[P], AggregateOrderUpdateDashboardStudy[P]>
  }




  export type OrderUpdateDashboardStudyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderUpdateDashboardStudyWhereInput
    orderBy?: OrderUpdateDashboardStudyOrderByWithAggregationInput | OrderUpdateDashboardStudyOrderByWithAggregationInput[]
    by: OrderUpdateDashboardStudyScalarFieldEnum[] | OrderUpdateDashboardStudyScalarFieldEnum
    having?: OrderUpdateDashboardStudyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderUpdateDashboardStudyCountAggregateInputType | true
    _avg?: OrderUpdateDashboardStudyAvgAggregateInputType
    _sum?: OrderUpdateDashboardStudySumAggregateInputType
    _min?: OrderUpdateDashboardStudyMinAggregateInputType
    _max?: OrderUpdateDashboardStudyMaxAggregateInputType
  }

  export type OrderUpdateDashboardStudyGroupByOutputType = {
    id: number
    wave: string | null
    orderId: string | null
    orderStatus: string | null
    stationId: string | null
    fittingId: string | null
    updatedFittingId: string | null
    orderSyncTime: Date | null
    orderItemId: string | null
    sku: string | null
    unallocatedReason: string | null
    itemType: string | null
    quantity: number | null
    priority: string | null
    orderItemStatus: string | null
    waveState: string | null
    category: string | null
    trayId: string | null
    jitFlag: boolean | null
    serialNo: string | null
    responseMessage: string | null
    pickingCutoffTime: Date | null
    orderAllocationTime: Date | null
    itemPickedTimestamp: Date | null
    uploadedAt: Date
    _count: OrderUpdateDashboardStudyCountAggregateOutputType | null
    _avg: OrderUpdateDashboardStudyAvgAggregateOutputType | null
    _sum: OrderUpdateDashboardStudySumAggregateOutputType | null
    _min: OrderUpdateDashboardStudyMinAggregateOutputType | null
    _max: OrderUpdateDashboardStudyMaxAggregateOutputType | null
  }

  type GetOrderUpdateDashboardStudyGroupByPayload<T extends OrderUpdateDashboardStudyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderUpdateDashboardStudyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderUpdateDashboardStudyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderUpdateDashboardStudyGroupByOutputType[P]>
            : GetScalarType<T[P], OrderUpdateDashboardStudyGroupByOutputType[P]>
        }
      >
    >


  export type OrderUpdateDashboardStudySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wave?: boolean
    orderId?: boolean
    orderStatus?: boolean
    stationId?: boolean
    fittingId?: boolean
    updatedFittingId?: boolean
    orderSyncTime?: boolean
    orderItemId?: boolean
    sku?: boolean
    unallocatedReason?: boolean
    itemType?: boolean
    quantity?: boolean
    priority?: boolean
    orderItemStatus?: boolean
    waveState?: boolean
    category?: boolean
    trayId?: boolean
    jitFlag?: boolean
    serialNo?: boolean
    responseMessage?: boolean
    pickingCutoffTime?: boolean
    orderAllocationTime?: boolean
    itemPickedTimestamp?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["orderUpdateDashboardStudy"]>



  export type OrderUpdateDashboardStudySelectScalar = {
    id?: boolean
    wave?: boolean
    orderId?: boolean
    orderStatus?: boolean
    stationId?: boolean
    fittingId?: boolean
    updatedFittingId?: boolean
    orderSyncTime?: boolean
    orderItemId?: boolean
    sku?: boolean
    unallocatedReason?: boolean
    itemType?: boolean
    quantity?: boolean
    priority?: boolean
    orderItemStatus?: boolean
    waveState?: boolean
    category?: boolean
    trayId?: boolean
    jitFlag?: boolean
    serialNo?: boolean
    responseMessage?: boolean
    pickingCutoffTime?: boolean
    orderAllocationTime?: boolean
    itemPickedTimestamp?: boolean
    uploadedAt?: boolean
  }

  export type OrderUpdateDashboardStudyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wave" | "orderId" | "orderStatus" | "stationId" | "fittingId" | "updatedFittingId" | "orderSyncTime" | "orderItemId" | "sku" | "unallocatedReason" | "itemType" | "quantity" | "priority" | "orderItemStatus" | "waveState" | "category" | "trayId" | "jitFlag" | "serialNo" | "responseMessage" | "pickingCutoffTime" | "orderAllocationTime" | "itemPickedTimestamp" | "uploadedAt", ExtArgs["result"]["orderUpdateDashboardStudy"]>

  export type $OrderUpdateDashboardStudyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderUpdateDashboardStudy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      wave: string | null
      orderId: string | null
      orderStatus: string | null
      stationId: string | null
      fittingId: string | null
      updatedFittingId: string | null
      orderSyncTime: Date | null
      orderItemId: string | null
      sku: string | null
      unallocatedReason: string | null
      itemType: string | null
      quantity: number | null
      priority: string | null
      orderItemStatus: string | null
      waveState: string | null
      category: string | null
      trayId: string | null
      jitFlag: boolean | null
      serialNo: string | null
      responseMessage: string | null
      pickingCutoffTime: Date | null
      orderAllocationTime: Date | null
      itemPickedTimestamp: Date | null
      uploadedAt: Date
    }, ExtArgs["result"]["orderUpdateDashboardStudy"]>
    composites: {}
  }

  type OrderUpdateDashboardStudyGetPayload<S extends boolean | null | undefined | OrderUpdateDashboardStudyDefaultArgs> = $Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload, S>

  type OrderUpdateDashboardStudyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderUpdateDashboardStudyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderUpdateDashboardStudyCountAggregateInputType | true
    }

  export interface OrderUpdateDashboardStudyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderUpdateDashboardStudy'], meta: { name: 'OrderUpdateDashboardStudy' } }
    /**
     * Find zero or one OrderUpdateDashboardStudy that matches the filter.
     * @param {OrderUpdateDashboardStudyFindUniqueArgs} args - Arguments to find a OrderUpdateDashboardStudy
     * @example
     * // Get one OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderUpdateDashboardStudyFindUniqueArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyFindUniqueArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderUpdateDashboardStudy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderUpdateDashboardStudyFindUniqueOrThrowArgs} args - Arguments to find a OrderUpdateDashboardStudy
     * @example
     * // Get one OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderUpdateDashboardStudyFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderUpdateDashboardStudy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyFindFirstArgs} args - Arguments to find a OrderUpdateDashboardStudy
     * @example
     * // Get one OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderUpdateDashboardStudyFindFirstArgs>(args?: SelectSubset<T, OrderUpdateDashboardStudyFindFirstArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderUpdateDashboardStudy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyFindFirstOrThrowArgs} args - Arguments to find a OrderUpdateDashboardStudy
     * @example
     * // Get one OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderUpdateDashboardStudyFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderUpdateDashboardStudyFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderUpdateDashboardStudies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderUpdateDashboardStudies
     * const orderUpdateDashboardStudies = await prisma.orderUpdateDashboardStudy.findMany()
     * 
     * // Get first 10 OrderUpdateDashboardStudies
     * const orderUpdateDashboardStudies = await prisma.orderUpdateDashboardStudy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderUpdateDashboardStudyWithIdOnly = await prisma.orderUpdateDashboardStudy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderUpdateDashboardStudyFindManyArgs>(args?: SelectSubset<T, OrderUpdateDashboardStudyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderUpdateDashboardStudy.
     * @param {OrderUpdateDashboardStudyCreateArgs} args - Arguments to create a OrderUpdateDashboardStudy.
     * @example
     * // Create one OrderUpdateDashboardStudy
     * const OrderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.create({
     *   data: {
     *     // ... data to create a OrderUpdateDashboardStudy
     *   }
     * })
     * 
     */
    create<T extends OrderUpdateDashboardStudyCreateArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyCreateArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderUpdateDashboardStudies.
     * @param {OrderUpdateDashboardStudyCreateManyArgs} args - Arguments to create many OrderUpdateDashboardStudies.
     * @example
     * // Create many OrderUpdateDashboardStudies
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderUpdateDashboardStudyCreateManyArgs>(args?: SelectSubset<T, OrderUpdateDashboardStudyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OrderUpdateDashboardStudy.
     * @param {OrderUpdateDashboardStudyDeleteArgs} args - Arguments to delete one OrderUpdateDashboardStudy.
     * @example
     * // Delete one OrderUpdateDashboardStudy
     * const OrderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.delete({
     *   where: {
     *     // ... filter to delete one OrderUpdateDashboardStudy
     *   }
     * })
     * 
     */
    delete<T extends OrderUpdateDashboardStudyDeleteArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyDeleteArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderUpdateDashboardStudy.
     * @param {OrderUpdateDashboardStudyUpdateArgs} args - Arguments to update one OrderUpdateDashboardStudy.
     * @example
     * // Update one OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateDashboardStudyUpdateArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyUpdateArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderUpdateDashboardStudies.
     * @param {OrderUpdateDashboardStudyDeleteManyArgs} args - Arguments to filter OrderUpdateDashboardStudies to delete.
     * @example
     * // Delete a few OrderUpdateDashboardStudies
     * const { count } = await prisma.orderUpdateDashboardStudy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderUpdateDashboardStudyDeleteManyArgs>(args?: SelectSubset<T, OrderUpdateDashboardStudyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderUpdateDashboardStudies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderUpdateDashboardStudies
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateDashboardStudyUpdateManyArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrderUpdateDashboardStudy.
     * @param {OrderUpdateDashboardStudyUpsertArgs} args - Arguments to update or create a OrderUpdateDashboardStudy.
     * @example
     * // Update or create a OrderUpdateDashboardStudy
     * const orderUpdateDashboardStudy = await prisma.orderUpdateDashboardStudy.upsert({
     *   create: {
     *     // ... data to create a OrderUpdateDashboardStudy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderUpdateDashboardStudy we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpdateDashboardStudyUpsertArgs>(args: SelectSubset<T, OrderUpdateDashboardStudyUpsertArgs<ExtArgs>>): Prisma__OrderUpdateDashboardStudyClient<$Result.GetResult<Prisma.$OrderUpdateDashboardStudyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderUpdateDashboardStudies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyCountArgs} args - Arguments to filter OrderUpdateDashboardStudies to count.
     * @example
     * // Count the number of OrderUpdateDashboardStudies
     * const count = await prisma.orderUpdateDashboardStudy.count({
     *   where: {
     *     // ... the filter for the OrderUpdateDashboardStudies we want to count
     *   }
     * })
    **/
    count<T extends OrderUpdateDashboardStudyCountArgs>(
      args?: Subset<T, OrderUpdateDashboardStudyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderUpdateDashboardStudyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderUpdateDashboardStudy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderUpdateDashboardStudyAggregateArgs>(args: Subset<T, OrderUpdateDashboardStudyAggregateArgs>): Prisma.PrismaPromise<GetOrderUpdateDashboardStudyAggregateType<T>>

    /**
     * Group by OrderUpdateDashboardStudy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateDashboardStudyGroupByArgs} args - Group by arguments.
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
      T extends OrderUpdateDashboardStudyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderUpdateDashboardStudyGroupByArgs['orderBy'] }
        : { orderBy?: OrderUpdateDashboardStudyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrderUpdateDashboardStudyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderUpdateDashboardStudyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderUpdateDashboardStudy model
   */
  readonly fields: OrderUpdateDashboardStudyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderUpdateDashboardStudy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderUpdateDashboardStudyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the OrderUpdateDashboardStudy model
   */
  interface OrderUpdateDashboardStudyFieldRefs {
    readonly id: FieldRef<"OrderUpdateDashboardStudy", 'Int'>
    readonly wave: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly orderId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly orderStatus: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly stationId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly fittingId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly updatedFittingId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly orderSyncTime: FieldRef<"OrderUpdateDashboardStudy", 'DateTime'>
    readonly orderItemId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly sku: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly unallocatedReason: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly itemType: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly quantity: FieldRef<"OrderUpdateDashboardStudy", 'Int'>
    readonly priority: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly orderItemStatus: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly waveState: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly category: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly trayId: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly jitFlag: FieldRef<"OrderUpdateDashboardStudy", 'Boolean'>
    readonly serialNo: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly responseMessage: FieldRef<"OrderUpdateDashboardStudy", 'String'>
    readonly pickingCutoffTime: FieldRef<"OrderUpdateDashboardStudy", 'DateTime'>
    readonly orderAllocationTime: FieldRef<"OrderUpdateDashboardStudy", 'DateTime'>
    readonly itemPickedTimestamp: FieldRef<"OrderUpdateDashboardStudy", 'DateTime'>
    readonly uploadedAt: FieldRef<"OrderUpdateDashboardStudy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderUpdateDashboardStudy findUnique
   */
  export type OrderUpdateDashboardStudyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter, which OrderUpdateDashboardStudy to fetch.
     */
    where: OrderUpdateDashboardStudyWhereUniqueInput
  }

  /**
   * OrderUpdateDashboardStudy findUniqueOrThrow
   */
  export type OrderUpdateDashboardStudyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter, which OrderUpdateDashboardStudy to fetch.
     */
    where: OrderUpdateDashboardStudyWhereUniqueInput
  }

  /**
   * OrderUpdateDashboardStudy findFirst
   */
  export type OrderUpdateDashboardStudyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter, which OrderUpdateDashboardStudy to fetch.
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderUpdateDashboardStudies to fetch.
     */
    orderBy?: OrderUpdateDashboardStudyOrderByWithRelationInput | OrderUpdateDashboardStudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderUpdateDashboardStudies.
     */
    cursor?: OrderUpdateDashboardStudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderUpdateDashboardStudies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderUpdateDashboardStudies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderUpdateDashboardStudies.
     */
    distinct?: OrderUpdateDashboardStudyScalarFieldEnum | OrderUpdateDashboardStudyScalarFieldEnum[]
  }

  /**
   * OrderUpdateDashboardStudy findFirstOrThrow
   */
  export type OrderUpdateDashboardStudyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter, which OrderUpdateDashboardStudy to fetch.
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderUpdateDashboardStudies to fetch.
     */
    orderBy?: OrderUpdateDashboardStudyOrderByWithRelationInput | OrderUpdateDashboardStudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderUpdateDashboardStudies.
     */
    cursor?: OrderUpdateDashboardStudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderUpdateDashboardStudies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderUpdateDashboardStudies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderUpdateDashboardStudies.
     */
    distinct?: OrderUpdateDashboardStudyScalarFieldEnum | OrderUpdateDashboardStudyScalarFieldEnum[]
  }

  /**
   * OrderUpdateDashboardStudy findMany
   */
  export type OrderUpdateDashboardStudyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter, which OrderUpdateDashboardStudies to fetch.
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderUpdateDashboardStudies to fetch.
     */
    orderBy?: OrderUpdateDashboardStudyOrderByWithRelationInput | OrderUpdateDashboardStudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderUpdateDashboardStudies.
     */
    cursor?: OrderUpdateDashboardStudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderUpdateDashboardStudies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderUpdateDashboardStudies.
     */
    skip?: number
    distinct?: OrderUpdateDashboardStudyScalarFieldEnum | OrderUpdateDashboardStudyScalarFieldEnum[]
  }

  /**
   * OrderUpdateDashboardStudy create
   */
  export type OrderUpdateDashboardStudyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * The data needed to create a OrderUpdateDashboardStudy.
     */
    data?: XOR<OrderUpdateDashboardStudyCreateInput, OrderUpdateDashboardStudyUncheckedCreateInput>
  }

  /**
   * OrderUpdateDashboardStudy createMany
   */
  export type OrderUpdateDashboardStudyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderUpdateDashboardStudies.
     */
    data: OrderUpdateDashboardStudyCreateManyInput | OrderUpdateDashboardStudyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderUpdateDashboardStudy update
   */
  export type OrderUpdateDashboardStudyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * The data needed to update a OrderUpdateDashboardStudy.
     */
    data: XOR<OrderUpdateDashboardStudyUpdateInput, OrderUpdateDashboardStudyUncheckedUpdateInput>
    /**
     * Choose, which OrderUpdateDashboardStudy to update.
     */
    where: OrderUpdateDashboardStudyWhereUniqueInput
  }

  /**
   * OrderUpdateDashboardStudy updateMany
   */
  export type OrderUpdateDashboardStudyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderUpdateDashboardStudies.
     */
    data: XOR<OrderUpdateDashboardStudyUpdateManyMutationInput, OrderUpdateDashboardStudyUncheckedUpdateManyInput>
    /**
     * Filter which OrderUpdateDashboardStudies to update
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * Limit how many OrderUpdateDashboardStudies to update.
     */
    limit?: number
  }

  /**
   * OrderUpdateDashboardStudy upsert
   */
  export type OrderUpdateDashboardStudyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * The filter to search for the OrderUpdateDashboardStudy to update in case it exists.
     */
    where: OrderUpdateDashboardStudyWhereUniqueInput
    /**
     * In case the OrderUpdateDashboardStudy found by the `where` argument doesn't exist, create a new OrderUpdateDashboardStudy with this data.
     */
    create: XOR<OrderUpdateDashboardStudyCreateInput, OrderUpdateDashboardStudyUncheckedCreateInput>
    /**
     * In case the OrderUpdateDashboardStudy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateDashboardStudyUpdateInput, OrderUpdateDashboardStudyUncheckedUpdateInput>
  }

  /**
   * OrderUpdateDashboardStudy delete
   */
  export type OrderUpdateDashboardStudyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
    /**
     * Filter which OrderUpdateDashboardStudy to delete.
     */
    where: OrderUpdateDashboardStudyWhereUniqueInput
  }

  /**
   * OrderUpdateDashboardStudy deleteMany
   */
  export type OrderUpdateDashboardStudyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderUpdateDashboardStudies to delete
     */
    where?: OrderUpdateDashboardStudyWhereInput
    /**
     * Limit how many OrderUpdateDashboardStudies to delete.
     */
    limit?: number
  }

  /**
   * OrderUpdateDashboardStudy without action
   */
  export type OrderUpdateDashboardStudyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderUpdateDashboardStudy
     */
    select?: OrderUpdateDashboardStudySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderUpdateDashboardStudy
     */
    omit?: OrderUpdateDashboardStudyOmit<ExtArgs> | null
  }


  /**
   * Model InventoryPID
   */

  export type AggregateInventoryPID = {
    _count: InventoryPIDCountAggregateOutputType | null
    _min: InventoryPIDMinAggregateOutputType | null
    _max: InventoryPIDMaxAggregateOutputType | null
  }

  export type InventoryPIDMinAggregateOutputType = {
    PID: string | null
    Comment: string | null
  }

  export type InventoryPIDMaxAggregateOutputType = {
    PID: string | null
    Comment: string | null
  }

  export type InventoryPIDCountAggregateOutputType = {
    PID: number
    Comment: number
    _all: number
  }


  export type InventoryPIDMinAggregateInputType = {
    PID?: true
    Comment?: true
  }

  export type InventoryPIDMaxAggregateInputType = {
    PID?: true
    Comment?: true
  }

  export type InventoryPIDCountAggregateInputType = {
    PID?: true
    Comment?: true
    _all?: true
  }

  export type InventoryPIDAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryPID to aggregate.
     */
    where?: InventoryPIDWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryPIDS to fetch.
     */
    orderBy?: InventoryPIDOrderByWithRelationInput | InventoryPIDOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryPIDWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryPIDS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryPIDS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryPIDS
    **/
    _count?: true | InventoryPIDCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryPIDMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryPIDMaxAggregateInputType
  }

  export type GetInventoryPIDAggregateType<T extends InventoryPIDAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryPID]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryPID[P]>
      : GetScalarType<T[P], AggregateInventoryPID[P]>
  }




  export type InventoryPIDGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryPIDWhereInput
    orderBy?: InventoryPIDOrderByWithAggregationInput | InventoryPIDOrderByWithAggregationInput[]
    by: InventoryPIDScalarFieldEnum[] | InventoryPIDScalarFieldEnum
    having?: InventoryPIDScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryPIDCountAggregateInputType | true
    _min?: InventoryPIDMinAggregateInputType
    _max?: InventoryPIDMaxAggregateInputType
  }

  export type InventoryPIDGroupByOutputType = {
    PID: string
    Comment: string | null
    _count: InventoryPIDCountAggregateOutputType | null
    _min: InventoryPIDMinAggregateOutputType | null
    _max: InventoryPIDMaxAggregateOutputType | null
  }

  type GetInventoryPIDGroupByPayload<T extends InventoryPIDGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryPIDGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryPIDGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryPIDGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryPIDGroupByOutputType[P]>
        }
      >
    >


  export type InventoryPIDSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    PID?: boolean
    Comment?: boolean
  }, ExtArgs["result"]["inventoryPID"]>



  export type InventoryPIDSelectScalar = {
    PID?: boolean
    Comment?: boolean
  }

  export type InventoryPIDOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"PID" | "Comment", ExtArgs["result"]["inventoryPID"]>

  export type $InventoryPIDPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryPID"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      PID: string
      Comment: string | null
    }, ExtArgs["result"]["inventoryPID"]>
    composites: {}
  }

  type InventoryPIDGetPayload<S extends boolean | null | undefined | InventoryPIDDefaultArgs> = $Result.GetResult<Prisma.$InventoryPIDPayload, S>

  type InventoryPIDCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryPIDFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryPIDCountAggregateInputType | true
    }

  export interface InventoryPIDDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryPID'], meta: { name: 'InventoryPID' } }
    /**
     * Find zero or one InventoryPID that matches the filter.
     * @param {InventoryPIDFindUniqueArgs} args - Arguments to find a InventoryPID
     * @example
     * // Get one InventoryPID
     * const inventoryPID = await prisma.inventoryPID.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryPIDFindUniqueArgs>(args: SelectSubset<T, InventoryPIDFindUniqueArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryPID that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryPIDFindUniqueOrThrowArgs} args - Arguments to find a InventoryPID
     * @example
     * // Get one InventoryPID
     * const inventoryPID = await prisma.inventoryPID.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryPIDFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryPIDFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryPID that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDFindFirstArgs} args - Arguments to find a InventoryPID
     * @example
     * // Get one InventoryPID
     * const inventoryPID = await prisma.inventoryPID.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryPIDFindFirstArgs>(args?: SelectSubset<T, InventoryPIDFindFirstArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryPID that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDFindFirstOrThrowArgs} args - Arguments to find a InventoryPID
     * @example
     * // Get one InventoryPID
     * const inventoryPID = await prisma.inventoryPID.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryPIDFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryPIDFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryPIDS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryPIDS
     * const inventoryPIDS = await prisma.inventoryPID.findMany()
     * 
     * // Get first 10 InventoryPIDS
     * const inventoryPIDS = await prisma.inventoryPID.findMany({ take: 10 })
     * 
     * // Only select the `PID`
     * const inventoryPIDWithPIDOnly = await prisma.inventoryPID.findMany({ select: { PID: true } })
     * 
     */
    findMany<T extends InventoryPIDFindManyArgs>(args?: SelectSubset<T, InventoryPIDFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryPID.
     * @param {InventoryPIDCreateArgs} args - Arguments to create a InventoryPID.
     * @example
     * // Create one InventoryPID
     * const InventoryPID = await prisma.inventoryPID.create({
     *   data: {
     *     // ... data to create a InventoryPID
     *   }
     * })
     * 
     */
    create<T extends InventoryPIDCreateArgs>(args: SelectSubset<T, InventoryPIDCreateArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryPIDS.
     * @param {InventoryPIDCreateManyArgs} args - Arguments to create many InventoryPIDS.
     * @example
     * // Create many InventoryPIDS
     * const inventoryPID = await prisma.inventoryPID.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryPIDCreateManyArgs>(args?: SelectSubset<T, InventoryPIDCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InventoryPID.
     * @param {InventoryPIDDeleteArgs} args - Arguments to delete one InventoryPID.
     * @example
     * // Delete one InventoryPID
     * const InventoryPID = await prisma.inventoryPID.delete({
     *   where: {
     *     // ... filter to delete one InventoryPID
     *   }
     * })
     * 
     */
    delete<T extends InventoryPIDDeleteArgs>(args: SelectSubset<T, InventoryPIDDeleteArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryPID.
     * @param {InventoryPIDUpdateArgs} args - Arguments to update one InventoryPID.
     * @example
     * // Update one InventoryPID
     * const inventoryPID = await prisma.inventoryPID.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryPIDUpdateArgs>(args: SelectSubset<T, InventoryPIDUpdateArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryPIDS.
     * @param {InventoryPIDDeleteManyArgs} args - Arguments to filter InventoryPIDS to delete.
     * @example
     * // Delete a few InventoryPIDS
     * const { count } = await prisma.inventoryPID.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryPIDDeleteManyArgs>(args?: SelectSubset<T, InventoryPIDDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryPIDS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryPIDS
     * const inventoryPID = await prisma.inventoryPID.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryPIDUpdateManyArgs>(args: SelectSubset<T, InventoryPIDUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryPID.
     * @param {InventoryPIDUpsertArgs} args - Arguments to update or create a InventoryPID.
     * @example
     * // Update or create a InventoryPID
     * const inventoryPID = await prisma.inventoryPID.upsert({
     *   create: {
     *     // ... data to create a InventoryPID
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryPID we want to update
     *   }
     * })
     */
    upsert<T extends InventoryPIDUpsertArgs>(args: SelectSubset<T, InventoryPIDUpsertArgs<ExtArgs>>): Prisma__InventoryPIDClient<$Result.GetResult<Prisma.$InventoryPIDPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryPIDS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDCountArgs} args - Arguments to filter InventoryPIDS to count.
     * @example
     * // Count the number of InventoryPIDS
     * const count = await prisma.inventoryPID.count({
     *   where: {
     *     // ... the filter for the InventoryPIDS we want to count
     *   }
     * })
    **/
    count<T extends InventoryPIDCountArgs>(
      args?: Subset<T, InventoryPIDCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryPIDCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryPID.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryPIDAggregateArgs>(args: Subset<T, InventoryPIDAggregateArgs>): Prisma.PrismaPromise<GetInventoryPIDAggregateType<T>>

    /**
     * Group by InventoryPID.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryPIDGroupByArgs} args - Group by arguments.
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
      T extends InventoryPIDGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryPIDGroupByArgs['orderBy'] }
        : { orderBy?: InventoryPIDGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryPIDGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryPIDGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryPID model
   */
  readonly fields: InventoryPIDFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryPID.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryPIDClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the InventoryPID model
   */
  interface InventoryPIDFieldRefs {
    readonly PID: FieldRef<"InventoryPID", 'String'>
    readonly Comment: FieldRef<"InventoryPID", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InventoryPID findUnique
   */
  export type InventoryPIDFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter, which InventoryPID to fetch.
     */
    where: InventoryPIDWhereUniqueInput
  }

  /**
   * InventoryPID findUniqueOrThrow
   */
  export type InventoryPIDFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter, which InventoryPID to fetch.
     */
    where: InventoryPIDWhereUniqueInput
  }

  /**
   * InventoryPID findFirst
   */
  export type InventoryPIDFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter, which InventoryPID to fetch.
     */
    where?: InventoryPIDWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryPIDS to fetch.
     */
    orderBy?: InventoryPIDOrderByWithRelationInput | InventoryPIDOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryPIDS.
     */
    cursor?: InventoryPIDWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryPIDS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryPIDS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryPIDS.
     */
    distinct?: InventoryPIDScalarFieldEnum | InventoryPIDScalarFieldEnum[]
  }

  /**
   * InventoryPID findFirstOrThrow
   */
  export type InventoryPIDFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter, which InventoryPID to fetch.
     */
    where?: InventoryPIDWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryPIDS to fetch.
     */
    orderBy?: InventoryPIDOrderByWithRelationInput | InventoryPIDOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryPIDS.
     */
    cursor?: InventoryPIDWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryPIDS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryPIDS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryPIDS.
     */
    distinct?: InventoryPIDScalarFieldEnum | InventoryPIDScalarFieldEnum[]
  }

  /**
   * InventoryPID findMany
   */
  export type InventoryPIDFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter, which InventoryPIDS to fetch.
     */
    where?: InventoryPIDWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryPIDS to fetch.
     */
    orderBy?: InventoryPIDOrderByWithRelationInput | InventoryPIDOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryPIDS.
     */
    cursor?: InventoryPIDWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryPIDS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryPIDS.
     */
    skip?: number
    distinct?: InventoryPIDScalarFieldEnum | InventoryPIDScalarFieldEnum[]
  }

  /**
   * InventoryPID create
   */
  export type InventoryPIDCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * The data needed to create a InventoryPID.
     */
    data: XOR<InventoryPIDCreateInput, InventoryPIDUncheckedCreateInput>
  }

  /**
   * InventoryPID createMany
   */
  export type InventoryPIDCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryPIDS.
     */
    data: InventoryPIDCreateManyInput | InventoryPIDCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryPID update
   */
  export type InventoryPIDUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * The data needed to update a InventoryPID.
     */
    data: XOR<InventoryPIDUpdateInput, InventoryPIDUncheckedUpdateInput>
    /**
     * Choose, which InventoryPID to update.
     */
    where: InventoryPIDWhereUniqueInput
  }

  /**
   * InventoryPID updateMany
   */
  export type InventoryPIDUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryPIDS.
     */
    data: XOR<InventoryPIDUpdateManyMutationInput, InventoryPIDUncheckedUpdateManyInput>
    /**
     * Filter which InventoryPIDS to update
     */
    where?: InventoryPIDWhereInput
    /**
     * Limit how many InventoryPIDS to update.
     */
    limit?: number
  }

  /**
   * InventoryPID upsert
   */
  export type InventoryPIDUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * The filter to search for the InventoryPID to update in case it exists.
     */
    where: InventoryPIDWhereUniqueInput
    /**
     * In case the InventoryPID found by the `where` argument doesn't exist, create a new InventoryPID with this data.
     */
    create: XOR<InventoryPIDCreateInput, InventoryPIDUncheckedCreateInput>
    /**
     * In case the InventoryPID was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryPIDUpdateInput, InventoryPIDUncheckedUpdateInput>
  }

  /**
   * InventoryPID delete
   */
  export type InventoryPIDDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
    /**
     * Filter which InventoryPID to delete.
     */
    where: InventoryPIDWhereUniqueInput
  }

  /**
   * InventoryPID deleteMany
   */
  export type InventoryPIDDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryPIDS to delete
     */
    where?: InventoryPIDWhereInput
    /**
     * Limit how many InventoryPIDS to delete.
     */
    limit?: number
  }

  /**
   * InventoryPID without action
   */
  export type InventoryPIDDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryPID
     */
    select?: InventoryPIDSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryPID
     */
    omit?: InventoryPIDOmit<ExtArgs> | null
  }


  /**
   * Model FR0BulkHOTO
   */

  export type AggregateFR0BulkHOTO = {
    _count: FR0BulkHOTOCountAggregateOutputType | null
    _avg: FR0BulkHOTOAvgAggregateOutputType | null
    _sum: FR0BulkHOTOSumAggregateOutputType | null
    _min: FR0BulkHOTOMinAggregateOutputType | null
    _max: FR0BulkHOTOMaxAggregateOutputType | null
  }

  export type FR0BulkHOTOAvgAggregateOutputType = {
    id: number | null
  }

  export type FR0BulkHOTOSumAggregateOutputType = {
    id: number | null
  }

  export type FR0BulkHOTOMinAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type FR0BulkHOTOMaxAggregateOutputType = {
    id: number | null
    scanId: string | null
    stationId: string | null
    nexsId: string | null
    timestamp: Date | null
  }

  export type FR0BulkHOTOCountAggregateOutputType = {
    id: number
    scanId: number
    stationId: number
    nexsId: number
    timestamp: number
    _all: number
  }


  export type FR0BulkHOTOAvgAggregateInputType = {
    id?: true
  }

  export type FR0BulkHOTOSumAggregateInputType = {
    id?: true
  }

  export type FR0BulkHOTOMinAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type FR0BulkHOTOMaxAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
  }

  export type FR0BulkHOTOCountAggregateInputType = {
    id?: true
    scanId?: true
    stationId?: true
    nexsId?: true
    timestamp?: true
    _all?: true
  }

  export type FR0BulkHOTOAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FR0BulkHOTO to aggregate.
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0BulkHOTOS to fetch.
     */
    orderBy?: FR0BulkHOTOOrderByWithRelationInput | FR0BulkHOTOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FR0BulkHOTOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0BulkHOTOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0BulkHOTOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FR0BulkHOTOS
    **/
    _count?: true | FR0BulkHOTOCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FR0BulkHOTOAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FR0BulkHOTOSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FR0BulkHOTOMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FR0BulkHOTOMaxAggregateInputType
  }

  export type GetFR0BulkHOTOAggregateType<T extends FR0BulkHOTOAggregateArgs> = {
        [P in keyof T & keyof AggregateFR0BulkHOTO]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFR0BulkHOTO[P]>
      : GetScalarType<T[P], AggregateFR0BulkHOTO[P]>
  }




  export type FR0BulkHOTOGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FR0BulkHOTOWhereInput
    orderBy?: FR0BulkHOTOOrderByWithAggregationInput | FR0BulkHOTOOrderByWithAggregationInput[]
    by: FR0BulkHOTOScalarFieldEnum[] | FR0BulkHOTOScalarFieldEnum
    having?: FR0BulkHOTOScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FR0BulkHOTOCountAggregateInputType | true
    _avg?: FR0BulkHOTOAvgAggregateInputType
    _sum?: FR0BulkHOTOSumAggregateInputType
    _min?: FR0BulkHOTOMinAggregateInputType
    _max?: FR0BulkHOTOMaxAggregateInputType
  }

  export type FR0BulkHOTOGroupByOutputType = {
    id: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp: Date
    _count: FR0BulkHOTOCountAggregateOutputType | null
    _avg: FR0BulkHOTOAvgAggregateOutputType | null
    _sum: FR0BulkHOTOSumAggregateOutputType | null
    _min: FR0BulkHOTOMinAggregateOutputType | null
    _max: FR0BulkHOTOMaxAggregateOutputType | null
  }

  type GetFR0BulkHOTOGroupByPayload<T extends FR0BulkHOTOGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FR0BulkHOTOGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FR0BulkHOTOGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FR0BulkHOTOGroupByOutputType[P]>
            : GetScalarType<T[P], FR0BulkHOTOGroupByOutputType[P]>
        }
      >
    >


  export type FR0BulkHOTOSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["fR0BulkHOTO"]>



  export type FR0BulkHOTOSelectScalar = {
    id?: boolean
    scanId?: boolean
    stationId?: boolean
    nexsId?: boolean
    timestamp?: boolean
  }

  export type FR0BulkHOTOOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "stationId" | "nexsId" | "timestamp", ExtArgs["result"]["fR0BulkHOTO"]>

  export type $FR0BulkHOTOPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FR0BulkHOTO"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scanId: string
      stationId: string
      nexsId: string
      timestamp: Date
    }, ExtArgs["result"]["fR0BulkHOTO"]>
    composites: {}
  }

  type FR0BulkHOTOGetPayload<S extends boolean | null | undefined | FR0BulkHOTODefaultArgs> = $Result.GetResult<Prisma.$FR0BulkHOTOPayload, S>

  type FR0BulkHOTOCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FR0BulkHOTOFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FR0BulkHOTOCountAggregateInputType | true
    }

  export interface FR0BulkHOTODelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FR0BulkHOTO'], meta: { name: 'FR0BulkHOTO' } }
    /**
     * Find zero or one FR0BulkHOTO that matches the filter.
     * @param {FR0BulkHOTOFindUniqueArgs} args - Arguments to find a FR0BulkHOTO
     * @example
     * // Get one FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FR0BulkHOTOFindUniqueArgs>(args: SelectSubset<T, FR0BulkHOTOFindUniqueArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FR0BulkHOTO that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FR0BulkHOTOFindUniqueOrThrowArgs} args - Arguments to find a FR0BulkHOTO
     * @example
     * // Get one FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FR0BulkHOTOFindUniqueOrThrowArgs>(args: SelectSubset<T, FR0BulkHOTOFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FR0BulkHOTO that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOFindFirstArgs} args - Arguments to find a FR0BulkHOTO
     * @example
     * // Get one FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FR0BulkHOTOFindFirstArgs>(args?: SelectSubset<T, FR0BulkHOTOFindFirstArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FR0BulkHOTO that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOFindFirstOrThrowArgs} args - Arguments to find a FR0BulkHOTO
     * @example
     * // Get one FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FR0BulkHOTOFindFirstOrThrowArgs>(args?: SelectSubset<T, FR0BulkHOTOFindFirstOrThrowArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FR0BulkHOTOS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FR0BulkHOTOS
     * const fR0BulkHOTOS = await prisma.fR0BulkHOTO.findMany()
     * 
     * // Get first 10 FR0BulkHOTOS
     * const fR0BulkHOTOS = await prisma.fR0BulkHOTO.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fR0BulkHOTOWithIdOnly = await prisma.fR0BulkHOTO.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FR0BulkHOTOFindManyArgs>(args?: SelectSubset<T, FR0BulkHOTOFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FR0BulkHOTO.
     * @param {FR0BulkHOTOCreateArgs} args - Arguments to create a FR0BulkHOTO.
     * @example
     * // Create one FR0BulkHOTO
     * const FR0BulkHOTO = await prisma.fR0BulkHOTO.create({
     *   data: {
     *     // ... data to create a FR0BulkHOTO
     *   }
     * })
     * 
     */
    create<T extends FR0BulkHOTOCreateArgs>(args: SelectSubset<T, FR0BulkHOTOCreateArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FR0BulkHOTOS.
     * @param {FR0BulkHOTOCreateManyArgs} args - Arguments to create many FR0BulkHOTOS.
     * @example
     * // Create many FR0BulkHOTOS
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FR0BulkHOTOCreateManyArgs>(args?: SelectSubset<T, FR0BulkHOTOCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FR0BulkHOTO.
     * @param {FR0BulkHOTODeleteArgs} args - Arguments to delete one FR0BulkHOTO.
     * @example
     * // Delete one FR0BulkHOTO
     * const FR0BulkHOTO = await prisma.fR0BulkHOTO.delete({
     *   where: {
     *     // ... filter to delete one FR0BulkHOTO
     *   }
     * })
     * 
     */
    delete<T extends FR0BulkHOTODeleteArgs>(args: SelectSubset<T, FR0BulkHOTODeleteArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FR0BulkHOTO.
     * @param {FR0BulkHOTOUpdateArgs} args - Arguments to update one FR0BulkHOTO.
     * @example
     * // Update one FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FR0BulkHOTOUpdateArgs>(args: SelectSubset<T, FR0BulkHOTOUpdateArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FR0BulkHOTOS.
     * @param {FR0BulkHOTODeleteManyArgs} args - Arguments to filter FR0BulkHOTOS to delete.
     * @example
     * // Delete a few FR0BulkHOTOS
     * const { count } = await prisma.fR0BulkHOTO.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FR0BulkHOTODeleteManyArgs>(args?: SelectSubset<T, FR0BulkHOTODeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FR0BulkHOTOS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FR0BulkHOTOS
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FR0BulkHOTOUpdateManyArgs>(args: SelectSubset<T, FR0BulkHOTOUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FR0BulkHOTO.
     * @param {FR0BulkHOTOUpsertArgs} args - Arguments to update or create a FR0BulkHOTO.
     * @example
     * // Update or create a FR0BulkHOTO
     * const fR0BulkHOTO = await prisma.fR0BulkHOTO.upsert({
     *   create: {
     *     // ... data to create a FR0BulkHOTO
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FR0BulkHOTO we want to update
     *   }
     * })
     */
    upsert<T extends FR0BulkHOTOUpsertArgs>(args: SelectSubset<T, FR0BulkHOTOUpsertArgs<ExtArgs>>): Prisma__FR0BulkHOTOClient<$Result.GetResult<Prisma.$FR0BulkHOTOPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FR0BulkHOTOS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOCountArgs} args - Arguments to filter FR0BulkHOTOS to count.
     * @example
     * // Count the number of FR0BulkHOTOS
     * const count = await prisma.fR0BulkHOTO.count({
     *   where: {
     *     // ... the filter for the FR0BulkHOTOS we want to count
     *   }
     * })
    **/
    count<T extends FR0BulkHOTOCountArgs>(
      args?: Subset<T, FR0BulkHOTOCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FR0BulkHOTOCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FR0BulkHOTO.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FR0BulkHOTOAggregateArgs>(args: Subset<T, FR0BulkHOTOAggregateArgs>): Prisma.PrismaPromise<GetFR0BulkHOTOAggregateType<T>>

    /**
     * Group by FR0BulkHOTO.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FR0BulkHOTOGroupByArgs} args - Group by arguments.
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
      T extends FR0BulkHOTOGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FR0BulkHOTOGroupByArgs['orderBy'] }
        : { orderBy?: FR0BulkHOTOGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FR0BulkHOTOGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFR0BulkHOTOGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FR0BulkHOTO model
   */
  readonly fields: FR0BulkHOTOFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FR0BulkHOTO.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FR0BulkHOTOClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the FR0BulkHOTO model
   */
  interface FR0BulkHOTOFieldRefs {
    readonly id: FieldRef<"FR0BulkHOTO", 'Int'>
    readonly scanId: FieldRef<"FR0BulkHOTO", 'String'>
    readonly stationId: FieldRef<"FR0BulkHOTO", 'String'>
    readonly nexsId: FieldRef<"FR0BulkHOTO", 'String'>
    readonly timestamp: FieldRef<"FR0BulkHOTO", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FR0BulkHOTO findUnique
   */
  export type FR0BulkHOTOFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter, which FR0BulkHOTO to fetch.
     */
    where: FR0BulkHOTOWhereUniqueInput
  }

  /**
   * FR0BulkHOTO findUniqueOrThrow
   */
  export type FR0BulkHOTOFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter, which FR0BulkHOTO to fetch.
     */
    where: FR0BulkHOTOWhereUniqueInput
  }

  /**
   * FR0BulkHOTO findFirst
   */
  export type FR0BulkHOTOFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter, which FR0BulkHOTO to fetch.
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0BulkHOTOS to fetch.
     */
    orderBy?: FR0BulkHOTOOrderByWithRelationInput | FR0BulkHOTOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FR0BulkHOTOS.
     */
    cursor?: FR0BulkHOTOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0BulkHOTOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0BulkHOTOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FR0BulkHOTOS.
     */
    distinct?: FR0BulkHOTOScalarFieldEnum | FR0BulkHOTOScalarFieldEnum[]
  }

  /**
   * FR0BulkHOTO findFirstOrThrow
   */
  export type FR0BulkHOTOFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter, which FR0BulkHOTO to fetch.
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0BulkHOTOS to fetch.
     */
    orderBy?: FR0BulkHOTOOrderByWithRelationInput | FR0BulkHOTOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FR0BulkHOTOS.
     */
    cursor?: FR0BulkHOTOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0BulkHOTOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0BulkHOTOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FR0BulkHOTOS.
     */
    distinct?: FR0BulkHOTOScalarFieldEnum | FR0BulkHOTOScalarFieldEnum[]
  }

  /**
   * FR0BulkHOTO findMany
   */
  export type FR0BulkHOTOFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter, which FR0BulkHOTOS to fetch.
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FR0BulkHOTOS to fetch.
     */
    orderBy?: FR0BulkHOTOOrderByWithRelationInput | FR0BulkHOTOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FR0BulkHOTOS.
     */
    cursor?: FR0BulkHOTOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FR0BulkHOTOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FR0BulkHOTOS.
     */
    skip?: number
    distinct?: FR0BulkHOTOScalarFieldEnum | FR0BulkHOTOScalarFieldEnum[]
  }

  /**
   * FR0BulkHOTO create
   */
  export type FR0BulkHOTOCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * The data needed to create a FR0BulkHOTO.
     */
    data: XOR<FR0BulkHOTOCreateInput, FR0BulkHOTOUncheckedCreateInput>
  }

  /**
   * FR0BulkHOTO createMany
   */
  export type FR0BulkHOTOCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FR0BulkHOTOS.
     */
    data: FR0BulkHOTOCreateManyInput | FR0BulkHOTOCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FR0BulkHOTO update
   */
  export type FR0BulkHOTOUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * The data needed to update a FR0BulkHOTO.
     */
    data: XOR<FR0BulkHOTOUpdateInput, FR0BulkHOTOUncheckedUpdateInput>
    /**
     * Choose, which FR0BulkHOTO to update.
     */
    where: FR0BulkHOTOWhereUniqueInput
  }

  /**
   * FR0BulkHOTO updateMany
   */
  export type FR0BulkHOTOUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FR0BulkHOTOS.
     */
    data: XOR<FR0BulkHOTOUpdateManyMutationInput, FR0BulkHOTOUncheckedUpdateManyInput>
    /**
     * Filter which FR0BulkHOTOS to update
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * Limit how many FR0BulkHOTOS to update.
     */
    limit?: number
  }

  /**
   * FR0BulkHOTO upsert
   */
  export type FR0BulkHOTOUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * The filter to search for the FR0BulkHOTO to update in case it exists.
     */
    where: FR0BulkHOTOWhereUniqueInput
    /**
     * In case the FR0BulkHOTO found by the `where` argument doesn't exist, create a new FR0BulkHOTO with this data.
     */
    create: XOR<FR0BulkHOTOCreateInput, FR0BulkHOTOUncheckedCreateInput>
    /**
     * In case the FR0BulkHOTO was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FR0BulkHOTOUpdateInput, FR0BulkHOTOUncheckedUpdateInput>
  }

  /**
   * FR0BulkHOTO delete
   */
  export type FR0BulkHOTODeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
    /**
     * Filter which FR0BulkHOTO to delete.
     */
    where: FR0BulkHOTOWhereUniqueInput
  }

  /**
   * FR0BulkHOTO deleteMany
   */
  export type FR0BulkHOTODeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FR0BulkHOTOS to delete
     */
    where?: FR0BulkHOTOWhereInput
    /**
     * Limit how many FR0BulkHOTOS to delete.
     */
    limit?: number
  }

  /**
   * FR0BulkHOTO without action
   */
  export type FR0BulkHOTODefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FR0BulkHOTO
     */
    select?: FR0BulkHOTOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FR0BulkHOTO
     */
    omit?: FR0BulkHOTOOmit<ExtArgs> | null
  }


  /**
   * Model ManualWarehouseSetUp
   */

  export type AggregateManualWarehouseSetUp = {
    _count: ManualWarehouseSetUpCountAggregateOutputType | null
    _avg: ManualWarehouseSetUpAvgAggregateOutputType | null
    _sum: ManualWarehouseSetUpSumAggregateOutputType | null
    _min: ManualWarehouseSetUpMinAggregateOutputType | null
    _max: ManualWarehouseSetUpMaxAggregateOutputType | null
  }

  export type ManualWarehouseSetUpAvgAggregateOutputType = {
    id: number | null
  }

  export type ManualWarehouseSetUpSumAggregateOutputType = {
    id: number | null
  }

  export type ManualWarehouseSetUpMinAggregateOutputType = {
    id: number | null
    pid: string | null
    location: string | null
    package: string | null
    createdAt: Date | null
  }

  export type ManualWarehouseSetUpMaxAggregateOutputType = {
    id: number | null
    pid: string | null
    location: string | null
    package: string | null
    createdAt: Date | null
  }

  export type ManualWarehouseSetUpCountAggregateOutputType = {
    id: number
    pid: number
    location: number
    package: number
    createdAt: number
    _all: number
  }


  export type ManualWarehouseSetUpAvgAggregateInputType = {
    id?: true
  }

  export type ManualWarehouseSetUpSumAggregateInputType = {
    id?: true
  }

  export type ManualWarehouseSetUpMinAggregateInputType = {
    id?: true
    pid?: true
    location?: true
    package?: true
    createdAt?: true
  }

  export type ManualWarehouseSetUpMaxAggregateInputType = {
    id?: true
    pid?: true
    location?: true
    package?: true
    createdAt?: true
  }

  export type ManualWarehouseSetUpCountAggregateInputType = {
    id?: true
    pid?: true
    location?: true
    package?: true
    createdAt?: true
    _all?: true
  }

  export type ManualWarehouseSetUpAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManualWarehouseSetUp to aggregate.
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouseSetUps to fetch.
     */
    orderBy?: ManualWarehouseSetUpOrderByWithRelationInput | ManualWarehouseSetUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManualWarehouseSetUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouseSetUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouseSetUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ManualWarehouseSetUps
    **/
    _count?: true | ManualWarehouseSetUpCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManualWarehouseSetUpAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManualWarehouseSetUpSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManualWarehouseSetUpMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManualWarehouseSetUpMaxAggregateInputType
  }

  export type GetManualWarehouseSetUpAggregateType<T extends ManualWarehouseSetUpAggregateArgs> = {
        [P in keyof T & keyof AggregateManualWarehouseSetUp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManualWarehouseSetUp[P]>
      : GetScalarType<T[P], AggregateManualWarehouseSetUp[P]>
  }




  export type ManualWarehouseSetUpGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManualWarehouseSetUpWhereInput
    orderBy?: ManualWarehouseSetUpOrderByWithAggregationInput | ManualWarehouseSetUpOrderByWithAggregationInput[]
    by: ManualWarehouseSetUpScalarFieldEnum[] | ManualWarehouseSetUpScalarFieldEnum
    having?: ManualWarehouseSetUpScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManualWarehouseSetUpCountAggregateInputType | true
    _avg?: ManualWarehouseSetUpAvgAggregateInputType
    _sum?: ManualWarehouseSetUpSumAggregateInputType
    _min?: ManualWarehouseSetUpMinAggregateInputType
    _max?: ManualWarehouseSetUpMaxAggregateInputType
  }

  export type ManualWarehouseSetUpGroupByOutputType = {
    id: number
    pid: string
    location: string
    package: string
    createdAt: Date
    _count: ManualWarehouseSetUpCountAggregateOutputType | null
    _avg: ManualWarehouseSetUpAvgAggregateOutputType | null
    _sum: ManualWarehouseSetUpSumAggregateOutputType | null
    _min: ManualWarehouseSetUpMinAggregateOutputType | null
    _max: ManualWarehouseSetUpMaxAggregateOutputType | null
  }

  type GetManualWarehouseSetUpGroupByPayload<T extends ManualWarehouseSetUpGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManualWarehouseSetUpGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManualWarehouseSetUpGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManualWarehouseSetUpGroupByOutputType[P]>
            : GetScalarType<T[P], ManualWarehouseSetUpGroupByOutputType[P]>
        }
      >
    >


  export type ManualWarehouseSetUpSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pid?: boolean
    location?: boolean
    package?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["manualWarehouseSetUp"]>



  export type ManualWarehouseSetUpSelectScalar = {
    id?: boolean
    pid?: boolean
    location?: boolean
    package?: boolean
    createdAt?: boolean
  }

  export type ManualWarehouseSetUpOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pid" | "location" | "package" | "createdAt", ExtArgs["result"]["manualWarehouseSetUp"]>

  export type $ManualWarehouseSetUpPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ManualWarehouseSetUp"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      pid: string
      location: string
      package: string
      createdAt: Date
    }, ExtArgs["result"]["manualWarehouseSetUp"]>
    composites: {}
  }

  type ManualWarehouseSetUpGetPayload<S extends boolean | null | undefined | ManualWarehouseSetUpDefaultArgs> = $Result.GetResult<Prisma.$ManualWarehouseSetUpPayload, S>

  type ManualWarehouseSetUpCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManualWarehouseSetUpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManualWarehouseSetUpCountAggregateInputType | true
    }

  export interface ManualWarehouseSetUpDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ManualWarehouseSetUp'], meta: { name: 'ManualWarehouseSetUp' } }
    /**
     * Find zero or one ManualWarehouseSetUp that matches the filter.
     * @param {ManualWarehouseSetUpFindUniqueArgs} args - Arguments to find a ManualWarehouseSetUp
     * @example
     * // Get one ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManualWarehouseSetUpFindUniqueArgs>(args: SelectSubset<T, ManualWarehouseSetUpFindUniqueArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ManualWarehouseSetUp that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManualWarehouseSetUpFindUniqueOrThrowArgs} args - Arguments to find a ManualWarehouseSetUp
     * @example
     * // Get one ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManualWarehouseSetUpFindUniqueOrThrowArgs>(args: SelectSubset<T, ManualWarehouseSetUpFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManualWarehouseSetUp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpFindFirstArgs} args - Arguments to find a ManualWarehouseSetUp
     * @example
     * // Get one ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManualWarehouseSetUpFindFirstArgs>(args?: SelectSubset<T, ManualWarehouseSetUpFindFirstArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManualWarehouseSetUp that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpFindFirstOrThrowArgs} args - Arguments to find a ManualWarehouseSetUp
     * @example
     * // Get one ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManualWarehouseSetUpFindFirstOrThrowArgs>(args?: SelectSubset<T, ManualWarehouseSetUpFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ManualWarehouseSetUps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ManualWarehouseSetUps
     * const manualWarehouseSetUps = await prisma.manualWarehouseSetUp.findMany()
     * 
     * // Get first 10 ManualWarehouseSetUps
     * const manualWarehouseSetUps = await prisma.manualWarehouseSetUp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const manualWarehouseSetUpWithIdOnly = await prisma.manualWarehouseSetUp.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManualWarehouseSetUpFindManyArgs>(args?: SelectSubset<T, ManualWarehouseSetUpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ManualWarehouseSetUp.
     * @param {ManualWarehouseSetUpCreateArgs} args - Arguments to create a ManualWarehouseSetUp.
     * @example
     * // Create one ManualWarehouseSetUp
     * const ManualWarehouseSetUp = await prisma.manualWarehouseSetUp.create({
     *   data: {
     *     // ... data to create a ManualWarehouseSetUp
     *   }
     * })
     * 
     */
    create<T extends ManualWarehouseSetUpCreateArgs>(args: SelectSubset<T, ManualWarehouseSetUpCreateArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ManualWarehouseSetUps.
     * @param {ManualWarehouseSetUpCreateManyArgs} args - Arguments to create many ManualWarehouseSetUps.
     * @example
     * // Create many ManualWarehouseSetUps
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManualWarehouseSetUpCreateManyArgs>(args?: SelectSubset<T, ManualWarehouseSetUpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ManualWarehouseSetUp.
     * @param {ManualWarehouseSetUpDeleteArgs} args - Arguments to delete one ManualWarehouseSetUp.
     * @example
     * // Delete one ManualWarehouseSetUp
     * const ManualWarehouseSetUp = await prisma.manualWarehouseSetUp.delete({
     *   where: {
     *     // ... filter to delete one ManualWarehouseSetUp
     *   }
     * })
     * 
     */
    delete<T extends ManualWarehouseSetUpDeleteArgs>(args: SelectSubset<T, ManualWarehouseSetUpDeleteArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ManualWarehouseSetUp.
     * @param {ManualWarehouseSetUpUpdateArgs} args - Arguments to update one ManualWarehouseSetUp.
     * @example
     * // Update one ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManualWarehouseSetUpUpdateArgs>(args: SelectSubset<T, ManualWarehouseSetUpUpdateArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ManualWarehouseSetUps.
     * @param {ManualWarehouseSetUpDeleteManyArgs} args - Arguments to filter ManualWarehouseSetUps to delete.
     * @example
     * // Delete a few ManualWarehouseSetUps
     * const { count } = await prisma.manualWarehouseSetUp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManualWarehouseSetUpDeleteManyArgs>(args?: SelectSubset<T, ManualWarehouseSetUpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManualWarehouseSetUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ManualWarehouseSetUps
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManualWarehouseSetUpUpdateManyArgs>(args: SelectSubset<T, ManualWarehouseSetUpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ManualWarehouseSetUp.
     * @param {ManualWarehouseSetUpUpsertArgs} args - Arguments to update or create a ManualWarehouseSetUp.
     * @example
     * // Update or create a ManualWarehouseSetUp
     * const manualWarehouseSetUp = await prisma.manualWarehouseSetUp.upsert({
     *   create: {
     *     // ... data to create a ManualWarehouseSetUp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ManualWarehouseSetUp we want to update
     *   }
     * })
     */
    upsert<T extends ManualWarehouseSetUpUpsertArgs>(args: SelectSubset<T, ManualWarehouseSetUpUpsertArgs<ExtArgs>>): Prisma__ManualWarehouseSetUpClient<$Result.GetResult<Prisma.$ManualWarehouseSetUpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ManualWarehouseSetUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpCountArgs} args - Arguments to filter ManualWarehouseSetUps to count.
     * @example
     * // Count the number of ManualWarehouseSetUps
     * const count = await prisma.manualWarehouseSetUp.count({
     *   where: {
     *     // ... the filter for the ManualWarehouseSetUps we want to count
     *   }
     * })
    **/
    count<T extends ManualWarehouseSetUpCountArgs>(
      args?: Subset<T, ManualWarehouseSetUpCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManualWarehouseSetUpCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ManualWarehouseSetUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ManualWarehouseSetUpAggregateArgs>(args: Subset<T, ManualWarehouseSetUpAggregateArgs>): Prisma.PrismaPromise<GetManualWarehouseSetUpAggregateType<T>>

    /**
     * Group by ManualWarehouseSetUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManualWarehouseSetUpGroupByArgs} args - Group by arguments.
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
      T extends ManualWarehouseSetUpGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManualWarehouseSetUpGroupByArgs['orderBy'] }
        : { orderBy?: ManualWarehouseSetUpGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ManualWarehouseSetUpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManualWarehouseSetUpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ManualWarehouseSetUp model
   */
  readonly fields: ManualWarehouseSetUpFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ManualWarehouseSetUp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManualWarehouseSetUpClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ManualWarehouseSetUp model
   */
  interface ManualWarehouseSetUpFieldRefs {
    readonly id: FieldRef<"ManualWarehouseSetUp", 'Int'>
    readonly pid: FieldRef<"ManualWarehouseSetUp", 'String'>
    readonly location: FieldRef<"ManualWarehouseSetUp", 'String'>
    readonly package: FieldRef<"ManualWarehouseSetUp", 'String'>
    readonly createdAt: FieldRef<"ManualWarehouseSetUp", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ManualWarehouseSetUp findUnique
   */
  export type ManualWarehouseSetUpFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouseSetUp to fetch.
     */
    where: ManualWarehouseSetUpWhereUniqueInput
  }

  /**
   * ManualWarehouseSetUp findUniqueOrThrow
   */
  export type ManualWarehouseSetUpFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouseSetUp to fetch.
     */
    where: ManualWarehouseSetUpWhereUniqueInput
  }

  /**
   * ManualWarehouseSetUp findFirst
   */
  export type ManualWarehouseSetUpFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouseSetUp to fetch.
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouseSetUps to fetch.
     */
    orderBy?: ManualWarehouseSetUpOrderByWithRelationInput | ManualWarehouseSetUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManualWarehouseSetUps.
     */
    cursor?: ManualWarehouseSetUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouseSetUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouseSetUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManualWarehouseSetUps.
     */
    distinct?: ManualWarehouseSetUpScalarFieldEnum | ManualWarehouseSetUpScalarFieldEnum[]
  }

  /**
   * ManualWarehouseSetUp findFirstOrThrow
   */
  export type ManualWarehouseSetUpFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouseSetUp to fetch.
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouseSetUps to fetch.
     */
    orderBy?: ManualWarehouseSetUpOrderByWithRelationInput | ManualWarehouseSetUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManualWarehouseSetUps.
     */
    cursor?: ManualWarehouseSetUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouseSetUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouseSetUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManualWarehouseSetUps.
     */
    distinct?: ManualWarehouseSetUpScalarFieldEnum | ManualWarehouseSetUpScalarFieldEnum[]
  }

  /**
   * ManualWarehouseSetUp findMany
   */
  export type ManualWarehouseSetUpFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter, which ManualWarehouseSetUps to fetch.
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManualWarehouseSetUps to fetch.
     */
    orderBy?: ManualWarehouseSetUpOrderByWithRelationInput | ManualWarehouseSetUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ManualWarehouseSetUps.
     */
    cursor?: ManualWarehouseSetUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManualWarehouseSetUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManualWarehouseSetUps.
     */
    skip?: number
    distinct?: ManualWarehouseSetUpScalarFieldEnum | ManualWarehouseSetUpScalarFieldEnum[]
  }

  /**
   * ManualWarehouseSetUp create
   */
  export type ManualWarehouseSetUpCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * The data needed to create a ManualWarehouseSetUp.
     */
    data: XOR<ManualWarehouseSetUpCreateInput, ManualWarehouseSetUpUncheckedCreateInput>
  }

  /**
   * ManualWarehouseSetUp createMany
   */
  export type ManualWarehouseSetUpCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ManualWarehouseSetUps.
     */
    data: ManualWarehouseSetUpCreateManyInput | ManualWarehouseSetUpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ManualWarehouseSetUp update
   */
  export type ManualWarehouseSetUpUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * The data needed to update a ManualWarehouseSetUp.
     */
    data: XOR<ManualWarehouseSetUpUpdateInput, ManualWarehouseSetUpUncheckedUpdateInput>
    /**
     * Choose, which ManualWarehouseSetUp to update.
     */
    where: ManualWarehouseSetUpWhereUniqueInput
  }

  /**
   * ManualWarehouseSetUp updateMany
   */
  export type ManualWarehouseSetUpUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ManualWarehouseSetUps.
     */
    data: XOR<ManualWarehouseSetUpUpdateManyMutationInput, ManualWarehouseSetUpUncheckedUpdateManyInput>
    /**
     * Filter which ManualWarehouseSetUps to update
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * Limit how many ManualWarehouseSetUps to update.
     */
    limit?: number
  }

  /**
   * ManualWarehouseSetUp upsert
   */
  export type ManualWarehouseSetUpUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * The filter to search for the ManualWarehouseSetUp to update in case it exists.
     */
    where: ManualWarehouseSetUpWhereUniqueInput
    /**
     * In case the ManualWarehouseSetUp found by the `where` argument doesn't exist, create a new ManualWarehouseSetUp with this data.
     */
    create: XOR<ManualWarehouseSetUpCreateInput, ManualWarehouseSetUpUncheckedCreateInput>
    /**
     * In case the ManualWarehouseSetUp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManualWarehouseSetUpUpdateInput, ManualWarehouseSetUpUncheckedUpdateInput>
  }

  /**
   * ManualWarehouseSetUp delete
   */
  export type ManualWarehouseSetUpDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
    /**
     * Filter which ManualWarehouseSetUp to delete.
     */
    where: ManualWarehouseSetUpWhereUniqueInput
  }

  /**
   * ManualWarehouseSetUp deleteMany
   */
  export type ManualWarehouseSetUpDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManualWarehouseSetUps to delete
     */
    where?: ManualWarehouseSetUpWhereInput
    /**
     * Limit how many ManualWarehouseSetUps to delete.
     */
    limit?: number
  }

  /**
   * ManualWarehouseSetUp without action
   */
  export type ManualWarehouseSetUpDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManualWarehouseSetUp
     */
    select?: ManualWarehouseSetUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManualWarehouseSetUp
     */
    omit?: ManualWarehouseSetUpOmit<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    employeeCode: 'employeeCode',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ShippingMetadataScalarFieldEnum: {
    id: 'id',
    shippingID: 'shippingID',
    city: 'city'
  };

  export type ShippingMetadataScalarFieldEnum = (typeof ShippingMetadataScalarFieldEnum)[keyof typeof ShippingMetadataScalarFieldEnum]


  export const PackingScanScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    timestamp: 'timestamp'
  };

  export type PackingScanScalarFieldEnum = (typeof PackingScanScalarFieldEnum)[keyof typeof PackingScanScalarFieldEnum]


  export const DispatchScanScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    timestamp: 'timestamp'
  };

  export type DispatchScanScalarFieldEnum = (typeof DispatchScanScalarFieldEnum)[keyof typeof DispatchScanScalarFieldEnum]


  export const OperationsMetadataScalarFieldEnum: {
    id: 'id',
    locationId: 'locationId',
    cityOdd: 'cityOdd',
    shipToCust: 'shipToCust'
  };

  export type OperationsMetadataScalarFieldEnum = (typeof OperationsMetadataScalarFieldEnum)[keyof typeof OperationsMetadataScalarFieldEnum]


  export const MaintenanceShopIssueScalarFieldEnum: {
    id: 'id',
    pid: 'pid',
    partName: 'partName',
    quantity: 'quantity',
    unit: 'unit',
    rate: 'rate',
    category: 'category',
    total: 'total',
    currency: 'currency',
    destination: 'destination',
    department: 'department',
    issuedAt: 'issuedAt'
  };

  export type MaintenanceShopIssueScalarFieldEnum = (typeof MaintenanceShopIssueScalarFieldEnum)[keyof typeof MaintenanceShopIssueScalarFieldEnum]


  export const FastTrackScanScalarFieldEnum: {
    id: 'id',
    locationID: 'locationID',
    cityOdd: 'cityOdd',
    time: 'time'
  };

  export type FastTrackScanScalarFieldEnum = (typeof FastTrackScanScalarFieldEnum)[keyof typeof FastTrackScanScalarFieldEnum]


  export const FR0ScanScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    createdAt: 'createdAt'
  };

  export type FR0ScanScalarFieldEnum = (typeof FR0ScanScalarFieldEnum)[keyof typeof FR0ScanScalarFieldEnum]


  export const BulkScanScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    timestamp: 'timestamp'
  };

  export type BulkScanScalarFieldEnum = (typeof BulkScanScalarFieldEnum)[keyof typeof BulkScanScalarFieldEnum]


  export const ManualWarehouseScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    timestamp: 'timestamp'
  };

  export type ManualWarehouseScalarFieldEnum = (typeof ManualWarehouseScalarFieldEnum)[keyof typeof ManualWarehouseScalarFieldEnum]


  export const EHSDeviationScalarFieldEnum: {
    id: 'id',
    month: 'month',
    date: 'date',
    timeOfRound: 'timeOfRound',
    location: 'location',
    responsibleDepartment: 'responsibleDepartment',
    remarks: 'remarks',
    observations: 'observations',
    photographBefore: 'photographBefore',
    controlMeasures: 'controlMeasures',
    photographAfter: 'photographAfter',
    categorization: 'categorization',
    remarksByDepartment: 'remarksByDepartment',
    complianceStatus: 'complianceStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    complianceDate: 'complianceDate'
  };

  export type EHSDeviationScalarFieldEnum = (typeof EHSDeviationScalarFieldEnum)[keyof typeof EHSDeviationScalarFieldEnum]


  export const CourierHandoverScalarFieldEnum: {
    id: 'id',
    partner: 'partner',
    awb: 'awb',
    personId: 'personId',
    lastScan: 'lastScan',
    duplicate: 'duplicate',
    mismatch: 'mismatch',
    detectedPartner: 'detectedPartner'
  };

  export type CourierHandoverScalarFieldEnum = (typeof CourierHandoverScalarFieldEnum)[keyof typeof CourierHandoverScalarFieldEnum]


  export const MetalFrameFittingScanScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    pid: 'pid',
    timestamp: 'timestamp'
  };

  export type MetalFrameFittingScanScalarFieldEnum = (typeof MetalFrameFittingScanScalarFieldEnum)[keyof typeof MetalFrameFittingScanScalarFieldEnum]


  export const OrderUpdateDashboardStudyScalarFieldEnum: {
    id: 'id',
    wave: 'wave',
    orderId: 'orderId',
    orderStatus: 'orderStatus',
    stationId: 'stationId',
    fittingId: 'fittingId',
    updatedFittingId: 'updatedFittingId',
    orderSyncTime: 'orderSyncTime',
    orderItemId: 'orderItemId',
    sku: 'sku',
    unallocatedReason: 'unallocatedReason',
    itemType: 'itemType',
    quantity: 'quantity',
    priority: 'priority',
    orderItemStatus: 'orderItemStatus',
    waveState: 'waveState',
    category: 'category',
    trayId: 'trayId',
    jitFlag: 'jitFlag',
    serialNo: 'serialNo',
    responseMessage: 'responseMessage',
    pickingCutoffTime: 'pickingCutoffTime',
    orderAllocationTime: 'orderAllocationTime',
    itemPickedTimestamp: 'itemPickedTimestamp',
    uploadedAt: 'uploadedAt'
  };

  export type OrderUpdateDashboardStudyScalarFieldEnum = (typeof OrderUpdateDashboardStudyScalarFieldEnum)[keyof typeof OrderUpdateDashboardStudyScalarFieldEnum]


  export const InventoryPIDScalarFieldEnum: {
    PID: 'PID',
    Comment: 'Comment'
  };

  export type InventoryPIDScalarFieldEnum = (typeof InventoryPIDScalarFieldEnum)[keyof typeof InventoryPIDScalarFieldEnum]


  export const FR0BulkHOTOScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    timestamp: 'timestamp'
  };

  export type FR0BulkHOTOScalarFieldEnum = (typeof FR0BulkHOTOScalarFieldEnum)[keyof typeof FR0BulkHOTOScalarFieldEnum]


  export const ManualWarehouseSetUpScalarFieldEnum: {
    id: 'id',
    pid: 'pid',
    location: 'location',
    package: 'package',
    createdAt: 'createdAt'
  };

  export type ManualWarehouseSetUpScalarFieldEnum = (typeof ManualWarehouseSetUpScalarFieldEnum)[keyof typeof ManualWarehouseSetUpScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const UserOrderByRelevanceFieldEnum: {
    employeeCode: 'employeeCode',
    passwordHash: 'passwordHash'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const ShippingMetadataOrderByRelevanceFieldEnum: {
    shippingID: 'shippingID',
    city: 'city'
  };

  export type ShippingMetadataOrderByRelevanceFieldEnum = (typeof ShippingMetadataOrderByRelevanceFieldEnum)[keyof typeof ShippingMetadataOrderByRelevanceFieldEnum]


  export const PackingScanOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type PackingScanOrderByRelevanceFieldEnum = (typeof PackingScanOrderByRelevanceFieldEnum)[keyof typeof PackingScanOrderByRelevanceFieldEnum]


  export const DispatchScanOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type DispatchScanOrderByRelevanceFieldEnum = (typeof DispatchScanOrderByRelevanceFieldEnum)[keyof typeof DispatchScanOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const OperationsMetadataOrderByRelevanceFieldEnum: {
    locationId: 'locationId',
    cityOdd: 'cityOdd',
    shipToCust: 'shipToCust'
  };

  export type OperationsMetadataOrderByRelevanceFieldEnum = (typeof OperationsMetadataOrderByRelevanceFieldEnum)[keyof typeof OperationsMetadataOrderByRelevanceFieldEnum]


  export const MaintenanceShopIssueOrderByRelevanceFieldEnum: {
    pid: 'pid',
    partName: 'partName',
    unit: 'unit',
    category: 'category',
    currency: 'currency',
    destination: 'destination',
    department: 'department'
  };

  export type MaintenanceShopIssueOrderByRelevanceFieldEnum = (typeof MaintenanceShopIssueOrderByRelevanceFieldEnum)[keyof typeof MaintenanceShopIssueOrderByRelevanceFieldEnum]


  export const FastTrackScanOrderByRelevanceFieldEnum: {
    locationID: 'locationID',
    cityOdd: 'cityOdd'
  };

  export type FastTrackScanOrderByRelevanceFieldEnum = (typeof FastTrackScanOrderByRelevanceFieldEnum)[keyof typeof FastTrackScanOrderByRelevanceFieldEnum]


  export const FR0ScanOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type FR0ScanOrderByRelevanceFieldEnum = (typeof FR0ScanOrderByRelevanceFieldEnum)[keyof typeof FR0ScanOrderByRelevanceFieldEnum]


  export const BulkScanOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type BulkScanOrderByRelevanceFieldEnum = (typeof BulkScanOrderByRelevanceFieldEnum)[keyof typeof BulkScanOrderByRelevanceFieldEnum]


  export const ManualWarehouseOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type ManualWarehouseOrderByRelevanceFieldEnum = (typeof ManualWarehouseOrderByRelevanceFieldEnum)[keyof typeof ManualWarehouseOrderByRelevanceFieldEnum]


  export const EHSDeviationOrderByRelevanceFieldEnum: {
    month: 'month',
    timeOfRound: 'timeOfRound',
    location: 'location',
    responsibleDepartment: 'responsibleDepartment',
    remarks: 'remarks',
    observations: 'observations',
    photographBefore: 'photographBefore',
    controlMeasures: 'controlMeasures',
    photographAfter: 'photographAfter',
    categorization: 'categorization',
    remarksByDepartment: 'remarksByDepartment',
    complianceStatus: 'complianceStatus'
  };

  export type EHSDeviationOrderByRelevanceFieldEnum = (typeof EHSDeviationOrderByRelevanceFieldEnum)[keyof typeof EHSDeviationOrderByRelevanceFieldEnum]


  export const CourierHandoverOrderByRelevanceFieldEnum: {
    partner: 'partner',
    awb: 'awb',
    personId: 'personId',
    detectedPartner: 'detectedPartner'
  };

  export type CourierHandoverOrderByRelevanceFieldEnum = (typeof CourierHandoverOrderByRelevanceFieldEnum)[keyof typeof CourierHandoverOrderByRelevanceFieldEnum]


  export const MetalFrameFittingScanOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId',
    pid: 'pid'
  };

  export type MetalFrameFittingScanOrderByRelevanceFieldEnum = (typeof MetalFrameFittingScanOrderByRelevanceFieldEnum)[keyof typeof MetalFrameFittingScanOrderByRelevanceFieldEnum]


  export const OrderUpdateDashboardStudyOrderByRelevanceFieldEnum: {
    wave: 'wave',
    orderId: 'orderId',
    orderStatus: 'orderStatus',
    stationId: 'stationId',
    fittingId: 'fittingId',
    updatedFittingId: 'updatedFittingId',
    orderItemId: 'orderItemId',
    sku: 'sku',
    unallocatedReason: 'unallocatedReason',
    itemType: 'itemType',
    priority: 'priority',
    orderItemStatus: 'orderItemStatus',
    waveState: 'waveState',
    category: 'category',
    trayId: 'trayId',
    serialNo: 'serialNo',
    responseMessage: 'responseMessage'
  };

  export type OrderUpdateDashboardStudyOrderByRelevanceFieldEnum = (typeof OrderUpdateDashboardStudyOrderByRelevanceFieldEnum)[keyof typeof OrderUpdateDashboardStudyOrderByRelevanceFieldEnum]


  export const InventoryPIDOrderByRelevanceFieldEnum: {
    PID: 'PID',
    Comment: 'Comment'
  };

  export type InventoryPIDOrderByRelevanceFieldEnum = (typeof InventoryPIDOrderByRelevanceFieldEnum)[keyof typeof InventoryPIDOrderByRelevanceFieldEnum]


  export const FR0BulkHOTOOrderByRelevanceFieldEnum: {
    scanId: 'scanId',
    stationId: 'stationId',
    nexsId: 'nexsId'
  };

  export type FR0BulkHOTOOrderByRelevanceFieldEnum = (typeof FR0BulkHOTOOrderByRelevanceFieldEnum)[keyof typeof FR0BulkHOTOOrderByRelevanceFieldEnum]


  export const ManualWarehouseSetUpOrderByRelevanceFieldEnum: {
    pid: 'pid',
    location: 'location',
    package: 'package'
  };

  export type ManualWarehouseSetUpOrderByRelevanceFieldEnum = (typeof ManualWarehouseSetUpOrderByRelevanceFieldEnum)[keyof typeof ManualWarehouseSetUpOrderByRelevanceFieldEnum]


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    employeeCode?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    employeeCode?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    employeeCode?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "employeeCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    employeeCode?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    employeeCode?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ShippingMetadataWhereInput = {
    AND?: ShippingMetadataWhereInput | ShippingMetadataWhereInput[]
    OR?: ShippingMetadataWhereInput[]
    NOT?: ShippingMetadataWhereInput | ShippingMetadataWhereInput[]
    id?: IntFilter<"ShippingMetadata"> | number
    shippingID?: StringFilter<"ShippingMetadata"> | string
    city?: StringFilter<"ShippingMetadata"> | string
  }

  export type ShippingMetadataOrderByWithRelationInput = {
    id?: SortOrder
    shippingID?: SortOrder
    city?: SortOrder
    _relevance?: ShippingMetadataOrderByRelevanceInput
  }

  export type ShippingMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    shippingID?: string
    AND?: ShippingMetadataWhereInput | ShippingMetadataWhereInput[]
    OR?: ShippingMetadataWhereInput[]
    NOT?: ShippingMetadataWhereInput | ShippingMetadataWhereInput[]
    city?: StringFilter<"ShippingMetadata"> | string
  }, "id" | "shippingID">

  export type ShippingMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    shippingID?: SortOrder
    city?: SortOrder
    _count?: ShippingMetadataCountOrderByAggregateInput
    _avg?: ShippingMetadataAvgOrderByAggregateInput
    _max?: ShippingMetadataMaxOrderByAggregateInput
    _min?: ShippingMetadataMinOrderByAggregateInput
    _sum?: ShippingMetadataSumOrderByAggregateInput
  }

  export type ShippingMetadataScalarWhereWithAggregatesInput = {
    AND?: ShippingMetadataScalarWhereWithAggregatesInput | ShippingMetadataScalarWhereWithAggregatesInput[]
    OR?: ShippingMetadataScalarWhereWithAggregatesInput[]
    NOT?: ShippingMetadataScalarWhereWithAggregatesInput | ShippingMetadataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ShippingMetadata"> | number
    shippingID?: StringWithAggregatesFilter<"ShippingMetadata"> | string
    city?: StringWithAggregatesFilter<"ShippingMetadata"> | string
  }

  export type PackingScanWhereInput = {
    AND?: PackingScanWhereInput | PackingScanWhereInput[]
    OR?: PackingScanWhereInput[]
    NOT?: PackingScanWhereInput | PackingScanWhereInput[]
    id?: IntFilter<"PackingScan"> | number
    scanId?: StringFilter<"PackingScan"> | string
    stationId?: StringFilter<"PackingScan"> | string
    nexsId?: StringFilter<"PackingScan"> | string
    timestamp?: DateTimeFilter<"PackingScan"> | Date | string
  }

  export type PackingScanOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _relevance?: PackingScanOrderByRelevanceInput
  }

  export type PackingScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PackingScanWhereInput | PackingScanWhereInput[]
    OR?: PackingScanWhereInput[]
    NOT?: PackingScanWhereInput | PackingScanWhereInput[]
    scanId?: StringFilter<"PackingScan"> | string
    stationId?: StringFilter<"PackingScan"> | string
    nexsId?: StringFilter<"PackingScan"> | string
    timestamp?: DateTimeFilter<"PackingScan"> | Date | string
  }, "id">

  export type PackingScanOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _count?: PackingScanCountOrderByAggregateInput
    _avg?: PackingScanAvgOrderByAggregateInput
    _max?: PackingScanMaxOrderByAggregateInput
    _min?: PackingScanMinOrderByAggregateInput
    _sum?: PackingScanSumOrderByAggregateInput
  }

  export type PackingScanScalarWhereWithAggregatesInput = {
    AND?: PackingScanScalarWhereWithAggregatesInput | PackingScanScalarWhereWithAggregatesInput[]
    OR?: PackingScanScalarWhereWithAggregatesInput[]
    NOT?: PackingScanScalarWhereWithAggregatesInput | PackingScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PackingScan"> | number
    scanId?: StringWithAggregatesFilter<"PackingScan"> | string
    stationId?: StringWithAggregatesFilter<"PackingScan"> | string
    nexsId?: StringWithAggregatesFilter<"PackingScan"> | string
    timestamp?: DateTimeWithAggregatesFilter<"PackingScan"> | Date | string
  }

  export type DispatchScanWhereInput = {
    AND?: DispatchScanWhereInput | DispatchScanWhereInput[]
    OR?: DispatchScanWhereInput[]
    NOT?: DispatchScanWhereInput | DispatchScanWhereInput[]
    id?: IntFilter<"DispatchScan"> | number
    scanId?: StringFilter<"DispatchScan"> | string
    stationId?: StringFilter<"DispatchScan"> | string
    nexsId?: StringFilter<"DispatchScan"> | string
    timestamp?: DateTimeFilter<"DispatchScan"> | Date | string
  }

  export type DispatchScanOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _relevance?: DispatchScanOrderByRelevanceInput
  }

  export type DispatchScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DispatchScanWhereInput | DispatchScanWhereInput[]
    OR?: DispatchScanWhereInput[]
    NOT?: DispatchScanWhereInput | DispatchScanWhereInput[]
    scanId?: StringFilter<"DispatchScan"> | string
    stationId?: StringFilter<"DispatchScan"> | string
    nexsId?: StringFilter<"DispatchScan"> | string
    timestamp?: DateTimeFilter<"DispatchScan"> | Date | string
  }, "id">

  export type DispatchScanOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _count?: DispatchScanCountOrderByAggregateInput
    _avg?: DispatchScanAvgOrderByAggregateInput
    _max?: DispatchScanMaxOrderByAggregateInput
    _min?: DispatchScanMinOrderByAggregateInput
    _sum?: DispatchScanSumOrderByAggregateInput
  }

  export type DispatchScanScalarWhereWithAggregatesInput = {
    AND?: DispatchScanScalarWhereWithAggregatesInput | DispatchScanScalarWhereWithAggregatesInput[]
    OR?: DispatchScanScalarWhereWithAggregatesInput[]
    NOT?: DispatchScanScalarWhereWithAggregatesInput | DispatchScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DispatchScan"> | number
    scanId?: StringWithAggregatesFilter<"DispatchScan"> | string
    stationId?: StringWithAggregatesFilter<"DispatchScan"> | string
    nexsId?: StringWithAggregatesFilter<"DispatchScan"> | string
    timestamp?: DateTimeWithAggregatesFilter<"DispatchScan"> | Date | string
  }

  export type OperationsMetadataWhereInput = {
    AND?: OperationsMetadataWhereInput | OperationsMetadataWhereInput[]
    OR?: OperationsMetadataWhereInput[]
    NOT?: OperationsMetadataWhereInput | OperationsMetadataWhereInput[]
    id?: IntFilter<"OperationsMetadata"> | number
    locationId?: StringFilter<"OperationsMetadata"> | string
    cityOdd?: StringFilter<"OperationsMetadata"> | string
    shipToCust?: StringNullableFilter<"OperationsMetadata"> | string | null
  }

  export type OperationsMetadataOrderByWithRelationInput = {
    id?: SortOrder
    locationId?: SortOrder
    cityOdd?: SortOrder
    shipToCust?: SortOrderInput | SortOrder
    _relevance?: OperationsMetadataOrderByRelevanceInput
  }

  export type OperationsMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: OperationsMetadataWhereInput | OperationsMetadataWhereInput[]
    OR?: OperationsMetadataWhereInput[]
    NOT?: OperationsMetadataWhereInput | OperationsMetadataWhereInput[]
    locationId?: StringFilter<"OperationsMetadata"> | string
    cityOdd?: StringFilter<"OperationsMetadata"> | string
    shipToCust?: StringNullableFilter<"OperationsMetadata"> | string | null
  }, "id">

  export type OperationsMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    locationId?: SortOrder
    cityOdd?: SortOrder
    shipToCust?: SortOrderInput | SortOrder
    _count?: OperationsMetadataCountOrderByAggregateInput
    _avg?: OperationsMetadataAvgOrderByAggregateInput
    _max?: OperationsMetadataMaxOrderByAggregateInput
    _min?: OperationsMetadataMinOrderByAggregateInput
    _sum?: OperationsMetadataSumOrderByAggregateInput
  }

  export type OperationsMetadataScalarWhereWithAggregatesInput = {
    AND?: OperationsMetadataScalarWhereWithAggregatesInput | OperationsMetadataScalarWhereWithAggregatesInput[]
    OR?: OperationsMetadataScalarWhereWithAggregatesInput[]
    NOT?: OperationsMetadataScalarWhereWithAggregatesInput | OperationsMetadataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OperationsMetadata"> | number
    locationId?: StringWithAggregatesFilter<"OperationsMetadata"> | string
    cityOdd?: StringWithAggregatesFilter<"OperationsMetadata"> | string
    shipToCust?: StringNullableWithAggregatesFilter<"OperationsMetadata"> | string | null
  }

  export type MaintenanceShopIssueWhereInput = {
    AND?: MaintenanceShopIssueWhereInput | MaintenanceShopIssueWhereInput[]
    OR?: MaintenanceShopIssueWhereInput[]
    NOT?: MaintenanceShopIssueWhereInput | MaintenanceShopIssueWhereInput[]
    id?: IntFilter<"MaintenanceShopIssue"> | number
    pid?: StringFilter<"MaintenanceShopIssue"> | string
    partName?: StringFilter<"MaintenanceShopIssue"> | string
    quantity?: IntFilter<"MaintenanceShopIssue"> | number
    unit?: StringFilter<"MaintenanceShopIssue"> | string
    rate?: FloatFilter<"MaintenanceShopIssue"> | number
    category?: StringFilter<"MaintenanceShopIssue"> | string
    total?: FloatFilter<"MaintenanceShopIssue"> | number
    currency?: StringNullableFilter<"MaintenanceShopIssue"> | string | null
    destination?: StringFilter<"MaintenanceShopIssue"> | string
    department?: StringFilter<"MaintenanceShopIssue"> | string
    issuedAt?: DateTimeFilter<"MaintenanceShopIssue"> | Date | string
  }

  export type MaintenanceShopIssueOrderByWithRelationInput = {
    id?: SortOrder
    pid?: SortOrder
    partName?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    rate?: SortOrder
    category?: SortOrder
    total?: SortOrder
    currency?: SortOrderInput | SortOrder
    destination?: SortOrder
    department?: SortOrder
    issuedAt?: SortOrder
    _relevance?: MaintenanceShopIssueOrderByRelevanceInput
  }

  export type MaintenanceShopIssueWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MaintenanceShopIssueWhereInput | MaintenanceShopIssueWhereInput[]
    OR?: MaintenanceShopIssueWhereInput[]
    NOT?: MaintenanceShopIssueWhereInput | MaintenanceShopIssueWhereInput[]
    pid?: StringFilter<"MaintenanceShopIssue"> | string
    partName?: StringFilter<"MaintenanceShopIssue"> | string
    quantity?: IntFilter<"MaintenanceShopIssue"> | number
    unit?: StringFilter<"MaintenanceShopIssue"> | string
    rate?: FloatFilter<"MaintenanceShopIssue"> | number
    category?: StringFilter<"MaintenanceShopIssue"> | string
    total?: FloatFilter<"MaintenanceShopIssue"> | number
    currency?: StringNullableFilter<"MaintenanceShopIssue"> | string | null
    destination?: StringFilter<"MaintenanceShopIssue"> | string
    department?: StringFilter<"MaintenanceShopIssue"> | string
    issuedAt?: DateTimeFilter<"MaintenanceShopIssue"> | Date | string
  }, "id">

  export type MaintenanceShopIssueOrderByWithAggregationInput = {
    id?: SortOrder
    pid?: SortOrder
    partName?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    rate?: SortOrder
    category?: SortOrder
    total?: SortOrder
    currency?: SortOrderInput | SortOrder
    destination?: SortOrder
    department?: SortOrder
    issuedAt?: SortOrder
    _count?: MaintenanceShopIssueCountOrderByAggregateInput
    _avg?: MaintenanceShopIssueAvgOrderByAggregateInput
    _max?: MaintenanceShopIssueMaxOrderByAggregateInput
    _min?: MaintenanceShopIssueMinOrderByAggregateInput
    _sum?: MaintenanceShopIssueSumOrderByAggregateInput
  }

  export type MaintenanceShopIssueScalarWhereWithAggregatesInput = {
    AND?: MaintenanceShopIssueScalarWhereWithAggregatesInput | MaintenanceShopIssueScalarWhereWithAggregatesInput[]
    OR?: MaintenanceShopIssueScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceShopIssueScalarWhereWithAggregatesInput | MaintenanceShopIssueScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MaintenanceShopIssue"> | number
    pid?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    partName?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    quantity?: IntWithAggregatesFilter<"MaintenanceShopIssue"> | number
    unit?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    rate?: FloatWithAggregatesFilter<"MaintenanceShopIssue"> | number
    category?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    total?: FloatWithAggregatesFilter<"MaintenanceShopIssue"> | number
    currency?: StringNullableWithAggregatesFilter<"MaintenanceShopIssue"> | string | null
    destination?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    department?: StringWithAggregatesFilter<"MaintenanceShopIssue"> | string
    issuedAt?: DateTimeWithAggregatesFilter<"MaintenanceShopIssue"> | Date | string
  }

  export type FastTrackScanWhereInput = {
    AND?: FastTrackScanWhereInput | FastTrackScanWhereInput[]
    OR?: FastTrackScanWhereInput[]
    NOT?: FastTrackScanWhereInput | FastTrackScanWhereInput[]
    id?: IntFilter<"FastTrackScan"> | number
    locationID?: StringFilter<"FastTrackScan"> | string
    cityOdd?: StringFilter<"FastTrackScan"> | string
    time?: DateTimeFilter<"FastTrackScan"> | Date | string
  }

  export type FastTrackScanOrderByWithRelationInput = {
    id?: SortOrder
    locationID?: SortOrder
    cityOdd?: SortOrder
    time?: SortOrder
    _relevance?: FastTrackScanOrderByRelevanceInput
  }

  export type FastTrackScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FastTrackScanWhereInput | FastTrackScanWhereInput[]
    OR?: FastTrackScanWhereInput[]
    NOT?: FastTrackScanWhereInput | FastTrackScanWhereInput[]
    locationID?: StringFilter<"FastTrackScan"> | string
    cityOdd?: StringFilter<"FastTrackScan"> | string
    time?: DateTimeFilter<"FastTrackScan"> | Date | string
  }, "id">

  export type FastTrackScanOrderByWithAggregationInput = {
    id?: SortOrder
    locationID?: SortOrder
    cityOdd?: SortOrder
    time?: SortOrder
    _count?: FastTrackScanCountOrderByAggregateInput
    _avg?: FastTrackScanAvgOrderByAggregateInput
    _max?: FastTrackScanMaxOrderByAggregateInput
    _min?: FastTrackScanMinOrderByAggregateInput
    _sum?: FastTrackScanSumOrderByAggregateInput
  }

  export type FastTrackScanScalarWhereWithAggregatesInput = {
    AND?: FastTrackScanScalarWhereWithAggregatesInput | FastTrackScanScalarWhereWithAggregatesInput[]
    OR?: FastTrackScanScalarWhereWithAggregatesInput[]
    NOT?: FastTrackScanScalarWhereWithAggregatesInput | FastTrackScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FastTrackScan"> | number
    locationID?: StringWithAggregatesFilter<"FastTrackScan"> | string
    cityOdd?: StringWithAggregatesFilter<"FastTrackScan"> | string
    time?: DateTimeWithAggregatesFilter<"FastTrackScan"> | Date | string
  }

  export type FR0ScanWhereInput = {
    AND?: FR0ScanWhereInput | FR0ScanWhereInput[]
    OR?: FR0ScanWhereInput[]
    NOT?: FR0ScanWhereInput | FR0ScanWhereInput[]
    id?: IntFilter<"FR0Scan"> | number
    scanId?: StringFilter<"FR0Scan"> | string
    stationId?: StringFilter<"FR0Scan"> | string
    nexsId?: StringFilter<"FR0Scan"> | string
    createdAt?: DateTimeFilter<"FR0Scan"> | Date | string
  }

  export type FR0ScanOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    createdAt?: SortOrder
    _relevance?: FR0ScanOrderByRelevanceInput
  }

  export type FR0ScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FR0ScanWhereInput | FR0ScanWhereInput[]
    OR?: FR0ScanWhereInput[]
    NOT?: FR0ScanWhereInput | FR0ScanWhereInput[]
    scanId?: StringFilter<"FR0Scan"> | string
    stationId?: StringFilter<"FR0Scan"> | string
    nexsId?: StringFilter<"FR0Scan"> | string
    createdAt?: DateTimeFilter<"FR0Scan"> | Date | string
  }, "id">

  export type FR0ScanOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    createdAt?: SortOrder
    _count?: FR0ScanCountOrderByAggregateInput
    _avg?: FR0ScanAvgOrderByAggregateInput
    _max?: FR0ScanMaxOrderByAggregateInput
    _min?: FR0ScanMinOrderByAggregateInput
    _sum?: FR0ScanSumOrderByAggregateInput
  }

  export type FR0ScanScalarWhereWithAggregatesInput = {
    AND?: FR0ScanScalarWhereWithAggregatesInput | FR0ScanScalarWhereWithAggregatesInput[]
    OR?: FR0ScanScalarWhereWithAggregatesInput[]
    NOT?: FR0ScanScalarWhereWithAggregatesInput | FR0ScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FR0Scan"> | number
    scanId?: StringWithAggregatesFilter<"FR0Scan"> | string
    stationId?: StringWithAggregatesFilter<"FR0Scan"> | string
    nexsId?: StringWithAggregatesFilter<"FR0Scan"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FR0Scan"> | Date | string
  }

  export type BulkScanWhereInput = {
    AND?: BulkScanWhereInput | BulkScanWhereInput[]
    OR?: BulkScanWhereInput[]
    NOT?: BulkScanWhereInput | BulkScanWhereInput[]
    id?: IntFilter<"BulkScan"> | number
    scanId?: StringFilter<"BulkScan"> | string
    stationId?: StringFilter<"BulkScan"> | string
    nexsId?: StringFilter<"BulkScan"> | string
    timestamp?: DateTimeFilter<"BulkScan"> | Date | string
  }

  export type BulkScanOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _relevance?: BulkScanOrderByRelevanceInput
  }

  export type BulkScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BulkScanWhereInput | BulkScanWhereInput[]
    OR?: BulkScanWhereInput[]
    NOT?: BulkScanWhereInput | BulkScanWhereInput[]
    scanId?: StringFilter<"BulkScan"> | string
    stationId?: StringFilter<"BulkScan"> | string
    nexsId?: StringFilter<"BulkScan"> | string
    timestamp?: DateTimeFilter<"BulkScan"> | Date | string
  }, "id">

  export type BulkScanOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _count?: BulkScanCountOrderByAggregateInput
    _avg?: BulkScanAvgOrderByAggregateInput
    _max?: BulkScanMaxOrderByAggregateInput
    _min?: BulkScanMinOrderByAggregateInput
    _sum?: BulkScanSumOrderByAggregateInput
  }

  export type BulkScanScalarWhereWithAggregatesInput = {
    AND?: BulkScanScalarWhereWithAggregatesInput | BulkScanScalarWhereWithAggregatesInput[]
    OR?: BulkScanScalarWhereWithAggregatesInput[]
    NOT?: BulkScanScalarWhereWithAggregatesInput | BulkScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BulkScan"> | number
    scanId?: StringWithAggregatesFilter<"BulkScan"> | string
    stationId?: StringWithAggregatesFilter<"BulkScan"> | string
    nexsId?: StringWithAggregatesFilter<"BulkScan"> | string
    timestamp?: DateTimeWithAggregatesFilter<"BulkScan"> | Date | string
  }

  export type ManualWarehouseWhereInput = {
    AND?: ManualWarehouseWhereInput | ManualWarehouseWhereInput[]
    OR?: ManualWarehouseWhereInput[]
    NOT?: ManualWarehouseWhereInput | ManualWarehouseWhereInput[]
    id?: IntFilter<"ManualWarehouse"> | number
    scanId?: StringFilter<"ManualWarehouse"> | string
    stationId?: StringFilter<"ManualWarehouse"> | string
    nexsId?: StringFilter<"ManualWarehouse"> | string
    timestamp?: DateTimeFilter<"ManualWarehouse"> | Date | string
  }

  export type ManualWarehouseOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _relevance?: ManualWarehouseOrderByRelevanceInput
  }

  export type ManualWarehouseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ManualWarehouseWhereInput | ManualWarehouseWhereInput[]
    OR?: ManualWarehouseWhereInput[]
    NOT?: ManualWarehouseWhereInput | ManualWarehouseWhereInput[]
    scanId?: StringFilter<"ManualWarehouse"> | string
    stationId?: StringFilter<"ManualWarehouse"> | string
    nexsId?: StringFilter<"ManualWarehouse"> | string
    timestamp?: DateTimeFilter<"ManualWarehouse"> | Date | string
  }, "id">

  export type ManualWarehouseOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _count?: ManualWarehouseCountOrderByAggregateInput
    _avg?: ManualWarehouseAvgOrderByAggregateInput
    _max?: ManualWarehouseMaxOrderByAggregateInput
    _min?: ManualWarehouseMinOrderByAggregateInput
    _sum?: ManualWarehouseSumOrderByAggregateInput
  }

  export type ManualWarehouseScalarWhereWithAggregatesInput = {
    AND?: ManualWarehouseScalarWhereWithAggregatesInput | ManualWarehouseScalarWhereWithAggregatesInput[]
    OR?: ManualWarehouseScalarWhereWithAggregatesInput[]
    NOT?: ManualWarehouseScalarWhereWithAggregatesInput | ManualWarehouseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ManualWarehouse"> | number
    scanId?: StringWithAggregatesFilter<"ManualWarehouse"> | string
    stationId?: StringWithAggregatesFilter<"ManualWarehouse"> | string
    nexsId?: StringWithAggregatesFilter<"ManualWarehouse"> | string
    timestamp?: DateTimeWithAggregatesFilter<"ManualWarehouse"> | Date | string
  }

  export type EHSDeviationWhereInput = {
    AND?: EHSDeviationWhereInput | EHSDeviationWhereInput[]
    OR?: EHSDeviationWhereInput[]
    NOT?: EHSDeviationWhereInput | EHSDeviationWhereInput[]
    id?: IntFilter<"EHSDeviation"> | number
    month?: StringFilter<"EHSDeviation"> | string
    date?: DateTimeFilter<"EHSDeviation"> | Date | string
    timeOfRound?: StringFilter<"EHSDeviation"> | string
    location?: StringFilter<"EHSDeviation"> | string
    responsibleDepartment?: StringFilter<"EHSDeviation"> | string
    remarks?: StringFilter<"EHSDeviation"> | string
    observations?: StringFilter<"EHSDeviation"> | string
    photographBefore?: StringNullableFilter<"EHSDeviation"> | string | null
    controlMeasures?: StringFilter<"EHSDeviation"> | string
    photographAfter?: StringNullableFilter<"EHSDeviation"> | string | null
    categorization?: StringFilter<"EHSDeviation"> | string
    remarksByDepartment?: StringNullableFilter<"EHSDeviation"> | string | null
    complianceStatus?: StringFilter<"EHSDeviation"> | string
    createdAt?: DateTimeFilter<"EHSDeviation"> | Date | string
    updatedAt?: DateTimeFilter<"EHSDeviation"> | Date | string
    complianceDate?: DateTimeNullableFilter<"EHSDeviation"> | Date | string | null
  }

  export type EHSDeviationOrderByWithRelationInput = {
    id?: SortOrder
    month?: SortOrder
    date?: SortOrder
    timeOfRound?: SortOrder
    location?: SortOrder
    responsibleDepartment?: SortOrder
    remarks?: SortOrder
    observations?: SortOrder
    photographBefore?: SortOrderInput | SortOrder
    controlMeasures?: SortOrder
    photographAfter?: SortOrderInput | SortOrder
    categorization?: SortOrder
    remarksByDepartment?: SortOrderInput | SortOrder
    complianceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complianceDate?: SortOrderInput | SortOrder
    _relevance?: EHSDeviationOrderByRelevanceInput
  }

  export type EHSDeviationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EHSDeviationWhereInput | EHSDeviationWhereInput[]
    OR?: EHSDeviationWhereInput[]
    NOT?: EHSDeviationWhereInput | EHSDeviationWhereInput[]
    month?: StringFilter<"EHSDeviation"> | string
    date?: DateTimeFilter<"EHSDeviation"> | Date | string
    timeOfRound?: StringFilter<"EHSDeviation"> | string
    location?: StringFilter<"EHSDeviation"> | string
    responsibleDepartment?: StringFilter<"EHSDeviation"> | string
    remarks?: StringFilter<"EHSDeviation"> | string
    observations?: StringFilter<"EHSDeviation"> | string
    photographBefore?: StringNullableFilter<"EHSDeviation"> | string | null
    controlMeasures?: StringFilter<"EHSDeviation"> | string
    photographAfter?: StringNullableFilter<"EHSDeviation"> | string | null
    categorization?: StringFilter<"EHSDeviation"> | string
    remarksByDepartment?: StringNullableFilter<"EHSDeviation"> | string | null
    complianceStatus?: StringFilter<"EHSDeviation"> | string
    createdAt?: DateTimeFilter<"EHSDeviation"> | Date | string
    updatedAt?: DateTimeFilter<"EHSDeviation"> | Date | string
    complianceDate?: DateTimeNullableFilter<"EHSDeviation"> | Date | string | null
  }, "id">

  export type EHSDeviationOrderByWithAggregationInput = {
    id?: SortOrder
    month?: SortOrder
    date?: SortOrder
    timeOfRound?: SortOrder
    location?: SortOrder
    responsibleDepartment?: SortOrder
    remarks?: SortOrder
    observations?: SortOrder
    photographBefore?: SortOrderInput | SortOrder
    controlMeasures?: SortOrder
    photographAfter?: SortOrderInput | SortOrder
    categorization?: SortOrder
    remarksByDepartment?: SortOrderInput | SortOrder
    complianceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complianceDate?: SortOrderInput | SortOrder
    _count?: EHSDeviationCountOrderByAggregateInput
    _avg?: EHSDeviationAvgOrderByAggregateInput
    _max?: EHSDeviationMaxOrderByAggregateInput
    _min?: EHSDeviationMinOrderByAggregateInput
    _sum?: EHSDeviationSumOrderByAggregateInput
  }

  export type EHSDeviationScalarWhereWithAggregatesInput = {
    AND?: EHSDeviationScalarWhereWithAggregatesInput | EHSDeviationScalarWhereWithAggregatesInput[]
    OR?: EHSDeviationScalarWhereWithAggregatesInput[]
    NOT?: EHSDeviationScalarWhereWithAggregatesInput | EHSDeviationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EHSDeviation"> | number
    month?: StringWithAggregatesFilter<"EHSDeviation"> | string
    date?: DateTimeWithAggregatesFilter<"EHSDeviation"> | Date | string
    timeOfRound?: StringWithAggregatesFilter<"EHSDeviation"> | string
    location?: StringWithAggregatesFilter<"EHSDeviation"> | string
    responsibleDepartment?: StringWithAggregatesFilter<"EHSDeviation"> | string
    remarks?: StringWithAggregatesFilter<"EHSDeviation"> | string
    observations?: StringWithAggregatesFilter<"EHSDeviation"> | string
    photographBefore?: StringNullableWithAggregatesFilter<"EHSDeviation"> | string | null
    controlMeasures?: StringWithAggregatesFilter<"EHSDeviation"> | string
    photographAfter?: StringNullableWithAggregatesFilter<"EHSDeviation"> | string | null
    categorization?: StringWithAggregatesFilter<"EHSDeviation"> | string
    remarksByDepartment?: StringNullableWithAggregatesFilter<"EHSDeviation"> | string | null
    complianceStatus?: StringWithAggregatesFilter<"EHSDeviation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EHSDeviation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EHSDeviation"> | Date | string
    complianceDate?: DateTimeNullableWithAggregatesFilter<"EHSDeviation"> | Date | string | null
  }

  export type CourierHandoverWhereInput = {
    AND?: CourierHandoverWhereInput | CourierHandoverWhereInput[]
    OR?: CourierHandoverWhereInput[]
    NOT?: CourierHandoverWhereInput | CourierHandoverWhereInput[]
    id?: IntFilter<"CourierHandover"> | number
    partner?: StringFilter<"CourierHandover"> | string
    awb?: StringFilter<"CourierHandover"> | string
    personId?: StringFilter<"CourierHandover"> | string
    lastScan?: DateTimeFilter<"CourierHandover"> | Date | string
    duplicate?: BoolFilter<"CourierHandover"> | boolean
    mismatch?: BoolFilter<"CourierHandover"> | boolean
    detectedPartner?: StringNullableFilter<"CourierHandover"> | string | null
  }

  export type CourierHandoverOrderByWithRelationInput = {
    id?: SortOrder
    partner?: SortOrder
    awb?: SortOrder
    personId?: SortOrder
    lastScan?: SortOrder
    duplicate?: SortOrder
    mismatch?: SortOrder
    detectedPartner?: SortOrderInput | SortOrder
    _relevance?: CourierHandoverOrderByRelevanceInput
  }

  export type CourierHandoverWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CourierHandoverWhereInput | CourierHandoverWhereInput[]
    OR?: CourierHandoverWhereInput[]
    NOT?: CourierHandoverWhereInput | CourierHandoverWhereInput[]
    partner?: StringFilter<"CourierHandover"> | string
    awb?: StringFilter<"CourierHandover"> | string
    personId?: StringFilter<"CourierHandover"> | string
    lastScan?: DateTimeFilter<"CourierHandover"> | Date | string
    duplicate?: BoolFilter<"CourierHandover"> | boolean
    mismatch?: BoolFilter<"CourierHandover"> | boolean
    detectedPartner?: StringNullableFilter<"CourierHandover"> | string | null
  }, "id">

  export type CourierHandoverOrderByWithAggregationInput = {
    id?: SortOrder
    partner?: SortOrder
    awb?: SortOrder
    personId?: SortOrder
    lastScan?: SortOrder
    duplicate?: SortOrder
    mismatch?: SortOrder
    detectedPartner?: SortOrderInput | SortOrder
    _count?: CourierHandoverCountOrderByAggregateInput
    _avg?: CourierHandoverAvgOrderByAggregateInput
    _max?: CourierHandoverMaxOrderByAggregateInput
    _min?: CourierHandoverMinOrderByAggregateInput
    _sum?: CourierHandoverSumOrderByAggregateInput
  }

  export type CourierHandoverScalarWhereWithAggregatesInput = {
    AND?: CourierHandoverScalarWhereWithAggregatesInput | CourierHandoverScalarWhereWithAggregatesInput[]
    OR?: CourierHandoverScalarWhereWithAggregatesInput[]
    NOT?: CourierHandoverScalarWhereWithAggregatesInput | CourierHandoverScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CourierHandover"> | number
    partner?: StringWithAggregatesFilter<"CourierHandover"> | string
    awb?: StringWithAggregatesFilter<"CourierHandover"> | string
    personId?: StringWithAggregatesFilter<"CourierHandover"> | string
    lastScan?: DateTimeWithAggregatesFilter<"CourierHandover"> | Date | string
    duplicate?: BoolWithAggregatesFilter<"CourierHandover"> | boolean
    mismatch?: BoolWithAggregatesFilter<"CourierHandover"> | boolean
    detectedPartner?: StringNullableWithAggregatesFilter<"CourierHandover"> | string | null
  }

  export type MetalFrameFittingScanWhereInput = {
    AND?: MetalFrameFittingScanWhereInput | MetalFrameFittingScanWhereInput[]
    OR?: MetalFrameFittingScanWhereInput[]
    NOT?: MetalFrameFittingScanWhereInput | MetalFrameFittingScanWhereInput[]
    id?: IntFilter<"MetalFrameFittingScan"> | number
    scanId?: StringFilter<"MetalFrameFittingScan"> | string
    stationId?: StringFilter<"MetalFrameFittingScan"> | string
    nexsId?: StringFilter<"MetalFrameFittingScan"> | string
    pid?: StringNullableFilter<"MetalFrameFittingScan"> | string | null
    timestamp?: DateTimeFilter<"MetalFrameFittingScan"> | Date | string
  }

  export type MetalFrameFittingScanOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    pid?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _relevance?: MetalFrameFittingScanOrderByRelevanceInput
  }

  export type MetalFrameFittingScanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MetalFrameFittingScanWhereInput | MetalFrameFittingScanWhereInput[]
    OR?: MetalFrameFittingScanWhereInput[]
    NOT?: MetalFrameFittingScanWhereInput | MetalFrameFittingScanWhereInput[]
    scanId?: StringFilter<"MetalFrameFittingScan"> | string
    stationId?: StringFilter<"MetalFrameFittingScan"> | string
    nexsId?: StringFilter<"MetalFrameFittingScan"> | string
    pid?: StringNullableFilter<"MetalFrameFittingScan"> | string | null
    timestamp?: DateTimeFilter<"MetalFrameFittingScan"> | Date | string
  }, "id">

  export type MetalFrameFittingScanOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    pid?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: MetalFrameFittingScanCountOrderByAggregateInput
    _avg?: MetalFrameFittingScanAvgOrderByAggregateInput
    _max?: MetalFrameFittingScanMaxOrderByAggregateInput
    _min?: MetalFrameFittingScanMinOrderByAggregateInput
    _sum?: MetalFrameFittingScanSumOrderByAggregateInput
  }

  export type MetalFrameFittingScanScalarWhereWithAggregatesInput = {
    AND?: MetalFrameFittingScanScalarWhereWithAggregatesInput | MetalFrameFittingScanScalarWhereWithAggregatesInput[]
    OR?: MetalFrameFittingScanScalarWhereWithAggregatesInput[]
    NOT?: MetalFrameFittingScanScalarWhereWithAggregatesInput | MetalFrameFittingScanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MetalFrameFittingScan"> | number
    scanId?: StringWithAggregatesFilter<"MetalFrameFittingScan"> | string
    stationId?: StringWithAggregatesFilter<"MetalFrameFittingScan"> | string
    nexsId?: StringWithAggregatesFilter<"MetalFrameFittingScan"> | string
    pid?: StringNullableWithAggregatesFilter<"MetalFrameFittingScan"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"MetalFrameFittingScan"> | Date | string
  }

  export type OrderUpdateDashboardStudyWhereInput = {
    AND?: OrderUpdateDashboardStudyWhereInput | OrderUpdateDashboardStudyWhereInput[]
    OR?: OrderUpdateDashboardStudyWhereInput[]
    NOT?: OrderUpdateDashboardStudyWhereInput | OrderUpdateDashboardStudyWhereInput[]
    id?: IntFilter<"OrderUpdateDashboardStudy"> | number
    wave?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderStatus?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    stationId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    fittingId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    updatedFittingId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderSyncTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderItemId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    sku?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    unallocatedReason?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    itemType?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    quantity?: IntNullableFilter<"OrderUpdateDashboardStudy"> | number | null
    priority?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderItemStatus?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    waveState?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    category?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    trayId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    jitFlag?: BoolNullableFilter<"OrderUpdateDashboardStudy"> | boolean | null
    serialNo?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    responseMessage?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    pickingCutoffTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderAllocationTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    itemPickedTimestamp?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    uploadedAt?: DateTimeFilter<"OrderUpdateDashboardStudy"> | Date | string
  }

  export type OrderUpdateDashboardStudyOrderByWithRelationInput = {
    id?: SortOrder
    wave?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    orderStatus?: SortOrderInput | SortOrder
    stationId?: SortOrderInput | SortOrder
    fittingId?: SortOrderInput | SortOrder
    updatedFittingId?: SortOrderInput | SortOrder
    orderSyncTime?: SortOrderInput | SortOrder
    orderItemId?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    unallocatedReason?: SortOrderInput | SortOrder
    itemType?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    orderItemStatus?: SortOrderInput | SortOrder
    waveState?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    trayId?: SortOrderInput | SortOrder
    jitFlag?: SortOrderInput | SortOrder
    serialNo?: SortOrderInput | SortOrder
    responseMessage?: SortOrderInput | SortOrder
    pickingCutoffTime?: SortOrderInput | SortOrder
    orderAllocationTime?: SortOrderInput | SortOrder
    itemPickedTimestamp?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    _relevance?: OrderUpdateDashboardStudyOrderByRelevanceInput
  }

  export type OrderUpdateDashboardStudyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: OrderUpdateDashboardStudyWhereInput | OrderUpdateDashboardStudyWhereInput[]
    OR?: OrderUpdateDashboardStudyWhereInput[]
    NOT?: OrderUpdateDashboardStudyWhereInput | OrderUpdateDashboardStudyWhereInput[]
    wave?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderStatus?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    stationId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    fittingId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    updatedFittingId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderSyncTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderItemId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    sku?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    unallocatedReason?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    itemType?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    quantity?: IntNullableFilter<"OrderUpdateDashboardStudy"> | number | null
    priority?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    orderItemStatus?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    waveState?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    category?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    trayId?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    jitFlag?: BoolNullableFilter<"OrderUpdateDashboardStudy"> | boolean | null
    serialNo?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    responseMessage?: StringNullableFilter<"OrderUpdateDashboardStudy"> | string | null
    pickingCutoffTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderAllocationTime?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    itemPickedTimestamp?: DateTimeNullableFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    uploadedAt?: DateTimeFilter<"OrderUpdateDashboardStudy"> | Date | string
  }, "id">

  export type OrderUpdateDashboardStudyOrderByWithAggregationInput = {
    id?: SortOrder
    wave?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    orderStatus?: SortOrderInput | SortOrder
    stationId?: SortOrderInput | SortOrder
    fittingId?: SortOrderInput | SortOrder
    updatedFittingId?: SortOrderInput | SortOrder
    orderSyncTime?: SortOrderInput | SortOrder
    orderItemId?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    unallocatedReason?: SortOrderInput | SortOrder
    itemType?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    orderItemStatus?: SortOrderInput | SortOrder
    waveState?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    trayId?: SortOrderInput | SortOrder
    jitFlag?: SortOrderInput | SortOrder
    serialNo?: SortOrderInput | SortOrder
    responseMessage?: SortOrderInput | SortOrder
    pickingCutoffTime?: SortOrderInput | SortOrder
    orderAllocationTime?: SortOrderInput | SortOrder
    itemPickedTimestamp?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    _count?: OrderUpdateDashboardStudyCountOrderByAggregateInput
    _avg?: OrderUpdateDashboardStudyAvgOrderByAggregateInput
    _max?: OrderUpdateDashboardStudyMaxOrderByAggregateInput
    _min?: OrderUpdateDashboardStudyMinOrderByAggregateInput
    _sum?: OrderUpdateDashboardStudySumOrderByAggregateInput
  }

  export type OrderUpdateDashboardStudyScalarWhereWithAggregatesInput = {
    AND?: OrderUpdateDashboardStudyScalarWhereWithAggregatesInput | OrderUpdateDashboardStudyScalarWhereWithAggregatesInput[]
    OR?: OrderUpdateDashboardStudyScalarWhereWithAggregatesInput[]
    NOT?: OrderUpdateDashboardStudyScalarWhereWithAggregatesInput | OrderUpdateDashboardStudyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OrderUpdateDashboardStudy"> | number
    wave?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    orderId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    orderStatus?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    stationId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    fittingId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    updatedFittingId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    orderSyncTime?: DateTimeNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderItemId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    sku?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    unallocatedReason?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    itemType?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    quantity?: IntNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | number | null
    priority?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    orderItemStatus?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    waveState?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    category?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    trayId?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    jitFlag?: BoolNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | boolean | null
    serialNo?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    responseMessage?: StringNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | string | null
    pickingCutoffTime?: DateTimeNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    orderAllocationTime?: DateTimeNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    itemPickedTimestamp?: DateTimeNullableWithAggregatesFilter<"OrderUpdateDashboardStudy"> | Date | string | null
    uploadedAt?: DateTimeWithAggregatesFilter<"OrderUpdateDashboardStudy"> | Date | string
  }

  export type InventoryPIDWhereInput = {
    AND?: InventoryPIDWhereInput | InventoryPIDWhereInput[]
    OR?: InventoryPIDWhereInput[]
    NOT?: InventoryPIDWhereInput | InventoryPIDWhereInput[]
    PID?: StringFilter<"InventoryPID"> | string
    Comment?: StringNullableFilter<"InventoryPID"> | string | null
  }

  export type InventoryPIDOrderByWithRelationInput = {
    PID?: SortOrder
    Comment?: SortOrderInput | SortOrder
    _relevance?: InventoryPIDOrderByRelevanceInput
  }

  export type InventoryPIDWhereUniqueInput = Prisma.AtLeast<{
    PID?: string
    AND?: InventoryPIDWhereInput | InventoryPIDWhereInput[]
    OR?: InventoryPIDWhereInput[]
    NOT?: InventoryPIDWhereInput | InventoryPIDWhereInput[]
    Comment?: StringNullableFilter<"InventoryPID"> | string | null
  }, "PID">

  export type InventoryPIDOrderByWithAggregationInput = {
    PID?: SortOrder
    Comment?: SortOrderInput | SortOrder
    _count?: InventoryPIDCountOrderByAggregateInput
    _max?: InventoryPIDMaxOrderByAggregateInput
    _min?: InventoryPIDMinOrderByAggregateInput
  }

  export type InventoryPIDScalarWhereWithAggregatesInput = {
    AND?: InventoryPIDScalarWhereWithAggregatesInput | InventoryPIDScalarWhereWithAggregatesInput[]
    OR?: InventoryPIDScalarWhereWithAggregatesInput[]
    NOT?: InventoryPIDScalarWhereWithAggregatesInput | InventoryPIDScalarWhereWithAggregatesInput[]
    PID?: StringWithAggregatesFilter<"InventoryPID"> | string
    Comment?: StringNullableWithAggregatesFilter<"InventoryPID"> | string | null
  }

  export type FR0BulkHOTOWhereInput = {
    AND?: FR0BulkHOTOWhereInput | FR0BulkHOTOWhereInput[]
    OR?: FR0BulkHOTOWhereInput[]
    NOT?: FR0BulkHOTOWhereInput | FR0BulkHOTOWhereInput[]
    id?: IntFilter<"FR0BulkHOTO"> | number
    scanId?: StringFilter<"FR0BulkHOTO"> | string
    stationId?: StringFilter<"FR0BulkHOTO"> | string
    nexsId?: StringFilter<"FR0BulkHOTO"> | string
    timestamp?: DateTimeFilter<"FR0BulkHOTO"> | Date | string
  }

  export type FR0BulkHOTOOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _relevance?: FR0BulkHOTOOrderByRelevanceInput
  }

  export type FR0BulkHOTOWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FR0BulkHOTOWhereInput | FR0BulkHOTOWhereInput[]
    OR?: FR0BulkHOTOWhereInput[]
    NOT?: FR0BulkHOTOWhereInput | FR0BulkHOTOWhereInput[]
    scanId?: StringFilter<"FR0BulkHOTO"> | string
    stationId?: StringFilter<"FR0BulkHOTO"> | string
    nexsId?: StringFilter<"FR0BulkHOTO"> | string
    timestamp?: DateTimeFilter<"FR0BulkHOTO"> | Date | string
  }, "id">

  export type FR0BulkHOTOOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
    _count?: FR0BulkHOTOCountOrderByAggregateInput
    _avg?: FR0BulkHOTOAvgOrderByAggregateInput
    _max?: FR0BulkHOTOMaxOrderByAggregateInput
    _min?: FR0BulkHOTOMinOrderByAggregateInput
    _sum?: FR0BulkHOTOSumOrderByAggregateInput
  }

  export type FR0BulkHOTOScalarWhereWithAggregatesInput = {
    AND?: FR0BulkHOTOScalarWhereWithAggregatesInput | FR0BulkHOTOScalarWhereWithAggregatesInput[]
    OR?: FR0BulkHOTOScalarWhereWithAggregatesInput[]
    NOT?: FR0BulkHOTOScalarWhereWithAggregatesInput | FR0BulkHOTOScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FR0BulkHOTO"> | number
    scanId?: StringWithAggregatesFilter<"FR0BulkHOTO"> | string
    stationId?: StringWithAggregatesFilter<"FR0BulkHOTO"> | string
    nexsId?: StringWithAggregatesFilter<"FR0BulkHOTO"> | string
    timestamp?: DateTimeWithAggregatesFilter<"FR0BulkHOTO"> | Date | string
  }

  export type ManualWarehouseSetUpWhereInput = {
    AND?: ManualWarehouseSetUpWhereInput | ManualWarehouseSetUpWhereInput[]
    OR?: ManualWarehouseSetUpWhereInput[]
    NOT?: ManualWarehouseSetUpWhereInput | ManualWarehouseSetUpWhereInput[]
    id?: IntFilter<"ManualWarehouseSetUp"> | number
    pid?: StringFilter<"ManualWarehouseSetUp"> | string
    location?: StringFilter<"ManualWarehouseSetUp"> | string
    package?: StringFilter<"ManualWarehouseSetUp"> | string
    createdAt?: DateTimeFilter<"ManualWarehouseSetUp"> | Date | string
  }

  export type ManualWarehouseSetUpOrderByWithRelationInput = {
    id?: SortOrder
    pid?: SortOrder
    location?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
    _relevance?: ManualWarehouseSetUpOrderByRelevanceInput
  }

  export type ManualWarehouseSetUpWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    pid?: string
    AND?: ManualWarehouseSetUpWhereInput | ManualWarehouseSetUpWhereInput[]
    OR?: ManualWarehouseSetUpWhereInput[]
    NOT?: ManualWarehouseSetUpWhereInput | ManualWarehouseSetUpWhereInput[]
    location?: StringFilter<"ManualWarehouseSetUp"> | string
    package?: StringFilter<"ManualWarehouseSetUp"> | string
    createdAt?: DateTimeFilter<"ManualWarehouseSetUp"> | Date | string
  }, "id" | "pid">

  export type ManualWarehouseSetUpOrderByWithAggregationInput = {
    id?: SortOrder
    pid?: SortOrder
    location?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
    _count?: ManualWarehouseSetUpCountOrderByAggregateInput
    _avg?: ManualWarehouseSetUpAvgOrderByAggregateInput
    _max?: ManualWarehouseSetUpMaxOrderByAggregateInput
    _min?: ManualWarehouseSetUpMinOrderByAggregateInput
    _sum?: ManualWarehouseSetUpSumOrderByAggregateInput
  }

  export type ManualWarehouseSetUpScalarWhereWithAggregatesInput = {
    AND?: ManualWarehouseSetUpScalarWhereWithAggregatesInput | ManualWarehouseSetUpScalarWhereWithAggregatesInput[]
    OR?: ManualWarehouseSetUpScalarWhereWithAggregatesInput[]
    NOT?: ManualWarehouseSetUpScalarWhereWithAggregatesInput | ManualWarehouseSetUpScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ManualWarehouseSetUp"> | number
    pid?: StringWithAggregatesFilter<"ManualWarehouseSetUp"> | string
    location?: StringWithAggregatesFilter<"ManualWarehouseSetUp"> | string
    package?: StringWithAggregatesFilter<"ManualWarehouseSetUp"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ManualWarehouseSetUp"> | Date | string
  }

  export type UserCreateInput = {
    employeeCode: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: number
    employeeCode: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    employeeCode?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employeeCode?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: number
    employeeCode: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    employeeCode?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employeeCode?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingMetadataCreateInput = {
    shippingID: string
    city: string
  }

  export type ShippingMetadataUncheckedCreateInput = {
    id?: number
    shippingID: string
    city: string
  }

  export type ShippingMetadataUpdateInput = {
    shippingID?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type ShippingMetadataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    shippingID?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type ShippingMetadataCreateManyInput = {
    id?: number
    shippingID: string
    city: string
  }

  export type ShippingMetadataUpdateManyMutationInput = {
    shippingID?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type ShippingMetadataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    shippingID?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type PackingScanCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type PackingScanUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type PackingScanUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackingScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackingScanCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type PackingScanUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackingScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispatchScanCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type DispatchScanUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type DispatchScanUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispatchScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispatchScanCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type DispatchScanUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispatchScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationsMetadataCreateInput = {
    locationId: string
    cityOdd: string
    shipToCust?: string | null
  }

  export type OperationsMetadataUncheckedCreateInput = {
    id?: number
    locationId: string
    cityOdd: string
    shipToCust?: string | null
  }

  export type OperationsMetadataUpdateInput = {
    locationId?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    shipToCust?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OperationsMetadataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    shipToCust?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OperationsMetadataCreateManyInput = {
    id?: number
    locationId: string
    cityOdd: string
    shipToCust?: string | null
  }

  export type OperationsMetadataUpdateManyMutationInput = {
    locationId?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    shipToCust?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OperationsMetadataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    shipToCust?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceShopIssueCreateInput = {
    pid: string
    partName: string
    quantity: number
    unit: string
    rate: number
    category: string
    total: number
    currency?: string | null
    destination: string
    department: string
    issuedAt?: Date | string
  }

  export type MaintenanceShopIssueUncheckedCreateInput = {
    id?: number
    pid: string
    partName: string
    quantity: number
    unit: string
    rate: number
    category: string
    total: number
    currency?: string | null
    destination: string
    department: string
    issuedAt?: Date | string
  }

  export type MaintenanceShopIssueUpdateInput = {
    pid?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    total?: FloatFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceShopIssueUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    pid?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    total?: FloatFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceShopIssueCreateManyInput = {
    id?: number
    pid: string
    partName: string
    quantity: number
    unit: string
    rate: number
    category: string
    total: number
    currency?: string | null
    destination: string
    department: string
    issuedAt?: Date | string
  }

  export type MaintenanceShopIssueUpdateManyMutationInput = {
    pid?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    total?: FloatFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceShopIssueUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    pid?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    total?: FloatFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FastTrackScanCreateInput = {
    locationID: string
    cityOdd: string
    time?: Date | string
  }

  export type FastTrackScanUncheckedCreateInput = {
    id?: number
    locationID: string
    cityOdd: string
    time?: Date | string
  }

  export type FastTrackScanUpdateInput = {
    locationID?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FastTrackScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationID?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FastTrackScanCreateManyInput = {
    id?: number
    locationID: string
    cityOdd: string
    time?: Date | string
  }

  export type FastTrackScanUpdateManyMutationInput = {
    locationID?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FastTrackScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationID?: StringFieldUpdateOperationsInput | string
    cityOdd?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0ScanCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    createdAt?: Date | string
  }

  export type FR0ScanUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    createdAt?: Date | string
  }

  export type FR0ScanUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0ScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0ScanCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    createdAt?: Date | string
  }

  export type FR0ScanUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0ScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BulkScanCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type BulkScanUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type BulkScanUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BulkScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BulkScanCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type BulkScanUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BulkScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type ManualWarehouseUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type ManualWarehouseUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type ManualWarehouseUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EHSDeviationCreateInput = {
    month: string
    date: Date | string
    timeOfRound: string
    location: string
    responsibleDepartment: string
    remarks: string
    observations: string
    photographBefore?: string | null
    controlMeasures: string
    photographAfter?: string | null
    categorization?: string
    remarksByDepartment?: string | null
    complianceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    complianceDate?: Date | string | null
  }

  export type EHSDeviationUncheckedCreateInput = {
    id?: number
    month: string
    date: Date | string
    timeOfRound: string
    location: string
    responsibleDepartment: string
    remarks: string
    observations: string
    photographBefore?: string | null
    controlMeasures: string
    photographAfter?: string | null
    categorization?: string
    remarksByDepartment?: string | null
    complianceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    complianceDate?: Date | string | null
  }

  export type EHSDeviationUpdateInput = {
    month?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    timeOfRound?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    responsibleDepartment?: StringFieldUpdateOperationsInput | string
    remarks?: StringFieldUpdateOperationsInput | string
    observations?: StringFieldUpdateOperationsInput | string
    photographBefore?: NullableStringFieldUpdateOperationsInput | string | null
    controlMeasures?: StringFieldUpdateOperationsInput | string
    photographAfter?: NullableStringFieldUpdateOperationsInput | string | null
    categorization?: StringFieldUpdateOperationsInput | string
    remarksByDepartment?: NullableStringFieldUpdateOperationsInput | string | null
    complianceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complianceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EHSDeviationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    month?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    timeOfRound?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    responsibleDepartment?: StringFieldUpdateOperationsInput | string
    remarks?: StringFieldUpdateOperationsInput | string
    observations?: StringFieldUpdateOperationsInput | string
    photographBefore?: NullableStringFieldUpdateOperationsInput | string | null
    controlMeasures?: StringFieldUpdateOperationsInput | string
    photographAfter?: NullableStringFieldUpdateOperationsInput | string | null
    categorization?: StringFieldUpdateOperationsInput | string
    remarksByDepartment?: NullableStringFieldUpdateOperationsInput | string | null
    complianceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complianceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EHSDeviationCreateManyInput = {
    id?: number
    month: string
    date: Date | string
    timeOfRound: string
    location: string
    responsibleDepartment: string
    remarks: string
    observations: string
    photographBefore?: string | null
    controlMeasures: string
    photographAfter?: string | null
    categorization?: string
    remarksByDepartment?: string | null
    complianceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    complianceDate?: Date | string | null
  }

  export type EHSDeviationUpdateManyMutationInput = {
    month?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    timeOfRound?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    responsibleDepartment?: StringFieldUpdateOperationsInput | string
    remarks?: StringFieldUpdateOperationsInput | string
    observations?: StringFieldUpdateOperationsInput | string
    photographBefore?: NullableStringFieldUpdateOperationsInput | string | null
    controlMeasures?: StringFieldUpdateOperationsInput | string
    photographAfter?: NullableStringFieldUpdateOperationsInput | string | null
    categorization?: StringFieldUpdateOperationsInput | string
    remarksByDepartment?: NullableStringFieldUpdateOperationsInput | string | null
    complianceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complianceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EHSDeviationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    month?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    timeOfRound?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    responsibleDepartment?: StringFieldUpdateOperationsInput | string
    remarks?: StringFieldUpdateOperationsInput | string
    observations?: StringFieldUpdateOperationsInput | string
    photographBefore?: NullableStringFieldUpdateOperationsInput | string | null
    controlMeasures?: StringFieldUpdateOperationsInput | string
    photographAfter?: NullableStringFieldUpdateOperationsInput | string | null
    categorization?: StringFieldUpdateOperationsInput | string
    remarksByDepartment?: NullableStringFieldUpdateOperationsInput | string | null
    complianceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complianceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CourierHandoverCreateInput = {
    partner: string
    awb: string
    personId: string
    lastScan?: Date | string
    duplicate?: boolean
    mismatch?: boolean
    detectedPartner?: string | null
  }

  export type CourierHandoverUncheckedCreateInput = {
    id?: number
    partner: string
    awb: string
    personId: string
    lastScan?: Date | string
    duplicate?: boolean
    mismatch?: boolean
    detectedPartner?: string | null
  }

  export type CourierHandoverUpdateInput = {
    partner?: StringFieldUpdateOperationsInput | string
    awb?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    lastScan?: DateTimeFieldUpdateOperationsInput | Date | string
    duplicate?: BoolFieldUpdateOperationsInput | boolean
    mismatch?: BoolFieldUpdateOperationsInput | boolean
    detectedPartner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CourierHandoverUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    partner?: StringFieldUpdateOperationsInput | string
    awb?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    lastScan?: DateTimeFieldUpdateOperationsInput | Date | string
    duplicate?: BoolFieldUpdateOperationsInput | boolean
    mismatch?: BoolFieldUpdateOperationsInput | boolean
    detectedPartner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CourierHandoverCreateManyInput = {
    id?: number
    partner: string
    awb: string
    personId: string
    lastScan?: Date | string
    duplicate?: boolean
    mismatch?: boolean
    detectedPartner?: string | null
  }

  export type CourierHandoverUpdateManyMutationInput = {
    partner?: StringFieldUpdateOperationsInput | string
    awb?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    lastScan?: DateTimeFieldUpdateOperationsInput | Date | string
    duplicate?: BoolFieldUpdateOperationsInput | boolean
    mismatch?: BoolFieldUpdateOperationsInput | boolean
    detectedPartner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CourierHandoverUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    partner?: StringFieldUpdateOperationsInput | string
    awb?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    lastScan?: DateTimeFieldUpdateOperationsInput | Date | string
    duplicate?: BoolFieldUpdateOperationsInput | boolean
    mismatch?: BoolFieldUpdateOperationsInput | boolean
    detectedPartner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetalFrameFittingScanCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    pid?: string | null
    timestamp?: Date | string
  }

  export type MetalFrameFittingScanUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    pid?: string | null
    timestamp?: Date | string
  }

  export type MetalFrameFittingScanUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    pid?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetalFrameFittingScanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    pid?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetalFrameFittingScanCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    pid?: string | null
    timestamp?: Date | string
  }

  export type MetalFrameFittingScanUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    pid?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetalFrameFittingScanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    pid?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateDashboardStudyCreateInput = {
    wave?: string | null
    orderId?: string | null
    orderStatus?: string | null
    stationId?: string | null
    fittingId?: string | null
    updatedFittingId?: string | null
    orderSyncTime?: Date | string | null
    orderItemId?: string | null
    sku?: string | null
    unallocatedReason?: string | null
    itemType?: string | null
    quantity?: number | null
    priority?: string | null
    orderItemStatus?: string | null
    waveState?: string | null
    category?: string | null
    trayId?: string | null
    jitFlag?: boolean | null
    serialNo?: string | null
    responseMessage?: string | null
    pickingCutoffTime?: Date | string | null
    orderAllocationTime?: Date | string | null
    itemPickedTimestamp?: Date | string | null
    uploadedAt?: Date | string
  }

  export type OrderUpdateDashboardStudyUncheckedCreateInput = {
    id?: number
    wave?: string | null
    orderId?: string | null
    orderStatus?: string | null
    stationId?: string | null
    fittingId?: string | null
    updatedFittingId?: string | null
    orderSyncTime?: Date | string | null
    orderItemId?: string | null
    sku?: string | null
    unallocatedReason?: string | null
    itemType?: string | null
    quantity?: number | null
    priority?: string | null
    orderItemStatus?: string | null
    waveState?: string | null
    category?: string | null
    trayId?: string | null
    jitFlag?: boolean | null
    serialNo?: string | null
    responseMessage?: string | null
    pickingCutoffTime?: Date | string | null
    orderAllocationTime?: Date | string | null
    itemPickedTimestamp?: Date | string | null
    uploadedAt?: Date | string
  }

  export type OrderUpdateDashboardStudyUpdateInput = {
    wave?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedFittingId?: NullableStringFieldUpdateOperationsInput | string | null
    orderSyncTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    unallocatedReason?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    orderItemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    waveState?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    trayId?: NullableStringFieldUpdateOperationsInput | string | null
    jitFlag?: NullableBoolFieldUpdateOperationsInput | boolean | null
    serialNo?: NullableStringFieldUpdateOperationsInput | string | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    pickingCutoffTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderAllocationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    itemPickedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateDashboardStudyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    wave?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedFittingId?: NullableStringFieldUpdateOperationsInput | string | null
    orderSyncTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    unallocatedReason?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    orderItemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    waveState?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    trayId?: NullableStringFieldUpdateOperationsInput | string | null
    jitFlag?: NullableBoolFieldUpdateOperationsInput | boolean | null
    serialNo?: NullableStringFieldUpdateOperationsInput | string | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    pickingCutoffTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderAllocationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    itemPickedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateDashboardStudyCreateManyInput = {
    id?: number
    wave?: string | null
    orderId?: string | null
    orderStatus?: string | null
    stationId?: string | null
    fittingId?: string | null
    updatedFittingId?: string | null
    orderSyncTime?: Date | string | null
    orderItemId?: string | null
    sku?: string | null
    unallocatedReason?: string | null
    itemType?: string | null
    quantity?: number | null
    priority?: string | null
    orderItemStatus?: string | null
    waveState?: string | null
    category?: string | null
    trayId?: string | null
    jitFlag?: boolean | null
    serialNo?: string | null
    responseMessage?: string | null
    pickingCutoffTime?: Date | string | null
    orderAllocationTime?: Date | string | null
    itemPickedTimestamp?: Date | string | null
    uploadedAt?: Date | string
  }

  export type OrderUpdateDashboardStudyUpdateManyMutationInput = {
    wave?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedFittingId?: NullableStringFieldUpdateOperationsInput | string | null
    orderSyncTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    unallocatedReason?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    orderItemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    waveState?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    trayId?: NullableStringFieldUpdateOperationsInput | string | null
    jitFlag?: NullableBoolFieldUpdateOperationsInput | boolean | null
    serialNo?: NullableStringFieldUpdateOperationsInput | string | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    pickingCutoffTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderAllocationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    itemPickedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateDashboardStudyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    wave?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    fittingId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedFittingId?: NullableStringFieldUpdateOperationsInput | string | null
    orderSyncTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    unallocatedReason?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    orderItemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    waveState?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    trayId?: NullableStringFieldUpdateOperationsInput | string | null
    jitFlag?: NullableBoolFieldUpdateOperationsInput | boolean | null
    serialNo?: NullableStringFieldUpdateOperationsInput | string | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    pickingCutoffTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderAllocationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    itemPickedTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryPIDCreateInput = {
    PID: string
    Comment?: string | null
  }

  export type InventoryPIDUncheckedCreateInput = {
    PID: string
    Comment?: string | null
  }

  export type InventoryPIDUpdateInput = {
    PID?: StringFieldUpdateOperationsInput | string
    Comment?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryPIDUncheckedUpdateInput = {
    PID?: StringFieldUpdateOperationsInput | string
    Comment?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryPIDCreateManyInput = {
    PID: string
    Comment?: string | null
  }

  export type InventoryPIDUpdateManyMutationInput = {
    PID?: StringFieldUpdateOperationsInput | string
    Comment?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryPIDUncheckedUpdateManyInput = {
    PID?: StringFieldUpdateOperationsInput | string
    Comment?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FR0BulkHOTOCreateInput = {
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type FR0BulkHOTOUncheckedCreateInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type FR0BulkHOTOUpdateInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0BulkHOTOUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0BulkHOTOCreateManyInput = {
    id?: number
    scanId: string
    stationId: string
    nexsId: string
    timestamp?: Date | string
  }

  export type FR0BulkHOTOUpdateManyMutationInput = {
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FR0BulkHOTOUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scanId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    nexsId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseSetUpCreateInput = {
    pid: string
    location: string
    package: string
    createdAt?: Date | string
  }

  export type ManualWarehouseSetUpUncheckedCreateInput = {
    id?: number
    pid: string
    location: string
    package: string
    createdAt?: Date | string
  }

  export type ManualWarehouseSetUpUpdateInput = {
    pid?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseSetUpUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    pid?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseSetUpCreateManyInput = {
    id?: number
    pid: string
    location: string
    package: string
    createdAt?: Date | string
  }

  export type ManualWarehouseSetUpUpdateManyMutationInput = {
    pid?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManualWarehouseSetUpUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    pid?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    employeeCode?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeCode?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    employeeCode?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
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

  export type ShippingMetadataOrderByRelevanceInput = {
    fields: ShippingMetadataOrderByRelevanceFieldEnum | ShippingMetadataOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ShippingMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    shippingID?: SortOrder
    city?: SortOrder
  }

  export type ShippingMetadataAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ShippingMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    shippingID?: SortOrder
    city?: SortOrder
  }

  export type ShippingMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    shippingID?: SortOrder
    city?: SortOrder
  }

  export type ShippingMetadataSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PackingScanOrderByRelevanceInput = {
    fields: PackingScanOrderByRelevanceFieldEnum | PackingScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PackingScanCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type PackingScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PackingScanMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type PackingScanMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type PackingScanSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DispatchScanOrderByRelevanceInput = {
    fields: DispatchScanOrderByRelevanceFieldEnum | DispatchScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DispatchScanCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type DispatchScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DispatchScanMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type DispatchScanMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type DispatchScanSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type OperationsMetadataOrderByRelevanceInput = {
    fields: OperationsMetadataOrderByRelevanceFieldEnum | OperationsMetadataOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OperationsMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    cityOdd?: SortOrder
    shipToCust?: SortOrder
  }

  export type OperationsMetadataAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OperationsMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    cityOdd?: SortOrder
    shipToCust?: SortOrder
  }

  export type OperationsMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    cityOdd?: SortOrder
    shipToCust?: SortOrder
  }

  export type OperationsMetadataSumOrderByAggregateInput = {
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MaintenanceShopIssueOrderByRelevanceInput = {
    fields: MaintenanceShopIssueOrderByRelevanceFieldEnum | MaintenanceShopIssueOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MaintenanceShopIssueCountOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    partName?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    rate?: SortOrder
    category?: SortOrder
    total?: SortOrder
    currency?: SortOrder
    destination?: SortOrder
    department?: SortOrder
    issuedAt?: SortOrder
  }

  export type MaintenanceShopIssueAvgOrderByAggregateInput = {
    id?: SortOrder
    quantity?: SortOrder
    rate?: SortOrder
    total?: SortOrder
  }

  export type MaintenanceShopIssueMaxOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    partName?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    rate?: SortOrder
    category?: SortOrder
    total?: SortOrder
    currency?: SortOrder
    destination?: SortOrder
    department?: SortOrder
    issuedAt?: SortOrder
  }

  export type MaintenanceShopIssueMinOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    partName?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    rate?: SortOrder
    category?: SortOrder
    total?: SortOrder
    currency?: SortOrder
    destination?: SortOrder
    department?: SortOrder
    issuedAt?: SortOrder
  }

  export type MaintenanceShopIssueSumOrderByAggregateInput = {
    id?: SortOrder
    quantity?: SortOrder
    rate?: SortOrder
    total?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FastTrackScanOrderByRelevanceInput = {
    fields: FastTrackScanOrderByRelevanceFieldEnum | FastTrackScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FastTrackScanCountOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    cityOdd?: SortOrder
    time?: SortOrder
  }

  export type FastTrackScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FastTrackScanMaxOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    cityOdd?: SortOrder
    time?: SortOrder
  }

  export type FastTrackScanMinOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    cityOdd?: SortOrder
    time?: SortOrder
  }

  export type FastTrackScanSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FR0ScanOrderByRelevanceInput = {
    fields: FR0ScanOrderByRelevanceFieldEnum | FR0ScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FR0ScanCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    createdAt?: SortOrder
  }

  export type FR0ScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FR0ScanMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    createdAt?: SortOrder
  }

  export type FR0ScanMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    createdAt?: SortOrder
  }

  export type FR0ScanSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BulkScanOrderByRelevanceInput = {
    fields: BulkScanOrderByRelevanceFieldEnum | BulkScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BulkScanCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type BulkScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BulkScanMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type BulkScanMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type BulkScanSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ManualWarehouseOrderByRelevanceInput = {
    fields: ManualWarehouseOrderByRelevanceFieldEnum | ManualWarehouseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ManualWarehouseCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type ManualWarehouseAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ManualWarehouseMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type ManualWarehouseMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type ManualWarehouseSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type EHSDeviationOrderByRelevanceInput = {
    fields: EHSDeviationOrderByRelevanceFieldEnum | EHSDeviationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type EHSDeviationCountOrderByAggregateInput = {
    id?: SortOrder
    month?: SortOrder
    date?: SortOrder
    timeOfRound?: SortOrder
    location?: SortOrder
    responsibleDepartment?: SortOrder
    remarks?: SortOrder
    observations?: SortOrder
    photographBefore?: SortOrder
    controlMeasures?: SortOrder
    photographAfter?: SortOrder
    categorization?: SortOrder
    remarksByDepartment?: SortOrder
    complianceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complianceDate?: SortOrder
  }

  export type EHSDeviationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EHSDeviationMaxOrderByAggregateInput = {
    id?: SortOrder
    month?: SortOrder
    date?: SortOrder
    timeOfRound?: SortOrder
    location?: SortOrder
    responsibleDepartment?: SortOrder
    remarks?: SortOrder
    observations?: SortOrder
    photographBefore?: SortOrder
    controlMeasures?: SortOrder
    photographAfter?: SortOrder
    categorization?: SortOrder
    remarksByDepartment?: SortOrder
    complianceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complianceDate?: SortOrder
  }

  export type EHSDeviationMinOrderByAggregateInput = {
    id?: SortOrder
    month?: SortOrder
    date?: SortOrder
    timeOfRound?: SortOrder
    location?: SortOrder
    responsibleDepartment?: SortOrder
    remarks?: SortOrder
    observations?: SortOrder
    photographBefore?: SortOrder
    controlMeasures?: SortOrder
    photographAfter?: SortOrder
    categorization?: SortOrder
    remarksByDepartment?: SortOrder
    complianceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complianceDate?: SortOrder
  }

  export type EHSDeviationSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CourierHandoverOrderByRelevanceInput = {
    fields: CourierHandoverOrderByRelevanceFieldEnum | CourierHandoverOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CourierHandoverCountOrderByAggregateInput = {
    id?: SortOrder
    partner?: SortOrder
    awb?: SortOrder
    personId?: SortOrder
    lastScan?: SortOrder
    duplicate?: SortOrder
    mismatch?: SortOrder
    detectedPartner?: SortOrder
  }

  export type CourierHandoverAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CourierHandoverMaxOrderByAggregateInput = {
    id?: SortOrder
    partner?: SortOrder
    awb?: SortOrder
    personId?: SortOrder
    lastScan?: SortOrder
    duplicate?: SortOrder
    mismatch?: SortOrder
    detectedPartner?: SortOrder
  }

  export type CourierHandoverMinOrderByAggregateInput = {
    id?: SortOrder
    partner?: SortOrder
    awb?: SortOrder
    personId?: SortOrder
    lastScan?: SortOrder
    duplicate?: SortOrder
    mismatch?: SortOrder
    detectedPartner?: SortOrder
  }

  export type CourierHandoverSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MetalFrameFittingScanOrderByRelevanceInput = {
    fields: MetalFrameFittingScanOrderByRelevanceFieldEnum | MetalFrameFittingScanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MetalFrameFittingScanCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    pid?: SortOrder
    timestamp?: SortOrder
  }

  export type MetalFrameFittingScanAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MetalFrameFittingScanMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    pid?: SortOrder
    timestamp?: SortOrder
  }

  export type MetalFrameFittingScanMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    pid?: SortOrder
    timestamp?: SortOrder
  }

  export type MetalFrameFittingScanSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type OrderUpdateDashboardStudyOrderByRelevanceInput = {
    fields: OrderUpdateDashboardStudyOrderByRelevanceFieldEnum | OrderUpdateDashboardStudyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OrderUpdateDashboardStudyCountOrderByAggregateInput = {
    id?: SortOrder
    wave?: SortOrder
    orderId?: SortOrder
    orderStatus?: SortOrder
    stationId?: SortOrder
    fittingId?: SortOrder
    updatedFittingId?: SortOrder
    orderSyncTime?: SortOrder
    orderItemId?: SortOrder
    sku?: SortOrder
    unallocatedReason?: SortOrder
    itemType?: SortOrder
    quantity?: SortOrder
    priority?: SortOrder
    orderItemStatus?: SortOrder
    waveState?: SortOrder
    category?: SortOrder
    trayId?: SortOrder
    jitFlag?: SortOrder
    serialNo?: SortOrder
    responseMessage?: SortOrder
    pickingCutoffTime?: SortOrder
    orderAllocationTime?: SortOrder
    itemPickedTimestamp?: SortOrder
    uploadedAt?: SortOrder
  }

  export type OrderUpdateDashboardStudyAvgOrderByAggregateInput = {
    id?: SortOrder
    quantity?: SortOrder
  }

  export type OrderUpdateDashboardStudyMaxOrderByAggregateInput = {
    id?: SortOrder
    wave?: SortOrder
    orderId?: SortOrder
    orderStatus?: SortOrder
    stationId?: SortOrder
    fittingId?: SortOrder
    updatedFittingId?: SortOrder
    orderSyncTime?: SortOrder
    orderItemId?: SortOrder
    sku?: SortOrder
    unallocatedReason?: SortOrder
    itemType?: SortOrder
    quantity?: SortOrder
    priority?: SortOrder
    orderItemStatus?: SortOrder
    waveState?: SortOrder
    category?: SortOrder
    trayId?: SortOrder
    jitFlag?: SortOrder
    serialNo?: SortOrder
    responseMessage?: SortOrder
    pickingCutoffTime?: SortOrder
    orderAllocationTime?: SortOrder
    itemPickedTimestamp?: SortOrder
    uploadedAt?: SortOrder
  }

  export type OrderUpdateDashboardStudyMinOrderByAggregateInput = {
    id?: SortOrder
    wave?: SortOrder
    orderId?: SortOrder
    orderStatus?: SortOrder
    stationId?: SortOrder
    fittingId?: SortOrder
    updatedFittingId?: SortOrder
    orderSyncTime?: SortOrder
    orderItemId?: SortOrder
    sku?: SortOrder
    unallocatedReason?: SortOrder
    itemType?: SortOrder
    quantity?: SortOrder
    priority?: SortOrder
    orderItemStatus?: SortOrder
    waveState?: SortOrder
    category?: SortOrder
    trayId?: SortOrder
    jitFlag?: SortOrder
    serialNo?: SortOrder
    responseMessage?: SortOrder
    pickingCutoffTime?: SortOrder
    orderAllocationTime?: SortOrder
    itemPickedTimestamp?: SortOrder
    uploadedAt?: SortOrder
  }

  export type OrderUpdateDashboardStudySumOrderByAggregateInput = {
    id?: SortOrder
    quantity?: SortOrder
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type InventoryPIDOrderByRelevanceInput = {
    fields: InventoryPIDOrderByRelevanceFieldEnum | InventoryPIDOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InventoryPIDCountOrderByAggregateInput = {
    PID?: SortOrder
    Comment?: SortOrder
  }

  export type InventoryPIDMaxOrderByAggregateInput = {
    PID?: SortOrder
    Comment?: SortOrder
  }

  export type InventoryPIDMinOrderByAggregateInput = {
    PID?: SortOrder
    Comment?: SortOrder
  }

  export type FR0BulkHOTOOrderByRelevanceInput = {
    fields: FR0BulkHOTOOrderByRelevanceFieldEnum | FR0BulkHOTOOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FR0BulkHOTOCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type FR0BulkHOTOAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FR0BulkHOTOMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type FR0BulkHOTOMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    stationId?: SortOrder
    nexsId?: SortOrder
    timestamp?: SortOrder
  }

  export type FR0BulkHOTOSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ManualWarehouseSetUpOrderByRelevanceInput = {
    fields: ManualWarehouseSetUpOrderByRelevanceFieldEnum | ManualWarehouseSetUpOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ManualWarehouseSetUpCountOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    location?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type ManualWarehouseSetUpAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ManualWarehouseSetUpMaxOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    location?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type ManualWarehouseSetUpMinOrderByAggregateInput = {
    id?: SortOrder
    pid?: SortOrder
    location?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type ManualWarehouseSetUpSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
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

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
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