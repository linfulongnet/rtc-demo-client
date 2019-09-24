module.exports = {
  presets: [
    ['@vue/app', { useBuiltIns: 'entry' }],
    '@babel/preset-env'
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import'
  ]
}
