const windowsContainer = document.getElementById('windows')
const desktop = document.getElementById('desktop')
const startBtn = document.getElementById('startBtn')
const startMenu = document.getElementById('startMenu')

let zIndexCounter = 100

const createWindow = app => {
    const existingWin = document.querySelector(`.window[data-app="${app}"]`)
    if (existingWin) {
        bringToFront(existingWin)
        return
    }

    const win = document.createElement('div')
    win.classList.add('window')
    win.dataset.app = app
    win.style.top = '100px'
    win.style.left = '100px'
    win.style.zIndex = ++zIndexCounter

    const header = document.createElement('div')
    header.classList.add('window-header')

    const title = document.createElement('div')
    title.classList.add('window-title')
    title.textContent = app.charAt(0).toUpperCase() + app.slice(1).replace('-', ' ')

    const closeBtn = document.createElement('button')
    closeBtn.classList.add('window-close')
    closeBtn.textContent = '×'
    closeBtn.onclick = () => win.remove()

    header.appendChild(title)
    header.appendChild(closeBtn)
    win.appendChild(header)

    const content = document.createElement('div')
    content.classList.add('window-content')
    win.appendChild(content)

    windowsContainer.appendChild(win)
    makeDraggable(win, header)
    bringToFront(win)

    if (app === 'terminal') loadTerminal(content)
    else if (app === 'file-explorer') loadFileExplorer(content)
}

const bringToFront = win => {
    zIndexCounter++
    win.style.zIndex = zIndexCounter
}

const makeDraggable = (win, header) => {
    let offsetX, offsetY
    let isDown = false

    header.addEventListener('mousedown', e => {
        isDown = true
        const rect = win.getBoundingClientRect()
        offsetX = e.clientX - rect.left
        offsetY = e.clientY - rect.top
        bringToFront(win)
    })

    window.addEventListener('mouseup', () => {
        isDown = false
    })

    window.addEventListener('mousemove', e => {
        if (!isDown) return
        let x = e.clientX - offsetX
        let y = e.clientY - offsetY

        x = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, x))
        y = Math.max(0, Math.min(window.innerHeight - win.offsetHeight - 40, y))

        win.style.left = x + 'px'
        win.style.top = y + 'px'
    })
}

const loadTerminal = container => {
    container.innerHTML = `
    <div id="terminalOutput" style="height: 240px; overflow-y:auto; padding-bottom: 5px;"></div>
    <input id="terminalInput" type="text" autofocus placeholder="Type a command (help for list)" autocomplete="off" />
  `

    const output = container.querySelector('#terminalOutput')
    const input = container.querySelector('#terminalInput')

    const printLine = (text, color = '#0f0') => {
        const div = document.createElement('div')
        div.textContent = text
        div.style.color = color
        output.appendChild(div)
        output.scrollTop = output.scrollHeight
    }

    printLine('Welcome to Virtual Linux Terminal! Type "help" for commands.')

    input.focus()
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase()
            printLine(`$ ${cmd}`, '#0ff')
            input.value = ''

            if (cmd === 'help') printLine('Commands: help, date, clear, about');
            else if (cmd === 'date') printLine(new Date().toString());
            else if (cmd === 'clear') output.innerHTML = '';
            else if (cmd === 'about') printLine('Virtual Linux Terminal');
            else printLine(`Command not found: ${cmd}`, '#f00');
        }
    })
}

const loadFileExplorer = container => {
    container.innerHTML = `
    <p>This is file explorer.</p>
    <ul id="fileList">
      <li>file.txt</li>
      <li>notes.md</li>
      <li>script.js</li>
    </ul>
  `
}

desktop.addEventListener('dblclick', e => {
    const icon = e.target.closest('.icon')
    if (icon) {
        createWindow(icon.dataset.app)
    }
})

startBtn.addEventListener('click', () => {
    startMenu.classList.toggle('hidden')
})

startMenu.addEventListener('click', e => {
    const item = e.target.closest('.startMenuItem')
    if (item) {
        createWindow(item.dataset.app)
        startMenu.classList.add('hidden')
    }
})

window.addEventListener('click', e => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.classList.add('hidden')
    }
})
