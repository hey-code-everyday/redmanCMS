import Auth0 from 'auth0-js'

const getAuth = config => {
  const ourUrl = btoa(window.location.toString().split('#')[0])
  const state = `space:${config.spaceID}|returnTo:${ourUrl}`
  return new Auth0.WebAuth({
    domain: config.auth0.domain,
    clientID: config.auth0.clientID,
    redirectUri: config.auth0.redirectUrl,
    responseType: 'code',
    state
  })
}

export const login = (config, username, password) => {
  const { spaceID, voucherUrl } = config

  return new Promise((resolve, reject) => {
    fetch(voucherUrl + `login/${spaceID}/standard`, {
      body: JSON.stringify({ username, password }),
      method: 'POST'
    })
    .then((res) => {
      res.json()
      .then((profile) => {
        if (profile.error) return reject(profile)
        resolve(profile)
      })
      .catch((err) => {
        reject(err)
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export const signup = (config, data) => {
  const { spaceID, voucherUrl } = config
  const { email, password, name, phone } = data

  return new Promise((resolve, reject) => {
    fetch(voucherUrl + `signup/${spaceID}/standard`, {
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        agree: true
      }),
      method: 'POST'
    })
    .then((res) => {
      res.json()
      .then((profile) => {
        if (profile.error) return reject(profile)
        resolve(profile)
      })
      .catch((err) => {
        reject(err)
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export const forgotPassword = (config, email) => {
  const auth = getAuth(config)
  return new Promise((resolve, reject) => {
    auth.changePassword({
      connection: 'Username-Password-Authentication',
      email: email
    }, function (err, res) {
      err ? reject(err) : resolve(res)
    })
  })
}
