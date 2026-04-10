// @ts-nocheck
import { defineConfig } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'master';

const colors = ['colors-a', 'colors-b', 'colors-c', 'colors-d', 'colors-e', 'colors-f', 'colors-g', 'colors-h'];
const widths = ['full', 'wide', 'narrow', 'auto', '1/2'];
const backgroundSizes = ['full', 'inset'];
const alignments = ['left', 'center', 'right'];
const flexDirections = ['row', 'col'];
const widthsForFields = ['full', '1/2'];

const textarea = (name, label) => ({
  type: 'string',
  name,
  label,
  ui: {
    component: 'textarea'
  }
});

const stringOptions = (name, label, options) => ({
  type: 'string',
  name,
  label,
  options
});

const hiddenString = (name, value) => ({
  type: 'string',
  name,
  ui: {
    component: 'hidden'
  },
  required: true,
  default: value
});

const styleGroupField = (name, label) => ({
  type: 'object',
  name,
  label,
  fields: [
    stringOptions('textAlign', 'Text align', alignments),
    stringOptions('justifyContent', 'Justify content', ['flex-start', 'center', 'flex-end', 'space-between']),
    stringOptions('alignItems', 'Align items', ['flex-start', 'center', 'flex-end', 'stretch']),
    stringOptions('flexDirection', 'Flex direction', flexDirections),
    stringOptions('width', 'Width', widths),
    stringOptions('height', 'Height', ['auto', 'full']),
    { type: 'string', name: 'borderColor', label: 'Border color' },
    { type: 'string', name: 'borderRadius', label: 'Border radius' },
    { type: 'string', name: 'borderStyle', label: 'Border style' },
    { type: 'number', name: 'borderWidth', label: 'Border width' },
    { type: 'number', name: 'opacity', label: 'Opacity' },
    { type: 'string', name: 'fontWeight', label: 'Font weight' },
    { type: 'string', name: 'fontStyle', label: 'Font style' },
    { type: 'string', name: 'padding', label: 'Padding classes', list: true },
    { type: 'string', name: 'margin', label: 'Margin classes', list: true }
  ]
});

const stylesField = {
  type: 'object',
  name: 'styles',
  label: 'Styles',
  fields: [
    styleGroupField('self', 'Self'),
    styleGroupField('title', 'Title'),
    styleGroupField('subtitle', 'Subtitle'),
    styleGroupField('text', 'Text'),
    styleGroupField('actions', 'Actions'),
    styleGroupField('submitLabel', 'Submit label'),
    styleGroupField('label', 'Label')
  ]
};

const imageBlockFields = [
  hiddenString('type', 'ImageBlock'),
  { type: 'image', name: 'url', label: 'Image' },
  { type: 'string', name: 'altText', label: 'Alt text' },
  { type: 'string', name: 'caption', label: 'Caption' },
  { type: 'string', name: 'elementId', label: 'Element ID' },
  stylesField
];

const imageBlockField = (name, label) => ({
  type: 'object',
  name,
  label,
  fields: imageBlockFields
});

const actionTemplates = [
  {
    name: 'button',
    label: 'Button',
    fields: [
      hiddenString('type', 'Button'),
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'string', name: 'url', label: 'URL' },
      { type: 'string', name: 'altText', label: 'Alt text' },
      { type: 'boolean', name: 'showIcon', label: 'Show icon' },
      { type: 'string', name: 'icon', label: 'Icon' },
      stringOptions('iconPosition', 'Icon position', ['left', 'right']),
      { type: 'string', name: 'style', label: 'Style' },
      { type: 'string', name: 'elementId', label: 'Element ID' }
    ]
  },
  {
    name: 'link',
    label: 'Link',
    fields: [
      hiddenString('type', 'Link'),
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'string', name: 'url', label: 'URL' },
      { type: 'string', name: 'altText', label: 'Alt text' },
      { type: 'boolean', name: 'showIcon', label: 'Show icon' },
      { type: 'string', name: 'icon', label: 'Icon' },
      stringOptions('iconPosition', 'Icon position', ['left', 'right']),
      { type: 'string', name: 'elementId', label: 'Element ID' }
    ]
  }
];

const actionsField = {
  type: 'object',
  name: 'actions',
  label: 'Actions',
  list: true,
  templates: actionTemplates
};

const badgeField = {
  type: 'object',
  name: 'badge',
  label: 'Badge',
  fields: [
    { type: 'string', name: 'label', label: 'Label' },
    { type: 'string', name: 'elementId', label: 'Element ID' },
    stylesField
  ]
};

const featuredItemTemplate = {
  name: 'featuredItem',
  label: 'Featured item',
  fields: [
    hiddenString('type', 'FeaturedItem'),
    { type: 'string', name: 'title', label: 'Title' },
    { type: 'string', name: 'subtitle', label: 'Subtitle' },
    textarea('text', 'Text'),
    imageBlockField('featuredImage', 'Featured image'),
    actionsField,
    stylesField
  ]
};

const faqItemField = {
  type: 'object',
  name: 'items',
  label: 'Items',
  list: true,
  fields: [
    { type: 'string', name: 'question', label: 'Question' },
    textarea('answer', 'Answer')
  ]
};

const testimonialField = {
  type: 'object',
  name: 'testimonials',
  label: 'Testimonials',
  list: true,
  fields: [
    textarea('quote', 'Quote'),
    { type: 'string', name: 'name', label: 'Name' },
    { type: 'string', name: 'title', label: 'Title' },
    imageBlockField('image', 'Image'),
    { type: 'string', name: 'elementId', label: 'Element ID' },
    stylesField
  ]
};

const formControlTemplates = [
  {
    name: 'textFormControl',
    label: 'Text field',
    fields: [
      hiddenString('type', 'TextFormControl'),
      { type: 'string', name: 'name', label: 'Name' },
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'boolean', name: 'hideLabel', label: 'Hide label' },
      { type: 'string', name: 'placeholder', label: 'Placeholder' },
      { type: 'boolean', name: 'isRequired', label: 'Required' },
      stringOptions('width', 'Width', widthsForFields)
    ]
  },
  {
    name: 'emailFormControl',
    label: 'Email field',
    fields: [
      hiddenString('type', 'EmailFormControl'),
      { type: 'string', name: 'name', label: 'Name' },
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'boolean', name: 'hideLabel', label: 'Hide label' },
      { type: 'string', name: 'placeholder', label: 'Placeholder' },
      { type: 'boolean', name: 'isRequired', label: 'Required' },
      stringOptions('width', 'Width', widthsForFields)
    ]
  },
  {
    name: 'textareaFormControl',
    label: 'Textarea field',
    fields: [
      hiddenString('type', 'TextareaFormControl'),
      { type: 'string', name: 'name', label: 'Name' },
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'boolean', name: 'hideLabel', label: 'Hide label' },
      { type: 'string', name: 'placeholder', label: 'Placeholder' },
      { type: 'boolean', name: 'isRequired', label: 'Required' },
      stringOptions('width', 'Width', widthsForFields)
    ]
  },
  {
    name: 'checkboxFormControl',
    label: 'Checkbox field',
    fields: [
      hiddenString('type', 'CheckboxFormControl'),
      { type: 'string', name: 'name', label: 'Name' },
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'boolean', name: 'isRequired', label: 'Required' },
      stringOptions('width', 'Width', widthsForFields)
    ]
  },
  {
    name: 'selectFormControl',
    label: 'Select field',
    fields: [
      hiddenString('type', 'SelectFormControl'),
      { type: 'string', name: 'name', label: 'Name' },
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'boolean', name: 'hideLabel', label: 'Hide label' },
      { type: 'string', name: 'defaultValue', label: 'Default value' },
      { type: 'boolean', name: 'isRequired', label: 'Required' },
      stringOptions('width', 'Width', widthsForFields),
      { type: 'string', name: 'options', label: 'Options', list: true }
    ]
  }
];

const formBlockField = {
  type: 'object',
  name: 'form',
  label: 'Form',
  fields: [
    hiddenString('type', 'FormBlock'),
    { type: 'string', name: 'variant', label: 'Variant' },
    { type: 'string', name: 'elementId', label: 'Element ID' },
    { type: 'string', name: 'action', label: 'Action URL' },
    { type: 'string', name: 'destination', label: 'Destination email' },
    { type: 'object', name: 'fields', label: 'Fields', list: true, templates: formControlTemplates },
    { type: 'string', name: 'submitLabel', label: 'Submit label' }
  ]
};

const baseSectionFields = [
  { type: 'string', name: 'elementId', label: 'Element ID' },
  stringOptions('colors', 'Colors', colors),
  { type: 'string', name: 'title', label: 'Title' },
  { type: 'string', name: 'subtitle', label: 'Subtitle' },
  textarea('text', 'Text'),
  stylesField
];

const sectionTemplates = [
  { name: 'heroSection', label: 'Hero section', fields: [hiddenString('type', 'HeroSection'), ...baseSectionFields, badgeField, actionsField, imageBlockField('media', 'Media')] },
  { name: 'featureHighlightSection', label: 'Feature highlight section', fields: [hiddenString('type', 'FeatureHighlightSection'), ...baseSectionFields, stringOptions('backgroundSize', 'Background size', backgroundSizes), badgeField, actionsField, imageBlockField('media', 'Media')] },
  { name: 'textSection', label: 'Text section', fields: [hiddenString('type', 'TextSection'), ...baseSectionFields] },
  { name: 'ctaSection', label: 'CTA section', fields: [hiddenString('type', 'CtaSection'), ...baseSectionFields, stringOptions('backgroundSize', 'Background size', backgroundSizes), actionsField, imageBlockField('backgroundImage', 'Background image')] },
  { name: 'featuredItemsSection', label: 'Featured items section', fields: [hiddenString('type', 'FeaturedItemsSection'), ...baseSectionFields, { type: 'number', name: 'columns', label: 'Columns' }, { type: 'boolean', name: 'enableHover', label: 'Enable hover' }, { type: 'object', name: 'items', label: 'Items', list: true, templates: [featuredItemTemplate] }, actionsField] },
  { name: 'featuredPeopleSection', label: 'Featured people section', fields: [hiddenString('type', 'FeaturedPeopleSection'), ...baseSectionFields, { type: 'string', name: 'variant', label: 'Variant' }, { type: 'string', name: 'people', label: 'People', list: true, description: 'Enter team member document paths, for example content/data/team/desmond-eagle.json' }, actionsField] },
  { name: 'recentPostsSection', label: 'Recent posts section', fields: [hiddenString('type', 'RecentPostsSection'), ...baseSectionFields, { type: 'string', name: 'variant', label: 'Variant' }, { type: 'number', name: 'recentCount', label: 'Recent count' }, { type: 'boolean', name: 'showAuthor', label: 'Show author' }, { type: 'boolean', name: 'showDate', label: 'Show date' }, { type: 'boolean', name: 'showExcerpt', label: 'Show excerpt' }, actionsField] },
  { name: 'contactSection', label: 'Contact section', fields: [hiddenString('type', 'ContactSection'), ...baseSectionFields, stringOptions('backgroundSize', 'Background size', backgroundSizes), formBlockField, imageBlockField('media', 'Media')] },
  { name: 'faqSection', label: 'FAQ section', fields: [hiddenString('type', 'FaqSection'), ...baseSectionFields.filter((field) => field.name !== 'subtitle' && field.name !== 'text'), faqItemField] },
  { name: 'mediaGallerySection', label: 'Media gallery section', fields: [hiddenString('type', 'MediaGallerySection'), ...baseSectionFields, { type: 'object', name: 'images', label: 'Images', list: true, fields: imageBlockFields }, { type: 'number', name: 'spacing', label: 'Spacing' }, { type: 'number', name: 'columns', label: 'Columns' }, { type: 'string', name: 'aspectRatio', label: 'Aspect ratio' }, { type: 'number', name: 'imageSizePx', label: 'Image size' }, { type: 'boolean', name: 'showCaption', label: 'Show caption' }, { type: 'boolean', name: 'enableHover', label: 'Enable hover' }] },
  { name: 'quoteSection', label: 'Quote section', fields: [hiddenString('type', 'QuoteSection'), ...baseSectionFields.filter((field) => field.name !== 'subtitle' && field.name !== 'text'), textarea('quote', 'Quote'), { type: 'string', name: 'name', label: 'Name' }, imageBlockField('backgroundImage', 'Background image')] },
  { name: 'testimonialsSection', label: 'Testimonials section', fields: [hiddenString('type', 'TestimonialsSection'), ...baseSectionFields.filter((field) => field.name !== 'text'), { type: 'string', name: 'variant', label: 'Variant' }, testimonialField] }
];

const headerFields = [
  { type: 'string', name: 'headerVariant', label: 'Header variant' },
  stringOptions('primaryColors', 'Primary colors', colors),
  stringOptions('secondaryColors', 'Secondary colors', colors),
  { type: 'string', name: 'title', label: 'Title' },
  { type: 'boolean', name: 'isTitleVisible', label: 'Show title' },
  { type: 'object', name: 'primaryLinks', label: 'Primary links', list: true, templates: [actionTemplates[1]] },
  { type: 'object', name: 'secondaryLinks', label: 'Secondary links', list: true, templates: [actionTemplates[1]] },
  stylesField,
  imageBlockField('logo', 'Logo')
];

const footerFields = [
  stringOptions('colors', 'Colors', colors),
  imageBlockField('logo', 'Logo'),
  { type: 'string', name: 'title', label: 'Title' },
  {
    type: 'object',
    name: 'contacts',
    label: 'Contacts',
    fields: [
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'phoneNumber', label: 'Phone number' },
      { type: 'string', name: 'phoneAltText', label: 'Phone alt text' },
      { type: 'string', name: 'email', label: 'Email' },
      { type: 'string', name: 'emailAltText', label: 'Email alt text' },
      { type: 'string', name: 'addressAltText', label: 'Address alt text' }
    ]
  },
  textarea('copyrightText', 'Copyright text'),
  { type: 'object', name: 'primaryLinks', label: 'Primary links', list: true, templates: [actionTemplates[1]] },
  {
    type: 'object',
    name: 'socialLinks',
    label: 'Social links',
    list: true,
    fields: [
      hiddenString('type', 'Social'),
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'string', name: 'altText', label: 'Alt text' },
      { type: 'string', name: 'url', label: 'URL' },
      { type: 'string', name: 'icon', label: 'Icon' },
      { type: 'string', name: 'style', label: 'Style' },
      { type: 'string', name: 'elementId', label: 'Element ID' }
    ]
  },
  { type: 'object', name: 'legalLinks', label: 'Legal links', list: true, templates: [actionTemplates[1]] },
  stylesField
];

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || 'local-client-id',
  token: process.env.TINA_TOKEN || 'local-token',
  build: {
    publicFolder: 'public',
    outputFolder: 'admin'
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public'
    }
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || 'local-search-token'
    }
  },
  ui: {
    previewUrl: () => ({
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    })
  },
  schema: {
    collections: [
      {
        label: 'Pages',
        name: 'page',
        path: 'content/pages',
        format: 'md',
        match: { exclude: 'blog/**' },
        ui: {
          router: ({ document }) => (document._sys.filename === 'index' ? '/' : `/${document._sys.filename}`)
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title' },
          hiddenString('layout', 'PageLayout'),
          { type: 'object', name: 'sections', label: 'Sections', list: true, templates: sectionTemplates }
        ]
      },
      {
        label: 'Posts',
        name: 'post',
        path: 'content/pages/blog',
        format: 'md',
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title' },
          hiddenString('layout', 'PostLayout'),
          { type: 'datetime', name: 'date', label: 'Date' },
          { type: 'string', name: 'author', label: 'Author', description: 'Use a team member document path, for example content/data/team/desmond-eagle.json' },
          { type: 'string', name: 'excerpt', label: 'Excerpt' },
          imageBlockField('featuredImage', 'Featured image'),
          { type: 'object', name: 'bottomSections', label: 'Bottom sections', list: true, templates: sectionTemplates.filter((template) => template.name === 'recentPostsSection') },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true }
        ]
      },
      {
        label: 'Site config',
        name: 'siteConfig',
        path: 'content/data',
        format: 'json',
        match: { include: 'config' },
        ui: {
          allowedActions: { create: false, delete: false }
        },
        fields: [
          hiddenString('type', 'Config'),
          { type: 'image', name: 'favicon', label: 'Favicon' },
          { type: 'object', name: 'header', label: 'Header', fields: headerFields },
          { type: 'object', name: 'footer', label: 'Footer', fields: footerFields }
        ]
      },
      {
        label: 'Team',
        name: 'teamMember',
        path: 'content/data/team',
        format: 'json',
        fields: [
          hiddenString('type', 'Person'),
          { type: 'string', name: 'firstName', label: 'First name' },
          { type: 'string', name: 'lastName', label: 'Last name' },
          { type: 'string', name: 'role', label: 'Role' },
          textarea('bio', 'Bio'),
          imageBlockField('image', 'Image')
        ]
      }
    ]
  }
});
