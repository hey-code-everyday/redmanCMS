# Page Builder API

_This API is intended for external developers/designers who need to interact with the Page Builder. It is not intended for use within the source code._


# Body Classes

A class that corresponds to the page slug is added to every page. For example, the `index` or home page will have a body class of `page-index`, and a page with the slug `about-me` will have a body class of `page-about-me`.


### Custom Body Classes

Currently there is no built-in way to modify body classes in Page Builder. However, using the Page API, you can add them through JavaScript. Example:

```javascript
window.addEventListener('before-mount', function (event) {
    var page = event.detail.page
    if (page.ID === 'index') {
      document.body.classList.add('some-class')
    }
})
```


# Custom Events

Page Builder exposes several [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) that can be hooked into using `window.addEventListener`. The payload of each event can be accessed through `event.detail` and every payload contains an instance of the PageAPI. The payload also includes an optional `data` field, although not all events implement this field.


### before-mount
* **Triggers:** After the App is mounted to the DOM, but before the App's mounted features are initialized.
* **Payload:** `page (PageAPI)`\*
* **Usage:**

```javascript
window.addEventListener('before-mount', function (event) {
    var page = event.detail.page
})
```

This event only fires once on page load.
\* See section on the PageAPI for more details.


### mount
* **Triggers:** After the App is mounted to the DOM and fully initialized.
* **Payload:** `page (PageAPI)`
* **Usage:**

```javascript
window.addEventListener('mount', function (event) {
    var page = event.detail.page
})
```

This event only fires once on page load.


### strap-mount
* **Triggers:** After a Strap has been mounted to the DOM.
* **Payload:** `page (PageAPI)`, `data (Object)`
* **Payload Data:** `component (VueComponent)`, `name (String)`*
* **Usage:**

```javascript
window.addEventListener('strap-mount', function (event) {
    var data = event.detail.data
    var name = data.name
    var component = data.component
    if (name === 'StrapText') {
        component.$el.classList.add('some-class')
    }
})
```

This event only fires once on page load.
\* `name` refers to the Vue component name of the Strap.


### strap-update
* **Triggers:** After a Strap's elements have been changed and the DOM updated.
* **Payload:** `page (PageAPI)`, `data (Object)`
* **Payload Data:** `component (VueComponent)`, `name (String)`
* **Usage:**

```javascript
window.addEventListener('strap-update', function (event) {
    var data = event.detail.data
    var name = data.name
    var component = data.component
    if (name === 'StrapText') {
        component.$el.classList.add('some-class')
    }
})
```

This event will fire anytime the Strap's elements have changed.


### [StrapName]-mount
* **Triggers:** After a Strap has been mounted to the DOM.
* **Payload:** `page (PageAPI)`
* **Payload Data:** `component (VueComponent)`
* **Usage:**

```javascript
window.addEventListener('StrapText-mount', function (event) {
    var data = event.detail.data
    var component = data.component
    component.$el.classList.add('some-class')
})
```

Replace [StrapName] with the Strap's Vue component name. This event only fires once on page load.


### [StrapName]-update
* **Triggers:** After a Strap's elements have been changed and the DOM updated.
* **Payload:** `page (PageAPI)`
* **Payload Data:** `component (VueComponent)`
* **Usage:**

```javascript
window.addEventListener('StrapText-update', function (event) {
    var data = event.detail.data
    var component = data.component
    component.$el.classList.add('some-class')
})
```

This event will fire anytime the Strap's elements have changed.


### [StrapID]-mount
* **Triggers:** After a Strap has been mounted to the DOM.
* **Payload:** `page (PageAPI)`
* **Payload Data:** `component (VueComponent)`
* **Usage:**

```javascript
window.addEventListener('8bdc6818-7d21-4fb8-9cc4-ebe9c7919669-mount', function (event) {
    var data = event.detail.data
    var component = data.component
    component.$el.classList.add('some-class')
})
```

Replace [StrapID] with the Strap's unique ID. This event only fires once on page load.


### [StrapID]-update
* **Triggers:** After a Strap's elements have been changed and the DOM updated.
* **Payload:** `page (PageAPI)`
* **Payload Data:** `component (VueComponent)`
* **Usage:**

```javascript
window.addEventListener('8bdc6818-7d21-4fb8-9cc4-ebe9c7919669-update', function (event) {
    var data = event.detail.data
    var component = data.component
    component.$el.classList.add('some-class')
})
```

This event will fire anytime the Strap's elements have changed.


# PageAPI

Included in the event payload of every Custom Event is a reference to the PageAPI. The PageAPI provides access to Page Builder's store, palettes, configuration, components and more.


### app
* **Type:** `VueComponent`
* **Usage:**

```javascript
console.log(page.app.$el) // [div id="phoenix" class="rm-page-builder"]
```

Provides a reference to the main App [component](https://vuejs.org/v2/guide/components.html).


### store
* **Type:** `Object`
* **Usage:**

```javascript
console.log(page.store.state.config.spaceID) // 'rwp-2172'
```

Provides a reference to the App's [store](https://vuex.vuejs.org/).


### ID
* **Type:** `String`
* **Usage:**

```javascript
console.log(page.ID) // 'listing-details'
```

The current page ID.


### color
* **Type:** `Function`
* **Usage:**

```javascript
var color = page.color('#7743CE').alpha(0.5).lighten(0.5)
console.log(color.hsl().string()) // 'hsla(262, 59%, 81%, 0.5)
```

Provides a reference to a [colour manipulation tool](https://www.npmjs.com/package/color).


### websiteConfig
* **Type:** `Object`
* **Usage:**

```javascript
var config = page.websiteConfig
console.log(config.display.siteName) // 'My Redman Site'
console.log(config.office.email) // 'my@redmantech.ca'
```

Provides a reference to the [website configuration](https://gitlab.rmcloud.com/npm-modules/grandcentral-station/blob/leader/lib/schemas/componentConfig/Website.js).


### $ (selector[, parent])
* **Arguments:**
    * `selector (String)`
    * `parent (VueComponent | Array)` [optional]
* **Returns:** An array of Vue components.
* **Usage:**

```javascript
var straps = page.$('AppStrap')
...
var hero = page.$('#strap-hero')[0]
var editableButtons = page.$('EditableButton', hero)
```

The `selector` argument must be either the name of a Vue component (which you can find by looking in the source, eg, `EditableImage`) or an ID (eg. `#strap-264a65d9-8d9a-45ca-8589-e73832e3944b`).


### palette (paletteName)
* **Arguments:**
    * `paletteName (String)`
* **Returns:** An object with the palette values.
* **Usage:**

```javascript
var defaultPalette = page.palette('default')
console.log(defaultPalette.uiPrimary.bgColor) // '#D10A53'
```

This method provides a short-cut to access the four theme palettes. Valid strings for `paletteName` are `header`, `default`, `feature`, and `alternate`.


### strapPalette (strap)
* **Arguments:**
    * `strap (VueComponent)`
* **Returns:** An object with the palette values for that strap.
* **Usage:**

```javascript
var strap = page.$('#strap-264a65d9-8d9a-45ca-8589-e73832e3944b')[0]
var palette = page.strapPalette(strap)
console.log(palette.uiPrimary.bgColor) // '#D10A53'
```


# The Strap Component

Strap components are regular [Vue component instances](https://vuejs.org/v2/guide/instance.html). Because it is a Vue component instance, all of its properties, data and methods are exposed through the object. For instance, if you need to access the straps `state`, you can access it through `strap.state`. Below is a list of a few important properties of the Strap component. For additional information about Strap components, please [view the source](https://gitlab.rmcloud.com/redman-frontend/page-builder/blob/master/src/components/AppStrap.vue).


### strap.config
* **Type:** `Object`
* **Usage:**

```javascript
var component = page.$('AppStrap')[0]
var config = component.strap.config
console.log(config.hidden) // 'false'
```

The [configuration object](https://gitlab.rmcloud.com/redman-frontend/page-builder/blob/master/src/store/defaults/strap.js#L22) for a Strap.


### strap.state
* **Type:** `Object`
* **Usage:**

```javascript
var component = page.$('AppStrap')[0]
var state = component.strap.state
console.log(state.text.html) // '[p]Hello, world![/p]'
```
The [state object](https://gitlab.rmcloud.com/redman-frontend/page-builder/blob/master/src/components/straps/StrapText.vue#L48) for a Strap.


# CSS Variables

Page builder exposes a number of dynamically assigned CSS variables to use both in development and in external styles.
These variables, with a few exceptions, directly map to the palette variables as defined in the website configuration.


### List of Available Variables


##### Fonts

| CSS Variable                    | Palette Key                   |  | 
|---------------------------------|-------------------------------|--| 
| --fonts-body-family             | fonts.body.family             |  | 
| --fonts-body-weight             | fonts.body.weight             |  | 
| --fonts-body-style              | --                            | Either 'inherit', or 'italic', depending on font choice. | 
| --fonts-title-family            | fonts.title.family            |  | 
| --fonts-title-weight            | fonts.title.weight            |  | 
| --fonts-title-style             | --                            | Either 'inherit', or 'italic', depending on font choice. | 


##### Header

| CSS Variable                    | Palette Key                   |  | 
|---------------------------------|-------------------------------|--| 
| --header-text                   | header.text                   |  | 
| --header-linkText               | header.linkText               |  | 
| --header-titleText              | header.titleText              |  | 
| --header-bgColor                | header.bgColor                |  | 
| --header-brandBgColor           | header.brandBgColor           |  | 
| --header-brandBgColor2          | header.brandBgColor2          |  | 
| --header-brandText              | header.brandText              |  | 
| --header-textShadow             | header.textShadow             |  | 


##### Default Palette

| CSS Variable                    | Palette Key                   |  | 
|---------------------------------|-------------------------------|--| 
| --default-text                  | default.text                  |  | 
| --default-text-rgb              | --                            | String in the format of `r, g, b`.* | 
| --default-linkText              | default.linkText              |  | 
| --default-titleText             | default.titleText             |  | 
| --default-bgColor               | default.bgColor               |  | 
| --default-accentColor           | default.accentColor           |  | 
| --default-overlayAlpha          | default.overlayAlpha          |  | 
| --default-overlayAngle          | default.overlayAngle          |  | 
| --default-uiPrimary-text        | default.uiPrimary.text        |  | 
| --default-uiPrimary-bgColor     | default.uiPrimary.bgColor     |  | 
| --default-uiSecondary-text      | default.uiSecondary.text      |  | 
| --default-uiSecondary-bgColor   | default.uiSecondary.bgColor   |  | 


##### Feature Palette

| CSS Variable                    | Palette Key                   |  | 
|---------------------------------|-------------------------------|--| 
| --feature-text                  | feature.text                  |  | 
| --feature-text-rgb              | --                            | String in the format of `r, g, b`.* | 
| --feature-linkText              | feature.linkText              |  | 
| --feature-titleText             | feature.titleText             |  | 
| --feature-bgColor               | feature.bgColor               |  | 
| --feature-accentColor           | feature.accentColor           |  | 
| --feature-overlayAlpha          | feature.overlayAlpha          |  | 
| --feature-overlayAngle          | feature.overlayAngle          |  | 
| --feature-uiPrimary-text        | feature.uiPrimary.text        |  | 
| --feature-uiPrimary-bgColor     | feature.uiPrimary.bgColor     |  | 
| --feature-uiSecondary-text      | feature.uiSecondary.text      |  | 
| --feature-uiSecondary-bgColor   | feature.uiSecondary.bgColor   |  | 


##### Alternate Palette

| CSS Variable                    | Palette Key                   |  | 
|---------------------------------|-------------------------------|--| 
| --alternate-text                | alternate.text                |  | 
| --alternate-text-rgb            | --                            | String in the format of `r, g, b`.* | 
| --alternate-linkText            | alternate.linkText            |  | 
| --alternate-titleText           | alternate.titleText           |  | 
| --alternate-bgColor             | alternate.bgColor             |  | 
| --alternate-accentColor         | alternate.accentColor         |  | 
| --alternate-overlayAlpha        | alternate.overlayAlpha        |  | 
| --alternate-overlayAngle        | alternate.overlayAngle        |  | 
| --alternate-uiPrimary-text      | alternate.uiPrimary.text      |  | 
| --alternate-uiPrimary-bgColor   | alternate.uiPrimary.bgColor   |  | 
| --alternate-uiSecondary-text    | alternate.uiSecondary.text    |  | 
| --alternate-uiSecondary-bgColor | alternate.uiSecondary.bgColor |  | 

\* You can use RGB strings like so: `rgba(var(--alternate-text-rgb), 0.5)`


# Useful Scripts & CSS

### Forced Registration After Viewing 3 Listings

This script will display a forced client login after 3 (customizable) views of the listing details page.

```css
/* CSS */

.force-registration .gus-layer-panel--auth .modal-background {
  pointer-events: none;
}

.force-registration .gus-layer-panel--auth .auth__close {
  display: none;
}
```

```javascript
/* JavaScript */

window.addEventListener('before-mount', function (e) {
  var page = e.detail.page
  var store = page.store
  var viewLimit = 3

  if (!store.getters.clientAuthenticated && page.ID === 'listing-details') {
    var numViews = Number(localStorage.getItem('numViews') || 0)

    if (numViews >= viewLimit) {
      store.commit('SHOW_AUTH')
      document.body.classList.add('force-registration')
    }

    numViews++

    localStorage.setItem('numViews', numViews)
  }

  if (store.getters.clientAuthenticated) {
    localStorage.setItem('numViews', 0)
  }
})
```

### Force Registration if the URL contains a certain string

This script will display a forced client login if viewing a page where the URL contains a certain string.

```css
/* CSS */

.force-registration .gus-layer-panel--auth .modal-background {
  pointer-events: none;
}

.force-registration .gus-layer-panel--auth .auth__close {
  display: none;
} 
```

```js
// JavaScript

window.addEventListener('before-mount', function (e) {
  var visible = false
  var page = e.detail.page
  var store = page.store
  var urlFragment = 'search/p/single-family'
  
  function checkPage () {
    if (!store.getters.clientAuthenticated) {
      if (window.location.href.includes(urlFragment)) {
        if (!visible) {
          visible = true
          store.commit('SHOW_AUTH')
          document.body.classList.add('force-registration')
        }
      } else {
        if (visible) {
          visible = false
          store.commit('HIDE_AUTH')
          document.body.classList.remove('force-registration')
        }
      }
    }
  }
  checkPage()

  setInterval(checkPage, 200)
})
```
### Force Registration if the URL contains a certain string (both search results and details pages)
```
window.addEventListener('before-mount', function (e) {
  var visible = false
  var page = e.detail.page
  var store = page.store
  var urlFragment = 'for-sale'
  var urlFragment2 = 'search'
  
  function checkPage () {
    if (!store.getters.clientAuthenticated) {
      if (window.location.href.includes(urlFragment) || window.location.href.includes(urlFragment2)) {
        if (!visible) {
          visible = true
          store.commit('SHOW_AUTH')
          document.body.classList.add('force-registration')
        }
      } else {
        if (visible) {
          visible = false
          store.commit('HIDE_AUTH')
          document.body.classList.remove('force-registration')
        }
      }
    }
  }
  checkPage()

  setInterval(checkPage, 200)
})
```

### Inject a Favicon

Injects a favicon into the page.

```javascript
window.addEventListener('before-mount', function () {
  var linkTag = document.createElement('link')
  linkTag.setAttribute('rel', 'shortcut icon')
  linkTag.setAttribute('href', '//s3.amazonaws.com/ddf-photos.redmantech.ca/rwp-XXXX/original/favicon.png')
  document.head.appendChild(linkTag)
})
```
