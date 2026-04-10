import * as React from 'react';
import { tinaField } from 'tinacms/dist/react';

import { getBaseLayoutComponent } from '../../../utils/base-layout';
import { getComponent } from '../../components-registry';

export default function PageLayout(props) {
    const { page, site } = props;
    const BaseLayout = getBaseLayoutComponent(page.baseLayout, site.baseLayout);
    const sections = page.sections || [];

    return (
        <BaseLayout page={page} site={site}>
            <main id="main" className="sb-layout sb-page-layout">
                {page.title && (
                    <h1 className="sr-only" data-sb-field-path="title" data-tina-field={tinaField(page, 'title')}>
                        {page.title}
                    </h1>
                )}
                {sections.length > 0 && (
                    <div data-sb-field-path="sections">
                        {sections.map((section, index) => {
                            const Component = getComponent(section.type);
                            if (!Component) {
                                throw new Error(`no component matching the page section's type: ${section.type}`);
                            }
                            return (
                                <div key={index} data-tina-field={tinaField(page, 'sections', index)}>
                                    <Component {...section} data-sb-field-path={`sections.${index}`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </BaseLayout>
    );
}
