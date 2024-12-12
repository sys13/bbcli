import handlebars from 'handlebars'

handlebars.registerHelper('curlyOpen', function () {
  return '{'
})

handlebars.registerHelper('curlyClose', function () {
  return '}'
})

export default handlebars
