#!/usr/bin/env node

const path = require('path')
const _ = require('lodash')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const sortPackageJson = require('sort-package-json')

const questions = [
  {
    type: 'input',
    name: 'project',
    message: '项目名称',
  },
  {
    type: 'list',
    name: 'ui',
    message: '选择 ui 框架',
    choices: ['antd', 'antd-mobile'],
  }
]

inquirer.prompt(questions).then(answers => {
  const { project, ui } = answers
  const targetDir = path.resolve(project)
  const type = { 'antd': 'ant', 'antd-mobile': 'am' }[ui]
  setBase(targetDir, type)
  console.log('copy template success!')
})

function setBase(targetDir, type = 'am') {
  fs.copySync(path.join(__dirname, './template'), targetDir)
  fs.copySync(path.join(__dirname, type === 'am' ? './am-view' : './antd-view'), targetDir, {
    filter: (view, target) => {
      if (/(component|utils|store)\/index\.js$/.test(view)) {
        const code = fs.readFileSync(target, 'utf-8') + fs.readFileSync(view, 'utf-8')
        fs.writeFileSync(target, code)
        return false
      } else if (/package\.json$/.test(view)) {
        const add_package = require(view)
        const target_package = require(target)
        Object.assign(target_package.dependencies, add_package.dependencies)
        fs.writeFileSync(target, JSON.stringify(sortPackageJson(target_package), null, 2))
        return false
      } else if (/babelrc/.test(view)) {
        const obj = _.mergeWith(
          JSON.parse(fs.readFileSync(target, 'utf-8')),
          JSON.parse(fs.readFileSync(view, 'utf-8')),
          (a, b) => _.isArray(a) && a.concat(b)
        )
        fs.writeFileSync(target, JSON.stringify(obj, null, 2))
        return false
      }
      return true
    }
  })
  fs.copySync(path.join(__dirname, 'README.md'), path.join(targetDir, 'README.md'))
}
