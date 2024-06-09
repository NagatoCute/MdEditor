const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const openButton = document.getElementById('openButton');
    const saveButton = document.getElementById('saveButton');

    function updatePreview() {
        const markdownText = editor.value;
        const html = marked.parse(markdownText);

        // Temporarily set the innerHTML to parse markdown
        preview.innerHTML = html;

        // Render Mermaid diagrams
        mermaid.init(undefined, preview.querySelectorAll('.language-mermaid'));
    }

    editor.addEventListener('input', updatePreview);

    // Initial call to render any preloaded content
    updatePreview();

    openButton.addEventListener('click', () => {
        ipcRenderer.send('open-file');
    });

    saveButton.addEventListener('click', () => {
        const content = editor.value;
        ipcRenderer.send('save-file', content);
    });

    ipcRenderer.on('file-content', (event, content) => {
        editor.value = content;
        updatePreview();
    });
});
