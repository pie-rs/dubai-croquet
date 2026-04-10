function convertTinaBody(existingDocument, tinaDocument) {
  if (!('body' in tinaDocument)) {
    return {};
  }

  if (typeof tinaDocument.body === 'string') {
    return { markdown_content: tinaDocument.body };
  }

  return { markdown_content: existingDocument?.markdown_content || null };
}

export function mergeTinaDocument(existingDocument, tinaDocument) {
  if (!existingDocument || !tinaDocument) {
    return existingDocument;
  }

  const { _sys, _values, _content_source, _tina_metadata, __typename, id, body, ...fields } = tinaDocument;

  return {
    ...existingDocument,
    ...fields,
    _content_source,
    _tina_metadata,
    ...convertTinaBody(existingDocument, tinaDocument)
  };
}

export function applyTinaDocumentsToSourceData(sourceData, { pageDocument, siteDocument }) {
  const pages = sourceData.pages.map((page) =>
    pageDocument && page.__metadata?.id === pageDocument.__metadata?.id ? pageDocument : page
  );

  const objects = sourceData.objects.map((object) => {
    if (pageDocument && object.__metadata?.id === pageDocument.__metadata?.id) {
      return pageDocument;
    }
    if (siteDocument && object.__metadata?.id === siteDocument.__metadata?.id) {
      return siteDocument;
    }
    return object;
  });

  return {
    ...sourceData,
    pages,
    objects,
    props: {
      ...sourceData.props,
      site: siteDocument || sourceData.props.site
    }
  };
}
