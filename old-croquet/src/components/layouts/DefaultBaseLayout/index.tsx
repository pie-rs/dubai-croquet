import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { tinaField } from 'tinacms/dist/react';

import Header from '../../sections/Header';
import Footer from '../../sections/Footer';

export default function DefaultBaseLayout(props) {
    const { page, site } = props;
    const siteMeta = site?.__metadata || {};
    const pageMeta = page?.__metadata || {};
    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} data-sb-object-id={pageMeta.id}>
            <div className="sb-base sb-default-base-layout">
                <Head>
                    <title>{page.title}</title>
                    <meta name="description" content="Dubai Croquet Club" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {site.favicon && <link rel="icon" href={site.favicon} />}
                </Head>
                {site.header && (
                    <div data-tina-field={tinaField(site, 'header')}>
                        <Header {...site.header} annotationPrefix={siteMeta.id} />
                    </div>
                )}
                {props.children}
                {site.footer && (
                    <div data-tina-field={tinaField(site, 'footer')}>
                        <Footer {...site.footer} annotationPrefix={siteMeta.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
