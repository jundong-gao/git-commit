#! /usr/bin/env node
/**
 * Created by WebStorm.
 * User: 高俊东
 * Date: 3/22/21
 * Time: 12:40 PM
 */
const types = require('./config')
const inquirer = require('inquirer');
const shell = require('shelljs')
const ora = require('ora')()
const argv = require('yargs').argv
const package = require('./package')
const figlet = require('figlet')
const { spawn } = require('child_process')


// ins()

// async function ins () {
//     console.log('安装依赖');
//     ora.start()
//     let a = await shell.exec('npm install')
//     ora.succeed('安装成功👌')
// }



if(argv.V || argv.v) return ora.succeed(`${package.version}`)
if(argv.h) return console.log(`
  常规操作：
    1) git add .
    2) commit 
    3) git push
`)


console.log(figlet.textSync('GIT COMMIT!', {
    // font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}))



let questions = [
    {type: 'list', name: 'commitType', message: '选择提交类型', choices: types},
    {type: 'input', name: 'editFile', message: '改动的文件'},
    {type: 'input', name: 'commitMessage', message: "修改内容（使用'|'分割换行）",validate: function(res) {
        let done = this.async();
        if (!res) return done('请输入修改内容');
        done(null, true);
    }}
]

inquirer.prompt(questions).then(answers => {
    let msg = `${answers.commitType}`
    answers.editFile ? msg += `(${answers.editFile}): ` : msg += ': '
    let commitMessageArr = answers.commitMessage.split('|')

    if(commitMessageArr.length == 1) msg += `${answers.commitMessage}`

    if(commitMessageArr.length > 1) {
        commitMessageArr.forEach(item => {
            msg += `\n\t${item}`
        })
    }
    confirm(msg)
}).catch(e => {
    console.log(e);
})

function confirm(msg) {
    console.log(`
        ============== 提交内容🐻 ===============
        ${msg}
        =======================================
    `)
    inquirer.prompt([
        {type: 'confirm', 'name': 'gitCommit', message: '提交信息如上⏫ ， 是否提交?'}
    ]).then(ans => {
        ans.gitCommit ? shell.exec(`git commit -m "${msg}"`) :  ora.fail('==已取消提交==')
    }).catch(e => {
        console.log(e)
    })
}
