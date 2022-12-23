import {
	ApolloClient,
	InMemoryCache,
	useMutation,
	useQuery as useQueryNative,
	useSubscription,
	gql,
	split,
	HttpLink
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'

import { getToken, isLoggedIn } from './user'
import { gatewayUri, getAppUri, uploadUri } from './uri'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

let uri = gatewayUri()

if (!isLoggedIn()) {
	if (typeof window !== 'undefined') {
		if (!window.location.pathname.match('/account')) {
			window.location = getAppUri() + '/account/authenticate/'
		}
	}
}

let lastNetworkError = null
let lastGraphQLErrors = []

const httpLink = new HttpLink({ uri, headers: { token: getToken() } })
const graphqlWsClient = createClient({
	url: 'ws://localhost:8350/graphql',
	keepAlive: 5_000,
	lazy:false,
	shouldRetry: () => true,
	connectionParams: {
		token: getToken()
	}
})

const wsLink = new GraphQLWsLink(graphqlWsClient);

const apiClient = new ApolloClient({
	link: split(
		({ query }) => {
		  const definition = getMainDefinition(query);
		  return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		  );
		},

		// subscriptions
		wsLink,

		// queries and mutations
		onError((response) => {
			if (response.networkError) {
				console.error(`[Network error]: ${response.networkError}`)
				lastNetworkError = response.networkError
			}
	
			if (response.graphQLErrors) {
				response.graphQLErrors.forEach(({ message, locations, path }) =>
					console.error(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					)
				)
				lastGraphQLErrors = response.graphQLErrors
			}
		}).concat(
			httpLink
		),
	  )
	,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
			errorPolicy: 'ignore',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		mutate: {
			fetchPolicy: 'no-cache',
			errorPolicy: 'all',
		},
	},
})

const uploadClient = new ApolloClient({
	uri: uploadUri(),
	link: onError((response) => {
		if (response.networkError) {
			console.error(`[Network error]: ${response.networkError}`)
			lastNetworkError = response.networkError
		}

		if (response.graphQLErrors) {
			response.graphQLErrors.forEach(({ message, locations, path }) =>
				console.error(
					`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
				)
			)
			lastGraphQLErrors = response.graphQLErrors
		}
	}).concat(
		createUploadLink({
			uri: uploadUri(),
			headers: {
				token: getToken(),
			},
		})
	),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
			errorPolicy: 'ignore',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		mutate: {
			fetchPolicy: 'no-cache',
			errorPolicy: 'all',
		},
	},
})

function omitTypeName(obj) {
	return JSON.parse(JSON.stringify(obj), (key, v) =>
		key === '__typename' ? undefined : v
	)
}
export function useQuery(operation, options = {}) {
	return useQueryNative(operation, { ...options, errorPolicy: 'all' })
}

export {
	lastNetworkError,
	lastGraphQLErrors,
	omitTypeName,
	uploadClient,
	graphqlWsClient,
	apiClient,
	useMutation,
	useSubscription,
	gql,
}
