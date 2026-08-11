import { logProvider } from './provider';
const provider=()=>logProvider;
export const sendWelcomeEmail=(to:string)=>provider().send(to,'Welcome to GAME//BRIEF','<p>Thanks for subscribing.</p>');
export const sendConfirmationEmail=(to:string)=>provider().send(to,'Confirm your GAME//BRIEF subscription','<p>Please confirm.</p>');
export const sendUnsubscribeConfirmation=(to:string)=>provider().send(to,'Unsubscribed from GAME//BRIEF','<p>You have been unsubscribed.</p>');
export const sendNewsletter=(to:string,html:string)=>provider().send(to,'GAME//BRIEF',html);
