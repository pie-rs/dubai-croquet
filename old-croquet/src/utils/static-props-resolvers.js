import { SignJWT } from 'jose/jwt/sign';
import crypto from 'crypto';

import {
    getRootPagePath,
    resolveReferences,
    getAllPostsSorted,
    getAllCategoryPostsSorted,
    getAllAuthorPostsSorted,
    getPagedItemsForPage,
    mapDeepAsync
} from './data-utils';

export function resolveStaticProps(urlPath, data) {
    return resolveProps(urlPath, data, StaticPropsResolvers, mapDeepAsync);
}

export function resolvePreviewProps(urlPath, data) {
    return resolveProps(urlPath, data, PreviewPropsResolvers, mapDeepSync);
}

function resolveProps(urlPath, data, resolvers, mapDeep) {
    // get root path of paged path: /blog/page/2 => /blog
    const rootUrlPath = getRootPagePath(urlPath);
    const pageEntry = data.pages.find((page) => page.__metadata.urlPath === rootUrlPath);
    if (!pageEntry) {
        return null;
    }
    const { __metadata, ...rest } = pageEntry;
    const props = {
        page: {
            __metadata: {
                ...__metadata,
                // override urlPath in metadata with paged path: /blog => /blog/page/2
                urlPath
            },
            ...rest
        },
        ...data.props
    };
    return mapDeep(props, (value, keyPath, stack) => {
        const objectType = value?.type || value?.layout;
        if (objectType && resolvers[objectType]) {
            const resolver = resolvers[objectType];
            return resolver(value, data, { keyPath, stack });
        }
        return value;
    }, { postOrder: true });
}

const StaticPropsResolvers = {
    PostLayout: (props, data, debugContext) => {
        return resolveReferences(props, ['author', 'category'], data.objects, debugContext);
    },
    PostFeedLayout: (props, data) => {
        const numOfPostsPerPage = props.numOfPostsPerPage ?? 10;
        const allPosts = getAllPostsSorted(data.objects);
        const paginationData = getPagedItemsForPage(props, allPosts, numOfPostsPerPage);
        const items = resolveReferences(paginationData.items, ['author', 'category'], data.objects);
        return {
            ...props,
            ...paginationData,
            items
        };
    },
    PostFeedCategoryLayout: (props, data) => {
        const categoryId = props.__metadata?.id;
        const numOfPostsPerPage = props.numOfPostsPerPage ?? 10;
        const allCategoryPosts = getAllCategoryPostsSorted(data.objects, categoryId);
        const paginationData = getPagedItemsForPage(props, allCategoryPosts, numOfPostsPerPage);
        const items = resolveReferences(paginationData.items, ['author', 'category'], data.objects);
        return {
            ...props,
            ...paginationData,
            items
        };
    },
    Person: (props, data) => {
        const authorId = props.__metadata?.id;
        const allAuthorPosts = getAllAuthorPostsSorted(data.objects, authorId);
        const paginationData = getPagedItemsForPage(props, allAuthorPosts, 10);
        const items = resolveReferences(paginationData.items, ['author', 'category'], data.objects);
        return {
            ...props,
            ...paginationData,
            items,
            layout: 'PostFeedLayout',
            postFeed: {
                showAuthor: true,
                showDate: true,
                variant: 'variant-d',
            }
        };
    },
    RecentPostsSection: (props, data) => {
        const allPosts = getAllPostsSorted(data.objects).slice(0, props.recentCount || 6);
        const recentPosts = resolveReferences(allPosts, ['author', 'category'], data.objects);
        return {
            ...props,
            posts: recentPosts
        };
    },
    FeaturedPostsSection: (props, data, debugContext) => {
        return resolveReferences(props, ['posts.author', 'posts.category'], data.objects, debugContext);
    },
    FeaturedPeopleSection: (props, data, debugContext) => {
        return resolveReferences(props, ['people'], data.objects, debugContext);
    },
    FormBlock: async (props) => {
        if (!props.destination) {
            return props;
        }
        const contactFormSecret = process.env.CONTACT_FORM_SECRET || process.env.STACKBIT_CONTACT_FORM_SECRET;
        if (!contactFormSecret) {
            console.error(`No CONTACT_FORM_SECRET provided. It will not work properly for production build.`);
            return props;
        }
        const secretKey = crypto.createHash('sha256').update(contactFormSecret).digest();
        const destination = await new SignJWT({ email: props.destination }).setProtectedHeader({ alg: 'HS256' }).sign(secretKey);
        return {
            ...props,
            destination
        };
    }
};

const PreviewPropsResolvers = {
    ...StaticPropsResolvers,
    FormBlock: (props) => props
};

function mapDeepSync(value, iteratee, options = {}) {
    const postOrder = options?.postOrder ?? false;

    function _mapDeep(value, keyPath, stack) {
        if (!postOrder) {
            value = iteratee(value, keyPath, stack);
        }
        const childrenIterator = (val, key) => _mapDeep(val, keyPath.concat(key), stack.concat([value]));
        if (value && typeof value === 'object' && value.constructor === Object) {
            const res = {};
            for (const [key, val] of Object.entries(value)) {
                res[key] = childrenIterator(val, key);
            }
            value = res;
        } else if (Array.isArray(value)) {
            value = value.map(childrenIterator);
        }
        if (postOrder) {
            value = iteratee(value, keyPath, stack);
        }
        return value;
    }

    return _mapDeep(value, [], []);
}
