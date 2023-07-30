import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '../Auth';

const httpLink = createHttpLink({
    uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const auth = useAuth();
    const token = auth.getToken();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
const cache = new InMemoryCache({});

export const useClient = () => {
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
    });
};
