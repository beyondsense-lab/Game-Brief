import { marked } from 'marked';
marked.use({gfm:true,breaks:false});
export const renderMarkdown=(content:string)=>marked.parse(content||'');
