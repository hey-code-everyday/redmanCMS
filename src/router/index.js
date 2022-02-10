import Vue from 'vue'
import Router from 'vue-router'
import AppPage from '@/components/AppPage'
import internalRoutes from '@/router/internal-routes'
import AppPagePrivacy from '@/components/AppPagePrivacy'
import AppPageDisclaimer from '@/components/AppPageDisclaimer'
import AppPageAdminLogin from '@/components/AppPageAdminLogin'
import MobileHeaderHome from '@/components/headers/MobileHeaderHome'
import MobileHeaderSearch from '@/components/headers/MobileHeaderSearch'
import MobileFooterSearch from '@/components/footers/MobileFooterSearch'
import MobileFooterDetails from '@/components/footers/MobileFooterDetails'
import MobileHeaderInterior from '@/components/headers/MobileHeaderInterior'

Vue.use(Router)

export default function (config) {
  /* eslint-disable no-new */
  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: AppPage,
        meta: {
          pageID: 'index',
          pageType: 'home',
          mobileHeader: MobileHeaderHome
        }
      },

      // Admin

      {
        path: '/access',
        name: 'AdminLogin',
        component: AppPageAdminLogin,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },

      // Details

      {
        path: '/for-sale/:slug',
        name: 'PageForSale',
        component: AppPage,
        meta: {
          pageID: 'listing-details',
          pageType: 'details',
          mobileHeader: MobileHeaderInterior,
          mobileFooter: MobileFooterDetails
        }
      },
      {
        path: '/for-lease/:slug',
        name: 'PageForLease',
        component: AppPage,
        meta: {
          pageID: 'listing-details',
          pageType: 'details',
          mobileHeader: MobileHeaderInterior,
          mobileFooter: MobileFooterDetails
        }
      },
      {
        path: '/sold/:slug',
        name: 'PageSold',
        component: AppPage,
        meta: {
          pageID: 'sold-details',
          pageType: 'details',
          mobileHeader: MobileHeaderInterior,
          mobileFooter: MobileFooterDetails
        }
      },

      // Search
      {
        path: '/search',
        name: 'PageSearchRoot',
        component: AppPage,
        meta: {
          pageID: 'listing-search',
          pageType: 'search',
          mobileHeader: MobileHeaderSearch,
          mobileFooter: MobileFooterSearch
        }
      },
      {
        path: '/search/*',
        name: 'PageSearch',
        component: AppPage,
        meta: {
          pageID: 'listing-search',
          pageType: 'search',
          mobileHeader: MobileHeaderSearch,
          mobileFooter: MobileFooterSearch
        }
      },
      {
        path: '*?page=*&price=*',
        name: 'PageListingSearch',
        component: AppPage,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },

      // solds
      {
        path: '/solds',
        name: 'PageSearchSolds',
        component: AppPage,
        meta: {
          pageID: 'sold-listing',
          pageType: 'search',
          mobileHeader: MobileHeaderSearch,
          mobileFooter: MobileFooterSearch
        }
      },
      
      // Agent

      {
        path: '/agent/:agent',
        name: 'PageAgentProfile',
        component: AppPage,
        meta: {
          pageID: 'agent-profile',
          mobileHeader: MobileHeaderInterior
        }
      },

      {
        path: '/agents/*',
        name: 'PageAgentSearch',
        component: AppPage,
        meta: {
          pageID: 'agents',
          mobileHeader: MobileHeaderInterior
        }
      },

      // Blog
      // Ignore meta for blog, they're special for some reason

      {
        path: '/blog',
        name: 'PageBlog',
        component: AppPage,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },
      {
        path: '/blog/category/:category',
        name: 'PageBlogCategory',
        component: AppPage,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },
      {
        path: '/blog/:year/:day/:month/:slug',
        name: 'PageBlogPost',
        component: AppPage,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },

      // Static pages

      {
        path: '/' + internalRoutes.all.privacy,
        name: 'PagePrivacy',
        component: AppPagePrivacy,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },
      {
        path: '/' + internalRoutes.all.disclaimer,
        name: 'PageDisclaimer',
        component: AppPageDisclaimer,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      },

      // Default

      {
        path: '/:slug',
        name: 'Page',
        component: AppPage,
        meta: {
          pageType: 'interior',
          mobileHeader: MobileHeaderInterior
        }
      }
    ]
  })

  return router
}
