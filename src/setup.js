const Joi = require('joi')

// the schema that describes the setup options
module.exports = Joi.object().keys({
  spaceID: Joi.string().required(),
  requestUrl: Joi.string(),
  url: Joi.string(),
  pageID: Joi.string().required(),
  requestID: Joi.string().description('a unique id for this render request'),
  requestHeaders: Joi.object().description('key/value pairs of the request headers'),
  grandcentralUrl: Joi.string().uri(),
  conductorUrl: Joi.string().uri(),
  voucherUrl: Joi.string().uri(),
  gusUrl: Joi.string().uri(),
  engineUrl: Joi.string().uri(),
  hypervueUrl: Joi.string().uri()
})

/*
{
  "spaceID": "rwp-2172",
  "requestUrl": "http://localhost:8080/",
  "pageID": "index"
}
*/
