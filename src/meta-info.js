function applyAnalytics (state, meta, styles, scripts, noscript) {
  const { website, dev } = state
  const { analytics } = website.integrations

  if (dev || !process.browser) {
    // Custom scripts
    website.config.setup.scripts.forEach(src => {
      if (!src) return
      scripts.push({
        type: 'application/javascript',
        src
      })
    })

    scripts.push({
      innerHTML: website.config.setup.javascript,
      type: 'application/javascript'
    })

    // Custom CSS
    website.config.setup.styles.forEach(href => {
      if (!href) return
      styles.push({
        type: 'text/css',
        href
      })
    })

    // Google Tag Manager
    if (analytics.googleTagManager.trackingID) {
      scripts.push({
        type: 'application/javascript',
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${analytics.googleTagManager.trackingID}');`
      })
    }

    //redman
    scripts.push({
      type: 'application/javascript',
      innerHTML: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-15965340-14', 'auto', 'redmanTracker');
        ga('redmanTracker.send', 'pageview');`
    })


    // Google Analytics
    if (analytics.googleAnalytics.trackingID) {
      scripts.push({
        type: 'application/javascript',
        innerHTML: `
          ga('create', '${analytics.googleAnalytics.trackingID}', 'auto');
          ga('send', 'pageview');`
      })
    }

    // Google Site Verification
    if (analytics.googleSiteVerification.trackingID) {
      meta.push({
        name: 'google-site-verification',
        content: analytics.googleSiteVerification.trackingID
      })
    }

    // Facebook Pixel
    if (analytics.facebookPixel.trackingID) {
      scripts.push({
        type: 'application/javascript',
        innerHTML: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${analytics.facebookPixel.trackingID}');
fbq('track', 'PageView');`
      })
      noscript.push({
        innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${analytics.facebookPixel.trackingID}&ev=PageView&noscript=1" />`
      })
    }

    // Bing Webmaster Tools
    if (analytics.bingWebmasterTools.trackingID) {
      meta.push({
        name: 'msvalidate.01',
        content: analytics.bingWebmasterTools.trackingID
      })
    }

    // Google AdWords Remarketing
    if (analytics.googleAdWordsRemarketing.trackingID) {
      scripts.push({
        type: 'application/javascript',
        src: `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAdWordsRemarketing.trackingID}`,
        async: true
      })
      scripts.push({
        type: 'application/javascript',
        innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments)};
gtag('js', new Date());
gtag('config', '${analytics.googleAdWordsRemarketing.trackingID}');`
      })
    }

    // Agile CRM
    if (analytics.agileCrm.trackingID && analytics.agileCrm.domain) {
      scripts.push({
        type: 'text/javascript',
        src: `https://${analytics.agileCrm.domain}.agilecrm.com/stats/min/agile-min.js`,
        async: true,
        id: '_agile_min_js'
      })
      if (analytics.agileCrm.useWebRules) {
        scripts.push({
          type: 'text/javascript',
          innerHTML: `var Agile_API = Agile_API || {}; Agile_API.on_after_load = function(){
_agile.set_account('${analytics.agileCrm.trackingID}', '${analytics.agileCrm.domain}');
_agile.track_page_view();
_agile_execute_web_rules();};`
        })
      } else {
        scripts.push({
          type: 'text/javascript',
          innerHTML: `var Agile_API = Agile_API || {}; Agile_API.on_after_load = function(){
_agile.set_account('${analytics.agileCrm.trackingID}', '${analytics.agileCrm.domain}');
_agile.track_page_view();};`
        })
      }
    }
  }
}

function applyCssVars (state, meta, styles, scripts, noscript, cssVars) {
  const vars = Object.keys(cssVars).reduce((acc, key) => (acc + `--${key}: ${cssVars[key]}; `), ' ').trim()
  styles.push({
    cssText: `:root { ${vars} }`,
    type: 'text/css'
  })
}

function applySocial (state, meta, styles, scripts, noscript) {
  const { page, config, website } = state
  const imageUrl = page.metaInfo.imageUrl || website.config.display.thumbnailUrl || website.config.display.logoUrl

  // Facebook

  meta.push({
    vmid: 'og:url',
    property: 'og:url',
    content: config.requestUrl
  })
  meta.push({
    vmid: 'og:type',
    property: 'og:type',
    content: 'website'
  })
  meta.push({
    vmid: 'og:title',
    property: 'og:title',
    content: page.metaInfo.title
  })
  meta.push({
    vmid: 'og:description',
    property: 'og:description',
    content: page.metaInfo.description
  })
  meta.push({
    vmid: 'og:image',
    property: 'og:image',
    content: imageUrl
  })

  // Twitter

  meta.push({
    vmid: 'twitter:card',
    name: 'twitter:card',
    content: 'summary'
  })
  meta.push({
    vmid: 'twitter:title',
    name: 'twitter:title',
    content: page.metaInfo.title
  })
  meta.push({
    vmid: 'twitter:description',
    name: 'twitter:description',
    content: page.metaInfo.description
  })
  meta.push({
    vmid: 'twitter:url',
    name: 'twitter:url',
    content: config.requestUrl
  })
  meta.push({
    vmid: 'twitter:image',
    name: 'twitter:image',
    content: imageUrl
  })


  // schema
  let bizSchema = {
    '@context' : 'http://schema.org',
    '@type': 'LocalBusiness',
    'name': website.config.office.officeName,
    'image': imageUrl,
    'telephone': website.config.office.phone,
    'email': website.config.office.email
  }
  if (website.config.office.address) {
    bizSchema.address = {
      "@context" : "http://schema.org",
      "@type" : "PostalAddress",
      'streetAddress': website.config.office.address,
      'addressLocality' : website.config.office.city,
      'addressRegion': website.config.office.provinceCode,
      'postalCode': website.config.office.postalCode
    }
  }
  scripts.push({
    innerHTML: JSON.stringify(bizSchema),
    type: 'application/ld+json'
  })
}

function makeMetaInfo (state, cssVars) {
  const { page, website } = state

  if (!website) return {}
  if (!page) return {}

  const meta = []
  const styles = []
  const scripts = []
  const noscript = []

  applySocial(state, meta, styles, scripts, noscript)
  applyCssVars(state, meta, styles, scripts, noscript, cssVars)
  applyAnalytics(state, meta, styles, scripts, noscript)

  const fonts = website.theme.fonts

  let description = {}

  if (page.slug !== 'blog-post') {
    description = { vmid: 'description', name: 'description', content: page.metaInfo.description }
  }


  let classes = []
  if (website.config.setup.bodyClasses) classes = website.config.setup.bodyClasses.trim().split(' ')
  if (website.theme.dark) classes.push('rm-dark-website')
  classes.push('page-' + state.config.pageID)
  const bodyClasses = classes.join(' ')
  const htmlStyles = Object.keys(cssVars).reduce((acc, key) => (acc + `--${key}: ${cssVars[key]}; `), ' ').trim()

  return {
    title: page.metaInfo.title,
    titleTemplate: `%s | ${website.config.display.siteName}`,
    htmlAttrs: {
      style: `${htmlStyles}`,
      lang: 'en'
    },
    bodyAttrs: {
      class: `${bodyClasses}`
    },
    meta: [
      description,
      ...meta
    ],
    style: [
      { cssText: website.config.setup.css, type: 'text/css' },
      { cssText: `@import url('//fonts.googleapis.com/css?family=${fonts.body.family}:${fonts.body.weights}|${fonts.title.family}:${fonts.title.weights}&display=swap')`, type: 'text/css' },
      ...styles
    ],
    script: [
      ...scripts
    ],
    noscript: [
      ...noscript
    ]
  }
}

export default makeMetaInfo
