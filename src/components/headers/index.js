import createAsyncStrapFactory from '../../helpers/async-strap-factory'

export default {
  'header-basic': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-basic" */ './HeaderBasic')),
  'header-glass': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-glass" */ './HeaderGlass')),
  'header-horizon': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-horizon" */ './HeaderHorizon')),
  'header-mulberry': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-mulberry" */ './HeaderMulberry')),
  'header-neo': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-neo" */ './HeaderNeo')),
  'header-vogue': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-vogue" */ './HeaderVogue')),
  'header-vogue-branded': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-vogue-branded" */ './HeaderVogueBranded')),
  'header-vogue-slim': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-vogue-slim" */ './HeaderVogueSlim')),
  'header-columns': createAsyncStrapFactory(() => import(/* webpackChunkName: "header-columns" */ './HeaderColumns'))
}
