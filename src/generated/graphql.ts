import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  v: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBatchToken: BatchTokenReturn;
  activatePassport: ActivatePassportReturn;
  completeActivation: ActivationCompletionReturn;
};


export type MutationCreateBatchTokenArgs = {
  batchCertificate: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};


export type MutationActivatePassportArgs = {
  token: Scalars['ID'];
  passportId: Scalars['ID'];
};


export type MutationCompleteActivationArgs = {
  activationId?: Maybe<Scalars['ID']>;
};

export type ActivationCompletionReturn = {
  __typename?: 'ActivationCompletionReturn';
  result: Scalars['String'];
};

export type BatchTokenReturn = {
  __typename?: 'BatchTokenReturn';
  result: Scalars['String'];
  token?: Maybe<Scalars['ID']>;
  batchInfo?: Maybe<BatchInfo>;
};

export type ActivatePassportReturn = {
  __typename?: 'ActivatePassportReturn';
  result: Scalars['String'];
  batchInfo?: Maybe<BatchInfo>;
  headshotURL?: Maybe<Scalars['String']>;
  infoURL?: Maybe<Scalars['String']>;
  activationId?: Maybe<Scalars['ID']>;
};

export type BatchInfo = {
  __typename?: 'BatchInfo';
  uid: Scalars['ID'];
  vaccine: Scalars['String'];
  batchId: Scalars['String'];
  dosesRemaining: Scalars['Int'];
};

export type BatchInfoIn = {
  __typename?: 'BatchInfoIn';
  vaccine: Scalars['String'];
  batchId: Scalars['String'];
  doses: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ActivationCompletionReturn: ResolverTypeWrapper<ActivationCompletionReturn>;
  BatchTokenReturn: ResolverTypeWrapper<BatchTokenReturn>;
  ActivatePassportReturn: ResolverTypeWrapper<ActivatePassportReturn>;
  BatchInfo: ResolverTypeWrapper<BatchInfo>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  BatchInfoIn: ResolverTypeWrapper<BatchInfoIn>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars['String'];
  Mutation: {};
  ID: Scalars['ID'];
  ActivationCompletionReturn: ActivationCompletionReturn;
  BatchTokenReturn: BatchTokenReturn;
  ActivatePassportReturn: ActivatePassportReturn;
  BatchInfo: BatchInfo;
  Int: Scalars['Int'];
  BatchInfoIn: BatchInfoIn;
  Boolean: Scalars['Boolean'];
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  v?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBatchToken?: Resolver<ResolversTypes['BatchTokenReturn'], ParentType, ContextType, RequireFields<MutationCreateBatchTokenArgs, 'batchCertificate'>>;
  activatePassport?: Resolver<ResolversTypes['ActivatePassportReturn'], ParentType, ContextType, RequireFields<MutationActivatePassportArgs, 'token' | 'passportId'>>;
  completeActivation?: Resolver<ResolversTypes['ActivationCompletionReturn'], ParentType, ContextType, RequireFields<MutationCompleteActivationArgs, never>>;
}>;

export type ActivationCompletionReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivationCompletionReturn'] = ResolversParentTypes['ActivationCompletionReturn']> = ResolversObject<{
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BatchTokenReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchTokenReturn'] = ResolversParentTypes['BatchTokenReturn']> = ResolversObject<{
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  batchInfo?: Resolver<Maybe<ResolversTypes['BatchInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivatePassportReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivatePassportReturn'] = ResolversParentTypes['ActivatePassportReturn']> = ResolversObject<{
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  batchInfo?: Resolver<Maybe<ResolversTypes['BatchInfo']>, ParentType, ContextType>;
  headshotURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  infoURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BatchInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchInfo'] = ResolversParentTypes['BatchInfo']> = ResolversObject<{
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vaccine?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  batchId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dosesRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BatchInfoInResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchInfoIn'] = ResolversParentTypes['BatchInfoIn']> = ResolversObject<{
  vaccine?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  batchId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  doses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ActivationCompletionReturn?: ActivationCompletionReturnResolvers<ContextType>;
  BatchTokenReturn?: BatchTokenReturnResolvers<ContextType>;
  ActivatePassportReturn?: ActivatePassportReturnResolvers<ContextType>;
  BatchInfo?: BatchInfoResolvers<ContextType>;
  BatchInfoIn?: BatchInfoInResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
