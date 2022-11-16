module.exports = {
   extends: ['next', 'turbo', 'prettier'],
   rules: {
      'react/display-name': 'off',
      'import/no-anonymous-default-export': [
         'error',
         {
            allowArrowFunction: true,
         },
      ],
   },
}
