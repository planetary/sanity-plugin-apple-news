import {type AppleNews} from '@wanews/apple-news-format'

export type Theme = {
  documentStyle?: AppleNews.DocumentStyle
  componentLayouts?: AppleNews.ArticleDocument['componentLayouts']
  componentTextStyles?: AppleNews.ArticleDocument['componentTextStyles']
  textStyles: AppleNews.ArticleDocument['textStyles']
  layout: AppleNews.ArticleDocument['layout']
}

/**
 * Default styles used when generating Apple News Articles
 *
 * The article theme and typography can be customized by overriding ∏these values
 * @see https://developer.apple.com/documentation/apple_news/apple_news_format/enhancing_your_articles_with_styles
 * @see https://developer.apple.com/documentation/apple_news/apple_news_format/text_styles
 */
export const defaultTheme: Theme = {
  layout: {columns: 7, width: 1024, margin: 70, gutter: 40},
  documentStyle: {
    backgroundColor: '#f6f6f6',
  },
  textStyles: {
    'default-tag-a': {
      textColor: '#ec5c52',
    },
  },
  componentTextStyles: {
    default: {
      linkStyle: {
        textColor: '#ec5c52',
        underline: true,
      },
    },
    'default-title': {
      fontName: 'DINCondensed-Bold',
      fontSize: 36,
      textColor: '#2F2F2F',
      textAlignment: 'center',
      lineHeight: 44,
    },
    'default-subtitle': {
      fontName: 'Georgia-Bold',
      fontSize: 20,
      textColor: '#2F2F2F',
      textAlignment: 'center',
      lineHeight: 24,
    },
    titleStyle: {
      textAlignment: 'left',
      fontName: 'DINCondensed-Bold',
      fontSize: 64,
      lineHeight: 74,
      textColor: '#ec5c52',
    },
    introStyle: {
      textAlignment: 'left',
      fontName: 'Georgia-Bold',
      fontSize: 24,
      textColor: '#000',
    },
    authorStyle: {
      textAlignment: 'left',
      fontName: 'Georgia-Italic',
      fontSize: 16,
      textColor: '#000',
    },
    bodyStyle: {
      textAlignment: 'left',
      fontName: 'Georgia',
      fontSize: 18,
      lineHeight: 26,
      textColor: '#000',
    },
  } as const,
  componentLayouts: {
    headerImageLayout: {
      columnStart: 0,
      columnSpan: 7,
      ignoreDocumentMargin: true,
      minimumHeight: '40vh',
      margin: {
        top: 15,
        bottom: 15,
      },
    },
    titleLayout: {
      columnStart: 0,
      columnSpan: 7,
      margin: {
        top: 50,
        bottom: 10,
      },
    },
    introLayout: {
      columnStart: 0,
      columnSpan: 7,
      margin: {
        top: 15,
        bottom: 15,
      },
    },
    authorLayout: {
      columnStart: 1,
      columnSpan: 5,
      margin: {
        top: 15,
        bottom: 15,
      },
    },
    bodyLayout: {
      columnStart: 1,
      columnSpan: 5,
      margin: {
        top: 15,
        bottom: 15,
      },
    },
  },
}
