import {AppleNews} from '@wanews/apple-news-format'

import {defaultTheme, Theme} from './theme/default'

export type AppleNewsArticleFields = {
  title: string
  subtitle?: string
  thumbnail?: string
  body:
    | string
    | {
        role: 'body'
        text: string
        format: 'html' | 'markdown'
      }[]
  author: {name: string}
  byline?: {name: string}[]
  theme?: Partial<Theme>
  metadata?: Omit<AppleNews.Metadata, 'authors' | 'thumbnailURL'>
}

/**
 * Create a fully formed Apple News article document
 * in JSON format.
 */
export const makeAppleNewsArticle = ({
  author,
  byline,
  title,
  subtitle,
  thumbnail,
  body,
  theme,
  metadata,
}: AppleNewsArticleFields): AppleNews.ArticleDocument => ({
  version: '1.0',
  identifier: 'SMS_preview_article',
  language: 'en',
  title,
  layout: {
    ...defaultTheme.layout,
    ...theme?.layout,
  },
  subtitle,
  metadata: {
    ...metadata,
    authors: [author.name, ...(byline || []).map(({name}) => name)],
    thumbnailURL: thumbnail,
  },
  documentStyle: {
    backgroundColor: '#f6f6f6',
    ...theme?.documentStyle,
  },
  components: [
    {
      role: 'title',
      layout: 'titleLayout',
      text: title,
      textStyle: 'titleStyle',
    },
    {
      role: 'header',
      layout: 'headerImageLayout',
      style: {
        fill: {
          type: 'image',
          URL: thumbnail,
          fillMode: 'cover',
          verticalAlignment: 'center',
        },
      },
    },
    {
      role: 'author',
      layout: 'authorLayout',
      text: author.name,
      textStyle: 'authorStyle',
    },
    ...(byline
      ? byline.map((bylineAuthor) => ({
          role: 'byline' as const,
          layout: 'authorLayout',
          text: bylineAuthor.name,
          textStyle: 'authorStyle',
        }))
      : []),
    ...(Array.isArray(body)
      ? body
      : [
          {
            role: 'body' as const,
            text: body,
            layout: 'bodyLayout',
            textStyle: 'bodyStyle',
          },
        ]),
  ],
  textStyles: {
    'default-tag-a': {
      textColor: '#ec5c52',
    },
    ...theme?.textStyles,
  },
  componentTextStyles: {
    ...defaultTheme.componentTextStyles,
    ...theme?.componentTextStyles,
  },
  componentLayouts: {
    ...defaultTheme.componentLayouts,
    ...theme?.componentLayouts,
  },
})
