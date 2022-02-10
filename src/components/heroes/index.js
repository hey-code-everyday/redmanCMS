import createAsyncStrapFactory from '../../helpers/async-strap-factory'

export default {
  'hero-agent-aside': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-agent-aside" */ './HeroAgentAside')),
  'hero-agent-aside-large': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-agent-aside-large" */ './HeroAgentAsideLarge')),
  'hero-basic': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-basic" */ './HeroBasic')),
  'hero-single-property': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-single-property" */ './HeroSingleProperty')),
  'hero-dual-agent-aside': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-dual-agent-aside" */ './HeroDualAgentAside')),
  'hero-html': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-html" */ './HeroHtml')),
  'hero-html-slider': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-html-slider" */ './HeroHtmlSlider')),
  'hero-separated-search': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-separated-search" */ './HeroSeparatedSearch')),
  'hero-wide-search': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-wide-search" */ './HeroWideSearch')),
  'hero-filter-search': createAsyncStrapFactory(() => import(/* webpackChunkName: "hero-filter-search" */ './HeroFilterSearch')),
}
