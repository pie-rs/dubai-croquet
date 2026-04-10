import React from 'react';
import { useTina } from 'tinacms/dist/react';

import { getComponent } from '../components/components-registry';
import { getSourceData } from '../lib/content-loader';
import { applyTinaDocumentsToSourceData, mergeTinaDocument } from '../lib/tina-preview';
import { resolvePreviewProps, resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';

function Page(props) {
    const tinaPageResult = props.tinaPage ? useTina(props.tinaPage) : null;
    const tinaSiteResult = props.tinaSite ? useTina(props.tinaSite) : null;

    const resolvedProps = React.useMemo(() => {
        if (!tinaPageResult?.data?.page && !tinaSiteResult?.data?.siteConfig) {
            return props;
        }

        const sourcePage = props.sourceData.pages.find((page) => page.__metadata?.id === props.page.__metadata?.id);
        const pageDocument = tinaPageResult?.data?.page ? mergeTinaDocument(sourcePage, tinaPageResult.data.page) : sourcePage;
        const siteDocument = tinaSiteResult?.data?.siteConfig
            ? mergeTinaDocument(props.sourceData.props.site, tinaSiteResult.data.siteConfig)
            : props.site;
        const sourceData = applyTinaDocumentsToSourceData(props.sourceData, {
            pageDocument,
            siteDocument
        });

        return resolvePreviewProps(props.urlPath, sourceData) || props;
    }, [props, tinaPageResult, tinaSiteResult]);

    const { page, site } = resolvedProps;
    const { layout } = page;

    if (!layout) {
        throw new Error(`page has no layout, page '${props.path}'`);
    }
    const PageLayout = getComponent(layout);
    if (!PageLayout) {
        throw new Error(`no page layout matching the layout: ${layout}`);
    }
    return <PageLayout page={page} site={site} />;
}

export async function getStaticPaths() {
    const data = await getSourceData();
    const paths = resolveStaticPaths(data);
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const data = await getSourceData();
    const urlPath = '/' + (params.slug || []).join('/');
    const props = await resolveStaticProps(urlPath, data);
    if (!props) {
        return { notFound: true };
    }

    const rootPage = data.pages.find((page) => page.__metadata.urlPath === props.page.__metadata.urlPath.replace(/\/page\/\d+$/, ''));
    const rootPagePath = rootPage?.__metadata?.relSourcePath;
    const { client } = await import('../../tina/__generated__/client');
    const siteResponse = await client.queries.siteConfig({ relativePath: 'config.json' });

    let tinaPage = null;
    if (rootPagePath && !rootPagePath.startsWith('blog/')) {
        const pageResponse = await client.queries.page({ relativePath: rootPagePath });
        tinaPage = {
            query: pageResponse.query,
            variables: pageResponse.variables,
            data: pageResponse.data
        };
    }

    const tinaSite = {
        query: siteResponse.query,
        variables: siteResponse.variables,
        data: siteResponse.data
    };

    return {
        props: {
            ...props,
            sourceData: data,
            tinaPage,
            tinaSite,
            urlPath
        }
    };
}

export default Page;
