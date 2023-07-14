import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { taskPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'

let tasksPage : taskPage

test.beforeEach(({page}) => {
    tasksPage = new taskPage(page)
})

test.describe('cadastro', ()=> {
    test('dever poder cadastrar uma nova tarefa', async ({ page, request }) => {
        const task = data.success as TaskModel
    
        await deleteTaskByHelper(request, task.name)
    
        const tasksPage: taskPage = new taskPage(page)
    
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    
    })

    test('cadastra uma tarefa', async() => {


    })
    
    test('não devepermitir tarefa duplicada', async ({ page, request }) => {
        const task = data.duplicate as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
    
        
    
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    
    })
    
    test('campo obrigatorio', async ({ page }) => {
        const task = data.required as TaskModel
    
        
    
        await tasksPage.go()
        await tasksPage.create(task)
    
        const validationMassage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMassage).toEqual('This is a required field')
    
    })
})

test.describe('atualização', ()=> { 
    test('deve concluir uma tarefa', async ({ page, request }) => {
        const task = data.update as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
    
        
    
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', ()=> { 
    test('deve excluir uma tarefa', async ({ page, request }) => {
        const task = data.delete as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
    
        
    
        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})
