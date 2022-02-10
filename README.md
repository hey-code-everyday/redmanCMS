# page-builder

> Phoenix Page Builder 3.X

## Getting Started

### NOTE: USE Node 8.x for this project

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

## Building the Project

``` bash
# build server bundle for production
npm run build-server

# build client bundle for production
npm run build
```

## Testing for Production


Do the following fix to your host file one time only.

```bash
sudo su
echo "34.194.66.239 grandcentral.rmcloud.com" >> /etc/host
```

Make sure you have can see https://grandcentral.rmcloud.com


``` bash
# build server bundle for testing
npm run build-local

# in hyperview dir
npm run dev -- --moduleRoot=/Users/ryan/gitlab/redman-frontend/page-builder

# in tesla dir
npm run dev -- --localPageBuilderAssets=/Users/ryan/gitlab/redman-frontend/page-builder/dist-client --defaultSpace=rwp-2172

```

And then visit the page at http://localhost:9195/

no need to restart hyperview or tesla. Just ```npm run build-local``` and reload the page
