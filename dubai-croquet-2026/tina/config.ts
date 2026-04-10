import { defineConfig, type Collection, type Template, type TinaField } from 'tinacms'

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main'

const colorField: TinaField = {
  type: 'string',
  name: 'colors',
  label: 'Color Scheme',
  options: [
    { label: 'Light', value: 'colors-a' },
    { label: 'Accent', value: 'colors-f' },
    { label: 'Complementary', value: 'colors-h' },
  ],
}

const widthField: TinaField = {
  type: 'string',
  name: 'width',
  label: 'Content Width',
  options: [
    { label: 'Wide', value: 'wide' },
    { label: 'Narrow', value: 'narrow' },
  ],
}

const imageFields: TinaField[] = [
  { type: 'image', name: 'src', label: 'Source' },
  { type: 'string', name: 'alt', label: 'Alt Text' },
  { type: 'string', name: 'caption', label: 'Caption', required: false },
]

const imageField = (name: string, label: string, required = false): TinaField => ({
  type: 'object',
  name,
  label,
  required,
  fields: [...imageFields],
})

const markdownStringField = (name: string, label: string, required = true): TinaField => ({
  type: 'string',
  name,
  label,
  required,
  ui: {
    component: 'textarea',
  },
})

const linkFields: TinaField[] = [
  { type: 'string', name: 'label', label: 'Label' },
  { type: 'string', name: 'url', label: 'URL' },
  {
    type: 'string',
    name: 'style',
    label: 'Style',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Link', value: 'link' },
    ],
    required: false,
  },
  { type: 'boolean', name: 'showIcon', label: 'Show Icon', required: false },
  { type: 'string', name: 'icon', label: 'Icon', required: false },
] 

const sectionTemplates: Template[] = [
  {
    name: 'heroSection',
    label: 'Hero Section',
    fields: [
      colorField,
      widthField,
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      { type: 'string', name: 'badgeLabel', label: 'Badge Label', required: false },
      markdownStringField('text', 'Text', false),
      {
        type: 'object',
        name: 'actions',
        label: 'Actions',
        list: true,
        fields: [...linkFields],
      },
      imageField('media', 'Media'),
    ],
  },
  {
    name: 'textSection',
    label: 'Text Section',
    fields: [
      colorField,
      widthField,
      { type: 'string', name: 'title', label: 'Title', required: false },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      markdownStringField('body', 'Body'),
    ],
  },
  {
    name: 'ctaSection',
    label: 'CTA Section',
    fields: [
      colorField,
      widthField,
      { type: 'string', name: 'title', label: 'Title' },
      markdownStringField('text', 'Text', false),
      {
        type: 'object',
        name: 'actions',
        label: 'Actions',
        list: true,
        fields: [...linkFields],
      },
    ],
  },
  {
    name: 'featuredItemsSection',
    label: 'Featured Items Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      {
        type: 'number',
        name: 'columns',
        label: 'Columns',
        required: false,
      },
      {
        type: 'object',
        name: 'items',
        label: 'Items',
        list: true,
        fields: [
          { type: 'string', name: 'title', label: 'Title' },
          { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
          markdownStringField('text', 'Text', false),
          imageField('featuredImage', 'Featured Image'),
          {
            type: 'object',
            name: 'actions',
            label: 'Actions',
            list: true,
            fields: [...linkFields],
          },
        ],
      },
      {
        type: 'object',
        name: 'actions',
        label: 'Section Actions',
        list: true,
        fields: [...linkFields],
      },
    ],
  },
  {
    name: 'testimonialsSection',
    label: 'Testimonials Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title', required: false },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      { type: 'string', name: 'variant', label: 'Variant', required: false },
      {
        type: 'object',
        name: 'testimonials',
        label: 'Testimonials',
        list: true,
        fields: [
          markdownStringField('quote', 'Quote'),
          { type: 'string', name: 'name', label: 'Name' },
          { type: 'string', name: 'title', label: 'Title', required: false },
          imageField('image', 'Image'),
        ],
      },
    ],
  },
  {
    name: 'contactSection',
    label: 'Contact Section',
    fields: [
      colorField,
      widthField,
      { type: 'string', name: 'title', label: 'Title' },
      markdownStringField('text', 'Text', false),
      imageField('media', 'Media'),
      {
        type: 'string',
        name: 'formKey',
        label: 'Form Key',
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Newsletter', value: 'newsletter' },
          { label: 'Registration', value: 'registration' },
        ],
      },
      {
        type: 'string',
        name: 'variant',
        label: 'Variant',
        required: false,
      },
    ],
  },
  {
    name: 'faqSection',
    label: 'FAQ Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title' },
      {
        type: 'object',
        name: 'items',
        label: 'Items',
        list: true,
        fields: [
          { type: 'string', name: 'question', label: 'Question' },
          markdownStringField('answer', 'Answer'),
        ],
      },
    ],
  },
  {
    name: 'quoteSection',
    label: 'Quote Section',
    fields: [
      colorField,
      widthField,
      markdownStringField('quote', 'Quote'),
      { type: 'string', name: 'name', label: 'Name', required: false },
      { type: 'string', name: 'title', label: 'Title', required: false },
    ],
  },
  {
    name: 'mediaGallerySection',
    label: 'Media Gallery Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title', required: false },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      {
        type: 'object',
        name: 'images',
        label: 'Images',
        list: true,
        fields: [...imageFields],
      },
    ],
  },
  {
    name: 'featuredPeopleSection',
    label: 'Featured People Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title', required: false },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      { type: 'string', name: 'variant', label: 'Variant', required: false },
      {
        type: 'object',
        name: 'actions',
        label: 'Actions',
        list: true,
        fields: [...linkFields],
      },
      {
        type: 'object',
        name: 'people',
        label: 'People',
        list: true,
        fields: [{ type: 'reference', name: 'person', label: 'Person', collections: ['team'] }],
      },
    ],
  },
  {
    name: 'featureHighlightSection',
    label: 'Feature Highlight Section',
    fields: [
      colorField,
      widthField,
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      { type: 'string', name: 'badgeLabel', label: 'Badge Label', required: false },
      markdownStringField('text', 'Text', false),
      imageField('media', 'Media'),
      {
        type: 'object',
        name: 'actions',
        label: 'Actions',
        list: true,
        fields: [...linkFields],
      },
    ],
  },
  {
    name: 'recentPostsSection',
    label: 'Recent Posts Section',
    fields: [
      colorField,
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'subtitle', label: 'Subtitle', required: false },
      { type: 'string', name: 'variant', label: 'Variant', required: false },
      { type: 'number', name: 'recentCount', label: 'Post Count' },
      { type: 'boolean', name: 'showDate', label: 'Show Date', required: false },
      { type: 'boolean', name: 'showAuthor', label: 'Show Author', required: false },
      { type: 'boolean', name: 'showExcerpt', label: 'Show Excerpt', required: false },
      {
        type: 'object',
        name: 'actions',
        label: 'Actions',
        list: true,
        fields: [...linkFields],
      },
    ],
  },
] 

const collections: Collection[] = [
  {
    label: 'Site Config',
    name: 'siteConfig',
    path: 'content/site',
    format: 'json',
    match: {
      include: 'config',
    },
    ui: {
      allowedActions: {
        create: false,
        delete: false,
      },
    },
    fields: [
      { type: 'string', name: 'title', label: 'Site Title' },
      { type: 'image', name: 'favicon', label: 'Favicon', required: false },
      {
        type: 'object',
        name: 'header',
        label: 'Header',
        fields: [
          imageField('logo', 'Logo'),
          { type: 'boolean', name: 'isTitleVisible', label: 'Show Title', required: false },
          {
            type: 'object',
            name: 'primaryLinks',
            label: 'Primary Links',
            list: true,
            fields: [...linkFields],
          },
        ],
      },
      {
        type: 'object',
        name: 'footer',
        label: 'Footer',
        fields: [
          imageField('logo', 'Logo'),
          {
            type: 'object',
            name: 'contacts',
            label: 'Contacts',
            fields: [
              { type: 'string', name: 'phoneNumber', label: 'Phone Number', required: false },
              { type: 'string', name: 'email', label: 'Email', required: false },
              { type: 'string', name: 'address', label: 'Address', required: false },
            ],
          },
          {
            type: 'object',
            name: 'primaryLinks',
            label: 'Primary Links',
            list: true,
            fields: [...linkFields],
          },
          {
            type: 'object',
            name: 'legalLinks',
            label: 'Legal Links',
            list: true,
            fields: [...linkFields],
          },
          {
            type: 'object',
            name: 'socialLinks',
            label: 'Social Links',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
              { type: 'string', name: 'icon', label: 'Icon', required: false },
            ],
          },
          markdownStringField('copyrightText', 'Copyright Text', false),
        ],
      },
    ],
  },
  {
    label: 'Pages',
    name: 'pages',
    path: 'content/pages',
    format: 'json',
    fields: [
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'slug', label: 'Slug' },
      { type: 'string', name: 'seoTitle', label: 'SEO Title', required: false },
      { type: 'string', name: 'seoDescription', label: 'SEO Description', required: false },
      {
        type: 'object',
        name: 'sections',
        label: 'Sections',
        list: true,
        templates: [...sectionTemplates],
      },
    ],
  },
  {
    label: 'Posts',
    name: 'posts',
    path: 'content/posts',
    format: 'mdx',
    fields: [
      { type: 'string', name: 'title', label: 'Title' },
      { type: 'string', name: 'slug', label: 'Slug' },
      { type: 'datetime', name: 'date', label: 'Date' },
      { type: 'string', name: 'excerpt', label: 'Excerpt', required: false },
      imageField('featuredImage', 'Featured Image'),
      {
        type: 'reference',
        name: 'author',
        label: 'Author',
        collections: ['team'],
        required: false,
      },
      {
        type: 'object',
        name: 'bottomSections',
        label: 'Bottom Sections',
        list: true,
        templates: sectionTemplates.filter((template) => template.name === 'recentPostsSection'),
      },
      {
        type: 'rich-text',
        name: 'body',
        label: 'Body',
        isBody: true,
      },
    ],
  },
  {
    label: 'Team',
    name: 'team',
    path: 'content/team',
    format: 'json',
    fields: [
      { type: 'string', name: 'firstName', label: 'First Name' },
      { type: 'string', name: 'lastName', label: 'Last Name', required: false },
      { type: 'string', name: 'role', label: 'Role', required: false },
      markdownStringField('bio', 'Bio', false),
      imageField('image', 'Image'),
    ],
  },
]

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections,
  },
})
